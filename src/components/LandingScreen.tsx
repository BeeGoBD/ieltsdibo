import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, PlayCircle, Star, Award, CheckCircle, ShieldCheck, Users } from 'lucide-react';
import { TutorialModal } from './TutorialModal';
import { CartoonGuide } from './CartoonGuide';

interface LandingScreenProps {
  onStart: () => void;
  onLogin?: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onStart, onLogin }) => {
  const [showTutorial, setShowTutorial] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-sky-50/40 flex flex-col justify-between text-slate-900 relative selection:bg-rose-500 selection:text-white">
      {/* 1. Top Fixed Highlight Bar (≈10% height) */}
      <header className="sticky top-0 z-40 w-full bg-[#0A2540] text-white shadow-lg border-b border-sky-900/40 px-4 py-3 sm:px-6">
        <div className="max-w-md mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400"></span>
            </span>
            <div className="leading-tight">
              <span className="text-xs sm:text-sm font-bold tracking-tight text-white block">
                মক টেস্ট দিন শুধুমাত্র <span className="text-amber-300 font-extrabold text-sm sm:text-base">৯ টাকায়</span>
              </span>
              <span className="text-[10px] text-sky-200">সীমিত সময়ের বিশেষ অফার</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onLogin && (
              <button
                onClick={onLogin}
                className="px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/20 transition-all cursor-pointer"
              >
                লগইন
              </button>
            )}
            <button
              onClick={onStart}
              className="px-4 py-1.5 sm:px-5 sm:py-2 rounded-full bg-[#FF5A36] hover:bg-[#EA580C] text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-950/20 active:scale-95 transition-all flex items-center space-x-1 shrink-0 cursor-pointer"
            >
              <span>শুরু করুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-md mx-auto w-full px-5 py-6 flex-1 flex flex-col justify-center items-center text-center">
        {/* Brand Tag */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-100/80 border border-sky-200 text-[#0A2540] text-xs font-semibold mb-4 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>বাংলাদেশি আইইএলটিএস শিক্ষার্থীদের বিশ্বস্ত সঙ্গী</span>
        </motion.div>

        {/* Platform Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A2540] tracking-tight mb-2">
          IELTS DIBO (আইলস দিবো)
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xs mb-6 font-medium">
          ক্যামব্রিজ মানের আসল মক টেস্ট দিয়ে যাচাই করুন আপনার প্রস্তুতের সার্বিক অবস্থা
        </p>

        {/* 2. Large Central Section: Huge 9.0 Score Display */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 120 }}
          className="relative my-3 flex flex-col items-center"
        >
          {/* Subtle Glow Ring */}
          <div className="absolute -inset-4 bg-gradient-to-r from-sky-300/40 via-amber-200/40 to-orange-300/40 rounded-full blur-2xl opacity-60 animate-pulse"></div>

          {/* Central Score Card */}
          <div className="relative bg-gradient-to-b from-white to-slate-50 border-4 border-[#0A2540] rounded-3xl p-6 sm:p-8 shadow-[0_12px_32px_rgba(10,37,64,0.14)] w-64 sm:w-72 flex flex-col items-center">
            {/* Top Tag */}
            <div className="absolute -top-3.5 px-3 py-0.5 bg-[#0A2540] text-amber-400 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 shadow">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>টার্গেট ব্যান্ড স্কোর</span>
            </div>

            {/* Huge Number Display */}
            <div className="text-6xl sm:text-7xl font-extrabold tracking-tighter text-[#0A2540] font-['Plus_Jakarta_Sans',sans-serif] leading-none my-2 drop-shadow-sm">
              ৯.০
            </div>

            {/* Subtext */}
            <p className="text-slate-700 text-xs sm:text-sm font-semibold mt-1">
              আপনার স্বপ্নের স্কোর এখন নাগালের মধ্যে
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              নির্ভুল অটোপ্যাক অ্যাসেসমেন্ট ও বিস্তারিত রিপোর্ট শিট
            </p>

            {/* Mini Stat Pills */}
            <div className="mt-4 pt-3 border-t border-slate-200/80 w-full grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-sky-50/80 rounded-xl py-1 px-2 text-sky-900 font-medium text-center">
                <span>লিসেনিং + রিডিং</span>
              </div>
              <div className="bg-amber-50/80 rounded-xl py-1 px-2 text-amber-900 font-medium text-center">
                <span>রাইটিং + স্পিকিং</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Supporting Trust Badges */}
        <div className="flex items-center justify-center gap-4 text-[11px] text-slate-600 my-4">
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>তাত্ক্ষণিক ব্যান্ড স্কোর</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-sky-600" />
            <span>১০,০০০+ সফল পরীক্ষার্থী</span>
          </div>
        </div>

        {/* Action Buttons Section */}
        <div className="w-full max-w-xs space-y-3 mt-2">
          {/* 3. Primary Large CTA Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStart}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#FF5A36] hover:bg-[#EA580C] text-white font-bold text-base shadow-lg shadow-orange-600/25 active:shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer border-b-4 border-[#C2410C]"
          >
            <span>এক্সাম দেওয়া শুরু করুন</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>

          {/* 4. Secondary Smaller Button */}
          <button
            onClick={() => setShowTutorial(true)}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-[#0A2540] border border-slate-300 text-xs font-semibold shadow-sm transition-colors flex items-center justify-center space-x-2 cursor-pointer"
          >
            <PlayCircle className="w-4 h-4 text-rose-500" />
            <span>কীভাবে পরীক্ষা দেবেন? দেখুন</span>
          </button>
        </div>
      </main>

      {/* Subtle Footer with Mascot hint */}
      <footer className="w-full max-w-md mx-auto px-5 py-4 text-center text-[11px] text-slate-400 border-t border-slate-100 flex items-center justify-between">
        <span>© ২০২৬ IELTS DIBO (আইলস দিবো) • সর্বস্বত্ব সংরক্ষিত</span>
        <span className="flex items-center gap-1 text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          ১০০% নিরাপদ প্ল্যাটফর্ম
        </span>
      </footer>

      {/* Video & Platform Tutorial Modal */}
      <TutorialModal
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
        onStartExam={() => {
          setShowTutorial(false);
          onStart();
        }}
      />
    </div>
  );
};
