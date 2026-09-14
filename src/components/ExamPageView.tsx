import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  Award,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  BookOpen,
  PenTool,
  ArrowRight,
  Download,
  ShieldCheck,
  FileText,
  HelpCircle,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Eye,
  EyeOff,
  Headphones,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SkillCategory, ExamRecord, UserProfile, AppLanguage } from '../types';
import { generateSpecificModulePdf } from '../utils/pdfGenerator';
import { getTierFromScore } from '../utils/questionBank';
import { getReadingTestSet, ReadingTestSet, ReadingQuestion } from '../utils/readingQuestions';
import { getListeningTestSet, ListeningTestSet, ListeningQuestion } from '../utils/listeningQuestions';

interface ExamPageViewProps {
  moduleType: SkillCategory;
  user: UserProfile;
  lang?: AppLanguage;
  onBack: () => void;
  onExamComplete: (record: ExamRecord) => void;
  onViewFullReport?: (record: ExamRecord) => void;
}

export const ExamPageView: React.FC<ExamPageViewProps> = ({
  moduleType,
  user,
  lang = 'bn',
  onBack,
  onExamComplete,
  onViewFullReport,
}) => {
  const tier = getTierFromScore(user.targetScore);
  const readingData: ReadingTestSet = getReadingTestSet(tier);
  const listeningData: ListeningTestSet = getListeningTestSet(tier);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [writingText, setWritingText] = useState('');
  const [activeTab, setActiveTab] = useState<'passage' | 'questions'>('passage');
  const [showTranscript, setShowTranscript] = useState(false);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [isShiftingQuestion, setIsShiftingQuestion] = useState(false);
  const [showFullPassage, setShowFullPassage] = useState(false);

  // Audio Playback state for Listening
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Time limits: Reading = 20 mins, Listening = 25 mins, Writing = 40 mins
  const initialTime = moduleType === 'writing' ? 2400 : moduleType === 'reading' ? 1200 : 1500;
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isFinished, setIsFinished] = useState(false);
  const [scoreStats, setScoreStats] = useState<{
    correctCount: number;
    unansweredCount: number;
    total: number;
    rawPercentage: number;
    calculatedBand: number;
  } | null>(null);
  const [generatedScore, setGeneratedScore] = useState<ExamRecord | null>(null);
  const [writingEvaluation, setWritingEvaluation] = useState<any>(null);
  const [isSubmittingWriting, setIsSubmittingWriting] = useState(false);
  const [showReview, setShowReview] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (isFinished) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isFinished]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Audio player controller using Web Speech Synthesis
  const togglePlayAudio = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const currentSectionIdx = Math.min(3, Math.floor(currentQuestion / 3));
    const section = listeningData.sections[currentSectionIdx] || listeningData.sections[0];
    const textToSpeak = `${section.title}. ${section.context}. ${section.audioScript}`;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'en-GB';
    utterance.rate = 0.92;

    const voices = window.speechSynthesis.getVoices();
    const gbVoice = voices.find((v) => v.lang.includes('GB') || v.name.includes('UK') || v.name.includes('British'));
    if (gbVoice) utterance.voice = gbVoice;

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const currentQuestionsList: (ReadingQuestion | ListeningQuestion)[] =
    moduleType === 'reading' ? readingData.questions : listeningData.questions;

  const currentQ = currentQuestionsList[currentQuestion];

  // Mathematical Cambridge Standard Score Conversion (0 - 10 scale mapped to 0 - 9.0 Band)
  const calculateCambridgeBand = (correct: number, total: number): number => {
    if (total === 0) return 1.0;
    const ratio = correct / total;
    if (ratio >= 0.95) return 9.0;
    if (ratio >= 0.85) return 8.5;
    if (ratio >= 0.75) return 8.0;
    if (ratio >= 0.65) return 7.5;
    if (ratio >= 0.55) return 6.5;
    if (ratio >= 0.45) return 6.0;
    if (ratio >= 0.35) return 5.0;
    if (ratio >= 0.25) return 4.0;
    if (ratio >= 0.15) return 3.0;
    return 2.0;
  };

  const handleSubmitExam = async () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);

    let finalBand = 6.0;
    let correct = 0;
    const total = currentQuestionsList.length;

    if (moduleType === 'reading' || moduleType === 'listening') {
      currentQuestionsList.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctAnswer) {
          correct++;
        }
      });
      const unanswered = total - Object.keys(selectedAnswers).length;
      finalBand = calculateCambridgeBand(correct, total);

      setScoreStats({
        correctCount: correct,
        unansweredCount: Math.max(0, unanswered),
        total,
        rawPercentage: Math.round((correct / total) * 100),
        calculatedBand: finalBand,
      });
    } else if (moduleType === 'writing') {
      setIsSubmittingWriting(true);
      const words = writingText.trim().split(/\s+/).filter(Boolean).length;
      try {
        const res = await fetch('/api/writing/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            essay: writingText,
            promptTitle: 'Discuss both views and give your opinion on modern infrastructure',
            targetScore: user.targetScore,
          }),
        });
        const evalData = await res.json();
        setWritingEvaluation(evalData);
        finalBand = evalData.overallBand || (words < 150 ? 4.5 : words < 250 ? 6.0 : 7.0);
      } catch (err) {
        finalBand = words < 150 ? 4.5 : words < 250 ? 6.0 : 7.0;
      } finally {
        setIsSubmittingWriting(false);
      }
    }

    const record: ExamRecord = {
      id: 'EXAM-' + Date.now().toString().slice(-6),
      serialNumber: Math.floor(1000 + Math.random() * 9000),
      examTitle: `Official Cambridge IELTS ${moduleType.toUpperCase()} Test`,
      examType: moduleType,
      date: new Date().toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      overallBand: finalBand,
      listeningBand: moduleType === 'listening' ? finalBand : 7.0,
      readingBand: moduleType === 'reading' ? finalBand : 7.0,
      writingBand: moduleType === 'writing' ? finalBand : 7.0,
      speakingBand: 7.0,
      status: 'completed',
    };

    setGeneratedScore(record);
    setIsFinished(true);
    onExamComplete(record);

    try {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const handleDownloadPdf = () => {
    if (generatedScore) {
      generateSpecificModulePdf(moduleType, generatedScore, user);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center">
      <div className="w-full max-w-6xl xl:max-w-7xl min-h-screen bg-white flex flex-col shadow-xl">
        {/* Top Official Exam Header */}
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
                <span className="font-extrabold text-sm uppercase tracking-wider text-amber-300">
                  IELTS {moduleType}
                </span>
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full font-bold text-sky-200">
                  {tier} Tier
                </span>
              </div>
              <span className="text-[11px] text-slate-300 block">
                Candidate: {user.name} (#{user.rollNumber})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isFinished && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-slate-950 rounded-xl font-mono text-xs font-black shadow-sm">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}
            <button
              onClick={onBack}
              className="text-xs text-slate-300 hover:text-white underline cursor-pointer"
            >
              {lang === 'bn' ? 'প্রস্থান' : 'Exit'}
            </button>
          </div>
        </header>

        {/* Exam Body */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!isFinished ? (
            <div className="flex-1 flex flex-col overflow-y-auto">
              {/* 1. IELTS READING MODE */}
              {moduleType === 'reading' && (() => {
                const targetLetter = ('paragraphRef' in currentQ && currentQ?.paragraphRef)
                  ? currentQ.paragraphRef.replace(/[^A-Za-z]/g, '').trim().toUpperCase()
                  : '';
                const relevantParagraph = readingData.paragraphs.find((p) => p.letter === targetLetter) || readingData.paragraphs[0];
                const allQuestionsAnswered = currentQuestionsList.length > 0 && Object.keys(selectedAnswers).length === currentQuestionsList.length;

                const handleSelectReadingOption = (opt: string) => {
                  setSelectedAnswers((prev) => ({
                    ...prev,
                    [currentQuestion]: opt,
                  }));
                  setIsShiftingQuestion(true);
                  setTimeout(() => {
                    const total = currentQuestionsList.length;
                    let nextIdx = -1;
                    // Look forward from current question
                    for (let i = currentQuestion + 1; i < total; i++) {
                      if (selectedAnswers[i] === undefined && i !== currentQuestion) {
                        nextIdx = i;
                        break;
                      }
                    }
                    // Look from start if needed
                    if (nextIdx === -1) {
                      for (let i = 0; i < currentQuestion; i++) {
                        if (selectedAnswers[i] === undefined) {
                          nextIdx = i;
                          break;
                        }
                      }
                    }
                    if (nextIdx !== -1) {
                      setCurrentQuestion(nextIdx);
                    } else if (currentQuestion < total - 1) {
                      setCurrentQuestion(currentQuestion + 1);
                    }
                    setIsShiftingQuestion(false);
                  }, 220);
                };

                return (
                  <div className="flex-1 flex flex-col md:flex-row h-full">
                    {/* Mobile switcher tab */}
                    <div className="md:hidden flex border-b border-slate-200 bg-slate-50 text-xs font-bold">
                      <button
                        onClick={() => setActiveTab('passage')}
                        className={`flex-1 py-2.5 text-center border-b-2 ${
                          activeTab === 'passage'
                            ? 'border-[#0A2540] text-[#0A2540] bg-white'
                            : 'border-transparent text-slate-500'
                        }`}
                      >
                        📖 {lang === 'bn' ? 'প্যাসেজ অনুচ্ছেদ' : 'Reading Section'}
                      </button>
                      <button
                        onClick={() => setActiveTab('questions')}
                        className={`flex-1 py-2.5 text-center border-b-2 ${
                          activeTab === 'questions'
                            ? 'border-[#0A2540] text-[#0A2540] bg-white'
                            : 'border-transparent text-slate-500'
                        }`}
                      >
                        ✏️ {lang === 'bn' ? 'প্রশ্ন' : 'Question'} ({Object.keys(selectedAnswers).length}/{currentQuestionsList.length})
                      </button>
                    </div>

                    {/* Left Column: Focused Paragraph or Full Passage */}
                    <div
                      className={`w-full md:w-1/2 p-5 border-r border-slate-200 overflow-y-auto bg-slate-50/50 ${
                        activeTab === 'questions' ? 'hidden md:block' : 'block'
                      }`}
                    >
                      <div className="max-w-xl mx-auto space-y-4">
                        {/* Passage Header */}
                        <div className="border-b border-slate-200 pb-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              {readingData.passageCategory}
                            </span>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500">
                              <button
                                onClick={() => setShowFullPassage(!showFullPassage)}
                                className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-100 hover:bg-sky-200 text-sky-800 transition-colors cursor-pointer"
                              >
                                {showFullPassage ? '🎯 Focused Mode' : '📖 All Paragraphs'}
                              </button>
                              <div className="flex items-center gap-1">
                                {(['sm', 'base', 'lg'] as const).map((sz) => (
                                  <button
                                    key={sz}
                                    onClick={() => setFontSize(sz)}
                                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                      fontSize === sz ? 'bg-[#0A2540] text-white' : 'bg-slate-200 text-slate-700'
                                    }`}
                                  >
                                    {sz.toUpperCase()}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                          <h2 className="text-lg md:text-xl font-black text-[#0A2540] font-serif leading-tight">
                            {readingData.passageTitle}
                          </h2>
                          <p className="text-xs text-slate-600 mt-1 italic">
                            {readingData.passageSubtitle}
                          </p>
                        </div>

                        {/* Mode 1: Progressive Focused Paragraph (User Request: Answering question removes answered paragraph & shifts next to top) */}
                        {!showFullPassage ? (
                          <div
                            className={`transition-all duration-200 ${
                              isShiftingQuestion ? 'opacity-30 translate-y-2' : 'opacity-100 translate-y-0'
                            }`}
                          >
                            <div className="bg-sky-50/80 border border-sky-200 rounded-2xl p-3 mb-3 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 bg-[#0A2540] text-white rounded-md text-xs font-bold">
                                  Paragraph {relevantParagraph.letter}
                                </span>
                                <span className="text-xs font-bold text-[#0A2540]">
                                  Relevant to Question {currentQuestion + 1}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-500 font-mono">
                                Auto-advancing
                              </span>
                            </div>

                            <div
                              className={`p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3 font-serif leading-relaxed text-slate-800 ${
                                fontSize === 'sm' ? 'text-xs' : fontSize === 'lg' ? 'text-base' : 'text-sm'
                              }`}
                            >
                              <p>{relevantParagraph.text}</p>
                            </div>
                          </div>
                        ) : (
                          /* Mode 2: Full Passage display if student toggles all paragraphs */
                          <div
                            className={`space-y-4 text-slate-800 leading-relaxed font-serif ${
                              fontSize === 'sm' ? 'text-xs' : fontSize === 'lg' ? 'text-base' : 'text-sm'
                            }`}
                          >
                            {readingData.paragraphs.map((para) => (
                              <div
                                key={para.letter}
                                id={`para-${para.letter}`}
                                className={`p-3.5 bg-white rounded-2xl border shadow-xs relative ${
                                  para.letter === targetLetter
                                    ? 'border-sky-500 ring-2 ring-sky-200'
                                    : 'border-slate-200'
                                }`}
                              >
                                <span className="inline-block px-2 py-0.5 bg-[#0A2540] text-white rounded-md text-[11px] font-bold font-sans mr-2 align-middle">
                                  [{para.letter}]
                                </span>
                                <span>{para.text}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Column: Question Panel (Shifts to next question automatically when answered) */}
                    <div
                      className={`w-full md:w-1/2 p-5 flex flex-col justify-between overflow-y-auto bg-white ${
                        activeTab === 'passage' ? 'hidden md:flex' : 'flex'
                      }`}
                    >
                      <div className="max-w-xl mx-auto w-full space-y-4">
                        {/* Question Palette / Progress */}
                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                            <span>
                              {lang === 'bn' ? 'প্রশ্ন প্যালেট' : 'Question Palette'} ({Object.keys(selectedAnswers).length}/{currentQuestionsList.length} answered)
                            </span>
                            <span className="text-[11px] text-slate-500 font-mono">
                              Target: Band {user.targetScore}
                            </span>
                          </div>

                          <div className="grid grid-cols-10 gap-1.5">
                            {currentQuestionsList.map((_, idx) => {
                              const isAnswered = selectedAnswers[idx] !== undefined;
                              const isCurrent = currentQuestion === idx;
                              return (
                                <button
                                  key={idx}
                                  onClick={() => setCurrentQuestion(idx)}
                                  className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    isCurrent
                                      ? 'bg-[#0A2540] text-white ring-2 ring-sky-400'
                                      : isAnswered
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                                  }`}
                                >
                                  {idx + 1}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {allQuestionsAnswered && (
                          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-between">
                            <span>✓ All {currentQuestionsList.length} questions answered!</span>
                            <button
                              onClick={handleSubmitExam}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-black cursor-pointer shadow-sm"
                            >
                              Submit Test
                            </button>
                          </div>
                        )}

                        {/* Active Question Stem with Progressive Animation */}
                        {currentQ && (
                          <div
                            className={`transition-all duration-200 ${
                              isShiftingQuestion ? 'opacity-30 -translate-y-2' : 'opacity-100 translate-y-0'
                            }`}
                          >
                            <div className="p-4 bg-sky-50/60 rounded-2xl border border-sky-200 space-y-2 mb-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-[#0A2540]">
                                  Question {currentQuestion + 1} of {currentQuestionsList.length}
                                </span>
                                {'paragraphRef' in currentQ && (
                                  <span className="text-[10px] font-bold bg-sky-200 text-sky-950 px-2 py-0.5 rounded-full">
                                    {currentQ.paragraphRef}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm font-bold text-slate-900 leading-relaxed font-sans">
                                {currentQ.question}
                              </p>
                            </div>

                            {/* Options */}
                            <div className="space-y-2">
                              {currentQ?.options.map((opt, i) => {
                                const isSelected = selectedAnswers[currentQuestion] === opt;
                                return (
                                  <button
                                    key={opt}
                                    onClick={() => handleSelectReadingOption(opt)}
                                    className={`w-full p-3 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-start gap-3 ${
                                      isSelected
                                        ? 'bg-sky-50 border-[#0A2540] text-[#0A2540] font-bold shadow-xs ring-1 ring-[#0A2540]'
                                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                                    }`}
                                  >
                                    <span
                                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                                        isSelected
                                          ? 'bg-[#0A2540] text-white'
                                          : 'bg-slate-100 text-slate-600'
                                      }`}
                                    >
                                      {String.fromCharCode(65 + i)}
                                    </span>
                                    <span className="pt-0.5 flex-1">{opt}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Navigation Buttons */}
                      <div className="pt-6 border-t border-slate-200 flex items-center justify-between gap-3">
                        <button
                          disabled={currentQuestion === 0}
                          onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
                          className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold disabled:opacity-40 cursor-pointer flex items-center gap-1"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>{lang === 'bn' ? 'আগেরটি' : 'Previous'}</span>
                        </button>

                        {currentQuestion < currentQuestionsList.length - 1 ? (
                          <button
                            onClick={() => setCurrentQuestion((prev) => prev + 1)}
                            className="px-6 py-2.5 bg-[#0A2540] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <span>{lang === 'bn' ? 'পরের প্রশ্ন' : 'Next Question'}</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={handleSubmitExam}
                            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
                          >
                            {lang === 'bn' ? 'পরীক্ষা সাবমিট করুন' : 'Submit Reading Test'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* 2. IELTS LISTENING MODE */}
              {moduleType === 'listening' && (
                <div className="max-w-4xl lg:max-w-5xl mx-auto w-full p-4 sm:p-6 space-y-5">
                  {/* Cambridge Audio Player Card */}
                  <div className="bg-gradient-to-br from-[#0A2540] to-slate-900 text-white p-5 sm:p-6 rounded-3xl shadow-md space-y-4 border border-sky-900">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-inner">
                          <Headphones className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-sm text-white">
                            Official Listening Audio Track
                          </h3>
                          <span className="text-[11px] text-sky-200">
                            British English Audio Simulation (Cambridge Rubric)
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => setShowTranscript(!showTranscript)}
                        className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-[11px] font-bold text-sky-200 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        {showTranscript ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{showTranscript ? 'Hide Script' : 'View Script'}</span>
                      </button>
                    </div>

                    {/* Active Section Context */}
                    <div className="bg-white/10 p-3 rounded-2xl border border-white/10 text-xs text-sky-100">
                      <span className="font-bold text-amber-300 block mb-0.5">
                        {listeningData.sections[Math.min(3, Math.floor(currentQuestion / 3))]?.title}
                      </span>
                      <p className="text-[11px] text-slate-200">
                        {listeningData.sections[Math.min(3, Math.floor(currentQuestion / 3))]?.context}
                      </p>
                    </div>

                    {/* Audio Controls */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={togglePlayAudio}
                        className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all ${
                          isPlayingAudio
                            ? 'bg-rose-500 hover:bg-rose-600 text-white'
                            : 'bg-sky-500 hover:bg-sky-400 text-slate-950 font-black'
                        }`}
                      >
                        {isPlayingAudio ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-slate-950" />}
                        <span>{isPlayingAudio ? 'Pause Audio' : 'Play Audio Recording'}</span>
                      </button>

                      {isPlayingAudio && (
                        <div className="flex items-center gap-1 text-xs text-amber-300 font-mono animate-pulse">
                          <Volume2 className="w-4 h-4" />
                          <span>Playing British narration...</span>
                        </div>
                      )}
                    </div>

                    {/* Collapsible Transcript */}
                    {showTranscript && (
                      <div className="bg-black/40 p-3.5 rounded-2xl text-[11px] leading-relaxed text-slate-200 font-mono max-h-48 overflow-y-auto border border-white/10 whitespace-pre-line">
                        {listeningData.sections[Math.min(3, Math.floor(currentQuestion / 3))]?.audioScript}
                      </div>
                    )}
                  </div>

                  {/* Question Box */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    {/* Palette */}
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                      <span>Question {currentQuestion + 1} of {currentQuestionsList.length}</span>
                      <span className="font-mono text-[11px]">
                        {Object.keys(selectedAnswers).length}/{currentQuestionsList.length} Answered
                      </span>
                    </div>

                    <div className="grid grid-cols-10 gap-1.5">
                      {currentQuestionsList.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentQuestion(idx)}
                          className={`py-1 rounded-lg text-xs font-bold cursor-pointer ${
                            currentQuestion === idx
                              ? 'bg-[#0A2540] text-white ring-2 ring-sky-400'
                              : selectedAnswers[idx] !== undefined
                              ? 'bg-sky-600 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      ))}
                    </div>

                    {/* Question Prompt */}
                    <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200">
                      <p className="text-sm font-bold text-[#0A2540] leading-relaxed">
                        {currentQ?.question}
                      </p>
                    </div>

                    {/* Options */}
                    <div className="space-y-2">
                      {currentQ?.options.map((opt, i) => {
                        const isSelected = selectedAnswers[currentQuestion] === opt;
                        return (
                          <button
                            key={opt}
                            onClick={() =>
                              setSelectedAnswers({
                                ...selectedAnswers,
                                [currentQuestion]: opt,
                              })
                            }
                            className={`w-full p-3 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-start gap-3 ${
                              isSelected
                                ? 'bg-sky-50 border-sky-600 text-[#0A2540] font-bold ring-1 ring-sky-600'
                                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <span
                              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                                isSelected ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {String.fromCharCode(65 + i)}
                            </span>
                            <span className="pt-0.5">{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
                      <button
                        disabled={currentQuestion === 0}
                        onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold disabled:opacity-40 cursor-pointer"
                      >
                        {lang === 'bn' ? 'আগেরটি' : 'Previous'}
                      </button>

                      {currentQuestion < currentQuestionsList.length - 1 ? (
                        <button
                          onClick={() => setCurrentQuestion((prev) => prev + 1)}
                          className="px-6 py-2.5 bg-[#0A2540] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                          {lang === 'bn' ? 'পরের প্রশ্ন' : 'Next Question'}
                        </button>
                      ) : (
                        <button
                          onClick={handleSubmitExam}
                          className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
                        >
                          {lang === 'bn' ? 'লিসেনিং সাবমিট করুন' : 'Submit Listening Test'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 3. IELTS WRITING MODE */}
              {moduleType === 'writing' && (
                <div className="max-w-5xl xl:max-w-6xl mx-auto w-full p-4 sm:p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Column: Academic Prompt & Cambridge Criteria */}
                    <div className="lg:col-span-5 space-y-4">
                      <div className="bg-amber-50 border border-amber-200 p-5 rounded-3xl text-xs space-y-3 shadow-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-200 px-2.5 py-0.5 rounded-full">
                            Academic Task 2 (Discursive Essay)
                          </span>
                          <span className="text-amber-800 font-bold font-mono text-xs">
                            Target: Band {user.targetScore}
                          </span>
                        </div>
                        <h4 className="font-black text-slate-900 text-sm">Official Essay Prompt:</h4>
                        <p className="text-sm font-bold text-slate-800 font-serif leading-relaxed bg-white/60 p-3.5 rounded-2xl border border-amber-200/60">
                          "In many modern metropolitan cities, the expansion of high-density vehicular traffic has resulted in severe environmental degradation and public health crises. Some urban planners argue that private automobiles should be completely banned from city centers, while others contend this would severely disrupt commerce. Discuss both views and give your own opinion."
                        </p>
                        <div className="bg-white/80 p-3 rounded-xl border border-amber-200/50 space-y-1.5 text-[11px] text-amber-900">
                          <p className="font-bold">Cambridge Evaluation Criteria:</p>
                          <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-amber-800">
                            <li>Task Achievement (Minimum 250 words, clear stance)</li>
                            <li>Coherence & Cohesion (Logical flow, paragraph linking)</li>
                            <li>Lexical Resource (Academic vocabulary, collocations)</li>
                            <li>Grammar Range & Accuracy (Complex sentences)</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Essay Textarea & Controls */}
                    <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700">
                          {lang === 'bn' ? 'আপনার প্রবন্ধ টাইপ করুন:' : 'Compose Your Essay:'}
                        </span>
                        {(() => {
                          const words = writingText.trim().split(/\s+/).filter(Boolean).length;
                          return (
                            <span
                              className={`font-mono font-bold px-2.5 py-1 rounded-md text-xs ${
                                words >= 250
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : words >= 150
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {words} words {words < 250 ? `(${250 - words} more required)` : '✓ 250 Target Met'}
                            </span>
                          );
                        })()}
                      </div>

                      <textarea
                        rows={16}
                        value={writingText}
                        onChange={(e) => setWritingText(e.target.value)}
                        placeholder="Begin with your introduction outlining both views, develop 2 analytical body paragraphs with topic sentences and evidence, and conclude with a definitive stance..."
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0A2540] font-sans"
                      />

                      <button
                        disabled={isSubmittingWriting}
                        onClick={handleSubmitExam}
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isSubmittingWriting ? (
                          <span>Evaluating via Cambridge Rubric...</span>
                        ) : (
                          <>
                            <span>{lang === 'bn' ? 'প্রবন্ধ সাবমিট ও স্কোর দেখুন' : 'Submit Essay & Generate Band Score'}</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* 4. RESULT SCREEN WITH DETAILED RAW BREAKDOWN & CAMBRIDGE BAND */
            <div className="max-w-xl mx-auto w-full p-5 space-y-5 my-auto">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-[#0A2540]">
                  {lang === 'bn' ? 'অফিসিয়াল টেস্ট সমাপ্ত হয়েছে!' : 'Official Assessment Completed!'}
                </h3>
                <p className="text-xs text-slate-500">
                  {lang === 'bn'
                    ? 'ক্যামব্রিজ অফিসিয়াল স্ট্যান্ডার্ড অনুযায়ী আপনার উত্তরপত্র মূল্যায়ন করা হয়েছে।'
                    : 'Evaluated rigorously in accordance with British Council & Cambridge English standards.'}
                </p>
              </div>

              {/* Band Score Card */}
              <div className="bg-gradient-to-br from-[#0A2540] to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-sky-900 text-center space-y-3">
                <span className="text-[11px] font-bold text-sky-200 uppercase tracking-widest block">
                  {moduleType.toUpperCase()} ACHIEVED BAND SCORE
                </span>
                <div className="text-6xl font-black text-amber-300 font-mono my-1">
                  {generatedScore?.overallBand.toFixed(1)}
                </div>
                <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-sky-200">
                  {generatedScore && generatedScore.overallBand >= 8.0
                    ? 'C2 (Expert User)'
                    : generatedScore && generatedScore.overallBand >= 7.0
                    ? 'C1 (Good / Very Good User)'
                    : generatedScore && generatedScore.overallBand >= 6.0
                    ? 'B2 (Competent User)'
                    : 'B1 (Modest / Limited User)'}
                </span>

                {/* Raw stats breakdown (Strict, No Fake Ratings!) */}
                {scoreStats && (
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-xs font-bold">
                    <div className="bg-white/10 p-2 rounded-xl">
                      <span className="text-[10px] text-sky-200 block">Correct</span>
                      <span className="text-emerald-300 text-sm">{scoreStats.correctCount}/{scoreStats.total}</span>
                    </div>
                    <div className="bg-white/10 p-2 rounded-xl">
                      <span className="text-[10px] text-sky-200 block">Accuracy</span>
                      <span className="text-amber-300 text-sm">{scoreStats.rawPercentage}%</span>
                    </div>
                    <div className="bg-white/10 p-2 rounded-xl">
                      <span className="text-[10px] text-sky-200 block">Unanswered</span>
                      <span className="text-rose-300 text-sm">{scoreStats.unansweredCount}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Unanswered penalty notice if applicable */}
              {scoreStats && scoreStats.unansweredCount > 0 && (
                <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-2xl flex items-center gap-2.5 text-xs text-rose-900">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>
                    {lang === 'bn'
                      ? `আপনি ${scoreStats.unansweredCount}টি প্রশ্নের উত্তর দেননি। উত্তর না দেওয়ায় সেগুলোতে ০ নম্বর গণ্য করে ব্যান্ড স্কোর নির্ধারিত হয়েছে।`
                      : `You left ${scoreStats.unansweredCount} question(s) unanswered. In Cambridge marking, unanswered questions receive zero marks and lower your band score.`}
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleDownloadPdf}
                  className="w-full py-3.5 bg-[#0A2540] hover:bg-slate-800 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>
                    {lang === 'bn'
                      ? `শুধু ${moduleType.toUpperCase()} রেজাল্ট PDF ডাউনলোড করুন`
                      : `Download ${moduleType.toUpperCase()} Scorecard PDF`}
                  </span>
                </button>

                <button
                  onClick={onBack}
                  className="w-full py-3 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold cursor-pointer"
                >
                  {lang === 'bn' ? 'ড্যাশবোর্ডে ফিরে যান' : 'Return to Dashboard'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
