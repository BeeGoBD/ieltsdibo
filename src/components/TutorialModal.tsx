import React from 'react';
import { X, PlayCircle, CheckCircle2, ShieldCheck, Award, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartExam: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
  onStartExam,
}) => {
  if (!isOpen) return null;

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
              <PlayCircle className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="font-bold text-base text-white">কীভাবে পরীক্ষা দেবেন? নির্দেশিকা</h3>
                <p className="text-xs text-sky-200">মাত্র ৩টি সহজ ধাপে সম্পূর্ণ ফ্রি টিউটোরিয়াল</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 overflow-y-auto space-y-5 text-slate-800">
            {/* Embedded Video Mockup with play simulation */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video shadow-md group cursor-pointer border border-slate-700 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
              {/* Background preview image */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
              
              <div className="relative z-20 flex flex-col items-center text-center px-4">
                <div className="w-14 h-14 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 mb-3">
                  <PlayCircle className="w-8 h-8 fill-current" />
                </div>
                <span className="text-white font-bold text-sm">ভিডিও টিউটোরিয়াল দেখুন (YouTube)</span>
                <span className="text-sky-300 text-xs mt-1">IELTS DIBO (আইলস দিবো) প্ল্যাটফর্মে মক টেস্ট দেওয়ার পূর্ণাঙ্গ নিয়ম (৩ মিনিট)</span>
              </div>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-sky-600" />
                ধাপে ধাপে সহজে শুরু করুন:
              </h4>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-sky-50/70 border border-sky-100">
                <div className="w-6 h-6 rounded-full bg-[#0A2540] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  ১
                </div>
                <div>
                  <p className="font-semibold text-xs text-slate-900">টার্গেট স্কোর ও দুর্বলতা নির্বাচন</p>
                  <p className="text-[11px] text-slate-600">আপনার কাঙ্ক্ষিত স্কোর (যেমন: ৭.৫ বা ৮.০) ও যে মডিউলে প্রস্তুতি দরকার তা সিলেক্ট করুন।</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-sky-50/70 border border-sky-100">
                <div className="w-6 h-6 rounded-full bg-[#0A2540] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  ২
                </div>
                <div>
                  <p className="font-semibold text-xs text-slate-900">মাত্র ৯ টাকায় প্ল্যান অ্যাক্টিভেশন</p>
                  <p className="text-[11px] text-slate-600">বিকাশ, নগদ বা রকেটে ট্রানজ্যাকশন আইডি দিয়ে পেমেন্ট জমা দিন। আমাদের টিম দ্রুত ভেরিফাই করে দেবে।</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-sky-50/70 border border-sky-100">
                <div className="w-6 h-6 rounded-full bg-[#0A2540] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  ৩
                </div>
                <div>
                  <p className="font-semibold text-xs text-slate-900">লাইভ পরীক্ষা ও অফিসিয়াল রেজাল্ট PDF</p>
                  <p className="text-[11px] text-slate-600">ক্যামব্রিজ স্ট্যান্ডার্ড ৪টি মডিউলের টেস্ট দিন এবং পরীক্ষা শেষে প্রফেশনাল সাইন করা রেজাল্ট শিট ডাউনলোড করুন।</p>
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 text-[11px] text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>অরিজিনাল ক্যামব্রিজ প্যাটার্ন</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 text-[11px] text-slate-700 font-medium">
                <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
                <span>২৪ ঘণ্টা হেল্প সাপোর্ট</span>
              </div>
            </div>
          </div>

          {/* Modal Footer CTA */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
            >
              পরে দেখব
            </button>
            <button
              onClick={() => {
                onClose();
                onStartExam();
              }}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#FF5A36] hover:bg-[#E04B2A] text-white shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5"
            >
              <span>এখনই শুরু করুন</span>
              <Award className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
