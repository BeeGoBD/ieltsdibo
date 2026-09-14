import React, { useState, useEffect } from 'react';
import {
  ScreenStep,
  UserProfile,
  ExamRecord,
  WithdrawRecord,
  SupportTicket,
  AppLanguage,
  PageView,
} from './types';
import { LandingScreen } from './components/LandingScreen';
import { LoginScreen } from './components/LoginScreen';
import { TargetScoreScreen } from './components/TargetScoreScreen';
import { WeaknessScreen } from './components/WeaknessScreen';
import { SignupScreen } from './components/SignupScreen';
import { PricingScreen, PLANS } from './components/PricingScreen';
import { PaymentScreen } from './components/PaymentScreen';
import { Dashboard } from './components/Dashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { ReferralPage } from './components/ReferralPage';
import { WithdrawPage } from './components/WithdrawPage';
import { SupportPage } from './components/SupportPage';
import { TranscriptViewPage } from './components/TranscriptViewPage';
import { BandGuidePage } from './components/BandGuidePage';
import { ExamPageView } from './components/ExamPageView';
import { SpeakingExamPageView } from './components/SpeakingExamPageView';
import { FullMockExamView } from './components/FullMockExamView';

// Default Blank Student for New Registration
const createBlankStudent = (): UserProfile => ({
  id: '',
  name: '',
  email: '',
  phone: '',
  password: '',
  targetScore: '7.5',
  weakness: 'writing',
  subscriptionPlanId: 'plan_30days',
  subscriptionPlanTitle: '৩০ দিনের মাস্টার প্ল্যান (৪৯৯ টাকা)',
  subscriptionDays: 30,
  paymentStatus: 'pending',
  rollNumber: '',
  referralCode: '',
  walletBalance: 0,
  totalExamsQuota: 300,
  availableSessions: 10,
  dailySessionsQuota: 10,
  examsCompleted: 0,
  isRestricted: false,
  moduleScores: {},
});

// Seeded verified student account: Nahida (email: nahida09819@gmail.com, pass: Nahida123)
export const createNahidaStudent = (): UserProfile => ({
  id: 'USR-9819',
  name: 'Nahida',
  email: 'nahida09819@gmail.com',
  phone: '01890009819',
  password: 'Nahida123',
  targetScore: '7.5',
  weakness: 'speaking',
  subscriptionPlanId: 'plan_30days',
  subscriptionPlanTitle: '৩০ দিনের মাস্টার প্ল্যান (৪৯৯ টাকা)',
  subscriptionDays: 30,
  paymentStatus: 'approved',
  rollNumber: 'DIBO-2026-9819',
  referralCode: 'NAHIDA9819',
  walletBalance: 0,
  totalExamsQuota: 300,
  availableSessions: 10,
  dailySessionsQuota: 10,
  examsCompleted: 0,
  isRestricted: false,
  approvalDate: new Date().toISOString(),
  expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  moduleScores: {},
});

// Initial users array ensuring Nahida's account exists with Nahida123 password
const INITIAL_USERS: UserProfile[] = [createNahidaStudent()];
const INITIAL_EXAMS: ExamRecord[] = [];
const INITIAL_WITHDRAWALS: WithdrawRecord[] = [];
const INITIAL_TICKETS: SupportTicket[] = [];

