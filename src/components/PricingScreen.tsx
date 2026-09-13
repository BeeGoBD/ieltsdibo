import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, Sparkles, Star, Zap, Clock, ShieldCheck, Headphones } from 'lucide-react';
import { SubscriptionPlan } from '../types';

export const PLANS: SubscriptionPlan[] = [
  {
    id: 'plan_1day',
    durationText: '১ দিনের প্ল্যান',
    price: 9,
    testsCountText: '১টি মক টেস্ট',
    dailyQuota: 1,
    totalTests: 1,
    isPopular: false,
    features: ['সম্পূর্ণ ১টি পূর্ণাঙ্গ মক টেস্ট', 'তাৎক্ষণিক অটোপ্যাক ব্যান্ড স্কোর', '২৪ ঘণ্টা হেল্প সাপোর্ট + টিকেটিং সিস্টেম'],
  },
  {
    id: 'plan_3days',
    durationText: '৩ দিনের প্ল্যান',
    price: 49,
    testsCountText: 'প্রতিদিন ৩টি করে মোট ৯টি মক টেস্ট',
    dailyQuota: 3,
    totalTests: 9,
    isPopular: false,
    features: ['প্রতিদিন ৩টি মক টেস্ট (মোট ৯টি)', 'রিডিং, রাইটিং, লিসেনিং, স্পিকিং', '২৪ ঘণ্টা হেল্প সাপোর্ট + টিকেটিং সিস্টেম'],
  },
  {
    id: 'plan_7days',
    durationText: '৭ দিনের প্ল্যান',
    price: 149,
    testsCountText: 'প্রতিদিন ৫টি করে মোট ৩৫টি মক টেস্ট',
    dailyQuota: 5,
    totalTests: 35,
    isPopular: true,
    features: [
      'প্রতিদিন ৫টি করে মোট ৩৫টি মক টেস্ট',
      'সর্বাধিক বিক্রিত ও জনপ্রিয় প্যাকেজ',
      'অফিসিয়াল PDF টেস্ট রিপোর্ট ফর্ম',
      '২৪ ঘণ্টা হেল্প সাপোর্ট + টিকেটিং সিস্টেম',
    ],
  },
  {
    id: 'plan_30days',
    durationText: '৩০ দিনের প্ল্যান',
    price: 499,
    testsCountText: 'প্রতিদিন ১০টি করে মোট ৩০০টি মক টেস্ট',
    dailyQuota: 10,
    totalTests: 300,
    isPopular: false,
    features: [
      'প্রতিদিন ১০টি করে মোট ৩০০টি মক টেস্ট',
      'সর্বোচ্চ প্রস্তুতি ও আনলিমিটেড অ্যানালাইসিস',
      'রেফারেল ফ্রেন্ড বোনাস ১০০ টাকা ক্যাশব্যাক',
      '২৪ ঘণ্টা হেল্প সাপোর্ট + টিকেটিং সিস্টেম',
    ],
  },
];

