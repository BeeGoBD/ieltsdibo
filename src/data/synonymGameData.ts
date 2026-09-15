export interface SynonymChallenge {
  id: string;
  word: string;
  wordBn?: string;
  meaningEn: string;
  meaningBn: string;
  synonym: string; // The correct matching synonym
  distractors: string[]; // Wrong options (antonyms or misleading words)
  level: 'easy' | 'medium' | 'hard' | 'ielts_master';
}

export const SYNONYM_CHALLENGES: SynonymChallenge[] = [
  // EASY LEVEL / FOUNDATIONAL
  {
    id: 'syn_01',
    word: 'GOOD',
    meaningEn: 'Having qualities of a high standard',
    meaningBn: 'ভালো বা চমৎকার গুণসম্পন্ন',
    synonym: 'EXCELLENT',
    distractors: ['TERRIBLE', 'CARELESS', 'HOSTILE'],
    level: 'easy',
  },
  {
    id: 'syn_02',
    word: 'BIG',
    meaningEn: 'Of considerable size or extent',
    meaningBn: 'আকারে বিশাল বা বড়',
    synonym: 'MASSIVE',
    distractors: ['TINY', 'SLIGHT', 'FRAGILE'],
    level: 'easy',
  },
  {
    id: 'syn_03',
    word: 'FAST',
    meaningEn: 'Moving or capable of moving at high speed',
    meaningBn: 'দ্রুত গতিসম্পন্ন',
    synonym: 'SWIFT',
    distractors: ['SLUGGISH', 'CLUMSY', 'DELAYED'],
    level: 'easy',
  },
  {
    id: 'syn_04',
    word: 'HAPPY',
    meaningEn: 'Feeling or showing pleasure or contentment',
    meaningBn: 'আনন্দিত বা উৎফুল্ল',
    synonym: 'JOYFUL',
    distractors: ['GLOOMY', 'BITTER', 'ANXIOUS'],
    level: 'easy',
  },
  {
    id: 'syn_05',
    word: 'SMART',
    meaningEn: 'Having or showing a quick-witted intelligence',
    meaningBn: 'বুদ্ধিমান বা চটপটে',
    synonym: 'INTELLIGENT',
    distractors: ['FOOLISH', 'BLUNT', 'DULL'],
    level: 'easy',
  },
  {
    id: 'syn_06',
    word: 'CALM',
    meaningEn: 'Not showing or feeling nervousness or anger',
    meaningBn: 'শান্ত বা স্থির',
    synonym: 'SERENE',
    distractors: ['FURIOUS', 'HECTIC', 'NOISY'],
    level: 'easy',
  },
  {
    id: 'syn_07',
    word: 'BRAVE',
    meaningEn: 'Ready to face danger or pain',
    meaningBn: 'সাহসী বা নির্ভীক',
    synonym: 'COURAGEOUS',
    distractors: ['TIMID', 'COWARDLY', 'FEARFUL'],
    level: 'easy',
  },
  {
    id: 'syn_08',
    word: 'HARD',
    meaningEn: 'Done with a great deal of force or effort',
    meaningBn: 'কঠিন বা শ্রমসাধ্য',
    synonym: 'DIFFICULT',
    distractors: ['EFFORTLESS', 'SIMPLE', 'SMOOTH'],
    level: 'easy',
  },
  {
    id: 'syn_09',
    word: 'RICH',
    meaningEn: 'Having a great deal of money or assets',
    meaningBn: 'ধনী বা বিত্তবান',
    synonym: 'WEALTHY',
    distractors: ['DESTITUTE', 'POOR', 'DEFICIENT'],
    level: 'easy',
  },
  {
    id: 'syn_10',
    word: 'TIRED',
    meaningEn: 'In need of sleep or rest',
    meaningBn: 'ক্লান্ত বা অবসন্ন',
    synonym: 'EXHAUSTED',
    distractors: ['ENERGETIC', 'VIBRANT', 'RESTED'],
    level: 'easy',
  },

  // MEDIUM LEVEL / IELTS BAND 6.5-7.0
  {
    id: 'syn_11',
    word: 'ABUNDANT',
    meaningEn: 'Existing or available in large quantities',
    meaningBn: 'প্রচুর বা পর্যাপ্ত',
    synonym: 'PLENTIFUL',
    distractors: ['SCARCE', 'DEFICIENT', 'MEAGER'],
    level: 'medium',
  },
  {
    id: 'syn_12',
    word: 'ACCURATE',
    meaningEn: 'Correct in all details; exact',
    meaningBn: 'সঠিক ও নির্ভুল',
    synonym: 'PRECISE',
    distractors: ['ERRONEOUS', 'VAGUE', 'FAULTY'],
    level: 'medium',
  },
  {
    id: 'syn_13',
    word: 'BRIEF',
    meaningEn: 'Of short duration; concise',
    meaningBn: 'সংক্ষিপ্ত বা সারগর্ভ',
    synonym: 'CONCISE',
    distractors: ['LENGTHY', 'WORDY', 'ENDLESS'],
    level: 'medium',
  },
  {
    id: 'syn_14',
    word: 'CANDID',
    meaningEn: 'Truthful and straightforward; frank',
    meaningBn: 'স্পষ্টভাষী ও অকপট',
    synonym: 'FRANK',
    distractors: ['DECEITFUL', 'INSINCERE', 'SHY'],
    level: 'medium',
  },
  {
    id: 'syn_15',
    word: 'DIVERSE',
    meaningEn: 'Showing a great deal of variety',
    meaningBn: 'বৈচিত্র্যময় বা নানাবিধ',
    synonym: 'VARIED',
    distractors: ['UNIFORM', 'IDENTICAL', 'STATIC'],
    level: 'medium',
  },
  {
    id: 'syn_16',
    word: 'ELOQUENT',
    meaningEn: 'Fluent or persuasive in speaking or writing',
    meaningBn: 'বাগ্মী বা প্রাঞ্জল',
    synonym: 'ARTICULATE',
    distractors: ['HESITANT', 'INCOHERENT', 'STUTTERING'],
    level: 'medium',
  },
  {
    id: 'syn_17',
    word: 'FEASIBLE',
    meaningEn: 'Possible to do easily or conveniently',
    meaningBn: 'বাস্তবায়নযোগ্য বা সম্ভব',
    synonym: 'VIABLE',
    distractors: ['IMPOSSIBLE', 'IMPRACTICAL', 'ABSURD'],
    level: 'medium',
  },
  {
    id: 'syn_18',
    word: 'GENUINE',
    meaningEn: 'Truly what something is said to be; authentic',
    meaningBn: 'খাঁটি বা আসল',
    synonym: 'AUTHENTIC',
    distractors: ['COUNTERFEIT', 'SPURIOUS', 'ARTIFICIAL'],
    level: 'medium',
  },
  {
    id: 'syn_19',
    word: 'HAZARDOUS',
    meaningEn: 'Risky or dangerous to health or safety',
    meaningBn: 'ঝুঁকিপূর্ণ বা বিপজ্জনক',
    synonym: 'PERILOUS',
    distractors: ['HARMLESS', 'SECURE', 'BENIGN'],
    level: 'medium',
  },
  {
    id: 'syn_20',
    word: 'IMMENSE',
    meaningEn: 'Extremely large or great, especially in scale',
    meaningBn: 'বিশাল বা অপরিমেয়',
    synonym: 'COLOSSAL',
    distractors: ['MICROSCOPIC', 'PETITE', 'TRIVIAL'],
    level: 'medium',
  },
  {
    id: 'syn_21',
    word: 'JUDICIOUS',
    meaningEn: 'Having or showing good judgment or sense',
    meaningBn: 'বিচক্ষণ বা সুবিবেচক',
    synonym: 'PRUDENT',
    distractors: ['FOOLHARDY', 'RASH', 'IMPRUDENT'],
    level: 'medium',
  },
  {
    id: 'syn_22',
    word: 'KEEN',
    meaningEn: 'Having or showing eagerness or enthusiasm',
    meaningBn: 'উৎসাহী বা তীক্ষ্ণ',
    synonym: 'EAGER',
    distractors: ['APATHETIC', 'INDIFFERENT', 'BLUNT'],
    level: 'medium',
  },
  {
    id: 'syn_23',
    word: 'LUCID',
    meaningEn: 'Expressed clearly; easy to understand',
    meaningBn: 'সহজবোধ্য ও সুস্পষ্ট',
    synonym: 'CLEAR',
    distractors: ['CONFUSING', 'AMBIGUOUS', 'OBSCURE'],
    level: 'medium',
  },
  {
    id: 'syn_24',
    word: 'METICULOUS',
    meaningEn: 'Showing great attention to detail',
    meaningBn: 'অতি সতর্ক বা নিখুঁত',
    synonym: 'DILIGENT',
    distractors: ['CARELESS', 'SLOPPY', 'HASTY'],
    level: 'medium',
  },
  {
    id: 'syn_25',
    word: 'NOVEL',
    meaningEn: 'New or unusual in an interesting way',
    meaningBn: 'অভিনব বা নতুন',
    synonym: 'INNOVATIVE',
    distractors: ['OBSOLETE', 'ANCIENT', 'CLICHE'],
    level: 'medium',
  },
  {
    id: 'syn_26',
    word: 'OBSCURE',
    meaningEn: 'Not discovered or known about; uncertain',
    meaningBn: 'অস্পষ্ট বা অপরিচিত',
    synonym: 'UNCLEAR',
    distractors: ['PROMINENT', 'LUMINOUS', 'DISTINCT'],
    level: 'medium',
  },
  {
    id: 'syn_27',
    word: 'PRAGMATIC',
    meaningEn: 'Dealing with things sensibly and realistically',
    meaningBn: 'বাস্তবধর্মী বা প্রয়োগিক',
    synonym: 'PRACTICAL',
    distractors: ['IDEALISTIC', 'VISIONARY', 'UNREALISTIC'],
    level: 'medium',
  },
  {
    id: 'syn_28',
    word: 'RESILIENT',
    meaningEn: 'Able to withstand or recover quickly from difficult conditions',
    meaningBn: 'স্থিতিস্থাপক বা ঘুরে দাঁড়াতে সক্ষম',
    synonym: 'DURABLE',
    distractors: ['BRITTLE', 'VULNERABLE', 'FRAGILE'],
    level: 'medium',
  },
  {
    id: 'syn_29',
    word: 'SUBSTANTIAL',
    meaningEn: 'Of considerable importance, size, or worth',
    meaningBn: 'উল্লেখযোগ্য বা সারগর্ভ',
    synonym: 'SIGNIFICANT',
    distractors: ['TRIVIAL', 'NEGLIGIBLE', 'INSIGNIFICANT'],
    level: 'medium',
  },
  {
    id: 'syn_30',
    word: 'TRANQUIL',
    meaningEn: 'Free from disturbance; calm',
    meaningBn: 'প্রশান্ত বা নির্জন',
    synonym: 'PEACEFUL',
    distractors: ['TURBULENT', 'CHAOTIC', 'BOISTEROUS'],
    level: 'medium',
  },

  // HARD / ADVANCED IELTS BAND 7.5 - 8.5
  {
    id: 'syn_31',
    word: 'MITIGATE',
    meaningEn: 'Make less severe, serious, or painful',
    meaningBn: 'উপশম করা বা তীব্রতা কমানো',
    synonym: 'ALLEVIATE',
    distractors: ['AGGRAVATE', 'INTENSIFY', 'EXACERBATE'],
    level: 'hard',
  },
  {
    id: 'syn_32',
    word: 'BENEVOLENT',
    meaningEn: 'Well meaning and kindly',
    meaningBn: 'পরোপকারী বা দয়ালু',
    synonym: 'CHARITABLE',
    distractors: ['MALEVOLENT', 'SPITEFUL', 'CRUEL'],
    level: 'hard',
  },
  {
    id: 'syn_33',
    word: 'ASTUTE',
    meaningEn: 'Having an ability to accurately assess situations',
    meaningBn: 'চতুর বা সূক্ষ্মদর্শী',
    synonym: 'SHREWD',
    distractors: ['NAIVE', 'GULLIBLE', 'IGNORANT'],
    level: 'hard',
  },
  {
    id: 'syn_34',
    word: 'BOLSTER',
    meaningEn: 'Support or strengthen; prop up',
    meaningBn: 'উৎসাহিত করা বা শক্তিশালী করা',
    synonym: 'REINFORCE',
    distractors: ['UNDERMINE', 'WEAKEN', 'CRIPPLE'],
    level: 'hard',
  },
  {
    id: 'syn_35',
    word: 'CURB',
    meaningEn: 'Restrain or keep in check',
    meaningBn: 'নিয়ন্ত্রণ বা দমন করা',
    synonym: 'RESTRAIN',
    distractors: ['FOSTER', 'ACCELERATE', 'UNLEASH'],
    level: 'hard',
  },
  {
    id: 'syn_36',
    word: 'DWINDLE',
    meaningEn: 'Diminish gradually in size, amount, or strength',
    meaningBn: 'হ্রাস পাওয়া বা ক্ষীণ হওয়া',
    synonym: 'DIMINISH',
    distractors: ['PROLIFERATE', 'SURGE', 'EXPAND'],
    level: 'hard',
  },
  {
    id: 'syn_37',
    word: 'EXEMPLARY',
    meaningEn: 'Serving as a desirable model; representing the best',
    meaningBn: 'অনুকরণীয় বা দৃষ্টান্তমূলক',
    synonym: 'COMMENDABLE',
    distractors: ['REPREHENSIBLE', 'DEFECTIVE', 'MEDIOCRE'],
    level: 'hard',
  },
  {
    id: 'syn_38',
    word: 'FERVENT',
    meaningEn: 'Having or displaying a passionate intensity',
    meaningBn: 'উদ্যমী বা প্রবল আগ্রহী',
    synonym: 'PASSIONATE',
    distractors: ['APATHETIC', 'HALF-HEARTED', 'COLD'],
    level: 'hard',
  },
  {
    id: 'syn_39',
    word: 'GREGARIOUS',
    meaningEn: 'Fond of company; sociable',
    meaningBn: 'মিশুক বা দলপ্রিয়',
    synonym: 'SOCIABLE',
    distractors: ['SOLITARY', 'INTROVERTED', 'RECLUSIVE'],
    level: 'hard',
  },
  {
    id: 'syn_40',
    word: 'HINDER',
    meaningEn: 'Create difficulties resulting in delay or obstruction',
    meaningBn: 'বাধা সৃষ্টি করা',
    synonym: 'IMPEDE',
    distractors: ['FACILITATE', 'EXPEDITE', 'ASSIST'],
    level: 'hard',
  },
  {
    id: 'syn_41',
    word: 'IMPECCABLE',
    meaningEn: 'In accordance with the highest standards; faultless',
    meaningBn: 'ত্রুটিহীন বা নিখুঁত',
    synonym: 'FLAWLESS',
    distractors: ['DEFECTIVE', 'BLEMISHED', 'TAINTED'],
    level: 'hard',
  },
  {
    id: 'syn_42',
    word: 'JUBILANT',
    meaningEn: 'Feeling or expressing great happiness and triumph',
    meaningBn: 'উল্লসিত বা জয়গৌরবান্বিত',
    synonym: 'TRIUMPHANT',
    distractors: ['DESPONDENT', 'MOURNFUL', 'MELANCHOLY'],
    level: 'hard',
  },
  {
    id: 'syn_43',
    word: 'LUMINOUS',
    meaningEn: 'Full of or shedding light; bright or shining',
    meaningBn: 'উজ্জ্বল বা দীপ্তিময়',
    synonym: 'RADIANT',
    distractors: ['DIM', 'TENEBROUS', 'MURKY'],
    level: 'hard',
  },
  {
    id: 'syn_44',
    word: 'MOMENTOUS',
    meaningEn: 'Of great importance or significance',
    meaningBn: 'গুরুত্বপূর্ণ বা সুদূরপ্রসারী',
    synonym: 'CONSEQUENTIAL',
    distractors: ['TRIVIAL', 'PETTY', 'INSIGNIFICANT'],
    level: 'hard',
  },
  {
    id: 'syn_45',
    word: 'NEGLIGIBLE',
    meaningEn: 'So small or unimportant as to be not worth considering',
    meaningBn: 'নগণ্য বা তুচ্ছ',
    synonym: 'INCONSEQUENTIAL',
    distractors: ['MONUMENTAL', 'PARAMOUNT', 'SUBSTANTIAL'],
    level: 'hard',
  },
  {
    id: 'syn_46',
    word: 'OMINOUS',
    meaningEn: 'Giving the impression that something bad is going to happen',
    meaningBn: 'অশুভ বা ভীতিজনক',
    synonym: 'THREATENING',
    distractors: ['AUSPICIOUS', 'PROMISING', 'BENIGN'],
    level: 'hard',
  },
  {
    id: 'syn_47',
    word: 'PRECARIOUS',
    meaningEn: 'Not securely held or in position; dangerously likely to fall',
    meaningBn: 'অনিশ্চিত বা ঝুঁকিপূর্ণ',
    synonym: 'HAZARDOUS',
    distractors: ['STABLE', 'FORTIFIED', 'IMMUTABLE'],
    level: 'hard',
  },
  {
    id: 'syn_48',
    word: 'QUELL',
    meaningEn: 'Put an end to a rebellion or other disorder',
    meaningBn: 'দমন বা প্রশমিত করা',
    synonym: 'SUPPRESS',
    distractors: ['INSTIGATE', 'PROVOKE', 'FOMENT'],
    level: 'hard',
  },
  {
    id: 'syn_49',
    word: 'ROBUST',
    meaningEn: 'Strong and healthy; vigorous',
    meaningBn: 'বলবান বা টেকসই',
    synonym: 'VIGOROUS',
    distractors: ['FRAIL', 'INFIRM', 'DELICATE'],
    level: 'hard',
  },
  {
    id: 'syn_50',
    word: 'SURMOUNT',
    meaningEn: 'Overcome a difficulty or obstacle',
    meaningBn: 'অতিক্রম বা জয় করা',
    synonym: 'OVERCOME',
    distractors: ['SUCCUMB', 'YIELD', 'SURRENDER'],
    level: 'hard',
  },
  {
    id: 'syn_51',
    word: 'UBIQUITOUS',
    meaningEn: 'Present, appearing, or found everywhere',
    meaningBn: 'সর্বব্যাপী বা সর্বত্র বিদ্যমান',
    synonym: 'OMNIPRESENT',
    distractors: ['RARE', 'SCARCE', 'ISOLATED'],
    level: 'ielts_master',
  },
  {
    id: 'syn_52',
    word: 'VERSATILE',
    meaningEn: 'Able to adapt or be adapted to many different functions',
    meaningBn: 'বহুমুখী বা পরিবর্তনশীল',
    synonym: 'ADAPTABLE',
    distractors: ['RIGID', 'INFLEXIBLE', 'MONOLITHIC'],
    level: 'ielts_master',
  },
  {
    id: 'syn_53',
    word: 'WARY',
    meaningEn: 'Feeling or showing caution about possible dangers',
    meaningBn: 'সতর্ক বা হুঁশিয়ার',
    synonym: 'VIGILANT',
    distractors: ['RECKLESS', 'HEEDLESS', 'GULLIBLE'],
    level: 'ielts_master',
  },
  {
    id: 'syn_54',
    word: 'ZENITH',
    meaningEn: 'The time at which something is most powerful or successful',
    meaningBn: 'শীর্ষবিন্দু বা চরম শিখর',
    synonym: 'PINNACLE',
    distractors: ['NADIR', 'BOTTOM', 'TROUGH'],
    level: 'ielts_master',
  },
  {
    id: 'syn_55',
    word: 'ACUMEN',
    meaningEn: 'The ability to make good judgments and quick decisions',
    meaningBn: 'তীক্ষ্ণ অন্তর্দৃষ্টি বা বুদ্ধিমত্তা',
    synonym: 'INSIGHT',
    distractors: ['OBTUSENESS', 'IGNORANCE', 'BLINDNESS'],
    level: 'ielts_master',
  },
];

