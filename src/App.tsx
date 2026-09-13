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

// Fresh Start: Dedicated Student Account with active 499 Subscription Plan
const FRESH_STUDENT_USER: UserProfile = {
  id: 'USR-7001',
  name: 'Jobaerul Alam',
  email: 'jobaerulalam2026@gmail.com',
  phone: '01712345678',
  password: 'Password123!',
  targetScore: '7.5',
  weakness: 'writing',
  subscriptionPlanId: 'plan_30days',
  subscriptionPlanTitle: '৩০ দিনের মাস্টার প্ল্যান (৪৯৯ টাকা)',
  subscriptionDays: 30,
  paymentStatus: 'approved',
  approvalDate: new Date().toISOString(),
  expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  paymentMethod: 'bKash',
  transactionId: 'DIBO499TRX',
  senderNumber: '01712345678',
  rollNumber: 'ID-2026-7001',
  referralCode: 'DIBO7001',
  walletBalance: 0,
  totalExamsQuota: 300,
  examsCompleted: 0,
  isRestricted: false,
  moduleScores: {},
};

// Clean, unpolluted data arrays: no old test records, no mock tickets, no mock withdrawals
const INITIAL_USERS: UserProfile[] = [FRESH_STUDENT_USER];
const INITIAL_EXAMS: ExamRecord[] = [];
const INITIAL_WITHDRAWALS: WithdrawRecord[] = [];
const INITIAL_TICKETS: SupportTicket[] = [];

// Clean legacy keys if any exist in the browser
try {
  ['ielts_dao_step', 'ielts_dao_users', 'ielts_dao_current_user', 'ielts_dao_exams', 'ielts_dao_withdrawals', 'ielts_dao_tickets'].forEach(
    (k) => localStorage.removeItem(k)
  );
} catch (e) {}

export default function App() {
  const [currentStep, setCurrentStep] = useState<ScreenStep>(() => {
    const saved = localStorage.getItem('ielts_dibo_v2_step');
    return (saved as ScreenStep) || 'landing';
  });

  const [lang, setLang] = useState<AppLanguage>('bn');

  // Multi-user Database
  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('ielts_dibo_v2_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_USERS;
  });

  // Current active user
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('ielts_dibo_v2_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return FRESH_STUDENT_USER;
  });

  // Exams of current user
  const [exams, setExams] = useState<ExamRecord[]>(() => {
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
    setExams((prev) => [record, ...prev]);

    // Record module score to unlock big bold score & retake button
    const updatedModuleScores = {
      ...(currentUser.moduleScores || {}),
      [record.examType]: record.overallBand,
    };

    handleUpdateCurrentUser({
      examsCompleted: currentUser.examsCompleted + 1,
      moduleScores: updatedModuleScores,
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
          formData={{
            name: currentUser.name,
            email: currentUser.email,
            phone: currentUser.phone,
            password: currentUser.password || 'Password123!',
            confirmPassword: currentUser.password || 'Password123!',
            referralCode: currentUser.referredBy || '',
          }}
          existingUsers={users}
          lang={lang}
          onUpdateFormData={(data) => {
            handleUpdateCurrentUser(data);
          }}
          onBack={() => setCurrentStep('weakness')}
          onNext={() => {
            // Register or update user in database
            const newUser: UserProfile = {
              ...currentUser,
              id: 'USR-' + Math.floor(1000 + Math.random() * 9000),
              rollNumber: 'ID-2026-' + Math.floor(1000 + Math.random() * 9000),
              referralCode: 'IELTS' + Math.floor(1000 + Math.random() * 9000),
              paymentStatus: 'pending',
              walletBalance: 0,
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
              handleUpdateCurrentUser({
                subscriptionPlanId: plan.id,
                subscriptionPlanTitle: `${plan.durationText} (${plan.price} টাকা)`,
                subscriptionDays: days,
                totalExamsQuota: plan.totalTests,
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
            handleUpdateCurrentUser({
              paymentStatus: 'pending',
              paymentMethod: paymentData.method,
              transactionId: paymentData.transactionId,
              senderNumber: paymentData.senderNumber,
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
