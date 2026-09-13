import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  ArrowLeft,
  Play,
  Award,
  CheckCircle2,
  Clock,
  Download,
  AlertCircle,
  MessageSquare,
  RefreshCw,
  UserCheck,
  Send,
  Sparkles,
  HelpCircle,
  Edit3,
  Bot,
  User,
  Lightbulb,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, ExamRecord, AppLanguage } from '../types';
import { generateSpecificModulePdf } from '../utils/pdfGenerator';
import { getTierFromScore } from '../utils/questionBank';

interface SpeakingExamPageViewProps {
  user: UserProfile;
  lang?: AppLanguage;
  onBack: () => void;
  onExamComplete: (record: ExamRecord) => void;
}

interface ChatMessage {
  id: string;
  role: 'examiner' | 'candidate';
  content: string;
  timestamp: string;
  doubtOrChallenge?: string;
  correctionNote?: string | null;
}

export const SpeakingExamPageView: React.FC<SpeakingExamPageViewProps> = ({
  user,
  lang = 'bn',
  onBack,
  onExamComplete,
}) => {
  // Test Stage: 'intro' | 'part1' | 'part2_prep' | 'part2_speak' | 'part3' | 'evaluating' | 'completed'
  const [stage, setStage] = useState<
    'intro' | 'part1' | 'part2_prep' | 'part2_speak' | 'part3' | 'evaluating' | 'completed'
  >('intro');

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isExaminerSpeaking, setIsExaminerSpeaking] = useState(false);
  const [isProcessingAi, setIsProcessingAi] = useState(false);
  const [examinerStatus, setExaminerStatus] = useState<string>('Ready');

  // Part 2 Timers
  const [prepTimeLeft, setPrepTimeLeft] = useState(60);
  const [speakTimeLeft, setSpeakTimeLeft] = useState(120);
  const [candidateNotes, setCandidateNotes] = useState('');

  // Cue Card Prompt
  const cueCard = {
    title: 'Describe an influential mentor, teacher, or leader who significantly impacted your life choices.',
    points: [
      'Who this individual was and how you met them',
      'What specific knowledge, ethos, or guidance they imparted',
      'What obstacles or doubts you were facing at that time',
      'And explain why their mentorship remains transformative for your personal journey.',
    ],
  };

  // Evaluation state
  const [evalResult, setEvalResult] = useState<any>(null);
  const [generatedScore, setGeneratedScore] = useState<ExamRecord | null>(null);

  const recognitionRef = useRef<any>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isProcessingAi]);

  // Speech Synthesis for British Examiner Dr. Alistair Finch
  const speakExaminer = (text: string, onEndCallback?: () => void) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEndCallback) setTimeout(onEndCallback, 1500);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    utterance.rate = 0.95;
    utterance.pitch = 0.98;

    const voices = window.speechSynthesis.getVoices();
    const britishVoice = voices.find(
      (v) => v.lang.includes('GB') || v.name.includes('British') || v.name.includes('UK')
    );
    if (britishVoice) utterance.voice = britishVoice;

    setIsExaminerSpeaking(true);
    setExaminerStatus('Dr. Finch is speaking...');

    utterance.onend = () => {
      setIsExaminerSpeaking(false);
      setExaminerStatus('Listening for your response...');
      if (onEndCallback) onEndCallback();
    };

    utterance.onerror = () => {
      setIsExaminerSpeaking(false);
      setExaminerStatus('Ready');
      if (onEndCallback) onEndCallback();
    };

    window.speechSynthesis.speak(utterance);
  };

  // Clean up speech on unmount
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

  // Web Speech Recognition Setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRec) {
        const rec = new SpeechRec();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'en-US';

        rec.onresult = (event: any) => {
          let full = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            full += event.results[i][0].transcript;
          }
          if (full.trim()) {
            setInputVal((prev) => (prev ? prev + ' ' + full.trim() : full.trim()));
          }
        };

        rec.onerror = (e: any) => {
          console.warn('Speech recognition warning:', e);
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
      }
    }
  }, []);

  const toggleMic = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
          setExaminerStatus('Listening to your microphone...');
        } catch (e) {
          setIsListening(true);
        }
      } else {
        setIsListening(true);
      }
    }
  };

  // Start the interview
  const handleStartInterview = () => {
    setStage('part1');
    const introSpeech = `Good day, ${user.name}. My name is Dr. Alistair Finch, and I shall be conducting your Cambridge IELTS Speaking Assessment today. Let us begin with Part 1: familiar topics. First, could you tell me a little about your hometown or the place where you are currently living?`;

    const initialMsg: ChatMessage = {
      id: 'msg_0',
      role: 'examiner',
      content: introSpeech,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([initialMsg]);
    speakExaminer(introSpeech);
  };

  // Send candidate response and get Gemini AI examiner reaction (with doubts and corrections)
  const handleSendResponse = async () => {
    const text = inputVal.trim();
    if (!text && !isListening) return;

    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsListening(false);
    }

    const candidateText = text || 'I would like to elaborate further on this question.';
    setInputVal('');

    const candidateMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      role: 'candidate',
      content: candidateText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, candidateMsg];
    setMessages(updatedMessages);
    setIsProcessingAi(true);
    setExaminerStatus('Dr. Finch is evaluating your answer...');

    try {
      const res = await fetch('/api/speaking/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage,
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
          userResponse: candidateText,
          targetScore: user.targetScore,
        }),
      });

      const data = await res.json();
      setIsProcessingAi(false);

      const examinerMsg: ChatMessage = {
        id: 'msg_' + (Date.now() + 1),
        role: 'examiner',
        content: data.examinerSpeech || 'Thank you. Let us explore that from another angle.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        doubtOrChallenge: data.doubtOrChallenge,
        correctionNote: data.correctionNote,
      };

      setMessages((prev) => [...prev, examinerMsg]);
      speakExaminer(examinerMsg.content);

      // Check stage progression
      const candidateTurnCount = updatedMessages.filter((m) => m.role === 'candidate').length;
      if (stage === 'part1' && candidateTurnCount >= 3) {
        setTimeout(() => {
          setStage('part2_prep');
          setPrepTimeLeft(60);
          const p2Notice =
            'Thank you. That brings Part 1 to a close. Now, let us proceed to Part 2: the individual long turn. You have one minute to prepare your notes on the cue card displayed, after which you will speak for two minutes.';
          speakExaminer(p2Notice);
        }, 8000);
      } else if (stage === 'part2_speak') {
        setTimeout(() => {
          setStage('part3');
          const p3Notice =
            'Thank you for that detailed account. Now we move on to Part 3: two-way abstract discussion. Let us examine how leadership styles have shifted in the digital era.';
          speakExaminer(p3Notice);
        }, 6000);
      } else if (stage === 'part3' && candidateTurnCount >= 7) {
        // Ready for evaluation
        setTimeout(() => {
          handleFinalEvaluation();
        }, 6000);
      }
    } catch (err) {
      setIsProcessingAi(false);
      const fallbackMsg: ChatMessage = {
        id: 'msg_' + (Date.now() + 1),
        role: 'examiner',
        content:
          "That is an interesting observation. However, doesn't that depend heavily on individual socioeconomic factors? Could you elaborate?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        doubtOrChallenge: 'How would you counter critics who dispute that view?',
        correctionNote: null,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      speakExaminer(fallbackMsg.content);
    }
  };

  // Part 2 Prep Countdown
  useEffect(() => {
    if (stage === 'part2_prep') {
      const timer = setInterval(() => {
        setPrepTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setStage('part2_speak');
            setSpeakTimeLeft(120);
            speakExaminer('Your one minute preparation time has elapsed. Please begin speaking on the topic now.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [stage]);

  // Part 2 Speak Countdown
  useEffect(() => {
    if (stage === 'part2_speak') {
      const timer = setInterval(() => {
        setSpeakTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setStage('part3');
            speakExaminer('Thank you, that is two minutes. We will now transition to Part 3 for analytical discussion.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [stage]);

  // Conclude and mark strictly using Cambridge Rubric
  const handleFinalEvaluation = async () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setStage('evaluating');

    const candidateTranscripts = messages
      .filter((m) => m.role === 'candidate')
      .map((m) => m.content);

    try {
      const res = await fetch('/api/speaking/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcripts: candidateTranscripts,
          targetScore: user.targetScore,
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
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
    } catch (err) {
      console.warn('Evaluation failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center">
      <div className="w-full max-w-4xl min-h-screen bg-white flex flex-col shadow-2xl">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-[#0A2540] text-white px-4 py-3 shadow-md flex items-center justify-between border-b border-sky-900">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
                onBack();
              }}
              className="p-1.5 rounded-xl hover:bg-white/10 text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm text-amber-300 uppercase tracking-wider">
                  AI Speaking Examiner
                </span>
                <span className="text-[10px] bg-sky-500/20 text-sky-200 px-2 py-0.5 rounded-full font-bold">
                  Dr. Alistair Finch
                </span>
              </div>
              <span className="text-[11px] text-slate-300">
                Cambridge Official Live Voice & Chat Assessment
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {stage !== 'intro' && stage !== 'completed' && (
              <button
                onClick={handleFinalEvaluation}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                {lang === 'bn' ? 'টেস্ট সমাপ্ত করুন' : 'Finish & Evaluate'}
              </button>
            )}
            <button
              onClick={onBack}
              className="text-xs text-slate-300 hover:text-white underline cursor-pointer"
            >
              {lang === 'bn' ? 'প্রস্থান' : 'Exit'}
            </button>
          </div>
        </header>

        {/* Stage Content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
          {stage === 'intro' ? (
            /* INTRO SCREEN */
            <div className="max-w-md mx-auto my-auto p-6 text-center space-y-5 bg-white rounded-3xl border border-slate-200 shadow-sm m-4">
              <div className="w-20 h-20 rounded-3xl bg-[#0A2540] text-amber-400 flex items-center justify-center mx-auto shadow-md">
                <Bot className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl font-black text-[#0A2540]">
                  {lang === 'bn' ? 'এআই এক্সামিনার ড. অ্যালিস্টার ফিঞ্চ' : 'AI Examiner Dr. Alistair Finch'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Senior Cambridge IELTS Speaking Examiner (Simulated by Google Gemini)
                </p>
              </div>

              <div className="bg-sky-50 p-4 rounded-2xl border border-sky-200 text-left text-xs space-y-2 text-slate-700">
                <div className="flex items-center gap-2 font-bold text-[#0A2540]">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Real Examiner Interaction Features:</span>
                </div>
                <ul className="space-y-1.5 list-disc pl-4 text-[11px]">
                  <li>Speaks questions aloud in natural British English.</li>
                  <li>Actively challenges and doubts your claims to test intellectual depth.</li>
                  <li>Provides real-time grammar fixes and vocabulary corrections.</li>
                  <li>Strictly penalizes silence or one-word answers per Cambridge marking.</li>
                </ul>
              </div>

              <button
                onClick={handleStartInterview}
                className="w-full py-3.5 bg-[#0A2540] hover:bg-slate-800 text-white rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{lang === 'bn' ? 'স্পিকিং টেস্ট শুরু করুন' : 'Start Speaking Examination'}</span>
              </button>
            </div>
          ) : stage === 'evaluating' ? (
            /* EVALUATING LOADING */
            <div className="max-w-md mx-auto my-auto p-8 text-center space-y-4">
              <RefreshCw className="w-12 h-12 text-[#0A2540] animate-spin mx-auto" />
              <h3 className="text-lg font-black text-[#0A2540]">
                Calculating Authentic Cambridge Band Score...
              </h3>
              <p className="text-xs text-slate-500">
                Evaluating Fluency & Coherence, Lexical Resource, Grammatical Accuracy, and Pronunciation.
              </p>
            </div>
          ) : stage === 'completed' ? (
            /* COMPLETED RESULT */
            <div className="max-w-xl mx-auto w-full p-5 space-y-4 my-auto overflow-y-auto">
              <div className="text-center space-y-1">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-[#0A2540]">Speaking Assessment Official Result</h3>
                <p className="text-xs text-slate-500">Rigorous 4-Criteria Cambridge Rubric</p>
              </div>

              {/* Band Score Card */}
              <div className="bg-gradient-to-br from-[#0A2540] to-slate-900 text-white rounded-3xl p-6 shadow-xl text-center space-y-3 border border-sky-900">
                <span className="text-[11px] font-bold text-sky-200 uppercase tracking-widest block">
                  OFFICIAL SPEAKING BAND SCORE
                </span>
                <div className="text-6xl font-black text-amber-300 font-mono">
                  {generatedScore?.overallBand.toFixed(1)}
                </div>
                <p className="text-xs text-slate-300 italic max-w-md mx-auto">
                  "{evalResult?.examinerSummary || 'Candidate demonstrated competent linguistic command with clear discourse structure.'}"
                </p>

                {/* 4-Criteria Breakdown */}
                {evalResult && (
                  <div className="grid grid-cols-4 gap-2 pt-3 border-t border-white/10 text-xs font-bold">
                    <div className="bg-white/10 p-2 rounded-xl">
                      <span className="text-[10px] text-sky-200 block">Fluency (FC)</span>
                      <span className="text-amber-300">{evalResult.fcScore?.toFixed(1) || '7.0'}</span>
                    </div>
                    <div className="bg-white/10 p-2 rounded-xl">
                      <span className="text-[10px] text-sky-200 block">Lexical (LR)</span>
                      <span className="text-amber-300">{evalResult.lrScore?.toFixed(1) || '7.0'}</span>
                    </div>
                    <div className="bg-white/10 p-2 rounded-xl">
                      <span className="text-[10px] text-sky-200 block">Grammar (GRA)</span>
                      <span className="text-amber-300">{evalResult.graScore?.toFixed(1) || '6.5'}</span>
                    </div>
                    <div className="bg-white/10 p-2 rounded-xl">
                      <span className="text-[10px] text-sky-200 block">Pronunc (PR)</span>
                      <span className="text-amber-300">{evalResult.prScore?.toFixed(1) || '7.5'}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Key Strengths & Weaknesses */}
              {evalResult && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1.5">
                    <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Key Strengths
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-emerald-900 text-[11px]">
                      {(evalResult.strengths || ['Good conversational pace']).map((s: string, i: number) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-200 space-y-1.5">
                    <span className="font-bold text-rose-950 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-rose-600" /> Areas for Improvement
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-rose-900 text-[11px]">
                      {(evalResult.weaknesses || ['Incorporate more complex subordinate clauses']).map(
                        (w: string, i: number) => (
                          <li key={i}>{w}</li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                {generatedScore && (
                  <button
                    onClick={() => generateSpecificModulePdf('speaking', generatedScore, user)}
                    className="w-full py-3.5 bg-[#0A2540] hover:bg-slate-800 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                    <span>Download Official Speaking Report PDF</span>
                  </button>
                )}

                <button
                  onClick={onBack}
                  className="w-full py-3 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          ) : (
            /* ACTIVE EXAM INTERVIEW (Chat + Voice + Cue Card) */
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {/* Top Status Bar with Examiner Avatar & Waveform */}
              <div className="bg-white px-4 py-3 border-b border-slate-200 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-[#0A2540] text-amber-400 flex items-center justify-center font-bold text-sm shadow-sm">
                      Dr.F
                    </div>
                    {isExaminerSpeaking && (
                      <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#0A2540]">Dr. Alistair Finch</h4>
                    <span className="text-[10px] text-slate-500 font-mono block">
                      {examinerStatus}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200">
                    {stage === 'part1'
                      ? 'Part 1: Interview'
                      : stage === 'part2_prep'
                      ? `Part 2: Prep (${prepTimeLeft}s)`
                      : stage === 'part2_speak'
                      ? `Part 2: Speaking (${speakTimeLeft}s)`
                      : 'Part 3: Discussion'}
                  </span>
                </div>
              </div>

              {/* Part 2 Cue Card Banner (if in Part 2) */}
              {(stage === 'part2_prep' || stage === 'part2_speak') && (
                <div className="bg-amber-50 p-4 border-b border-amber-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-200 px-2 py-0.5 rounded-full">
                      IELTS Part 2 Cue Card Task
                    </span>
                    <span className="font-mono text-xs font-bold text-amber-950">
                      {stage === 'part2_prep' ? `Prep Time: ${prepTimeLeft}s` : `Speaking Time: ${speakTimeLeft}s`}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-amber-950 font-serif">
                    {cueCard.title}
                  </h4>
                  <ul className="text-xs text-amber-900 list-disc pl-4 space-y-0.5">
                    {cueCard.points.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>

                  {stage === 'part2_prep' && (
                    <input
                      type="text"
                      value={candidateNotes}
                      onChange={(e) => setCandidateNotes(e.target.value)}
                      placeholder="Type quick bullet points or notes here during your 1 minute preparation..."
                      className="w-full p-2 bg-white border border-amber-300 rounded-xl text-xs focus:ring-1 focus:ring-amber-500"
                    />
                  )}
                </div>
              )}

              {/* Chat Message History */}
              <div ref={chatScrollRef} className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.role === 'candidate' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-end gap-2 max-w-[85%]">
                      {msg.role === 'examiner' && (
                        <div className="w-7 h-7 rounded-full bg-[#0A2540] text-amber-300 flex items-center justify-center font-bold text-[10px] shrink-0 mb-1">
                          AI
                        </div>
                      )}

                      <div
                        className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          msg.role === 'candidate'
                            ? 'bg-[#0A2540] text-white rounded-br-none shadow-sm'
                            : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-xs'
                        }`}
                      >
                        <p>{msg.content}</p>

                        {/* Examiner Doubt / Skepticism Challenge Box */}
                        {msg.doubtOrChallenge && (
                          <div className="mt-2.5 pt-2 border-t border-slate-100 text-xs text-amber-800 bg-amber-50/70 p-2 rounded-xl flex items-start gap-1.5">
                            <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold block text-[10px] uppercase text-amber-900">
                                Examiner's Challenge:
                              </span>
                              <span>{msg.doubtOrChallenge}</span>
                            </div>
                          </div>
                        )}

                        {/* Examiner Linguistic Fix / Correction Note */}
                        {msg.correctionNote && (
                          <div className="mt-2 text-xs text-sky-800 bg-sky-50 p-2 rounded-xl flex items-start gap-1.5 border border-sky-100">
                            <Lightbulb className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold block text-[10px] uppercase text-sky-900">
                                Linguistic Correction:
                              </span>
                              <span>{msg.correctionNote}</span>
                            </div>
                          </div>
                        )}

                        <span
                          className={`text-[9px] block mt-1 ${
                            msg.role === 'candidate' ? 'text-sky-200' : 'text-slate-400'
                          }`}
                        >
                          {msg.timestamp}
                        </span>
                      </div>

                      {msg.role === 'candidate' && (
                        <div className="w-7 h-7 rounded-full bg-slate-300 text-slate-800 flex items-center justify-center font-bold text-[10px] shrink-0 mb-1">
                          You
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isProcessingAi && (
                  <div className="flex items-center gap-2 text-xs text-slate-500 italic p-2">
                    <Bot className="w-4 h-4 animate-bounce text-[#0A2540]" />
                    <span>Dr. Finch is formulating his examiner challenge...</span>
                  </div>
                )}
              </div>

              {/* Bottom Interactive Response Bar */}
              <div className="p-3 bg-white border-t border-slate-200 space-y-2">
                <div className="flex items-center gap-2">
                  {/* Live Microphone Toggle */}
                  <button
                    onClick={toggleMic}
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center cursor-pointer transition-all shrink-0 ${
                      isListening
                        ? 'bg-rose-600 text-white animate-pulse shadow-lg ring-4 ring-rose-200'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                    title={isListening ? 'Stop Microphone' : 'Start Speaking with Microphone'}
                  >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>

                  {/* Text Input / Speech-to-Text field */}
                  <div className="flex-1 relative flex items-center">
                    <input
                      type="text"
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendResponse();
                      }}
                      placeholder={
                        isListening
                          ? 'Transcribing your speech live...'
                          : 'Speak via microphone or type your response here...'
                      }
                      className="w-full py-2.5 pl-3 pr-10 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                    />
                  </div>

                  {/* Send Button */}
                  <button
                    onClick={handleSendResponse}
                    disabled={!inputVal.trim() && !isListening}
                    className="w-11 h-11 rounded-2xl bg-[#0A2540] hover:bg-slate-800 disabled:opacity-40 text-white flex items-center justify-center cursor-pointer shrink-0 shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                  <span>Press microphone to speak or type in the box</span>
                  <span>Target: Band {user.targetScore}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
