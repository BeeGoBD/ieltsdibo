import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Lock, Mail, Phone, AlertCircle, ShieldCheck, KeyRound, CheckCircle2, X } from 'lucide-react';
import { UserProfile, AppLanguage } from '../types';

interface LoginScreenProps {
  lang?: AppLanguage;
  registeredUsers: UserProfile[];
  onUserLogin: (user: UserProfile) => void;
  onAdminLogin: () => void;
  onResetPassword?: (emailOrPhone: string, newPass: string) => boolean;
  onBack: () => void;
  onGoToSignup: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  lang = 'bn',
  registeredUsers,
  onUserLogin,
  onAdminLogin,
  onResetPassword,
  onBack,
  onGoToSignup,
}) => {
  const [identifier, setIdentifier] = useState('nahida09819@gmail.com');
  const [password, setPassword] = useState('Nahida123');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Password reset modal state
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('nahida09819@gmail.com');
  const [resetPass, setResetPass] = useState('Nahida123');
  const [resetStatus, setResetStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleFillNahidaUser = () => {
    setIdentifier('nahida09819@gmail.com');
    setPassword('Nahida123');
    setError('');
    setSuccessMsg(lang === 'bn' ? 'নাহিদার ক্রেডেনশিয়াল পূরণ করা হয়েছে।' : 'Nahida credentials auto-filled.');
  };

  const handleExecuteReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim() || !resetPass.trim()) return;

    if (onResetPassword) {
      const ok = onResetPassword(resetEmail.trim(), resetPass.trim());
      if (ok) {
        setResetStatus('success');
        setIdentifier(resetEmail.trim());
        setPassword(resetPass.trim());
        setTimeout(() => {
          setShowResetModal(false);
          setResetStatus('idle');
          setSuccessMsg(
            lang === 'bn'
              ? `পাসওয়ার্ড সফলভাবে '${resetPass.trim()}' হিসেবে আপডেট করা হয়েছে!`
              : `Password successfully updated to '${resetPass.trim()}'!`
          );
        }, 900);
      } else {
        setResetStatus('error');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanId || !cleanPass) {
      setError(
        lang === 'bn'
          ? 'অনুগ্রহ করে আপনার ইমেইল/ফোন নম্বর এবং পাসওয়ার্ড প্রদান করুন।'
          : 'Please enter your registered email/phone and password.'
      );
      return;
    }

    // Secret Admin Authentication (No hint on UI!)
    const isAdminId =
      cleanId === 'admin@ieltsdibo.com' ||
      cleanId === 'admin@ieltsdao.com' ||
      cleanId === '01700000000' ||
      cleanId === 'admin' ||
      cleanId === 'admin-ielts-2026';

    if (isAdminId && cleanPass === 'AdminMaster2026!') {
      onAdminLogin();
      return;
    }

    // Student Authentication from registered database
    const userById = registeredUsers.find(
      (u) =>
        u.email.trim().toLowerCase() === cleanId ||
        u.phone.trim() === cleanId ||
        u.phone.trim().replace(/\D/g, '') === cleanId.replace(/\D/g, '') ||
        u.rollNumber?.toLowerCase() === cleanId
    );

    if (!userById) {
      setError(
        lang === 'bn'
          ? 'এই জিমেইল বা ফোন নম্বরে কোনো অ্যাকাউন্ট পাওয়া যায়নি। অনুগ্রহ করে সঠিক তথ্য দিন অথবা নতুন অ্যাকাউন্ট তৈরি করুন।'
          : 'No registered account found with this Gmail or phone number. Please check your input or create an account.'
      );
      return;
    }

    if (userById.password && userById.password !== cleanPass) {
      setError(
        lang === 'bn'
          ? 'পাসওয়ার্ডটি ভুল হয়েছে। অনুগ্রহ করে আপনার অ্যাকাউন্ট তৈরির সঠিক পাসওয়ার্ড প্রদান করুন।'
          : 'Incorrect password! Please enter the exact password you created.'
      );
      return;
    }

    if (userById.isRestricted) {
      setError(
        lang === 'bn'
          ? 'আপনার অ্যাকাউন্টটি সিস্টেম অ্যাডমিন কর্তৃক সাময়িকভাবে স্থগিত (Restricted) করা হয়েছে।'
          : 'Your account has been temporarily restricted by system administration.'
      );
      return;
    }

    onUserLogin(userById);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-sky-50/40 flex flex-col justify-between text-slate-900 px-4 py-6 selection:bg-rose-500 selection:text-white">
      {/* Header */}
      <header className="max-w-md md:max-w-xl mx-auto w-full flex items-center justify-between pt-2 pb-3">
        <button
          onClick={onBack}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          title={lang === 'bn' ? 'ফিরে যান' : 'Back'}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-sm font-extrabold text-[#0A2540] tracking-tight">
          {lang === 'bn' ? 'IELTS DIBO (আইলস দিবো)' : 'IELTS DIBO'}
        </div>

        <div className="w-9"></div>
      </header>

      {/* Main Content */}
      <main className="max-w-md md:max-w-xl mx-auto w-full flex-1 flex flex-col justify-center">
        <div className="text-center mb-5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A2540] tracking-tight">
            {lang === 'bn' ? 'অ্যাকাউন্টে লগইন করুন' : 'Student Portal Login'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            {lang === 'bn'
              ? 'আপনার রেজিস্ট্রেশন করা ইমেইল বা ফোন নম্বর দিয়ে প্রবেশ করুন'
              : 'Enter your registered Gmail or 11-digit mobile number to access exams'}
          </p>
        </div>

        {/* Quick Student Credential Card */}
        <div className="mb-4 p-3.5 bg-gradient-to-r from-sky-50 via-indigo-50/40 to-emerald-50/40 border border-sky-200 rounded-2xl flex flex-col gap-2 text-xs text-sky-950">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-sky-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'bn' ? 'শিক্ষার্থী একাউন্ট ও সাবস্ক্রিপশন:' : 'Student ID & Verified Subscription:'}</span>
            </span>
            <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
              ৪৯৯ টাকা প্ল্যান • Approved
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[11px] bg-white/90 p-2.5 rounded-xl border border-sky-100 font-mono">
            <div>
              <span className="text-slate-400 block text-[9px] font-sans">শিক্ষার্থীর নাম ও আইডি</span>
              <span className="font-bold text-slate-800">Nahida (DIBO-2026-9819)</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px] font-sans">পাসওয়ার্ড</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">Nahida123</span>
            </div>
            <div className="col-span-2 pt-1 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[9px] font-sans">রেজিস্টার্ড জিমেইল</span>
                <span className="font-bold text-slate-800">nahida09819@gmail.com</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setResetEmail('nahida09819@gmail.com');
                  setResetPass('Nahida123');
                  setShowResetModal(true);
                }}
                className="text-[10px] text-amber-700 hover:text-amber-900 font-bold underline font-sans cursor-pointer flex items-center gap-1"
              >
                <KeyRound className="w-3 h-3" />
                <span>পাসওয়ার্ড রিসেট</span>
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={handleFillNahidaUser}
            className="w-full py-2 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs transition-colors cursor-pointer text-center shadow-xs flex items-center justify-center gap-1.5"
          >
            <span>{lang === 'bn' ? '১-ক্লিকে নাহিদার তথ্য পূরণ করুন (Auto-Fill Nahida)' : 'Auto-Fill Nahida Credentials'}</span>
          </button>
        </div>

        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800 font-medium"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-xs text-rose-800 font-medium"
          >
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          {/* Email or Phone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {lang === 'bn' ? 'ইমেইল এড্রেস বা মোবাইল নম্বর' : 'Email Address or Mobile Number'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={lang === 'bn' ? 'যেমন: 01712345678 বা nahida09819@gmail.com' : 'e.g., nahida09819@gmail.com'}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540] transition-all font-medium"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                {lang === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
              </label>
              <button
                type="button"
                onClick={() => {
                  setResetEmail(identifier || 'nahida09819@gmail.com');
                  setResetPass('Nahida123');
                  setShowResetModal(true);
                }}
                className="text-[11px] text-sky-700 hover:text-sky-900 font-semibold cursor-pointer"
              >
                {lang === 'bn' ? 'পাসওয়ার্ড ভুলে গেছেন? রিসেট করুন' : 'Forgot Password? Reset'}
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540] transition-all font-mono"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-6 rounded-2xl bg-[#FF5A36] hover:bg-[#EA580C] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border-b-4 border-[#C2410C]"
          >
            <span>{lang === 'bn' ? 'লগইন করুন' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Switch to Signup */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={onGoToSignup}
              className="text-xs text-sky-700 hover:text-sky-900 font-semibold cursor-pointer"
            >
              {lang === 'bn' ? 'নতুন শিক্ষার্থী? এখানে রেজিস্ট্রেশন করুন' : 'New student? Register here'}
            </button>
          </div>
        </form>

        {/* Reset Password Modal */}
        {showResetModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 text-slate-800"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      {lang === 'bn' ? 'শিক্ষার্থী পাসওয়ার্ড রিসেট' : 'Reset Student Password'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {lang === 'bn' ? 'ইমেইল দিয়ে নতুন পাসওয়ার্ড সেট করুন' : 'Set a new password for candidate'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowResetModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {resetStatus === 'success' && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>পাসওয়ার্ড সফলভাবে আপডেট হয়েছে!</span>
                </div>
              )}

              <form onSubmit={handleExecuteReset} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'bn' ? 'শিক্ষার্থীর জিমেইল এড্রেস' : 'Student Gmail Address'}
                  </label>
                  <input
                    type="text"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="nahida09819@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'bn' ? 'নতুন পাসওয়ার্ড (New Password)' : 'New Password'}
                  </label>
                  <input
                    type="text"
                    value={resetPass}
                    onChange={(e) => setResetPass(e.target.value)}
                    placeholder="Nahida123"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono font-bold text-slate-900"
                    required
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[11px] text-slate-500 font-medium">কুইক প্রিসেট:</span>
                    <button
                      type="button"
                      onClick={() => setResetPass('Nahida123')}
                      className="px-2 py-0.5 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-900 font-mono text-[11px] font-bold cursor-pointer"
                    >
                      Nahida123
                    </button>
                    <button
                      type="button"
                      onClick={() => setResetPass('Password123!')}
                      className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-[11px] font-medium cursor-pointer"
                    >
                      Password123!
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowResetModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold cursor-pointer shadow-sm flex items-center gap-1.5"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'পাসওয়ার্ড আপডেট করুন' : 'Update Password'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-md mx-auto px-5 py-3 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>{lang === 'bn' ? 'নিরাপদ ক্যামব্রিজ স্ট্যান্ডার্ড পোর্টাল' : 'Secure Cambridge Mock Portal'}</span>
      </footer>
    </div>
  );
};