// Clean legacy and ensure Nahida's account has password Nahida123
try {
  ['ielts_dao_step', 'ielts_dao_users', 'ielts_dao_current_user', 'ielts_dao_exams', 'ielts_dao_withdrawals', 'ielts_dao_tickets'].forEach(
    (k) => localStorage.removeItem(k)
  );
  // Clear old mock user USR-7001
  const currentUserRaw = localStorage.getItem('ielts_dibo_v2_current_user');
  if (currentUserRaw && currentUserRaw.includes('USR-7001')) {
    localStorage.removeItem('ielts_dibo_v2_current_user');
  }

  // Ensure nahida09819@gmail.com is present with Nahida123
  const usersRaw = localStorage.getItem('ielts_dibo_v2_users');
  let usersList: UserProfile[] = usersRaw ? JSON.parse(usersRaw) : [];
  if (!Array.isArray(usersList)) usersList = [];

  const nahidaIndex = usersList.findIndex(
    (u) => u.email?.toLowerCase().trim() === 'nahida09819@gmail.com'
  );
  if (nahidaIndex >= 0) {
    usersList[nahidaIndex].password = 'Nahida123';
  } else {
    usersList.unshift(createNahidaStudent());
  }
  localStorage.setItem('ielts_dibo_v2_users', JSON.stringify(usersList));

  // If current active user in storage is Nahida, update password
  if (currentUserRaw) {
    try {
      const cur = JSON.parse(currentUserRaw);
      if (cur?.email?.toLowerCase().trim() === 'nahida09819@gmail.com') {
        cur.password = 'Nahida123';
        localStorage.setItem('ielts_dibo_v2_current_user', JSON.stringify(cur));
      }
    } catch (e) {}
  }
} catch (e) {}

