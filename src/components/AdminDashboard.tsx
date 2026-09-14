import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldAlert,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Phone,
  Mail,
  Wallet,
  FileText,
  AlertTriangle,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  LogOut,
  Sparkles,
  ExternalLink,
  Filter,
  Check,
  X,
  MessageSquare,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { UserProfile, WithdrawRecord, SupportTicket, AppLanguage } from '../types';

interface AdminDashboardProps {
  users: UserProfile[];
  withdrawals: WithdrawRecord[];
  tickets: SupportTicket[];
  lang?: AppLanguage;
  onUpdateUser: (user: UserProfile) => void;
  onUpdateWithdrawal: (record: WithdrawRecord) => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  users,
  withdrawals,
  tickets,
  lang = 'bn',
  onUpdateUser,
  onUpdateWithdrawal,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'approvals' | 'users' | 'withdrawals' | 'support'>('approvals');
  const [approvalSubFilter, setApprovalSubFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNidImage, setSelectedNidImage] = useState<string | null>(null);
  const [rejectUserModal, setRejectUserModal] = useState<UserProfile | null>(null);
  const [rejectionFeedback, setRejectionFeedback] = useState('');
  const [rejectWithdrawModal, setRejectWithdrawModal] = useState<WithdrawRecord | null>(null);
  const [withdrawRejectReason, setWithdrawRejectReason] = useState('');
  const [resetUserPassModal, setResetUserPassModal] = useState<UserProfile | null>(null);
  const [newPassInput, setNewPassInput] = useState('Nahida123');
  const [passResetSuccessToast, setPassResetSuccessToast] = useState(false);

  // Count pending items
  const pendingApprovalsCount = users.filter((u) => u.paymentStatus === 'pending').length;
  const pendingWithdrawalsCount = withdrawals.filter((w) => w.status === 'pending').length;

  // Filtered users for approvals tab
  const approvalUsers = users.filter((u) => {
    if (approvalSubFilter === 'pending') return u.paymentStatus === 'pending';
    if (approvalSubFilter === 'approved') return u.paymentStatus === 'approved';
    return u.paymentStatus === 'rejected';
  });

