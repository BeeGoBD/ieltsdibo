import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Check, Copy, CheckCheck, ShieldCheck, AlertCircle, HelpCircle, Phone, CreditCard, ChevronRight, Clock, AlertTriangle } from 'lucide-react';
import { SubscriptionPlan } from '../types';
import { sound } from '../utils/soundEffects';

interface PaymentScreenProps {
  selectedPlan: SubscriptionPlan;
  onPaymentSubmit: (paymentData: {
    method: 'bKash' | 'Nagad' | 'Rocket';
    transactionId: string;
    senderNumber: string;
  }) => void;
  onBack: () => void;
}

type MethodType = 'bKash' | 'Nagad' | 'Rocket';

interface MethodConfig {
  id: MethodType;
  name: string;
  banglaName: string;
  number: string;
  type: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  logoBg: string;
  dialCode: string;
  steps: string[];
}

const PAYMENT_METHODS: Record<MethodType, MethodConfig> = {
  bKash: {
    id: 'bKash',
    name: 'bKash',
    banglaName: 'বিকাশ',
    number: '01798-245890',
    type: 'Personal (Send Money)',
    color: '#D12053',
    bgColor: 'bg-[#FFF0F4]',
    borderColor: 'border-[#D12053]',
    textColor: 'text-[#D12053]',
    logoBg: 'bg-[#D12053]',
    dialCode: '*247#',
    steps: [
      'আপনার বিকাশ অ্যাপে যান অথবা *247# ডায়াল করুন',
      '"Send Money" অপশন সিলেক্ট করুন',
      'প্রাপক নম্বরে উপরের কপি করা নম্বরটি বসান',
      'টাকার পরিমাণ দিন (সঠিক প্ল্যান অনুযায়ী)',
      'রেফারেন্সে আপনার নাম বা রোল দিন এবং পিন দিয়ে সম্পন্ন করুন',
      'মেসেজ থেকে Transaction ID (TrxID) কপি করে নিচে বসান',
    ],
  },
  Nagad: {
    id: 'Nagad',
    name: 'Nagad',
    banglaName: 'নগদ',
    number: '01834-567812',
    type: 'Personal (Send Money)',
    color: '#F7941D',
    bgColor: 'bg-[#FFF7ED]',
    borderColor: 'border-[#EA580C]',
    textColor: 'text-[#EA580C]',
    logoBg: 'bg-gradient-to-r from-[#F7941D] to-[#ED1C24]',
    dialCode: '*167#',
    steps: [
      'আপনার নগদ অ্যাপে যান অথবা *167# ডায়াল করুন',
      '"Send Money" অপশনটি বেছে নিন',
      'উপরে দেখানো মোবাইল নম্বরটি দিন',
      'সঠিক টাকার পরিমাণ উল্লেখ করুন',
      'পিন নম্বর দিয়ে লেনদেন সফল করুন',
      'মেসেজে প্রাপ্ত ৮ ডিজিটের TrxID নিচে লিখুন',
    ],
  },
  Rocket: {
    id: 'Rocket',
    name: 'Rocket',
    banglaName: 'রকেট',
    number: '01912-345678',
    type: 'Personal (Send Money)',
    color: '#8C3494',
    bgColor: 'bg-[#FAF5FF]',
    borderColor: 'border-[#9333EA]',
    textColor: 'text-[#9333EA]',
    logoBg: 'bg-[#8C3494]',
    dialCode: '*322#',
    steps: [
      'আপনার ডাচ-বাংলা রকেট অ্যাপ ওপেন করুন',
      '"Send Money" অপশন নির্বাচন করুন',
      'আমাদের রকেট নম্বরটি ইনপুট দিন',
      'প্ল্যানের নির্দিষ্ট পরিমাণ টাকা এন্টার করুন',
      'রকেট সিকিউরিটি পিন দিয়ে কনফার্ম করুন',
      'প্রাপ্ত Transaction ID নিচে ইনপুট দিয়ে সাবমিট করুন',
    ],
  },
};

