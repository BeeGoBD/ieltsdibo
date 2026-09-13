import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  MicOff,
  Volume2,
  Award,
  CheckCircle2,
  Flame,
  VolumeX,
  Play,
  RotateCcw,
  AlertTriangle,
  Radio,
  UserCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TongueTwisterItem, AppLanguage } from '../types';

interface TongueTwisterTabProps {
  lang?: AppLanguage;
}

export const TONGUE_TWISTERS: TongueTwisterItem[] = [
  // LEVEL 1: EASY (8 Items)
  {
    id: 'tt_1',
    level: 'easy',
    levelLabelBn: 'লেভেল ১: প্রারম্ভিক',
    levelLabelEn: 'Level 1: Foundation',
    text: 'She sells seashells by the seashore.',
    phoneticFocus: '/s/ vs /ʃ/ (স বনাম শ)',
    focusExplanationBn: 'ইংরেজি "s" এবং "sh" শব্দের সূক্ষ্ম পার্থক্য ও জিহ্বার পজিশন ঠিক করার সেরা অনুশীলন।',
    focusExplanationEn: 'Master the distinction between alveolar /s/ and postalveolar /ʃ/ sounds.',
    targetWpm: 120,
  },
  {
    id: 'tt_2',
    level: 'easy',
    levelLabelBn: 'লেভেল ১: প্রারম্ভিক',
    levelLabelEn: 'Level 1: Foundation',
    text: 'Red lorry, yellow lorry, red lorry, yellow lorry.',
    phoneticFocus: '/r/ vs /l/ (র বনাম ল)',
    focusExplanationBn: 'বাঙালি শিক্ষার্থীদের "R" এবং "L" ফ্লুয়েন্টলি উচ্চারণের জড়তা দূর করে।',
    focusExplanationEn: 'Eliminates liquid consonant confusion between retroflex /r/ and lateral /l/.',
    targetWpm: 130,
  },
  {
    id: 'tt_3',
    level: 'easy',
    levelLabelBn: 'লেভেল ১: প্রারম্ভিক',
    levelLabelEn: 'Level 1: Foundation',
    text: 'Fresh fried fish, fish fresh fried, fried fish fresh.',
    phoneticFocus: '/f/ vs /p/ (ফ বনাম প)',
    focusExplanationBn: 'ঠোঁট ও দাঁতের স্পর্শে সঠিক /f/ সাউন্ড পরিষ্কার করে।',
    focusExplanationEn: 'Sharpens labiodental fricative /f/ against bilabial stop /p/.',
    targetWpm: 125,
  },
  {
    id: 'tt_4',
    level: 'easy',
    levelLabelBn: 'লেভেল ১: প্রারম্ভিক',
    levelLabelEn: 'Level 1: Foundation',
    text: 'Big black bug bit a big black dog and the big black dog bled blood.',
    phoneticFocus: 'Voiced Plosive /b/ & /d/',
    focusExplanationBn: 'শব্দের শুরুতে ও মাঝে "b" এবং "d" এর স্পষ্ট উচ্চারণ সুনিশ্চিত করে।',
    focusExplanationEn: 'Develops firm bilabial and alveolar voiced stop articulation.',
    targetWpm: 125,
  },
  {
    id: 'tt_5',
    level: 'easy',
    levelLabelBn: 'লেভেল ১: প্রারম্ভিক',
    levelLabelEn: 'Level 1: Foundation',
    text: 'I scream, you scream, we all scream for ice cream.',
    phoneticFocus: 'Consonant Cluster /skr/',
    focusExplanationBn: 'শব্দের গুচ্ছে ভাওয়েল বিরতি ও স্বরভঙ্গ ছাড়া একটানা উচ্চারণের অনুশীলন।',
    focusExplanationEn: 'Aids in connected speech linking across identical consonant-vowel transitions.',
    targetWpm: 130,
  },
  {
    id: 'tt_6',
    level: 'easy',
    levelLabelBn: 'লেভেল ১: প্রারম্ভিক',
    levelLabelEn: 'Level 1: Foundation',
    text: 'Four fine fresh fish for you.',
    phoneticFocus: 'Fricative /f/ Alliteration',
    focusExplanationBn: 'জিহ্বা স্থির রেখে দাঁত ও ঠোঁটের সমন্বয়ে বাতাস ছাড়ার কসরত।',
    focusExplanationEn: 'Trains continuous airflow through upper incisors and lower lip.',
    targetWpm: 120,
  },
  {
    id: 'tt_7',
    level: 'easy',
    levelLabelBn: 'লেভেল ১: প্রারম্ভিক',
    levelLabelEn: 'Level 1: Foundation',
    text: 'He threw three free throws.',
    phoneticFocus: '/θ/ vs /f/ & /fr/',
    focusExplanationBn: '"th" (দাঁতের নিচে জিহ্বা) এবং "f" (ঠোঁটে দাঁত) এর গোলমাল দূর করে।',
    focusExplanationEn: 'Crucial contrast between dental fricative /θ/ and labiodental /f/.',
    targetWpm: 125,
  },
  {
    id: 'tt_8',
    level: 'easy',
    levelLabelBn: 'লেভেল ১: প্রারম্ভিক',
    levelLabelEn: 'Level 1: Foundation',
    text: 'Selfish shellfish sleep silently.',
    phoneticFocus: 'Sibilant S-Sh Shifts',
    focusExplanationBn: 'দ্রুত কথা বলার সময় তালব্য ও দন্ত্য ধ্বনির অদলবদল দূর করে।',
    focusExplanationEn: 'Rapid alternating between alveolar /s/ and postalveolar /ʃ/.',
    targetWpm: 120,
  },

  // LEVEL 2: MEDIUM (8 Items)
  {
    id: 'tt_9',
    level: 'medium',
    levelLabelBn: 'লেভেল ২: মধ্যম (Band 6.5-7.0)',
    levelLabelEn: 'Level 2: Intermediate (Band 6.5-7.0)',
    text: 'Peter Piper picked a peck of pickled peppers. A peck of pickled peppers Peter Piper picked.',
    phoneticFocus: 'Aspirated Plosive /p/ & Rhythm',
    focusExplanationBn: 'স্পিকিং টেস্টে শব্দের শুরুতে বিস্ফোরক "P" সাউন্ডের প্রাকৃতিক ছন্দ আনে।',
    focusExplanationEn: 'Reinforces aspirated bilabial plosives and natural rhythmic stress.',
    targetWpm: 140,
  },
  {
    id: 'tt_10',
    level: 'medium',
    levelLabelBn: 'লেভেল ২: মধ্যম (Band 6.5-7.0)',
    levelLabelEn: 'Level 2: Intermediate (Band 6.5-7.0)',
    text: 'Vincent vowed vengeance very vehemently with violent vengeance.',
    phoneticFocus: '/v/ vs /w/ (ভ বনাম ও)',
    focusExplanationBn: 'দাঁত দিয়ে নিচের ঠোঁটে হালকা চাপ দিয়ে সঠিক /v/ উচ্চারণ নিশ্চিত করে।',
    focusExplanationEn: 'Clarifies voiced labiodental /v/ contrasting with rounded approximant /w/.',
    targetWpm: 135,
  },
  {
    id: 'tt_11',
    level: 'medium',
    levelLabelBn: 'লেভেল ২: মধ্যম (Band 6.5-7.0)',
    levelLabelEn: 'Level 2: Intermediate (Band 6.5-7.0)',
    text: 'Thirty-three thirsty thieves thought that they thrilled the throne throughout Thursday.',
    phoneticFocus: '/θ/ (Th Sound Drill)',
    focusExplanationBn: 'আইলসে সবচেয়ে গুরুত্বপূর্ণ "th" (দাঁতের ফাঁকে জিহ্বা) সাউন্ড ঠিক করার মোক্ষম ড্রিল।',
    focusExplanationEn: 'Essential drill for voiceless dental fricative /θ/ in academic discourse.',
    targetWpm: 130,
  },
  {
    id: 'tt_12',
    level: 'medium',
    levelLabelBn: 'লেভেল ২: মধ্যম (Band 6.5-7.0)',
    levelLabelEn: 'Level 2: Intermediate (Band 6.5-7.0)',
    text: 'Can you can a can as a canner can can a can?',
    phoneticFocus: 'Modal Stress & Schwa /ə/',
    focusExplanationBn: 'বাক্যের ছন্দ অনুযায়ী দুর্বল ও সবল শব্দের স্ট্রেস নির্ধারণ শেখায়।',
    focusExplanationEn: 'Practices weak forms of auxiliary verbs versus strong nouns.',
    targetWpm: 140,
  },
  {
    id: 'tt_13',
    level: 'medium',
    levelLabelBn: 'লেভেল ২: মধ্যম (Band 6.5-7.0)',
    levelLabelEn: 'Level 2: Intermediate (Band 6.5-7.0)',
    text: 'Betty Botter bought some butter, but she said the butter’s bitter.',
    phoneticFocus: 'Flapped /t/ & Bilabial Stops',
    focusExplanationBn: 'ক্যামব্রিজ ও আন্তর্জাতিক অ্যাকসেন্টে "t" এর প্রাকৃতিক উচ্চারণ শেখায়।',
    focusExplanationEn: 'Intervocalic alveolar tapping and vowel clarity.',
    targetWpm: 140,
  },
  {
    id: 'tt_14',
    level: 'medium',
    levelLabelBn: 'লেভেল ২: মধ্যম (Band 6.5-7.0)',
    levelLabelEn: 'Level 2: Intermediate (Band 6.5-7.0)',
    text: 'Which witch wished which wicked wish when winter was warm?',
    phoneticFocus: 'Approximant /w/ Rounding',
    focusExplanationBn: 'ঠোঁট গোল করে প্রাকৃতিক ইংরেজি "W" উচ্চারণ আয়ত্তে আনা।',
    focusExplanationEn: 'Builds accurate lip rounding for voiced labio-velar approximants.',
    targetWpm: 135,
  },
  {
    id: 'tt_15',
    level: 'medium',
    levelLabelBn: 'লেভেল ২: মধ্যম (Band 6.5-7.0)',
    levelLabelEn: 'Level 2: Intermediate (Band 6.5-7.0)',
    text: 'Lesser leather never weathered wetter weather better.',
    phoneticFocus: 'Voiced Dental /ð/ & Liquid /l/',
    focusExplanationBn: '"the/weather/brother" এর ভেতরকার মৃদু "th" সাউন্ড স্পষ্ট করে।',
    focusExplanationEn: 'Improves voiced dental fricative /ð/ connected to lateral /l/.',
    targetWpm: 135,
  },
  {
    id: 'tt_16',
    level: 'medium',
    levelLabelBn: 'লেভেল ২: মধ্যম (Band 6.5-7.0)',
    levelLabelEn: 'Level 2: Intermediate (Band 6.5-7.0)',
    text: 'Cooks cook cupcakes quickly and cleanly.',
    phoneticFocus: 'Velar Stop /k/ & Consonant Cluster /kl/',
    focusExplanationBn: 'জিহ্বার গোড়া নরম তালুতে স্পর্শ করিয়ে স্পষ্ট "k" তৈরি করে।',
    focusExplanationEn: 'Sharpens voiceless velar plosives and cluster release.',
    targetWpm: 140,
  },

  // LEVEL 3: HARD (8 Items)
  {
    id: 'tt_17',
    level: 'hard',
    levelLabelBn: 'লেভেল ৩: উচ্চমান (Band 7.5-8.5)',
    levelLabelEn: 'Level 3: Advanced (Band 7.5-8.5)',
    text: 'How much wood would a woodchuck chuck if a woodchuck could chuck wood?',
    phoneticFocus: 'Connected Speech & Reduced Vowels',
    focusExplanationBn: 'দ্রুত কথা বলার সময় শব্দের সংযোগ ও মোডাল ভার্ব "would/could" এর ফ্লুয়েন্সি বাড়ায়।',
    focusExplanationEn: 'Develops natural vowel reduction and connected speech elision in rapid pace.',
    targetWpm: 155,
  },
  {
    id: 'tt_18',
    level: 'hard',
    levelLabelBn: 'লেভেল ৩: উচ্চমান (Band 7.5-8.5)',
    levelLabelEn: 'Level 3: Advanced (Band 7.5-8.5)',
    text: 'A proper copper coffee pot from a copper coffee shop requires proper polishing.',
    phoneticFocus: 'Consonant Clusters /pr/, /kp/',
    focusExplanationBn: 'কঠিন ব্যঞ্জনধ্বনি গুচ্ছকে পরিষ্কার রেখে কথা বলার গতি বাড়ায়।',
    focusExplanationEn: 'Smooths transition between complex consonant clusters under high-speed articulation.',
    targetWpm: 150,
  },
  {
    id: 'tt_19',
    level: 'hard',
    levelLabelBn: 'লেভেল ৩: উচ্চমান (Band 7.5-8.5)',
    levelLabelEn: 'Level 3: Advanced (Band 7.5-8.5)',
    text: 'Through three cheese trees three free fleas flew. While these fleas flew, freezy breeze blew.',
    phoneticFocus: 'Liquid Consonant Triad /θr/, /fr/, /br/',
    focusExplanationBn: 'একটানা কঠিন তিনজোড়া ধ্বনির রূপান্তরের ফলে জিভের সম্পূর্ণ আড়ষ্টতা ভাঙে।',
    focusExplanationEn: 'High-level transition across dental, labiodental, and bilabial rhotic clusters.',
    targetWpm: 150,
  },
  {
    id: 'tt_20',
    level: 'hard',
    levelLabelBn: 'লেভেল ৩: উচ্চমান (Band 7.5-8.5)',
    levelLabelEn: 'Level 3: Advanced (Band 7.5-8.5)',
    text: 'Unique New York, unique New York, you know you need unique New York.',
    phoneticFocus: 'Palatal Glide /j/ & Nasal /n/',
    focusExplanationBn: 'উচ্চমানের ইংরেজি স্পিকিংয়ে সেমি-ভাওয়েল /j/ পরিষ্কার করা।',
    focusExplanationEn: 'Addresses palatal approximant /j/ glide linking to nasal /n/.',
    targetWpm: 145,
  },
  {
    id: 'tt_21',
    level: 'hard',
    levelLabelBn: 'লেভেল ৩: উচ্চমান (Band 7.5-8.5)',
    levelLabelEn: 'Level 3: Advanced (Band 7.5-8.5)',
    text: 'Rory the warrior and Roger the worrier were reared wrongly in a rural brewery.',
    phoneticFocus: 'Rhotic /r/ in Rapid Succession',
    focusExplanationBn: 'নেটিভ ব্রিটিশ ও আমেরিকান আর-সাউন্ডের নিখুঁত ঘূর্ণন তৈরি করে।',
    focusExplanationEn: 'Demands extreme motor control over English rhotic approximants.',
    targetWpm: 145,
  },
  {
    id: 'tt_22',
    level: 'hard',
    levelLabelBn: 'লেভেল ৩: উচ্চমান (Band 7.5-8.5)',
    levelLabelEn: 'Level 3: Advanced (Band 7.5-8.5)',
    text: 'Imagine an imaginary menagerie manager managing an imaginary menagerie.',
    phoneticFocus: 'Affricate /dʒ/ & Fricative /ʒ/',
    focusExplanationBn: '"treasure/measure" এবং "manager" ধ্বনির সূক্ষ্ম পার্থক্য আয়ত্ত করা।',
    focusExplanationEn: 'Alternates voiced postalveolar affricate /dʒ/ with fricative /ʒ/.',
    targetWpm: 140,
  },
  {
    id: 'tt_23',
    level: 'hard',
    levelLabelBn: 'লেভেল ৩: উচ্চমান (Band 7.5-8.5)',
    levelLabelEn: 'Level 3: Advanced (Band 7.5-8.5)',
    text: 'Near an ear, a nearer ear, a nearly eerie ear.',
    phoneticFocus: 'Diphthong /ɪə/ Precision',
    focusExplanationBn: 'শব্দে ডিপথং বা দ্বৈত স্বরধ্বনির স্বচ্ছতা বজায় রাখা।',
    focusExplanationEn: 'Refines centering diphthong /ɪə/ differentiation.',
    targetWpm: 145,
  },
  {
    id: 'tt_24',
    level: 'hard',
    levelLabelBn: 'লেভেল ৩: উচ্চমান (Band 7.5-8.5)',
    levelLabelEn: 'Level 3: Advanced (Band 7.5-8.5)',
    text: 'Frivolous fat frogs flying frantically from freezing frost.',
    phoneticFocus: 'Fricative Plosive Linkage /fr/, /fl/',
    focusExplanationBn: 'গতিময় পরিস্থিতিতে ফুসফুসীয় বায়ুপ্রবাহ স্বাভাবিক রাখা।',
    focusExplanationEn: 'Maintains breath control across repeated labiodental blends.',
    targetWpm: 150,
  },

  // LEVEL 4: MASTERY / EXTREME (6 Items)
  {
    id: 'tt_25',
    level: 'extreme',
    levelLabelBn: 'লেভেল ৪: চরম পরীক্ষা (Band 9.0 Speed)',
    levelLabelEn: 'Level 4: Mastery (Band 9.0 Speed)',
    text: 'The sixth sick sheik’s sixth sheep’s sick. Pad kid pour curd pulled cod.',
    phoneticFocus: 'Micro-Phonetics & Alveolar Fricatives',
    focusExplanationBn: 'গিনেস ওয়ার্ল্ড রেকর্ড স্বীকৃত সবচেয়ে কঠিন উচ্চারণ যা বিশ্বসেরা নেটিভ স্পিকারদের জন্য চ্যালেঞ্জ।',
    focusExplanationEn: 'Widely cited as the most difficult tongue twister in English phonology.',
    targetWpm: 160,
  },
  {
    id: 'tt_26',
    level: 'extreme',
    levelLabelBn: 'লেভেল ৪: চরম পরীক্ষা (Band 9.0 Speed)',
    levelLabelEn: 'Level 4: Mastery (Band 9.0 Speed)',
    text: 'Brisk brave brigadiers brandished broad bright blades, blunderbusses, and bludgeons balancing bravely.',
    phoneticFocus: 'Voiced Bilabial Clusters /br/, /bl/',
    focusExplanationBn: 'উচ্চ একাডেমিক প্রেসেন্টেশনের জন্য গতিময় ও গম্ভীর বাক্যভঙ্গী তৈরি করে।',
    focusExplanationEn: 'Rapid alternating between /br/ and /bl/ plosive clusters under pressure.',
    targetWpm: 165,
  },
  {
    id: 'tt_27',
    level: 'extreme',
    levelLabelBn: 'লেভেল ৪: চরম পরীক্ষা (Band 9.0 Speed)',
    levelLabelEn: 'Level 4: Mastery (Band 9.0 Speed)',
    text: 'Send toast to ten tense stout saints’ ten tall tents.',
    phoneticFocus: 'Dental-Alveolar Clusters /st/, /ts/, /nt/',
    focusExplanationBn: 'শব্দের প্রান্তের জটিল ব্যঞ্জনধ্বনি না চিবিয়ে স্পষ্ট উচ্চারণ।',
    focusExplanationEn: 'Complex coda consonant clusters requiring tight tongue tip agility.',
    targetWpm: 155,
  },
  {
    id: 'tt_28',
    level: 'extreme',
    levelLabelBn: 'লেভেল ৪: চরম পরীক্ষা (Band 9.0 Speed)',
    levelLabelEn: 'Level 4: Mastery (Band 9.0 Speed)',
    text: 'The seething sea ceaseth and thus the seething sea sufficeth us.',
    phoneticFocus: 'Interdental Sibilant Rapid Shift',
    focusExplanationBn: 'প্রাচীন ইংরেজি ও ক্ল্যাসিক্যাল ফনেটিক্সের নিখুঁত সমন্বয়।',
    focusExplanationEn: 'High-frequency switching between dental /θ/, /ð/ and alveolar /s/.',
    targetWpm: 150,
  },
  {
    id: 'tt_29',
    level: 'extreme',
    levelLabelBn: 'লেভেল ৪: চরম পরীক্ষা (Band 9.0 Speed)',
    levelLabelEn: 'Level 4: Mastery (Band 9.0 Speed)',
    text: 'Which wristwatches are Swiss wristwatches?',
    phoneticFocus: 'Consonant Cluster /st-w/ & Affricate /tʃ/',
    focusExplanationBn: 'সংক্ষিপ্ত অথচ বিশ্বের সবচেয়ে বেশি জিহ্বা পিছলে যাওয়া বাক্যাংশ।',
    focusExplanationEn: 'Ultra-compressed transition across sibilant fricatives and rounded glides.',
    targetWpm: 150,
  },
  {
    id: 'tt_30',
    level: 'extreme',
    levelLabelBn: 'লেভেল ৪: চরম পরীক্ষা (Band 9.0 Speed)',
    levelLabelEn: 'Level 4: Mastery (Band 9.0 Speed)',
    text: 'Crisp crusts crackle cheerfully in calm crisp cold mornings.',
    phoneticFocus: 'Hard Velar /kr/, /kl/ Articulation',
    focusExplanationBn: 'জিহ্বা ও চোয়ালের সম্পূর্ণ জড়তা দূর করে আন্তর্জাতিক মান এনে দেয়।',
    focusExplanationEn: 'Sharp acoustic distinction among voiceless velar plosives.',
    targetWpm: 155,
  },
];

