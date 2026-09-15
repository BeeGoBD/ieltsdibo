export type ScreenStep = 
  | 'landing'
  | 'login'
  | 'target_score'
  | 'weakness'
  | 'signup'
  | 'pricing'
  | 'payment'
  | 'dashboard'
  | 'admin'
  | PageView;

export type DashboardTab = 'exam_center' | 'old_exams' | 'tongue_twister' | 'english_game' | 'account';

export type PageView = 
  | 'dashboard'
  | 'reading_exam'
  | 'writing_exam'
  | 'listening_exam'
  | 'speaking_exam'
  | 'full_mock_exam'
  | 'referral'
  | 'withdraw'
  | 'support'
  | 'band_guide'
  | 'transcript_view';

export type AppLanguage = 'bn' | 'en';

export type SkillCategory = 'listening' | 'reading' | 'writing' | 'speaking';

export interface TongueTwisterItem {
  id: string;
  level: 'easy' | 'medium' | 'hard' | 'extreme';
  levelLabelBn: string;
  levelLabelEn: string;
  text: string;
  phoneticFocus: string;
  focusExplanationBn: string;
  focusExplanationEn: string;
  targetWpm: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  targetScore: string;
  weakness: string;
  subscriptionPlanId: string;
  subscriptionPlanTitle: string;
  paymentStatus: 'pending' | 'approved' | 'rejected' | 'trial';
  isTrial?: boolean;
  trialStartedAt?: string;
  rejectionReason?: string;
  approvalDate?: string;
  expiryDate?: string;
  subscriptionDays?: number;
  isRestricted?: boolean;
  paymentMethod?: 'bKash' | 'Nagad' | 'Rocket';
  transactionId?: string;
  senderNumber?: string;
  rollNumber: string;
  referralCode: string;
  referredBy?: string;
  walletBalance: number; // in BDT
  totalExamsQuota: number;
  availableSessions: number; // Active sessions available for exams
  dailySessionsQuota?: number; // e.g. 10 sessions/day for 499 plan
  examsCompleted: number;
  registeredAt?: string;
  moduleScores?: {
    reading?: number;
    writing?: number;
    listening?: number;
    speaking?: number;
  };
}

export interface SubscriptionPlan {
  id: string;
  durationText: string;
  price: number;
  testsCountText: string;
  dailyQuota: number;
  totalTests: number;
  days?: number;
  isPopular?: boolean;
  features: string[];
}

export interface ExamRecord {
  id: string;
  serialNumber: number;
  examTitle: string;
  examType: SkillCategory | 'full_mock';
  date: string;
  time: string;
  overallBand: number;
  listeningBand: number;
  readingBand: number;
  writingBand: number;
  speakingBand: number;
  status: 'completed' | 'not_given';
}

export interface WithdrawRecord {
  id: string;
  userId?: string;
  userName?: string;
  userPhone?: string;
  amount: number;
  method: 'bKash' | 'Nagad' | 'Rocket';
  accountNumber: string;
  nidImageUrl?: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  adminFeedback?: string;
}

export interface SupportTicket {
  id: string;
  userId?: string;
  userName?: string;
  userPhone?: string;
  subject: string;
  message: string;
  date: string;
  status: 'open' | 'resolved';
}
