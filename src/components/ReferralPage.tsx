import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Gift,
  Copy,
  CheckCheck,
  Wallet,
  ArrowDownToLine,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Share2,
  ShieldAlert,
} from 'lucide-react';
import { UserProfile, WithdrawRecord, AppLanguage } from '../types';

interface ReferralPageProps {
  user: UserProfile;
  withdrawHistory: WithdrawRecord[];
  lang?: AppLanguage;
  onBack: () => void;
  onGoToWithdraw: () => void;
  onSimulateReferralPurchase?: () => void;
}

export const ReferralPage: React.FC<ReferralPageProps> = ({
  user,
  withdrawHistory,
  lang = 'bn',
  onBack,
  onGoToWithdraw,
  onSimulateReferralPurchase,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(user.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText =
    lang === 'bn'
      ? `IELTS DIBO (আইলস দিবো) প্ল্যাটফর্মে আমার রেফারেল কোড "${user.referralCode}" ব্যবহার করে জয়েন করুন এবং অফিসিয়াল ক্যামব্রিজ মক টেস্ট দিন!`
      : `Join IELTS DIBO mock platform using my referral code "${user.referralCode}" for authentic Cambridge practice!`;

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: lang === 'bn' ? 'IELTS DIBO রেফারেল' : 'IELTS DIBO Referral',
        text: shareText,
        url: window.location.origin,
      });
    } else {
      handleCopyCode();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 pb-12">
      {/* Top Header */}
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
            {lang === 'bn' ? 'রেফার ও ইনকাম' : 'Refer & Earn'}
          </h1>

          <div className="w-12"></div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-md mx-auto w-full px-4 pt-4 flex-1 space-y-4">
        {/* Wallet Balance Card */}
        <div className="bg-gradient-to-br from-[#0A2540] to-[#133E68] text-white p-5 rounded-3xl shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-amber-300">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-sky-200 block">
                  {lang === 'bn' ? 'রেফারেল ওয়ালেট ব্যালেন্স' : 'Referral Wallet Balance'}
                </span>
                <h3 className="text-2xl font-black text-amber-300 font-mono">
                  ৳{user.walletBalance.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US')}
                </h3>
              </div>
            </div>

            <button
              onClick={onGoToWithdraw}
              className="px-4 py-2.5 rounded-xl bg-[#FF5A36] hover:bg-[#EA580C] text-white text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all border-b-2 border-[#C2410C]"
            >
              <ArrowDownToLine className="w-4 h-4" />
              <span>{lang === 'bn' ? 'টাকা তুলুন' : 'Withdraw'}</span>
            </button>
          </div>

          <div className="bg-white/10 rounded-2xl p-3 text-xs text-sky-100 flex items-center justify-between mt-2 border border-white/10">
            <span>{lang === 'bn' ? 'প্রতি সফল রেফারে পাবেন:' : 'Per Approved Referral:'}</span>
            <span className="font-extrabold text-amber-300">
              {lang === 'bn' ? 'সরাসরি ৳১০০' : 'Instant ৳100'}
            </span>
          </div>
        </div>

        {/* Your Referral Code */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">
              {lang === 'bn' ? 'আপনার ইউনিক রেফারেল কোড' : 'Your Unique Referral Code'}
            </span>
            <span className="text-[10px] bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full font-bold">
              {lang === 'bn' ? 'আজীবন বৈধ' : 'Lifetime Valid'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 font-mono font-black text-lg tracking-wider text-[#0A2540] text-center select-all">
              {user.referralCode}
            </div>

            <button
              onClick={handleCopyCode}
              className={`p-3.5 rounded-2xl border font-bold text-xs transition-all cursor-pointer flex items-center justify-center ${
                copied
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : 'bg-[#0A2540] border-[#0A2540] text-white hover:bg-slate-800'
              }`}
              title={lang === 'bn' ? 'কোড কপি করুন' : 'Copy Code'}
            >
              {copied ? <CheckCheck className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>

          <button
            onClick={handleNativeShare}
            className="w-full py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-sky-600" />
            <span>{lang === 'bn' ? 'বন্ধুদের সাথে শেয়ার করুন' : 'Share with Friends'}</span>
          </button>
        </div>

        {/* How It Works Steps */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <h4 className="text-xs font-extrabold text-[#0A2540] uppercase tracking-wider">
            {lang === 'bn' ? 'ইনকাম করার নিয়ম' : 'Referral Reward Guidelines'}
          </h4>

          <div className="space-y-2.5 text-xs text-slate-600">
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                ১
              </span>
              <p>
                {lang === 'bn'
                  ? 'আপনার রেফারেল কোডটি বন্ধুকে রেজিস্ট্রেশনের সময় প্রবেশ করাতে বলুন।'
                  : 'Ask your peer to enter your referral code during account creation.'}
              </p>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                ২
              </span>
              <p>
                {lang === 'bn'
                  ? 'তিনি সাবস্ক্রিপশন ফি জমা দিলে অ্যাডমিন প্যানেল ভেরিফাই করে অনুমোদন করবে।'
                  : 'Upon payment submission and admin approval, rewards are activated.'}
              </p>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                ৩
              </span>
              <p>
                {lang === 'bn'
                  ? 'অনুমোদন হওয়ামাত্র আপনার অ্যাকাউন্টে সরাসরি ১০০ টাকা জমা হবে এবং বিকাশ/নগদে তুলতে পারবেন।'
                  : '৳100 is automatically credited to your wallet, ready for mobile banking withdrawal.'}
              </p>
            </div>
          </div>
        </div>

        {/* Withdrawals List */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold text-[#0A2540] uppercase tracking-wider">
              {lang === 'bn' ? 'উত্তোলনের হিস্ট্রি' : 'Withdrawal Transactions'}
            </h4>
            <span className="text-[10px] text-slate-400 font-bold">
              {withdrawHistory.length} {lang === 'bn' ? 'টি রিকোয়েস্ট' : 'Records'}
            </span>
          </div>

          {withdrawHistory.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">
              {lang === 'bn' ? 'এখনও কোনো উত্তোলন রিকোয়েস্ট জমা দেওয়া হয়নি।' : 'No withdrawal records submitted yet.'}
            </div>
          ) : (
            <div className="space-y-2">
              {withdrawHistory.map((w) => (
                <div key={w.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">
                      ৳{w.amount} ({w.method})
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        w.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : w.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {w.status === 'approved'
                        ? (lang === 'bn' ? 'অনুমোদিত ও পেইড' : 'Paid')
                        : w.status === 'rejected'
                        ? (lang === 'bn' ? 'বাতিল' : 'Rejected')
                        : (lang === 'bn' ? 'অ্যাডমিন যাচাইাধীন' : 'Pending Review')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-mono">{w.accountNumber}</span>
                    <span>{w.requestDate}</span>
                  </div>

                  {w.adminFeedback && (
                    <div className="p-2 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-800 font-medium">
                      ⚠️ <span className="font-bold">{lang === 'bn' ? 'অ্যাডমিন কারণ:' : 'Admin Reason:'}</span> {w.adminFeedback}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
