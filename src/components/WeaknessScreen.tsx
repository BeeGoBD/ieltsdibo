import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Headphones,
  BookOpen,
  PenTool,
  Mic,
  Check,
  Target,
  CheckCircle2,
} from 'lucide-react';
import { CartoonGuide, MascotPose } from './CartoonGuide';
import { sound } from '../utils/soundEffects';

interface WeaknessScreenProps {
  selectedWeakness: string;
  onSelectWeakness: (weakness: string) => void;
  onBack: () => void;
  onNext: () => void;
  lang?: 'bn' | 'en';
}

interface WeaknessOption {
  id: string;
  nameBn: string;
  nameEn: string;
  descBn: string;
  descEn: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
}

const WEAKNESS_OPTIONS: WeaknessOption[] = [
  {
    id: 'listening',
    nameBn: 'লিসেনিং (Listening)',
    nameEn: 'Listening',
    descBn: 'ব্রিটিশ অ্যাকসেন্ট ও দ্রুত কথোপকথন সহজে ধরা',
    descEn: 'Understanding native British accents and rapid audio',
    icon: Headphones,
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-600',
  },
  {
    id: 'reading',
    nameBn: 'রিডিং (Reading)',
    nameEn: 'Reading',
    descBn: 'প্যাসেজ থেকে দ্রুত তথ্য খুঁজে পাওয়া ও ট্রু/ফলস/নট গিভন',
    descEn: 'Speed reading, inference & True/False/Not Given',
    icon: BookOpen,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  {
    id: 'writing',
    nameBn: 'রাইটিং (Writing)',
    nameEn: 'Writing',
    descBn: 'টাস্ক ১ ও ২ আইডিয়া সাজানো এবং নির্ভুল সেন্টেন্স গঠন',
    descEn: 'Task 1 & 2 essay structure, vocabulary & cohesion',
    icon: PenTool,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
  {
    id: 'speaking',
    nameBn: 'স্পিকিং (Speaking)',
    nameEn: 'Speaking',
    descBn: 'আটকে না গিয়ে সাবলীল ফ্লুয়েন্সি ও আত্মবিশ্বাস',
    descEn: 'Natural fluency, pronunciation and confidence',
    icon: Mic,
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-600',
  },
  {
    id: 'none',
    nameBn: 'কোনো দুর্বলতা নেই (No Weakness)',
    nameEn: 'No Specific Weakness',
    descBn: 'সবগুলো মডিউলেই সমান গুরুত্ব ও ব্যালেন্সড পূর্ণাঙ্গ প্রস্তুতি',
    descEn: 'Balanced preparation and equal focus across all 4 skills',
    icon: CheckCircle2,
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
  },
];

export const WeaknessScreen: React.FC<WeaknessScreenProps> = ({
  selectedWeakness,
  onSelectWeakness,
  onBack,
  onNext,
  lang = 'bn',
}) => {
  const isBn = lang === 'bn';

  // Parse comma-separated string into list of selected IDs
  const selectedList = (selectedWeakness || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter((s) => WEAKNESS_OPTIONS.some((o) => o.id === s));

  // Toggle selection for multiple options or 'none' (No Weakness)
  const handleToggle = (id: string) => {
    sound.playSelect();
    let updated: string[];

    if (id === 'none') {
      // If clicking 'none', toggle it: if already selected, clear; otherwise select only 'none'
      if (selectedList.includes('none')) {
        updated = [];
      } else {
        updated = ['none'];
      }
    } else {
      // If clicking an individual skill, deselect 'none'
      const withoutNone = selectedList.filter((item) => item !== 'none');
      if (withoutNone.includes(id)) {
        updated = withoutNone.filter((item) => item !== id);
      } else {
        updated = [...withoutNone, id];
      }
    }

    onSelectWeakness(updated.join(','));
  };

  // Determine Mascot Pose & Message
  const getMascot = (): { pose: MascotPose; message: string } => {
    if (selectedList.length === 0) {
      return {
        pose: 'pointing-down',
        message: isBn
          ? 'আপনার দুর্বলতার বিষয়গুলো বেছে নিন অথবা "কোনো দুর্বলতা নেই" সিলেক্ট করুন।'
          : 'Select your focus areas or choose "No Specific Weakness".',
      };
    }
    if (selectedList.includes('none')) {
      return {
        pose: 'happy-celebrate',
        message: isBn
          ? 'দারুণ আত্মবিশ্বাস! সব মডিউলে সমান গুরুত্ব দিয়ে ব্যালেন্সড প্র্যাকটিস করব।'
          : 'Great confidence! We will practice all 4 skills in perfect balance.',
      };
    }
    if (selectedList.length >= 3) {
      return {
        pose: 'happy-celebrate',
        message: isBn
          ? 'চমৎকার! আমরা প্রতিটি বিষয়েই আপনাকে বিশেষ যত্ন ও টিপস দেব।'
          : 'Awesome! We will give personalized guidance across all these areas.',
      };
    }
    if (selectedList.includes('writing')) {
      return {
        pose: 'pointing-down',
        message: isBn
          ? 'রাইটিং নিয়ে একদম চিন্তা নেই! সহজ প্যারাগ্রাফিং ও সেন্টেন্স ট্রিকস শেখাব।'
          : 'Writing is totally manageable! We will guide you with clear templates.',
      };
    }
    if (selectedList.includes('speaking')) {
      return {
        pose: 'happy-celebrate',
        message: isBn
          ? 'স্পিকিংয়ে জড়তা কাটাতে ড. ফিঞ্চের সাথে লাইভ প্র্যাকটিস দারুণ কাজে দেবে!'
          : 'Speaking practice with Dr. Finch will boost your fluency fast!',
      };
    }
    return {
      pose: 'pointing-down',
      message: isBn
        ? 'আপনার নির্বাচিত বিষয়গুলোতে আমরা স্পেশাল প্র্যাকটিস সেট সাজাব।'
        : 'We will calibrate special practice sets for your selected skills.',
    };
  };

  const mascot = getMascot();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-sky-50/40 flex flex-col justify-between text-slate-900 px-4 py-4 sm:py-6 selection:bg-rose-500 selection:text-white">
      {/* Top Header */}
      <header className="max-w-xl mx-auto w-full flex items-center justify-between pt-1 pb-3">
        <button
          onClick={() => {
            sound.playClick();
            onBack();
          }}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden xs:inline">{isBn ? 'পেছনে' : 'Back'}</span>
        </button>

        {/* Step Indicator (Step 2 of 4) */}
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-4 rounded-full bg-emerald-500"></div>
          <div className="h-2 w-8 sm:w-10 rounded-full bg-[#0A2540]"></div>
          <div className="h-2 w-3 sm:w-4 rounded-full bg-slate-200"></div>
          <div className="h-2 w-3 sm:w-4 rounded-full bg-slate-200"></div>
        </div>

        <div className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
          {isBn ? 'ধাপ ২ / ৪' : 'Step 2 of 4'}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-xl mx-auto w-full flex-1 flex flex-col justify-center my-auto py-2">
        {/* Animated Mascot Guide */}
        <div className="flex justify-center mb-3">
          <CartoonGuide pose={mascot.pose} message={mascot.message} size="md" />
        </div>

        {/* Heading */}
        <div className="text-center mb-4">
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-sky-800 bg-sky-100 px-3 py-0.5 rounded-full mb-1.5 border border-sky-200">
            <Target className="w-3.5 h-3.5 text-sky-600" />
            {isBn ? 'ফোকাস এরিয়া' : 'Focus Area'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0A2540] tracking-tight">
            {isBn
              ? 'কোন মডিউলে আপনার বেশি সাহায্য প্রয়োজন?'
              : 'Which modules do you need help with?'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
            {isBn
              ? 'পছন্দ অনুযায়ী এক বা একাধিক অপশন বেছে নিন, অথবা কোনো দুর্বলতা না থাকলে শেষ অপশনটি সিলেক্ট করুন।'
              : 'Select one or more options, or choose the last option if you have no specific weakness.'}
          </p>
        </div>

        {/* 5 Skill Cards (Multi-Select + No Weakness) */}
        <div className="space-y-2.5">
          {WEAKNESS_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selectedList.includes(opt.id);
            const isNoWeaknessCard = opt.id === 'none';

            return (
              <motion.div
                key={opt.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleToggle(opt.id)}
                className={`p-3 sm:p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between select-none ${
                  isSelected
                    ? isNoWeaknessCard
                      ? 'bg-teal-50/80 border-teal-600 shadow-sm ring-1 ring-teal-600'
                      : 'bg-sky-50/80 border-[#0A2540] shadow-sm ring-1 ring-[#0A2540]'
                    : isNoWeaknessCard
                    ? 'bg-white hover:bg-teal-50/40 border-slate-200 shadow-2xs'
                    : 'bg-white hover:bg-slate-50 border-slate-200 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? isNoWeaknessCard
                          ? 'bg-teal-600 text-white'
                          : 'bg-[#0A2540] text-white'
                        : `${opt.iconBg} ${opt.iconColor}`
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="text-left">
                    <h3 className="font-extrabold text-sm sm:text-base text-[#0A2540]">
                      {isBn ? opt.nameBn : opt.nameEn}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                      {isBn ? opt.descBn : opt.descEn}
                    </p>
                  </div>
                </div>

                {/* Checkbox indicator */}
                <div className="shrink-0 pl-3">
                  <div
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? isNoWeaknessCard
                          ? 'bg-teal-600 border-teal-600 text-white'
                          : 'bg-[#0A2540] border-[#0A2540] text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Bottom Navigation */}
      <footer className="max-w-xl mx-auto w-full pt-3 pb-2 flex items-center justify-between gap-3">
        <button
          onClick={() => {
            sound.playClick();
            onBack();
          }}
          className="px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-bold text-xs sm:text-sm transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isBn ? 'ব্যাক' : 'Back'}</span>
        </button>

        <button
          disabled={selectedList.length === 0}
          onClick={() => {
            sound.playSuccess();
            onNext();
          }}
          className={`px-7 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer ${
            selectedList.length > 0
              ? 'bg-[#FF5A36] hover:bg-[#EA580C] text-white shadow-orange-600/25 active:scale-95 border-b-4 border-[#C2410C]'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed border-none'
          }`}
        >
          <span>
            {isBn
              ? selectedList.includes('none')
                ? 'নেক্সট'
                : selectedList.length > 1
                ? `নেক্সট (${selectedList.length})`
                : 'নেক্সট'
              : selectedList.includes('none')
              ? 'Next'
              : selectedList.length > 1
              ? `Next (${selectedList.length})`
              : 'Next'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
};
