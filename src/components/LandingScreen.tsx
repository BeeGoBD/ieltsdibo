import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  PlayCircle,
  Star,
  Award,
  CheckCircle2,
  ShieldCheck,
  Users,
  Headphones,
  BookOpen,
  PenTool,
  Mic,
  Globe,
  Zap,
  TrendingUp,
  Wallet,
  Lock,
  ChevronRight,
  Check,
  GraduationCap,
  Layers,
  FileCheck,
  Clock,
  LogIn,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { TutorialModal } from './TutorialModal';
import { SoundControlModal } from './SoundControlModal';
import { sound } from '../utils/soundEffects';
import { AppLanguage } from '../types';

interface LandingScreenProps {
  lang?: AppLanguage;
  onToggleLanguage?: () => void;
  onStart: () => void;
  onStartTrial?: () => void;
  onLogin?: () => void;
  onDirectDemoLogin?: () => void;
  onExploreBandGuide?: () => void;
  onExplorePricing?: () => void;
}

interface BandProfile {
  score: string;
  bnScore: string;
  tierEn: string;
  tierBn: string;
  cefr: string;
  hardRatio: number;
  medRatio: number;
  easyRatio: number;
  highlightEn: string;
  highlightBn: string;
  descEn: string;
  descBn: string;
}

const BAND_PROFILES: BandProfile[] = [
  {
    score: '6.0',
    bnScore: '৬.০',
    tierEn: 'Competent',
    tierBn: 'বেসিক প্রস্তুতি',
    cefr: 'B2 Vantage',
    hardRatio: 15,
    medRatio: 45,
    easyRatio: 40,
    highlightEn: 'Effective operational command with occasional inaccuracies.',
    highlightBn: 'দৈনন্দিন ও স্ট্যান্ডার্ড একাডেমিক প্রশ্নের সহজ সমাধান।',
    descEn: 'Focus on core grammar accuracy and clear sentence construction without excessive complexity.',
    descBn: 'বেসিক ব্যাকরণ ও সুস্পষ্ট বাক্যের ওপর ভিত্তি করে নিশ্চিত স্কোর তৈরি করা।',
  },
  {
    score: '6.5',
    bnScore: '৬.৫',
    tierEn: 'Standard High',
    tierBn: 'স্ট্যান্ডার্ড স্কোর',
    cefr: 'B2+ Competent',
    hardRatio: 25,
    medRatio: 55,
    easyRatio: 20,
    highlightEn: 'Satisfies most UK, Canadian & Australian university requirements.',
    highlightBn: 'যুক্তরাজ্য, কানাডা ও অস্ট্রেলিয়ার বেশিরভাগ বিশ্ববিদ্যালয়ের রিকোয়ারমেন্ট।',
    descEn: 'Balances speed with inference skills in reading and structured Task 2 essays.',
    descBn: 'রিডিংয়ে অনুসিদ্ধান্ত ক্ষমতা এবং সুবিন্যস্ত রাইটিং টাস্ক ২ আর্ট গঠন।',
  },
  {
    score: '7.0',
    bnScore: '৭.০',
    tierEn: 'Good User',
    tierBn: 'স্মার্ট স্কোর',
    cefr: 'C1 Advanced',
    hardRatio: 40,
    medRatio: 45,
    easyRatio: 15,
    highlightEn: 'Operational command of complex language and nuanced topics.',
    highlightBn: 'জটিল একাডেমিক টপিকস ও উন্নত ভোকাবুলারি ব্যবহারে স্বাচ্ছন্দ্য।',
    descEn: 'Handling complex academic passages, flexible cohesive devices, and natural speaking flow.',
    descBn: 'জটিল অনুচ্ছেদের গভীর বোঝাপড়া ও স্পিকিংয়ে সাবলীল ইংরেজি ডেলিভারি।',
  },
  {
    score: '7.5',
    bnScore: '৭.৫',
    tierEn: 'Challenging',
    tierBn: 'চ্যালেঞ্জিং (সেরা পছন্দ)',
    cefr: 'C1+ Advanced',
    hardRatio: 60,
    medRatio: 30,
    easyRatio: 10,
    highlightEn: 'Top-tier scholarship & ivy-level academic standard.',
    highlightBn: 'আন্তর্জাতিক স্কলারশিপ ও প্রথম সারির বিশ্ববিদ্যালয়ের মানদণ্ড।',
    descEn: 'Demands nuanced comprehension, high lexical resource, and rapid listening distractor filtering.',
    descBn: 'উচ্চমানের প্রতিশব্দ ও লিসেনিংয়ের দ্রুত ও বিভ্রান্তিকর অপশন সহজে ফিল্টারিং।',
  },
  {
    score: '8.0',
    bnScore: '৮.০',
    tierEn: 'Very Good',
    tierBn: 'প্রফেশনাল এক্সিলেন্স',
    cefr: 'C2 Mastery',
    hardRatio: 75,
    medRatio: 20,
    easyRatio: 5,
    highlightEn: 'Fully operational command; handles complex, detailed argumentation effortlessly.',
    highlightBn: 'পুরোপুরি সাবলীল ও ত্রুটিহীন বিশ্লেষণাত্মক যুক্তি উপস্থাপনা।',
    descEn: 'High cognitive rigor across abstract academic themes and spontaneous voice debate.',
    descBn: 'বিমূর্ত বৈজ্ঞানিক গবেষণা আলোচনা এবং তাৎক্ষণিক বুদ্ধিদীপ্ত স্পিকিং উত্তর।',
  },
  {
    score: '8.5',
    bnScore: '৮.৫',
    tierEn: 'Elite Master',
    tierBn: 'উচ্চ মাস্টার স্তর',
    cefr: 'C2 Proficient',
    hardRatio: 85,
    medRatio: 15,
    easyRatio: 0,
    highlightEn: 'Near-native fluency with rare unsystematic inaccuracies.',
    highlightBn: 'নেটিভ স্পিকারদের ন্যায় নির্ভুল ভাষা শৈলী ও অসাধারণ যুক্তি।',
    descEn: 'Scholarly discourse, intricate syntactic control, and sophisticated discourse markers.',
    descBn: 'উচ্চাঙ্গের অ্যাকাডেমিক পরিভাষা এবং জটিল ব্যাকরণিক কাঠামোর চমৎকার প্রয়োগ।',
  },
  {
    score: '9.0',
    bnScore: '৯.০',
    tierEn: 'Expert User',
    tierBn: 'পরিপূর্ণ পারফেকশন',
    cefr: 'C2 Expert (Max)',
    hardRatio: 90,
    medRatio: 10,
    easyRatio: 0,
    highlightEn: 'The absolute pinnacle of Cambridge IELTS assessment.',
    highlightBn: 'ক্যামব্রিজ আইইএলটিএস পরীক্ষার সর্বোচ্চ শিখর।',
    descEn: 'Flawless precision, complete comprehension, and effortless academic articulation.',
    descBn: 'সম্পূর্ণ নিখুঁত সঠিকতা, অসাধারণ শব্দভাণ্ডার এবং অনবদ্য উপস্থাপনা।',
  },
];

