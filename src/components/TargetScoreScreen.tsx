import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, Target, Sparkles } from 'lucide-react';
import { CartoonGuide } from './CartoonGuide';

interface TargetScoreScreenProps {
  selectedScore: string;
  onSelectScore: (score: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const SCORE_OPTIONS = ['5.5', '6.0', '6.5', '7.0', '7.5', '8.0', '8.5', '9.0'];

export const TargetScoreScreen: React.FC<TargetScoreScreenProps> = ({
  selectedScore,
  onSelectScore,
  onBack,
  onNext,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-sky-50/40 flex flex-col justify-between text-slate-900 px-4 py-6 selection:bg-rose-500 selection:text-white">
      {/* Top Header / Progress Indicator */}
      <header className="max-w-md mx-auto w-full flex items-center justify-between pt-2 pb-4">
        <button
          onClick={onBack}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          title="ফিরে যান"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Step Indicator */}
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-8 rounded-full bg-[#0A2540]"></div>
          <div className="h-1.5 w-3 rounded-full bg-slate-200"></div>
          <div className="h-1.5 w-3 rounded-full bg-slate-200"></div>
          <div className="h-1.5 w-3 rounded-full bg-slate-200"></div>
        </div>

        <div className="text-xs font-semibold text-slate-400">ধাপ ১ / ৪</div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-md mx-auto w-full flex-1 flex flex-col justify-start relative">
        {/* Top Heading */}
        <div className="text-center my-3">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 bg-sky-100/70 px-3 py-0.5 rounded-full mb-2">
            <Target className="w-3.5 h-3.5" />
            লক্ষ্য নির্ধারণ
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A2540] tracking-tight">
            আপনার টার্গেট স্কোর সিলেক্ট করুন
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            আপনার কাঙ্ক্ষিত ব্যান্ড স্কোর অনুযায়ী মক টেস্টের প্রশ্নমালা সাজানো হবে
          </p>
        </div>

        {/* Score Options Grid arranged around character */}
        <div className="relative mt-4">
          <div className="grid grid-cols-4 gap-2.5 sm:gap-3 pb-32">
            {SCORE_OPTIONS.map((score) => {
              const isSelected = selectedScore === score;
              return (
                <motion.button
                  key={score}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSelectScore(score)}
                  className={`relative p-3.5 sm:p-4 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0A2540] text-white shadow-lg shadow-sky-950/25 ring-2 ring-[#FF5A36] scale-105 z-10'
                      : 'bg-white text-slate-800 hover:bg-sky-50/60 border border-slate-200 shadow-sm'
                  }`}
                >
                  {/* Selected Tick */}
                  {isSelected && (
                    <span className="absolute -top-2 -right-1.5 bg-[#FF5A36] text-white p-0.5 rounded-full shadow">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  )}
                  <span
                    className={`text-xl sm:text-2xl font-black font-['Plus_Jakarta_Sans',sans-serif] ${
                      isSelected ? 'text-amber-300' : 'text-slate-800'
                    }`}
                  >
                    {score}
                  </span>
                  <span
                    className={`text-[10px] mt-0.5 font-medium ${
                      isSelected ? 'text-sky-200' : 'text-slate-500'
                    }`}
                  >
                    {parseFloat(score) >= 8.0
                      ? 'এক্সপার্ট'
                      : parseFloat(score) >= 7.0
                      ? 'উন্নত'
                      : 'স্ট্যান্ডার্ড'}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Friendly Cartoon Mascot standing on the bottom-right corner, pointing up-left */}
          <div className="absolute right-0 bottom-2 z-20 pointer-events-none">
            <CartoonGuide
              pose="pointing-scores"
              message={
                selectedScore
                  ? `টার্গেট ${selectedScore}? চমৎকার লক্ষ্য! এবার নেক্সটে চাপুন।`
                  : 'যেকোনো একটি স্কোরে ক্লিক করুন!'
              }
              size="md"
            />
          </div>
        </div>
      </main>

      {/* Bottom Fixed Navigation: subtle Back button (bottom-left) + highly highlighted Next button (bottom-right) */}
      <footer className="max-w-md mx-auto w-full pt-4 pb-2 border-t border-slate-200/80 flex items-center justify-between gap-4 z-30 bg-white/80 backdrop-blur-md px-2 rounded-2xl">
        {/* Bottom-left: subtle "ব্যাক" button */}
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold text-xs sm:text-sm transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ব্যাক</span>
        </button>

        {/* Bottom-right: highly highlighted "নেক্সট" button (only enabled after selecting a score) */}
        <button
          disabled={!selectedScore}
          onClick={onNext}
          className={`px-7 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer ${
            selectedScore
              ? 'bg-[#FF5A36] hover:bg-[#EA580C] text-white shadow-orange-600/30 scale-100 active:scale-95 border-b-4 border-[#C2410C]'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed border-none'
          }`}
        >
          <span>নেক্সট</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
};
