import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Download,
  FileText,
  Award,
  CheckCircle2,
  Calendar,
  User,
  ShieldCheck,
  BarChart3,
} from 'lucide-react';
import { UserProfile, ExamRecord, AppLanguage, SkillCategory } from '../types';
import { generateIeltsPdf, generateSpecificModulePdf } from '../utils/pdfGenerator';

interface TranscriptViewPageProps {
  user: UserProfile;
  examRecord?: ExamRecord | null;
  exam?: ExamRecord | null;
  lang?: AppLanguage;
  onBack: () => void;
}

export const TranscriptViewPage: React.FC<TranscriptViewPageProps> = ({
  user,
  examRecord: propExamRecord,
  exam,
  lang = 'bn',
  onBack,
}) => {
  const examRecord = propExamRecord || exam || null;

  const handleDownloadFullPdf = () => {
    if (examRecord) {
      generateIeltsPdf(examRecord, user);
    }
  };

  const handleDownloadModulePdf = (mod: SkillCategory) => {
    if (examRecord) {
      generateSpecificModulePdf(mod, examRecord, user);
    }
  };

  if (!examRecord) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 pb-16">
        <div className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-20 shadow-xs">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <button
              onClick={onBack}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer font-bold text-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{lang === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}</span>
            </button>
            <h1 className="text-sm font-extrabold text-[#0A2540]">
              {lang === 'bn' ? 'টেস্ট রিপোর্ট ফরম (TRF)' : 'Test Report Form (TRF)'}
            </h1>
            <div className="w-12"></div>
          </div>
        </div>

        <div className="max-w-md mx-auto w-full px-5 py-12 flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-3xl bg-sky-100 flex items-center justify-center text-sky-700 mb-4 shadow-inner">
            <FileText className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-[#0A2540] mb-2">
            {lang === 'bn' ? 'এখনো কোনো টেস্ট রিপোর্ট তৈরি হয়নি' : 'No Test Report Available Yet'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mb-6 max-w-sm">
            {lang === 'bn'
              ? 'একটি মক টেস্ট শেষ করার পর ক্যামব্রিজ এসেসমেন্ট রুব্রিক অনুযায়ী আপনার পূর্ণাঙ্গ ব্যান্ড স্কোর ও অফিসিয়াল TRF এখানে দেখা যাবে।'
              : 'Once you complete any IELTS mock test, your official Cambridge TRF and detailed breakdown will be available here.'}
          </p>
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-2xl bg-[#FF5A36] hover:bg-[#EA580C] text-white text-xs sm:text-sm font-bold shadow-md cursor-pointer transition-all"
          >
            {lang === 'bn' ? 'মক টেস্ট শুরু করুন' : 'Start Mock Test'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 pb-16">
      {/* Top Navigation */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-20 shadow-xs">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer font-bold text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}</span>
          </button>

          <h1 className="text-sm font-extrabold text-[#0A2540]">
            {lang === 'bn' ? 'অফিসিয়াল টেস্ট রিপোর্ট ফরম (TRF)' : 'Official Test Report Form (TRF)'}
          </h1>

          <div className="w-12"></div>
        </div>
      </div>

      {/* Main Certificate / Report Page */}
      <div className="max-w-2xl mx-auto w-full px-4 pt-4 flex-1 space-y-4">
        {/* Certificate Card Container */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-md overflow-hidden">
          {/* Header Banner */}
          <div className="bg-[#0A2540] text-white p-5 text-center relative border-b-4 border-amber-400">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-xs font-black tracking-widest text-amber-400 uppercase">
                CAMBRIDGE ASSESSMENT ENGLISH RUBRIC
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              IELTS DIBO MOCK TEST REPORT FORM
            </h2>
            <p className="text-[11px] text-sky-200 mt-0.5">
              Official Diagnostic Evaluation & Performance Analytics
            </p>
          </div>

          {/* Candidate Info Grid */}
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Candidate Name</span>
                <span className="font-extrabold text-[#0A2540] truncate block">{user.name}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Roll Number</span>
                <span className="font-mono font-bold text-slate-800">{user.rollNumber}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Exam Date</span>
                <span className="font-medium text-slate-700">{examRecord.date}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Target Score</span>
                <span className="font-bold text-amber-600">Band {user.targetScore}</span>
              </div>
            </div>

            {/* Big Overall Band Display */}
            <div className="bg-gradient-to-r from-sky-50 via-white to-sky-50 border border-sky-200 p-4.5 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider block">
                  Overall Band Score (অর্জিত ব্যান্ড)
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Equal weighted aggregate of 4 skills
                </span>
              </div>

              <div className="flex items-baseline gap-1 bg-[#0A2540] text-white px-4 py-2 rounded-2xl shadow-sm">
                <Award className="w-5 h-5 text-amber-400 self-center mr-1" />
                <span className="text-3xl font-black text-amber-300 font-mono">
                  {examRecord.overallBand.toFixed(1)}
                </span>
                <span className="text-xs text-slate-300 font-bold">/ 9.0</span>
              </div>
            </div>

            {/* 4 Skill Score Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { title: 'Listening', score: examRecord.listeningBand, color: 'text-sky-700 bg-sky-50 border-sky-200' },
                { title: 'Reading', score: examRecord.readingBand, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
                { title: 'Writing', score: examRecord.writingBand, color: 'text-amber-700 bg-amber-50 border-amber-200' },
                { title: 'Speaking', score: examRecord.speakingBand, color: 'text-rose-700 bg-rose-50 border-rose-200' },
              ].map((m) => (
                <div key={m.title} className={`p-3 rounded-2xl border text-center ${m.color}`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-600">
                    {m.title}
                  </span>
                  <span className="text-2xl font-black font-mono mt-0.5 block">
                    {m.score.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">CEFR Standard</span>
                </div>
              ))}
            </div>

            {/* Download Actions */}
            <div className="pt-2 space-y-2.5">
              <button
                onClick={handleDownloadFullPdf}
                className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#EA580C] text-white font-black rounded-2xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border-b-4 border-[#C2410C]"
              >
                <Download className="w-4 h-4" />
                <span>{lang === 'bn' ? 'সম্পূর্ণ টেস্ট রিপোর্ট PDF ডাউনলোড করুন' : 'Download Complete Test Report (PDF)'}</span>
              </button>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {(['listening', 'reading', 'writing', 'speaking'] as SkillCategory[]).map((sk) => (
                  <button
                    key={sk}
                    onClick={() => handleDownloadModulePdf(sk)}
                    className="py-2.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-[11px] font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 capitalize"
                  >
                    <FileText className="w-3.5 h-3.5 text-sky-600" />
                    <span>{sk} PDF</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
