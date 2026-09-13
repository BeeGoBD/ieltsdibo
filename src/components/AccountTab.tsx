import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  User,
  ShieldCheck,
  ShieldAlert,
  Award,
  BookOpen,
  Calendar,
  CreditCard,
  Download,
  Settings,
  Edit2,
  Check,
  LogOut,
  Sparkles,
  Phone,
  Mail,
  Hash,
  Clock,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { UserProfile, ExamRecord, AppLanguage } from '../types';
import { generateAllRecordsPdf } from '../utils/pdfGenerator';

interface AccountTabProps {
  user: UserProfile;
  exams: ExamRecord[];
  lang?: AppLanguage;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onResetApp: () => void;
  onOpenReferral?: () => void;
  onOpenSupport?: () => void;
}

const BAND_SCORES = ['5.5', '6.0', '6.5', '7.0', '7.5', '8.0', '8.5', '9.0'];
const WEAKNESS_LIST = [
  { id: 'reading', labelBn: 'রিডিং (Reading & True/False)', labelEn: 'Reading & Comprehension' },
  { id: 'writing', labelBn: 'রাইটিং (Writing Task 1 & 2)', labelEn: 'Writing Task 1 & 2' },
  { id: 'speaking', labelBn: 'স্পিকিং (Speaking & Fluency)', labelEn: 'Speaking & Pronunciation' },
  { id: 'listening', labelBn: 'লিসেনিং (Listening Audio)', labelEn: 'Listening & Accents' },
];

