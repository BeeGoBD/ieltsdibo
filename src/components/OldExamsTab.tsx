import React, { useState } from 'react';
import {
  Download,
  Calendar,
  Clock,
  Award,
  FileText,
  CheckCircle2,
  ChevronDown,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  Sparkles,
} from 'lucide-react';
import { ExamRecord, UserProfile, AppLanguage, SkillCategory } from '../types';
import {
  generateExamReportPdf,
  generateSpecificModulePdf,
  generateAllRecordsPdf,
} from '../utils/pdfGenerator';

interface OldExamsTabProps {
  exams: ExamRecord[];
  user: UserProfile;
  lang?: AppLanguage;
  onTakeExam: () => void;
}

export const OldExamsTab: React.FC<OldExamsTabProps> = ({
  exams,
  user,
  lang = 'bn',
  onTakeExam,
}) => {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const handleDownloadSpecific = (mod: SkillCategory, exam: ExamRecord) => {
    generateSpecificModulePdf(mod, exam, user);
    setOpenDropdownId(null);
  };

  return (
    <div className="space-y-4 pb-28">
      {/* 1. Header Banner */}
      <div className="bg-white p-4.5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider block">
              {lang === 'bn' ? 'হিস্টোরি ও রেজাল্ট শিট' : 'History & TRF Records'}
            </span>
            <h2 className="text-base font-extrabold text-[#0A2540]">
              {lang === 'bn'
                ? 'পুরাতন পরীক্ষার ফলাফল (Old Exam Section)'
                : 'Previous Mock Exam Archive'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === 'bn'
                ? 'আপনার পূর্ববর্তী সকল মক টেস্টের স্কোর ও অফিশিয়াল PDF সংরক্ষিত রয়েছে'
                : 'All your past scores, single-skill reports, and cumulative transcripts.'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-sky-50 flex items-center justify-center text-[#0A2540] shrink-0">
            <FileText className="w-5 h-5 text-sky-600" />
          </div>
        </div>

        {/* Big Prominent ALL RECORDS PDF Button */}
        {exams.length > 0 && (
          <button
            onClick={() => generateAllRecordsPdf(exams, user)}
            className="w-full py-2.5 px-4 rounded-2xl bg-[#0A2540] hover:bg-slate-800 text-white text-xs font-bold shadow flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>
              {lang === 'bn'
                ? 'সকল পরীক্ষার সমন্বিত PDF ডাউনলোড করুন (All Records PDF)'
                : 'Download All Records Cumulative Transcript PDF'}
            </span>
          </button>
        )}
      </div>

      {/* 2. Exam List */}
      {exams.length === 0 ? (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-3">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">
            {lang === 'bn' ? 'কোনো পুরাতন পরীক্ষা পাওয়া যায়নি' : 'No previous exams recorded'}
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            {lang === 'bn'
              ? 'আপনি এখনও কোনো মক টেস্ট সম্পন্ন করেননি। প্রথম মক টেস্ট দিয়ে আপনার প্রস্তুতি যাচাই করুন।'
              : 'You have not taken any mock test yet. Take your first exam to verify your band score.'}
          </p>
          <button
            onClick={onTakeExam}
            className="px-5 py-2.5 rounded-2xl bg-[#FF5A36] text-white text-xs font-bold shadow hover:bg-[#EA580C] cursor-pointer"
          >
            {lang === 'bn' ? 'প্রথম মক টেস্ট দিন' : 'Start First Mock Exam'}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white p-4.5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3"
            >
              {/* Top row: Serial #, Date, Time & Band Score */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 bg-[#0A2540] text-amber-300 font-mono text-[11px] font-bold rounded-xl">
                    #{exam.serialNumber}
                  </span>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">{exam.examTitle}</h4>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {exam.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {exam.time}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Band Score */}
                <div className="text-right flex flex-col items-end">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">
                    {lang === 'bn' ? 'ব্যান্ড স্কোর' : 'Band Score'}
                  </span>
                  <div className="px-3 py-0.5 bg-sky-50 border border-sky-200 rounded-xl text-lg font-black text-[#0A2540] font-['Plus_Jakarta_Sans',sans-serif]">
                    {exam.overallBand.toFixed(1)}
                  </div>
                </div>
              </div>

              {/* Breakdown Grid with Individual PDF Clickers */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase">
                  <span>
                    {lang === 'bn'
                      ? 'মডিউলে ক্লিক করে শুধু সেই বিষয়ের PDF নামান:'
                      : 'Tap skill to download specific PDF:'}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-1.5 text-center text-[11px]">
                  {/* Listening */}
                  <button
                    onClick={() => handleDownloadSpecific('listening', exam)}
                    className="bg-sky-50/80 hover:bg-sky-100 border border-sky-200 p-2 rounded-xl transition-all cursor-pointer text-left flex flex-col items-center justify-center group"
                    title="শুধু Listening PDF ডাউনলোড করুন"
                  >
                    <div className="flex items-center gap-1 text-[10px] text-sky-700 font-bold">
                      <Headphones className="w-3 h-3" />
                      <span>L</span>
                    </div>
                    <span className="font-extrabold text-sm text-sky-900 font-mono">
                      {exam.listeningBand.toFixed(1)}
                    </span>
                    <span className="text-[9px] text-sky-600 flex items-center gap-0.5 mt-0.5 group-hover:underline">
                      <Download className="w-2.5 h-2.5" /> PDF
                    </span>
                  </button>

                  {/* Reading */}
                  <button
                    onClick={() => handleDownloadSpecific('reading', exam)}
                    className="bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200 p-2 rounded-xl transition-all cursor-pointer text-left flex flex-col items-center justify-center group"
                    title="শুধু Reading PDF ডাউনলোড করুন"
                  >
                    <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold">
                      <BookOpen className="w-3 h-3" />
                      <span>R</span>
                    </div>
                    <span className="font-extrabold text-sm text-emerald-900 font-mono">
                      {exam.readingBand.toFixed(1)}
                    </span>
                    <span className="text-[9px] text-emerald-600 flex items-center gap-0.5 mt-0.5 group-hover:underline">
                      <Download className="w-2.5 h-2.5" /> PDF
                    </span>
                  </button>

                  {/* Writing */}
                  <button
                    onClick={() => handleDownloadSpecific('writing', exam)}
                    className="bg-amber-50/80 hover:bg-amber-100 border border-amber-200 p-2 rounded-xl transition-all cursor-pointer text-left flex flex-col items-center justify-center group"
                    title="শুধু Writing PDF ডাউনলোড করুন"
                  >
                    <div className="flex items-center gap-1 text-[10px] text-amber-700 font-bold">
                      <PenTool className="w-3 h-3" />
                      <span>W</span>
                    </div>
                    <span className="font-extrabold text-sm text-amber-900 font-mono">
                      {exam.writingBand.toFixed(1)}
                    </span>
                    <span className="text-[9px] text-amber-600 flex items-center gap-0.5 mt-0.5 group-hover:underline">
                      <Download className="w-2.5 h-2.5" /> PDF
                    </span>
                  </button>

                  {/* Speaking */}
                  <button
                    onClick={() => handleDownloadSpecific('speaking', exam)}
                    className="bg-rose-50/80 hover:bg-rose-100 border border-rose-200 p-2 rounded-xl transition-all cursor-pointer text-left flex flex-col items-center justify-center group"
                    title="শুধু Speaking PDF ডাউনলোড করুন"
                  >
                    <div className="flex items-center gap-1 text-[10px] text-rose-700 font-bold">
                      <Mic className="w-3 h-3" />
                      <span>S</span>
                    </div>
                    <span className="font-extrabold text-sm text-rose-900 font-mono">
                      {exam.speakingBand.toFixed(1)}
                    </span>
                    <span className="text-[9px] text-rose-600 flex items-center gap-0.5 mt-0.5 group-hover:underline">
                      <Download className="w-2.5 h-2.5" /> PDF
                    </span>
                  </button>
                </div>
              </div>

              {/* Bottom Action: Full Mock TRF Download */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {lang === 'bn' ? 'যাচাইকৃত রেজাল্ট' : 'Certified Evaluation'}
                </span>

                <button
                  onClick={() => generateExamReportPdf(exam, user)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>{lang === 'bn' ? 'সম্পূর্ণ TRF PDF' : 'Full TRF PDF'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
