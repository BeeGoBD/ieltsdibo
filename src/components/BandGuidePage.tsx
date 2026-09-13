import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Award, CheckCircle2, BookOpen } from 'lucide-react';
import { AppLanguage } from '../types';

interface BandGuidePageProps {
  lang?: AppLanguage;
  onBack: () => void;
}

export const BandGuidePage: React.FC<BandGuidePageProps> = ({ lang = 'bn', onBack }) => {
  const bands = [
    {
      score: 'Band 9.0',
      title: 'Expert User (দক্ষতম ব্যবহারকারী)',
      desc: 'Has fully operational command of the language: appropriate, accurate and fluent with complete understanding.',
    },
    {
      score: 'Band 8.0',
      title: 'Very Good User (খুব ভালো ব্যবহারকারী)',
      desc: 'Has fully operational command with only occasional unsystematic inaccuracies. Handles complex detailed argumentation well.',
    },
    {
      score: 'Band 7.0',
      title: 'Good User (ভালো ব্যবহারকারী)',
      desc: 'Has operational command, though with occasional inaccuracies, inappropriate usage and misunderstandings in some situations.',
    },
    {
      score: 'Band 6.0',
      title: 'Competent User (কার্যকর ব্যবহারকারী)',
      desc: 'Generally has effective command of the language despite inaccuracies. Can understand and use fairly complex language.',
    },
    {
      score: 'Band 5.0',
      title: 'Modest User (সীমিত ব্যবহারকারী)',
      desc: 'Has partial command of the language, coping with overall meaning in most situations, though is likely to make many mistakes.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 pb-16">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-20">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer font-bold text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}</span>
          </button>

          <h1 className="text-sm font-extrabold text-[#0A2540]">
            {lang === 'bn' ? 'ক্যামব্রিজ ব্যান্ড গাইড' : 'Cambridge Band Descriptors'}
          </h1>

          <div className="w-12"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto w-full px-4 pt-4 flex-1 space-y-3">
        <div className="bg-[#0A2540] text-white p-5 rounded-3xl space-y-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-sm">
              {lang === 'bn' ? 'অফিসিয়াল আইলস স্কোরিং স্কেল (১-৯)' : 'Official IELTS 9-Band Scale'}
            </h3>
          </div>
          <p className="text-xs text-sky-200 leading-relaxed">
            {lang === 'bn'
              ? 'আইলস পরীক্ষায় প্রতিটি মডিউল (Listening, Reading, Writing, Speaking) এবং সার্বিক স্কোর ১ থেকে ৯ ব্যান্ডের মধ্যে মূল্যায়ন করা হয়।'
              : 'IELTS scores are reported on a 9-band scale, individually for all 4 skills and as an overall band.'}
          </p>
        </div>

        <div className="space-y-2.5">
          {bands.map((b) => (
            <div key={b.score} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-black text-amber-600 font-mono text-sm">{b.score}</span>
                <span className="font-bold text-[#0A2540] text-[11px]">{b.title}</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px] pt-1">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
