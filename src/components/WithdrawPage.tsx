import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Wallet, ShieldCheck, Upload, AlertCircle, CheckCircle2, FileText, Image as ImageIcon } from 'lucide-react';
import { UserProfile, WithdrawRecord, AppLanguage } from '../types';

interface WithdrawPageProps {
  user: UserProfile;
  lang?: AppLanguage;
  onBack: () => void;
  onSubmitWithdraw: (record: WithdrawRecord) => void;
}

export const WithdrawPage: React.FC<WithdrawPageProps> = ({
  user,
  lang = 'bn',
  onBack,
  onSubmitWithdraw,
}) => {
  const [amount, setAmount] = useState('100');
  const [method, setMethod] = useState<'bKash' | 'Nagad' | 'Rocket'>('bKash');
  const [accountNumber, setAccountNumber] = useState(user.phone || '');
  const [nidImage, setNidImage] = useState<string | null>(null);
  const [nidFileName, setNidFileName] = useState<string>('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError(lang === 'bn' ? 'শুধুমাত্র ছবি ফাইল (JPG, PNG) আপলোড করুন।' : 'Only image files (JPG, PNG) are allowed.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(lang === 'bn' ? 'ছবির সাইজ সর্বোচ্চ ৫ মেগাবাইটের মধ্যে হতে হবে।' : 'Image size must be under 5MB.');
      return;
    }

    setNidFileName(file.name);
    setError('');

    const reader = new FileReader();
    reader.onload = () => {
      setNidImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < 50) {
      setError(lang === 'bn' ? 'নূন্যতম উত্তোলনের পরিমাণ ৫০ টাকা হতে হবে।' : 'Minimum withdrawal amount is ৳50.');
      return;
    }

    if (parsedAmount > user.walletBalance) {
      setError(
        lang === 'bn'
          ? `আপনার ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই। বর্তমান ব্যালেন্স: ৳${user.walletBalance}`
          : `Insufficient wallet balance. Current balance: ৳${user.walletBalance}`
      );
      return;
    }

    const cleanAcc = accountNumber.trim();
    if (!cleanAcc || cleanAcc.length < 11) {
      setError(
        lang === 'bn'
          ? 'সঠিক ১১ ডিজিটের মোবাইল ব্যাংকিং নম্বর প্রদান করুন।'
          : 'Please provide a valid 11-digit mobile banking account number.'
      );
      return;
    }

    // MANDATORY NID Image validation per user instruction!
    if (!nidImage) {
      setError(
        lang === 'bn'
          ? 'উত্তোলন অনুমোদনের জন্য আপনার স্পষ্ট এনআইডি (NID) কার্ডের ছবি আপলোড করা বাধ্যতামূলক।'
          : 'National ID (NID) card image upload is mandatory for verification before payout.'
      );
      return;
    }

    const newRecord: WithdrawRecord = {
      id: 'WTH-' + Date.now().toString().slice(-6),
      userId: user.id || user.rollNumber,
      userName: user.name,
      userPhone: user.phone,
      amount: parsedAmount,
      method,
      accountNumber: cleanAcc,
      nidImageUrl: nidImage,
      requestDate: new Date().toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      status: 'pending',
    };

    onSubmitWithdraw(newRecord);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-6 text-slate-900">
        <div className="max-w-md mx-auto w-full pt-10 flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-[#0A2540]">
            {lang === 'bn' ? 'উইথড্র রিকোয়েস্ট সফল!' : 'Withdrawal Submitted!'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm">
            {lang === 'bn'
              ? 'আপনার উত্তোলন অনুরোধ ও এনআইডি ডকুমেন্ট সফলভাবে অ্যাডমিন প্যানেলে জমা দেওয়া হয়েছে। ভেরিফিকেশন শেষে আপনার দেওয়া নম্বরে পেমেন্ট পাঠিয়ে দেওয়া হবে।'
              : 'Your payout request and NID document have been submitted to the Admin Panel. Funds will be disbursed upon verification.'}
          </p>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 w-full text-xs space-y-2 text-left shadow-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">{lang === 'bn' ? 'পরিমাণ:' : 'Amount:'}</span>
              <span className="font-bold text-amber-600">৳{amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{lang === 'bn' ? 'মেথড:' : 'Method:'}</span>
              <span className="font-bold text-slate-800">{method}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{lang === 'bn' ? 'অ্যাকাউন্ট নম্বর:' : 'Account Number:'}</span>
              <span className="font-bold font-mono text-slate-800">{accountNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{lang === 'bn' ? 'এনআইডি স্ট্যাটাস:' : 'NID Status:'}</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {lang === 'bn' ? 'সংযুক্ত করা হয়েছে' : 'Attached & Verified'}
              </span>
            </div>
          </div>

          <button
            onClick={onBack}
            className="w-full py-3 bg-[#0A2540] hover:bg-slate-800 text-white rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer mt-4"
          >
            {lang === 'bn' ? 'ড্যাশবোর্ডে ফিরে যান' : 'Return to Dashboard'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 pb-10">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-20">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer font-bold text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}</span>
          </button>

          <h1 className="text-sm font-extrabold text-[#0A2540]">
            {lang === 'bn' ? 'টাকা উত্তোলন (Withdrawal)' : 'Referral Payout'}
          </h1>

          <div className="w-12"></div>
        </div>
      </div>

      {/* Main Form Page */}
      <div className="max-w-md mx-auto w-full px-4 pt-4 flex-1 space-y-4">
        {/* Wallet Stat */}
        <div className="bg-gradient-to-r from-[#0A2540] to-sky-950 p-4 rounded-2xl text-white flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-sky-200 block">
                {lang === 'bn' ? 'মোট উত্তোলনযোগ্য ব্যালেন্স' : 'Withdrawable Balance'}
              </span>
              <span className="text-2xl font-black text-amber-300 font-mono">
                ৳{user.walletBalance.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US')}
              </span>
            </div>
          </div>

          <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-400 px-2.5 py-1 rounded-full font-bold">
            {lang === 'bn' ? 'সরাসরি ক্যাশআউট' : 'Direct Cashout'}
          </span>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-xs text-rose-800 font-medium"
          >
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          {/* Method Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {lang === 'bn' ? 'পেমেন্ট মেথড নির্বাচন করুন' : 'Select Payout Channel'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'bKash', label: 'bKash', color: 'border-pink-300 bg-pink-50/50 text-pink-700' },
                { id: 'Nagad', label: 'Nagad', color: 'border-orange-300 bg-orange-50/50 text-orange-700' },
                { id: 'Rocket', label: 'Rocket', color: 'border-purple-300 bg-purple-50/50 text-purple-700' },
              ].map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setMethod(m.id as any)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                    method === m.id
                      ? 'ring-2 ring-[#0A2540] border-[#0A2540] bg-[#0A2540] text-white shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {lang === 'bn' ? 'উত্তোলনের পরিমাণ (টাকা)' : 'Withdrawal Amount (BDT)'}
            </label>
            <input
              type="number"
              min="50"
              max={user.walletBalance}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
              required
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              {lang === 'bn' ? 'নূন্যতম উত্তোলন ৫০ টাকা' : 'Minimum payout threshold is ৳50'}
            </span>
          </div>

          {/* Mobile Account Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {lang === 'bn' ? `${method} ব্যক্তিগত নম্বর (১১ ডিজিট)` : `${method} Personal Number (11-digit)`}
            </label>
            <input
              type="tel"
              maxLength={11}
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="017XXXXXXXX"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
              required
            />
          </div>

          {/* Mandatory NID Upload */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
              <span>{lang === 'bn' ? 'জাতীয় পরিচয়পত্র (NID) আপলোড *' : 'National ID (NID) Photo *'}</span>
              <span className="text-[10px] text-rose-500 font-extrabold">{lang === 'bn' ? 'বাধ্যতামূলক' : 'Mandatory'}</span>
            </label>
            <p className="text-[11px] text-slate-500 mb-2">
              {lang === 'bn'
                ? 'আইলসের নিয়ম অনুযায়ী ভুয়া অ্যাকাউন্ট রোধ ও সিকিউরিটির জন্য আপনার NID ফ্রন্ট পেজের পরিষ্কার ছবি দিন।'
                : 'Upload a clear photo of your NID card front side for candidate verification.'}
            </p>

            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:bg-slate-50 transition-colors relative cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />

              {nidImage ? (
                <div className="space-y-2">
                  <div className="w-full h-32 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img src={nidImage} alt="NID Preview" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-700 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{nidFileName || (lang === 'bn' ? 'NID কার্ড লোড হয়েছে' : 'NID Attached')}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block">{lang === 'bn' ? 'পরিবর্তন করতে পুনরায় ক্লিক করুন' : 'Click to change image'}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-2 text-slate-500 space-y-1">
                  <div className="w-10 h-10 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mb-1">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">
                    {lang === 'bn' ? 'NID কার্ডের ছবি আপলোড করুন' : 'Click or drag NID photo here'}
                  </span>
                  <span className="text-[10px] text-slate-400">JPG, PNG (Max 5MB)</span>
                </div>
              )}
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#EA580C] text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-md transition-all cursor-pointer border-b-4 border-[#C2410C] flex items-center justify-center gap-2 mt-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{lang === 'bn' ? 'উইথড্র রিকোয়েস্ট সাবমিট করুন' : 'Submit Withdrawal Request'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
