import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, MessageSquare, Phone, Mail, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { UserProfile, SupportTicket, AppLanguage } from '../types';

interface SupportPageProps {
  user: UserProfile;
  tickets: SupportTicket[];
  lang?: AppLanguage;
  onBack: () => void;
  onSubmitTicket: (ticket: SupportTicket) => void;
}

export const SupportPage: React.FC<SupportPageProps> = ({
  user,
  tickets,
  lang = 'bn',
  onBack,
  onSubmitTicket,
}) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    const newTicket: SupportTicket = {
      id: 'TCK-' + Date.now().toString().slice(-5),
      userName: user.name,
      userPhone: user.phone,
      subject: subject.trim(),
      message: message.trim(),
      date: new Date().toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      status: 'open',
    };

    onSubmitTicket(newTicket);
    setSubject('');
    setMessage('');
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 pb-12">
      {/* Header */}
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
            {lang === 'bn' ? 'হেল্প ও সাপোর্ট সেন্টার' : 'Help & Support Desk'}
          </h1>

          <div className="w-12"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto w-full px-4 pt-4 flex-1 space-y-4">
        {/* Contact Banner */}
        <div className="bg-[#0A2540] text-white p-5 rounded-3xl space-y-3">
          <h3 className="text-base font-bold text-white">
            {lang === 'bn' ? '২৪/৭ অফিসিয়াল ক্যান্ডিডেট সহায়তা' : '24/7 Official Candidate Support'}
          </h3>
          <p className="text-xs text-sky-200 leading-relaxed">
            {lang === 'bn'
              ? 'মক টেস্ট, পেমেন্ট অথবা টেকনিক্যাল যেকোনো প্রয়োজনে সরাসরি আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করুন।'
              : 'Contact our examination team for assistance regarding tests, payments, or technical queries.'}
          </p>
          <div className="flex flex-col gap-2 pt-1 text-xs">
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>হটলাইন: 01700-000000 (সকাল ৯টা - রাত ১১টা)</span>
            </div>
            <div className="flex items-center gap-2 text-sky-200">
              <Mail className="w-4 h-4 text-sky-400" />
              <span>ইমেইল: support@ieltsdibo.com</span>
            </div>
          </div>
        </div>

        {/* Ticket Submit Form */}
        <form onSubmit={handleSubmit} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <h4 className="text-xs font-extrabold text-[#0A2540] uppercase tracking-wider">
            {lang === 'bn' ? 'সাপোর্ট টিকিট পাঠান' : 'Submit a Support Ticket'}
          </h4>

          {isSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs text-emerald-800 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{lang === 'bn' ? 'আপনার টিকিট সফলভাবে জমা হয়েছে। দ্রুত যোগাযোগ করা হবে।' : 'Ticket submitted successfully.'}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {lang === 'bn' ? 'বিষয়' : 'Subject'}
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={lang === 'bn' ? 'যেমন: পেমেন্ট কনফার্মেশন অথবা স্পিকিং অডিও সমস্যা' : 'e.g. Payment inquiry or audio issue'}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {lang === 'bn' ? 'বিস্তারিত বিবরণ' : 'Description'}
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={lang === 'bn' ? 'আপনার সমস্যার বিস্তারিত লিখুন...' : 'Write detailed notes...'}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#FF5A36] hover:bg-[#EA580C] text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border-b-2 border-[#C2410C]"
          >
            <Send className="w-4 h-4" />
            <span>{lang === 'bn' ? 'টিকিট জমা দিন' : 'Send Ticket'}</span>
          </button>
        </form>

        {/* Previous Tickets */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <h4 className="text-xs font-extrabold text-[#0A2540] uppercase tracking-wider">
            {lang === 'bn' ? 'পূর্ববর্তী টিকিটসমূহ' : 'Ticket History'} ({tickets.length})
          </h4>

          {tickets.length === 0 ? (
            <p className="text-xs text-slate-400 py-3 text-center">
              {lang === 'bn' ? 'কোনো টিকিট রেকর্ড পাওয়া যায়নি।' : 'No tickets logged yet.'}
            </p>
          ) : (
            <div className="space-y-2">
              {tickets.map((t) => (
                <div key={t.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{t.subject}</span>
                    <span className="text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full font-bold">
                      {t.status === 'open' ? (lang === 'bn' ? 'চলমান' : 'Open') : (lang === 'bn' ? 'সমাধানকৃত' : 'Resolved')}
                    </span>
                  </div>
                  <p className="text-slate-600 line-clamp-2">{t.message}</p>
                  <span className="text-[10px] text-slate-400 block pt-1">{t.date}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
