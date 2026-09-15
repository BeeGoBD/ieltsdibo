import React, { useState, useEffect } from 'react';
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
  Zap,
  AlertTriangle,
  Lock,
  Copy,
  Check,
  Sparkles,
  Sliders,
  ChevronRight,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { sound } from '../utils/soundEffects';
import { SoundControlModal } from './SoundControlModal';
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
import { TrialSubscriptionModal } from './TrialSubscriptionModal';

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
  onResetExams?: () => void;
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
  onResetExams,
}) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('exam_center');
  const [isChangingScore, setIsChangingScore] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSoundModalOpen, setIsSoundModalOpen] = useState(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [resetSuccessToast, setResetSuccessToast] = useState(false);
  const [copiedReferral, setCopiedReferral] = useState(false);

  const copyReferralCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(user.referralCode);
      setCopiedReferral(true);
      sound.playSuccess();
      setTimeout(() => setCopiedReferral(false), 2200);
    }
  };
  const [permissionNotice, setPermissionNotice] = useState<{
    title: string;
    message: string;
    type: 'unverified' | 'expired' | 'sessions';
  } | null>(null);

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

  const isNineTakaPlan =
    user.subscriptionPlanId === 'plan_1day' ||
    Boolean(user.subscriptionPlanTitle?.includes('৯') || user.subscriptionPlanTitle?.includes('9'));

  // Trial Mode State & 2-Minute Timer on Dashboard
  const isTrialUser = Boolean(user.isTrial || user.paymentStatus === 'trial');
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [trialDashboardTimeLeft, setTrialDashboardTimeLeft] = useState<number>(() => {
    if (!isTrialUser) return 120;
    if (user.trialStartedAt) {
      const elapsed = Math.floor((Date.now() - new Date(user.trialStartedAt).getTime()) / 1000);
      return Math.max(0, 120 - elapsed);
    }
    return 120;
  });

  useEffect(() => {
    if (!isTrialUser) return;
    const timer = setInterval(() => {
      setTrialDashboardTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          sound.playWrong();
          setShowTrialModal(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isTrialUser]);

  const handleStartOrRetakeModule = (mod: SkillCategory) => {
    if (user.paymentStatus !== 'approved' && !isTrialUser) {
      sound.playError();
      setPermissionNotice({
        title: lang === 'bn' ? '🔒 সাবস্ক্রাইবার পারমিশন নোটিশ' : '🔒 Subscriber Permission Required',
        message: lang === 'bn'
          ? 'আপনার অ্যাকাউন্টটি বর্তমানে ভেরিফিকেশন ও পেমেন্ট প্রসেসিংয়ে রয়েছে (১০-৩০ মিনিট সময় লাগে)। কেবলমাত্র অনুমোদিত সাবস্ক্রাইবারদের ক্যামব্রিজ মক টেস্ট ও এআই স্পিকিং ব্যবহারের অনুমতি দেওয়া হবে। ভেরিফিকেশন সম্পন্ন হলে স্বয়ংক্রিয়ভাবে পরীক্ষা চালু হবে।'
          : 'Your account and payment are currently being processed for verification (10-30 mins). Examinations and AI voice interviews are exclusively accessible to verified subscribers.',
        type: 'unverified',
      });
      return;
    }
    if (!isTrialUser && isExpired) {
      sound.playError();
      setPermissionNotice({
        title: lang === 'bn' ? '⚠️ সাবস্ক্রিপশন মেয়াদোত্তীর্ণ' : '⚠️ Subscription Expired',
        message: lang === 'bn'
          ? 'আপনার সাবস্ক্রিপশনের মেয়াদ শেষ হয়েছে। নতুন পরীক্ষা দেওয়ার জন্য প্ল্যান রিনিউ করুন।'
          : 'Your subscription has expired. Please renew your plan to take new exams.',
        type: 'expired',
      });
      return;
    }

    const currentSessions = user.availableSessions !== undefined ? user.availableSessions : 10;
    if (!isTrialUser && currentSessions <= 0) {
      sound.playError();
      setPermissionNotice({
        title: lang === 'bn' ? '⚠️ সেশন কোটা শেষ' : '⚠️ Session Quota Reached',
        message: lang === 'bn'
          ? 'আপনার সাবস্ক্রিপশন প্ল্যানের সকল সেশন ব্যবহার করা হয়েছে। নতুন পরীক্ষা দিতে প্ল্যান রিনিউ করুন।'
          : 'You have used all exam sessions in your current subscription plan.',
        type: 'sessions',
      });
      return;
    }

    sound.playSuccess();
    // Do not deduct session on exam start; session is counted upon completing exam cycle or reset
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

  const handleStartFullMock = () => {
    if (user.paymentStatus !== 'approved' && !isTrialUser) {
      sound.playError();
      setPermissionNotice({
        title: lang === 'bn' ? '🔒 সাবস্ক্রাইবার পারমিশন নোটিশ' : '🔒 Subscriber Permission Required',
        message: lang === 'bn'
          ? 'আপনার অ্যাকাউন্টটি বর্তমানে ভেরিফিকেশন ও পেমেন্ট প্রসেসিংয়ে রয়েছে (১০-৩০ মিনিট সময় লাগে)। কেবলমাত্র অনুমোদিত সাবস্ক্রাইবারদের ক্যামব্রিজ ফুল মক টেস্ট ব্যবহারের অনুমতি দেওয়া হবে।'
          : 'Your account and payment are pending verification. Full mock tests are reserved for verified subscribers.',
        type: 'unverified',
      });
      return;
    }
    if (!isTrialUser && isExpired) {
      sound.playError();
      setPermissionNotice({
        title: lang === 'bn' ? '⚠️ সাবস্ক্রিপশন মেয়াদোত্তীর্ণ' : '⚠️ Subscription Expired',
        message: lang === 'bn'
          ? 'আপনার সাবস্ক্রিপশনের মেয়াদ শেষ হয়েছে। নতুন পরীক্ষা দেওয়ার জন্য প্ল্যান রিনিউ করুন।'
          : 'Your subscription has expired. Please renew your plan.',
        type: 'expired',
      });
      return;
    }

    const currentSessions = user.availableSessions !== undefined ? user.availableSessions : 10;
    if (!isTrialUser && currentSessions <= 0) {
      sound.playError();
      setPermissionNotice({
        title: lang === 'bn' ? '⚠️ সেশন কোটা শেষ' : '⚠️ Session Quota Reached',
        message: lang === 'bn'
          ? 'আপনার সাবস্ক্রিপশন প্ল্যানের সকল সেশন ব্যবহার করা হয়েছে। নতুন পরীক্ষা দিতে প্ল্যান রিনিউ করুন।'
          : 'You have used all exam sessions.',
        type: 'sessions',
      });
      return;
    }

    sound.playSuccess();
    // Starting full mock does not deduct session; deducted on completion
    onNavigateToPage('full_mock_exam');
  };

  const handleConfirmResetExam = () => {
    if (isNineTakaPlan) {
      setShowResetConfirmModal(false);
      return;
    }

    const currentSessions = user.availableSessions !== undefined ? user.availableSessions : 10;
    if (currentSessions <= 0) {
      alert(
        lang === 'bn'
          ? 'আপনার কোনো অবশিষ্ট সেশন নেই। রিসেট করা সম্ভব নয়।'
          : 'No sessions available. Cannot reset exam.'
      );
      setShowResetConfirmModal(false);
      return;
    }

    if (onResetExams) {
      onResetExams();
    } else {
      onUpdateUser({
        availableSessions: Math.max(0, currentSessions - 1),
        moduleScores: {},
      });
    }
    setShowResetConfirmModal(false);
    setResetSuccessToast(true);
    setTimeout(() => {
      setResetSuccessToast(false);
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center selection:bg-rose-500 selection:text-white">
      {/* Responsive Container: Mobile + Laptop View */}
      <div className="w-full max-w-md md:max-w-5xl lg:max-w-6xl xl:max-w-7xl min-h-screen bg-slate-50 flex flex-col relative shadow-2xl md:shadow-none overflow-x-hidden md:border-x md:border-slate-200">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-[#0A2540] text-white px-4 md:px-6 py-3 border-b border-sky-900/50 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-1.5 rounded-xl hover:bg-white/10 text-white transition-colors cursor-pointer md:hidden"
              title={lang === 'bn' ? 'মেনু' : 'Menu'}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Dynamic Brand Logo */}
            <div className="flex flex-col">
              <span className="font-extrabold text-base md:text-lg tracking-tight text-white leading-none">
                {lang === 'bn' ? 'আইলস দিবো' : 'IELTS DIBO'}
              </span>
              <span className="text-[9px] md:text-[10px] text-sky-200 tracking-wider font-semibold">
                Official Cambridge Mock Test Center
              </span>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <div className="hidden md:flex items-center gap-1 bg-sky-950/60 p-1 rounded-2xl border border-white/10 text-xs font-bold">
            <button
              onClick={() => setActiveTab('exam_center')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'exam_center'
                  ? 'bg-amber-400 text-slate-950 shadow-xs font-black'
                  : 'text-sky-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>{lang === 'bn' ? 'মক টেস্ট সেন্টার' : 'Exam Center'}</span>
            </button>
            <button
              onClick={() => setActiveTab('old_exams')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'old_exams'
                  ? 'bg-amber-400 text-slate-950 shadow-xs font-black'
                  : 'text-sky-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <History className="w-4 h-4" />
              <span>{lang === 'bn' ? 'পরীক্ষার রেকর্ড ও TRF' : 'Exam Records'}</span>
            </button>
            <button
              onClick={() => setActiveTab('tongue_twister')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'tongue_twister'
                  ? 'bg-amber-400 text-slate-950 shadow-xs font-black'
                  : 'text-sky-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>{lang === 'bn' ? 'টাং টুইস্টার' : 'Tongue Twisters'}</span>
            </button>
            <button
              onClick={() => setActiveTab('account')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'account'
                  ? 'bg-amber-400 text-slate-950 shadow-xs font-black'
                  : 'text-sky-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <User className="w-4 h-4" />
              <span>{lang === 'bn' ? 'মাই অ্যাকাউন্ট' : 'My Account'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Live Available Sessions Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/40 rounded-xl text-xs font-bold shadow-xs">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
              <span>
                {lang === 'bn'
                  ? `সেশন: ${user.availableSessions !== undefined ? user.availableSessions : 10} টি`
                  : `Sessions: ${user.availableSessions !== undefined ? user.availableSessions : 10}`}
              </span>
            </div>

            {/* Sound Studio Button */}
            <button
              onClick={() => setIsSoundModalOpen(true)}
              className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-sky-100 flex items-center gap-1.5 transition-all cursor-pointer"
              title={lang === 'bn' ? 'ডুওলিঙ্গো সাউন্ড সেটিংস ও টেস্ট' : 'Duolingo Sound Settings & Test'}
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">{lang === 'bn' ? 'সাউন্ড' : 'Sound'}</span>
            </button>

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

        {/* Trial Mode Active Banner */}
        {isTrialUser && (
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white px-4 py-3 text-xs shadow-md border-b border-amber-600">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 shrink-0 text-amber-200 animate-spin" />
                <div>
                  <span className="font-black bg-black/25 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider mr-2">
                    {lang === 'bn' ? 'ফ্রি ট্রায়াল মোড' : 'Free Trial Mode'}
                  </span>
                  <span className="font-bold">
                    {lang === 'bn'
                      ? `সাবস্ক্রাইবারদের সব ফিচার আনলক রয়েছে (২ মিনিট ট্রায়াল)। বাকি সময়: ${Math.floor(trialDashboardTimeLeft / 60)}:${(trialDashboardTimeLeft % 60).toString().padStart(2, '0')}`
                      : `All subscriber features unlocked (2-min trial). Remaining: ${Math.floor(trialDashboardTimeLeft / 60)}:${(trialDashboardTimeLeft % 60).toString().padStart(2, '0')}`}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    sound.playClick();
                    setShowTrialModal(true);
                  }}
                  className="px-3.5 py-1.5 bg-[#0A2540] hover:bg-slate-900 text-white font-black text-xs rounded-xl border border-amber-300 shadow-sm cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>{lang === 'bn' ? 'সাবস্ক্রিপশন প্ল্যান দেখুন' : 'View Plans'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pending Verification Notice Bar if not yet approved */}
        {user.paymentStatus === 'pending' && (
          <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 px-4 py-3 text-xs shadow-md border-b border-amber-600">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-start sm:items-center gap-2">
                <Clock className="w-4 h-4 shrink-0 text-slate-950 mt-0.5 sm:mt-0 animate-spin" />
                <div>
                  <span className="font-black text-xs block sm:inline">
                    {lang === 'bn'
                      ? '⚠️ অ্যাকাউন্ট স্ট্যাটাস: ভেরিফিকেশন ও পেমেন্ট প্রসেসিং চলছে'
                      : '⚠️ Status: Account Verification & Payment Processing'}
                  </span>
                  <span className="text-[11px] font-medium text-slate-900 block sm:inline sm:ml-2">
                    {lang === 'bn'
                      ? '১০-৩০ মিনিটের মধ্যে অ্যাডমিন ভেরিফিকেশন সম্পন্ন হলে মক টেস্টের পূর্ণ পারমিশন চালু হবে।'
                      : 'Your payment is being verified (10-30 mins). Subscriber permissions unlock upon verification.'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] bg-slate-950/20 px-2.5 py-1 rounded-lg font-mono font-bold">
                  TrxID: {user.transactionId || 'Processing'}
                </span>
                <button
                  onClick={() => onNavigateToPage('support')}
                  className="text-[11px] bg-slate-950 text-white hover:bg-slate-800 px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-all"
                >
                  {lang === 'bn' ? 'সাপোর্ট' : 'Support'}
                </button>
              </div>
            </div>
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

                    {/* Duolingo Sound Studio */}
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsSoundModalOpen(true);
                      }}
                      className="w-full p-2.5 rounded-xl flex items-center gap-3 text-slate-700 hover:bg-amber-50 hover:text-amber-950 transition-colors text-left cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4 text-amber-600" />
                      <div className="flex items-center justify-between flex-1">
                        <span>{lang === 'bn' ? 'ডুওলিঙ্গো সাউন্ড সেটিংস' : 'Duolingo Sound Settings'}</span>
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-extrabold px-1.5 py-0.5 rounded">
                          LOUD
                        </span>
                      </div>
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
                      <div className="mt-2 bg-slate-50 p-2 rounded-xl border border-slate-200 space-y-1 max-h-48 overflow-y-auto shadow-inner">
                        {[
                          { val: '5.0', tier: lang === 'bn' ? 'বেসিক (সহজ)' : 'Foundation (Easy)' },
                          { val: '5.5', tier: lang === 'bn' ? 'বেসিক (সহজ)' : 'Foundation (Easy)' },
                          { val: '6.0', tier: lang === 'bn' ? 'মিডিয়াম' : 'Moderate' },
                          { val: '6.5', tier: lang === 'bn' ? 'মিডিয়াম' : 'Moderate' },
                          { val: '7.0', tier: lang === 'bn' ? 'স্ট্যান্ডার্ড' : 'Standard' },
                          { val: '7.5', tier: lang === 'bn' ? 'চ্যালেঞ্জিং (কঠিন)' : 'Challenging (Hard)' },
                          { val: '8.0', tier: lang === 'bn' ? 'চ্যালেঞ্জিং (কঠিন)' : 'Challenging (Hard)' },
                          { val: '8.5', tier: lang === 'bn' ? 'মাস্টারি (সর্বোচ্চ কঠিন)' : 'Mastery (Tough)' },
                          { val: '9.0', tier: lang === 'bn' ? 'মাস্টারি (সর্বোচ্চ কঠিন)' : 'Mastery (Tough)' },
                        ].map((item) => (
                          <button
                            key={item.val}
                            onClick={() => {
                              onUpdateUser({ targetScore: item.val });
                              setIsChangingScore(false);
                            }}
                            className={`w-full py-1.5 text-xs font-bold rounded-lg text-left px-2 cursor-pointer flex items-center justify-between transition-colors ${
                              user.targetScore === item.val
                                ? 'bg-[#0A2540] text-white'
                                : 'hover:bg-slate-200 text-slate-700'
                            }`}
                          >
                            <span>Band {item.val}</span>
                            <span className="text-[9px] opacity-75 font-normal">{item.tier}</span>
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
                  <button
                    id="reset-exam-button"
                    type="button"
                    onClick={() => setShowResetConfirmModal(true)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 active:bg-rose-200/80 border border-rose-200/80 rounded-xl transition-all cursor-pointer shadow-2xs"
                    title={lang === 'bn' ? 'পরীক্ষার সমস্ত অগ্রগতি রিসেট করুন' : 'Reset all exam progress'}
                  >
                    <RotateCcw className="w-3 h-3 text-rose-500" />
                    <span>{lang === 'bn' ? 'রিসেট এক্সাম' : 'Reset Exam'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                  {/* 1. LISTENING */}
                  {(() => {
                    const score = getModuleScore('listening');
                    const hasCompleted = score !== null;
                    return (
                      <div className="min-h-[190px] lg:min-h-[220px] bg-gradient-to-br from-sky-600 to-indigo-800 rounded-3xl p-4 lg:p-5 text-white shadow-md flex flex-col justify-between relative overflow-hidden">
                        <div className="flex items-center justify-between">
                          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                            <Headphones className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-[10px] font-bold bg-sky-950/40 px-2 py-0.5 rounded-full">
                            {hasCompleted ? (lang === 'bn' ? 'সম্পন্ন' : 'Completed') : '1. Audio'}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-black text-sm lg:text-base text-white leading-tight">IELTS Listening</h4>
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
                              {lang === 'bn' ? 'অডিও নোট কমপ্লিশন ও MCQ' : 'Audio Note Completion'}
                            </p>
                          )}
                        </div>

                        <div className="pt-2 border-t border-white/20">
                          {hasCompleted ? (
                            <button
                              onClick={() => handleStartOrRetakeModule('listening')}
                              className="w-full py-1.5 lg:py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>{lang === 'bn' ? 'পুনরায় পরীক্ষা দিন' : 'Retake Exam'}</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStartOrRetakeModule('listening')}
                              className="w-full py-1.5 lg:py-2 rounded-xl bg-white text-indigo-950 text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer shadow-sm hover:bg-sky-50 transition-colors"
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
                      <div className="min-h-[190px] lg:min-h-[220px] bg-gradient-to-br from-amber-500 to-orange-700 rounded-3xl p-4 lg:p-5 text-white shadow-md flex flex-col justify-between relative overflow-hidden">
                        <div className="flex items-center justify-between">
                          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                            <PenTool className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-[10px] font-bold bg-amber-950/40 px-2 py-0.5 rounded-full">
                            {hasCompleted ? (lang === 'bn' ? 'সম্পন্ন' : 'Completed') : '2. Task 2'}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-black text-sm lg:text-base text-white leading-tight">IELTS Writing</h4>
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
                              className="w-full py-1.5 lg:py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>{lang === 'bn' ? 'পুনরায় পরীক্ষা দিন' : 'Retake Exam'}</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStartOrRetakeModule('writing')}
                              className="w-full py-1.5 lg:py-2 rounded-xl bg-white text-orange-950 text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer shadow-sm hover:bg-orange-50 transition-colors"
                            >
                              <span>{lang === 'bn' ? 'টেস্ট দিন' : 'Start Exam'}</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* 3. READING */}
                  {(() => {
                    const score = getModuleScore('reading');
                    const hasCompleted = score !== null;
                    return (
                      <div className="min-h-[190px] lg:min-h-[220px] bg-gradient-to-br from-emerald-600 to-teal-800 rounded-3xl p-4 lg:p-5 text-white shadow-md flex flex-col justify-between relative overflow-hidden">
                        <div className="flex items-center justify-between">
                          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-[10px] font-bold bg-emerald-950/40 px-2 py-0.5 rounded-full">
                            {hasCompleted ? (lang === 'bn' ? 'সম্পন্ন' : 'Completed') : '3. Reading'}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-black text-sm lg:text-base text-white leading-tight">IELTS Reading</h4>
                          {hasCompleted ? (
                            <div className="mt-1">
                              <span className="text-[10px] text-emerald-100 block">
                                {lang === 'bn' ? 'অর্জিত স্কোর:' : 'Achieved Score:'}
                              </span>
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
                              className="w-full py-1.5 lg:py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>{lang === 'bn' ? 'পুনরায় পরীক্ষা দিন' : 'Retake Exam'}</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStartOrRetakeModule('reading')}
                              className="w-full py-1.5 lg:py-2 rounded-xl bg-white text-emerald-950 text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer shadow-sm hover:bg-emerald-50 transition-colors"
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
                      <div className="min-h-[190px] lg:min-h-[220px] bg-gradient-to-br from-rose-600 to-pink-800 rounded-3xl p-4 lg:p-5 text-white shadow-md flex flex-col justify-between relative overflow-hidden">
                        <div className="flex items-center justify-between">
                          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                            <Mic className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-[10px] font-bold bg-rose-950/40 px-2 py-0.5 rounded-full">
                            {hasCompleted ? (lang === 'bn' ? 'সম্পন্ন' : 'Completed') : '4. Speaking'}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-black text-sm lg:text-base text-white leading-tight">IELTS Speaking</h4>
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
                              {lang === 'bn' ? 'ক্যামব্রিজ এক্সামিনার ইন্টারভিউ' : 'Voice-Only AI Examiner'}
                            </p>
                          )}
                        </div>

                        <div className="pt-2 border-t border-white/20">
                          {hasCompleted ? (
                            <button
                              onClick={() => handleStartOrRetakeModule('speaking')}
                              className="w-full py-1.5 lg:py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>{lang === 'bn' ? 'পুনরায় পরীক্ষা দিন' : 'Retake Exam'}</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStartOrRetakeModule('speaking')}
                              className="w-full py-1.5 lg:py-2 rounded-xl bg-white text-rose-950 text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer shadow-sm hover:bg-rose-50 transition-colors"
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
              <div className="bg-gradient-to-r from-[#0A2540] to-sky-950 p-5 rounded-3xl text-white shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    Complete Diagnostic • 1 Session Deduction
                  </span>
                  <span className="text-xs font-mono font-bold text-sky-200">
                    Remaining Sessions: {user.availableSessions !== undefined ? user.availableSessions : 10}
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-base md:text-lg text-white">
                    {lang === 'bn' ? 'সম্পূর্ণ ৩ ঘণ্টার ফুল মক টেস্ট' : 'Full 3-Hour IELTS Mock Test'}
                  </h4>
                  <p className="text-xs text-sky-100 mt-0.5">
                    {lang === 'bn'
                      ? 'লিসেনিং, রাইটিং, রিডিং ও স্পিকিং টেস্ট একসাথে সম্পন্ন করে অফিসিয়াল TRF ও সার্টিফিকেট ডাউনলোড করুন।'
                      : 'Take Listening, Writing, Reading, and Speaking consecutively to generate your cumulative Cambridge TRF report.'}
                  </p>
                </div>

                <button
                  onClick={handleStartFullMock}
                  className="w-full py-3 bg-[#FF5A36] hover:bg-[#EA580C] text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border-b-4 border-[#C2410C]"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{lang === 'bn' ? 'ফুল মক টেস্ট শুরু করুন (১টি সেশন কাটা হবে)' : 'Begin Full Mock Test (Deducts 1 Session)'}</span>
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
              {/* Executive Cambridge Candidate Passport / Identity Card */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A2540] via-[#0f365d] to-[#061828] text-white p-6 shadow-xl border border-sky-900/60">
                {/* Decorative background glow & emblem */}
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-44 h-44 bg-sky-500/10 rounded-full blur-2xl pointer-events-none"></div>
                <div className="absolute bottom-0 right-3 opacity-5 pointer-events-none">
                  <Award className="w-36 h-36 text-white" />
                </div>

                <div className="relative z-10 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg border-2 border-white/20">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-white text-lg tracking-tight">{user.name}</h3>
                          <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                            <span>{lang === 'bn' ? 'ভেরিফাইড ক্যান্ডিডেট' : 'Verified Candidate'}</span>
                          </span>
                        </div>
                        <span className="text-xs text-sky-200 font-mono tracking-wide block mt-0.5">
                          ID: {user.rollNumber || 'DIBO-2026-9819'}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase tracking-wider text-amber-300/80 font-bold block">
                        {lang === 'bn' ? 'টার্গেট ব্যান্ড' : 'Target Band'}
                      </span>
                      <span className="font-black text-2xl text-amber-400 font-mono">
                        Band {user.targetScore}
                      </span>
                    </div>
                  </div>

                  {/* Candidate Attributes Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                    <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded-xl border border-white/10">
                      <span className="text-[10px] text-sky-200 block">{lang === 'bn' ? 'মোবাইল নম্বর' : 'Mobile'}</span>
                      <span className="font-mono font-bold text-white truncate block">{user.phone}</span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded-xl border border-white/10">
                      <span className="text-[10px] text-sky-200 block">{lang === 'bn' ? 'জিমেইল এড্রেস' : 'Gmail'}</span>
                      <span className="font-medium text-white truncate block" title={user.email}>{user.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Target Band Calibrator (Direct difficulty controller) */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-[#0A2540]">
                        {lang === 'bn' ? 'টার্গেট ব্যান্ড ও কাঠিন্য অ্যাডজাস্টার' : 'Target Band & Exam Rigor Calibrator'}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {lang === 'bn'
                          ? 'ব্যান্ড পরিবর্তনের সাথে সাথে পরীক্ষার প্রশ্নের জটিলতা ও এআই কাঠিন্য স্বয়ংক্রিয়ভাবে পরিবর্তিত হবে।'
                          : 'Changing target band instantly adapts listening speed, reading tier & speaking rigor.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Interactive Band Selector Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 pt-1">
                  {[
                    { val: '5.0', label: 'Band 5.0', tier: 'Foundation', descBn: 'সহজ (বেসিক)' },
                    { val: '5.5', label: 'Band 5.5', tier: 'Foundation', descBn: 'সহজ (বেসিক)' },
                    { val: '6.0', label: 'Band 6.0', tier: 'Moderate', descBn: 'মিডিয়াম' },
                    { val: '6.5', label: 'Band 6.5', tier: 'Moderate', descBn: 'মিডিয়াম' },
                    { val: '7.0', label: 'Band 7.0', tier: 'Moderate', descBn: 'স্ট্যান্ডার্ড' },
                    { val: '7.5', label: 'Band 7.5', tier: 'Challenging', descBn: 'কঠিন' },
                    { val: '8.0', label: 'Band 8.0', tier: 'Challenging', descBn: 'কঠিন' },
                    { val: '8.5', label: 'Band 8.5', tier: 'Mastery', descBn: 'উচ্চ কঠিন' },
                    { val: '9.0', label: 'Band 9.0', tier: 'Mastery', descBn: 'সর্বোচ্চ' },
                  ].map((b) => {
                    const isSelected = user.targetScore === b.val;
                    return (
                      <button
                        key={b.val}
                        onClick={() => {
                          onUpdateUser({ targetScore: b.val });
                          sound.playSuccess();
                        }}
                        className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#0A2540] text-white border-[#0A2540] shadow-md scale-[1.02]'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <span className="font-extrabold text-xs block">{b.label}</span>
                        <span className={`text-[10px] block mt-0.5 ${isSelected ? 'text-amber-300' : 'text-slate-500'}`}>
                          {lang === 'bn' ? b.descBn : b.tier}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Active Tier Summary Card */}
                <div className="bg-sky-50/70 p-3 rounded-2xl border border-sky-100 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />
                    <div>
                      <span className="font-bold text-sky-950 block">
                        {lang === 'bn' ? 'বর্তমান সক্রিয় কাঠিন্য স্তর:' : 'Current Active Difficulty Tier:'}{' '}
                        <span className="text-sky-700">{diffProbs.labelBn}</span>
                      </span>
                      <span className="text-[11px] text-slate-600">
                        {diffProbs.hard}% Hard · {diffProbs.medium}% Medium · {diffProbs.easy}% Easy
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-sky-200/60 text-sky-900 font-bold px-2 py-0.5 rounded-lg">
                    Active
                  </span>
                </div>
              </div>

              {/* Student Referral & Wallet Hub */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Wallet className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-[#0A2540]">
                        {lang === 'bn' ? 'স্টুডেন্ট ওয়ালেট ও রেফারেল আর্নিং' : 'Referral Wallet & Student Earnings'}
                      </h4>
                      <span className="text-[11px] text-slate-500">
                        {lang === 'bn' ? 'বিকাশ অথবা নগদে তাৎক্ষণিক উত্তোলনযোগ্য' : 'Direct withdrawable via bKash / Nagad'}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    {lang === 'bn' ? 'উত্তোলনযোগ্য ব্যালেন্স' : 'Withdrawable'}
                  </span>
                </div>

                <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-4 rounded-2xl text-white flex items-center justify-between shadow-sm">
                  <div>
                    <span className="text-[11px] text-emerald-100 font-medium block">
                      {lang === 'bn' ? 'মোট রেফারেল ব্যালেন্স' : 'Total Referral Balance'}
                    </span>
                    <span className="font-black text-2xl tracking-tight">
                      ৳{(user.walletBalance !== undefined ? user.walletBalance : 5000).toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => onNavigateToPage('withdraw')}
                    className="px-3.5 py-2 bg-white text-emerald-900 font-extrabold text-xs rounded-xl hover:bg-emerald-50 active:scale-95 transition-all shadow cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{lang === 'bn' ? 'টাকা তুলুন' : 'Withdraw Now'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 1-Click Referral Code Copy */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">
                      {lang === 'bn' ? 'আপনার ইউনিক রেফারেল কোড' : 'Your Unique Referral Code'}
                    </span>
                    <span className="font-mono font-black text-slate-800 text-sm tracking-wider">
                      {user.referralCode || 'NAHIDA9819'}
                    </span>
                  </div>
                  <button
                    onClick={copyReferralCode}
                    className="px-3 py-1.5 bg-[#0A2540] hover:bg-sky-900 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedReferral ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedReferral ? (lang === 'bn' ? 'কপি হয়েছে!' : 'Copied!') : (lang === 'bn' ? 'কপি কোড' : 'Copy')}</span>
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onNavigateToPage('referral')}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Gift className="w-3.5 h-3.5 text-sky-700" />
                    <span>{lang === 'bn' ? 'রেফারেল ড্যাশবোর্ড দেখুন' : 'View Referral Hub'}</span>
                  </button>
                </div>
              </div>

              {/* Subscription Lifecycle & Exam Sessions Status */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {lang === 'bn' ? 'সাবস্ক্রিপশন ও সেশন বিবরণ' : 'Subscription & Exam Sessions'}
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

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
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
                  <div className="flex justify-between border-t border-slate-200/80 pt-2">
                    <span className="text-slate-500">{lang === 'bn' ? 'উপলব্ধ পরীক্ষা সেশন:' : 'Available Exam Sessions:'}</span>
                    <span className="font-bold font-mono text-[#0A2540]">
                      {user.availableSessions !== undefined ? user.availableSessions : 10} / {user.dailySessionsQuota || 10} {lang === 'bn' ? 'সেশন' : 'Sessions'}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed bg-sky-50/60 p-3 rounded-2xl border border-sky-100">
                  {lang === 'bn'
                    ? '💡 সেশন নিয়মাবলী: পরীক্ষা শুরু করলেই সেশন কাটা হয় না। সম্পূর্ণ পরীক্ষা সম্পন্ন করলে অথবা রিসেট এক্সাম বোতাম চাপলেই কেবল ১টি সেশন খরচ হিসেবে গণ্য হবে।'
                    : '💡 Cambridge Session Policy: Starting an exam never consumes quota. A session is strictly deducted only upon completing an entire exam or performing an explicit exam reset.'}
                </p>
              </div>

              {/* Useful Portal Links */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onNavigateToPage('band_guide')}
                  className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-left flex items-center justify-between cursor-pointer transition-colors shadow-2xs"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-sky-700" />
                    <span className="font-bold text-xs text-slate-800">
                      {lang === 'bn' ? 'ব্যান্ড স্কোর গাইড' : 'Band Score Guide'}
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() => onNavigateToPage('support')}
                  className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-left flex items-center justify-between cursor-pointer transition-colors shadow-2xs"
                >
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-emerald-700" />
                    <span className="font-bold text-xs text-slate-800">
                      {lang === 'bn' ? 'সাপোর্ট ডেস্ক' : 'Support Desk'}
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>

              {/* Log Out */}
              <button
                onClick={onResetApp}
                className="w-full py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-2xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer border border-rose-200/80"
              >
                <LogOut className="w-4 h-4 text-rose-600" />
                <span>{lang === 'bn' ? 'অ্যাকাউন্ট থেকে লগআউট করুন' : 'Sign Out of Account'}</span>
              </button>
            </div>
          )}
        </main>

        {/* 4. Bottom Navigation Bar (Visible only on mobile / Android; desktop uses the top header tabs) */}
        <nav className="md:hidden fixed bottom-0 max-w-md w-full bg-white border-t border-slate-200 px-3 py-2 z-30 flex items-center justify-around shadow-lg">
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

        {/* Reset Exam Confirmation Modal (Requires clicking OK to confirm) */}
        {showResetConfirmModal && (
          <div
            id="reset-exam-confirm-modal"
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-modal-title"
          >
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-150">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3.5 shadow-xs ${
                  isNineTakaPlan ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'
                }`}
              >
                {isNineTakaPlan ? <AlertCircle className="w-6 h-6" /> : <RotateCcw className="w-6 h-6" />}
              </div>

              <h3 id="reset-modal-title" className="text-base font-black text-[#0A2540]">
                {isNineTakaPlan
                  ? (lang === 'bn' ? 'রিসেট প্রযোজ্য নয়' : 'Reset Option Not Available')
                  : (lang === 'bn' ? 'সতর্কবার্তা: পরীক্ষা রিসেট' : 'Warning: Reset Exam Results')}
              </h3>

              <div className="text-xs text-slate-600 mt-2 leading-relaxed space-y-2">
                {isNineTakaPlan ? (
                  <p className="text-rose-600 font-semibold">
                    {lang === 'bn'
                      ? '৯ টাকার সাবস্ক্রিপশন প্ল্যানের জন্য এক্সাম রিসেট অপশনটি প্রযোজ্য নয়। পুনরায় পরীক্ষা দিতে অনুগ্রহ করে স্ট্যান্ডার্ড প্ল্যান গ্রহণ করুন।'
                      : 'The 9 Taka subscription is not applicable for the reset option. Please upgrade to a standard subscription plan to retake.'}
                  </p>
                ) : (
                  <>
                    <p className="font-bold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                      {lang === 'bn'
                        ? '⚠️ ফলাফল রিসেট করার মাধ্যমে আপনার অ্যাকাউন্ট থেকে ১টি সেশন কর্তন করা হবে।'
                        : '⚠️ Warning: By resetting the result, you will lose one session from your subscription.'}
                    </p>
                    <p>
                      {lang === 'bn'
                        ? `রিসেট করার পর আপনার অবশিষ্ট সেশন থাকবে: ${Math.max(0, (user.availableSessions ?? 10) - 1)} টি। আপনি কি নিশ্চিত যে আপনি পরীক্ষা রিসেট করতে চান?`
                        : `Remaining sessions after reset: ${Math.max(0, (user.availableSessions ?? 10) - 1)}. Click OK to confirm or Cancel to keep your scores.`}
                    </p>
                  </>
                )}
              </div>

              <div className="flex items-center gap-3 mt-6">
                {isNineTakaPlan ? (
                  <button
                    onClick={() => setShowResetConfirmModal(false)}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-black shadow-md cursor-pointer"
                  >
                    {lang === 'bn' ? 'ঠিক আছে (Close)' : 'Close'}
                  </button>
                ) : (
                  <>
                    <button
                      id="cancel-reset-exam-btn"
                      type="button"
                      onClick={() => setShowResetConfirmModal(false)}
                      className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      {lang === 'bn' ? 'বাতিল (Cancel)' : 'Cancel'}
                    </button>

                    <button
                      id="confirm-ok-reset-exam-btn"
                      type="button"
                      onClick={handleConfirmResetExam}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-black shadow-md shadow-rose-600/25 transition-all cursor-pointer"
                    >
                      {lang === 'bn' ? 'ঠিক আছে (OK)' : 'OK'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Reset Success Toast */}
        {resetSuccessToast && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 animate-in slide-in-from-top duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>
              {lang === 'bn'
                ? 'পরীক্ষার সমস্ত অগ্রগতি সফলভাবে রিসেট করা হয়েছে!'
                : 'Exam progress and scores have been reset successfully!'}
            </span>
          </div>
        )}

        {/* Subscriber Verification & Permission Warning Modal */}
        {permissionNotice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-amber-300 text-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#0A2540]">
                    {permissionNotice.title}
                  </h3>
                  <span className="text-[11px] text-amber-700 font-semibold">
                    Subscriber Privileges Required
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-xs text-slate-700 leading-relaxed">
                {permissionNotice.message}
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => {
                    sound.playClick();
                    setPermissionNotice(null);
                    onNavigateToPage('support');
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  {lang === 'bn' ? 'সাপোর্ট হেল্পলাইন' : 'Contact Support'}
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    setPermissionNotice(null);
                  }}
                  className="flex-1 py-2.5 px-5 rounded-xl bg-[#0A2540] hover:bg-sky-950 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
                >
                  {lang === 'bn' ? 'বুঝেছি (Got It)' : 'Got It'}
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Sound Studio Settings & Test Modal */}
        <SoundControlModal
          isOpen={isSoundModalOpen}
          onClose={() => setIsSoundModalOpen(false)}
          lang={lang}
        />

        {/* Trial Expired Subscription Modal */}
        <TrialSubscriptionModal
          isOpen={showTrialModal}
          onClose={() => setShowTrialModal(false)}
          onSelectPlanAndProceed={(planId) => {
            setShowTrialModal(false);
            onNavigateToPage('pricing', { planId });
          }}
          lang={lang}
          sectionName="general"
          allowDismiss={true}
        />
      </div>
    </div>
  );
};
