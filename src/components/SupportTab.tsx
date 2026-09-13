import React, { useState } from 'react';
import { Headphones, Send, CheckCircle2, MessageSquare, Phone, Mail, HelpCircle, ChevronDown, ShieldCheck } from 'lucide-react';
import { SupportTicket, UserProfile } from '../types';

interface SupportTabProps {
  user: UserProfile;
}

export const SupportTab: React.FC<SupportTabProps> = ({ user }) => {
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: 'TCK-1024',
      subject: 'পেমেন্ট ভেরিফিকেশন ও অনুমোদন',
      message: 'বিকাশ TrxID সাবমিট করেছি, দয়া করে সাবস্ক্রিপশন চালু করে দিন।',
      date: 'আজকে, ১০:৩০ AM',
      status: user.paymentStatus === 'approved' ? 'resolved' : 'open',
    },
  ]);

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [ticketCreated, setTicketCreated] = useState(false);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    const newTicket: SupportTicket = {
      id: 'TCK-' + Math.floor(1000 + Math.random() * 9000),
      subject: subject.trim(),
      message: message.trim(),
      date: 'এইমাত্র',
      status: 'open',
    };

    setTickets([newTicket, ...tickets]);
    setSubject('');
    setMessage('');
    setTicketCreated(true);
    setTimeout(() => setTicketCreated(false), 3000);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Top Banner */}
      <div className="bg-[#0A2540] text-white p-5 rounded-3xl shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[11px] text-amber-300 font-bold uppercase tracking-wider block">
            ২৪ ঘণ্টা সেবা
          </span>
          <h2 className="text-lg font-extrabold text-white">হেল্প ও টিকেটিং সেন্টার</h2>
          <p className="text-xs text-sky-200 mt-0.5">যে কোনো প্রয়োজনে আমাদের বিশেষজ্ঞ দল প্রস্তুত রয়েছে</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-amber-400">
          <Headphones className="w-6 h-6" />
        </div>
      </div>

      {/* Quick Contact Options */}
      <div className="grid grid-cols-2 gap-3">
        <a
          href="tel:01798245890"
          className="p-3.5 bg-white border border-slate-200 rounded-2xl flex items-center gap-2.5 shadow-sm hover:bg-slate-50 transition-colors"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Phone className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-semibold">হটলাইন কল</span>
            <span className="text-xs font-bold text-slate-800">০১৭৯৮-২৪৫৮৯০</span>
          </div>
        </a>

        <a
          href="mailto:support@ieltsdibo.com"
          className="p-3.5 bg-white border border-slate-200 rounded-2xl flex items-center gap-2.5 shadow-sm hover:bg-slate-50 transition-colors"
        >
          <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-semibold">অফিসিয়াল মেইল</span>
            <span className="text-xs font-bold text-slate-800">support@ieltsdibo.com</span>
          </div>
        </a>
      </div>

      {/* Open Ticket Form */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <h3 className="font-extrabold text-sm text-[#0A2540] flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4 text-[#FF5A36]" />
          <span>নতুন সাপোর্ট টিকেট খুলুন (Open Ticket)</span>
        </h3>

        {ticketCreated && (
          <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>টিকেট সফলভাবে জমা নেওয়া হয়েছে! আমাদের টিম শীঘ্রই যোগাযোগ করবে।</span>
          </div>
        )}

        <form onSubmit={handleCreateTicket} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">সমস্যার বিষয় (Subject)</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="যেমন: রেজাল্ট PDF ডাউনলোড সমস্যা"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0A2540] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">বিস্তারিত বার্তা (Message)</label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="আপনার সমস্যাটি বিস্তারিত লিখুন..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0A2540] focus:outline-none"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-[#0A2540] hover:bg-[#133E68] text-white text-xs font-bold shadow transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>টিকেট সাবমিট করুন</span>
          </button>
        </form>
      </div>

      {/* Existing Tickets */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider">আপনার টিকেটসমূহ</h4>
        <div className="space-y-2">
          {tickets.map((t) => (
            <div key={t.id} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{t.subject}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    t.status === 'resolved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {t.status === 'resolved' ? 'সমাধান হয়েছে' : 'খোলা আছে'}
                </span>
              </div>
              <p className="text-slate-600 text-[11px]">{t.message}</p>
              <span className="text-[10px] text-slate-400 block pt-1">{t.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
