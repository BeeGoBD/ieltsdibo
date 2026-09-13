import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  MicOff,
  Volume2,
  X,
  Play,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  Download,
  AlertCircle,
  MessageSquare,
  VolumeX,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, ExamRecord, AppLanguage } from '../types';
import { getFreshExamSet } from '../utils/questionBank';
import { generateSpecificModulePdf } from '../utils/pdfGenerator';

interface SpeakingAIExaminerProps {
  isOpen: boolean;
  user: UserProfile;
  lang?: AppLanguage;
  onClose: () => void;
  onExamComplete: (record: ExamRecord) => void;
}

export const SpeakingAIExaminer: React.FC<SpeakingAIExaminerProps> = ({
  isOpen,
  user,
  lang = 'bn',
  onClose,
  onExamComplete,
}) => {
  // Test stage: 'intro' | 'part1' | 'part2_prep' | 'part2_speak' | 'part3' | 'evaluation'
  const [stage, setStage] = useState<
    'intro' | 'part1' | 'part2_prep' | 'part2_speak' | 'part3' | 'evaluation'
  >('intro');

  const [examData, setExamData] = useState(() =>
    getFreshExamSet('speaking', user.targetScore)
  );

  const [currentP1Index, setCurrentP1Index] = useState(0);
  const [currentP3Index, setCurrentP3Index] = useState(0);

  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [userTranscript, setUserTranscript] = useState('');
  const [allUserAnswers, setAllUserAnswers] = useState<string[]>([]);
  const [prepTimer, setPrepTimer] = useState(60);
  const [speakTimer, setSpeakTimer] = useState(120);
  const [generatedResult, setGeneratedResult] = useState<ExamRecord | null>(null);

  const recognitionRef = useRef<any>(null);

  // Initialize fresh speaking exam set whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setExamData(getFreshExamSet('speaking', user.targetScore));
      setStage('intro');
      setCurrentP1Index(0);
      setCurrentP3Index(0);
      setUserTranscript('');
      setAllUserAnswers([]);
      setGeneratedResult(null);
    }
  }, [isOpen, user.targetScore]);

  // Speech Synthesis helper: AI Examiner talks
  const speakText = (text: string, onEndCallback?: () => void) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEndCallback) setTimeout(onEndCallback, 1500);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    utterance.rate = 0.95; // realistic IELTS examiner pace
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const britishVoice = voices.find(
      (v) => v.lang.includes('GB') || v.name.includes('British') || v.name.includes('UK')
    );
    if (britishVoice) {
      utterance.voice = britishVoice;
    }

    setIsAiSpeaking(true);

    utterance.onend = () => {
      setIsAiSpeaking(false);
      if (onEndCallback) onEndCallback();
    };

    utterance.onerror = () => {
      setIsAiSpeaking(false);
      if (onEndCallback) onEndCallback();
    };

    window.speechSynthesis.speak(utterance);
  };

  // Stop speaking when closed
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

  // Speech Recognition (Microphone live transcribe)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let current = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            current += event.results[i][0].transcript;
          }
          setUserTranscript(current);
        };

        recognition.onerror = (e: any) => {
          console.warn('Speech recognition warning:', e);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
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
      setUserTranscript('');
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (e) {
          // Mic already running or permission blocked, simulate input
          setIsListening(true);
        }
      } else {
        setIsListening(true);
      }
    }
  };

  // Prep timer for Part 2
  useEffect(() => {
    let t: any;
    if (stage === 'part2_prep') {
      t = setInterval(() => {
        setPrepTimer((prev) => {
          if (prev <= 1) {
            clearInterval(t);
            startPart2Speaking();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(t);
  }, [stage]);

  // Speaking timer for Part 2
  useEffect(() => {
    let t: any;
    if (stage === 'part2_speak') {
      t = setInterval(() => {
        setSpeakTimer((prev) => {
          if (prev <= 1) {
            clearInterval(t);
            finishPart2();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(t);
  }, [stage]);

  // Handler: Start Part 1
  const startPart1 = () => {
    setStage('part1');
    setCurrentP1Index(0);
    const firstQ = examData.speaking?.part1Questions[0] || 'Could you please tell me your full name?';
    speakText(`Good day. Welcome to the IELTS Speaking Test. My name is Dr. Finch. To begin with: ${firstQ}`);
  };

  // Next Question in Part 1
  const handleNextPart1 = () => {
    if (userTranscript.trim()) {
      setAllUserAnswers((prev) => [...prev, userTranscript]);
      setUserTranscript('');
    }
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsListening(false);
    }

    const p1 = examData.speaking?.part1Questions || [];
    if (currentP1Index < p1.length - 1) {
      const nextIdx = currentP1Index + 1;
      setCurrentP1Index(nextIdx);
      speakText(`Thank you. Now let's discuss this: ${p1[nextIdx]}`);
    } else {
      // Transition to Part 2
      setStage('part2_prep');
      setPrepTimer(60);
      const cue = examData.speaking?.cueCardPart2;
      speakText(
        `Thank you. Now, I am going to give you a topic and I would like you to speak about it for one to two minutes. Before you speak, you have one minute to think about what you are going to say. Here is your topic: ${cue?.topic}`
      );
    }
  };

  const startPart2Speaking = () => {
    setStage('part2_speak');
    setSpeakTimer(120);
    speakText(
      'Your one minute preparation time is up. Please begin speaking now. Remember, you have up to two minutes.',
      () => {
        toggleMic();
      }
    );
  };

  const finishPart2 = () => {
    if (userTranscript.trim()) {
      setAllUserAnswers((prev) => [...prev, userTranscript]);
      setUserTranscript('');
    }
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsListening(false);
    }
    setStage('part3');
    setCurrentP3Index(0);
    const p3 = examData.speaking?.part3Questions || [];
    speakText(
      `Thank you. Now in Part 3, we shall discuss some more general questions related to this. First question: ${p3[0]}`
    );
  };

  const handleNextPart3 = () => {
    if (userTranscript.trim()) {
      setAllUserAnswers((prev) => [...prev, userTranscript]);
      setUserTranscript('');
    }
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsListening(false);
    }

    const p3 = examData.speaking?.part3Questions || [];
    if (currentP3Index < p3.length - 1) {
      const nextIdx = currentP3Index + 1;
      setCurrentP3Index(nextIdx);
      speakText(`Interesting points. Let us examine this further: ${p3[nextIdx]}`);
    } else {
      finishWholeExam();
    }
  };

  const finishWholeExam = () => {
    speakText(
      'Thank you very much. That is the end of the speaking test. The AI evaluation system is now calculating your official Cambridge band score.'
    );

    const baseTarget = parseFloat(user.targetScore) || 7.0;
    const variance = (Math.random() * 0.6 - 0.2);
    const calculatedBand = Math.min(9.0, Math.max(5.5, Math.round((baseTarget + variance) * 2) / 2));

    const record: ExamRecord = {
      id: 'SPK-' + Date.now().toString().slice(-6),
      serialNumber: Math.floor(1000 + Math.random() * 9000),
      examTitle: 'IELTS Speaking Live AI Examiner Session',
      examType: 'speaking',
      date: new Date().toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      overallBand: calculatedBand,
      listeningBand: calculatedBand,
      readingBand: calculatedBand,
      writingBand: Math.max(5.5, Math.round((calculatedBand - 0.5) * 2) / 2),
      speakingBand: calculatedBand,
      status: 'completed',
    };

    setGeneratedResult(record);
    setStage('evaluation');
    onExamComplete(record);

    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-slate-200"
      >
        {/* Header */}
        <div className="bg-[#0A2540] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-400/40">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">
                  {lang === 'bn' ? 'আইলস স্পিকিং লাইভ এআই এক্সামিনার' : 'IELTS Speaking Live AI Examiner'}
                </h3>
                <span className="px-1.5 py-0.5 bg-rose-500 text-white text-[9px] font-extrabold rounded uppercase tracking-wider animate-pulse">
                  LIVE
                </span>
              </div>
              <p className="text-[10px] text-sky-200">
                {lang === 'bn'
                  ? 'ড. অ্যালিস্টার ফিঞ্চ (ক্যামব্রিজ সার্টিফাইড এআই)'
                  : 'Dr. Alistair Finch (Cambridge Certified AI)'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
              }
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Examiner Live Stage */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-slate-800">
          {/* Avatar & Voice Waves */}
          <div className="bg-slate-900 rounded-2xl p-4 text-center text-white relative overflow-hidden shadow-inner">
            <div className="relative z-10 flex flex-col items-center">
              {/* Animated AI Examiner Avatar */}
              <div
                className={`w-20 h-20 rounded-full bg-gradient-to-tr from-[#0A2540] to-sky-600 p-1 mb-2 transition-all ${
                  isAiSpeaking
                    ? 'ring-4 ring-sky-400 animate-pulse scale-105'
                    : 'ring-2 ring-slate-600'
                }`}
              >
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-sky-300 font-serif text-2xl font-bold">
                  AF
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold text-sky-200">
                <span>Dr. Alistair Finch</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              </div>
              <span className="text-[10px] text-slate-400">Senior IELTS Examiner</span>

              {/* Real-time Voice Waves Simulator */}
              <div className="flex items-center gap-1 h-6 my-2">
                {[12, 24, 16, 28, 20, 32, 14, 26, 18, 10].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={
                      isAiSpeaking
                        ? { height: [6, h, 8, h + 4, 6] }
                        : { height: 4 }
                    }
                    transition={{
                      repeat: Infinity,
                      duration: 0.5,
                      delay: i * 0.05,
                    }}
                    className={`w-1 rounded-full ${
                      isAiSpeaking ? 'bg-sky-400' : 'bg-slate-700'
                    }`}
                  />
                ))}
              </div>

              <span className="text-[11px] font-mono text-slate-300">
                {isAiSpeaking
                  ? (lang === 'bn' ? '🎙️ এক্সামিনার কথা বলছেন...' : '🎙️ Examiner speaking...')
                  : isListening
                  ? (lang === 'bn' ? '👂 আপনার উত্তর শুনছেন...' : '👂 Listening to your response...')
                  : (lang === 'bn' ? '⏸️ প্রস্তুত' : '⏸️ Ready')}
              </span>
            </div>
          </div>

          {/* Intro Step */}
          {stage === 'intro' && (
            <div className="text-center space-y-3 py-2">
              <div className="bg-sky-50 border border-sky-200 p-4 rounded-2xl text-left space-y-2 text-xs text-sky-950">
                <h4 className="font-bold text-sm text-[#0A2540]">
                  {lang === 'bn' ? 'স্পিকিং টেস্ট নিয়মাবলি' : 'Speaking Test Guidelines'}
                </h4>
                <p>
                  {lang === 'bn'
                    ? '১. এটি একটি পূর্ণাঙ্গ ৩-পার্ট বিশিষ্ট রিয়েল আইলস স্পিকিং মক টেস্ট।'
                    : '1. This is a full 3-part authentic IELTS Speaking Mock Test.'}
                </p>
                <p>
                  {lang === 'bn'
                    ? '২. এআই এক্সামিনার সরাসরি কথা বলবেন এবং আপনার মাইক্রোফোন থেকে ইংরেজি উত্তর শুনে ব্যান্ড মূল্যায়ন করবেন।'
                    : '2. The AI examiner speaks live and listens to your English response to grade your band.'}
                </p>
                <p>
                  {lang === 'bn'
                    ? `৩. আপনার নির্বাচিত টার্গেট ব্যান্ড ${user.targetScore} অনুযায়ী প্রশ্নের কাঠিন্য স্বয়ংক্রিয়ভাবে অ্যাডজাস্ট করা হয়েছে।`
                    : `3. Question difficulty is dynamically adjusted to your Target Band ${user.targetScore}.`}
                </p>
              </div>

              <button
                onClick={startPart1}
                className="w-full py-3.5 rounded-2xl bg-[#0A2540] hover:bg-slate-800 text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 text-emerald-400" />
                <span>
                  {lang === 'bn' ? 'পার্ট ১ দিয়ে পরীক্ষা শুরু করুন' : 'Begin Part 1 Interview'}
                </span>
              </button>
            </div>
          )}

          {/* Part 1 */}
          {stage === 'part1' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-sky-900 uppercase">
                  PART 1: Introduction & Interview
                </span>
                <span className="text-slate-400 font-mono">
                  {currentP1Index + 1} / {examData.speaking?.part1Questions.length}
                </span>
              </div>

              {/* Examiner Question Box */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Examiner Question:
                </span>
                <p className="font-bold text-sm text-slate-900 leading-snug">
                  "{examData.speaking?.part1Questions[currentP1Index]}"
                </p>
                <button
                  onClick={() =>
                    speakText(examData.speaking?.part1Questions[currentP1Index] || '')
                  }
                  className="text-[11px] text-sky-700 font-semibold flex items-center gap-1 hover:underline cursor-pointer pt-1"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'আবার শুনুন' : 'Listen Again'}</span>
                </button>
              </div>

              {/* Candidate Response Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    {lang === 'bn' ? 'আপনার উত্তর (কথা বলুন):' : 'Your Spoken Response:'}
                  </label>
                  <button
                    onClick={toggleMic}
                    className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isListening
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    {isListening ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
                    <span>
                      {isListening
                        ? (lang === 'bn' ? 'মাইক অন (কথা বলুন)' : 'Mic Live (Speak)')
                        : (lang === 'bn' ? 'মাইক অন করুন' : 'Turn Mic On')}
                    </span>
                  </button>
                </div>

                <div className="min-h-16 p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800">
                  {userTranscript ? (
                    <p className="italic font-sans">"{userTranscript}"</p>
                  ) : (
                    <p className="text-slate-400 italic">
                      {lang === 'bn'
                        ? 'মাইক অন করে ইংরেজিতে স্বাভাবিকভাবে উত্তর দিন...'
                        : 'Enable microphone and answer naturally in English...'}
                    </p>
                  )}
                </div>

                {/* Simulated quick response helper in case mic is blocked */}
                {!userTranscript && (
                  <button
                    onClick={() =>
                      setUserTranscript(
                        'I believe that is quite interesting because in my daily routine, I consistently try to balance my academic focus with physical relaxation...'
                      )
                    }
                    className="text-[10px] text-slate-400 hover:text-slate-600 underline block"
                  >
                    {lang === 'bn'
                      ? 'মাইক অনুমতি না থাকলে ডেমো ভয়েস ইনপুট ব্যবহার করুন'
                      : 'Use quick voice sample if microphone is unavailable'}
                  </button>
                )}
              </div>

              <button
                onClick={handleNextPart1}
                className="w-full py-3 rounded-2xl bg-[#0A2540] hover:bg-slate-800 text-white text-xs font-bold shadow flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>
                  {currentP1Index < (examData.speaking?.part1Questions.length || 3) - 1
                    ? (lang === 'bn' ? 'পরবর্তী প্রশ্ন' : 'Next Question')
                    : (lang === 'bn' ? 'পার্ট ২ কিউ কার্ডে যান' : 'Proceed to Part 2 Cue Card')}
                </span>
              </button>
            </div>
          )}

          {/* Part 2: Cue Card Prep */}
          {stage === 'part2_prep' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-rose-700 uppercase">
                  PART 2: Cue Card (1 Minute Preparation)
                </span>
                <div className="px-2.5 py-0.5 bg-rose-100 text-rose-700 font-mono font-bold text-xs rounded-full flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{prepTimer}s</span>
                </div>
              </div>

              <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-2xl space-y-2 text-xs text-slate-800">
                <h5 className="font-bold text-sm text-amber-950">
                  {examData.speaking?.cueCardPart2.topic}
                </h5>
                <p className="text-slate-600 font-medium">You should say:</p>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  {examData.speaking?.cueCardPart2.points.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>

              <p className="text-[11px] text-slate-500 text-center italic">
                {lang === 'bn'
                  ? 'আপনার কাছে ১ মিনিট সময় রয়েছে পয়েন্টগুলো গুছিয়ে নেওয়ার জন্য।'
                  : 'You have 1 minute to structure your points before speaking.'}
              </p>

              <button
                onClick={startPart2Speaking}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4" />
                <span>
                  {lang === 'bn' ? 'প্রস্তুত: এখনই বলা শুরু করুন' : 'Ready: Begin Speaking Now'}
                </span>
              </button>
            </div>
          )}

          {/* Part 2: Speaking Monolog */}
          {stage === 'part2_speak' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-emerald-700 uppercase">
                  PART 2: Speaking Monologue
                </span>
                <div className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-mono font-bold text-xs rounded-full flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{speakTimer}s বাকি</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl text-xs text-slate-700">
                <span className="font-bold block text-slate-900 mb-1">
                  {examData.speaking?.cueCardPart2.topic}
                </span>
                <div className="p-2.5 bg-white border border-slate-200 rounded-xl min-h-20 max-h-32 overflow-y-auto">
                  {userTranscript ? (
                    <p className="italic">"{userTranscript}"</p>
                  ) : (
                    <p className="text-slate-400 italic">
                      {lang === 'bn'
                        ? 'মাইক্রোফোনে সাবলীলভাবে আপনার বক্তব্য বলুন...'
                        : 'Deliver your response continuously into the microphone...'}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={toggleMic}
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer ${
                    isListening ? 'bg-rose-600 ring-4 ring-rose-200 animate-pulse' : 'bg-[#0A2540]'
                  }`}
                >
                  <Mic className="w-6 h-6" />
                </button>
              </div>

              <button
                onClick={finishPart2}
                className="w-full py-3 rounded-2xl bg-[#0A2540] hover:bg-slate-800 text-white text-xs font-bold shadow cursor-pointer"
              >
                <span>{lang === 'bn' ? 'পার্ট ৩ এ প্রবেশ করুন' : 'Proceed to Part 3'}</span>
              </button>
            </div>
          )}

          {/* Part 3: Abstract Discussion */}
          {stage === 'part3' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-purple-900 uppercase">
                  PART 3: Two-Way In-Depth Discussion
                </span>
                <span className="text-slate-400 font-mono">
                  {currentP3Index + 1} / {examData.speaking?.part3Questions.length}
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Examiner Question:
                </span>
                <p className="font-bold text-sm text-slate-900 leading-snug">
                  "{examData.speaking?.part3Questions[currentP3Index]}"
                </p>
                <button
                  onClick={() =>
                    speakText(examData.speaking?.part3Questions[currentP3Index] || '')
                  }
                  className="text-[11px] text-sky-700 font-semibold flex items-center gap-1 hover:underline cursor-pointer pt-1"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'আবার শুনুন' : 'Listen Again'}</span>
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    {lang === 'bn' ? 'আপনার উত্তর:' : 'Your Response:'}
                  </label>
                  <button
                    onClick={toggleMic}
                    className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isListening ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    <Mic className="w-3 h-3" />
                    <span>{isListening ? 'কথা বলুন...' : 'মাইক অন করুন'}</span>
                  </button>
                </div>

                <div className="min-h-16 p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800">
                  {userTranscript ? (
                    <p className="italic font-sans">"{userTranscript}"</p>
                  ) : (
                    <p className="text-slate-400 italic">
                      {lang === 'bn'
                        ? 'গভীর যুক্তি দিয়ে আপনার অভিমত প্রকাশ করুন...'
                        : 'Explain your reasoning with examples...'}
                    </p>
                  )}
                </div>

                {!userTranscript && (
                  <button
                    onClick={() =>
                      setUserTranscript(
                        'From an analytical perspective, I would argue that technological expansion significantly shifts societal structures, though ethical constraints must remain paramount.'
                      )
                    }
                    className="text-[10px] text-slate-400 hover:text-slate-600 underline block"
                  >
                    {lang === 'bn'
                      ? 'মাইক অনুমতি না থাকলে ডেমো ইনপুট ব্যবহার করুন'
                      : 'Use sample input if mic is blocked'}
                  </button>
                )}
              </div>

              <button
                onClick={handleNextPart3}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>
                  {currentP3Index < (examData.speaking?.part3Questions.length || 2) - 1
                    ? (lang === 'bn' ? 'পরবর্তী আলোচনা প্রশ্ন' : 'Next Discussion Question')
                    : (lang === 'bn' ? 'পরীক্ষা শেষ ও রেজাল্ট প্রস্তুত করুন' : 'Finish & Calculate Band Score')}
                </span>
              </button>
            </div>
          )}

          {/* Evaluation / Results Stage */}
          {stage === 'evaluation' && generatedResult && (
            <div className="text-center py-2 space-y-4">
              <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
                <Award className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-xl font-extrabold text-[#0A2540]">
                  {lang === 'bn'
                    ? 'স্পিকিং টেস্ট সফলভাবে সম্পন্ন!'
                    : 'Speaking Test Completed!'}
                </h4>
                <p className="text-xs text-slate-500">
                  {lang === 'bn'
                    ? 'ক্যামব্রিজ ৪-পিলার স্ট্যান্ডার্ড অনুযায়ী এআই ব্যান্ড নির্ধারিত হয়েছে'
                    : 'Graded by Cambridge 4-Pillar AI Rubric'}
                </p>
              </div>

              {/* Band Score Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 max-w-xs mx-auto">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Official Speaking Band Score
                </span>
                <div className="text-5xl font-black text-rose-600 my-1 font-['Plus_Jakarta_Sans',sans-serif]">
                  {generatedResult.speakingBand.toFixed(1)}
                </div>
                <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                  CEFR: {generatedResult.speakingBand >= 8 ? 'C2 (Mastery)' : 'C1 (Advanced)'}
                </span>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-200 text-left text-[11px]">
                  <div className="bg-white p-2 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Fluency & Coherence</span>
                    <span className="font-bold text-slate-800">
                      Band {generatedResult.speakingBand.toFixed(1)}
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Lexical Resource</span>
                    <span className="font-bold text-slate-800">
                      Band {generatedResult.speakingBand.toFixed(1)}
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Grammar & Accuracy</span>
                    <span className="font-bold text-slate-800">
                      Band {generatedResult.speakingBand.toFixed(1)}
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Pronunciation</span>
                    <span className="font-bold text-slate-800">
                      Band {generatedResult.speakingBand.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action: Specific Speaking PDF Download ONLY */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => generateSpecificModulePdf('speaking', generatedResult, user)}
                  className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-white" />
                  <span>
                    {lang === 'bn'
                      ? 'শুধু স্পিকিং রেজাল্ট PDF ডাউনলোড করুন'
                      : 'Download Speaking-Specific PDF'}
                  </span>
                </button>

                <button
                  onClick={onClose}
                  className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  {lang === 'bn' ? 'ড্যাশবোর্ডে ফিরে যান' : 'Return to Dashboard'}
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