interface PricingScreenProps {
  selectedPlanId: string;
  onSelectPlan: (planId: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export const PricingScreen: React.FC<PricingScreenProps> = ({
  selectedPlanId,
  onSelectPlan,
  onBack,
  onNext,
}) => {
  const selectedPlan = PLANS.find((p) => p.id === selectedPlanId) || PLANS[2];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-sky-50/40 flex flex-col justify-between text-slate-900 px-4 py-6 selection:bg-rose-500 selection:text-white">
      {/* Header */}
      <header className="max-w-md mx-auto w-full flex items-center justify-between pt-2 pb-3">
        <button
          onClick={onBack}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          title="ফিরে যান"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Step Indicator */}
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-8 rounded-full bg-[#0A2540]"></div>
          <div className="h-1.5 w-8 rounded-full bg-[#0A2540]"></div>
          <div className="h-1.5 w-8 rounded-full bg-[#0A2540]"></div>
          <div className="h-1.5 w-8 rounded-full bg-[#0A2540]"></div>
        </div>

        <div className="text-xs font-semibold text-slate-400">ধাপ ৪ / ৪</div>
      </header>

      {/* Main Content: Beautiful vertical card layout with four clear offers */}
      <main className="max-w-md mx-auto w-full flex-1 flex flex-col justify-start">
        <div className="text-center my-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100/80 px-3 py-0.5 rounded-full mb-1">
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            সেরা সাবস্ক্রিপশন অফার
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A2540] tracking-tight">
            আপনার পছন্দের প্ল্যান বাছুন
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            সকল প্ল্যানে অন্তর্ভূক্ত: ২৪ ঘণ্টা হেল্প সাপোর্ট + টিকেটিং সিস্টেম
          </p>
        </div>

        {/* Plans List */}
        <div className="space-y-3 mt-3">
          {PLANS.map((plan) => {
            const isSelected = selectedPlanId === plan.id;

            return (
              <motion.div
                key={plan.id}
                whileTap={{ scale: 0.99 }}
                onClick={() => onSelectPlan(plan.id)}
                className={`relative rounded-3xl p-4 sm:p-5 transition-all cursor-pointer border-2 ${
                  plan.isPopular
                    ? isSelected
                      ? 'bg-gradient-to-br from-[#0A2540] to-[#133E68] text-white border-[#FF5A36] shadow-xl ring-2 ring-[#FF5A36]'
                      : 'bg-white text-slate-900 border-[#0A2540] shadow-md'
                    : isSelected
                    ? 'bg-[#0A2540] text-white border-[#0A2540] shadow-lg ring-2 ring-[#FF5A36]'
                    : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                {/* Popular Badge */}
                {plan.isPopular && (
                  <div className="absolute -top-3 right-5 bg-gradient-to-r from-[#FF5A36] to-amber-500 text-white px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                    <Star className="w-3 h-3 fill-white" />
                    <span>Most Popular • সর্বাধিক জনপ্রিয়</span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3
                        className={`text-base sm:text-lg font-bold ${
                          isSelected ? 'text-white' : 'text-[#0A2540]'
                        }`}
                      >
                        {plan.durationText}
                      </h3>
                      {plan.id === 'plan_1day' && (
                        <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-md font-bold">
                          ট্রায়াল
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-xs font-semibold mt-0.5 ${
                        isSelected ? 'text-sky-200' : 'text-slate-600'
                      }`}
                    >
                      {plan.testsCountText}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <div className="flex items-baseline justify-end">
                      <span
                        className={`text-2xl sm:text-3xl font-black font-['Plus_Jakarta_Sans',sans-serif] ${
                          isSelected ? 'text-amber-300' : 'text-[#0A2540]'
                        }`}
                      >
                        ৳{plan.price}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] block ${
                        isSelected ? 'text-sky-300' : 'text-slate-400'
                      }`}
                    >
                      এককালীন ফি
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="mt-3 pt-3 border-t border-slate-200/40 space-y-1.5">
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <Check
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isSelected ? 'text-emerald-400' : 'text-emerald-600'
                        }`}
                      />
                      <span className={isSelected ? 'text-slate-200' : 'text-slate-700'}>
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Radio selection circle */}
                <div className="mt-3 flex justify-end">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? 'border-[#FF5A36] bg-[#FF5A36] text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-md mx-auto w-full pt-4 pb-2 border-t border-slate-200/80 flex items-center justify-between gap-4 z-30 bg-white/80 backdrop-blur-md px-2 rounded-2xl">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold text-xs sm:text-sm transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ব্যাক</span>
        </button>

        <button
          onClick={onNext}
          className="px-7 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer bg-[#FF5A36] hover:bg-[#EA580C] text-white shadow-orange-600/30 scale-100 active:scale-95 border-b-4 border-[#C2410C]"
        >
          <span>পেমেন্ট করুন (৳{selectedPlan.price})</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
};
