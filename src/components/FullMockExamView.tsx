import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  Award,
  ChevronRight,
  Download,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, ExamRecord, AppLanguage } from '../types';
import { generateExamReportPdf } from '../utils/pdfGenerator';
import { ExamPageView } from './ExamPageView';
import { SpeakingExamPageView } from './SpeakingExamPageView';

interface FullMockExamViewProps {
  user: UserProfile;
  lang?: AppLanguage;
  onBack: () => void;
  onExamComplete: (record: ExamRecord) => void;
  onViewFullReport?: (record: ExamRecord) => void;
  onSubscribe?: (planId: string) => void;
}

export const FullMockExamView: React.FC<FullMockExamViewProps> = ({
  user,
  lang = 'bn',
  onBack,
  onExamComplete,
  onViewFullReport,
  onSubscribe,
}) => {
  // Stages: 'intro' | 'listening' | 'reading' | 'writing' | 'speaking' | 'completed'
  const [currentStage, setCurrentStage] = useState<
    'intro' | 'listening' | 'reading' | 'writing' | 'speaking' | 'completed'
  >('intro');

  const [scores, setScores] = useState<{
    listening: number;
    reading: number;
    writing: number;
    speaking: number;
  }>({
    listening: 7.0,
    reading: 7.0,
    writing: 6.5,
    speaking: 7.0,
  });

  const [finalRecord, setFinalRecord] = useState<ExamRecord | null>(null);

  // Cambridge rounding rule for overall band
  const computeCambridgeOverall = (l: number, r: number, w: number, s: number): number => {
    const avg = (l + r + w + s) / 4;
    const fraction = avg - Math.floor(avg);
    if (fraction < 0.25) return Math.floor(avg);
    if (fraction < 0.75) return Math.floor(avg) + 0.5;
    return Math.ceil(avg);
  };

  const handleModuleFinished = (skill: 'listening' | 'reading' | 'writing' | 'speaking', record: ExamRecord) => {
    const band = record.overallBand || 6.5;
    const updated = { ...scores, [skill]: band };
    setScores(updated);

    if (skill === 'listening') {
      setCurrentStage('reading');
    } else if (skill === 'reading') {
      setCurrentStage('writing');
    } else if (skill === 'writing') {
      setCurrentStage('speaking');
    } else if (skill === 'speaking') {
      const overall = computeCambridgeOverall(
        updated.listening,
        updated.reading,
        updated.writing,
        band
      );

      const fullMockRecord: ExamRecord = {
        id: 'MOCK-' + Date.now().toString().slice(-6),
        serialNumber: Math.floor(1000 + Math.random() * 9000),
        examTitle: 'Cambridge Official 3-Hour Complete Mock Test',
        examType: 'full_mock',
        date: new Date().toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        overallBand: overall,
        listeningBand: updated.listening,
        readingBand: updated.reading,
        writingBand: updated.writing,
        speakingBand: band,
        status: 'completed',
      };

      setFinalRecord(fullMockRecord);
      setCurrentStage('completed');
      onExamComplete(fullMockRecord);

      try {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      } catch (e) {}
    }
  };

  const stagesList = [
    { key: 'listening', title: 'Listening', time: '30 mins' },
    { key: 'reading', title: 'Reading', time: '60 mins' },
    { key: 'writing', title: 'Writing', time: '60 mins' },
    { key: 'speaking', title: 'Speaking', time: '15 mins' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center">
      {currentStage === 'intro' ? (
        <div className="w-full max-w-2xl min-h-screen bg-white p-6 flex flex-col justify-between shadow-xl">
          <header className="flex items-center justify-between border-b border-slate-200 pb-4">
            <button
              onClick={onBack}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0A2540]">
              Cambridge 3-Hour Simulation
            </span>
          </header>

          <div className="my-auto space-y-6 text-center max-w-md mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-[#0A2540] text-amber-400 flex items-center justify-center mx-auto shadow-md">
              <Award className="w-10 h-10" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-[#0A2540]">
                {lang === 'bn' ? 'সম্পূর্ণ ৩-ঘণ্টার অফিসিয়াল আইইএলটিএস মক টেস্ট' : 'Official Cambridge 3-Hour Mock Test'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {lang === 'bn'
                  ? 'ধারাবাহিকভাবে লিসেনিং, রিডিং, রাইটিং এবং স্পিকিং অনুষ্ঠিত হবে এবং সর্বশেষে অফিসিয়াল TRF প্রদান করা হবে।'
                  : 'Take all 4 components sequentially with authentic Cambridge time limits and AI Examiner.'}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-3">
              <span className="text-xs font-bold text-slate-800 block">Exam Sequence:</span>
              <div className="space-y-2">
                {stagesList.map((st, i) => (
                  <div
                    key={st.key}
                    className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 text-xs font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#0A2540] text-white flex items-center justify-center text-[10px] font-bold">
                        {i + 1}
                      </span>
                      <span className="font-bold text-slate-900">{st.title} Test</span>
                    </div>
                    <span className="text-slate-500 font-mono text-[11px]">{st.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setCurrentStage('listening')}
              className="w-full py-4 bg-[#0A2540] hover:bg-slate-800 text-white rounded-2xl font-black text-sm shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{lang === 'bn' ? 'প্রথম পর্ব (লিসেনিং) শুরু করুন' : 'Begin Section 1: Listening'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center text-[11px] text-slate-400">
            Candidate: {user.name} • Roll: {user.rollNumber} • Target Band: {user.targetScore}
          </div>
        </div>
      ) : currentStage === 'listening' ? (
        <ExamPageView
          moduleType="listening"
          user={user}
          lang={lang}
          onBack={onBack}
          onExamComplete={(rec) => handleModuleFinished('listening', rec)}
          onSubscribe={onSubscribe}
        />
      ) : currentStage === 'reading' ? (
        <ExamPageView
          moduleType="reading"
          user={user}
          lang={lang}
          onBack={onBack}
          onExamComplete={(rec) => handleModuleFinished('reading', rec)}
          onSubscribe={onSubscribe}
        />
      ) : currentStage === 'writing' ? (
        <ExamPageView
          moduleType="writing"
          user={user}
          lang={lang}
          onBack={onBack}
          onExamComplete={(rec) => handleModuleFinished('writing', rec)}
          onSubscribe={onSubscribe}
        />
      ) : currentStage === 'speaking' ? (
        <SpeakingExamPageView
          user={user}
          lang={lang}
          onBack={onBack}
          onExamComplete={(rec) => handleModuleFinished('speaking', rec)}
          onSubscribe={onSubscribe}
        />
      ) : (
        /* FULL MOCK COMPLETED: OFFICIAL CUMULATIVE TRF */
        <div className="w-full max-w-xl min-h-screen bg-white p-6 flex flex-col justify-between shadow-2xl my-auto">
          <header className="text-center space-y-1">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-[#0A2540]">
              {lang === 'bn' ? 'আইইএলটিএস অফিসিয়াল রেজাল্ট সম্পন্ন!' : 'Test Report Form (TRF) Generated!'}
            </h2>
            <p className="text-xs text-slate-500">
              Cambridge English Language Assessment & British Council Standard
            </p>
          </header>

          <div className="my-6 space-y-4">
            <div className="bg-gradient-to-br from-[#0A2540] to-slate-900 text-white rounded-3xl p-6 shadow-xl text-center space-y-3 border border-sky-900">
              <span className="text-[11px] font-bold text-sky-200 uppercase tracking-widest block">
                OVERALL CUMULATIVE BAND SCORE
              </span>
              <div className="text-7xl font-black text-amber-300 font-mono">
                {finalRecord?.overallBand.toFixed(1)}
              </div>
              <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-sky-200">
                Official CEFR Level:{' '}
                {finalRecord && finalRecord.overallBand >= 8.0
                  ? 'C2'
                  : finalRecord && finalRecord.overallBand >= 7.0
                  ? 'C1'
                  : 'B2'}
              </span>

              {/* 4 Skill Score Badges */}
              <div className="grid grid-cols-4 gap-2 pt-4 border-t border-white/10">
                <div className="bg-white/10 p-2.5 rounded-xl">
                  <span className="text-[10px] text-sky-200 block">Listening</span>
                  <span className="text-amber-300 font-bold text-base font-mono">
                    {finalRecord?.listeningBand.toFixed(1)}
                  </span>
                </div>
                <div className="bg-white/10 p-2.5 rounded-xl">
                  <span className="text-[10px] text-sky-200 block">Reading</span>
                  <span className="text-amber-300 font-bold text-base font-mono">
                    {finalRecord?.readingBand.toFixed(1)}
                  </span>
                </div>
                <div className="bg-white/10 p-2.5 rounded-xl">
                  <span className="text-[10px] text-sky-200 block">Writing</span>
                  <span className="text-amber-300 font-bold text-base font-mono">
                    {finalRecord?.writingBand.toFixed(1)}
                  </span>
                </div>
                <div className="bg-white/10 p-2.5 rounded-xl">
                  <span className="text-[10px] text-sky-200 block">Speaking</span>
                  <span className="text-amber-300 font-bold text-base font-mono">
                    {finalRecord?.speakingBand.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Candidate Credentials Box */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1.5 text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Candidate Name:</span>
                <span className="font-bold text-[#0A2540]">{user.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Candidate Number:</span>
                <span className="font-mono font-bold">{user.rollNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Target Score:</span>
                <span className="font-bold text-sky-700">Band {user.targetScore}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Test Report Date:</span>
                <span className="font-mono">{finalRecord?.date}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {finalRecord && (
              <button
                onClick={() => generateExamReportPdf(finalRecord, user)}
                className="w-full py-4 bg-[#0A2540] hover:bg-slate-800 text-white rounded-2xl font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>
                  {lang === 'bn' ? 'অফিসিয়াল TRF সার্টিফিকেট PDF ডাউনলোড' : 'Download Cambridge TRF PDF'}
                </span>
              </button>
            )}

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
  );
};
