import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, CheckCircle, AlertTriangle, Trophy, Zap, X, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../utils/soundEffects';
import { AppLanguage } from '../types';

interface SoundControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: AppLanguage;
}

export const SoundControlModal: React.FC<SoundControlModalProps> = ({ isOpen, onClose, lang }) => {
  const [isEnabled, setIsEnabled] = useState(sound.isEnabled());
  const [volume, setVolume] = useState(sound.getVolume());
  const [isBoosted, setIsBoosted] = useState(sound.isBoosted());
  const [lastPlayed, setLastPlayed] = useState<string | null>(null);

  useEffect(() => {
    setIsEnabled(sound.isEnabled());
    setVolume(sound.getVolume());
    setIsBoosted(sound.isBoosted());
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleSound = () => {
    const newState = sound.toggleSound();
    setIsEnabled(newState);
    if (newState) {
      sound.playClick();
      setLastPlayed('click');
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    sound.setVolume(newVol);
    sound.playClick();
    setLastPlayed('click');
  };

  const handleToggleBoost = () => {
    const newBoost = !isBoosted;
    setIsBoosted(newBoost);
    sound.setBoosted(newBoost);
    sound.playSuccess();
    setLastPlayed('success');
  };

  const testSounds = [
    {
      id: 'success',
      label: lang === 'bn' ? 'সঠিক উত্তর (Duo Correct)' : 'Correct Ding (Duo Correct)',
      desc: lang === 'bn' ? 'ডুওলিঙ্গোর বিখ্যাত জয়ধ্বনি ও বেল চাইম' : 'Iconic Duolingo correct answer bell chime',
      icon: CheckCircle,
      color: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30',
      action: () => {
        sound.playSuccess();
        setLastPlayed('success');
      },
    },
    {
      id: 'click',
      label: lang === 'bn' ? 'বাবল পপ ক্লিক (Juicy Pop)' : 'Bubble Pop (Juicy Tap)',
      desc: lang === 'bn' ? 'বাটন ও অপশন টাচ করার তৃপ্তিদায়ক সাউন্ড' : 'Punchy, hollow wooden bubble tap',
      icon: Bell,
      color: 'bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/30',
      action: () => {
        sound.playClick();
        setLastPlayed('click');
      },
    },
    {
      id: 'select',
      label: lang === 'bn' ? 'অপশন সিলেক্ট (Option Tile)' : 'Option Select (Tile Blip)',
      desc: lang === 'bn' ? 'প্রশ্নের উত্তর বাছলে হালকা মারিম্বা টোন' : 'Rising marimba chirp for question choices',
      icon: Sparkles,
      color: 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-indigo-500/30',
      action: () => {
        sound.playSelect();
        setLastPlayed('select');
      },
    },
    {
      id: 'error',
      label: lang === 'bn' ? 'ভুল উত্তর (Duo Error Bonk)' : 'Wrong Answer (Duo Bonk)',
      desc: lang === 'bn' ? 'ডুওলিঙ্গোর বিখ্যাত ডাবল উড-বঙ্ক সাউন্ড' : 'Playful descending double wooden thud',
      icon: AlertTriangle,
      color: 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/30',
      action: () => {
        sound.playError();
        setLastPlayed('error');
      },
    },
    {
      id: 'fanfare',
      label: lang === 'bn' ? 'মক টেস্ট ফ্যানফেয়ার (Victory)' : 'Test Complete (Fanfare)',
      desc: lang === 'bn' ? 'পরীক্ষা বা লেভেল শেষ হলে ট্রায়াম্ফ চোর্ড' : 'Triumphant brass & celesta victory chord',
      icon: Trophy,
      color: 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/30',
      action: () => {
        sound.playFanfare();
        setLastPlayed('fanfare');
      },
    },
    {
      id: 'streak',
      label: lang === 'bn' ? 'স্ট্রাইক / জেম শিমার (Gem Chime)' : 'Streak Gem (Shimmer)',
      desc: lang === 'bn' ? 'বোনাস ও রিওয়ার্ড পয়েন্ট অর্জনের ক্রিস্টাল সাউন্ড' : 'Crystalline bell reward shimmer',
      icon: Zap,
      color: 'bg-purple-500 hover:bg-purple-600 text-white shadow-purple-500/30',
      action: () => {
        sound.playStreak();
        setLastPlayed('streak');
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 text-slate-800"
      >
        {/* Header */}
        <div className="bg-[#0A2540] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg font-black">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">
                {lang === 'bn' ? 'ডুওলিঙ্গো সাউন্ড স্টুডিও' : 'Duolingo Sound Studio'}
              </h3>
              <p className="text-xs text-sky-200">
                {lang === 'bn' ? 'উচ্চ ভলিউম ও ক্রিস্প অডিও সেটিংস' : 'Loud & punchy audio feedback'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Main Sound Toggle & Boost */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {isEnabled ? (
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Volume2 className="w-4 h-4 animate-pulse" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                    <VolumeX className="w-4 h-4" />
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    {lang === 'bn' ? 'সাউন্ড ইফেক্ট' : 'Sound Effects'}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {isEnabled
                      ? lang === 'bn' ? 'সক্রিয় (Active)' : 'Active on all clicks & tests'
                      : lang === 'bn' ? 'বন্ধ (Muted)' : 'Muted'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleToggleSound}
                className={`px-4 py-1.5 rounded-xl font-bold text-xs cursor-pointer transition-all ${
                  isEnabled
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                    : 'bg-slate-300 hover:bg-slate-400 text-slate-800'
                }`}
              >
                {isEnabled ? (lang === 'bn' ? 'চালু আছে' : 'ON') : (lang === 'bn' ? 'বন্ধ' : 'OFF')}
              </button>
            </div>

            {/* Duolingo Super Boost Switcher */}
            <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className={`w-4 h-4 ${isBoosted ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
                <div>
                  <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    {lang === 'bn' ? 'ডুওলিঙ্গো লাউডনেস বুস্ট' : 'Duolingo Loudness Boost'}
                    <span className="text-[9px] px-1.5 py-0.2 bg-amber-100 text-amber-900 font-extrabold rounded-md">
                      MAX
                    </span>
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {lang === 'bn' ? '+২৫% বাড়তি পাঞ্চ ও স্বচ্ছ সাউন্ড' : '+25% extra punch with zero distortion'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleToggleBoost}
                className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  isBoosted
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {isBoosted ? (lang === 'bn' ? 'ম্যাক্স লাউড' : 'LOUD') : (lang === 'bn' ? 'নরমাল' : 'NORMAL')}
              </button>
            </div>

            {/* Volume Slider */}
            <div className="pt-2 border-t border-slate-200/80">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-semibold text-slate-700">
                  {lang === 'bn' ? 'ভলিউম লেভেল' : 'Master Volume'}
                </span>
                <span className="font-mono font-bold text-slate-900">
                  {Math.round(volume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1.25"
                step="0.05"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Interactive Sound Test Grid */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                {lang === 'bn' ? '🔊 সাউন্ড টেস্ট করুন (লাইভ প্রিভিউ)' : '🔊 Test Duolingo Sounds Live'}
              </h4>
              <span className="text-[10px] text-slate-500">
                {lang === 'bn' ? 'ক্লিক করে শুনুন' : 'Tap to hear'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {testSounds.map((item) => {
                const Icon = item.icon;
                const isSelected = lastPlayed === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all flex items-start gap-2.5 shadow-xs ${
                      isSelected
                        ? 'border-amber-400 bg-amber-50/70 ring-2 ring-amber-400'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-slate-900 leading-tight">
                        {item.label}
                      </div>
                      <div className="text-[10px] text-slate-500 leading-tight mt-0.5 truncate">
                        {item.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Note info */}
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3 text-[11px] text-sky-950 flex items-start gap-2 leading-relaxed">
            <span className="text-base">💡</span>
            <div>
              {lang === 'bn' ? (
                <>
                  <strong>ডুওলিঙ্গো অডিও ফিডব্যাক:</strong> ওয়েবসাইটের প্রতিটি বাটন, মক টেস্ট অপশন এবং রেজাল্ট সাবমিশনে হাই-রেসপন্স অডিও সক্রিয় রয়েছে। মোবাইল ও ল্যাপটপের স্পিকারে পরিষ্কার ও লাউড শোনাবে।
                </>
              ) : (
                <>
                  <strong>Duolingo Audio Experience:</strong> High-impact synthesized audio cues with dynamic compressor limiting. Zero audio lag on all mobile and desktop browsers.
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#0A2540] hover:bg-slate-800 text-white font-bold text-xs cursor-pointer shadow-md transition-all"
          >
            {lang === 'bn' ? 'ঠিক আছে' : 'Done'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