export const LandingScreen: React.FC<LandingScreenProps> = ({
  lang = 'bn',
  onToggleLanguage,
  onStart,
  onStartTrial,
  onLogin,
  onDirectDemoLogin,
  onExploreBandGuide,
  onExplorePricing,
}) => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [isSoundModalOpen, setIsSoundModalOpen] = useState(false);
  const [selectedBand, setSelectedBand] = useState<string>('7.5');

  const currentProfile =
    BAND_PROFILES.find((p) => p.score === selectedBand) || BAND_PROFILES[3];

  const isBn = lang === 'bn';

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between selection:bg-rose-500 selection:text-white">
      {/* 1. Global Announcement Banner */}
      <div className="w-full bg-[#061828] text-white text-xs border-b border-sky-950 py-2 px-3 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
            </span>
            <span className="font-semibold text-slate-200">
              {isBn ? (
                <>
                  ক্যামব্রিজ ২০২৬ স্ট্যান্ডার্ড মক টেস্ট • শুরু মাত্র{' '}
                  <span className="text-amber-400 font-extrabold text-sm">৯ টাকায়</span>
                </>
              ) : (
                <>
                  Cambridge 2026 Aligned Mock Tests • Starting at just{' '}
                  <span className="text-amber-400 font-extrabold text-sm">৳9 Taka</span>
                </>
              )}
            </span>
            <span className="hidden md:inline-block text-slate-400">•</span>
            <span className="hidden md:inline-block text-emerald-400 font-medium">
              {isBn
                ? 'বিকাশ ও নগদে তাৎক্ষণিক উইথড্রসহ ৫,০০০ টাকা রেফারেল বোনাস'
                : 'Earn ৳5,000+ Student Referral Bonus with bKash/Nagad Payouts'}
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Language Switcher */}
            {onToggleLanguage && (
              <button
                onClick={onToggleLanguage}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs text-sky-200 border border-white/15 transition-all cursor-pointer font-medium"
                title="Change Language"
              >
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>{isBn ? 'English' : 'বাংলা'}</span>
              </button>
            )}

            {/* Quick Demo Login */}
            {onDirectDemoLogin && (
              <button
                onClick={onDirectDemoLogin}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 text-xs font-bold transition-all cursor-pointer"
                title="Instant 1-Click Demo Login"
              >
                <Zap className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                <span>{isBn ? '১-ক্লিকে ডেমো লগইন' : '1-Click Demo'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Top Header Navigation */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0A2540] to-sky-900 text-white flex items-center justify-center shadow-md border border-sky-800">
              <Award className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-[#0A2540] tracking-tight">
                  IELTS DIBO
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 hidden sm:inline-block">
                  {isBn ? 'আইলস দিবো' : 'Exam Portal'}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide">
                Cambridge English & CEFR Simulation
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-600">
            <a href="#skills" className="hover:text-[#0A2540] transition-colors">
              {isBn ? '৪টি মডিউল' : '4 Test Modules'}
            </a>
            <a href="#calculator" className="hover:text-[#0A2540] transition-colors">
              {isBn ? 'ব্যান্ড ক্যালকুলেটর' : 'Band Simulator'}
            </a>
            <a href="#trf" className="hover:text-[#0A2540] transition-colors">
              {isBn ? 'অফিসিয়াল TRF রিপোর্ট' : 'Official TRF'}
            </a>
            {onExplorePricing && (
              <button
                onClick={onExplorePricing}
                className="hover:text-[#0A2540] transition-colors cursor-pointer"
              >
                {isBn ? 'ফি ও প্যাকেজ' : 'Pricing'}
              </button>
            )}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Duolingo Sound Studio Quick Trigger */}
            <button
              onClick={() => setIsSoundModalOpen(true)}
              className="p-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer text-xs font-bold"
              title={isBn ? 'ডুওলিঙ্গো সাউন্ড সেটিংস ও লাইভ টেস্ট' : 'Duolingo Sound Settings & Live Test'}
            >
              <Volume2 className="w-4 h-4 text-emerald-600" />
              <span className="hidden md:inline">{isBn ? 'সাউন্ড' : 'Sound'}</span>
            </button>

            {onLogin && (
              <button
                onClick={onLogin}
                className="px-3.5 py-2 rounded-xl text-xs font-extrabold text-[#0A2540] bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-600" />
                <span>{isBn ? 'লগইন' : 'Sign In'}</span>
              </button>
            )}

            <button
              onClick={onStart}
              className="px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF5A36] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white text-xs sm:text-sm font-extrabold shadow-md shadow-orange-600/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>{isBn ? 'পরীক্ষা শুরু করুন' : 'Start Mock Exam'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 3. Hero Section (High Conversion, Desktop Grid + Mobile Stack) */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-20 border-b border-slate-200/80 bg-gradient-to-b from-white via-sky-50/20 to-slate-50">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Value Proposition & CTAs (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs text-xs font-bold text-[#0A2540]">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                <span>
                  {isBn
                    ? 'ক্যামব্রিজ আইইএলটিএস ও ব্রিটিশ কাউন্সিল স্ট্যান্ডার্ড প্ল্যাটফর্ম'
                    : 'Authentic Cambridge IELTS & British Council Rubric'}
                </span>
                <BadgeCheckIcon />
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0A2540] tracking-tight leading-[1.15]">
                {isBn ? (
                  <>
                    আসল ক্যামব্রিজ মক টেস্টে যাচাই করুন আপনার{' '}
                    <span className="bg-gradient-to-r from-sky-600 via-[#0A2540] to-rose-600 bg-clip-text text-transparent">
                      স্বপ্নের ব্যান্ড স্কোর
                    </span>
                  </>
                ) : (
                  <>
                    Master Your Cambridge IELTS With Real{' '}
                    <span className="bg-gradient-to-r from-sky-600 via-[#0A2540] to-rose-600 bg-clip-text text-transparent">
                      Band 7.5 – 9.0
                    </span>{' '}
                    Simulation
                  </>
                )}
              </h1>

              {/* Sub-copy */}
              <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                {isBn
                  ? 'লিসেনিংয়ে ব্রিটিশ মাল্টি-স্পিকার ভয়েস, রিডিংয়ে আসল অ্যাকাডেমিক প্যাসেজ, রাইটিংয়ে অফিসিয়াল ডেসক্রিপ্টরভিত্তিক ব্যান্ড স্কোর এবং স্পিকিংয়ে ড. ফিঞ্চের সাথে লাইভ ইন্টারভিউ।'
                  : 'Full 4-skill testing: Multi-speaker British audio, academic reading passages, instant Task 2 Cambridge evaluation, and live voice speaking with Dr. Finch.'}
              </p>

              {/* Main Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={onStart}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#FF5A36] hover:bg-[#EA580C] text-white font-black text-sm sm:text-base shadow-xl shadow-orange-600/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border-b-4 border-[#C2410C]"
                >
                  <Sparkles className="w-5 h-5 text-amber-200" />
                  <span>{isBn ? 'এখনই মক টেস্ট শুরু করুন' : 'Begin Full Mock Test'}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setShowTutorial(true)}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-[#0A2540] font-extrabold text-xs sm:text-sm border-2 border-slate-300 hover:border-amber-400 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <PlayCircle className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
                  <span>{isBn ? 'কীভাবে পরীক্ষা দিতে হয়? (ভিডিও ও ফ্রি ট্রায়াল)' : 'Watch How It Works (Video & Trial)'}</span>
                </button>
              </div>

              {/* Direct Demo Login Notice for quick exploration */}
              <div className="p-3.5 bg-sky-50/80 rounded-2xl border border-sky-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-sky-950 font-bold">
                  <Zap className="w-4 h-4 text-amber-600 fill-amber-500 shrink-0" />
                  <span>
                    {isBn
                      ? 'টেস্ট করতে চান? নাহিদার ভেরিফাইড অ্যাকাউন্টে ১-ক্লিকে লগইন করুন:'
                      : 'Explore right now with verified demo student Nahida:'}
                  </span>
                </div>
                {onDirectDemoLogin && (
                  <button
                    onClick={() => {
                      sound.playSuccess();
                      onDirectDemoLogin();
                    }}
                    className="px-3 py-1 bg-[#0A2540] hover:bg-sky-900 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    <span>{isBn ? 'নাহিদা একাউন্ট খুলুন (ব্যান্ড ৭.৫)' : 'Open Demo Profile'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Key Indicators Grid */}
              <div className="grid grid-cols-3 gap-3 pt-2 text-left">
                <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <span className="text-xl sm:text-2xl font-black text-[#0A2540] block">
                    ১০,০০০+
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {isBn ? 'সফল মক টেস্ট সম্পন্ন' : 'Completed Mocks'}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <span className="text-xl sm:text-2xl font-black text-emerald-600 block">
                    ৳৯ টাকা
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {isBn ? 'শুরু করার সর্বনিম্ন ফি' : 'Starting Price'}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <span className="text-xl sm:text-2xl font-black text-sky-700 block">
                    ১০০%
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {isBn ? 'ক্যামব্রিজ রুব্রিক অনুসৃত' : 'Cambridge Aligned'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Band Score & Rigor Simulator (5 cols) */}
            <div className="lg:col-span-5" id="calculator">
              <div className="relative bg-gradient-to-b from-white to-slate-50 rounded-3xl border-2 border-[#0A2540] p-5 sm:p-6 shadow-xl space-y-4">
                {/* Header Tag */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-[#0A2540]">
                        {isBn ? 'টার্গেট ব্যান্ড সিমুলেটর' : 'Target Band Simulator'}
                      </h3>
                      <p className="text-[10px] text-slate-500">
                        {isBn ? 'ব্যান্ড নির্বাচন করে কাঠিন্য স্তর দেখুন' : 'Select a band to preview exam rigor'}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-sky-100 text-sky-900">
                    {currentProfile.cefr}
                  </span>
                </div>

                {/* Clickable Band Pills */}
                <div className="grid grid-cols-7 gap-1 bg-slate-100 p-1.5 rounded-2xl">
                  {BAND_PROFILES.map((p) => (
                    <button
                      key={p.score}
                      onClick={() => {
                        sound.playSelect();
                        setSelectedBand(p.score);
                      }}
                      className={`py-1.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
                        selectedBand === p.score
                          ? 'bg-[#0A2540] text-white shadow-md scale-105'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                      }`}
                    >
                      {p.score}
                    </button>
                  ))}
                </div>

                {/* Score Showcase Big Card */}
                <div className="bg-gradient-to-br from-[#0A2540] via-[#0f365d] to-[#081e33] text-white rounded-2xl p-5 text-center relative overflow-hidden shadow-inner">
                  <div className="text-[11px] uppercase tracking-wider text-amber-300 font-bold mb-1">
                    {isBn ? 'কাঙ্ক্ষিত স্কোর ও কাঠিন্য' : 'Target Band & Rigor'}
                  </div>
                  <div className="text-5xl sm:text-6xl font-black text-amber-400 font-mono tracking-tight my-1 drop-shadow">
                    Band {selectedBand}
                  </div>
                  <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold mt-1">
                    {isBn ? currentProfile.tierBn : currentProfile.tierEn}
                  </span>

                  {/* Difficulty Distribution Bar */}
                  <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5 text-left">
                    <div className="flex justify-between text-[10px] text-sky-200">
                      <span>{isBn ? 'প্রশ্ন কাঠিন্য অনুপাত' : 'Question Difficulty Mix'}</span>
                      <span className="font-mono">
                        {currentProfile.hardRatio}% Hard · {currentProfile.medRatio}% Med
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden flex">
                      <div
                        style={{ width: `${currentProfile.hardRatio}%` }}
                        className="bg-rose-500 h-full"
                        title="Hard"
                      ></div>
                      <div
                        style={{ width: `${currentProfile.medRatio}%` }}
                        className="bg-amber-400 h-full"
                        title="Medium"
                      ></div>
                      <div
                        style={{ width: `${currentProfile.easyRatio}%` }}
                        className="bg-emerald-400 h-full"
                        title="Easy"
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Cambridge Examiner Expectation */}
                <div className="bg-sky-50/70 p-3.5 rounded-2xl border border-sky-100 text-xs space-y-1">
                  <span className="font-bold text-[#0A2540] block">
                    {isBn ? 'পরীক্ষকের প্রত্যাশা ও প্রস্তুতি:' : 'Cambridge Examiner Expectation:'}
                  </span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {isBn ? currentProfile.descBn : currentProfile.descEn}
                  </p>
                </div>

                {/* Select Band & Start */}
                <button
                  onClick={onStart}
                  className="w-full py-3 bg-[#0A2540] hover:bg-sky-950 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow transition-all"
                >
                  <span>
                    {isBn
                      ? `ব্যান্ড ${selectedBand} নিয়ে প্রস্তুতি শুরু করুন`
                      : `Start Practice for Band ${selectedBand}`}
                  </span>
                  <ChevronRight className="w-4 h-4 text-amber-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Four Core Cambridge Modules Architecture (Interactive Showcase) */}
      <section className="py-14 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6 w-full" id="skills">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-3 py-1 rounded-full">
            <Layers className="w-3.5 h-3.5" />
            <span>{isBn ? 'ক্যামব্রিজ ৪টি মডিউল' : 'Four Core Modules'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0A2540] tracking-tight">
            {isBn
              ? 'আইইএলটিএস পরীক্ষার আসল অভিজ্ঞতা, সম্পূর্ণ ডিজিটাল'
              : 'Authentic Cambridge Test Experience, Fully Digital'}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            {isBn
              ? 'প্রতিটি মডিউল ব্রিটিশ কাউন্সিল ও ক্যামব্রিজ স্ট্যান্ডার্ড অনুযায়ী নিখুঁতভাবে তৈরি।'
              : 'Every single section strictly mirrors British Council and IDP live examination protocols.'}
          </p>
        </div>

        {/* 4 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* 1. LISTENING */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center">
                  <Headphones className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#0A2540]">
                    {isBn ? 'লিসেনিং মডিউল (Listening)' : 'Listening Module'}
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {isBn ? 'ব্রিটিশ মাল্টি-স্পিকার অডিও সিমুলেশন' : 'Multi-Speaker British English Audio'}
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-sky-100 text-sky-900">
                ৪০টি প্রশ্ন
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {isBn
                ? 'রোবটিক একঘেয়ে ভয়েস নয়; পুরুষ ও নারী বক্তার আসল কথোপকথন, ব্রিটিশ উচ্চারণ, স্বাভাবিক বিরতি এবং ক্যামব্রিজ টাইপের ডিস্ট্রাক্টর।'
                : 'Zero robotic speech. Authentic male/female speaker turns, realistic British acoustic cadence, and genuine distractors.'}
            </p>

            <div className="p-3 bg-slate-50 rounded-2xl text-[11px] space-y-1.5 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-700">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{isBn ? '০.৮৫x থেকে ১.১৫x স্পিড রেগুলেশন' : '0.85x to 1.15x Playback Speed Regulation'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{isBn ? 'লাইভ স্ক্রিপ্ট ও টার্ন-টেকিং ভিউ' : 'Interactive Script & Speaker Highlights'}</span>
              </div>
            </div>
          </div>

          {/* 2. READING */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#0A2540]">
                    {isBn ? 'রিডিং মডিউল (Reading)' : 'Reading Module'}
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {isBn ? 'আসল ৩টি দীর্ঘ অ্যাকাডেমিক অনুচ্ছেদ' : '3 In-Depth Academic Passages'}
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900">
                ৬০ মিনিট
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {isBn
                ? 'এপিজেনেটিক্স, ছত্রাকের নেটওয়ার্ক ও মহাকাশ প্রত্নতত্ত্ব নিয়ে প্রকৃত গবেষণাধর্মী প্যাসেজ। সাথে True/False/Not Given এবং হেডিং ম্যাচিং।'
                : 'Rigorous scholarly texts on microbiology, cognitive science, and archaeology with True/False/Not Given, Headings & Summaries.'}
            </p>

            <div className="p-3 bg-slate-50 rounded-2xl text-[11px] space-y-1.5 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-700">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{isBn ? 'তাত্ক্ষণিক সঠিক উত্তর ও ক্যামব্রিজ ব্যাখ্যা' : 'Instant Answer Keys & In-Depth Cambridge Explanations'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{isBn ? 'টার্গেট স্কোর অনুযায়ী প্রশ্ন কাঠিন্য বিন্যাস' : 'Dynamic Passages Calibrated to Target Band'}</span>
              </div>
            </div>
          </div>

          {/* 3. WRITING */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <PenTool className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#0A2540]">
                    {isBn ? 'রাইটিং মডিউল (Writing)' : 'Writing Task 1 & 2'}
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {isBn ? 'ক্যামব্রিজ রুব্রিকে নির্ভুল এসেসমেন্ট' : 'Cambridge 4-Criterion Evaluation'}
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-900">
                Task 1 + 2
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {isBn
                ? 'Task Response (TR), Coherence & Cohesion (CC), Lexical Resource (LR) এবং Grammatical Accuracy (GRA) এর আলাদা স্কোর ও বিস্তারিত পরামর্শ।'
                : 'Scored strictly under official criteria: TR, CC, LR, and GRA with word count verification and honest band descriptor capping.'}
            </p>

            <div className="p-3 bg-slate-50 rounded-2xl text-[11px] space-y-1.5 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-700">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{isBn ? '২৫০ শব্দের নিচে থাকলে সৎ রুব্রিক ক্যাপ' : 'Word-Count Penalty & Realistic Descriptors'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{isBn ? 'উন্নত প্রতিশব্দ ও ব্যাকরণগত ভুলের তালিকা' : 'Grammar Corrections & Lexical Upgrades'}</span>
              </div>
            </div>
          </div>

          {/* 4. SPEAKING */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center">
                  <Mic className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#0A2540]">
                    {isBn ? 'স্পিকিং মডিউল (Speaking)' : 'Speaking Live Assessment'}
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {isBn ? 'ড. অ্যালিস্টার ফিঞ্চের সাথে লাইভ ইন্টারভিউ' : 'Live Interview with Dr. Alistair Finch'}
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-100 text-rose-900">
                Part 1, 2 & 3
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {isBn
                ? 'স্ক্রিনে কোনো টেক্সট পড়তে হবে না। পরীক্ষক মুখে প্রশ্ন করবেন, আপনার উত্তর শুনবেন এবং স্বাভাবিক ব্রিটিশ ভঙ্গিতে ফিডব্যাক ও ফলো-আপ প্রশ্ন করবেন।'
                : 'Zero on-screen reading. Pure voice navigation with human cognitive pauses, spoken grammar corrections, and adaptive follow-up questions.'}
            </p>

            <div className="p-3 bg-slate-50 rounded-2xl text-[11px] space-y-1.5 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-700">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{isBn ? 'প্রাকৃতিক কগনিটিভ বিরতি ও ব্রিটিশ অ্যাকসেন্ট' : 'Thoughtful British Academic Persona & Accent'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{isBn ? 'উচ্চারণ ও ফ্লুয়েন্সির বিস্তারিত অডিট' : 'Fluency, Pronunciation & Grammatical Range Audit'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Official TRF (Test Report Form) Preview Banner */}
      <section className="bg-[#0A2540] text-white py-14 sm:py-16" id="trf">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold border border-white/15">
                <FileCheck className="w-4 h-4" />
                <span>{isBn ? 'ডাউনলোডযোগ্য অফিসিয়াল সার্টিফিকেট' : 'Downloadable Official Certificate'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {isBn
                  ? 'পরীক্ষা শেষে পেয়ে যান অফিসিয়াল ক্যামব্রিজ TRF রিপোর্ট শিট'
                  : 'Receive Official Cambridge TRF Score Sheet Upon Exam Completion'}
              </h2>
              <p className="text-sky-200 text-xs sm:text-sm leading-relaxed max-w-xl">
                {isBn
                  ? 'প্রতিটি টেস্টের পর পাবেন আপনার ইউনিক রোল নম্বর (যেমন: DIBO-2026-9819), ৪টি মডিউলের আলাদা স্কোর, অফিসিয়াল সাইন ও সিলযুক্ত প্রিন্টযোগ্য ও ভেরিফাইড PDF।'
                  : 'Get a verified PDF Test Report Form featuring candidate roll numbers, CEFR ratings, examiner signatures, and full diagnostic breakdowns.'}
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={onStart}
                  className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>{isBn ? 'এখনই পরীক্ষা দিয়ে স্কোর নিন' : 'Take Test & Get TRF'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                {onExploreBandGuide && (
                  <button
                    onClick={onExploreBandGuide}
                    className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-colors cursor-pointer"
                  >
                    {isBn ? 'ব্যান্ড স্কোর ডেসক্রিপ্টর গাইড' : 'View Band Guide'}
                  </button>
                )}
              </div>
            </div>

            {/* TRF Certificate Card Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm bg-white text-slate-900 rounded-3xl p-5 shadow-2xl border-4 border-amber-400/80 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between border-b pb-2.5">
                  <div>
                    <span className="font-extrabold text-xs text-[#0A2540] block">
                      CAMBRIDGE TEST REPORT FORM
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      ROLL: DIBO-2026-9819
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#0A2540] text-amber-400 flex items-center justify-center font-black text-xs">
                    9.0
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-1.5 text-center py-1">
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <span className="text-[9px] text-slate-500 block">L</span>
                    <span className="font-extrabold text-xs text-sky-800">8.5</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <span className="text-[9px] text-slate-500 block">R</span>
                    <span className="font-extrabold text-xs text-amber-800">8.0</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <span className="text-[9px] text-slate-500 block">W</span>
                    <span className="font-extrabold text-xs text-purple-800">7.0</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <span className="text-[9px] text-slate-500 block">S</span>
                    <span className="font-extrabold text-xs text-rose-800">7.5</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-sky-900 to-[#0A2540] text-white p-3 rounded-2xl flex items-center justify-between">
                  <span className="text-xs font-bold">{isBn ? 'ওভারঅল ব্যান্ড:' : 'Overall Band:'}</span>
                  <span className="font-black text-lg text-amber-400 font-mono">Band 7.5</span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>Authenticity Seal Verified</span>
                  <span className="font-mono text-emerald-600 font-bold">APPROVED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Real Bangladeshi Candidate Feedback & Wall of Trust */}
      <section className="py-14 sm:py-18 max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
            <Users className="w-3.5 h-3.5" />
            <span>{isBn ? 'সফল শিক্ষার্থীদের রিভিউ' : 'Verified Reviews'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0A2540] tracking-tight">
            {isBn ? 'আমাদের শিক্ষার্থীদের বাস্তব অভিজ্ঞতা' : 'Real Testimonials from Real Candidates'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Review 1: Nahida */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm">
                  N
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">নাহিদা (Nahida)</h4>
                  <span className="text-[10px] text-slate-500">ঢাকা বিশ্ববিদ্যালয়, ঢাকা</span>
                </div>
              </div>
              <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800">
                Band 7.5
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              &quot;ড. ফিঞ্চের স্পিকিং টেস্টটি অসাধারণ! মনে হচ্ছিল সত্যিই ব্রিটিশ কাউন্সিলের পরীক্ষকের সামনে বসে কথা বলছি। আমার ভুলগুলো সাথে সাথেই শুধরে দিয়েছিলেন।&quot;
            </p>
          </div>

          {/* Review 2: Tanvir */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-sky-600 text-white flex items-center justify-center font-black text-sm">
                  T
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">তানভীর আহমেদ</h4>
                  <span className="text-[10px] text-slate-500">চট্টগ্রাম</span>
                </div>
              </div>
              <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800">
                Band 8.0
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              &quot;লিসেনিংয়ের মাল্টি-স্পিকার অডিও এবং রিডিংয়ের ট্রু/ফলস/নট গিভেন ব্যাখ্যাগুলো ছিল ভীষণ সহায়ক। মাত্র ৯ টাকায় এত প্রিমিয়াম কোয়ালিটি অবিশ্বাস্য!&quot;
            </p>
          </div>

          {/* Review 3: Nusrat */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-sm">
                  N
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">নুসরাত জাহান</h4>
                  <span className="text-[10px] text-slate-500">সিলেট</span>
                </div>
              </div>
              <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800">
                Band 7.5
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              &quot;রাইটিং টাস্ক ২-এর চারটা প্যারামিটারে আলাদা ব্যান্ড স্কোর পেয়েছি। সাথে রেফারেল করে ৫,০০০ টাকা বিকাশ উইথড্রও নিয়েছি!&quot;
            </p>
          </div>
        </div>
      </section>

      {/* 7. Bottom Final Call-To-Action Banner */}
      <section className="bg-gradient-to-r from-[#FF5A36] to-[#EA580C] text-white py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
            {isBn
              ? 'আজই আপনার কাঙ্ক্ষিত ব্যান্ড স্কোর নিশ্চিত করুন'
              : 'Begin Your Cambridge Preparation Today'}
          </h2>
          <p className="text-orange-100 text-xs sm:text-sm max-w-xl mx-auto font-medium">
            {isBn
              ? 'হাজারো শিক্ষার্থীর মতো আপনিও ক্যামব্রিজ মানের প্র্যাকটিস শুরু করুন এবং কাঙ্ক্ষিত স্কলারশিপ অর্জন করুন।'
              : 'Take authentic full-length exams, download official TRFs, and achieve your global university dreams.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onStart}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#0A2540] hover:bg-slate-950 text-white font-black text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{isBn ? 'এখনই এক্সাম শুরু করুন (৯ টাকা)' : 'Start Full Mock Now (৳9)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            {onLogin && (
              <button
                onClick={onLogin}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                {isBn ? 'পূর্ববর্তী একাউন্টে লগইন করুন' : 'Sign In to Existing Account'}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 8. Modern Footnote & Compliance */}
      <footer className="w-full bg-[#061828] text-slate-400 text-xs py-8 border-t border-sky-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/10 text-amber-400 flex items-center justify-center font-black">
              ID
            </div>
            <div>
              <span className="text-white font-bold text-sm block">IELTS DIBO (আইলস দিবো)</span>
              <span className="text-[11px] text-slate-400">
                © ২০২৬ IELTS DIBO • Cambridge English & CEFR Simulation
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              ১০০% নিরাপদ ও সুরক্ষিত প্ল্যাটফর্ম
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">ঢাকা, বাংলাদেশ</span>
          </div>
        </div>
      </footer>

      {/* Video & Platform Tutorial Modal with Free Trial Trigger */}
      <TutorialModal
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
        lang={lang}
        onStartTrial={() => {
          setShowTutorial(false);
          if (onStartTrial) {
            onStartTrial();
          }
        }}
        onStartExam={() => {
          setShowTutorial(false);
          onStart();
        }}
      />

      {/* Duolingo Sound Studio Live Modal */}
      <SoundControlModal
        isOpen={isSoundModalOpen}
        onClose={() => setIsSoundModalOpen(false)}
        lang={lang}
      />
    </div>
  );
};

function BadgeCheckIcon() {
  return (
    <svg
      className="w-4 h-4 text-sky-600 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
