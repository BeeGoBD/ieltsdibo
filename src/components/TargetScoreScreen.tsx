import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Target,
  Sparkles,
  Award,
  GraduationCap,
  Clock,
  BookOpen,
  Headphones,
  FileSpreadsheet,
  X,
  ChevronDown,
  ChevronUp,
  Globe2,
  CheckCircle2,
  Zap,
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

interface ScoreDetail {
  score: string;
  titleBn: string;
  titleEn: string;
  badgeBn: string;
  badgeEn: string;
  listeningRaw: string;
  readingRaw: string;
  cefr: string;
  studyWeeks: string;
  dailyHours: string;
  unlocksBn: string;
  unlocksEn: string;
  mascotMsgBn: string;
  mascotMsgEn: string;
  pose: MascotPose;
  isPopular?: boolean;
}

const SCORE_DETAILS: Record<string, ScoreDetail> = {
  '9.0': {
    score: '9.0',
    titleBn: 'এক্সপার্ট ইউজার (Expert Mastery)',
    titleEn: 'Expert User (Full Operational Command)',
    badgeBn: 'বিশ্বসেরা লক্ষ্য 👑',
    badgeEn: 'World Top Tier 👑',
    listeningRaw: '৩৯-৪০ / ৪০',
    readingRaw: '৩৮-৪০ / ৪০',
    cefr: 'C2 Proficient',
    studyWeeks: '৮-১০ সপ্তাহ',
    dailyHours: '২.৫ - ৩ ঘণ্টা',
    unlocksBn: 'হার্ভার্ড, অক্সফোর্ড, ক্যামব্রিজ ও ফুলব্রাইট/শেভেনিং ফুল-ফান্ডেড স্কলারশিপ।',
    unlocksEn: 'Oxford, Cambridge, Ivy League & Chevening/Fulbright scholarships eligibility.',
    mascotMsgBn: 'ওয়াহ! ব্যান্ড ৯.০! হার্ভার্ড ও বিশ্বসেরা স্কলারশিপের অসাধারণ লক্ষ্য!',
    mascotMsgEn: 'Incredible! Band 9.0 is the gold standard for Harvard, Oxford & top fellowships!',
    pose: 'happy-celebrate',
  },
  '8.5': {
    score: '8.5',
    titleBn: 'ভেরি গুড ইউজার (Top Tier)',
    titleEn: 'Very Good User (Top Tier)',
    badgeBn: 'কানাডা PR ম্যাক্স পয়েন্ট',
    badgeEn: 'Max Canada PR Points',
    listeningRaw: '৩৭-৩৮ / ৪০',
    readingRaw: '৩৬-৩৭ / ৪০',
    cefr: 'C2 / C1+',
    studyWeeks: '৬-৮ সপ্তাহ',
    dailyHours: '২ - ২.৫ ঘণ্টা',
    unlocksBn: 'কানাডা এক্সপ্রেস এন্ট্রি সর্বোচ্চ ল্যাঙ্গুয়েজ পয়েন্ট (CLB 10) ও অস্ট্রেলিয়া পিআর।',
    unlocksEn: 'Maximum language points for Canada Express Entry (CLB 10) and Australia PR.',
    mascotMsgBn: 'দারুণ লক্ষ্য! কানাডা এক্সপ্রেস এন্ট্রি ও অস্ট্রেলিয়া পিআর নিশ্চিত করার সেরা স্কোর!',
    mascotMsgEn: 'Brilliant target! Guarantees top points for Canada Express Entry & Australia PR.',
    pose: 'happy-celebrate',
  },
  '8.0': {
    score: '8.0',
    titleBn: 'ভেরি গুড ইউজার (High Achiever)',
    titleEn: 'Very Good User (High Achiever)',
    badgeBn: 'টপ গ্লোবাল ইউনিভার্সিটি 🏆',
    badgeEn: 'Top Global Choice 🏆',
    listeningRaw: '৩৫-৩৬ / ৪০',
    readingRaw: '৩৫-৩৬ / ৪০',
    cefr: 'C1 Advanced',
    studyWeeks: '৫-৭ সপ্তাহ',
    dailyHours: '২ ঘণ্টা',
    unlocksBn: 'ইউকে রাসেল গ্রুপ, আমেরিকার টপ ৫০ বিশ্ববিদ্যালয় ও কানাডা পিআর নিশ্চিতকরণ।',
    unlocksEn: 'UK Russell Group, US Top 50, and Canada Express Entry high tier.',
    mascotMsgBn: 'ব্যান্ড ৮.০! ইউকের রাসেল গ্রুপ ও বিশ্বসেরা বিশ্ববিদ্যালয়গুলোর গোল্ডেন টিকিট!',
    mascotMsgEn: 'Band 8.0! A golden ticket to UK Russell Group & top 50 global universities!',
    pose: 'happy-celebrate',
  },
  '7.5': {
    score: '7.5',
    titleBn: 'গুড ইউজার (Most Preferred)',
    titleEn: 'Good User (Most Preferred)',
    badgeBn: 'সবচেয়ে জনপ্রিয় গোল্ডেন টার্গেট ⭐',
    badgeEn: 'Most Popular Golden Target ⭐',
    listeningRaw: '৩২-৩৪ / ৪০',
    readingRaw: '৩৩-৩৪ / ৪০',
    cefr: 'C1 Advanced',
    studyWeeks: '৪-৬ সপ্তাহ',
    dailyHours: '১.৫ - ২ ঘণ্টা',
    unlocksBn: 'যুক্তরাজ্য, যুক্তরাষ্ট্র ও ইউরোপের ৯৫%+ মাস্টার্স ও স্কলারশিপের কোনো বাধা থাকবে না।',
    unlocksEn: 'No restrictions for 95%+ of UK, US, and European Masters & scholarships.',
    mascotMsgBn: 'টার্গেট ৭.৫! সবচেয়ে জনপ্রিয় ও স্মার্ট পছন্দ — ৯০%+ স্কলারশিপের দরজা খুলে যাবে!',
    mascotMsgEn: 'Target 7.5! The smartest and most popular choice for global scholarships!',
    pose: 'pointing-scores',
    isPopular: true,
  },
  '7.0': {
    score: '7.0',
    titleBn: 'গুড ইউজার (Competent Plus)',
    titleEn: 'Good User (Safe University Target)',
    badgeBn: 'ইউনিভার্সিটি সেফ জোন 🎯',
    badgeEn: 'Safe University Target 🎯',
    listeningRaw: '৩০-৩১ / ৪০',
    readingRaw: '৩০-৩২ / ৪০',
    cefr: 'C1 / B2+',
    studyWeeks: '৩-৫ সপ্তাহ',
    dailyHours: '১.৫ ঘণ্টা',
    unlocksBn: 'বিশ্বের প্রায় সব ভালো বিশ্ববিদ্যালয়ে সরাসরি আনকন্ডিশনাল অফার লেটার।',
    unlocksEn: 'Direct unconditional offer letters for top universities worldwide.',
    mascotMsgBn: 'ব্যান্ড ৭.০! বিশ্বের যেকোনো নামীদামী বিশ্ববিদ্যালয়ে সরাসরি অফারের জন্য পারফেক্ট!',
    mascotMsgEn: 'Band 7.0! Perfect for direct unconditional university admissions globally.',
    pose: 'pointing-scores',
  },
  '6.5': {
    score: '6.5',
    titleBn: 'কম্পিটেন্ট ইউজার (Competent)',
    titleEn: 'Competent User (Standard Entry)',
    badgeBn: 'স্ট্যান্ডার্ড অ্যাডমিশন',
    badgeEn: 'Standard Admission',
    listeningRaw: '২৬-২৯ / ৪০',
    readingRaw: '২৭-২৯ / ৪০',
    cefr: 'B2 Vantage',
    studyWeeks: '৩-৪ সপ্তাহ',
    dailyHours: '১ - ১.৫ ঘণ্টা',
    unlocksBn: 'ইউকে, কানাডা ও ইউরোপের আন্ডারগ্রাজুয়েট ও অধিকাংশ মাস্টার্স প্রোগ্রামে ভর্তির যোগ্যতা।',
    unlocksEn: 'Undergraduate and standard postgraduate admissions across UK, Canada, Australia.',
    mascotMsgBn: 'ব্যান্ড ৬.৫! স্ট্যান্ডার্ড আন্ডারগ্রাজুয়েট ও মাস্টার্স অ্যাডমিশনের নিরাপদ স্কোর!',
    mascotMsgEn: 'Band 6.5! A reliable baseline for undergraduate and postgraduate study.',
    pose: 'thinking',
  },
  '6.0': {
    score: '6.0',
    titleBn: 'কম্পিটেন্ট ইউজার (Work & Diploma)',
    titleEn: 'Competent User (Work & Diploma)',
    badgeBn: 'ডিপ্লোমা ও কাজের ভিসা',
    badgeEn: 'Work Visa & Diploma',
    listeningRaw: '২৩-২৫ / ৪০',
    readingRaw: '২৩-২৬ / ৪০',
    cefr: 'B2',
    studyWeeks: '২-৩ সপ্তাহ',
    dailyHours: '১ ঘণ্টা',
    unlocksBn: 'কমিউনিটি কলেজ, ডিপ্লোমা ও ওয়ার্ক পারমিট ভিসার সাধারণ শর্ত পূরণ।',
    unlocksEn: 'Meets standard requirements for diplomas, trades, and work permits.',
    mascotMsgBn: 'ব্যান্ড ৬.০! ফাউন্ডেশন ও ডিপ্লোমা কোর্সের জন্য একদম সঠিক প্রস্তুতি হবে!',
    mascotMsgEn: 'Band 6.0! A solid entry point for foundation courses and diploma studies.',
    pose: 'thinking',
  },
  '5.5': {
    score: '5.5',
    titleBn: 'মডেস্ট ইউজার (Foundation)',
    titleEn: 'Modest User (Foundation Pathway)',
    badgeBn: 'পাথওয়ে ও ফাউন্ডেশন',
    badgeEn: 'Pathway & Foundation',
    listeningRaw: '১৮-২২ / ৪০',
    readingRaw: '১৯-২২ / ৪০',
    cefr: 'B1 Threshold',
    studyWeeks: '২ সপ্তাহ',
    dailyHours: '১ ঘণ্টা',
    unlocksBn: 'প্রি-সেশনাল ইংলিশ ও ফাউন্ডেশন কোর্সে ভর্তির সাধারণ স্কোর।',
    unlocksEn: 'Pre-sessional and foundational pathway entries.',
    mascotMsgBn: 'ব্যান্ড ৫.৫! পাথওয়ে প্রোগ্রাম ও ল্যাঙ্গুয়েজ সাপোর্টের জন্য ভালো সূচনা!',
    mascotMsgEn: 'Band 5.5! Great starting foundation for pre-sessional pathway courses.',
    pose: 'thinking',
  },
};

