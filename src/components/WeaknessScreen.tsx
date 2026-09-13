import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Headphones, BookOpen, PenTool, Mic, CheckCircle2, ShieldQuestion } from 'lucide-react';
import { CartoonGuide } from './CartoonGuide';

interface WeaknessScreenProps {
  selectedWeakness: string;
  onSelectWeakness: (weakness: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const MODULES = [
  {
    id: 'listening',
    name: 'লিসেনিং (Listening)',
    subtitle: 'অডিও বোঝা ও দ্রুত স্পেলিং নির্ভুল রাখা',
    icon: Headphones,
    color: 'sky',
  },
  {
    id: 'reading',
    name: 'রিডিং (Reading)',
    subtitle: 'বড় প্যাসেজ থেকে দ্রুত সঠিক উত্তর খোঁজা',
    icon: BookOpen,
    color: 'emerald',
  },
  {
    id: 'writing',
    name: 'রাইটিং (Writing)',
    subtitle: 'টাস্ক ১ ও ২ এর সঠিক স্ট্রাকচার ও গ্রামার',
    icon: PenTool,
    color: 'amber',
  },
  {
    id: 'speaking',
    name: 'স্পিকিং (Speaking)',
    subtitle: 'ন্যাচারাল ফ্লুয়েন্সি ও ভয় ছাড়া সাবলীল কথা বলা',
    icon: Mic,
    color: 'rose',
  },
];

export const WeaknessScreen: React.FC<WeaknessScreenProps> = ({
  selectedWeakness,
  onSelectWeakness,
  onBack,
  onNext,
}) => {
  const isNoWeakness = selectedWeakness === 'none';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-sky-50/40 flex flex-col justify-between text-slate-900 px-4 py-6 selection:bg-rose-500 selection:text-white">
      {/* Header / Progress bar */}
      <header className="max-w-md mx-auto w-full flex items-center justify-between pt-2 pb-3">
        <button
          onClick={onBack}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          title="ফিরে যান"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Step Indicator */}
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-8 rounded-full bg-[#0A2540]"></div>
          <div className="h-1.5 w-8 rounded-full bg-[#0A2540]"></div>
          <div className="h-1.5 w-3 rounded-full bg-slate-200"></div>
          <div className="h-1.5 w-3 rounded-full bg-slate-200"></div>
        </div>

        <div className="text-xs font-semibold text-slate-400">ধাপ ২ / ৪</div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-md mx-auto w-full flex-1 flex flex-col justify-start">
        {/* Cartoon Character pointing downward toward the options */}
        <div className="flex justify-center -mb-2">
          <CartoonGuide
            pose="pointing-down"
            message={
              selectedWeakness
                ? isNoWeakness
                  ? 'বাহ! আপনি অলরাউন্ডার! সব মডিউল এক সাথে প্র্যাকটিস হবে।'
                  : 'চিন্তা নেই, এই বিষয়ে বিশেষ প্র্যাকটিস সেট পাবেন।'
                : 'কোন বিষয়ে সবচেয়ে বেশি ভয় কাজ করে?'
            }
            size="md"
          />
        </div>

        {/* Heading */}
        <div className="text-center my-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 bg-sky-100/70 px-3 py-0.5 rounded-full mb-1">
            <ShieldQuestion className="w-3.5 h-3.5" />
            দক্ষতা মূল্যায়ন
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A2540] tracking-tight">
            আপনার দুর্বলতা কোনটা?
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            যেটিতে বেশি জোর দেওয়া প্রয়োজন তা বেছে নিন
          </p>
        </div>

        {/* Four Clear Selectable Buttons */}
        <div className="space-y-2.5 mt-3">
          {MODULES.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedWeakness === item.id;

            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectWeakness(item.id)}
                className={`w-full p-3.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#0A2540] text-white border-[#0A2540] shadow-md ring-2 ring-[#FF5A36]'
                    : 'bg-white text-slate-800 hover:bg-sky-50/50 border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center space-x-3 text-left">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-white/10 text-amber-300'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4
                      className={`font-bold text-sm ${
                        isSelected ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {item.name}
                    </h4>
                    <p
                      className={`text-[11px] mt-0.5 ${
                        isSelected ? 'text-sky-200' : 'text-slate-500'
                      }`}
                    >
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 pl-2">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      isSelected
                        ? 'bg-[#FF5A36] border-[#FF5A36] text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Soft bottom option: “আমার কোনো দুর্বলতা নেই” */}
        <div className="mt-3">
          <button
            onClick={() => onSelectWeakness('none')}
            className={`w-full py-3 px-4 rounded-xl text-center text-xs font-semibold transition-all cursor-pointer border ${
              isNoWeakness
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-sm ring-2 ring-emerald-500 font-bold'
                : 'bg-slate-100/80 hover:bg-slate-200/80 text-slate-600 border-dashed border-slate-300'
            }`}
          >
            {isNoWeakness ? '✓ আমার কোনো দুর্বলতা নেই (নির্বাচিত)' : '👉 আমার কোনো দুর্বলতা নেই'}
          </button>
        </div>
      </main>

      {/* Same Back + Next pattern */}
      <footer className="max-w-md mx-auto w-full pt-4 pb-2 border-t border-slate-200/80 flex items-center justify-between gap-4 z-30 bg-white/80 backdrop-blur-md px-2 rounded-2xl">
        {/* Subtle Back button */}
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold text-xs sm:text-sm transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ব্যাক</span>
        </button>

        {/* Highlighted Next button */}
        <button
          disabled={!selectedWeakness}
          onClick={onNext}
          className={`px-7 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer ${
            selectedWeakness
              ? 'bg-[#FF5A36] hover:bg-[#EA580C] text-white shadow-orange-600/30 scale-100 active:scale-95 border-b-4 border-[#C2410C]'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed border-none'
          }`}
        >
          <span>নেক্সট</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
};