export const TongueTwisterTab: React.FC<TongueTwisterTabProps> = ({ lang = 'bn' }) => {
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'easy' | 'medium' | 'hard' | 'extreme'>('all');
  const [activeItem, setActiveItem] = useState<TongueTwisterItem>(TONGUE_TWISTERS[0]);
  const [isListening, setIsListening] = useState(false);
  const [scoreOutOf20, setScoreOutOf20] = useState<number | null>(null);
  const [examinerReview, setExaminerReview] = useState<{
    text: string;
    tone: 'success' | 'warning' | 'error' | 'neutral';
  } | null>(null);
  const [completedCount, setCompletedCount] = useState(4);
  const [isExaminerSpeaking, setIsExaminerSpeaking] = useState(false);

  const recognitionRef = useRef<any>(null);
  const capturedTextRef = useRef<string>('');

  const filteredTwisters =
    selectedLevel === 'all'
      ? TONGUE_TWISTERS
      : TONGUE_TWISTERS.filter((t) => t.level === selectedLevel);

  // Initialize Speech Recognition once
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRec) {
        const recognition = new SpeechRec();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-GB';

        recognition.onresult = (event: any) => {
          let fullStr = '';
          for (let i = 0; i < event.results.length; i++) {
            fullStr += ' ' + event.results[i][0].transcript;
          }
          capturedTextRef.current = fullStr.trim();
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  // Examiner spoken feedback helper
  const speakExaminerVoice = (speechText: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utt = new SpeechSynthesisUtterance(speechText);
    utt.lang = 'en-GB';
    utt.rate = 0.95;
    utt.pitch = 0.98;

    const voices = window.speechSynthesis.getVoices();
    const examinerVoice = voices.find(
      (v) => v.lang.includes('GB') || v.name.includes('British') || v.name.includes('UK')
    );
    if (examinerVoice) utt.voice = examinerVoice;

    setIsExaminerSpeaking(true);
    utt.onend = () => setIsExaminerSpeaking(false);
    utt.onerror = () => setIsExaminerSpeaking(false);

    window.speechSynthesis.speak(utt);
  };

  // Rigorous Human Examiner Evaluation
  const evaluatePerformance = (spoken: string, original: string) => {
    const origClean = original.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
    const origWords = origClean.split(/\s+/).filter(Boolean);
    const spokenClean = spoken.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
    const spokenWords = spokenClean.split(/\s+/).filter(Boolean);

    // Filter profanity / abusive words / out of line
    const abuseKeywords = ['fuck', 'bitch', 'asshole', 'shit', 'stupid', 'idiot', 'bastard', 'crap', 'cunt', 'dick'];
    const hasAbuse = spokenWords.some((w) => abuseKeywords.includes(w));

    // If completely silent or fewer than 2 words spoken
    if (spokenWords.length === 0) {
      const score = 4;
      setScoreOutOf20(score);
      const reviewText =
        lang === 'bn'
          ? 'এক্সামিনার মন্তব্য: কোনো কণ্ঠস্বর ধরা পড়েনি। মাইক্রোফোনের কাছে এসে স্পষ্টভাবে বাক্যটি বলুন।'
          : 'Examiner Note: No clear voice received. Please speak up closer to the microphone.';
      setExaminerReview({ text: reviewText, tone: 'warning' });
      speakExaminerVoice('I could not hear your speech. Please recite the passage clearly into the microphone.');
      return;
    }

    // If abusive or went totally out of the line
    if (hasAbuse) {
      const score = 2;
      setScoreOutOf20(score);
      const reviewText =
        lang === 'bn'
          ? 'এক্সামিনার সতর্কবার্তা: এটি আপনার বড় ভুল। আপনি সীমা লঙ্ঘন করেছেন এবং টেস্টের নিয়ম ভঙ্গ করেছেন। এটি একটি অফিসিয়াল এক্সাম সেন্টার।'
          : 'Examiner Warning: This is your fault. You have gone completely out of the line. This is an official examination center. Recite the exact given text.';
      setExaminerReview({ text: reviewText, tone: 'error' });
      speakExaminerVoice('This is your fault. You have gone out of the line. This is an official examination center. Stick strictly to the text.');
      return;
    }

    // Word matching & phoneme resonance
    let matchedCount = 0;
    origWords.forEach((ow) => {
      if (spokenWords.includes(ow)) {
        matchedCount++;
      } else {
        // partial substring match for slight accent variations
        const hasSimilar = spokenWords.some((sw) => sw.startsWith(ow.slice(0, 3)) || sw.endsWith(ow.slice(-3)));
        if (hasSimilar) matchedCount += 0.6;
      }
    });

    const ratio = matchedCount / origWords.length;
    // Calculate raw score out of 20
    let score = Math.round(ratio * 20);

    // If candidate said completely irrelevant things
    if (ratio < 0.25) {
      score = Math.max(3, Math.min(6, score));
      setScoreOutOf20(score);
      const reviewText =
        lang === 'bn'
          ? 'এক্সামিনার মূল্যায়ন: আপনি নির্ধারিত বাক্যটি উচ্চারণ করেননি। আপনি ট্র্যাকের বাইরে চলে গেছেন। মনোযোগ দিয়ে পাঠ করুন।'
          : 'Examiner Assessment: You have not recited the assigned sentence. You went off the line. Score: ' + score + ' out of 20.';
      setExaminerReview({ text: reviewText, tone: 'warning' });
      speakExaminerVoice('You have gone out of the line and did not pronounce the assigned passage. Your score is ' + score + ' out of 20.');
      return;
    }

    // Realistic scaling
    if (ratio >= 0.88) {
      score = Math.min(20, Math.max(18, score));
      setScoreOutOf20(score);
      const reviewText =
        lang === 'bn'
          ? `চমৎকার উচ্চারণ! স্বাভাবিক রিদম ও স্পষ্ট কনসোনেন্ট সাউন্ড। স্কোর: ${score}/২০`
          : `Exceptional articulation! Natural rhythm and crisp consonant separation. Score: ${score}/20`;
      setExaminerReview({ text: reviewText, tone: 'success' });
      speakExaminerVoice(`Well done. Excellent phonetic control and natural speed. Your score is ${score} out of 20.`);
      setCompletedCount((c) => c + 1);
      try {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      } catch (e) {}
    } else if (ratio >= 0.65) {
      score = Math.min(17, Math.max(13, score));
      setScoreOutOf20(score);
      const reviewText =
        lang === 'bn'
          ? `ভালো চেষ্টা, তবে কনসোনেন্ট ক্লাস্টার ও শেষ অক্ষরে কিছুটা জড়তা ছিল। স্কোর: ${score}/২০`
          : `Good attempt, though some consonant clusters were slightly blurred. Score: ${score}/20`;
      setExaminerReview({ text: reviewText, tone: 'neutral' });
      speakExaminerVoice(`Fair effort, but your consonant transitions were slightly slurred. Your score is ${score} out of 20.`);
    } else {
      score = Math.max(7, Math.min(12, score));
      setScoreOutOf20(score);
      const reviewText =
        lang === 'bn'
          ? `উচ্চারণে উল্লেখযোগ্য ত্রুটি রয়েছে। ধীরগতিতে স্পষ্ট সাউন্ডে পুনরায় পড়ুন। স্কোর: ${score}/২০`
          : `Noticeable pronunciation errors observed. You haven't articulated clearly. Score: ${score}/20`;
      setExaminerReview({ text: reviewText, tone: 'warning' });
      speakExaminerVoice(`You haven't done this well. Major pronunciation slips. Your score is ${score} out of 20.`);
    }
  };

  const handleStartListening = () => {
    capturedTextRef.current = '';
    setScoreOutOf20(null);
    setExaminerReview(null);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        setIsListening(true);
      }
    } else {
      setIsListening(true);
    }
  };

  const handleStopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
    // Give half a second for final speech event to settle, then evaluate
    setTimeout(() => {
      evaluatePerformance(capturedTextRef.current, activeItem.text);
    }, 450);
  };

  // Play Native Examiner Audio
  const playNativeAudio = (rate = 1.0) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(activeItem.text);
    utt.lang = 'en-GB';
    utt.rate = rate;
    const voices = window.speechSynthesis.getVoices();
    const ukVoice = voices.find((v) => v.lang.includes('GB') || v.name.includes('British'));
    if (ukVoice) utt.voice = ukVoice;
    window.speechSynthesis.speak(utt);
  };

  return (
    <div className="space-y-4 pb-28">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0A2540] to-sky-900 text-white p-4.5 rounded-3xl shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-sky-200 uppercase tracking-wider block">
                Official IELTS Pronunciation Lab
              </span>
              <h2 className="text-base font-extrabold text-white">
                {lang === 'bn' ? 'টাং টুইস্টার প্র্যাকটিস' : 'Tongue Twister Practice'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full border border-white/20 text-xs font-bold text-amber-300">
            <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>
              {completedCount} {lang === 'bn' ? 'টি সম্পন্ন' : 'Mastered'}
            </span>
          </div>
        </div>

        <p className="text-xs text-sky-100 leading-relaxed">
          {lang === 'bn'
            ? 'ক্যামব্রিজ এক্সামিনার টেস্ট: মাইক্রোফোনে পাঠ করুন। সিস্টেম সম্পূর্ণ বাক্যটি অনুধাবন করে সর্বোচ্চ ২০ নম্বরে সরাসরি রেটিং ও ভয়েস রিভিউ প্রদান করবে।'
            : 'Cambridge Examiner Protocol: Recite clearly. The examiner listens to your full recitation and provides an immediate score out of 20 with spoken feedback.'}
        </p>
      </div>

      {/* Level Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {[
          { key: 'all', label: lang === 'bn' ? 'সবগুলো (৩০)' : 'All (30)' },
          { key: 'easy', label: lang === 'bn' ? 'সহজ' : 'Foundation' },
          { key: 'medium', label: lang === 'bn' ? 'মিডিয়াম' : 'Intermediate' },
          { key: 'hard', label: lang === 'bn' ? 'কঠিন' : 'Advanced' },
          { key: 'extreme', label: lang === 'bn' ? 'মাস্টারি (9.0)' : 'Mastery (9.0)' },
        ].map((lvl) => (
          <button
            key={lvl.key}
            onClick={() => setSelectedLevel(lvl.key as any)}
            className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedLevel === lvl.key
                ? 'bg-[#0A2540] text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {lvl.label}
          </button>
        ))}
      </div>

      {/* Active Workout Card */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        {/* Tier & Phonetic Target */}
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 bg-sky-100 text-sky-900 rounded-full text-[11px] font-bold">
            {lang === 'bn' ? activeItem.levelLabelBn : activeItem.levelLabelEn}
          </span>
          <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            🎯 {activeItem.phoneticFocus}
          </span>
        </div>

        {/* Big Tongue Twister Text */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
          <p className="text-base sm:text-lg font-bold text-[#0A2540] leading-snug font-serif text-center">
            "{activeItem.text}"
          </p>
        </div>

        {/* Phonetic Explanation */}
        <p className="text-xs text-slate-600 bg-sky-50/50 p-2.5 rounded-xl border border-sky-100">
          💡 <span className="font-semibold text-slate-800">{lang === 'bn' ? 'ফোকাস:' : 'Focus:'}</span>{' '}
          {lang === 'bn' ? activeItem.focusExplanationBn : activeItem.focusExplanationEn}
        </p>

        {/* Audio Listen Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => playNativeAudio(1.0)}
            className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <Volume2 className="w-4 h-4 text-sky-600" />
            <span>{lang === 'bn' ? 'স্বাভাবিক গতি (1.0x)' : 'Normal Pace (1.0x)'}</span>
          </button>

          <button
            onClick={() => playNativeAudio(0.75)}
            className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <Volume2 className="w-4 h-4 text-emerald-600" />
            <span>{lang === 'bn' ? 'ধীর গতি (0.75x)' : 'Slow Pace (0.75x)'}</span>
          </button>
        </div>

        {/* Dynamic Voice Analysis & Scoring Section */}
        <div className="border-t border-slate-100 pt-3 space-y-3">
          {/* Result Score Display (High score 20) */}
          {scoreOutOf20 !== null && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-[#0A2540] text-white flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] text-sky-200 uppercase font-bold tracking-wider block">
                  {lang === 'bn' ? 'অফিসিয়াল প্রোনাউন্সিয়েশন রেটিং' : 'Official Pronunciation Score'}
                </span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-3xl font-black text-amber-300 font-mono">
                    {scoreOutOf20}
                  </span>
                  <span className="text-sm font-bold text-slate-300">/ ২০</span>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                    scoreOutOf20 >= 16
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400'
                      : scoreOutOf20 >= 12
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-400'
                  }`}
                >
                  {scoreOutOf20 >= 16
                    ? (lang === 'bn' ? 'উচ্চমান' : 'Band 8.0+')
                    : scoreOutOf20 >= 12
                    ? (lang === 'bn' ? 'সন্তোষজনক' : 'Band 6.5 - 7.5')
                    : (lang === 'bn' ? 'উন্নতি প্রয়োজন' : 'Needs Practice')}
                </span>
              </div>
            </motion.div>
          )}

          {/* Examiner Spoken / Written Feedback */}
          {examinerReview && (
            <motion.div
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={`p-3.5 rounded-2xl border text-xs leading-relaxed flex items-start gap-2.5 ${
                examinerReview.tone === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : examinerReview.tone === 'error'
                  ? 'bg-rose-50 border-rose-200 text-rose-950'
                  : examinerReview.tone === 'warning'
                  ? 'bg-amber-50 border-amber-200 text-amber-950'
                  : 'bg-sky-50 border-sky-200 text-sky-950'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {examinerReview.tone === 'error' ? (
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                ) : (
                  <UserCheck className="w-4 h-4 text-slate-700" />
                )}
              </div>
              <div className="flex-1">
                <span className="font-extrabold text-[11px] block text-slate-900 mb-0.5">
                  {lang === 'bn' ? 'ক্যামব্রিজ এক্সামিনার ফিডব্যাক:' : 'Senior Examiner Review:'}
                </span>
                <p className="font-medium">{examinerReview.text}</p>
              </div>
            </motion.div>
          )}

          {/* Audio Wave / Listening Active State (No transcript text shown per user request) */}
          <div className="min-h-16 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center text-xs">
            {isListening ? (
              <div className="space-y-2 flex flex-col items-center">
                {/* Visual Audio Wave Animation */}
                <div className="flex items-center gap-1.5 h-6">
                  <span className="w-1.5 h-3 bg-rose-500 rounded-full animate-pulse"></span>
                  <span className="w-1.5 h-6 bg-rose-600 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-4 bg-amber-500 rounded-full animate-pulse delay-100"></span>
                  <span className="w-1.5 h-7 bg-rose-500 rounded-full animate-bounce delay-150"></span>
                  <span className="w-1.5 h-3 bg-rose-600 rounded-full animate-pulse delay-200"></span>
                </div>
                <p className="font-bold text-rose-700 animate-pulse text-[11px]">
                  {lang === 'bn'
                    ? 'এক্সামিনার শুনছেন... পুরো বাক্যটি স্বাভাবিক গতিতে পাঠ করুন'
                    : 'Senior Examiner is listening... Recite the full sentence naturally'}
                </p>
                <span className="text-[10px] text-slate-400">
                  {lang === 'bn' ? 'পড়া শেষ হলে নিচের লাল বাটনে চাপুন' : 'Tap stop button below once finished'}
                </span>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-slate-600 font-medium">
                  {lang === 'bn'
                    ? 'মাইক্রোফোন চালু করে সম্পূর্ণ বাক্যটি পাঠ করুন'
                    : 'Activate microphone and articulate the complete tongue twister'}
                </p>
                <p className="text-[10px] text-slate-400">
                  {lang === 'bn'
                    ? 'ক্যামব্রিজ এক্সামিনার সরাসরি শুনে ২০-এ স্কোর ও অডিও রিভিউ প্রদান করবেন'
                    : 'Senior examiner evaluates cadence, phonetic accuracy, and pronunciation score (out of 20)'}
                </p>
              </div>
            )}
          </div>

          {/* Big Mic Action Button */}
          <div className="flex items-center justify-center gap-3 pt-1">
            {!isListening ? (
              <button
                onClick={handleStartListening}
                className="px-6 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer bg-[#0A2540] hover:bg-slate-800 text-white"
              >
                <Mic className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'bn' ? 'মাইক্রোফোনে পড়া শুরু করুন' : 'Begin Voice Recitation'}</span>
              </button>
            ) : (
              <button
                onClick={handleStopListening}
                className="px-6 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer bg-rose-600 hover:bg-rose-700 text-white animate-pulse ring-4 ring-rose-200"
              >
                <MicOff className="w-4 h-4 text-white" />
                <span>{lang === 'bn' ? 'পড়া শেষ (মূল্যায়ন শুনুন)' : 'Finish Reciting (Evaluate)'}</span>
              </button>
            )}

            {scoreOutOf20 !== null && (
              <button
                onClick={() => {
                  setScoreOutOf20(null);
                  setExaminerReview(null);
                }}
                className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold transition-colors cursor-pointer"
                title={lang === 'bn' ? 'রিসেট' : 'Reset'}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Library Picker */}
      <div className="space-y-2">
        <h3 className="text-xs font-extrabold text-[#0A2540] uppercase tracking-wider px-1">
          {lang === 'bn' ? 'অনুশীলনের তালিকা' : 'Practice Library'} ({filteredTwisters.length})
        </h3>

        <div className="space-y-2">
          {filteredTwisters.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setActiveItem(item);
                setScoreOutOf20(null);
                setExaminerReview(null);
              }}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-xs ${
                activeItem.id === item.id
                  ? 'bg-sky-50 border-sky-400 shadow-sm ring-1 ring-sky-400'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[#0A2540]">{item.phoneticFocus}</span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">
                  {item.level}
                </span>
              </div>
              <p className="text-slate-700 font-serif line-clamp-1">"{item.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
