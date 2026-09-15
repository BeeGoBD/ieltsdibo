import React from 'react';
import { X, Sparkles, CheckCircle2, ShieldCheck, Award, ArrowRight, Zap, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartExam: () => void;
  onStartTrial?: () => void;
  lang?: 'bn' | 'en';
}

export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
  onStartExam,
  onStartTrial,
  lang = 'bn',
}) => {
  if (!isOpen) return null;
  const isBn = lang === 'bn';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-slate-200"
        >
          {/* Modal Header */}
          <div className="bg-[#0A2540] text-white px-5 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                <Sparkles className="w-4 h-4 text-slate-950" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">
                  {isBn ? 'ফ্রি ট্রায়াল পরীক্ষা দিন' : 'Give Free Trial Exam'}
                </h3>
                <p className="text-xs text-sky-200">
                  {isBn
                    ? 'কোনো পেমেন্ট ছাড়াই সরাসরি রেজিস্ট্রেশন করে পরীক্ষা দিন'
                    : 'Register directly without payment and begin your free trial'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 overflow-y-auto space-y-4 text-slate-800">
            {/* Direct Free Trial Callout Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-400/20 to-orange-500/15 border-2 border-amber-400/80 shadow-sm space-y-3">
              <div className="flex items-start gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black shrink-0 shadow-xs">
                  <Zap className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-[#0A2540]">
                    {isBn
                      ? 'টার্গেট স্কোর ছাড়াই সরাসরি রেজিস্ট্রেশন ও ফ্রি ট্রায়াল'
                      : 'Direct Registration with Free Trial — No Target Score Required'}
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    {isBn
                      ? 'এখন আলাদা করে কোনো টার্গেট স্কোর নির্বাচন করার প্রয়োজন নেই। শুধুমাত্র আপনার নাম ও জিমেইল দিয়ে সাথে সাথে রেজিস্ট্রেশন সম্পন্ন করে ফ্রি ট্রায়াল পরীক্ষা শুরু করতে পারবেন।'
                      : 'You do not need to select target score anymore. Register directly with your basic credentials and dive straight into the authentic exam simulation.'}
                  </p>
                </div>
              </div>

              {onStartTrial && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onStartTrial();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#FF5A36] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-orange-400/30 active:scale-98"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>
                    {isBn ? 'ফ্রি ট্রায়াল পরীক্ষা দিন' : 'Give Free Trial Exam'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Step-by-Step Direct Registration Flow */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                <Award className="w-4 h-4 text-sky-600" />
                <span>{isBn ? '৩টি ধাপে দ্রুত শুরু করুন:' : '3 Quick Steps to Start:'}</span>
              </h4>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-sky-50/70 border border-sky-100">
                <div className="w-6 h-6 rounded-full bg-[#0A2540] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  ১
                </div>
                <div>
                  <p className="font-bold text-xs text-slate-900">
                    {isBn ? 'সরাসরি রেজিস্ট্রেশন' : 'Direct Registration'}
                  </p>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    {isBn
                      ? 'টার্গেট স্কোর ছাড়াই শুধুমাত্র নাম, জিমেইল ও পাসওয়ার্ড দিয়ে সরাসরি একাউন্ট তৈরি করুন।'
                      : 'No target score selection step; sign up immediately with your name and Gmail.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-sky-50/70 border border-sky-100">
                <div className="w-6 h-6 rounded-full bg-[#0A2540] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  ২
                </div>
                <div>
                  <p className="font-bold text-xs text-slate-900">
                    {isBn ? 'ফ্রি ট্রায়ালে সব ফিচারে প্রবেশ' : 'Full Free Trial Access'}
                  </p>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    {isBn
                      ? 'লিসেনিং, রিডিং, রাইটিং এবং ড. ফিঞ্চের লাইভ স্পিকিং ইন্টারভিউ টেস্ট শুরু করুন।'
                      : 'Experience authentic Listening, Reading, Task 2 Writing, and Speaking AI interviews.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-sky-50/70 border border-sky-100">
                <div className="w-6 h-6 rounded-full bg-[#0A2540] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  ৩
                </div>
                <div>
                  <p className="font-bold text-xs text-slate-900">
                    {isBn ? 'ইনস্ট্যান্ট ক্যামব্রিজ রেজাল্ট ও ফিডব্যাক' : 'Instant Cambridge Band & Diagnostics'}
                  </p>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    {isBn
                      ? 'অফিসিয়াল ক্যামব্রিজ রুব্রিক অনুযায়ী ব্যান্ড স্কোর ও বিশদ ভুল সংশোধনের বিশ্লেষণ পান।'
                      : 'Receive comprehensive band scores and detailed breakdown aligned with Cambridge rubrics.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 text-[11px] text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isBn ? 'আসল ক্যামব্রিজ স্ট্যান্ডার্ড' : 'Authentic Cambridge Standard'}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 text-[11px] text-slate-700 font-medium">
                <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
                <span>{isBn ? 'লাইভ এআই স্পিকিং টেস্ট' : 'Live Speaking Examiner'}</span>
              </div>
            </div>
          </div>

          {/* Modal Footer CTA */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
            <button
              onClick={onClose}
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              {isBn ? 'বন্ধ করুন' : 'Close'}
            </button>

            <div className="flex items-center gap-2">
              {onStartTrial && (
                <button
                  onClick={() => {
                    onClose();
                    onStartTrial();
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#FF5A36] hover:bg-[#E04B2A] text-white shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                  <span>{isBn ? 'ফ্রি ট্রায়াল পরীক্ষা দিন' : 'Give Free Trial Exam'}</span>
                </button>
              )}

              <button
                onClick={() => {
                  onClose();
                  onStartExam();
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#0A2540] hover:bg-sky-950 text-white shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>{isBn ? 'সরাসরি রেজিস্ট্রেশন' : 'Direct Register'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
