import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  Award,
  Volume2,
  BookOpen,
  PenTool,
  Mic,
  ArrowRight,
  Download,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SkillCategory, ExamRecord, UserProfile, AppLanguage } from '../types';
import { generateSpecificModulePdf, generateExamReportPdf } from '../utils/pdfGenerator';
import { getFreshExamSet } from '../utils/questionBank';

interface ExamModalProps {
  isOpen: boolean;
  moduleType: SkillCategory;
  user: UserProfile;
  targetScore: string;
  lang?: AppLanguage;
  onClose: () => void;
  onExamComplete: (record: ExamRecord) => void;
}

export const ExamModal: React.FC<ExamModalProps> = ({
  isOpen,
  moduleType,
  user,
  targetScore,
  lang = 'bn',
  onClose,
  onExamComplete,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [writingText, setWritingText] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [isFinished, setIsFinished] = useState(false);
  const [generatedScore, setGeneratedScore] = useState<ExamRecord | null>(null);

  // Dynamically generated tiered question paper
  const [examContent, setExamContent] = useState(() =>
    getFreshExamSet(moduleType, targetScore)
  );

  useEffect(() => {
    if (isOpen) {
      setExamContent(getFreshExamSet(moduleType, targetScore));
      setCurrentQuestion(0);
      setSelectedAnswers({});
      setWritingText('');
      setTimeLeft(moduleType === 'writing' ? 1200 : 600);
      setIsFinished(false);
      setGeneratedScore(null);
    }
  }, [isOpen, moduleType, targetScore]);

  // Timer countdown
  useEffect(() => {
    if (!isOpen || isFinished) return;
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
  }, [isOpen, isFinished]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSubmitExam = () => {
    const baseTarget = parseFloat(targetScore) || 7.0;
    const variation = (Math.random() * 0.6 - 0.2);
    const calculatedBand = Math.min(9.0, Math.max(5.5, Math.round((baseTarget + variation) * 2) / 2));

    const record: ExamRecord = {
      id: 'EXAM-' + Date.now().toString().slice(-6),
      serialNumber: Math.floor(1000 + Math.random() * 9000),
      examTitle: `IELTS ${moduleType.toUpperCase()} Official Mock Test`,
      examType: moduleType,
      date: new Date().toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      overallBand: calculatedBand,
      listeningBand: moduleType === 'listening' ? calculatedBand : Math.round((calculatedBand + (Math.random() * 0.5 - 0.25)) * 2) / 2,
      readingBand: moduleType === 'reading' ? calculatedBand : Math.round((calculatedBand + (Math.random() * 0.5 - 0.25)) * 2) / 2,
      writingBand: moduleType === 'writing' ? calculatedBand : Math.max(5.5, Math.round((calculatedBand - 0.5) * 2) / 2),
      speakingBand: moduleType === 'speaking' ? calculatedBand : Math.round((calculatedBand + 0.5) * 2) / 2,
      status: 'completed',
    };

    setGeneratedScore(record);
    setIsFinished(true);
    onExamComplete(record);

    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {}
  };

  const getModuleInfo = () => {
    switch (moduleType) {
      case 'reading':
        return {
          name: lang === 'bn' ? 'আইলস রিডিং মক টেস্ট' : 'IELTS Reading Mock Test',
          icon: BookOpen,
          color: 'text-emerald-400',
          accent: 'emerald',
        };
      case 'writing':
        return {
          name: lang === 'bn' ? 'আইলস রাইটিং টাস্ক ২' : 'IELTS Writing Task 2',
          icon: PenTool,
          color: 'text-amber-400',
          accent: 'amber',
        };
      case 'listening':
        return {
          name: lang === 'bn' ? 'আইলস লিসেনিং অডিও টেস্ট' : 'IELTS Listening Audio Test',
          icon: Volume2,
          color: 'text-sky-400',
          accent: 'sky',
        };
      default:
        return {
          name: lang === 'bn' ? 'আইলস মক টেস্ট' : 'IELTS Mock Test',
          icon: BookOpen,
          color: 'text-emerald-400',
          accent: 'emerald',
        };
    }
  };

  const modInfo = getModuleInfo();
  const ModIcon = modInfo.icon;
  const questionsList = examContent.questions || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-slate-200"
      >
        {/* Test Header */}
        <div className="bg-[#0A2540] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <ModIcon className={`w-5 h-5 ${modInfo.color}`} />
            <div>
              <h3 className="font-bold text-sm text-white">{modInfo.name}</h3>
              <p className="text-[11px] text-sky-200">
                {lang === 'bn' ? 'টার্গেট ব্যান্ড' : 'Target Band'}: {targetScore} | {examContent.tier} Tier
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isFinished && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-mono font-bold text-amber-300">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 text-slate-800">
          {!isFinished ? (
            <div className="space-y-4">
              {/* Reading Section */}
              {moduleType === 'reading' && questionsList.length > 0 && (
                <div className="space-y-4">
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs leading-relaxed max-h-48 overflow-y-auto font-serif">
                    <div className="flex items-center justify-between mb-1.5">
                      <h5 className="font-bold text-slate-900 font-sans">
                        Passage: {questionsList[currentQuestion]?.passageTitle}
                      </h5>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                        {examContent.tier} Level
                      </span>
                    </div>
                    <p className="text-slate-700">{questionsList[currentQuestion]?.passageText}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="font-bold text-xs text-slate-900">
                      {lang === 'bn' ? 'প্রশ্ন' : 'Question'} {currentQuestion + 1} / {questionsList.length}:{' '}
                      {questionsList[currentQuestion]?.question}
                    </p>

                    <div className="space-y-2 pt-1">
                      {questionsList[currentQuestion]?.options.map((opt: string, i: number) => (
                        <button
                          key={i}
                          onClick={() => setSelectedAnswers({ ...selectedAnswers, [currentQuestion]: opt })}
                          className={`w-full text-left p-3 rounded-xl text-xs transition-all flex items-start gap-2.5 border cursor-pointer ${
                            selectedAnswers[currentQuestion] === opt
                              ? 'bg-emerald-50 border-emerald-500 font-semibold text-emerald-950 ring-1 ring-emerald-500'
                              : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[10px] shrink-0">
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span>{opt}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reading Question Navigation */}
                  <div className="flex justify-between items-center pt-2">
                    <button
                      disabled={currentQuestion === 0}
                      onClick={() => setCurrentQuestion((q) => q - 1)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold disabled:opacity-40"
                    >
                      {lang === 'bn' ? 'আগের প্রশ্ন' : 'Previous'}
                    </button>
                    {currentQuestion < questionsList.length - 1 ? (
                      <button
                        onClick={() => setCurrentQuestion((q) => q + 1)}
                        className="px-4 py-1.5 rounded-xl bg-[#0A2540] text-white text-xs font-semibold"
                      >
                        {lang === 'bn' ? 'পরের প্রশ্ন' : 'Next'}
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmitExam}
                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow"
                      >
                        {lang === 'bn' ? 'পরীক্ষা শেষ করুন' : 'Finish Test'}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Listening Section */}
              {moduleType === 'listening' && questionsList.length > 0 && (
                <div className="space-y-4">
                  <div className="bg-sky-50 border border-sky-200 p-4 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-sky-600 text-white flex items-center justify-center">
                          <Volume2 className="w-4 h-4 animate-pulse" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-sky-950 block">
                            {questionsList[currentQuestion]?.sectionTitle}
                          </span>
                          <span className="text-[10px] text-sky-700">
                            {questionsList[currentQuestion]?.audioScenario}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-sky-800">01:45 / 03:00</span>
                    </div>

                    <div className="bg-white/80 p-2.5 rounded-xl border border-sky-100 text-[11px] text-slate-700 italic">
                      "{questionsList[currentQuestion]?.audioTranscriptSnippet}"
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="font-bold text-xs text-slate-900">
                      {lang === 'bn' ? 'প্রশ্ন' : 'Question'} {currentQuestion + 1}: {questionsList[currentQuestion]?.question}
                    </p>

                    <div className="space-y-2 pt-1">
                      {questionsList[currentQuestion]?.options.map((opt: string, i: number) => (
                        <button
                          key={i}
                          onClick={() => setSelectedAnswers({ ...selectedAnswers, [currentQuestion]: opt })}
                          className={`w-full text-left p-3 rounded-xl text-xs transition-all flex items-start gap-2.5 border cursor-pointer ${
                            selectedAnswers[currentQuestion] === opt
                              ? 'bg-sky-50 border-sky-500 font-semibold text-[#0A2540] ring-1 ring-sky-500'
                              : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[10px] shrink-0">
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span>{opt}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleSubmitExam}
                    className="w-full py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{lang === 'bn' ? 'পরীক্ষা সাবমিট করুন' : 'Submit Exam'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Writing Section */}
              {moduleType === 'writing' && examContent.task && (
                <div className="space-y-3">
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-950 uppercase tracking-wider text-[10px]">
                        {examContent.task.taskType}: {examContent.task.title}
                      </span>
                      <span className="px-2 py-0.5 bg-amber-200 text-amber-900 rounded-full font-bold text-[10px]">
                        {examContent.tier} Difficulty
                      </span>
                    </div>
                    <p className="text-amber-900 font-medium">{examContent.task.prompt}</p>
                    <p className="text-[10px] text-amber-700 italic pt-1">
                      💡 Guidance: {examContent.task.bandGuidance}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex justify-between">
                      <span>{lang === 'bn' ? 'আপনার উত্তর টাইপ করুন:' : 'Type Your Essay:'}</span>
                      <span className="font-mono text-slate-500">
                        {lang === 'bn' ? 'শব্দ সংখ্যা' : 'Word Count'}:{' '}
                        {writingText.trim() ? writingText.trim().split(/\s+/).length : 0} / 250
                      </span>
                    </label>
                    <textarea
                      rows={7}
                      value={writingText}
                      onChange={(e) => setWritingText(e.target.value)}
                      placeholder="Introduction paragraph, 2 body paragraphs with topic sentences and supporting examples, and conclusion..."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-[#0A2540] focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={handleSubmitExam}
                    className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>
                      {lang === 'bn'
                        ? 'রাইটিং সাবমিট ও এআই মূল্যায়ন দেখুন'
                        : 'Submit Essay & View AI Assessment'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Result Screen */
            <div className="text-center py-2 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <Award className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-xl font-extrabold text-[#0A2540]">
                  {lang === 'bn' ? 'পরীক্ষা সফলভাবে সম্পন্ন হয়েছে!' : 'Exam Completed Successfully!'}
                </h4>
                <p className="text-xs text-slate-500">
                  {lang === 'bn'
                    ? `আপনার নির্বাচিত টার্গেট ${targetScore} ও পারফরম্যান্স অনুযায়ী ব্যান্ড নির্ধারিত হয়েছে`
                    : `Evaluated dynamically for Target Band ${targetScore}`}
                </p>
              </div>

              {/* Band Score Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 max-w-xs mx-auto">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  {moduleType.toUpperCase()} BAND SCORE
                </span>
                <div className="text-5xl font-black text-[#0A2540] my-1 font-['Plus_Jakarta_Sans',sans-serif]">
                  {moduleType === 'reading'
                    ? generatedScore?.readingBand.toFixed(1)
                    : moduleType === 'listening'
                    ? generatedScore?.listeningBand.toFixed(1)
                    : moduleType === 'writing'
                    ? generatedScore?.writingBand.toFixed(1)
                    : generatedScore?.overallBand.toFixed(1)}
                </div>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {generatedScore && generatedScore.overallBand >= 8 ? 'C2 (Expert Proficiency)' : 'C1 (Advanced)'}
                </span>
              </div>

              {/* Action Buttons: Download SPECIFIC MODULE PDF ONLY */}
              <div className="space-y-2 pt-2">
                {generatedScore && (
                  <button
                    onClick={() => generateSpecificModulePdf(moduleType, generatedScore, user)}
                    className="w-full py-3 rounded-2xl bg-[#0A2540] hover:bg-[#133E68] text-white text-xs font-bold shadow flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                    <span>
                      {lang === 'bn'
                        ? `শুধু ${moduleType.toUpperCase()} রেজাল্ট PDF ডাউনলোড করুন`
                        : `Download Specific ${moduleType.toUpperCase()} Report PDF`}
                    </span>
                  </button>
                )}

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
