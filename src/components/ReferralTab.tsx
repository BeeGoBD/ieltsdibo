import React, { useState } from 'react';
import { Gift, Copy, CheckCheck, Wallet, ArrowDownToLine, Users, Sparkles, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { UserProfile, WithdrawRecord } from '../types';

interface ReferralTabProps {
  user: UserProfile;
  withdrawHistory: WithdrawRecord[];
  onRequestWithdraw: (withdraw: WithdrawRecord) => void;
  onSimulateReferralPurchase: () => void;
}

export const ReferralTab: React.FC<ReferralTabProps> = ({
  user,
  withdrawHistory,
  onRequestWithdraw,
  onSimulateReferralPurchase,
}) => {
  const [copied, setCopied] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('100');
  const [withdrawMethod, setWithdrawMethod] = useState<'bKash' | 'Rocket'>('bKash');
  const [accountNumber, setAccountNumber] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const referralUrl = `https://ieltsdibo.com?ref=${user.referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(user.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(withdrawAmount);

    if (isNaN(amountNum) || amountNum < 50) {
      setError('নূন্যতম উইথড্র পরিমাণ ৫০ টাকা হতে হবে');
      return;
    }
    if (amountNum > user.walletBalance) {
      setError('আপনার একাউন্টে পর্যাপ্ত ব্যালেন্স নেই');
      return;
    }
    if (!accountNumber.trim() || accountNumber.length < 11) {
      setError('সঠিক ১১ ডিজিটের মোবাইল ব্যাংকিং নম্বর লিখুন');
      return;
    }

    const newWithdraw: WithdrawRecord = {
      id: 'WTH-' + Date.now().toString().slice(-5),
      amount: amountNum,
      method: withdrawMethod,
      accountNumber: accountNumber.trim(),
      requestDate: new Date().toLocaleDateString('bn-BD', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'pending',
    };

    onRequestWithdraw(newWithdraw);
    setShowWithdrawModal(false);
    setSuccessMsg(`৳${amountNum} উইথড্র রিকোয়েস্ট সফলভাবে অ্যাডমিন সেকশনে জমা হয়েছে!`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-br from-[#0A2540] to-[#133E68] text-white p-5 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl"></div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center text-amber-300">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-sky-200 block">রেফারেল ওয়ালেট ব্যালেন্স</span>
              <h3 className="text-xl sm:text-2xl font-black font-['Plus_Jakarta_Sans',sans-serif] text-amber-300">
                ৳{user.walletBalance.toLocaleString('bn-BD')}
              </h3>
            </div>
          </div>

          {/* Withdraw Button */}
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="px-4 py-2 rounded-xl bg-[#FF5A36] hover:bg-[#EA580C] text-white text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
          >
            <ArrowDownToLine className="w-3.5 h-3.5" />
            <span>টাকা তুলুন (Withdraw)</span>
          </button>
        </div>

        <div className="bg-white/10 rounded-2xl p-3 text-xs text-sky-100 flex items-center justify-between mt-2 border border-white/10">
          <span>৩০ দিনের প্ল্যান (৳৪৯৯) বিক্রি হলে পাবেন:</span>
          <span className="font-bold text-amber-300">সরাসরি ১০০ টাকা</span>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Referral Code & Share Link */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-[#FF5A36]" />
          <h4 className="font-extrabold text-sm text-[#0A2540]">আপনার ব্যক্তিগত রেফারেল কোড</h4>
        </div>
        <p className="text-xs text-slate-500">
          বন্ধুদের সাথে এই কোড শেয়ার করুন। বন্ধু এই কোড ব্যবহার করে ৪৯৯ টাকার প্ল্যান অনুমোদন পেলে আপনি তৎক্ষণাৎ ১০০ টাকা পাবেন।
        </p>

        <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-2xl">
          <div className="font-mono text-base font-extrabold text-[#0A2540] tracking-wider">
            {user.referralCode}
          </div>
          <button
            onClick={handleCopyLink}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
              copied ? 'bg-emerald-600 text-white' : 'bg-[#0A2540] text-white hover:bg-slate-800'
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
                <span>কোড কপি</span>
              </>
            )}
          </button>
        </div>

        {/* Demo Simulation Button for Testing the 100 Tk Referral Rule */}
        <div className="pt-2">
          <button
            onClick={onSimulateReferralPurchase}
            className="w-full py-2.5 px-3 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>সিমুলেট করুন: বন্ধুর ৪৯৯ টাকার প্ল্যান অনুমোদন (+৳১০০ ওয়ালেটে যোগ)</span>
          </button>
        </div>
      </div>

      {/* Withdrawal History */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <h4 className="font-bold text-sm text-[#0A2540] flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500" />
          <span>উইথড্র হিস্টোরি (Withdrawal Requests)</span>
        </h4>

        {withdrawHistory.length === 0 ? (
          <p className="text-xs text-slate-400 py-3 text-center">এখনও কোনো টাকা উত্তোলনের রিকোয়েস্ট করা হয়নি</p>
        ) : (
          <div className="space-y-2">
            {withdrawHistory.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900">
                    ৳{item.amount} ({item.method})
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {item.accountNumber} • {item.requestDate}
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  {item.status === 'pending' ? 'অ্যাডমিন রিভিউতে আছে' : 'পরিশোধিত'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-5 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-base text-[#0A2540]">টাকা উত্তোলন করুন (Withdraw)</h3>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  পদ্ধতি নির্বাচন করুন
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setWithdrawMethod('bKash')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${
                      withdrawMethod === 'bKash'
                        ? 'bg-[#D12053] text-white border-[#D12053]'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span>বিকাশ (bKash)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setWithdrawMethod('Rocket')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${
                      withdrawMethod === 'Rocket'
                        ? 'bg-[#8C3494] text-white border-[#8C3494]'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span>রকেট (Rocket)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  উইথড্র পরিমাণ (টাকা)
                </label>
                <input
                  type="number"
                  min="50"
                  max={user.walletBalance}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                />
                <p className="text-[10px] text-slate-500 mt-1">সর্বোচ্চ ব্যালেন্স: ৳{user.walletBalance}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  আপনার {withdrawMethod === 'bKash' ? 'বিকাশ' : 'রকেট'} মোবাইল নম্বর
                </label>
                <input
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                />
              </div>

              {error && (
                <div className="text-[11px] text-rose-600 bg-rose-50 p-2 rounded-xl flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#FF5A36] text-white text-xs font-bold shadow-md cursor-pointer hover:bg-[#EA580C]"
                >
                  রিকোয়েস্ট পাঠান
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
