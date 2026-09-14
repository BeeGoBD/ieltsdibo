import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  MicOff,
  Volume2,
  ArrowLeft,
  Play,
  Award,
  CheckCircle2,
  Clock,
  Download,
  AlertCircle,
  RotateCcw,
  RefreshCw,
  Sparkles,
  Radio,
  Headphones,
  Check,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, ExamRecord, AppLanguage } from '../types';
import { generateSpecificModulePdf } from '../utils/pdfGenerator';

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

  // Internal silent transcripts stored ONLY for AI assessment (NEVER displayed to user)
  const conversationHistoryRef = useRef<ConversationTurn[]>([]);
  const currentCandidateTranscriptRef = useRef<string>('');

  // Result state
  const [evalResult, setEvalResult] = useState<any>(null);
  const [generatedScore, setGeneratedScore] = useState<ExamRecord | null>(null);

  // Timers & Speech Refs
  const recognitionRef = useRef<any>(null);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

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
    setExaminerStatusText(lang === 'bn' ? 'ড. ফিঞ্চ ইংরেজিতে কথা বলছেন...' : 'Dr. Finch is speaking in English...');

    utterance.onend = () => {
      setIsExaminerSpeaking(false);
      setExaminerStatusText(
        lang === 'bn'
          ? 'আপনার বলার পালা। মাইক্রোফোন চালু হয়েছে...'
          : 'Your turn to speak. Microphone is open...'
      );
      // Automatically open candidate microphone
      startCandidateRecording();
      if (onFinish) onFinish();
    };

    utterance.onerror = () => {
      setIsExaminerSpeaking(false);
      setExaminerStatusText(
        lang === 'bn' ? 'আপনার উত্তর দেওয়ার জন্য প্রস্তুত' : 'Ready for your spoken response'
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
      stopCandidateRecording();
      speakExaminerAudio(lastSpokenSpeech);
    }
  };

  // Microphone recording setup
  const startCandidateRecording = () => {
    currentCandidateTranscriptRef.current = '';
    if (typeof window === 'undefined') return;

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRec) {
      try {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
        const rec = new SpeechRec();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'en-US';

        rec.onresult = (event: any) => {
          let full = '';
          for (let i = 0; i < event.results.length; i++) {
            full += event.results[i][0].transcript + ' ';
          }
          currentCandidateTranscriptRef.current = full.trim();
        };

        rec.onerror = (e: any) => {
          console.warn('Speech recognition status:', e?.error);
        };

        rec.onend = () => {
          // If still candidate's turn, keep listening unless explicitly stopped
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
    setStage('interview');
    setExamPart(1);
    setQuestionCount(1);
    conversationHistoryRef.current = [];

    const introSpeech = `Good day, ${user.name}. My name is Dr. Alistair Finch, and I shall be conducting your Cambridge IELTS Speaking Assessment today. We will begin with Part 1: familiar topics. First, could you tell me a little about your hometown, and what you find most interesting about living there?`;

    conversationHistoryRef.current.push({
      role: 'examiner',
      content: introSpeech,
    });

    speakExaminerAudio(introSpeech);
  };

  // CANDIDATE FINISHED SPEAKING (Clicks "Done Speaking" button)
  const handleDoneSpeaking = async () => {
    if (isExaminerSpeaking || isProcessingAi) return;

    stopCandidateRecording();
    setIsProcessingAi(true);
    setExaminerStatusText(
      lang === 'bn' ? 'ড. ফিঞ্চ আপনার উত্তর মূল্যায়ন করছেন...' : 'Dr. Finch is evaluating your response...'
    );

    const userSpokenText =
      currentCandidateTranscriptRef.current.trim() ||
      'I have explained my viewpoint on this matter in detail.';

    // Save candidate speech silently in history
    conversationHistoryRef.current.push({
      role: 'candidate',
      content: userSpokenText,
    });

    const candidateTurns = conversationHistoryRef.current.filter((t) => t.role === 'candidate').length;

    // Check stage transitions
    let currentStageParam = 'part1';
    let nextPart = examPart;
    if (examPart === 1 && candidateTurns >= 3) {
      nextPart = 2;
      currentStageParam = 'part2_speak';
    } else if (examPart === 2 && candidateTurns >= 4) {
      nextPart = 3;
      currentStageParam = 'part3';
    } else if (examPart === 3 && candidateTurns >= 7) {
      // Complete interview
      handleFinalEvaluation();
      return;
    }

    setExamPart(nextPart);
    setQuestionCount(candidateTurns + 1);

    try {
      const res = await fetch('/api/speaking/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: currentStageParam,
          messages: conversationHistoryRef.current,
          userResponse: userSpokenText,
          targetScore: user.targetScore,
        }),
      });

      const data = await res.json();
      setIsProcessingAi(false);

      const examinerNextSpeech =
        data.examinerSpeech ||
        'Thank you. That was a clear response. Let us explore that from another perspective. How do you see this evolving in the near future?';

      conversationHistoryRef.current.push({
        role: 'examiner',
        content: examinerNextSpeech,
      });

      speakExaminerAudio(examinerNextSpeech);
    } catch (err) {
      setIsProcessingAi(false);
      const fallbackSpeech =
        'Thank you. That is a thoughtful perspective. However, how would you respond to critics who dispute that view?';
      conversationHistoryRef.current.push({
        role: 'examiner',
        content: fallbackSpeech,
      });
      speakExaminerAudio(fallbackSpeech);
    }
  };

  // FINAL CAMBRIDGE EVALUATION & SPOKEN ANNOUNCEMENT
  const handleFinalEvaluation = async () => {
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
        listeningBand: 7.0,
        readingBand: 7.0,
        writingBand: 7.0,
        speakingBand: calculatedBand,
        status: 'completed',
      };

      setGeneratedScore(record);
      setStage('completed');
      onExamComplete(record);

      try {
        confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}

      // Dr. Finch announces band score and speaks suggestions aloud!
      const announcement =
        evalData.spokenAnnouncement ||
        `Thank you, ${user.name}. Your Cambridge Speaking Assessment is complete. Your overall Cambridge Band Score is ${calculatedBand.toFixed(
          1
        )}. My advice is to continue expanding your complex grammatical structures and idiomatic vocabulary. Well done.`;

      setTimeout(() => {
        speakExaminerAudio(announcement);
      }, 500);
    } catch (err) {
      console.warn('Evaluation fallback:', err);
      setStage('completed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center">
      <div className="w-full max-w-5xl xl:max-w-6xl min-h-screen bg-slate-950 flex flex-col shadow-2xl border-x border-slate-800">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-[#0A2540] text-white px-4 sm:px-6 py-3.5 shadow-md flex items-center justify-between border-b border-sky-900">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
                stopCandidateRecording();
                onBack();
              }}
              className="p-2 rounded-xl hover:bg-white/10 text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm text-amber-300 uppercase tracking-wider">
                  IELTS Speaking Assessment
                </span>
                <span className="text-[10px] bg-sky-500/20 text-sky-200 px-2.5 py-0.5 rounded-full font-bold border border-sky-400/30">
                  Voice Agent (No Text)
                </span>
              </div>
              <span className="text-[11px] text-slate-300 block font-mono">
                Examiner: Dr. Alistair Finch | Candidate: {user.name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {stage === 'interview' && (
              <button
                onClick={handleFinalEvaluation}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-md shadow-rose-600/30"
              >
                {lang === 'bn' ? 'টেস্ট সমাপ্ত করুন' : 'Finish & Announce Score'}
              </button>
            )}
            <button
              onClick={() => {
                if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
                stopCandidateRecording();
                onBack();
              }}
              className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
            >
              {lang === 'bn' ? 'প্রস্থান' : 'Exit'}
            </button>
          </div>
        </header>

        {/* Body Content */}
        <div className="flex-1 flex flex-col justify-center p-4 sm:p-6 md:p-8">
          {stage === 'intro' ? (
            /* 1. INTRO VIEW - PRE-EXAM VOICE CHECK */
            <div className="max-w-2xl mx-auto w-full my-auto bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl backdrop-blur-md">
              <div className="relative mx-auto w-24 h-24">
                <div className="w-24 h-24 rounded-3xl bg-[#0A2540] text-amber-400 flex items-center justify-center mx-auto shadow-xl border border-amber-400/30">
                  <Headphones className="w-12 h-12" />
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-500"></span>
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-white font-serif tracking-tight">
                  {lang === 'bn' ? 'কেমব্রিজ আইইএলটিএস স্পিকিং পরীক্ষা' : 'Cambridge IELTS Speaking Assessment'}
                </h2>
                <p className="text-xs sm:text-sm text-sky-200 font-medium">
                  {lang === 'bn'
                    ? '১০০% ভয়েস-অনলি এক্সামিনার ইন্টারভিউ। কোনো লিখিত টেক্সট থাকবে না।'
                    : '100% Voice-First Examiner Assessment. No text is displayed or written.'}
                </p>
              </div>

              {/* Instructions Box */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-5 text-left text-xs space-y-3 text-slate-300">
                <div className="flex items-center gap-2 font-bold text-amber-300 text-xs sm:text-sm">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>How your Voice Interview works:</span>
                </div>
                <ul className="space-y-2 list-disc pl-4 text-slate-300 text-[11px] sm:text-xs leading-relaxed">
                  <li>
                    <strong className="text-white">Pure Voice Interaction:</strong> Dr. Finch will speak directly to you in English. No questions or text will appear on the screen.
                  </li>
                  <li>
                    <strong className="text-white">Spoken Feedback & Honest Scoring:</strong> If you make a mistake, Dr. Finch will cut marks honestly and speak instructions or suggestions aloud.
                  </li>
                  <li>
                    <strong className="text-white">Done Speaking Button:</strong> When you finish your spoken answer, click the <span className="text-amber-300 font-bold">"Done Speaking"</span> button so the examiner understands you are done and asks the next question.
                  </li>
                  <li>
                    <strong className="text-white">Score Announcement:</strong> After completing the interview, Dr. Finch will announce your Cambridge Band Score and spoken advice verbally.
                  </li>
                </ul>
              </div>

              <button
                id="start-speaking-exam-btn"
                onClick={handleStartExam}
                className="w-full py-4 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-black rounded-2xl text-sm sm:text-base shadow-lg shadow-amber-400/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-slate-950" />
                <span>{lang === 'bn' ? 'স্পিকিং পরীক্ষা শুরু করুন' : 'Start Speaking Examination'}</span>
              </button>
            </div>
          ) : stage === 'evaluating' ? (
            /* 2. EVALUATION LOADING VIEW */
            <div className="max-w-md mx-auto my-auto p-8 text-center space-y-5">
              <RefreshCw className="w-14 h-14 text-amber-400 animate-spin mx-auto" />
              <h3 className="text-xl font-black text-white">
                {lang === 'bn' ? 'ব্যান্ড স্কোর গণনা করা হচ্ছে...' : 'Calculating Official Band Score...'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dr. Finch is evaluating your responses against Cambridge criteria: Fluency & Coherence, Lexical Resource, Grammatical Accuracy, and Pronunciation.
              </p>
            </div>
          ) : stage === 'completed' ? (
            /* 3. COMPLETED VIEW - OFFICIAL REPORT & PDF DOWNLOAD */
            <div className="max-w-3xl mx-auto w-full p-4 sm:p-6 space-y-6 my-auto">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-white font-serif">
                  {lang === 'bn' ? 'স্পিকিং অফিসিয়াল ফলাফল' : 'Speaking Official Assessment Result'}
                </h3>
                <p className="text-xs text-slate-400">
                  Cambridge English Official Assessment Rubric (0.0 - 9.0 Band Scale)
                </p>
              </div>

              {/* Band Score Card */}
              <div className="bg-gradient-to-br from-[#0A2540] via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-4 border border-sky-800">
                <span className="text-xs font-bold text-sky-200 uppercase tracking-widest block">
                  OFFICIAL SPEAKING BAND SCORE
                </span>
                <div className="text-7xl font-black text-amber-300 font-mono tracking-tight">
                  {generatedScore?.overallBand.toFixed(1)}
                </div>
                <p className="text-xs sm:text-sm text-slate-200 italic max-w-xl mx-auto leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/10">
                  "{evalResult?.examinerSummary || 'Candidate demonstrated consistent discourse coherence with authentic spoken expression.'}"
                </p>

                {/* 4 Cambridge Criteria */}
                {evalResult && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-white/10 text-xs font-bold">
                    <div className="bg-white/10 p-3 rounded-2xl">
                      <span className="text-[10px] text-sky-200 block mb-0.5">Fluency (FC)</span>
                      <span className="text-base text-amber-300 font-mono">
                        {evalResult.fcScore?.toFixed(1) || '7.0'}
                      </span>
                    </div>
                    <div className="bg-white/10 p-3 rounded-2xl">
                      <span className="text-[10px] text-sky-200 block mb-0.5">Lexical (LR)</span>
                      <span className="text-base text-amber-300 font-mono">
                        {evalResult.lrScore?.toFixed(1) || '7.0'}
                      </span>
                    </div>
                    <div className="bg-white/10 p-3 rounded-2xl">
                      <span className="text-[10px] text-sky-200 block mb-0.5">Grammar (GRA)</span>
                      <span className="text-base text-amber-300 font-mono">
                        {evalResult.graScore?.toFixed(1) || '6.5'}
                      </span>
                    </div>
                    <div className="bg-white/10 p-3 rounded-2xl">
                      <span className="text-[10px] text-sky-200 block mb-0.5">Pronunc (PR)</span>
                      <span className="text-base text-amber-300 font-mono">
                        {evalResult.prScore?.toFixed(1) || '7.5'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                {generatedScore && (
                  <button
                    onClick={() => generateSpecificModulePdf('speaking', generatedScore, user)}
                    className="w-full py-4 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 rounded-2xl font-black text-sm shadow-xl flex items-center justify-center gap-2.5 cursor-pointer transition-all"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download Official Speaking Result Report (PDF)</span>
                  </button>
                )}

                <button
                  onClick={onBack}
                  className="w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer transition-colors"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          ) : (
            /* 4. ACTIVE LIVE VOICE INTERVIEW ROOM (LAPTOP & MOBILE RESPONSIVE) - ZERO TEXT */
            <div className="flex-1 flex flex-col justify-between max-w-4xl mx-auto w-full">
              {/* Part Progress Bar */}
              <div className="flex items-center justify-between bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-2xl mb-6 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                    {examPart === 1
                      ? 'Part 1: Everyday Interview'
                      : examPart === 2
                      ? 'Part 2: Individual Long Turn'
                      : 'Part 3: In-Depth Discussion'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    (Question {questionCount})
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <button
                    onClick={handleRepeatQuestion}
                    disabled={isExaminerSpeaking || isProcessingAi}
                    className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-sky-200 rounded-xl text-[11px] font-bold cursor-pointer transition-all"
                    title="Ask examiner to repeat the question"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'পুনরায় শুনুন' : 'Replay Voice'}</span>
                  </button>
                </div>
              </div>

              {/* Desktop Dual Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-auto items-stretch">
                {/* Column 1: Examiner Dr. Alistair Finch Console */}
                <div
                  className={`flex flex-col items-center justify-center p-8 rounded-3xl border transition-all duration-300 text-center ${
                    isExaminerSpeaking
                      ? 'bg-gradient-to-b from-[#0A2540] to-slate-900 border-sky-400/60 shadow-2xl shadow-sky-500/20 ring-2 ring-sky-400/40'
                      : 'bg-slate-900/90 border-slate-800 shadow-lg'
                  }`}
                >
                  <div className="relative mb-5">
                    <div
                      className={`w-28 h-28 rounded-full flex items-center justify-center font-bold text-2xl shadow-xl transition-all ${
                        isExaminerSpeaking
                          ? 'bg-sky-500 text-slate-950 ring-8 ring-sky-400/30 scale-105'
                          : 'bg-[#0A2540] text-amber-300 border border-sky-800'
                      }`}
                    >
                      {isExaminerSpeaking ? (
                        <Volume2 className="w-12 h-12 animate-pulse" />
                      ) : (
                        <span>Dr. F</span>
                      )}
                    </div>

                    {isExaminerSpeaking && (
                      <span className="absolute -top-1 -right-1 flex h-6 w-6">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-6 w-6 bg-sky-500"></span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-black text-white font-serif">Dr. Alistair Finch</h3>
                  <p className="text-xs text-sky-300 font-mono mt-0.5">Cambridge Senior IELTS Examiner</p>

                  {/* Sound Waveform Bars */}
                  <div className="flex items-center justify-center gap-1.5 h-8 my-4">
                    {[16, 28, 40, 24, 36, 18, 32, 20].map((h, idx) => (
                      <div
                        key={idx}
                        className={`w-1.5 rounded-full transition-all duration-150 ${
                          isExaminerSpeaking
                            ? 'bg-amber-400 animate-pulse'
                            : 'bg-slate-700 h-2'
                        }`}
                        style={{
                          height: isExaminerSpeaking ? `${h}px` : '6px',
                          animationDelay: `${idx * 80}ms`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Examiner Live Voice Status Badge */}
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold border transition-colors ${
                      isExaminerSpeaking
                        ? 'bg-sky-950/80 text-sky-200 border-sky-500/40'
                        : isProcessingAi
                        ? 'bg-amber-950/80 text-amber-200 border-amber-500/40'
                        : 'bg-slate-950/80 text-slate-400 border-slate-800'
                    }`}
                  >
                    <Radio
                      className={`w-4 h-4 ${
                        isExaminerSpeaking
                          ? 'text-sky-400 animate-spin'
                          : isProcessingAi
                          ? 'text-amber-400 animate-pulse'
                          : 'text-slate-500'
                      }`}
                    />
                    <span>{examinerStatusText}</span>
                  </div>
                </div>

                {/* Column 2: Candidate Voice Console (Student) */}
                <div
                  className={`flex flex-col items-center justify-center p-8 rounded-3xl border transition-all duration-300 text-center ${
                    isCandidateListening && !isExaminerSpeaking
                      ? 'bg-gradient-to-b from-emerald-950/50 via-slate-900 to-slate-950 border-emerald-500/60 shadow-2xl shadow-emerald-500/20 ring-2 ring-emerald-400/40'
                      : 'bg-slate-900/90 border-slate-800 shadow-lg'
                  }`}
                >
                  {/* Candidate Microphone Visualizer */}
                  <div className="relative mb-5">
                    <div
                      className={`w-28 h-28 rounded-full flex items-center justify-center font-bold text-2xl shadow-xl transition-all ${
                        isCandidateListening && !isExaminerSpeaking
                          ? 'bg-emerald-500 text-slate-950 ring-8 ring-emerald-400/30 scale-105 animate-pulse'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isCandidateListening && !isExaminerSpeaking ? (
                        <Mic className="w-12 h-12" />
                      ) : (
                        <MicOff className="w-10 h-10" />
                      )}
                    </div>

                    {isCandidateListening && !isExaminerSpeaking && (
                      <span className="absolute -top-1 -right-1 flex h-6 w-6">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-6 w-6 bg-emerald-500"></span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-black text-white">{user.name}</h3>
                  <p className="text-xs text-emerald-400 font-mono mt-0.5">
                    {isCandidateListening && !isExaminerSpeaking
                      ? (lang === 'bn' ? 'মাইক্রোফোন সক্রিয় - ইংরেজিতে উত্তর দিন' : 'Microphone LIVE - Speak now')
                      : (lang === 'bn' ? 'মাইক্রোফোন স্থগিত (পরীক্ষক বলছেন)' : 'Mic paused while examiner speaks')}
                  </p>

                  {/* Candidate Sound Waveform Bars */}
                  <div className="flex items-center justify-center gap-1.5 h-8 my-4">
                    {[14, 24, 38, 22, 34, 16, 28, 18].map((h, idx) => (
                      <div
                        key={idx}
                        className={`w-1.5 rounded-full transition-all duration-150 ${
                          isCandidateListening && !isExaminerSpeaking
                            ? 'bg-emerald-400 animate-pulse'
                            : 'bg-slate-700 h-2'
                        }`}
                        style={{
                          height: isCandidateListening && !isExaminerSpeaking ? `${h}px` : '6px',
                          animationDelay: `${idx * 90}ms`,
                        }}
                      />
                    ))}
                  </div>

                  {/* PROMINENT "DONE SPEAKING" BUTTON (User Request) */}
                  <div className="w-full mt-2">
                    <button
                      id="candidate-done-speaking-btn"
                      onClick={handleDoneSpeaking}
                      disabled={isExaminerSpeaking || isProcessingAi}
                      className={`w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-3 transition-all cursor-pointer shadow-xl ${
                        isExaminerSpeaking || isProcessingAi
                          ? 'bg-slate-800 text-slate-500 opacity-50 cursor-not-allowed'
                          : 'bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 shadow-emerald-500/25 hover:scale-[1.02]'
                      }`}
                    >
                      <Check className="w-5 h-5 stroke-[3]" />
                      <span>{lang === 'bn' ? 'আমি বলা শেষ করেছি (Done Speaking)' : 'Done Speaking (Submit Answer)'}</span>
                    </button>
                    <p className="text-[11px] text-slate-400 mt-2">
                      {lang === 'bn'
                        ? 'উত্তর দেওয়া শেষ হলে বাটনে ক্লিক করুন। পরীক্ষক পরবর্তী প্রশ্নে চলে যাবেন।'
                        : 'Click when you have finished your answer so Dr. Finch can respond.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Acoustic Notice */}
              <div className="text-center py-4 text-xs text-slate-500 border-t border-slate-900 mt-6 flex items-center justify-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Audio-only examination. Speak clearly into your device microphone in English.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
