import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, User, Mail, Phone, Lock, Gift, Sparkles, AlertCircle } from 'lucide-react';
import { CartoonGuide } from './CartoonGuide';
import { UserProfile, AppLanguage } from '../types';

interface SignupScreenProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    referralCode?: string;
  };
  existingUsers?: UserProfile[];
  lang?: AppLanguage;
  onUpdateFormData: (data: Partial<SignupScreenProps['formData']>) => void;
  onBack: () => void;
  onNext: () => void;
  onGoToLogin?: () => void;
  isTrial?: boolean;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({
  formData,
  existingUsers = [],
  lang = 'bn',
  onUpdateFormData,
  onBack,
  onNext,
  onGoToLogin,
  isTrial = false,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showReferralInput, setShowReferralInput] = useState(Boolean(formData.referralCode));

  const validateAndProceed = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // 1. Name
    if (!formData.name.trim()) {
      newErrors.name = lang === 'bn' ? 'আপনার পুরো নাম লিখুন' : 'Enter your full name';
    }

    // 2. Email (Must be Gmail per user requirement!)
    const cleanEmail = formData.email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.endsWith('@gmail.com')) {
      newErrors.email =
        lang === 'bn'
          ? 'শুধুমাত্র জিমেইল (@gmail.com) গ্রহণযোগ্য (যেমন: yourname@gmail.com)'
          : 'Only valid Gmail addresses (@gmail.com) are accepted';
    }

    // 3. Phone (Must be 11-digit Bangladeshi mobile number)
    const cleanPhone = formData.phone.trim();
    if (!cleanPhone || !/^01[3-9]\d{8}$/.test(cleanPhone)) {
      newErrors.phone =
        lang === 'bn'
          ? 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)'
          : 'Enter a valid 11-digit mobile number (e.g. 017XXXXXXXX)';
    }

    // 4. Password (At least 6 chars, contains capital letter and a number)
    const pass = formData.password;
    if (!pass || pass.length < 6) {
      newErrors.password =
        lang === 'bn'
          ? 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে'
          : 'Password must be at least 6 characters';
    } else if (!/[A-Z]/.test(pass)) {
      newErrors.password =
        lang === 'bn'
          ? 'পাসওয়ার্ডে কমপক্ষে ১টি বড় হাতের অক্ষর (A-Z) থাকতে হবে'
          : 'Password must include at least one uppercase letter (A-Z)';
    } else if (!/[0-9]/.test(pass)) {
      newErrors.password =
        lang === 'bn'
          ? 'পাসওয়ার্ডে কমপক্ষে ১টি সংখ্যা (0-9) থাকতে হবে'
          : 'Password must include at least one number (0-9)';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword =
        lang === 'bn' ? 'পাসওয়ার্ড দুটি মিলছে না' : 'Passwords do not match';
    }

    // 5. Unique User Check (A user cannot be registered twice with same phone or email)
    const isEmailTaken = existingUsers.some(
      (u) => u.email.toLowerCase() === cleanEmail
    );
    const isPhoneTaken = existingUsers.some(
      (u) => u.phone === cleanPhone
    );

    if (isEmailTaken) {
      newErrors.email =
        lang === 'bn'
          ? 'এই জিমেইল দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট খোলা হয়েছে। অনুগ্রহ করে লগইন করুন।'
          : 'An account already exists with this Gmail. Please log in.';
    }
    if (isPhoneTaken) {
      newErrors.phone =
        lang === 'bn'
          ? 'এই ফোন নম্বর দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট খোলা হয়েছে। অনুগ্রহ করে লগইন করুন।'
          : 'An account already exists with this phone number. Please log in.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-sky-50/40 flex flex-col justify-between text-slate-900 px-4 py-6 selection:bg-rose-500 selection:text-white">
      {/* Header / Progress bar */}
      <header className="max-w-md md:max-w-xl mx-auto w-full flex items-center justify-between pt-2 pb-3">
        <button
          onClick={onBack}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          title={lang === 'bn' ? 'ফিরে যান' : 'Back'}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Step Indicator */}
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-8 rounded-full bg-[#0A2540]"></div>
          <div className="h-1.5 w-8 rounded-full bg-[#0A2540]"></div>
          <div className="h-1.5 w-8 rounded-full bg-[#0A2540]"></div>
          <div className="h-1.5 w-3 rounded-full bg-slate-200"></div>
        </div>

        <div className="text-xs font-semibold text-slate-400">
          {lang === 'bn' ? 'ধাপ ৩ / ৪' : 'Step 3 / 4'}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-md md:max-w-xl mx-auto w-full flex-1 flex flex-col justify-start">
        {/* Warm Mascot message */}
        <div className="flex flex-col items-center text-center my-2">
          <CartoonGuide
            pose="happy-celebrate"
            message={
              lang === 'bn'
                ? 'অভিনন্দন! আপনার প্রোফাইল তৈরি হয়ে গেছে প্রায়!'
                : 'Congratulations! Your profile is almost set up!'
            }
            size="md"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mt-2"
          >
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-3 py-0.5 rounded-full mb-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              {lang === 'bn' ? 'অফিসিয়াল রেজিস্ট্রেশন' : 'Official Registration'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A2540] tracking-tight">
              {lang === 'bn' ? 'অ্যাকাউন্ট তৈরি করুন' : 'Create Your Account'}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5 max-w-xs mx-auto font-medium">
              {lang === 'bn'
                ? 'সঠিক তথ্য দিয়ে নিবন্ধন সম্পন্ন করুন'
                : 'Enter your accurate credentials to begin official mocks'}
            </p>
          </motion.div>
        </div>

        {/* Clean Form */}
        {isTrial && (
          <div className="mt-3 p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-400 flex items-center gap-3 shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
              🎁
            </div>
            <div>
              <p className="text-xs font-black text-[#0A2540]">
                {lang === 'bn'
                  ? '২ মিনিটের ফ্রি ট্রায়াল অ্যাকাউন্ট (কোনো পেমেন্ট লাগবে না)'
                  : '2-Minute Free Trial Account (No Payment Required)'}
              </p>
              <p className="text-[11px] text-slate-600">
                {lang === 'bn'
                  ? 'রেজিস্ট্রেশন শেষে সরাসরি ড্যাশবোর্ড ও সব প্রিমিয়াম ফিচার ২ মিনিট টেস্ট করতে পারবেন।'
                  : 'Get instant access to test all premium features for 2 minutes without paying.'}
              </p>
            </div>
          </div>
        )}

        <form
          onSubmit={validateAndProceed}
          autoComplete="off"
          className="space-y-3 mt-3 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm"
        >
          {/* নাম */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {lang === 'bn' ? 'আপনার পুরো নাম' : 'Full Name'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                autoComplete="off"
                value={formData.name}
                onChange={(e) => onUpdateFormData({ name: e.target.value })}
                placeholder={lang === 'bn' ? 'যেমন: জোবায়েরুল আলম' : 'e.g. Jobaerul Alam'}
                className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540] transition-all ${
                  errors.name ? 'border-rose-400 bg-rose-50/40' : 'border-slate-200'
                }`}
              />
            </div>
            {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
          </div>

          {/* জিমেইল */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {lang === 'bn' ? 'জিমেইল এড্রেস (শুধুমাত্র Gmail)' : 'Gmail Address (Gmail only)'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                autoComplete="off"
                value={formData.email}
                onChange={(e) => onUpdateFormData({ email: e.target.value })}
                placeholder="candidate@gmail.com"
                className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540] transition-all ${
                  errors.email ? 'border-rose-400 bg-rose-50/40' : 'border-slate-200'
                }`}
              />
            </div>
            {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
          </div>

          {/* মোবাইল নম্বর (১১ ডিজিট) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {lang === 'bn' ? '১১ ডিজিট মোবাইল নম্বর' : '11-Digit Mobile Number'}
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="tel"
                autoComplete="off"
                maxLength={11}
                value={formData.phone}
                onChange={(e) => onUpdateFormData({ phone: e.target.value.replace(/\D/g, '') })}
                placeholder="01712345678"
                className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540] transition-all font-mono ${
                  errors.phone ? 'border-rose-400 bg-rose-50/40' : 'border-slate-200'
                }`}
              />
            </div>
            {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
          </div>

          {/* পাসওয়ার্ড */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {lang === 'bn'
                ? 'পাসওয়ার্ড (কমপক্ষে ৬ ডিজিট, ১টি বড় অক্ষর ও ১টি সংখ্যা)'
                : 'Password (Min 6 chars, 1 uppercase & 1 number)'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={(e) => onUpdateFormData({ password: e.target.value })}
                placeholder="Ex: Dhaka2026"
                className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540] transition-all ${
                  errors.password ? 'border-rose-400 bg-rose-50/40' : 'border-slate-200'
                }`}
              />
            </div>
            {errors.password && <p className="text-[11px] text-rose-500 mt-1">{errors.password}</p>}
          </div>

          {/* কনফার্ম পাসওয়ার্ড */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {lang === 'bn' ? 'পুনরায় পাসওয়ার্ড দিন' : 'Confirm Password'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => onUpdateFormData({ confirmPassword: e.target.value })}
                placeholder="Ex: Dhaka2026"
                className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540] transition-all ${
                  errors.confirmPassword ? 'border-rose-400 bg-rose-50/40' : 'border-slate-200'
                }`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Optional Referral Code Section */}
          <div className="pt-1">
            {!showReferralInput ? (
              <button
                type="button"
                onClick={() => setShowReferralInput(true)}
                className="text-xs text-sky-700 hover:text-sky-900 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Gift className="w-3.5 h-3.5 text-amber-500" />
                <span>{lang === 'bn' ? 'রেফারেল কোড আছে? এখানে দিন' : 'Have a referral code? Enter here'}</span>
              </button>
            ) : (
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl">
                <label className="block text-xs font-bold text-amber-900 mb-1 flex items-center gap-1">
                  <Gift className="w-3.5 h-3.5 text-amber-600" />
                  {lang === 'bn' ? 'রেফারেল কোড (ঐচ্ছিক)' : 'Referral Code (Optional)'}
                </label>
                <input
                  type="text"
                  value={formData.referralCode || ''}
                  onChange={(e) => onUpdateFormData({ referralCode: e.target.value.toUpperCase() })}
                  placeholder="IELTS7789"
                  className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs uppercase font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <p className="text-[10px] text-amber-800 mt-1">
                  {lang === 'bn'
                    ? '💡 বন্ধুর কোড দিয়ে জয়েন করলে বন্ধু স্বয়ংক্রিয়ভাবে ১০০ টাকা ক্যাশব্যাক পাবে!'
                    : '💡 Your referrer receives ৳100 upon subscription approval!'}
                </p>
              </div>
            )}
          </div>

          {/* Link to Login if already have an account */}
          {onGoToLogin && (
            <div className="pt-2 text-center border-t border-slate-100">
              <button
                type="button"
                onClick={onGoToLogin}
                className="text-xs text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
              >
                {lang === 'bn'
                  ? 'ইতোমধ্যে অ্যাকাউন্ট আছে? লগইন করুন'
                  : 'Already have an account? Sign in here'}
              </button>
            </div>
          )}
        </form>
      </main>

      {/* Back + Next */}
      <footer className="max-w-md md:max-w-xl mx-auto w-full pt-4 pb-2 border-t border-slate-200/80 flex items-center justify-between gap-4 z-30 bg-white/80 backdrop-blur-md px-2 rounded-2xl">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold text-xs sm:text-sm transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'bn' ? 'ব্যাক' : 'Back'}</span>
        </button>

        <button
          onClick={validateAndProceed}
          className="px-7 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer bg-[#FF5A36] hover:bg-[#EA580C] text-white shadow-orange-600/30 border-b-4 border-[#C2410C]"
        >
          <span>
            {isTrial
              ? (lang === 'bn' ? 'ফ্রি ট্রায়াল শুরু করুন (২ মিনিট)' : 'Start Free Trial (2 Min)')
              : (lang === 'bn' ? 'প্ল্যান নির্বাচন করুন' : 'Select Plan')}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
};