  // Filtered users for general user search tab
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      u.name.toLowerCase().includes(q) ||
      u.phone.includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.rollNumber.toLowerCase().includes(q)
    );
  });

  // Action: Approve Subscription
  const handleApproveUser = (user: UserProfile) => {
    const now = new Date();
    const days = user.subscriptionDays || (user.subscriptionPlanId === 'plan_30' ? 30 : user.subscriptionPlanId === 'plan_7' ? 7 : 1);
    const expiry = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    const updated: UserProfile = {
      ...user,
      paymentStatus: 'approved',
      approvalDate: now.toISOString(),
      expiryDate: expiry.toISOString(),
      subscriptionDays: days,
      rejectionReason: undefined,
    };

    onUpdateUser(updated);

    // If candidate used a referral code, award ৳100 to the referrer!
    if (user.referredBy) {
      const referrer = users.find((u) => u.referralCode === user.referredBy);
      if (referrer) {
        onUpdateUser({
          ...referrer,
          walletBalance: referrer.walletBalance + 100,
        });
      }
    }
  };

  // Action: Reject Subscription
  const handleConfirmRejectUser = () => {
    if (!rejectUserModal) return;
    const updated: UserProfile = {
      ...rejectUserModal,
      paymentStatus: 'rejected',
      rejectionReason: rejectionFeedback.trim() || 'পেমেন্ট ভেরিফিকেশন মেলেনি (TrxID অকার্যকর)',
    };
    onUpdateUser(updated);
    setRejectUserModal(null);
    setRejectionFeedback('');
  };

  // Action: Restrict / Unrestrict user
  const handleToggleRestriction = (user: UserProfile) => {
    const updated: UserProfile = {
      ...user,
      isRestricted: !user.isRestricted,
    };
    onUpdateUser(updated);
  };

  // Action: Reset User Password by Admin
  const handleConfirmResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetUserPassModal || !newPassInput.trim()) return;

    onUpdateUser({
      ...resetUserPassModal,
      password: newPassInput.trim(),
    });

    setPassResetSuccessToast(true);
    setResetUserPassModal(null);
    setTimeout(() => setPassResetSuccessToast(false), 3500);
  };

  // Action: Approve Withdrawal
  const handleApproveWithdrawal = (rec: WithdrawRecord) => {
    const updated: WithdrawRecord = {
      ...rec,
      status: 'approved',
    };
    onUpdateWithdrawal(updated);
  };

  // Action: Reject Withdrawal
  const handleConfirmRejectWithdrawal = () => {
    if (!rejectWithdrawModal) return;
    const updated: WithdrawRecord = {
      ...rejectWithdrawModal,
      status: 'rejected',
      adminFeedback: withdrawRejectReason.trim() || 'NID তথ্যের সাথে অ্যাকাউন্টের অমিল পাওয়া গেছে।',
    };
    onUpdateWithdrawal(updated);

    // Restore wallet balance if rejected
    const candidate = users.find((u) => u.id === rejectWithdrawModal.userId || u.phone === rejectWithdrawModal.userPhone);
    if (candidate) {
      onUpdateUser({
        ...candidate,
        walletBalance: candidate.walletBalance + rejectWithdrawModal.amount,
      });
    }

    setRejectWithdrawModal(null);
    setWithdrawRejectReason('');
  };

  // Helper: Format subscription remaining time
  const formatRemainingTime = (expiryStr?: string) => {
    if (!expiryStr) return 'নির্ধারিত নয়';
    const expiry = new Date(expiryStr).getTime();
    const now = Date.now();
    const diff = expiry - now;

    if (diff <= 0) {
      return 'মেয়াদোত্তীর্ণ (Expired)';
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days} দিন ${hours} ঘণ্টা বাকি`;
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col selection:bg-rose-500 selection:text-white">
      {/* Top Admin Navbar */}
      <header className="bg-[#0A2540] text-white px-4 sm:px-8 py-3.5 sticky top-0 z-30 shadow-md border-b-2 border-amber-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center text-sm shadow-sm">
              AD
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white">
                  IELTS DIBO • কেন্দ্রীয় অ্যাডমিন প্যানেল
                </h1>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Super Admin
                </span>
              </div>
              <span className="text-[11px] text-sky-200 block font-medium">
                Master Security & Candidate Operations Management
              </span>
            </div>
          </div>

          {/* Admin Logout */}
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold text-sky-100 transition-colors cursor-pointer border border-white/20"
          >
            <LogOut className="w-3.5 h-3.5 text-amber-300" />
            <span>লগআউট</span>
          </button>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="max-w-7xl mx-auto w-full px-3 sm:px-8 py-6 flex-1 space-y-5">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setActiveTab('approvals')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'approvals'
                ? 'bg-[#0A2540] text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>সাবস্ক্রিপশন ও পেমেন্ট অনুমোদন</span>
            {pendingApprovalsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-rose-500 text-white animate-pulse">
                {pendingApprovalsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'users'
                ? 'bg-[#0A2540] text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4 text-sky-400" />
            <span>শিক্ষার্থী ও একাউন্ট রেস্ট্রিকশন ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'withdrawals'
                ? 'bg-[#0A2540] text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Wallet className="w-4 h-4 text-emerald-400" />
            <span>রেফারেল উইথড্র ও NID যাচাই</span>
            {pendingWithdrawalsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-rose-500 text-white">
                {pendingWithdrawalsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('support')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'support'
                ? 'bg-[#0A2540] text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-purple-400" />
            <span>সাপোর্ট ডেস্ক ({tickets.length})</span>
          </button>
        </div>

        {/* TAB 1: SUBSCRIPTION APPROVALS */}
        {activeTab === 'approvals' && (
          <div className="space-y-4">
            {/* Sub Filter: Pending / Approved / Rejected */}
            <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => setApprovalSubFilter('pending')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                    approvalSubFilter === 'pending'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  অপেক্ষমান (Pending) - {users.filter((u) => u.paymentStatus === 'pending').length}
                </button>

                <button
                  onClick={() => setApprovalSubFilter('approved')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                    approvalSubFilter === 'approved'
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  অনুমোদিত (Approved) - {users.filter((u) => u.paymentStatus === 'approved').length}
                </button>

                <button
                  onClick={() => setApprovalSubFilter('rejected')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                    approvalSubFilter === 'rejected'
                      ? 'bg-rose-100 text-rose-900 border border-rose-300'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  বাতিলকৃত (Rejected) - {users.filter((u) => u.paymentStatus === 'rejected').length}
                </button>
              </div>

              <span className="text-[11px] text-slate-400 hidden sm:inline">
                সরাসরি কল করে কনফার্ম করতে নম্বরে চাপুন
              </span>
            </div>

            {/* List */}
            {approvalUsers.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-400 text-sm">
                এই ক্যাটাগরিতে কোনো সাবস্ক্রিপশন আবেদন নেই।
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {approvalUsers.map((applicant) => (
                  <div
                    key={applicant.id || applicant.rollNumber}
                    className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3.5 hover:border-slate-300 transition-all"
                  >
                    {/* Top Row: Name, Roll, Status */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-[#0A2540] text-base">{applicant.name}</h3>
                          <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded-md font-bold text-slate-600">
                            {applicant.rollNumber}
                          </span>
                        </div>
                        <span className="text-xs text-sky-800 font-semibold block mt-0.5">
                          প্ল্যান: {applicant.subscriptionPlanTitle} (৳{applicant.subscriptionPlanId === 'plan_30' ? '499' : '149'})
                        </span>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          applicant.paymentStatus === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : applicant.paymentStatus === 'rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800 animate-pulse'
                        }`}
                      >
                        {applicant.paymentStatus === 'approved'
                          ? 'অনুমোদিত'
                          : applicant.paymentStatus === 'rejected'
                          ? 'বাতিলকৃত'
                          : 'অপেক্ষমান'}
                      </span>
                    </div>

                    {/* Contact details for Call & Email verification per user mandate */}
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">মোবাইল নম্বর (কল করুন):</span>
                        <a
                          href={`tel:${applicant.phone}`}
                          className="font-mono font-bold text-emerald-700 hover:underline flex items-center gap-1"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{applicant.phone}</span>
                        </a>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">জিমেইল এড্রেস:</span>
                        <a
                          href={`mailto:${applicant.email}`}
                          className="font-medium text-sky-700 hover:underline flex items-center gap-1 truncate max-w-[200px]"
                        >
                          <Mail className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{applicant.email}</span>
                        </a>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                        <span className="text-slate-500 font-medium">পেমেন্ট মেথড ও TrxID:</span>
                        <span className="font-mono font-bold text-[#0A2540]">
                          {applicant.paymentMethod || 'bKash'} • {applicant.transactionId || 'N/A'}
                        </span>
                      </div>

                      {applicant.senderNumber && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-medium">প্রেরকের নম্বর:</span>
                          <span className="font-mono font-bold text-slate-700">{applicant.senderNumber}</span>
                        </div>
                      )}
                    </div>

                    {/* Feedback if rejected */}
                    {applicant.paymentStatus === 'rejected' && applicant.rejectionReason && (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 space-y-0.5">
                        <span className="font-bold block text-rose-950">অ্যাডমিন বাতিলের কারণ (Admin Only):</span>
                        <p>{applicant.rejectionReason}</p>
                      </div>
                    )}

                    {/* Expiry countdown if approved */}
                    {applicant.paymentStatus === 'approved' && applicant.expiryDate && (
                      <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
                        <span className="font-medium">সাবস্ক্রিপশন মেয়াদ:</span>
                        <span className="font-bold font-mono">{formatRemainingTime(applicant.expiryDate)}</span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {applicant.paymentStatus === 'pending' && (
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => handleApproveUser(applicant)}
                          className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>অনুমোদন করুন (Approve)</span>
                        </button>

                        <button
                          onClick={() => setRejectUserModal(applicant)}
                          className="py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                          <span>বাতিল করুন</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: USER MANAGEMENT & RESTRICTIONS */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-3">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="শিক্ষার্থীর নাম, মোবাইল নম্বর বা জিমেইল দিয়ে সহজে খুঁজুন..."
                className="w-full bg-transparent text-sm focus:outline-none text-slate-800 placeholder:text-slate-400 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  ক্লিয়ার
                </button>
              )}
            </div>

            {/* Users Table / Grid */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
                <span>শিক্ষার্থী তালিকা ({filteredUsers.length})</span>
                <span>স্ট্যাটাস ও অ্যাকশন</span>
              </div>

              <div className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <div
                    key={u.id || u.rollNumber}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-[#0A2540] text-sm sm:text-base">{u.name}</span>
                        <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-semibold">
                          {u.rollNumber}
                        </span>
                        {u.isRestricted && (
                          <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            🚫 অ্যাকাউন্ট রেস্ট্রিক্টেড
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                        <span className="font-mono font-bold text-slate-700">{u.phone}</span>
                        <span>•</span>
                        <span>{u.email}</span>
                        <span>•</span>
                        <span className="text-amber-700 font-bold">টার্গেট: {u.targetScore}</span>
                      </div>

                      <div className="text-xs pt-1 flex items-center gap-4 text-slate-600">
                        <span>
                          সাবস্ক্রিপশন মেয়াদ:{' '}
                          <strong className="text-slate-900 font-mono">
                            {formatRemainingTime(u.expiryDate)}
                          </strong>
                        </span>
                        <span>•</span>
                        <span>
                          সম্পন্ন মক: <strong>{u.examsCompleted} টি</strong>
                        </span>
                      </div>
                    </div>

                    {/* Action buttons: Reset Password & Restrict */}
                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <button
                        onClick={() => {
                          setResetUserPassModal(u);
                          setNewPassInput(u.email?.toLowerCase().trim() === 'nahida09819@gmail.com' ? 'Nahida123' : (u.password || 'Nahida123'));
                        }}
                        className="px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 shadow-xs"
                        title="পাসওয়ার্ড পরিবর্তন বা রিসেট করুন"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                        <span>পাসওয়ার্ড রিসেট</span>
                      </button>

                      <button
                        onClick={() => handleToggleRestriction(u)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                          u.isRestricted
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {u.isRestricted ? (
                          <>
                            <Unlock className="w-3.5 h-3.5" />
                            <span>রেস্ট্রিকশন তুলুন</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            <span>অ্যাকাউন্ট রেস্ট্রিক্ট করুন</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: WITHDRAWALS & NID VERIFICATION */}
        {activeTab === 'withdrawals' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span className="font-bold text-slate-800">
                  উত্তোলন রিকোয়েস্ট ও এনআইডি ডকুমেন্ট ভেরিফিকেশন ডেস্ক
                </span>
              </div>
              <span className="text-slate-400 font-mono font-bold">
                মোট আবেদন: {withdrawals.length} টি
              </span>
            </div>

            {withdrawals.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-400 text-sm">
                এখনও কোনো উত্তোলন আবেদন জমা পড়েনি।
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {withdrawals.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3.5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xl font-black text-amber-600 font-mono">৳{req.amount}</span>
                        <span className="text-xs text-slate-500 font-bold ml-1.5">
                          ({req.method})
                        </span>
                        <div className="text-xs text-slate-700 font-bold mt-0.5">
                          {req.userName || 'শিক্ষার্থী'}
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          req.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : req.status === 'rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800 animate-pulse'
                        }`}
                      >
                        {req.status === 'approved'
                          ? 'পেইড / সম্পন্ন'
                          : req.status === 'rejected'
                          ? 'বাতিল'
                          : 'যাচাইাধীন'}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-500">পেমেন্ট নম্বর:</span>
                        <span className="font-mono font-bold text-slate-900">{req.accountNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">রিকোয়েস্ট তারিখ:</span>
                        <span className="font-medium text-slate-700">{req.requestDate}</span>
                      </div>
                    </div>

                    {/* NID Card Inspection per user mandate */}
                    <div className="p-3 bg-sky-50/60 border border-sky-200 rounded-2xl text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sky-900 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-sky-700" />
                          <span>আপলোডকৃত এনআইডি কার্ড:</span>
                        </span>

                        {req.nidImageUrl ? (
                          <button
                            onClick={() => setSelectedNidImage(req.nidImageUrl!)}
                            className="px-2.5 py-1 bg-sky-700 hover:bg-sky-800 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            <span>বড় করে দেখুন</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-rose-600 font-bold">ছবি পাওয়া যায়নি</span>
                        )}
                      </div>

                      {req.nidImageUrl && (
                        <div
                          onClick={() => setSelectedNidImage(req.nidImageUrl!)}
                          className="w-full h-28 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 cursor-pointer relative group"
                        >
                          <img
                            src={req.nidImageUrl}
                            alt="NID Document"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs gap-1">
                            <Eye className="w-4 h-4" /> ক্লিক করে পূর্ণ সাইজ দেখুন
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action buttons if pending */}
                    {req.status === 'pending' && (
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => handleApproveWithdrawal(req)}
                          className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>টাকা পাঠান ও অনুমোদন করুন</span>
                        </button>

                        <button
                          onClick={() => setRejectWithdrawModal(req)}
                          className="py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                          <span>বাতিল</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SUPPORT DESK */}
        {activeTab === 'support' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-extrabold text-sm text-[#0A2540]">
                ক্যান্ডিডেট সাপোর্ট টিকিট তালিকা ({tickets.length})
              </h3>

              {tickets.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">কোনো সাপোর্ট টিকিট নেই।</p>
              ) : (
                <div className="space-y-3">
                  {tickets.map((t) => (
                    <div key={t.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm">{t.subject}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">
                          {t.status === 'open' ? 'ওপেন' : 'সলভড'}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{t.message}</p>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span>ক্যান্ডিডেট: {t.userName || 'Unknown'} ({t.userPhone || 'No phone'})</span>
                        <span>{t.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: Full Size NID Image Viewer */}
      <AnimatePresence>
        {selectedNidImage && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-4 max-w-xl w-full max-h-[90vh] flex flex-col space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-bold text-sm text-[#0A2540] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>জাতীয় পরিচয়পত্র (NID Document Preview)</span>
                </span>
                <button
                  onClick={() => setSelectedNidImage(null)}
                  className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-auto rounded-2xl bg-slate-950 flex items-center justify-center p-2">
                <img
                  src={selectedNidImage}
                  alt="NID Full"
                  className="max-w-full max-h-[70vh] object-contain rounded-xl"
                />
              </div>

              <button
                onClick={() => setSelectedNidImage(null)}
                className="w-full py-2.5 bg-[#0A2540] text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Reject User Reason */}
      <AnimatePresence>
        {rejectUserModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-5 max-w-md w-full space-y-3.5 shadow-xl"
            >
              <h3 className="text-sm font-bold text-rose-700 flex items-center gap-1.5">
                <XCircle className="w-4 h-4" />
                <span>সাবস্ক্রিপশন আবেদন বাতিলের কারণ লিখুন</span>
              </h3>

              <p className="text-xs text-slate-600">
                {rejectUserModal.name} এর TrxID: {rejectUserModal.transactionId} যাচাই করা যায়নি? কারণটি উল্লেখ করুন (শুধুমাত্র অ্যাডমিন দেখতে পাবে):
              </p>

              <textarea
                rows={3}
                value={rejectionFeedback}
                onChange={(e) => setRejectionFeedback(e.target.value)}
                placeholder="যেমন: bKash স্টেটমেন্টে উল্লেখিত TrxID টি পাওয়া যায়নি বা প্রেরকের নম্বর ভুল..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
              ></textarea>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleConfirmRejectUser}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                >
                  বাতিল নিশ্চিত করুন
                </button>
                <button
                  onClick={() => setRejectUserModal(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  ফিরে যান
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Reject Withdrawal Reason */}
      <AnimatePresence>
        {rejectWithdrawModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-5 max-w-md w-full space-y-3.5 shadow-xl"
            >
              <h3 className="text-sm font-bold text-rose-700 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>উইথড্র রিকোয়েস্ট বাতিলের কারণ</span>
              </h3>

              <p className="text-xs text-slate-600">
                ৳{rejectWithdrawModal.amount} তোলার আবেদন বাতিলের কারণ লিখুন:
              </p>

              <textarea
                rows={3}
                value={withdrawRejectReason}
                onChange={(e) => setWithdrawRejectReason(e.target.value)}
                placeholder="যেমন: NID ছবির সাথে ক্যান্ডিডেটের নাম মেলেনি বা ছবি অস্পষ্ট..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
              ></textarea>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleConfirmRejectWithdrawal}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                >
                  বাতিল করুন ও টাকা রিফান্ড দিন
                </button>
                <button
                  onClick={() => setRejectWithdrawModal(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  ফিরে যান
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Reset Student Password */}
      <AnimatePresence>
        {resetUserPassModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl text-slate-800"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      শিক্ষার্থীর পাসওয়ার্ড রিসেট
                    </h3>
                    <p className="text-xs text-slate-500">
                      অ্যাডমিন প্যানেল থেকে পাসওয়ার্ড পরিবর্তন
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setResetUserPassModal(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Student info */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">শিক্ষার্থীর নাম:</span>
                  <span className="font-bold text-slate-800">{resetUserPassModal.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ইমেইল:</span>
                  <span className="font-mono font-bold text-slate-800">{resetUserPassModal.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">স্টুডেন্ট আইডি:</span>
                  <span className="font-mono font-bold text-slate-800">{resetUserPassModal.rollNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">বর্তমান পাসওয়ার্ড:</span>
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                    {resetUserPassModal.password || 'অনির্ধারিত'}
                  </span>
                </div>
              </div>

              <form onSubmit={handleConfirmResetPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    নতুন পাসওয়ার্ড (New Password)
                  </label>
                  <input
                    type="text"
                    value={newPassInput}
                    onChange={(e) => setNewPassInput(e.target.value)}
                    placeholder="যেমন: Nahida123"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[11px] text-slate-500">কুইক পাসওয়ার্ড:</span>
                    <button
                      type="button"
                      onClick={() => setNewPassInput('Nahida123')}
                      className="px-2 py-0.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-mono text-[11px] font-bold rounded cursor-pointer"
                    >
                      Nahida123
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewPassInput('Password123!')}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-[11px] font-medium rounded cursor-pointer"
                    >
                      Password123!
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setResetUserPassModal(null)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm cursor-pointer flex items-center gap-1.5"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>নতুন পাসওয়ার্ড সেভ করুন</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {passResetSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>পাসওয়ার্ড সফলভাবে আপডেট ও সেভ হয়েছে!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
