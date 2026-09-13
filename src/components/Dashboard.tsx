import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  PenTool,
  Headphones,
  Mic,
  Calendar,
  Award,
  LogOut,
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  Flame,
  ArrowRight,
  TrendingUp,
  User,
  History,
  Languages,
  Menu,
  X,
  FileText,
  HelpCircle,
  Gift,
  ShieldCheck,
  RotateCcw,
  Wallet,
  Play,
} from 'lucide-react';
import {
  UserProfile,
  ExamRecord,
  DashboardTab,
  SkillCategory,
  AppLanguage,
  PageView,
  WithdrawRecord,
  SupportTicket,
} from '../types';
import { TongueTwisterTab } from './TongueTwisterTab';
import { generateIeltsPdf, generateSpecificModulePdf } from '../utils/pdfGenerator';
import { getTierFromScore } from '../utils/questionBank';

interface DashboardProps {
  user: UserProfile;
  exams: ExamRecord[];
  withdrawHistory: WithdrawRecord[];
  tickets: SupportTicket[];
  lang?: AppLanguage;
  onUpdateUser: (user: Partial<UserProfile>) => void;
  onAddExamRecord: (record: ExamRecord) => void;
  onNavigateToPage: (page: PageView, extraData?: any) => void;
  onToggleLanguage: () => void;
  onResetApp: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  exams,
  withdrawHistory,
  tickets,
  lang = 'bn',
  onUpdateUser,
  onAddExamRecord,
  onNavigateToPage,
  onToggleLanguage,
  onResetApp,
}) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('exam_center');
  const [isChangingScore, setIsChangingScore] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Difficulty Tier & Probabilities
  const getDifficultyProbabilities = (score: string) => {
    const val = parseFloat(score);
    if (val >= 8.5) {
      return { hard: 65, medium: 25, easy: 10, labelBn: 'মাস্টারি উচ্চ পর্যায়', labelEn: 'Mastery Tier (8.5 - 9.0)' };
    } else if (val >= 7.5) {
      return { hard: 45, medium: 40, easy: 15, labelBn: 'চ্যালেঞ্জিং পর্যায়', labelEn: 'Challenging Tier (7.5 - 8.0)' };
    } else if (val >= 6.5) {
      return { hard: 25, medium: 50, easy: 25, labelBn: 'মধ্যম পর্যায়', labelEn: 'Moderate Tier (6.5 - 7.0)' };
    } else {
      return { hard: 10, medium: 40, easy: 50, labelBn: 'বেসিক পর্যায়', labelEn: 'Foundation Tier (5.5 - 6.0)' };
    }
  };

  const diffProbs = getDifficultyProbabilities(user.targetScore);
  const currentTier = getTierFromScore(user.targetScore);

  // Check if candidate subscription has expired
  const isExpired = user.expiryDate ? new Date(user.expiryDate).getTime() < Date.now() : false;

  // Format subscription expiry
  const formatRemainingDays = (expiryStr?: string) => {
    if (!expiryStr) return lang === 'bn' ? 'অ্যাডমিন অনুমোদনের অপেক্ষায়' : 'Pending Admin Approval';
    const diff = new Date(expiryStr).getTime() - Date.now();
    if (diff <= 0) return lang === 'bn' ? 'মেয়াদ শেষ (Expired)' : 'Subscription Expired';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days} ${lang === 'bn' ? 'দিন' : 'days'} ${hours} ${lang === 'bn' ? 'ঘণ্টা বাকি' : 'hrs remaining'}`;
  };

  // Helper to get candidate's achieved score for any module
  const getModuleScore = (mod: SkillCategory): number | null => {
    if (user.moduleScores && user.moduleScores[mod] !== undefined) {
      return user.moduleScores[mod]!;
    }
    const found = exams.find((e) => e.examType === mod || (e.examType === 'full_mock' && e[(`${mod}Band` as any)]));
    if (found) {
      return (found as any)[`${mod}Band`] || found.overallBand;
    }
    return null;
  };

  const handleStartOrRetakeModule = (mod: SkillCategory) => {
    if (user.paymentStatus !== 'approved') {
      alert(
        lang === 'bn'
          ? 'আপনার সাবস্ক্রিপশন ফি ভেরিফিকেশন চলছে। অ্যাডমিন অনুমোদন সম্পন্ন হলে নোটিশটি সরে যাবে এবং পরীক্ষা শুরু হবে।'
          : 'Your payment is being verified by admin. Once approved, the notice will disappear and exams will unlock.'
      );
      return;
    }
    if (isExpired) {
      alert(
        lang === 'bn'
          ? 'আপনার সাবস্ক্রিপশন মেয়াদ শেষ হয়েছে। নতুন পরীক্ষা দেওয়ার জন্য প্ল্যান রিনিউ করুন।'
          : 'Your subscription has expired. Please renew to take new exams.'
      );
      return;
    }

    if (mod === 'speaking') {
      onNavigateToPage('speaking_exam');
    } else if (mod === 'reading') {
      onNavigateToPage('reading_exam');
    } else if (mod === 'writing') {
      onNavigateToPage('writing_exam');
    } else if (mod === 'listening') {
      onNavigateToPage('listening_exam');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center selection:bg-rose-500 selection:text-white">
      {/* Mobile-First Container */}
      <div className="w-full max-w-md min-h-screen bg-slate-50 flex flex-col relative shadow-2xl overflow-x-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-[#0A2540] text-white px-4 py-3 border-b border-sky-900/50 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-1.5 rounded-xl hover:bg-white/10 text-white transition-colors cursor-pointer"
              title={lang === 'bn' ? 'মেনু' : 'Menu'}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Dynamic Brand Logo: 'আইলস দিবো' in Bengali, 'IELTS DIBO' in English */}
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-white leading-none">
                {lang === 'bn' ? 'আইলস দিবো' : 'IELTS DIBO'}
              </span>
              <span className="text-[9px] text-sky-200 tracking-wider font-semibold">
                Official Mock Test Center
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher Button */}
            <button
              onClick={onToggleLanguage}
              className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-sky-100 flex items-center gap-1 transition-all cursor-pointer"
              title="Switch Language"
            >
              <Languages className="w-3.5 h-3.5 text-amber-300" />
              <span>{lang === 'bn' ? 'EN' : 'বাং'}</span>
            </button>

            {/* Wallet balance quick button */}
            <button
              onClick={() => onNavigateToPage('referral')}
              className="px-2.5 py-1 rounded-xl bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1 shadow-sm cursor-pointer hover:bg-amber-300 transition-colors"
              title={lang === 'bn' ? 'রেফারেল ওয়ালেট' : 'Referral Wallet'}
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>৳{user.walletBalance}</span>
            </button>
          </div>
        </header>

        {/* Pending Notice Bar if not yet approved */}
        {user.paymentStatus === 'pending' && (
          <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-bold flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-1.5 truncate">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">
                {lang === 'bn'
                  ? 'পেমেন্ট যাচাই চলছে। অ্যাডমিন অনুমোদন করলে নোটিশটি সরে যাবে।'
                  : 'Payment pending verification. Once approved, notice will disappear.'}
              </span>
            </div>
            <span className="text-[10px] bg-black/10 px-2 py-0.5 rounded-full shrink-0 font-mono">
              TrxID: {user.transactionId?.slice(-6) || 'Pending'}
            </span>
          </div>
        )}

        {/* Restricted Notice */}
        {user.isRestricted && (
          <div className="bg-rose-600 text-white px-4 py-2.5 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              {lang === 'bn'
                ? 'আপনার অ্যাকাউন্টটি সিস্টেম অ্যাডমিন দ্বারা সাময়িক স্থগিত (Restricted) রয়েছে।'
                : 'Your account has been restricted by system administration.'}
            </span>
          </div>
        )}

        {/* Side Drawer Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <div className="fixed inset-0 z-50 flex">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              />

              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 justify-between text-slate-800"
              >
                <div>
                  <div className="p-4 bg-[#0A2540] text-white flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-base">
                        {lang === 'bn' ? 'আইলস দিবো মেনু' : 'IELTS DIBO Menu'}
                      </h3>
                      <p className="text-[11px] text-sky-200">
                        {lang === 'bn' ? 'ক্যামব্রিজ অফিসিয়াল পোর্টাল' : 'Cambridge Official Portal'}
                      </p>
                    </div>
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="p-1.5 rounded-xl hover:bg-white/10 text-white cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-3 space-y-1.5 text-xs font-bold">
                    {/* Refer & Earn */}
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        onNavigateToPage('referral');
                      }}
                      className="w-full p-2.5 rounded-xl flex items-center justify-between text-slate-700 hover:bg-amber-50 hover:text-amber-900 transition-colors text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Gift className="w-4 h-4 text-amber-600" />
                        <span>{lang === 'bn' ? 'রেফার ও ইনকাম (Refer & Earn)' : 'Refer & Earn'}</span>
                      </div>
                      <span className="font-mono text-emerald-700 font-extrabold text-xs">
                        ৳{user.walletBalance}
                      </span>
                    </button>

                    {/* Withdraw Page */}
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        onNavigateToPage('withdraw');
                      }}
                      className="w-full p-2.5 rounded-xl flex items-center gap-3 text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors text-left cursor-pointer"
                    >
                      <Wallet className="w-4 h-4 text-emerald-600" />
                      <span>{lang === 'bn' ? 'টাকা উত্তোলন (Withdraw)' : 'Withdraw Funds'}</span>
                    </button>

                    {/* Tongue Twister */}
                    <button
                      onClick={() => {
                        setActiveTab('tongue_twister');
                        setIsMenuOpen(false);
                      }}
                      className="w-full p-2.5 rounded-xl flex items-center gap-3 text-slate-700 hover:bg-sky-50 hover:text-sky-900 transition-colors text-left cursor-pointer"
                    >
                      <Flame className="w-4 h-4 text-rose-600" />
                      <span>{lang === 'bn' ? 'টাং টুইস্টার প্র্যাকটিস' : 'Tongue Twister Lab'}</span>
                    </button>

                    {/* Previous Exams */}
                    <button
                      onClick={() => {
                        setActiveTab('old_exams');
                        setIsMenuOpen(false);
                      }}
                      className="w-full p-2.5 rounded-xl flex items-center gap-3 text-slate-700 hover:bg-sky-50 hover:text-sky-900 transition-colors text-left cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <span>{lang === 'bn' ? 'পুরাতন পরীক্ষা ও রেজাল্ট PDF' : 'Previous Tests & TRF'}</span>
                    </button>

                    {/* Helpline & Support */}
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        onNavigateToPage('support');
                      }}
                      className="w-full p-2.5 rounded-xl flex items-center gap-3 text-slate-700 hover:bg-sky-50 hover:text-sky-900 transition-colors text-left cursor-pointer"
                    >
                      <HelpCircle className="w-4 h-4 text-teal-600" />
                      <span>{lang === 'bn' ? '২৪/৭ হেল্পলাইন ও সাপোর্ট' : '24/7 Helpline & Support'}</span>
                    </button>

                    {/* Band Descriptor Guide */}
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        onNavigateToPage('band_guide');
                      }}
                      className="w-full p-2.5 rounded-xl flex items-center gap-3 text-slate-700 hover:bg-sky-50 hover:text-sky-900 transition-colors text-left cursor-pointer"
                    >
                      <Award className="w-4 h-4 text-purple-600" />
                      <span>{lang === 'bn' ? 'ক্যামব্রিজ ব্যান্ড স্কোর গাইড' : 'Cambridge Band Descriptors'}</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-2">
                  <div className="text-[11px] text-slate-500">
                    <div>{user.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">Roll: #{user.rollNumber}</div>
                  </div>
                  <button
                    onClick={onResetApp}
                    className="w-full py-2 px-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'লগআউট করুন' : 'Sign Out'}</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Main Tab Content */}
        <main className="flex-1 p-4 overflow-y-auto">
          {/* TAB 1: EXAM CENTER */}
          {activeTab === 'exam_center' && (
            <div className="space-y-4 pb-28">
              {/* Target Band & Prediction Card */}
              <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="w-[32%] flex flex-col justify-center">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      {lang === 'bn' ? 'টার্গেট ব্যান্ড' : 'Target Band'}
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-3xl font-black text-[#0A2540] font-mono">
                        {user.targetScore}
                      </span>
                      <button
                        onClick={() => setIsChangingScore(!isChangingScore)}
                        className="text-[10px] text-sky-700 font-bold hover:underline cursor-pointer"
                      >
                        {isChangingScore ? (lang === 'bn' ? 'বাতিল' : 'Cancel') : (lang === 'bn' ? 'বদলান' : 'Change')}
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                      {diffProbs.labelBn.split(' ')[0]}
                    </span>

                    {/* Band Selection Dropdown */}
                    {isChangingScore && (
                      <div className="mt-2 bg-slate-50 p-2 rounded-xl border border-slate-200 space-y-1">
                        {['6.5', '7.0', '7.5', '8.0', '8.5'].map((sc) => (
                          <button
                            key={sc}
                            onClick={() => {
                              onUpdateUser({ targetScore: sc });
                              setIsChangingScore(false);
                            }}
                            className={`w-full py-1 text-xs font-bold rounded-lg text-left px-2 cursor-pointer ${
                              user.targetScore === sc ? 'bg-[#0A2540] text-white' : 'hover:bg-slate-200 text-slate-700'
                            }`}
                          >
                            Band {sc}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="w-px h-16 bg-slate-200 mx-2"></div>

                  <div className="flex-1 flex flex-col justify-center pl-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                      {lang === 'bn' ? 'প্রশ্নের কাঠিন্য বিন্যাস (Cambridge Standard)' : 'Question Difficulty Distribution'}
                    </span>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <span className="w-11 text-slate-600 font-semibold">{lang === 'bn' ? 'কঠিন:' : 'Hard:'}</span>
                        <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div className="bg-rose-500 h-full rounded-full" style={{ width: `${diffProbs.hard}%` }}></div>
                        </div>
                        <span className="w-6 font-mono text-slate-800 font-bold text-right">{diffProbs.hard}%</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px]">
                        <span className="w-11 text-slate-600 font-semibold">{lang === 'bn' ? 'মিডিয়াম:' : 'Med:'}</span>
                        <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div className="bg-amber-500 h-full rounded-full" style={{ width: `${diffProbs.medium}%` }}></div>
                        </div>
                        <span className="w-6 font-mono text-slate-800 font-bold text-right">{diffProbs.medium}%</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px]">
                        <span className="w-11 text-slate-600 font-semibold">{lang === 'bn' ? 'সহজ:' : 'Easy:'}</span>
                        <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${diffProbs.easy}%` }}></div>
                        </div>
                        <span className="w-6 font-mono text-slate-800 font-bold text-right">{diffProbs.easy}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Four Square Module Cards with Strict Completed Lock & Retake Flow */}
              <div>
                <div className="flex items-center justify-between mb-2 px-1">
                  <h3 className="font-extrabold text-sm text-[#0A2540]">
                    {lang === 'bn' ? 'মক টেস্ট মডিউল সেন্টার' : 'Mock Test Module Center'}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-bold">{currentTier} Tier</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* 1. READING */}
                  {(() => {
                    const score = getModuleScore('reading');
                    const hasCompleted = score !== null;
                    return (
                      <div className="aspect-square bg-gradient-to-br from-emerald-600 to-teal-800 rounded-3xl p-4 text-white shadow-md flex flex-col justify-between relative overflow-hidden">
                        <div className="flex items-center justify-between">
                          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-[10px] font-bold bg-emerald-950/40 px-2 py-0.5 rounded-full">
                            {hasCompleted ? (lang === 'bn' ? 'সম্পন্ন' : 'Completed') : '40 Qs'}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-black text-sm text-white leading-tight">IELTS Reading</h4>
                          {hasCompleted ? (
                            <div className="mt-1">
                              <span className="text-[10px] text-emerald-100 block">
                                {lang === 'bn' ? 'অর্জিত স্কোর:' : 'Achieved Score:'}
                              </span>
                              {/* Big Bold Score Display per user requirement! */}
                              <span className="text-2xl font-black text-amber-300 font-mono">
                                ব্যান্ড: {score.toFixed(1)}
                              </span>
                            </div>
                          ) : (
                            <p className="text-[10px] text-emerald-100 mt-0.5">
                              {lang === 'bn' ? 'প্যাসেজ ও নিখুঁত মূল্যায়ন' : 'Passage & Questions'}
                            </p>
                          )}
                        </div>

                        <div className="pt-2 border-t border-white/20">
                          {hasCompleted ? (
                            <button
                              onClick={() => handleStartOrRetakeModule('reading')}
                              className="w-full py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>{lang === 'bn' ? 'পুনরায় পরীক্ষা দিন' : 'Retake Exam'}</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStartOrRetakeModule('reading')}
                              className="w-full py-1.5 rounded-xl bg-white text-emerald-950 text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer shadow-sm hover:bg-emerald-50 transition-colors"
                            >
                              <span>{lang === 'bn' ? 'টেস্ট দিন' : 'Start Exam'}</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* 2. WRITING */}
                  {(() => {
                    const score = getModuleScore('writing');
                    const hasCompleted = score !== null;
                    return (
                      <div className="aspect-square bg-gradient-to-br from-amber-500 to-orange-700 rounded-3xl p-4 text-white shadow-md flex flex-col justify-between relative overflow-hidden">
                        <div className="flex items-center justify-between">
                          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                            <PenTool className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-[10px] font-bold bg-amber-950/40 px-2 py-0.5 rounded-full">
                            {hasCompleted ? (lang === 'bn' ? 'সম্পন্ন' : 'Completed') : 'Task 2'}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-black text-sm text-white leading-tight">IELTS Writing</h4>
                          {hasCompleted ? (
                            <div className="mt-1">
                              <span className="text-[10px] text-amber-100 block">
                                {lang === 'bn' ? 'অর্জিত স্কোর:' : 'Achieved Score:'}
                              </span>
                              <span className="text-2xl font-black text-amber-200 font-mono">
                                ব্যান্ড: {score.toFixed(1)}
                              </span>
                            </div>
                          ) : (
                            <p className="text-[10px] text-amber-100 mt-0.5">
                              {lang === 'bn' ? 'একাডেমিক টাস্ক ২ রচনা' : 'Task 2 Essay Rubric'}
                            </p>
                          )}
                        </div>

                        <div className="pt-2 border-t border-white/20">
                          {hasCompleted ? (
                            <button
                              onClick={() => handleStartOrRetakeModule('writing')}
                              className="w-full py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>{lang === 'bn' ? 'পুনরায় পরীক্ষা দিন' : 'Retake Exam'}</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStartOrRetakeModule('writing')}
                              className="w-full py-1.5 rounded-xl bg-white text-orange-950 text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer shadow-sm hover:bg-orange-50 transition-colors"
                            >
                              <span>{lang === 'bn' ? 'টেস্ট দিন' : 'Start Exam'}</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* 3. LISTENING */}
                  {(() => {
                    const score = getModuleScore('listening');
                    const hasCompleted = score !== null;
                    return (
                      <div className="aspect-square bg-gradient-to-br from-sky-600 to-indigo-800 rounded-3xl p-4 text-white shadow-md flex flex-col justify-between relative overflow-hidden">
                        <div className="flex items-center justify-between">
                          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                            <Headphones className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-[10px] font-bold bg-sky-950/40 px-2 py-0.5 rounded-full">
                            {hasCompleted ? (lang === 'bn' ? 'সম্পন্ন' : 'Completed') : 'Audio'}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-black text-sm text-white leading-tight">IELTS Listening</h4>
                          {hasCompleted ? (
                            <div className="mt-1">
                              <span className="text-[10px] text-sky-100 block">
                                {lang === 'bn' ? 'অর্জিত স্কোর:' : 'Achieved Score:'}
                              </span>
                              <span className="text-2xl font-black text-amber-300 font-mono">
                                ব্যান্ড: {score.toFixed(1)}
                              </span>
                            </div>
                          ) : (
                            <p className="text-[10px] text-sky-100 mt-0.5">
                              {lang === 'bn' ? 'অডিও নোট কমপ্লিশন' : 'Audio Note Completion'}
                            </p>
                          )}
                        </div>

                        <div className="pt-2 border-t border-white/20">
                          {hasCompleted ? (
                            <button
                              onClick={() => handleStartOrRetakeModule('listening')}
                              className="w-full py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>{lang === 'bn' ? 'পুনরায় পরীক্ষা দিন' : 'Retake Exam'}</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStartOrRetakeModule('listening')}
                              className="w-full py-1.5 rounded-xl bg-white text-indigo-950 text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer shadow-sm hover:bg-sky-50 transition-colors"
                            >
                              <span>{lang === 'bn' ? 'টেস্ট দিন' : 'Start Exam'}</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* 4. SPEAKING */}
                  {(() => {
                    const score = getModuleScore('speaking');
                    const hasCompleted = score !== null;
                    return (
                      <div className="aspect-square bg-gradient-to-br from-rose-600 to-pink-800 rounded-3xl p-4 text-white shadow-md flex flex-col justify-between relative overflow-hidden">
                        <div className="flex items-center justify-between">
                          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                            <Mic className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-[10px] font-bold bg-rose-950/40 px-2 py-0.5 rounded-full">
                            {hasCompleted ? (lang === 'bn' ? 'সম্পন্ন' : 'Completed') : 'Interview'}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-black text-sm text-white leading-tight">IELTS Speaking</h4>
                          {hasCompleted ? (
                            <div className="mt-1">
                              <span className="text-[10px] text-rose-100 block">
                                {lang === 'bn' ? 'অর্জিত স্কোর:' : 'Achieved Score:'}
                              </span>
                              <span className="text-2xl font-black text-amber-300 font-mono">
                                ব্যান্ড: {score.toFixed(1)}
                              </span>
                            </div>
                          ) : (
                            <p className="text-[10px] text-rose-100 mt-0.5">
                              {lang === 'bn' ? 'ক্যামব্রিজ এক্সামিনার ইন্টারভিউ' : 'Cambridge Examiner'}
                            </p>
                          )}
                        </div>

                        <div className="pt-2 border-t border-white/20">
                          {hasCompleted ? (
                            <button
                              onClick={() => handleStartOrRetakeModule('speaking')}
                              className="w-full py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>{lang === 'bn' ? 'পুনরায় পরীক্ষা দিন' : 'Retake Exam'}</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStartOrRetakeModule('speaking')}
                              className="w-full py-1.5 rounded-xl bg-white text-rose-950 text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer shadow-sm hover:bg-rose-50 transition-colors"
                            >
                              <span>{lang === 'bn' ? 'টেস্ট দিন' : 'Start Exam'}</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Full Mock Test Card */}
              <div className="bg-gradient-to-r from-[#0A2540] to-sky-950 p-4.5 rounded-3xl text-white shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    Complete Diagnostic
                  </span>
                  <span className="text-xs font-mono font-bold text-sky-200">
                    Quota: {user.examsCompleted} / {user.totalExamsQuota}
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-base text-white">
                    {lang === 'bn' ? 'সম্পূর্ণ ৩ ঘণ্টার ফুল মক টেস্ট' : 'Full 3-Hour IELTS Mock Test'}
                  </h4>
                  <p className="text-xs text-sky-100 mt-0.5">
                    {lang === 'bn'
                      ? 'লিসেনিং, রিডিং, রাইটিং ও স্পিকিং টেস্ট একসাথে দিয়ে অফিসিয়াল TRF সার্টিফিকেট ডাউনলোড করুন।'
                      : 'Take all 4 skills consecutively to generate your cumulative Cambridge TRF report.'}
                  </p>
                </div>

                <button
                  onClick={() => onNavigateToPage('full_mock_exam')}
                  className="w-full py-3 bg-[#FF5A36] hover:bg-[#EA580C] text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border-b-4 border-[#C2410C]"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{lang === 'bn' ? 'ফুল মক টেস্ট শুরু করুন' : 'Begin Full Mock Test'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: OLD EXAMS & CERTIFICATES */}
          {activeTab === 'old_exams' && (
            <div className="space-y-4 pb-28">
              <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
                <div>
                  <h3 className="font-extrabold text-sm text-[#0A2540]">
                    {lang === 'bn' ? 'পূর্ববর্তী পরীক্ষার রেকর্ড ও TRF' : 'Exam Records & Transcripts'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {lang === 'bn' ? 'অফিসিয়াল টেস্ট রিপোর্ট ফরম ও সার্টিফিকেট' : 'Official Cambridge Rubric TRF PDFs'}
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-400 font-mono">
                  {exams.length} {lang === 'bn' ? 'টি পরীক্ষা' : 'Tests'}
                </span>
              </div>

              {exams.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-400 text-xs">
                  {lang === 'bn' ? 'এখনও কোনো পরীক্ষা সম্পন্ন করা হয়নি।' : 'No exam records logged yet.'}
                </div>
              ) : (
                <div className="space-y-3">
                  {exams.map((rec) => (
                    <div
                      key={rec.id}
                      className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3 hover:border-slate-300 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-extrabold text-slate-900 text-sm block">
                            {rec.examTitle}
                          </span>
                          <span className="text-[11px] text-slate-500">{rec.date} • {rec.time}</span>
                        </div>

                        <div className="text-right">
                          <span className="text-2xl font-black text-amber-600 font-mono">
                            {rec.overallBand.toFixed(1)}
                          </span>
                          <span className="text-[10px] text-slate-400 block uppercase font-bold">
                            Band Score
                          </span>
                        </div>
                      </div>

                      {/* 4 Skill Chips */}
                      <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] bg-slate-50 p-2 rounded-xl">
                        <div>
                          <span className="text-slate-400 block">L</span>
                          <span className="font-bold text-slate-800 font-mono">{rec.listeningBand}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">R</span>
                          <span className="font-bold text-slate-800 font-mono">{rec.readingBand}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">W</span>
                          <span className="font-bold text-slate-800 font-mono">{rec.writingBand}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">S</span>
                          <span className="font-bold text-slate-800 font-mono">{rec.speakingBand}</span>
                        </div>
                      </div>

                      {/* Action to dedicated Transcript Page */}
                      <button
                        onClick={() => onNavigateToPage('transcript_view', rec)}
                        className="w-full py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-900 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-sky-200"
                      >
                        <FileText className="w-3.5 h-3.5 text-sky-700" />
                        <span>{lang === 'bn' ? 'অফিসিয়াল TRF সার্টিফিকেট পেজ দেখুন' : 'View Official TRF Page'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TONGUE TWISTER PRACTICE */}
          {activeTab === 'tongue_twister' && (
            <TongueTwisterTab lang={lang} />
          )}

          {/* TAB 4: MY ACCOUNT & SUBSCRIPTION STATUS */}
          {activeTab === 'account' && (
            <div className="space-y-4 pb-28">
              {/* Profile Card */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#0A2540] text-white flex items-center justify-center font-bold text-lg">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[#0A2540] text-base">{user.name}</h3>
                    <span className="text-xs text-slate-500 font-mono block">Roll #{user.rollNumber}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">{lang === 'bn' ? 'মোবাইল নম্বর:' : 'Mobile Number:'}</span>
                    <span className="font-bold font-mono text-slate-800">{user.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{lang === 'bn' ? 'জিমেইল এড্রেস:' : 'Gmail Address:'}</span>
                    <span className="font-medium text-slate-800 truncate max-w-[180px]">{user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{lang === 'bn' ? 'টার্গেট ব্যান্ড:' : 'Target Band:'}</span>
                    <span className="font-bold text-amber-600">Band {user.targetScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{lang === 'bn' ? 'রেফারেল কোড:' : 'Referral Code:'}</span>
                    <span className="font-mono font-bold text-sky-800">{user.referralCode}</span>
                  </div>
                </div>
              </div>

              {/* Subscription Lifecycle Card per user mandate */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {lang === 'bn' ? 'সাবস্ক্রিপশন ও মেয়াদ বিবরণ' : 'Subscription Lifecycle'}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      user.paymentStatus === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {user.paymentStatus === 'approved'
                      ? (lang === 'bn' ? 'অ্যাক্টিভ' : 'Active')
                      : (lang === 'bn' ? 'অনুমোদনের অপেক্ষায়' : 'Pending')}
                  </span>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">{lang === 'bn' ? 'প্যাকেজ:' : 'Package:'}</span>
                    <span className="font-bold text-slate-800">{user.subscriptionPlanTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{lang === 'bn' ? 'মেয়াদ গণনা:' : 'Expiry Countdown:'}</span>
                    <span className="font-bold font-mono text-emerald-700">
                      {formatRemainingDays(user.expiryDate)}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed bg-sky-50/60 p-3 rounded-2xl border border-sky-100">
                  {lang === 'bn'
                    ? '💡 নিয়মাবলী: সাবস্ক্রিপশনের মেয়াদ শেষ হলে পুরাতন টেস্ট ও রেজাল্ট দেখা যাবে, কিন্তু নতুন মক টেস্ট ও টাং টুইস্টার দিতে হলে প্ল্যান নবায়ন করতে হবে।'
                    : '💡 Policy: Once the subscription period ends, previous exams and transcripts remain accessible, but taking new exams requires renewal.'}
                </p>
              </div>

              {/* Log Out */}
              <button
                onClick={onResetApp}
                className="w-full py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-2xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>{lang === 'bn' ? 'লগআউট করুন' : 'Sign Out'}</span>
              </button>
            </div>
          )}
        </main>

        {/* 4. Bottom Navigation Bar */}
        <nav className="fixed bottom-0 max-w-md w-full bg-white border-t border-slate-200 px-3 py-2 z-30 flex items-center justify-around shadow-lg">
          {/* Tab 1: Exam Center */}
          <button
            onClick={() => setActiveTab('exam_center')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
              activeTab === 'exam_center' ? 'text-[#0A2540] font-black' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Award className={`w-5 h-5 ${activeTab === 'exam_center' ? 'text-[#0A2540]' : 'text-slate-400'}`} />
            <span className="text-[10px]">{lang === 'bn' ? 'পরীক্ষা' : 'Exams'}</span>
          </button>

          {/* Tab 2: Old Exams */}
          <button
            onClick={() => setActiveTab('old_exams')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
              activeTab === 'old_exams' ? 'text-[#0A2540] font-black' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <History className={`w-5 h-5 ${activeTab === 'old_exams' ? 'text-[#0A2540]' : 'text-slate-400'}`} />
            <span className="text-[10px]">{lang === 'bn' ? 'পুরাতন' : 'History'}</span>
          </button>

          {/* Tab 3: Tongue Twister */}
          <button
            onClick={() => setActiveTab('tongue_twister')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
              activeTab === 'tongue_twister' ? 'text-[#0A2540] font-black' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Flame className={`w-5 h-5 ${activeTab === 'tongue_twister' ? 'text-[#0A2540]' : 'text-slate-400'}`} />
            <span className="text-[10px]">{lang === 'bn' ? 'টাং টুইস্টার' : 'Twister'}</span>
          </button>

          {/* Tab 4: My Account */}
          <button
            onClick={() => setActiveTab('account')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
              activeTab === 'account' ? 'text-[#0A2540] font-black' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <User className={`w-5 h-5 ${activeTab === 'account' ? 'text-[#0A2540]' : 'text-slate-400'}`} />
            <span className="text-[10px]">{lang === 'bn' ? 'অ্যাকাউন্ট' : 'Account'}</span>
          </button>
        </nav>
      </div>
    </div>
  );
};
