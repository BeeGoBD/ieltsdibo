import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Target,
} from 'lucide-react';
import { CartoonGuide, MascotPose } from './CartoonGuide';
import { sound } from '../utils/soundEffects';
import { AppLanguage } from '../types';

interface TargetScoreScreenProps {
  selectedScore: string;
  onSelectScore: (score: string) => void;
  onBack: () => void;
  onNext: () => void;
  lang?: AppLanguage;
}

interface ScoreMascotInfo {
  mascotMsgBn: string;
  mascotMsgEn: string;
  pose: MascotPose;
  labelBn: string;
  labelEn: string;
}

const SCORE_OPTIONS = ['5.5', '6.0', '6.5', '7.0', '7.5', '8.0', '8.5', '9.0'];

const SCORE_INFO: Record<string, ScoreMascotInfo> = {
  '9.0': {
    labelBn: 'এক্সপার্ট (৯.০)',
    labelEn: 'Expert',
    mascotMsgBn: 'ওয়াহ! ব্যান্ড ৯.০! হার্ভার্ড ও বিশ্বসেরা স্কলারশিপের অসাধারণ লক্ষ্য!',
    mascotMsgEn: 'Incredible! Band 9.0 is the gold standard for Harvard, Oxford & top fellowships!',
    pose: 'happy-celebrate',
  },
  '8.5': {
    labelBn: 'ভেরি গুড (৮.৫)',
    labelEn: 'Very Good',
    mascotMsgBn: 'দারুণ লক্ষ্য! কানাডা এক্সপ্রেস এন্ট্রি ও অস্ট্রেলিয়া পিআর নিশ্চিত করার সেরা স্কোর!',
    mascotMsgEn: 'Brilliant target! Guarantees top points for Canada Express Entry & Australia PR.',
    pose: 'happy-celebrate',
  },
  '8.0': {
    labelBn: 'ভেরি গুড (৮.০)',
    labelEn: 'High Achiever',
    mascotMsgBn: 'ব্যান্ড ৮.০! ইউকের রাসেল গ্রুপ ও বিশ্বসেরা বিশ্ববিদ্যালয়গুলোর গোল্ডেন টিকিট!',
    mascotMsgEn: 'Band 8.0! A golden ticket to UK Russell Group & top 50 global universities!',
    pose: 'happy-celebrate',
  },
  '7.5': {
    labelBn: 'টপ চয়েস (৭.৫)',
    labelEn: 'Top Choice',
    mascotMsgBn: 'টার্গেট ৭.৫! সবচেয়ে জনপ্রিয় ও স্মার্ট পছন্দ — ৯০%+ স্কলারশিপের দরজা খুলে যাবে!',
    mascotMsgEn: 'Target 7.5! The smartest and most popular choice for global scholarships!',
    pose: 'pointing-scores',
  },
  '7.0': {
    labelBn: 'উন্নত (৭.০)',
    labelEn: 'Good',
    mascotMsgBn: 'ব্যান্ড ৭.০! বিশ্বের যেকোনো নামীদামী বিশ্ববিদ্যালয়ে সরাসরি অফারের জন্য পারফেক্ট!',
    mascotMsgEn: 'Band 7.0! Perfect for direct unconditional university admissions globally.',
    pose: 'pointing-scores',
  },
  '6.5': {
    labelBn: 'স্ট্যান্ডার্ড (৬.৫)',
    labelEn: 'Standard',
    mascotMsgBn: 'ব্যান্ড ৬.৫! স্ট্যান্ডার্ড আন্ডারগ্রাজুয়েট ও মাস্টার্স অ্যাডমিশনের নিরাপদ স্কোর!',
    mascotMsgEn: 'Band 6.5! A reliable baseline for undergraduate and postgraduate study.',
    pose: 'thinking',
  },
  '6.0': {
    labelBn: 'বেসিক (৬.০)',
    labelEn: 'Competent',
    mascotMsgBn: 'ব্যান্ড ৬.০! ফাউন্ডেশন ও ডিপ্লোমা কোর্সের জন্য একদম সঠিক প্রস্তুতি হবে!',
    mascotMsgEn: 'Band 6.0! A solid entry point for foundation courses and diploma studies.',
    pose: 'thinking',
  },
  '5.5': {
    labelBn: 'ফাউন্ডেশন (৫.৫)',
    labelEn: 'Foundation',
    mascotMsgBn: 'ব্যান্ড ৫.৫! পাথওয়ে প্রোগ্রাম ও ল্যাঙ্গুয়েজ সাপোর্টের জন্য ভালো সূচনা!',
    mascotMsgEn: 'Band 5.5! Great starting foundation for pre-sessional pathway courses.',
    pose: 'thinking',
  },
};