// Helper to get a random challenge with 3 randomized lane options (1 correct, 2 distractors)
export interface ActiveGateChallenge {
  targetWord: string;
  targetMeaningEn: string;
  targetMeaningBn: string;
  correctSynonym: string;
  correctLane: number; // 0 = Left, 1 = Center, 2 = Right
  laneOptions: string[]; // 3 items [left, center, right]
  level: string;
}

export function generateRandomChallenge(usedIds: Set<string> = new Set()): {
  challenge: ActiveGateChallenge;
  challengeId: string;
} {
  let pool = SYNONYM_CHALLENGES.filter((c) => !usedIds.has(c.id));
  if (pool.length === 0) {
    pool = SYNONYM_CHALLENGES;
    usedIds.clear();
  }

  const selected = pool[Math.floor(Math.random() * pool.length)];
  usedIds.add(selected.id);

  // Pick 2 random distractors
  const shuffledDistractors = [...selected.distractors].sort(() => 0.5 - Math.random());
  const d1 = shuffledDistractors[0] || 'INCORRECT';
  const d2 = shuffledDistractors[1] || 'WRONG';

  // Choose a random lane for the correct synonym
  const correctLane = Math.floor(Math.random() * 3); // 0, 1, or 2

  const laneOptions: string[] = [];
  let distractorIdx = 0;
  for (let lane = 0; lane < 3; lane++) {
    if (lane === correctLane) {
      laneOptions.push(selected.synonym);
    } else {
      laneOptions.push(distractorIdx === 0 ? d1 : d2);
      distractorIdx++;
    }
  }

  return {
    challengeId: selected.id,
    challenge: {
      targetWord: selected.word,
      targetMeaningEn: selected.meaningEn,
      targetMeaningBn: selected.meaningBn,
      correctSynonym: selected.synonym,
      correctLane,
      laneOptions,
      level: selected.level,
    },
  };
}