export default function App() {
  const [currentStep, setCurrentStep] = useState<ScreenStep>(() => {
    const saved = localStorage.getItem('ielts_dibo_v2_step');
    return (saved as ScreenStep) || 'landing';
  });

  const [lang, setLang] = useState<AppLanguage>('bn');

  // Registration draft (NO AUTOFILL - completely clean inputs)
  const [signupDraft, setSignupDraft] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
  });

  // Multi-user Database
  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('ielts_dibo_v2_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter((u: any) => u.id !== 'USR-7001');
          const nahidaIdx = filtered.findIndex(
            (u) => u.email?.toLowerCase().trim() === 'nahida09819@gmail.com'
          );
          if (nahidaIdx >= 0) {
            filtered[nahidaIdx].password = 'Nahida123';
            return filtered;
          } else {
            return [createNahidaStudent(), ...filtered];
          }
        }
      } catch (e) {}
    }
    return INITIAL_USERS;
  });

  // Current active user
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('ielts_dibo_v2_current_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id !== 'USR-7001') {
          if (parsed.email?.toLowerCase().trim() === 'nahida09819@gmail.com') {
            parsed.password = 'Nahida123';
          }
          return parsed;
        }
      } catch (e) {}
    }
    return createBlankStudent();
  });

  // Permanent unified exam history of current user (never cleared by reset)
  const [exams, setExams] = useState<ExamRecord[]>(() => {
    const savedPerm = localStorage.getItem('ielts_dibo_v2_permanent_history');
    if (savedPerm) {
      try {
        return JSON.parse(savedPerm);
      } catch (e) {}
    }
    const saved = localStorage.getItem('ielts_dibo_v2_exams');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_EXAMS;
  });

  // Withdrawals Database
  const [withdrawals, setWithdrawals] = useState<WithdrawRecord[]>(() => {
    const saved = localStorage.getItem('ielts_dibo_v2_withdrawals');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_WITHDRAWALS;
  });

  // Support Tickets
  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('ielts_dibo_v2_tickets');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_TICKETS;
  });

  // Detailed exam currently selected for TRF / Certificate view
  const [selectedExamForTRF, setSelectedExamForTRF] = useState<ExamRecord | null>(null);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('ielts_dibo_v2_step', currentStep);
  }, [currentStep]);

  useEffect(() => {
    localStorage.setItem('ielts_dibo_v2_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('ielts_dibo_v2_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('ielts_dibo_v2_exams', JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem('ielts_dibo_v2_withdrawals', JSON.stringify(withdrawals));
  }, [withdrawals]);

  useEffect(() => {
    localStorage.setItem('ielts_dibo_v2_tickets', JSON.stringify(tickets));
  }, [tickets]);

  // Handler: Update current user & sync to users list
  const handleUpdateCurrentUser = (updatedData: Partial<UserProfile>) => {
    const updated: UserProfile = { ...currentUser, ...updatedData };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id || u.phone === updated.phone ? updated : u)));
  };

  // Handler: Update any user by Admin
  const handleAdminUpdateUser = (updatedUser: UserProfile) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    if (currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  // Handler: Reset Student Password
  const handleResetStudentPassword = (emailOrPhone: string, newPass: string): boolean => {
    const cleanId = emailOrPhone.trim().toLowerCase();
    const cleanPass = newPass.trim();
    if (!cleanId || !cleanPass) return false;

    let updated = false;
    setUsers((prev) => {
      const exists = prev.some(
        (u) =>
          u.email?.toLowerCase().trim() === cleanId ||
          u.phone?.trim() === cleanId ||
          u.phone?.trim().replace(/\D/g, '') === cleanId.replace(/\D/g, '') ||
          u.rollNumber?.toLowerCase() === cleanId
      );
      if (exists) {
        updated = true;
        return prev.map((u) => {
          if (
            u.email?.toLowerCase().trim() === cleanId ||
            u.phone?.trim() === cleanId ||
            u.phone?.trim().replace(/\D/g, '') === cleanId.replace(/\D/g, '') ||
            u.rollNumber?.toLowerCase() === cleanId
          ) {
            return { ...u, password: cleanPass };
          }
          return u;
        });
      } else {
        updated = true;
        const newStudent = createNahidaStudent();
        if (cleanId.includes('@')) {
          newStudent.email = cleanId;
        }
        newStudent.password = cleanPass;
        return [newStudent, ...prev];
      }
    });

    if (
      currentUser.email?.toLowerCase().trim() === cleanId ||
      currentUser.phone?.trim() === cleanId
    ) {
      setCurrentUser((prev) => ({ ...prev, password: cleanPass }));
    }

    return updated;
  };

  // Handler: Update withdrawal record by Admin
  const handleAdminUpdateWithdrawal = (updatedRecord: WithdrawRecord) => {
    setWithdrawals((prev) => prev.map((w) => (w.id === updatedRecord.id ? updatedRecord : w)));
  };

  // Handler: Add new withdrawal request from candidate
  const handleUserRequestWithdraw = (req: WithdrawRecord) => {
    setWithdrawals((prev) => [req, ...prev]);
    handleUpdateCurrentUser({
      walletBalance: Math.max(0, currentUser.walletBalance - req.amount),
    });
  };

  // Handler: Add new support ticket
  const handleAddSupportTicket = (ticket: SupportTicket) => {
    setTickets((prev) => [ticket, ...prev]);
  };

  // Handler: Exam completed
  const handleExamComplete = (record: ExamRecord) => {
    const newRecord: ExamRecord = {
      ...record,
      id: record.id || `exam_${Date.now()}`,
      date: record.date || new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: record.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = [newRecord, ...exams];
    setExams(updated);
    localStorage.setItem('ielts_dibo_v2_exams', JSON.stringify(updated));
    localStorage.setItem('ielts_dibo_v2_permanent_history', JSON.stringify(updated));

    // Record module score to unlock big bold score & retake button
    const updatedModuleScores = {
      ...(currentUser.moduleScores || {}),
      [record.examType]: record.overallBand,
    };

    handleUpdateCurrentUser({
      moduleScores: updatedModuleScores,
    });
  };

  // Handler: Reset Exams & Scores (Candidate can reset module progress)
  // Per requirement: 9 taka plan is NOT applicable for reset.
  // Other plans deduct 1 session and preserve permanent exam history.
  const handleResetExams = () => {
    if (currentUser.subscriptionPlanId === 'plan_1day' || currentUser.subscriptionPlanTitle?.includes('৯')) {
      alert(lang === 'bn' ? '৯ টাকার সাবস্ক্রিপশনে এক্সাম রিসেট প্রযোজ্য নয়।' : 'Exam reset is not available on the 9 Taka plan.');
      return;
    }

    if ((currentUser.availableSessions || 0) <= 0) {
      alert(lang === 'bn' ? 'আপনার কোনো অবশিষ্ট সেশন নেই। রিসেট করা সম্ভব নয়।' : 'No sessions available. Cannot reset exam.');
      return;
    }

    handleUpdateCurrentUser({
      availableSessions: Math.max(0, (currentUser.availableSessions || 1) - 1),
      moduleScores: {},
    });
  };

  // Handler: Navigate to Dedicated Full Page
  const handleNavigateToPage = (page: PageView, extraData?: any) => {
    if (page === 'transcript_view') {
      if (extraData) {
        setSelectedExamForTRF(extraData);
      } else if (exams.length > 0) {
        setSelectedExamForTRF(exams[0]);
      }
    }
    setCurrentStep(page as ScreenStep);
  };

  // Handler: Reset App / Sign out
  const handleResetApp = () => {
    setCurrentStep('landing');
  };

  // Switcher
  switch (currentStep) {
    // 1. Landing Screen
    case 'landing':
      return (
        <LandingScreen
          onStart={() => setCurrentStep('target_score')}
          onLogin={() => setCurrentStep('login')}
        />
      );

    // 2. Login Screen (with hidden Admin Special Key)
    case 'login':
      return (
        <LoginScreen
          lang={lang}
          registeredUsers={users}
          onUserLogin={(authenticatedUser) => {
            setCurrentUser(authenticatedUser);
            setCurrentStep('dashboard');
          }}
          onAdminLogin={() => {
            setCurrentStep('admin');
          }}
          onResetPassword={handleResetStudentPassword}
          onBack={() => setCurrentStep('landing')}
          onGoToSignup={() => setCurrentStep('signup')}
        />
      );

    // 3. Admin Portal (Dedicated full page for Super Admin)
    case 'admin':
      return (
        <AdminDashboard
          users={users}
          withdrawals={withdrawals}
          tickets={tickets}
          lang={lang}
          onUpdateUser={handleAdminUpdateUser}
          onUpdateWithdrawal={handleAdminUpdateWithdrawal}
          onLogout={() => setCurrentStep('landing')}
        />
      );

    // 4. Target Score
    case 'target_score':
      return (
        <TargetScoreScreen
          selectedScore={currentUser.targetScore}
          onSelectScore={(score) => handleUpdateCurrentUser({ targetScore: score })}
          onBack={() => setCurrentStep('landing')}
          onNext={() => setCurrentStep('weakness')}
        />
      );

    // 5. Weakness Selection
    case 'weakness':
      return (
        <WeaknessScreen
          selectedWeakness={currentUser.weakness}
          onSelectWeakness={(weakness) => handleUpdateCurrentUser({ weakness })}
          onBack={() => setCurrentStep('target_score')}
          onNext={() => setCurrentStep('signup')}
        />
      );

    // 6. Signup Screen (Strict Gmail, 11-digit phone, password complexity, unique user check)
    case 'signup':
      return (
        <SignupScreen
          formData={signupDraft}
          existingUsers={users}
          lang={lang}
          onUpdateFormData={(data) => {
            setSignupDraft((prev) => ({ ...prev, ...data }));
          }}
          onBack={() => setCurrentStep('weakness')}
          onNext={() => {
            // Register or update user in database with strict unique credentials
            const emailNorm = signupDraft.email.trim().toLowerCase();
            const phoneNorm = signupDraft.phone.trim();
            const existing = users.find(
              (u) => u.email.toLowerCase() === emailNorm || u.phone === phoneNorm
            );
            if (existing) {
              alert(
                lang === 'bn'
                  ? 'এই জিমেইল অথবা ফোন নম্বর দিয়ে ইতিপূর্বে একাউন্ট খোলা হয়েছে। অনুগ্রহ করে লগইন করুন।'
                  : 'An account already exists with this Gmail or phone number. Please log in.'
              );
              setCurrentStep('login');
              return;
            }

            const newUser: UserProfile = {
              id: 'USR-' + Math.floor(1000 + Math.random() * 9000),
              name: signupDraft.name.trim(),
              email: emailNorm,
              phone: phoneNorm,
              password: signupDraft.password.trim(),
              targetScore: currentUser.targetScore || '7.5',
              weakness: currentUser.weakness || 'writing',
              subscriptionPlanId: 'plan_30days',
              subscriptionPlanTitle: '৩০ দিনের মাস্টার প্ল্যান (৪৯৯ টাকা)',
              subscriptionDays: 30,
              paymentStatus: 'pending',
              rollNumber: 'ID-2026-' + Math.floor(1000 + Math.random() * 9000),
              referralCode: 'IELTS' + Math.floor(1000 + Math.random() * 9000),
              referredBy: signupDraft.referralCode.trim(),
              walletBalance: 0,
              totalExamsQuota: 300,
              availableSessions: 10,
              dailySessionsQuota: 10,
              examsCompleted: 0,
              isRestricted: false,
              moduleScores: {},
            };
            setUsers((prev) => [newUser, ...prev]);
            setCurrentUser(newUser);
            setCurrentStep('pricing');
          }}
          onGoToLogin={() => setCurrentStep('login')}
        />
      );

    // 7. Pricing Screen
    case 'pricing':
      return (
        <PricingScreen
          selectedPlanId={currentUser.subscriptionPlanId}
          onSelectPlan={(planId) => {
            const plan = PLANS.find((p) => p.id === planId);
            if (plan) {
              const days = plan.id === 'plan_30days' ? 30 : plan.id === 'plan_7days' ? 7 : plan.id === 'plan_3days' ? 3 : 1;
              const sessions = plan.id === 'plan_30days' ? 10 : plan.id === 'plan_7days' ? 5 : plan.id === 'plan_3days' ? 3 : 1;
              handleUpdateCurrentUser({
                subscriptionPlanId: plan.id,
                subscriptionPlanTitle: `${plan.durationText} (${plan.price} টাকা)`,
                subscriptionDays: days,
                totalExamsQuota: plan.totalTests,
                availableSessions: sessions,
                dailySessionsQuota: sessions,
              });
            }
          }}
          onBack={() => setCurrentStep('signup')}
          onNext={() => setCurrentStep('payment')}
        />
      );

    // 8. Payment Screen
    case 'payment':
      const chosenPlan = PLANS.find((p) => p.id === currentUser.subscriptionPlanId) || PLANS[2];
      return (
        <PaymentScreen
          selectedPlan={chosenPlan}
          onPaymentSubmit={(paymentData) => {
            const sessions = chosenPlan.id === 'plan_30days' ? 10 : chosenPlan.id === 'plan_7days' ? 5 : chosenPlan.id === 'plan_3days' ? 3 : 1;
            const days = chosenPlan.id === 'plan_30days' ? 30 : chosenPlan.id === 'plan_7days' ? 7 : chosenPlan.id === 'plan_3days' ? 3 : 1;

            handleUpdateCurrentUser({
              paymentStatus: 'approved',
              approvalDate: new Date().toISOString(),
              expiryDate: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString(),
              paymentMethod: paymentData.method,
              transactionId: paymentData.transactionId,
              senderNumber: paymentData.senderNumber,
              availableSessions: sessions,
              dailySessionsQuota: sessions,
            });
            setCurrentStep('dashboard');
          }}
          onBack={() => setCurrentStep('pricing')}
        />
      );

    // 9. Student Dashboard
    case 'dashboard':
      return (
        <Dashboard
          user={currentUser}
          exams={exams}
          withdrawHistory={withdrawals}
          tickets={tickets}
          lang={lang}
          onUpdateUser={handleUpdateCurrentUser}
          onAddExamRecord={handleExamComplete}
          onNavigateToPage={handleNavigateToPage}
          onResetExams={handleResetExams}
          onToggleLanguage={() => setLang((prev) => (prev === 'bn' ? 'en' : 'bn'))}
          onResetApp={handleResetApp}
        />
      );

    // 10. DEDICATED FULL PAGE: Refer & Earn
    case 'referral':
      return (
        <ReferralPage
          user={currentUser}
          withdrawHistory={withdrawals}
          lang={lang}
          onBack={() => setCurrentStep('dashboard')}
          onGoToWithdraw={() => setCurrentStep('withdraw')}
        />
      );

    // 11. DEDICATED FULL PAGE: Withdraw Money (with mandatory NID upload)
    case 'withdraw':
      return (
        <WithdrawPage
          user={currentUser}
          withdrawHistory={withdrawals}
          lang={lang}
          onBack={() => setCurrentStep('dashboard')}
          onRequestWithdraw={handleUserRequestWithdraw}
        />
      );

    // 12. DEDICATED FULL PAGE: Support & Helpline Desk
    case 'support':
      return (
        <SupportPage
          user={currentUser}
          existingTickets={tickets}
          lang={lang}
          onBack={() => setCurrentStep('dashboard')}
          onSubmitTicket={handleAddSupportTicket}
        />
      );

    // 13. DEDICATED FULL PAGE: Official Cambridge TRF & PDF Certificate
    case 'transcript_view':
      return (
        <TranscriptViewPage
          exam={selectedExamForTRF || exams[0]}
          user={currentUser}
          lang={lang}
          onBack={() => setCurrentStep('dashboard')}
        />
      );

    // 14. DEDICATED FULL PAGE: Cambridge Band Descriptors Guide
    case 'band_guide':
      return (
        <BandGuidePage
          lang={lang}
          onBack={() => setCurrentStep('dashboard')}
        />
      );

    // 15. DEDICATED FULL PAGE: IELTS Reading Exam
    case 'reading_exam':
      return (
        <ExamPageView
          moduleType="reading"
          user={currentUser}
          lang={lang}
          onBack={() => setCurrentStep('dashboard')}
          onExamComplete={handleExamComplete}
          onViewFullReport={(rec) => {
            setSelectedExamForTRF(rec);
            setCurrentStep('transcript_view');
          }}
        />
      );

    // 16. DEDICATED FULL PAGE: IELTS Writing Exam
    case 'writing_exam':
      return (
        <ExamPageView
          moduleType="writing"
          user={currentUser}
          lang={lang}
          onBack={() => setCurrentStep('dashboard')}
          onExamComplete={handleExamComplete}
          onViewFullReport={(rec) => {
            setSelectedExamForTRF(rec);
            setCurrentStep('transcript_view');
          }}
        />
      );

    // 17. DEDICATED FULL PAGE: IELTS Listening Exam
    case 'listening_exam':
      return (
        <ExamPageView
          moduleType="listening"
          user={currentUser}
          lang={lang}
          onBack={() => setCurrentStep('dashboard')}
          onExamComplete={handleExamComplete}
          onViewFullReport={(rec) => {
            setSelectedExamForTRF(rec);
            setCurrentStep('transcript_view');
          }}
        />
      );

    // 18. DEDICATED FULL PAGE: IELTS Speaking Exam (Cambridge Examiner Dr. Alistair Finch)
    case 'speaking_exam':
      return (
        <SpeakingExamPageView
          user={currentUser}
          lang={lang}
          onBack={() => setCurrentStep('dashboard')}
          onExamComplete={handleExamComplete}
        />
      );

    // 19. DEDICATED FULL PAGE: IELTS Complete 3-Hour Mock Test
    case 'full_mock_exam':
      return (
        <FullMockExamView
          user={currentUser}
          lang={lang}
          onBack={() => setCurrentStep('dashboard')}
          onExamComplete={handleExamComplete}
          onViewFullReport={(rec) => {
            setSelectedExamForTRF(rec);
            setCurrentStep('transcript_view');
          }}
        />
      );

    default:
      return (
        <LandingScreen
          onStart={() => setCurrentStep('target_score')}
          onLogin={() => setCurrentStep('login')}
        />
      );
  }
}