export const AccountTab: React.FC<AccountTabProps> = ({
  user,
  exams,
  lang = 'bn',
  onUpdateUser,
  onResetApp,
  onOpenReferral,
  onOpenSupport,
}) => {
  const [isEditingScore, setIsEditingScore] = useState(false);
  const [isEditingWeakness, setIsEditingWeakness] = useState(false);
  const [nameInput, setNameInput] = useState(user.name);
  const [isEditingName, setIsEditingName] = useState(false);

  const averageBand =
    exams.length > 0
      ? (exams.reduce((sum, e) => sum + e.overallBand, 0) / exams.length).toFixed(1)
      : '0.0';

  const highestBand =
    exams.length > 0 ? Math.max(...exams.map((e) => e.overallBand)).toFixed(1) : '0.0';

  return (
    <div className="space-y-4 pb-28">
      {/* 1. Profile Header Card */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3.5">
          {/* Avatar with Initials */}
          <div className="w-14 h-14 rounded-2xl bg-[#0A2540] text-amber-300 font-bold text-xl flex items-center justify-center shadow-md shrink-0">
            {user.name ? user.name.slice(0, 2).toUpperCase() : 'ID'}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="border border-sky-400 rounded-lg px-2 py-0.5 text-xs font-bold text-slate-800"
                  />
                  <button
                    onClick={() => {
                      onUpdateUser({ name: nameInput });
                      setIsEditingName(false);
                    }}
                    className="p-1 bg-emerald-600 text-white rounded-md cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-extrabold text-[#0A2540] truncate">
                    {user.name || 'Candidate Student'}
                  </h2>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Status Pill */}
              <button
                onClick={() =>
                  onUpdateUser({
                    paymentStatus: user.paymentStatus === 'approved' ? 'pending' : 'approved',
                  })
                }
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all border ${
                  user.paymentStatus === 'approved'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-amber-50 text-amber-700 border-amber-300 animate-pulse'
                }`}
                title="ক্লিক করে স্ট্যাটাস পরিবর্তন করুন"
              >
                {user.paymentStatus === 'approved' ? (
                  <>
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>অ্যাপ্রুভড ✓</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-3 h-3 text-amber-600" />
                    <span>পেন্ডিং (সুইচ)</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <Hash className="w-3.5 h-3.5 text-slate-400" />
              <span>রোল নম্বর: </span>
              <span className="font-mono font-bold text-slate-700">{user.rollNumber}</span>
            </p>
          </div>
        </div>

        {/* Contact Info Pills */}
        <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-600">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2 truncate">
            <Mail className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <span className="truncate">{user.email || 'student@ieltsdibo.com'}</span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2 truncate">
            <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{user.phone || '+880 1711-000000'}</span>
          </div>
        </div>
      </div>

      {/* 2. Target Band & Weakness Card */}
      <div className="bg-white p-4.5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-[#0A2540] uppercase tracking-wider">
            {lang === 'bn' ? 'টার্গেট ও পারসোনালাইজেশন' : 'Target & Study Profile'}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Target Score */}
          <div className="bg-sky-50/70 border border-sky-100 p-3 rounded-2xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-sky-800 font-bold uppercase">
                {lang === 'bn' ? 'টার্গেট ব্যান্ড' : 'Target Band'}
              </span>
              <button
                onClick={() => setIsEditingScore(!isEditingScore)}
                className="text-[10px] text-sky-700 font-bold hover:underline cursor-pointer"
              >
                {isEditingScore ? 'বাতিল' : 'পরিবর্তন'}
              </button>
            </div>
            <div className="text-2xl font-black text-[#0A2540] font-['Plus_Jakarta_Sans',sans-serif]">
              {user.targetScore}
            </div>
            <p className="text-[10px] text-sky-900">
              {parseFloat(user.targetScore) >= 8.0 ? 'উচ্চপর্যায় (Mastery)' : 'স্ট্যান্ডার্ড একাডেমিক'}
            </p>
          </div>

          {/* Weakness */}
          <div className="bg-amber-50/70 border border-amber-100 p-3 rounded-2xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-amber-800 font-bold uppercase">
                {lang === 'bn' ? 'চিহ্নিত দুর্বলতা' : 'Target Focus'}
              </span>
              <button
                onClick={() => setIsEditingWeakness(!isEditingWeakness)}
                className="text-[10px] text-amber-700 font-bold hover:underline cursor-pointer"
              >
                {isEditingWeakness ? 'বাতিল' : 'পরিবর্তন'}
              </button>
            </div>
            <div className="text-sm font-black text-amber-950 uppercase truncate">
              {user.weakness || 'Writing'}
            </div>
            <p className="text-[10px] text-amber-800">
              {lang === 'bn' ? 'বিশেষ এআই রিভিউর অধীনে' : 'Under AI Focus'}
            </p>
          </div>
        </div>

        {/* Edit Score Selector */}
        {isEditingScore && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2"
          >
            <span className="text-xs font-bold text-slate-700 block">
              {lang === 'bn' ? 'নতুন টার্গেট ব্যান্ড নির্ধারণ করুন:' : 'Select New Target Band:'}
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              {BAND_SCORES.map((score) => (
                <button
                  key={score}
                  onClick={() => {
                    onUpdateUser({ targetScore: score });
                    setIsEditingScore(false);
                  }}
                  className={`py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    user.targetScore === score
                      ? 'bg-[#0A2540] text-amber-300'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {score}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Edit Weakness Selector */}
        {isEditingWeakness && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2"
          >
            <span className="text-xs font-bold text-slate-700 block">
              {lang === 'bn' ? 'আপনার মূল দুর্বলতার বিষয় নির্বাচন করুন:' : 'Select Core Focus Skill:'}
            </span>
            <div className="space-y-1.5">
              {WEAKNESS_LIST.map((w) => (
                <button
                  key={w.id}
                  onClick={() => {
                    onUpdateUser({ weakness: w.id });
                    setIsEditingWeakness(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    user.weakness.toLowerCase() === w.id
                      ? 'bg-[#0A2540] text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{lang === 'bn' ? w.labelBn : w.labelEn}</span>
                  {user.weakness.toLowerCase() === w.id && <Check className="w-4 h-4 text-emerald-400" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* 3. Academic Transcript & All Records PDF Card */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-extrabold text-[#0A2540] uppercase tracking-wider">
              {lang === 'bn' ? 'একাডেমিক ট্রান্সক্রিপ্ট ও রেকর্ডস' : 'Academic Records & Transcript'}
            </h3>
            <p className="text-[11px] text-slate-500">
              {exams.length} {lang === 'bn' ? 'টি অফিসিয়াল মক টেস্ট সম্পন্ন হয়েছে' : 'Official Mocks Completed'}
            </p>
          </div>

          <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block">মোট পরীক্ষা</span>
            <span className="font-extrabold text-sm text-slate-800">{exams.length}</span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block">গড় স্কোর</span>
            <span className="font-extrabold text-sm text-sky-600 font-mono">{averageBand}</span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block">সর্বোচ্চ স্কোর</span>
            <span className="font-extrabold text-sm text-emerald-600 font-mono">{highestBand}</span>
          </div>
        </div>

        {/* Prominent All Records PDF Download Button */}
        <button
          onClick={() => generateAllRecordsPdf(exams, user)}
          className="w-full py-3 rounded-2xl bg-[#0A2540] hover:bg-slate-800 text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <Download className="w-4 h-4 text-amber-400" />
          <span>
            {lang === 'bn'
              ? 'সকল পরীক্ষার সমন্বিত PDF ডাউনলোড করুন (All Records PDF)'
              : 'Download All Records Transcript PDF'}
          </span>
        </button>
      </div>

      {/* 4. Subscription & Payment Details */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <h3 className="text-xs font-extrabold text-[#0A2540] uppercase tracking-wider">
          {lang === 'bn' ? 'পেমেন্ট ও সাবস্ক্রিপশন তথ্য' : 'Payment & Subscription Dossier'}
        </h3>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-500">সাবস্ক্রিপশন প্ল্যান:</span>
            <span className="font-bold text-slate-900">{user.subscriptionPlanTitle}</span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-500">পেমেন্ট মেথড:</span>
            <span className="font-bold text-slate-900">{user.paymentMethod || 'bKash'}</span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-500">ট্রানজেকশন আইডি (TrxID):</span>
            <span className="font-mono font-bold text-sky-800">{user.transactionId || 'TRX-89324792'}</span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-500">প্রেরক নম্বর:</span>
            <span className="font-mono font-bold text-slate-800">{user.senderNumber || user.phone || '01711-XXXXXX'}</span>
          </div>
        </div>
      </div>

      {/* 5. Account Actions */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-2">
        {onOpenReferral && (
          <button
            onClick={onOpenReferral}
            className="w-full p-3 rounded-2xl flex items-center justify-between text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-amber-600 font-bold">🎁</span>
              <span>{lang === 'bn' ? 'রেফারেল ওয়ালেট ও আয় দেখুন' : 'Referral Wallet & Earnings'}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <span className="text-emerald-600 font-mono font-bold">৳{user.walletBalance}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        )}

        {onOpenSupport && (
          <button
            onClick={onOpenSupport}
            className="w-full p-3 rounded-2xl flex items-center justify-between text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-sky-600 font-bold">💬</span>
              <span>{lang === 'bn' ? '২৪/৭ সাপোর্ট ও টিকিট' : '24/7 Support Center'}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        )}

        <button
          onClick={onResetApp}
          className="w-full p-3 rounded-2xl flex items-center justify-between text-xs font-bold text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <LogOut className="w-4 h-4" />
            <span>{lang === 'bn' ? 'নতুন সেশন শুরু করুন / লগআউট' : 'Start Fresh Session / Logout'}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-rose-400" />
        </button>
      </div>
    </div>
  );
};