export const PaymentScreen: React.FC<PaymentScreenProps> = ({
  selectedPlan,
  onPaymentSubmit,
  onBack,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<MethodType>('bKash');
  const [copied, setCopied] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [senderNumber, setSenderNumber] = useState('');
  const [error, setError] = useState('');
  const [showTutorial, setShowTutorial] = useState(true);

  const activeConfig = PAYMENT_METHODS[selectedMethod];

  const handleCopyNumber = () => {
    const rawNumber = activeConfig.number.replace('-', '');
    navigator.clipboard.writeText(rawNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim() || transactionId.trim().length < 4) {
      sound.playError();
      setError('অনুগ্রহ করে সঠিক Transaction ID লিখুন');
      return;
    }
    if (!senderNumber.trim() || senderNumber.trim().length < 10) {
      sound.playError();
      setError('যে নম্বর থেকে টাকা পাঠিয়েছেন তা লিখুন');
      return;
    }

    sound.playSuccess();
    setError('');
    onPaymentSubmit({
      method: selectedMethod,
      transactionId: transactionId.trim().toUpperCase(),
      senderNumber: senderNumber.trim(),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-sky-50/40 flex flex-col justify-between text-slate-900 px-3 sm:px-4 py-4 sm:py-6 selection:bg-rose-500 selection:text-white">
      {/* Header */}
      <header className="max-w-md mx-auto w-full flex items-center justify-between pt-1 pb-2">
        <button
          onClick={() => {
            sound.playClick();
            onBack();
          }}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          title="ফিরে যান"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <span className="text-xs font-bold text-[#0A2540] uppercase">পেমেন্ট গেটওয়ে</span>
        </div>

        <div className="w-8"></div>
      </header>

      {/* Main Container */}
      <main className="max-w-md mx-auto w-full flex-1 flex flex-col justify-start pb-6">
        {/* Unverified Account Alert & Permissions Warning */}
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3 mb-3 text-xs shadow-xs">
          <div className="flex items-start gap-2 text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-extrabold text-[11px] sm:text-xs text-amber-950 block">
                ⚠️ অ্যাকাউন্ট স্ট্যাটাস: আন-ভেরিফাইড (Unverified Notice)
              </span>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                আপনার অ্যাকাউন্টটি বর্তমানে আন-ভেরিফাইড অবস্থায় রয়েছে। শুধুমাত্র ভেরিফাইড সাবস্ক্রাইবারদের প্ল্যাটফর্মের সকল মক টেস্ট, স্পিকিং AI এবং সার্টিফিকেট ব্যবহারের পারমিশন দেওয়া হবে।
              </p>
            </div>
          </div>
        </div>

        {/* Top Summary Banner */}
        <div className="bg-[#0A2540] text-white p-3.5 sm:p-4 rounded-3xl mb-3 shadow-md flex items-center justify-between">
          <div>
            <span className="text-[11px] text-sky-200">নির্বাচিত প্ল্যান</span>
            <h3 className="text-base font-bold text-white">{selectedPlan.durationText}</h3>
            <p className="text-xs text-amber-300 font-semibold">{selectedPlan.testsCountText}</p>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-sky-200">পরিশোধযোগ্য</span>
            <div className="text-2xl font-black font-['Plus_Jakarta_Sans',sans-serif] text-amber-300">
              ৳{selectedPlan.price}
            </div>
          </div>
        </div>

        {/* Payment Processing Timeline Notice */}
        <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3 mb-3 text-xs flex items-start gap-2 text-sky-950">
          <Clock className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-[11px] sm:text-xs text-sky-900 block">
              ⏳ পেমেন্ট প্রসেসিং নোটিশ (10-30 Min Verification)
            </span>
            <p className="text-[11px] text-sky-800 leading-relaxed mt-0.5">
              টাকা সেন্ড মানি করে TrxID সাবমিট করার পর আমাদের একাউন্টস টিম ১০-৩০ মিনিটের মধ্যে স্বয়ংক্রিয়ভাবে পেমেন্ট যাচাই করে আপনার অ্যাকাউন্টে পেইড মেম্বারশিপ ও পরীক্ষার অনুমতি সক্রিয় করে দেবে।
            </p>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-3">
          <h2 className="text-lg sm:text-xl font-extrabold text-[#0A2540] tracking-tight">
            আপনার পেমেন্ট পদ্ধতি নির্বাচন করুন
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            নিচের যেকোনো একটি মোবাইল ব্যাংকিং মাধ্যম বেছে নিন
          </p>
        </div>

        {/* Three Clean Options with Logos */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
          {(Object.keys(PAYMENT_METHODS) as MethodType[]).map((key) => {
            const method = PAYMENT_METHODS[key];
            const isSelected = selectedMethod === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setSelectedMethod(key);
                  setCopied(false);
                }}
                className={`py-3 px-2 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer border-2 ${
                  isSelected
                    ? `${method.borderColor} ${method.bgColor} shadow-md ring-1 ${method.borderColor} scale-102`
                    : 'bg-white border-slate-200 hover:bg-slate-50 shadow-sm'
                }`}
              >
                {/* Simulated Authentic SVG Brand Badges */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold text-xs shadow-sm mb-1.5 ${method.logoBg}`}
                >
                  {key === 'bKash' && <span>bK</span>}
                  {key === 'Nagad' && <span>নগদ</span>}
                  {key === 'Rocket' && <span>🚀</span>}
                </div>
                <span className={`text-xs font-bold ${isSelected ? method.textColor : 'text-slate-700'}`}>
                  {method.banglaName}
                </span>
                <span className="text-[10px] text-slate-400">{method.name}</span>
              </button>
            );
          })}
        </div>

        {/* Payment Details Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
          {/* Payment Number Card with 1-click Copy */}
          <div className={`p-4 rounded-2xl border ${activeConfig.bgColor} ${activeConfig.borderColor}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-700">
                {activeConfig.banglaName} ({activeConfig.type})
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white/80 px-2 py-0.5 rounded-full">
                {activeConfig.dialCode}
              </span>
            </div>

            <div className="flex items-center justify-between mt-2">
              <div className="font-mono text-xl sm:text-2xl font-black tracking-wider text-slate-900">
                {activeConfig.number}
              </div>

              {/* One-click “কপি” button */}
              <button
                type="button"
                onClick={handleCopyNumber}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#0A2540] hover:bg-[#133E68] text-white shadow-sm'
                }`}
              >
                {copied ? (
                  <>
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>কপি হয়েছে</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>কপি</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Small Helpful Tutorial Box explaining how to send money */}
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80">
            <button
              type="button"
              onClick={() => setShowTutorial(!showTutorial)}
              className="w-full flex items-center justify-between text-left font-bold text-xs text-[#0A2540] cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-sky-600" />
                <span>{activeConfig.banglaName} দিয়ে টাকা পাঠানোর নিয়মাবলী</span>
              </div>
              <ChevronRight
                className={`w-4 h-4 text-slate-400 transition-transform ${
                  showTutorial ? 'rotate-90' : ''
                }`}
              />
            </button>

            {showTutorial && (
              <ol className="mt-2.5 space-y-1.5 text-[11px] text-slate-600 list-decimal list-inside">
                {activeConfig.steps.map((step, i) => (
                  <li key={i} className="leading-tight">
                    {step}
                  </li>
                ))}
              </ol>
            )}
          </div>

          {/* Payment Submission Form */}
          <form onSubmit={handleSubmit} className="space-y-3 pt-1">
            {/* Transaction ID input field */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Transaction ID (TrxID)
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                placeholder="যেমন: 9J4K2L8M"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm uppercase font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
              />
            </div>

            {/* Sender phone number for verification */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                যে নম্বর থেকে টাকা পাঠিয়েছেন (Sender Number)
              </label>
              <input
                type="tel"
                value={senderNumber}
                onChange={(e) => setSenderNumber(e.target.value)}
                placeholder="যেমন: 017XXXXXXXX"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
              />
            </div>

            {error && (
              <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-[#FF5A36] hover:bg-[#EA580C] text-white font-bold text-sm shadow-md shadow-orange-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer border-b-4 border-[#C2410C] mt-2 active:scale-98"
            >
              <span>পেমেন্ট নিশ্চিত করুন ও ড্যাশবোর্ডে যান</span>
              <Check className="w-4 h-4 stroke-[3]" />
            </button>
          </form>
        </div>

        {/* Security Assurance */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 mt-4 mb-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>নিরাপদ ও এনক্রিপ্টেড পেমেন্ট ভেরিফিকেশন</span>
        </div>
      </main>

      {/* Back button */}
      <footer className="max-w-md mx-auto w-full pt-2 flex justify-start">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>প্ল্যান পরিবর্তন করুন</span>
        </button>
      </footer>
    </div>
  );
};