export const TargetScoreScreen: React.FC<TargetScoreScreenProps> = ({
  selectedScore,
  onSelectScore,
  onBack,
  onNext,
  lang = 'bn',
}) => {
  const isBn = lang === 'bn';

  const currentInfo = selectedScore ? SCORE_INFO[selectedScore] : null;

  const mascotPose: MascotPose = currentInfo ? currentInfo.pose : 'pointing-scores';
  const mascotMessage = currentInfo
    ? isBn
      ? currentInfo.mascotMsgBn
      : currentInfo.mascotMsgEn
    : isBn
    ? 'আপনার কাঙ্ক্ষিত ব্যান্ড স্কোর সিলেক্ট করুন।'
    : 'Select your target band score.';

  const handleScoreClick = (score: string) => {
    const numeric = parseFloat(score);
    if (numeric >= 8.0) {
      sound.playStreak();
    } else {
      sound.playSelect();
    }
    onSelectScore(score);
  };

  const handleNext = () => {
    sound.playClick();
    onNext();
  };

  const handleBack = () => {
    sound.playClick();
    onBack();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-sky-50/50 flex flex-col justify-between text-slate-900 px-3 sm:px-4 py-4 sm:py-6 selection:bg-rose-500 selection:text-white">
      {/* Top Header / Progress Indicator */}
      <header className="max-w-xl mx-auto w-full flex items-center justify-between pt-1 pb-3">
        <button
          onClick={handleBack}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden xs:inline">{isBn ? 'হোম' : 'Home'}</span>
        </button>

        {/* Step Indicator (Step 1 of 4) */}
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-8 sm:w-10 rounded-full bg-[#0A2540]"></div>
          <div className="h-2 w-3 sm:w-4 rounded-full bg-slate-200"></div>
          <div className="h-2 w-3 sm:w-4 rounded-full bg-slate-200"></div>
          <div className="h-2 w-3 sm:w-4 rounded-full bg-slate-200"></div>
        </div>

        <div className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
          {isBn ? 'ধাপ ১ / ৪' : 'Step 1 of 4'}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-xl mx-auto w-full flex-1 flex flex-col justify-center my-auto py-3">
        {/* Animated Mascot Guide */}
        <div className="flex justify-center mb-3">
          <CartoonGuide pose={mascotPose} message={mascotMessage} size="md" />
        </div>

        {/* Heading */}
        <div className="text-center mb-5">
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-sky-800 bg-sky-100 px-3 py-0.5 rounded-full mb-1.5 border border-sky-200">
            <Target className="w-3.5 h-3.5 text-sky-600" />
            {isBn ? 'টার্গেট ব্যান্ড স্কোর' : 'Target Band Score'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0A2540] tracking-tight">
            {isBn ? 'আপনার টার্গেট স্কোর সিলেক্ট করুন' : 'Select Your Target Score'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
            {isBn
              ? 'আপনার কাঙ্ক্ষিত ব্যান্ড অনুযায়ী পরীক্ষার প্রস্তুতি সাজানো হবে।'
              : 'Your practice and exam preparation will be calibrated to this score.'}
          </p>
        </div>

        {/* Clean 8-Band Score Selection Grid */}
        <div className="my-2">
          <div className="grid grid-cols-4 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {SCORE_OPTIONS.map((score) => {
              const isSelected = selectedScore === score;
              const info = SCORE_INFO[score];
              const isHigh = parseFloat(score) >= 8.0;

              return (
                <motion.button
                  key={score}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleScoreClick(score)}
                  className={`relative py-4 px-3 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'bg-[#0A2540] text-white shadow-lg shadow-sky-950/20 ring-2 ring-amber-400 scale-[1.02] z-10'
                      : 'bg-white text-slate-800 hover:bg-sky-50/70 border-2 border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  {/* Selected Tick Indicator */}
                  {isSelected && (
                    <span className="absolute -top-2 -right-1 bg-amber-400 text-slate-950 p-0.5 rounded-full shadow-md">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  )}

                  {/* Score Number */}
                  <span
                    className={`text-2xl sm:text-3xl font-black font-['Plus_Jakarta_Sans',sans-serif] tracking-tight ${
                      isSelected ? 'text-amber-300' : 'text-slate-900'
                    }`}
                  >
                    {score}
                  </span>

                  {/* Descriptor tag */}
                  <span
                    className={`text-[11px] mt-1 font-bold ${
                      isSelected
                        ? 'text-sky-200'
                        : isHigh
                        ? 'text-purple-700'
                        : 'text-slate-500'
                    }`}
                  >
                    {info ? (isBn ? info.labelBn : info.labelEn) : score}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Bottom Fixed Navigation */}
      <footer className="max-w-xl mx-auto w-full pt-3 pb-2 flex items-center justify-between gap-3 z-30">
        {/* Bottom-left: Back button */}
        <button
          onClick={handleBack}
          className="px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-bold text-xs sm:text-sm transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isBn ? 'ব্যাক' : 'Back'}</span>
        </button>

        {/* Selected target status pill in center */}
        <div className="hidden xs:flex items-center gap-1 text-xs text-slate-500">
          <span>{isBn ? 'নির্বাচিত:' : 'Selected:'}</span>
          <span className="font-mono font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
            {selectedScore ? `Band ${selectedScore}` : isBn ? 'বাছাই করুন' : 'None'}
          </span>
        </div>

        {/* Bottom-right: Next button */}
        <button
          disabled={!selectedScore}
          onClick={handleNext}
          className={`px-6 sm:px-8 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            selectedScore
              ? 'bg-[#FF5A36] hover:bg-[#EA580C] text-white shadow-lg shadow-orange-600/30 active:scale-95 border-b-4 border-[#C2410C]'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed border-none'
          }`}
        >
          <span>{isBn ? 'পরবর্তী ধাপ' : 'Next Step'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
};
