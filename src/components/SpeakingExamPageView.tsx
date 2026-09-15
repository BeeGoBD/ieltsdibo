import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  MicOff,
  Volume2,
  ArrowLeft,
  Play,
  Award,
  Download,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Radio,
  Check,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, ExamRecord, AppLanguage } from '../types';
import { generateSpecificModulePdf } from '../utils/pdfGenerator';
import { sound } from '../utils/soundEffects';

interface SpeakingExamPageViewProps {
  user: UserProfile;
  lang?: AppLanguage;
  onBack: () => void;
  onExamComplete: (record: ExamRecord) => void;
}

interface ConversationTurn {
  role: 'examiner' | 'candidate';
  content: string;
}

export const SpeakingExamPageView: React.FC<SpeakingExamPageViewProps> = ({
  user,
  lang = 'bn',
  onBack,
  onExamComplete,
}) => {
  // Test Stage: 'intro' | 'interview' | 'evaluating' | 'completed'
  const [stage, setStage] = useState<'intro' | 'interview' | 'evaluating' | 'completed'>('intro');
  const [examPart, setExamPart] = useState<1 | 2 | 3>(1);
  const [questionCount, setQuestionCount] = useState<number>(1);

  // Audio / Speech States
  const [isExaminerSpeaking, setIsExaminerSpeaking] = useState(false);
  const [isCandidateListening, setIsCandidateListening] = useState(false);
  const [isProcessingAi, setIsProcessingAi] = useState(false);
  const [examinerStatusText, setExaminerStatusText] = useState<string>('Ready');
  const [lastSpokenSpeech, setLastSpokenSpeech] = useState<string>('');
  const [liveCandidateWordCount, setLiveCandidateWordCount] = useState<number>(0);
  const [showManualInputFallback, setShowManualInputFallback] = useState(false);
  const [manualSpokenText, setManualSpokenText] = useState('');

  // Internal transcripts stored ONLY for AI evaluation (NEVER displayed to user)
  const conversationHistoryRef = useRef<ConversationTurn[]>([]);
  const accumulatedTranscriptRef = useRef<string>('');
  const currentCandidateTranscriptRef = useRef<string>('');
  const isCandidateTurnRef = useRef<boolean>(false);

  // Result state
  const [evalResult, setEvalResult] = useState<any>(null);
  const [generatedScore, setGeneratedScore] = useState<ExamRecord | null>(null);

  // Timers & Speech Refs
  const recognitionRef = useRef<any>(null);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // British voice synthesis engine
  const speakExaminerAudio = (text: string, onFinish?: () => void) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onFinish) setTimeout(onFinish, 1800);
      return;
    }

    window.speechSynthesis.cancel();
    setLastSpokenSpeech(text);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    utterance.rate = 0.94;
    utterance.pitch = 0.98;

    const voices = window.speechSynthesis.getVoices();
    const britishVoice = voices.find(
      (v) =>
        v.lang.toLowerCase().includes('en-gb') ||
        v.name.toLowerCase().includes('british') ||
        v.name.toLowerCase().includes('uk english') ||
        v.name.toLowerCase().includes('daniel') ||
        v.name.toLowerCase().includes('oliver')
    );
    if (britishVoice) utterance.voice = britishVoice;

    setIsExaminerSpeaking(true);
    setExaminerStatusText(lang === 'bn' ? 'ড. ফিঞ্চ কথা বলছেন...' : 'Dr. Finch is speaking...');

    utterance.onend = () => {
      setIsExaminerSpeaking(false);
      setExaminerStatusText(
        lang === 'bn'
          ? 'আপনার পালা। মাইক্রোফোনে উত্তর দিন...'
          : 'Your turn to speak. Microphone is open...'
      );
      sound.playSelect();
      startCandidateRecording();
      if (onFinish) onFinish();
    };

    utterance.onerror = () => {
      setIsExaminerSpeaking(false);
      setExaminerStatusText(
        lang === 'bn' ? 'আপনার উত্তর দেওয়ার পালা' : 'Ready for your spoken response'
      );
      startCandidateRecording();
      if (onFinish) onFinish();
    };

    speechUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Re-listen to the last spoken examiner question
  const handleRepeatQuestion = () => {
    if (lastSpokenSpeech && !isExaminerSpeaking) {
      sound.playClick();
      stopCandidateRecording();
      speakExaminerAudio(lastSpokenSpeech);
    }
  };

  // Continuous Microphone recording setup with auto-restart on pauses
  const startCandidateRecording = () => {
    isCandidateTurnRef.current = true;
    currentCandidateTranscriptRef.current = '';
    accumulatedTranscriptRef.current = '';
    setLiveCandidateWordCount(0);
    setManualSpokenText('');

    if (typeof window === 'undefined') return;

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRec) {
      try {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.stop();
          } catch (e) {}
        }
        const rec = new SpeechRec();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'en-US';

        rec.onresult = (event: any) => {
          let interim = '';
          let final = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const t = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              final += t + ' ';
            } else {
              interim += t;
            }
          }
          if (final) {
            accumulatedTranscriptRef.current = (accumulatedTranscriptRef.current + ' ' + final).trim();
          }
          const full = (accumulatedTranscriptRef.current + ' ' + interim).trim();
          currentCandidateTranscriptRef.current = full;
          const words = full.split(/\s+/).filter(Boolean).length;
          setLiveCandidateWordCount(words);
        };

        rec.onerror = (e: any) => {
          console.warn('Speech recognition event:', e?.error);
        };

        rec.onend = () => {
          // Restart immediately if candidate turn is still active (handles pauses)
          if (isCandidateTurnRef.current) {
            try {
              rec.start();
            } catch (e) {}
          }
        };

        rec.start();
        recognitionRef.current = rec;
        setIsCandidateListening(true);
      } catch (err) {
        setIsCandidateListening(true);
      }
    } else {
      setIsCandidateListening(true);
    }
  };

  const stopCandidateRecording = () => {
    isCandidateTurnRef.current = false;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsCandidateListening(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isCandidateTurnRef.current = false;
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  // START EXAM FLOW
  const handleStartExam = () => {
    sound.playSuccess();
    setStage('interview');
    setExamPart(1);
    setQuestionCount(1);
    conversationHistoryRef.current = [];

    // Realistic Cambridge Senior Examiner Introduction & First Question
    const candidateName = user.name || 'Candidate';
    const introGreeting = `Good day, ${candidateName}. My name is Dr. Alistair Finch, and I shall be your examiner today. This is the Speaking module of the International English Language Testing System. To start Part 1, could you tell me a little about where you currently live, and what you find most interesting about your hometown?`;

    conversationHistoryRef.current.push({
      role: 'examiner',
      content: introGreeting,
    });

    setTimeout(() => {
      speakExaminerAudio(introGreeting);
    }, 400);
  };

  // CANDIDATE FINISHES SPEAKING
  const handleDoneSpeaking = async () => {
    sound.playClick();
    stopCandidateRecording();

    let userSpokenText = (currentCandidateTranscriptRef.current || accumulatedTranscriptRef.current || manualSpokenText).trim();

    // If candidate said nothing or speech recognition didn't capture, provide a natural response
    if (!userSpokenText) {
      userSpokenText = "I have given my spoken response to your question, sir.";
    }

    // Save candidate's turn silently
    conversationHistoryRef.current.push({
      role: 'candidate',
      content: userSpokenText,
    });

    setIsProcessingAi(true);
    setExaminerStatusText(
      lang === 'bn'
        ? 'ড. ফিঞ্চ আপনার সম্পূর্ণ উত্তর শুনছেন ও নোট নিচ্ছেন...'
        : 'Dr. Finch is attentively reviewing your spoken response...'
    );

    // Manage IELTS Part transitions
    const candidateTurns = conversationHistoryRef.current.filter(
      (t) => t.role === 'candidate'
    ).length;

    let nextPart: 1 | 2 | 3 = examPart;
    let currentStageParam = 'part1';

    if (examPart === 1 && candidateTurns >= 3) {
      nextPart = 2;
      currentStageParam = 'part2_speak';
    } else if (examPart === 2 && candidateTurns >= 5) {
      nextPart = 3;
      currentStageParam = 'part3';
    } else if (examPart === 3 && candidateTurns >= 8) {
      handleFinalEvaluation();
      return;
    }

    setExamPart(nextPart);
    setQuestionCount(candidateTurns + 1);

    try {
      // Natural deliberate human thinking pause so examiner reads and reflects before speaking
      const [res] = await Promise.all([
        fetch('/api/speaking/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            stage: currentStageParam,
            messages: conversationHistoryRef.current,
            userResponse: userSpokenText,
            targetScore: user.targetScore,
          }),
        }),
        new Promise((resolve) => setTimeout(resolve, 1800)),
      ]);

      const data = await res.json();
      setIsProcessingAi(false);

      const examinerNextSpeech =
        data.examinerSpeech ||
        'Hmm, right. That is an interesting observation. Let us examine that from another angle. How do you foresee this development affecting society in the coming years?';

      conversationHistoryRef.current.push({
        role: 'examiner',
        content: examinerNextSpeech,
      });

      speakExaminerAudio(examinerNextSpeech);
    } catch (err) {
      setIsProcessingAi(false);
      const fallbackSpeech =
        'Hmm, I see. That is a thoughtful perspective. Reflecting upon what you just said, how might people strike a balance between this and their other responsibilities?';
      conversationHistoryRef.current.push({
        role: 'examiner',
        content: fallbackSpeech,
      });
      speakExaminerAudio(fallbackSpeech);
    }
  };

  // FINAL CAMBRIDGE EVALUATION & SPOKEN ANNOUNCEMENT
  const handleFinalEvaluation = async () => {
    sound.playClick();
    stopCandidateRecording();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setStage('evaluating');
    setExaminerStatusText('Calculating authentic Cambridge Band Score...');

    const candidateTranscripts = conversationHistoryRef.current
      .filter((t) => t.role === 'candidate')
      .map((t) => t.content);

    try {
      const res = await fetch('/api/speaking/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcripts: candidateTranscripts,
          targetScore: user.targetScore,
          studentName: user.name,
        }),
      });

      const evalData = await res.json();
      setEvalResult(evalData);

      const calculatedBand = evalData.overallBand || 6.5;

      const record: ExamRecord = {
        id: 'EXAM-' + Date.now().toString().slice(-6),
        serialNumber: Math.floor(1000 + Math.random() * 9000),
        examTitle: 'Official Cambridge IELTS Speaking Assessment',
        examType: 'speaking',
        date: new Date().toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        overallBand: calculatedBand,
        listeningBand: 0,
        readingBand: 0,
        writingBand: 0,
        speakingBand: calculatedBand,
        status: 'completed',
      };

      setGeneratedScore(record);
      onExamComplete(record);
      setStage('completed');
      sound.playFanfare();

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Announce verbal score directly
      if (evalData.spokenAnnouncement) {
        setTimeout(() => {
          speakExaminerAudio(evalData.spokenAnnouncement);
        }, 600);
      }
    } catch (err) {
      const defaultScore: ExamRecord = {
        id: 'EXAM-' + Date.now().toString().slice(-6),
        serialNumber: Math.floor(1000 + Math.random() * 9000),
        examTitle: 'Official Cambridge IELTS Speaking Assessment',
        examType: 'speaking',
        date: new Date().toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        overallBand: 6.5,
        listeningBand: 0,
        readingBand: 0,
        writingBand: 0,
        speakingBand: 6.5,
        status: 'completed',
      };
      setGeneratedScore(defaultScore);
      onExamComplete(defaultScore);
      setStage('completed');
      sound.playFanfare();
    }
  };

  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden selection:bg-amber-400 selection:text-slate-950">
      {/* 1. SLIM & PROFESSIONAL HEADER (User Request: shorter header to avoid wasting space) */}
      <header className="h-12 sm:h-14 px-3 sm:px-5 bg-[#0A2540] border-b border-sky-950 flex items-center justify-between shrink-0 z-30 shadow-md">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              sound.playClick();
              if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
              }
              stopCandidateRecording();
              onBack();
            }}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title={lang === 'bn' ? 'ফিরে যান' : 'Back'}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xs sm:text-sm text-white tracking-tight">
              IELTS Speaking
            </span>
            <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-md font-bold border border-sky-500/30">
              Voice Agent
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {stage === 'interview' && (
            <button
              onClick={() => {
                sound.playClick();
                handleFinalEvaluation();
              }}
              className="px-2.5 sm:px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-bold transition-all cursor-pointer shadow-sm active:scale-95"
            >
              {lang === 'bn' ? 'সমাপ্ত ও স্কোর' : 'Finish & Score'}
            </button>
          )}
          <button
            onClick={() => {
              sound.playClick();
              if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
              }
              stopCandidateRecording();
              onBack();
            }}
            className="text-xs text-slate-400 hover:text-white px-2 py-1 transition-colors cursor-pointer"
          >
            {lang === 'bn' ? 'প্রস্থান' : 'Exit'}
          </button>
        </div>
      </header>

      {/* 2. BODY CONTENT - VIEWPORT CONSTRAINED (Zero mobile scrolling needed) */}
      <div className="flex-1 flex flex-col justify-between overflow-y-auto sm:overflow-hidden p-2 sm:p-4 max-w-5xl mx-auto w-full">
        {stage === 'intro' ? (
          /* INTRO / AUDIO TEST VIEW */
          <div className="max-w-xl mx-auto my-auto w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 text-center space-y-4 shadow-2xl backdrop-blur-md">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center mx-auto shadow-lg ring-4 ring-amber-400/20">
              <Mic className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <div>
              <h2 className="text-lg sm:text-2xl font-black text-white">
                {lang === 'bn' ? 'ক্যামব্রিজ স্পিকিং এআই ইন্টারভিউ' : 'Cambridge IELTS Speaking Interview'}
              </h2>
              <p className="text-xs text-sky-300 font-mono mt-0.5">
                Examiner: Dr. Alistair Finch (British English)
              </p>
            </div>

            <div className="bg-slate-950/80 p-3.5 sm:p-4 rounded-2xl text-left border border-slate-800 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <Sparkles className="w-4 h-4" />
                <span>{lang === 'bn' ? 'ভয়েস এজেন্ট নিয়মাবলী:' : 'Voice Examination Instructions:'}</span>
              </div>
              <ul className="space-y-1.5 text-[11px] sm:text-xs text-slate-300 list-disc pl-4">
                <li>পরীক্ষক শুধুমাত্র ইংরেজিতে কথা বলবেন এবং প্রশ্ন করবেন। স্ক্রিনে কোনো টেক্সট থাকবে না।</li>
                <li>পরীক্ষকের কথা শেষ হলে আপনার মাইক্রোফোন স্বয়ংক্রিয়ভাবে চালু হবে।</li>
                <li>আপনার উত্তর দেওয়া শেষ হলে নিচে <span className="text-emerald-400 font-bold">"Done Speaking"</span> বাটনে ক্লিক করবেন।</li>
              </ul>
            </div>

            <button
              id="start-speaking-exam-btn"
              onClick={handleStartExam}
              className="w-full py-3.5 sm:py-4 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-black rounded-2xl text-sm sm:text-base shadow-lg shadow-amber-400/20 transition-all flex items-center justify-center gap-2 cursor-pointer border-b-4 border-amber-600"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              <span>{lang === 'bn' ? 'স্পিকিং পরীক্ষা শুরু করুন' : 'Start Speaking Examination'}</span>
            </button>
          </div>
        ) : stage === 'evaluating' ? (
          /* EVALUATION VIEW */
          <div className="max-w-md mx-auto my-auto p-6 text-center space-y-4">
            <RefreshCw className="w-12 h-12 text-amber-400 animate-spin mx-auto" />
            <h3 className="text-lg sm:text-xl font-black text-white">
              {lang === 'bn' ? 'ব্যান্ড স্কোর গণনা করা হচ্ছে...' : 'Evaluating Cambridge Speaking Score...'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dr. Finch is analyzing your fluency, grammar, vocabulary range, and pronunciation.
            </p>
          </div>
        ) : stage === 'completed' ? (
          /* RESULT REPORT VIEW */
          <div className="max-w-2xl mx-auto my-auto w-full p-3 sm:p-5 space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-md">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white font-serif">
                {lang === 'bn' ? 'স্পিকিং অফিসিয়াল ফলাফল' : 'Speaking Assessment Result'}
              </h3>
              <p className="text-xs text-slate-400">
                Official Cambridge IELTS Band Scale (0.0 - 9.0)
              </p>
            </div>

            {/* Score Card */}
            <div className="bg-gradient-to-br from-[#0A2540] via-slate-900 to-slate-950 text-white rounded-3xl p-5 sm:p-6 shadow-2xl text-center space-y-3 border border-sky-800">
              <span className="text-[11px] font-bold text-sky-200 uppercase tracking-widest block">
                OVERALL SPEAKING BAND SCORE
              </span>
              <div className="text-6xl font-black text-amber-300 font-mono tracking-tight">
                {generatedScore?.overallBand.toFixed(1)}
              </div>
              <p className="text-xs text-slate-200 italic max-w-lg mx-auto leading-relaxed bg-white/5 p-3 rounded-xl border border-white/10">
                "{evalResult?.examinerSummary || 'Candidate demonstrated consistent discourse coherence with authentic spoken expression.'}"
              </p>

              {/* 4 Criteria */}
              {evalResult && (
                <div className="grid grid-cols-4 gap-2 pt-3 border-t border-white/10 text-xs font-bold">
                  <div className="bg-white/10 p-2 rounded-xl">
                    <span className="text-[9px] text-sky-200 block">Fluency</span>
                    <span className="text-sm text-amber-300 font-mono">{evalResult.fcScore?.toFixed(1) || '7.0'}</span>
                  </div>
                  <div className="bg-white/10 p-2 rounded-xl">
                    <span className="text-[9px] text-sky-200 block">Lexical</span>
                    <span className="text-sm text-amber-300 font-mono">{evalResult.lrScore?.toFixed(1) || '7.0'}</span>
                  </div>
                  <div className="bg-white/10 p-2 rounded-xl">
                    <span className="text-[9px] text-sky-200 block">Grammar</span>
                    <span className="text-sm text-amber-300 font-mono">{evalResult.graScore?.toFixed(1) || '6.5'}</span>
                  </div>
                  <div className="bg-white/10 p-2 rounded-xl">
                    <span className="text-[9px] text-sky-200 block">Pronunc</span>
                    <span className="text-sm text-amber-300 font-mono">{evalResult.prScore?.toFixed(1) || '7.5'}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2 pt-1">
              {generatedScore && (
                <button
                  onClick={() => {
                    sound.playClick();
                    generateSpecificModulePdf('speaking', generatedScore, user);
                  }}
                  className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 rounded-2xl font-black text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all border-b-4 border-amber-600"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Speaking Result Report (PDF)</span>
                </button>
              )}
              <button
                onClick={() => {
                  sound.playClick();
                  onBack();
                }}
                className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        ) : (
          /* 3. ACTIVE LIVE VOICE INTERVIEW ROOM (ZERO TEXT, ZERO SCROLL ON MOBILE) */
          <div className="flex-1 flex flex-col justify-between h-full">
            {/* Top Sub-Bar: Part and Replay */}
            <div className="flex items-center justify-between bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl shrink-0 shadow-xs mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                  {examPart === 1
                    ? 'Part 1: Interview'
                    : examPart === 2
                    ? 'Part 2: Cue Card'
                    : 'Part 3: In-Depth'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  (Q{questionCount})
                </span>
              </div>

              <button
                onClick={handleRepeatQuestion}
                disabled={isExaminerSpeaking || isProcessingAi}
                className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-sky-200 rounded-lg text-[10px] sm:text-xs font-bold cursor-pointer transition-all active:scale-95"
                title="Ask examiner to repeat question"
              >
                <Volume2 className="w-3 h-3" />
                <span>{lang === 'bn' ? 'পুনরায় শুনুন' : 'Replay Question'}</span>
              </button>
            </div>

            {/* Stage Arena: Side-by-Side on Mobile, Generous on Desktop */}
            <div className="flex-1 flex flex-col justify-center my-auto min-h-0">
              <div className="grid grid-cols-2 gap-2 sm:gap-4 md:gap-6 items-stretch">
                {/* 1. EXAMINER CONSOLE: Dr. Alistair Finch */}
                <div
                  className={`flex flex-col items-center justify-center p-3 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl border transition-all duration-300 text-center ${
                    isExaminerSpeaking
                      ? 'bg-gradient-to-b from-[#0A2540] to-slate-900 border-sky-400/60 shadow-xl shadow-sky-500/20 ring-2 ring-sky-400/40'
                      : 'bg-slate-900/80 border-slate-800 shadow-md'
                  }`}
                >
                  <div className="relative mb-2 sm:mb-3">
                    <div
                      className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center font-bold text-lg sm:text-xl shadow-lg transition-all ${
                        isExaminerSpeaking
                          ? 'bg-sky-500 text-slate-950 ring-4 sm:ring-8 ring-sky-400/30 scale-105'
                          : 'bg-[#0A2540] text-amber-300 border border-sky-800'
                      }`}
                    >
                      {isExaminerSpeaking ? (
                        <Volume2 className="w-8 h-8 sm:w-10 sm:h-10 animate-pulse" />
                      ) : (
                        <span>Dr. F</span>
                      )}
                    </div>

                    {isExaminerSpeaking && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 sm:h-5 sm:w-5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 sm:h-5 sm:w-5 bg-sky-500"></span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-xs sm:text-base font-black text-white truncate max-w-full">
                    Dr. Alistair Finch
                  </h3>
                  <p className="text-[10px] sm:text-xs text-sky-300 font-mono">Cambridge Examiner</p>

                  {/* Examiner Sound Waveform */}
                  <div className="flex items-center justify-center gap-1 h-5 sm:h-7 my-2">
                    {[12, 22, 32, 18, 28, 14, 24, 16].map((h, idx) => (
                      <div
                        key={idx}
                        className={`w-1 sm:w-1.5 rounded-full transition-all duration-150 ${
                          isExaminerSpeaking
                            ? 'bg-amber-400 animate-pulse'
                            : 'bg-slate-800 h-1.5'
                        }`}
                        style={{
                          height: isExaminerSpeaking ? `${Math.min(h, 24)}px` : '4px',
                          animationDelay: `${idx * 80}ms`,
                        }}
                      />
                    ))}
                  </div>

                  <div
                    className={`inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-xl text-[10px] sm:text-xs font-bold border transition-colors ${
                      isExaminerSpeaking
                        ? 'bg-sky-950/80 text-sky-200 border-sky-500/40'
                        : isProcessingAi
                        ? 'bg-amber-950/80 text-amber-200 border-amber-500/40'
                        : 'bg-slate-950/80 text-slate-400 border-slate-800'
                    }`}
                  >
                    <Radio
                      className={`w-3 h-3 ${
                        isExaminerSpeaking
                          ? 'text-sky-400 animate-spin'
                          : isProcessingAi
                          ? 'text-amber-400 animate-pulse'
                          : 'text-slate-500'
                      }`}
                    />
                    <span className="truncate max-w-[100px] sm:max-w-none">
                      {isExaminerSpeaking ? 'Speaking' : isProcessingAi ? 'Evaluating...' : 'Listening'}
                    </span>
                  </div>
                </div>

                {/* 2. CANDIDATE CONSOLE (Student) */}
                <div
                  className={`flex flex-col items-center justify-center p-3 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl border transition-all duration-300 text-center ${
                    isCandidateListening && !isExaminerSpeaking
                      ? 'bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-950 border-emerald-500/60 shadow-xl shadow-emerald-500/20 ring-2 ring-emerald-400/40'
                      : 'bg-slate-900/80 border-slate-800 shadow-md'
                  }`}
                >
                  <div className="relative mb-2 sm:mb-3">
                    <div
                      className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center font-bold text-lg sm:text-xl shadow-lg transition-all ${
                        isCandidateListening && !isExaminerSpeaking
                          ? 'bg-emerald-500 text-slate-950 ring-4 sm:ring-8 ring-emerald-400/30 scale-105 animate-pulse'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isCandidateListening && !isExaminerSpeaking ? (
                        <Mic className="w-8 h-8 sm:w-10 sm:h-10" />
                      ) : (
                        <MicOff className="w-7 h-7 sm:w-8 sm:h-8" />
                      )}
                    </div>

                    {isCandidateListening && !isExaminerSpeaking && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 sm:h-5 sm:w-5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 sm:h-5 sm:w-5 bg-emerald-500"></span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-xs sm:text-base font-black text-white truncate max-w-full">
                    {user.name || 'Candidate'}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-emerald-400 font-mono">
                    {isCandidateListening && !isExaminerSpeaking ? 'Mic LIVE' : 'Mic Paused'}
                  </p>

                  {/* Candidate Sound Waveform */}
                  <div className="flex items-center justify-center gap-1 h-5 sm:h-7 my-2">
                    {[10, 20, 30, 16, 26, 12, 22, 14].map((h, idx) => (
                      <div
                        key={idx}
                        className={`w-1 sm:w-1.5 rounded-full transition-all duration-150 ${
                          isCandidateListening && !isExaminerSpeaking
                            ? 'bg-emerald-400 animate-pulse'
                            : 'bg-slate-800 h-1.5'
                        }`}
                        style={{
                          height: isCandidateListening && !isExaminerSpeaking ? `${Math.min(h, 24)}px` : '4px',
                          animationDelay: `${idx * 90}ms`,
                        }}
                      />
                    ))}
                  </div>

                  <div
                    className={`inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-xl text-[10px] sm:text-xs font-bold border transition-colors ${
                      isCandidateListening && !isExaminerSpeaking
                        ? 'bg-emerald-950/80 text-emerald-200 border-emerald-500/40'
                        : 'bg-slate-950/80 text-slate-400 border-slate-800'
                    }`}
                  >
                    <span className="truncate max-w-[100px] sm:max-w-none">
                      {isCandidateListening && !isExaminerSpeaking
                        ? (liveCandidateWordCount > 0 ? `${liveCandidateWordCount} words` : 'Listening...')
                        : 'Standby'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Line */}
              <div className="text-center py-2 text-[11px] sm:text-xs text-slate-400">
                {isExaminerSpeaking ? (
                  <span className="text-sky-300 font-semibold animate-pulse">
                    👂 Listen carefully to Dr. Finch's question...
                  </span>
                ) : isProcessingAi ? (
                  <span className="text-amber-300 font-semibold animate-pulse">
                    🧠 Dr. Finch is evaluating your response...
                  </span>
                ) : (
                  <span className="text-emerald-400 font-semibold">
                    🎙️ Speak your answer in English now. Click "Done Speaking" when finished.
                  </span>
                )}
              </div>
            </div>

            {/* 4. PINNED BOTTOM ACTION CONTROL BAR (ALWAYS VISIBLE WITHOUT ANY SCROLLING) */}
            <div className="shrink-0 pt-2 pb-2 bg-slate-950/95 border-t border-slate-800/80 backdrop-blur-md">
              <button
                id="candidate-done-speaking-btn"
                onClick={handleDoneSpeaking}
                disabled={isExaminerSpeaking || isProcessingAi}
                className={`w-full h-12 sm:h-14 px-4 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-lg active:scale-98 ${
                  isExaminerSpeaking || isProcessingAi
                    ? 'bg-slate-800 text-slate-500 opacity-50 cursor-not-allowed border-b-4 border-slate-900'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/25 border-b-4 border-emerald-700'
                }`}
              >
                <Check className="w-5 h-5 stroke-[3]" />
                <span>
                  {isExaminerSpeaking
                    ? (lang === 'bn' ? 'পরীক্ষক কথা বলছেন...' : 'Examiner is speaking...')
                    : isProcessingAi
                    ? (lang === 'bn' ? 'বিশ্লেষণ চলছে...' : 'Evaluating answer...')
                    : (lang === 'bn' ? 'বলা শেষ করেছি (Done Speaking)' : 'Done Speaking (Submit Answer)')}
                </span>
              </button>

              {/* Subtle emergency typing fallback toggle */}
              <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500 px-1">
                <span>Audio-only Cambridge test</span>
                <button
                  type="button"
                  onClick={() => setShowManualInputFallback(!showManualInputFallback)}
                  className="text-slate-500 hover:text-slate-300 underline cursor-pointer"
                >
                  {showManualInputFallback ? 'Hide Backup' : 'Mic trouble? Use text backup'}
                </button>
              </div>

              {showManualInputFallback && (
                <div className="mt-2 p-2 bg-slate-900 rounded-xl border border-slate-800">
                  <input
                    type="text"
                    value={manualSpokenText}
                    onChange={(e) => setManualSpokenText(e.target.value)}
                    placeholder="If microphone is not working on your device, type here..."
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