const SCORE_OPTIONS = ['5.5', '6.0', '6.5', '7.0', '7.5', '8.0', '8.5', '9.0'];

const PRESET_GOALS = [
  { score: '7.5', labelBn: 'মাস্টার্স ও স্কলারশিপ', labelEn: 'Masters & Scholarship', icon: GraduationCap, tag: 'Most Popular' },
  { score: '8.0', labelBn: 'কানাডা PR / CLB 9', labelEn: 'Canada PR / CLB 9', icon: Globe2, tag: 'High Points' },
  { score: '7.0', labelBn: 'ডাইরেক্ট অ্যাডমিশন', labelEn: 'Direct Admission', icon: Target, tag: 'Safe Target' },
  { score: '6.5', labelBn: 'আন্ডারগ্র্যাড ও ব্যাচেলরস', labelEn: 'Undergraduate', icon: BookOpen, tag: 'Standard' },
];

export const TargetScoreScreen: React.FC<TargetScoreScreenProps> = ({
  selectedScore,
  onSelectScore,
  onBack,
  onNext,
  lang = 'bn',
}) => {
  const isBn = lang === 'bn';
  const [showChartModal, setShowChartModal] = useState(false);

  // If none is selected yet, default insights display to 7.5 (the most popular target)
  const activeScore = selectedScore || '7.5';
  const currentDetail = SCORE_DETAILS[activeScore] || SCORE_DETAILS['7.5'];

  const mascotPose: MascotPose = selectedScore
    ? currentDetail.pose
    : 'pointing-scores';

  const mascotMessage = selectedScore
    ? isBn ? currentDetail.mascotMsgBn : currentDetail.mascotMsgEn
    : isBn
      ? 'আপনার স্বপ্নের ব্যান্ড স্কোর সিলেক্ট করুন! নিচে বিস্তারিত রোডম্যাপ দেখতে পাবেন।'
      : 'Select your dream band score to preview your custom exam roadmap!';

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
          title={isBn ? 'ফিরে যান' : 'Go back'}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden xs:inline">{isBn ? 'পেছনে' : 'Back'}</span>
        </button>

        {/* Step Indicator */}
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-8 sm:w-10 rounded-full bg-[#0A2540] shadow-xs"></div>
          <div className="h-2 w-3 sm:w-4 rounded-full bg-slate-200"></div>
          <div className="h-2 w-3 sm:w-4 rounded-full bg-slate-200"></div>
          <div className="h-2 w-3 sm:w-4 rounded-full bg-slate-200"></div>
        </div>

        <div className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
          {isBn ? 'ধাপ ১ / ৪' : 'Step 1 of 4'}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-xl mx-auto w-full flex-1 flex flex-col justify-start">
        {/* Animated Mascot Guide with Context Speech Bubble */}
        <div className="flex justify-center my-1 sm:my-2">
          <CartoonGuide
            pose={mascotPose}
            message={mascotMessage}
            size="md"
          />
        </div>

        {/* Page Heading */}
        <div className="text-center my-2 sm:my-3">
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-sky-800 bg-sky-100 px-3 py-0.5 rounded-full mb-1.5 border border-sky-200">
            <Target className="w-3.5 h-3.5 text-sky-600" />
            {isBn ? 'ক্যামব্রিজ আইইএলটিএস লক্ষ্য' : 'Cambridge IELTS Target'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0A2540] tracking-tight">
            {isBn ? 'আপনার টার্গেট স্কোর সিলেক্ট করুন' : 'Select Your Target Score'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
            {isBn
              ? 'আপনার কাঙ্ক্ষিত ব্যান্ড অনুযায়ী পরীক্ষার প্রশ্নমালা ও পার্সোনালাইজড রোডম্যাপ প্রস্তুত করা হবে।'
              : 'Your mock tests and AI study roadmap will be calibrated directly to this band score.'}
          </p>
        </div>

        {/* Quick Presets / Goal Shortcuts */}
        <div className="mt-2 mb-3">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              {isBn ? 'জনপ্রিয় লক্ষ্যসমূহ (১-ক্লিকে নির্বাচন)' : 'Popular Goals (1-Click Select)'}
            </span>
            <button
              onClick={() => {
                sound.playClick();
                setShowChartModal(true);
              }}
              className="text-[11px] font-bold text-sky-700 hover:text-sky-900 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <FileSpreadsheet className="w-3 h-3" />
              <span>{isBn ? 'স্কোর চার্ট দেখুন' : 'Raw Score Chart'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESET_GOALS.map((preset) => {
              const Icon = preset.icon;
              const isSelected = selectedScore === preset.score;
              return (
                <button
                  key={preset.score}
                  onClick={() => handleScoreClick(preset.score)}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-400 shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <div className={`p-1 rounded-lg ${isSelected ? 'bg-amber-200 text-amber-900' : 'bg-slate-100 text-slate-600'}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-mono font-black text-xs text-[#0A2540]">
                      {preset.score}
                    </span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-800 leading-tight">
                    {isBn ? preset.labelBn : preset.labelEn}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Enhanced 8-Band Score Selection Grid */}
        <div className="mt-1 mb-3">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {isBn ? 'সব ব্যান্ড স্কোর (৫.৫ - ৯.০)' : 'All Band Scores (5.5 - 9.0)'}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              {selectedScore ? (isBn ? `টার্গেট: ব্যান্ড ${selectedScore}` : `Target: Band ${selectedScore}`) : (isBn ? 'একটি সিলেক্ট করুন' : 'Select one')}
            </span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {SCORE_OPTIONS.map((score) => {
              const isSelected = selectedScore === score;
              const detail = SCORE_DETAILS[score];
              const isHigh = parseFloat(score) >= 8.0;

              return (
                <motion.button
                  key={score}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => handleScoreClick(score)}
                  className={`relative py-3 px-2 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0A2540] text-white shadow-lg shadow-sky-950/20 ring-2 ring-amber-400 scale-105 z-10'
                      : 'bg-white text-slate-800 hover:bg-sky-50/70 border border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  {/* Selected Tick or Popular Badge */}
                  {isSelected ? (
                    <span className="absolute -top-2 -right-1 bg-amber-400 text-slate-950 p-0.5 rounded-full shadow-md">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  ) : detail?.isPopular ? (
                    <span className="absolute -top-2 -right-1 bg-rose-500 text-white text-[8px] font-extrabold px-1 py-0.2 rounded-full shadow-xs">
                      ★
                    </span>
                  ) : null}

                  {/* Score Number */}
                  <span
                    className={`text-xl sm:text-2xl font-black font-['Plus_Jakarta_Sans',sans-serif] tracking-tight ${
                      isSelected ? 'text-amber-300' : 'text-slate-900'
                    }`}
                  >
                    {score}
                  </span>

                  {/* Descriptor tag */}
                  <span
                    className={`text-[10px] mt-0.5 font-bold ${
                      isSelected
                        ? 'text-sky-200'
                        : isHigh
                        ? 'text-purple-700'
                        : 'text-slate-500'
                    }`}
                  >
                    {parseFloat(score) >= 8.5
                      ? isBn ? 'এক্সপার্ট' : 'Expert'
                      : parseFloat(score) >= 7.5
                      ? isBn ? 'টপ চয়েস' : 'Top Choice'
                      : parseFloat(score) >= 7.0
                      ? isBn ? 'উন্নত' : 'Good'
                      : isBn ? 'স্ট্যান্ডার্ড' : 'Standard'}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Target Intelligence & Personalized Readiness Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScore}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3.5 sm:p-4 mb-3"
          >
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-extrabold text-[#0A2540]">
                    {isBn ? `ব্যান্ড ${activeScore} রোডম্যাপ ও টার্গেট` : `Band ${activeScore} Roadmap & Target`}
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-900 font-extrabold px-2 py-0.5 rounded-full border border-emerald-200">
                    {currentDetail.cefr}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  {isBn ? currentDetail.titleBn : currentDetail.titleEn}
                </p>
              </div>

              <span className="text-[11px] font-bold text-amber-900 bg-amber-100 border border-amber-300/80 px-2 py-0.5 rounded-lg shrink-0">
                {isBn ? currentDetail.badgeBn : currentDetail.badgeEn}
              </span>
            </div>

            {/* 3 Key Target Intelligence Badges */}
            <div className="grid grid-cols-3 gap-2 mb-3 text-center">
              <div className="bg-sky-50 border border-sky-100 p-2 rounded-xl">
                <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-sky-800">
                  <Headphones className="w-3 h-3 text-sky-600" />
                  <span>{isBn ? 'লিসেনিং স্কোর' : 'Listening'}</span>
                </div>
                <div className="text-xs sm:text-sm font-black text-sky-950 mt-0.5">
                  {currentDetail.listeningRaw}
                </div>
                <div className="text-[9px] text-sky-600 font-medium">
                  {isBn ? 'সঠিক উত্তর প্রয়োজন' : 'correct answers'}
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-100 p-2 rounded-xl">
                <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-emerald-800">
                  <BookOpen className="w-3 h-3 text-emerald-600" />
                  <span>{isBn ? 'রিডিং স্কোর' : 'Reading'}</span>
                </div>
                <div className="text-xs sm:text-sm font-black text-emerald-950 mt-0.5">
                  {currentDetail.readingRaw}
                </div>
                <div className="text-[9px] text-emerald-600 font-medium">
                  {isBn ? 'সঠিক উত্তর প্রয়োজন' : 'correct answers'}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 p-2 rounded-xl">
                <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-amber-800">
                  <Clock className="w-3 h-3 text-amber-600" />
                  <span>{isBn ? 'দৈনিক সময়' : 'Daily Time'}</span>
                </div>
                <div className="text-xs sm:text-sm font-black text-amber-950 mt-0.5">
                  {currentDetail.dailyHours}
                </div>
                <div className="text-[9px] text-amber-700 font-medium">
                  {currentDetail.studyWeeks}
                </div>
              </div>
            </div>

            {/* What It Unlocks description */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex items-start gap-2 text-xs text-slate-700">
              <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-slate-900 block mb-0.5">
                  {isBn ? 'এই স্কোর দিয়ে যা যা করতে পারবেন:' : 'What this score unlocks:'}
                </strong>
                <span>{isBn ? currentDetail.unlocksBn : currentDetail.unlocksEn}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Fixed Navigation: subtle Back button (bottom-left) + Duolingo-style Highlighted Next button */}
      <footer className="max-w-xl mx-auto w-full pt-3 pb-1 border-t border-slate-200/80 flex items-center justify-between gap-3 z-30 bg-white/95 backdrop-blur-md px-3 rounded-2xl shadow-xs">
        {/* Bottom-left: subtle "ব্যাক" button */}
        <button
          onClick={handleBack}
          className="px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-bold text-xs sm:text-sm transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isBn ? 'ব্যাক' : 'Back'}</span>
        </button>

        {/* Selected target status pill in center */}
        <div className="hidden xs:flex items-center gap-1 text-xs text-slate-500">
          <span>{isBn ? 'নির্বাচিত স্কোর:' : 'Selected:'}</span>
          <span className="font-mono font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
            {selectedScore ? `Band ${selectedScore}` : (isBn ? 'বাছাই করুন' : 'None')}
          </span>
        </div>

        {/* Bottom-right: Duolingo-styled 3D Next button */}
        <button
          disabled={!selectedScore}
          onClick={handleNext}
          className={`px-6 sm:px-8 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            selectedScore
              ? 'bg-[#FF5A36] hover:bg-[#EA580C] text-white shadow-lg shadow-orange-600/30 active:scale-95 border-b-4 border-[#C2410C]'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed border-none'
          }`}
        >
          <span>{isBn ? 'পরবর্তী ধাপ (দুর্বলতা)' : 'Next Step (Weakness)'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </footer>

      {/* Cambridge Official Raw Score Chart Modal */}
      <AnimatePresence>
        {showChartModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 text-slate-800 flex flex-col max-h-[85vh]"
            >
              <div className="bg-[#0A2540] text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base">
                      {isBn ? 'ক্যামব্রিজ আইইএলটিএস অফিসিয়াল স্কোর কনভার্সন' : 'Cambridge IELTS Official Score Conversion'}
                    </h3>
                    <p className="text-[11px] text-sky-200">
                      {isBn ? '৪০ টি প্রশ্নের মধ্যে কতটি সঠিক উত্তর প্রয়োজন' : 'Number of correct answers required out of 40'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowChartModal(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 overflow-y-auto flex-1 text-xs">
                <div className="bg-sky-50 border border-sky-200 rounded-xl p-2.5 mb-3 text-[11px] text-sky-950">
                  {isBn
                    ? '💡 ক্যামব্রিজ আইইএলটিএস লিসেনিং ও রিডিং উভয় মডিউলে মোট ৪০ টি করে প্রশ্ন থাকে। আপনার কাঙ্ক্ষিত ব্যান্ড স্কোরের জন্য নির্ধারিত ন্যূনতম সঠিক উত্তর দেখে নিন:'
                    : '💡 IELTS Listening and Reading modules contain 40 questions each. Review the benchmark raw scores needed for each band score:'}
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <th className="p-2.5">{isBn ? 'ব্যান্ড' : 'Band'}</th>
                        <th className="p-2.5">{isBn ? 'লিসেনিং (৪০ এ)' : 'Listening (/40)'}</th>
                        <th className="p-2.5">{isBn ? 'রিডিং (৪০ এ)' : 'Reading (/40)'}</th>
                        <th className="p-2.5">{isBn ? 'সিইএফআর স্তর' : 'CEFR'}</th>
                        <th className="p-2.5 text-center">{isBn ? 'বাছাই' : 'Select'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[...SCORE_OPTIONS].reverse().map((score) => {
                        const item = SCORE_DETAILS[score];
                        const isCurrent = selectedScore === score;
                        return (
                          <tr
                            key={score}
                            className={`hover:bg-sky-50/50 transition-colors ${
                              isCurrent ? 'bg-amber-50 font-bold text-amber-950' : ''
                            }`}
                          >
                            <td className="p-2.5 font-mono font-black text-sm text-[#0A2540] flex items-center gap-1.5">
                              <span>{score}</span>
                              {score === '7.5' && (
                                <span className="text-[9px] bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded font-bold">
                                  Top
                                </span>
                              )}
                            </td>
                            <td className="p-2.5">{item.listeningRaw}</td>
                            <td className="p-2.5">{item.readingRaw}</td>
                            <td className="p-2.5 text-slate-500">{item.cefr}</td>
                            <td className="p-2.5 text-center">
                              <button
                                onClick={() => {
                                  handleScoreClick(score);
                                  setShowChartModal(false);
                                }}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                                  isCurrent
                                    ? 'bg-amber-500 text-white'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                }`}
                              >
                                {isCurrent ? (isBn ? 'সিলেক্টেড' : 'Selected') : (isBn ? 'বাছুন' : 'Choose')}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
                <button
                  onClick={() => setShowChartModal(false)}
                  className="px-5 py-2 rounded-xl bg-[#0A2540] hover:bg-slate-800 text-white font-bold text-xs cursor-pointer shadow-sm transition-all"
                >
                  {isBn ? 'বুঝেছি' : 'Got it'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
