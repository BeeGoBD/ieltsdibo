import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock,
  Sparkles,
  Check,
  Star,
  Zap,
  ArrowRight,
  ShieldCheck,
  Award,
  X,
  Lock,
} from 'lucide-react';
import { PLANS } from './PricingScreen';
import { AppLanguage } from '../types';
import { sound } from '../utils/soundEffects';

interface TrialSubscriptionModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onSelectPlanAndProceed: (planId: string) => void;
  lang?: AppLanguage;
  sectionName?: 'reading' | 'listening' | 'writing' | 'speaking' | 'full_mock' | 'dashboard' | string;
  allowDismiss?: boolean;
}

export const TrialSubscriptionModal: React.FC<TrialSubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSelectPlanAndProceed,
  lang = 'bn',
  sectionName = 'general',
  allowDismiss = true,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('plan_7days');
  const isBn = lang === 'bn';

  if (!isOpen) return null;

  const getSectionTitleAndDesc = () => {
    switch (sectionName) {
      case 'speaking':
        return {
          title: isBn ? 'আপনার ১ মিনিটের স্পিকিং ট্রায়াল সমাপ্ত!' : 'Your 1-Minute Speaking Trial Has Ended!',
          desc: isBn
            ? 'ড. আলিস্টেয়ার ফিঞ্চের সাথে স্পিকিং সেশনের ট্রায়াল শেষ হয়েছে। সম্পূর্ণ ৩-পার্ট ইন্টারভিউ ও অফিসিয়াল এআই ব্যান্ড স্কোর পেতে এখনই সাবস্ক্রিপশন প্ল্যান গ্রহণ করুন।'
            : 'The 1-minute voice trial with Dr. Alistair Finch has ended. Subscribe now for the complete 3-part Cambridge interview and instant AI band scoring.',
          durationBadge: isBn ? '১ মিনিট স্পিকিং ট্রায়াল লিমিট' : '1-Min Speaking Limit',
        };
      case 'reading':
        return {
          title: isBn ? 'আপনার ২ মিনিটের রিডিং ট্রায়াল সমাপ্ত!' : 'Your 2-Minute Reading Trial Has Ended!',
          desc: isBn
            ? 'রিডিং মডিউলের ট্রায়াল সময় শেষ হয়েছে। পুরো অ্যাকাডেমিক প্যাসেজ সমাধান করতে ও আনলিমিটেড ক্যামব্রিজ টেস্ট দিতে সাবস্ক্রিপশন বেছে নিন।'
            : 'The 2-minute reading trial has ended. Subscribe to complete the full passage and access unlimited Cambridge reading sets.',
          durationBadge: isBn ? '২ মিনিট রিডিং ট্রায়াল লিমিট' : '2-Min Reading Limit',
        };
      case 'writing':
        return {
          title: isBn ? 'আপনার ২ মিনিটের রাইটিং ট্রায়াল সমাপ্ত!' : 'Your 2-Minute Writing Trial Has Ended!',
          desc: isBn
            ? 'রাইটিং মডিউলের ট্রায়াল সময় শেষ হয়েছে। টাস্ক ১ ও ২ সম্পূর্ণ লিখে এআই ব্যান্ড স্কোর ও ফিডব্যাক পেতে সাবস্ক্রিপশন গ্রহণ করুন।'
            : 'The 2-minute writing trial has ended. Subscribe to submit full Task 1 & 2 essays and get instant examiner grading.',
          durationBadge: isBn ? '২ মিনিট রাইটিং ট্রায়াল লিমিট' : '2-Min Writing Limit',
        };
      case 'listening':
        return {
          title: isBn ? 'আপনার ২ মিনিটের লিসেনিং ট্রায়াল সমাপ্ত!' : 'Your 2-Minute Listening Trial Has Ended!',
          desc: isBn
            ? 'লিসেনিং মডিউলের ট্রায়াল সময় শেষ হয়েছে। পুরো ৪টি সেকশনের ব্রিটিশ অডিও শুনে পরীক্ষা সম্পন্ন করতে এখনই সাবস্ক্রাইব করুন।'
            : 'The 2-minute listening trial has ended. Subscribe to hear all 4 audio sections and full audio recordings.',
          durationBadge: isBn ? '২ মিনিট লিসেনিং ট্রায়াল লিমিট' : '2-Min Listening Limit',
        };
      default:
        return {
          title: isBn ? 'আপনার ফ্রি ট্রায়াল লিমিট শেষ হয়েছে!' : 'Your Free Trial Limit Has Ended!',
          desc: isBn
            ? 'আপনি প্ল্যাটফর্মের ফ্রি ট্রায়াল উপভোগ করেছেন। আনলিমিটেড মক টেস্ট, এআই স্পিকিং ও সাইন করা TRF সার্টিফিকেট পেতে সাবস্ক্রিপশন বেছে নিন।'
            : 'You have completed your free trial exploration. Choose a plan to unlock unlimited Cambridge mock exams and certified TRF downloads.',
          durationBadge: isBn ? 'ফ্রি ট্রায়াল লিমিট শেষ' : 'Free Trial Over',
        };
    }
  };

  const info = getSectionTitleAndDesc();

  const handlePlanClick = (id: string) => {
    sound.playSelect();
    setSelectedPlanId(id);
  };

  const handleProceed = () => {
    sound.playSuccess();
    onSelectPlanAndProceed(selectedPlanId);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-amber-400 my-auto text-slate-800 flex flex-col max-h-[92vh]"
        >
          {/* Top Banner Header */}
          <div className="bg-gradient-to-r from-[#0A2540] via-sky-950 to-[#0A2540] text-white p-5 relative overflow-hidden shrink-0">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-start justify-between gap-3 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center justify-center shrink-0 shadow-inner">
                  <Clock className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-black tracking-wider uppercase mb-1">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>{info.durationBadge}</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
                    {info.title}
                  </h2>
                </div>
              </div>

              {allowDismiss && onClose && (
                <button
                  onClick={() => {
                    sound.playClick();
                    onClose();
                  }}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <p className="text-xs text-sky-100/90 mt-2.5 leading-relaxed relative z-10">
              {info.desc}
            </p>
          </div>

          {/* Body: Plans Selection */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#0A2540] uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                {isBn ? 'আপনার সাবস্ক্রিপশন প্ল্যান বেছে নিন:' : 'Select Subscription Plan:'}
              </span>
              <span className="text-[11px] text-slate-500 font-bold">
                {isBn ? 'বিকাশ • নগদ • রকেট' : 'bKash • Nagad • Rocket'}
              </span>
            </div>

            {/* List of 4 Subscription Plans */}
            <div className="space-y-2.5">
              {PLANS.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                const is30Day = plan.id === 'plan_30days';
                const is1Day = plan.id === 'plan_1day';
                const is7Day = plan.id === 'plan_7days';

                return (
                  <div
                    key={plan.id}
                    onClick={() => handlePlanClick(plan.id)}
                    className={`relative p-3.5 rounded-2xl border-2 transition-all cursor-pointer select-none flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-amber-50/80 border-amber-500 shadow-md ring-2 ring-amber-300/60'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    {/* Left: Radio and Title */}
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          isSelected
                            ? 'border-amber-500 bg-amber-500 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-sm text-[#0A2540]">
                            {plan.durationText}
                          </span>
                          {is7Day && (
                            <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-black px-2 py-0.2 rounded-full">
                              {isBn ? 'জনপ্রিয় চয়েস' : 'Most Popular'}
                            </span>
                          )}
                          {is1Day && (
                            <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black px-2 py-0.2 rounded-full">
                              {isBn ? '১ দিনের ট্রায়াল' : 'Entry Pack'}
                            </span>
                          )}
                          {is30Day && (
                            <span className="bg-purple-100 text-purple-800 border border-purple-300 text-[10px] font-black px-2 py-0.2 rounded-full">
                              {isBn ? 'সেরা ভ্যালু (৩০০ টেস্ট)' : 'Best Value'}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                          {plan.testsCountText}
                        </p>
                      </div>
                    </div>

                    {/* Right: Price */}
                    <div className="text-right shrink-0">
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-xl sm:text-2xl font-black text-[#0A2540] font-mono">
                          ৳{plan.price}
                        </span>
                        <span className="text-[11px] font-bold text-slate-500">
                          {isBn ? 'টাকা' : 'BDT'}
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-600 font-bold block">
                        {isBn ? 'তাৎক্ষণিক অ্যাক্টিভেশন' : 'Instant Activation'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Trust highlights */}
            <div className="p-3 bg-sky-50 rounded-2xl border border-sky-100 flex items-center justify-between text-[11px] text-sky-900 font-semibold">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{isBn ? 'নিরাপদ পেমেন্ট ভেরিফিকেশন' : 'Secure Verification'}</span>
              </div>
              <span className="text-slate-300">|</span>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                <span>{isBn ? 'ক্যামব্রিজ সার্টিফাইড TRF' : 'Official TRF'}</span>
              </div>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
            {allowDismiss && onClose ? (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="px-4 py-3 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                {isBn ? 'ড্যাশবোর্ডে ফিরুন' : 'Back to Dashboard'}
              </button>
            ) : (
              <div className="text-[11px] text-slate-400 font-medium">
                {isBn ? 'সাবস্ক্রিপশন প্রয়োজন' : 'Subscription Required'}
              </div>
            )}

            <button
              type="button"
              onClick={handleProceed}
              className="flex-1 sm:flex-initial px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF5A36] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white font-black text-xs sm:text-sm shadow-lg shadow-orange-600/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border-b-4 border-[#C2410C]"
            >
              <span>{isBn ? 'পরবর্তী ধাপ (পেমেন্ট করুন)' : 'Proceed to Payment'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
