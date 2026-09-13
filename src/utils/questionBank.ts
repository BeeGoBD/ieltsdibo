import { SkillCategory } from '../types';

export interface ReadingQuestionItem {
  id: string;
  passageTitle: string;
  passageText: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficultyLevel: 'Foundation' | 'Moderate' | 'Challenging' | 'Mastery';
}

export interface ListeningQuestionItem {
  id: string;
  sectionTitle: string;
  audioScenario: string;
  audioTranscriptSnippet: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficultyLevel: 'Foundation' | 'Moderate' | 'Challenging' | 'Mastery';
}

export interface WritingTaskItem {
  id: string;
  taskType: 'Task 1' | 'Task 2';
  title: string;
  prompt: string;
  minimumWords: number;
  bandGuidance: string;
  keyVocabularyHints: string[];
  difficultyLevel: 'Foundation' | 'Moderate' | 'Challenging' | 'Mastery';
}

export interface SpeakingInterviewItem {
  id: string;
  part1Questions: string[];
  cueCardPart2: {
    topic: string;
    points: string[];
    prepTimeSeconds: number;
    speakTimeSeconds: number;
  };
  part3Questions: string[];
  examinerNotes: string;
  difficultyLevel: 'Foundation' | 'Moderate' | 'Challenging' | 'Mastery';
}

// 1. READING POOLS BY TIER
const READING_POOLS: Record<'Foundation' | 'Moderate' | 'Challenging' | 'Mastery', ReadingQuestionItem[]> = {
  Foundation: [
    {
      id: 'r_f_1',
      difficultyLevel: 'Foundation',
      passageTitle: 'The Benefits of Public Libraries in Community Life',
      passageText: 'Public libraries provide essential educational resources for urban and rural residents alike. Beyond lending printed books and e-readers, modern community libraries offer free access to digital computers, quiet study areas, and literacy programs for children and elderly learners.',
      question: 'What is mentioned as a service provided by modern community libraries?',
      options: [
        'Free access to digital computers and study spaces',
        'Mandatory paid subscription cards for basic books',
        'Commercial publishing and retail bookstores',
        'Overnight accommodation for university researchers',
      ],
      correctIndex: 0,
      explanation: 'Paragraph 1 clearly notes free access to computers and quiet study spaces.',
    },
    {
      id: 'r_f_2',
      difficultyLevel: 'Foundation',
      passageTitle: 'The Migration Habits of Monarch Butterflies',
      passageText: 'Every autumn, millions of monarch butterflies undertake a southward migration spanning up to 3,000 miles from Canada to Mexico. They rely on thermal air currents to conserve wing energy during their multi-week flight.',
      question: 'How do monarch butterflies conserve energy during their long migration?',
      options: [
        'By utilizing thermal air currents',
        'By swimming across coastal waterways',
        'By flying exclusively during torrential storms',
        'By remaining dormant in underground caves',
      ],
      correctIndex: 0,
      explanation: 'The text highlights their reliance on thermal air currents.',
    },
    {
      id: 'r_f_3',
      difficultyLevel: 'Foundation',
      passageTitle: 'Healthy Eating and Mediterranean Diets',
      passageText: 'Nutritionists have consistently found that diets high in unprocessed legumes, fresh olive oil, fish, and green vegetables contribute to lower cardiovascular mortality rates across Southern Europe.',
      question: 'Which dietary component is explicitly highlighted for reducing cardiovascular mortality?',
      options: [
        'Fresh olive oil, legumes, and green vegetables',
        'High intakes of refined sugars and processed fats',
        'Strictly synthetic chemical dietary supplements',
        'Unpasteurized dairy products with artificial flavors',
      ],
      correctIndex: 0,
      explanation: 'Fresh olive oil, legumes, and vegetables are listed as primary components.',
    },
  ],

  Moderate: [
    {
      id: 'r_m_1',
      difficultyLevel: 'Moderate',
      passageTitle: 'Urban Architecture and Biophilic Design',
      passageText: 'Biophilic design seeks to reconnect building occupants with the natural environment through living vegetation walls, daylight maximization, and natural ventilation systems. Empirical studies demonstrate that workers in biophilic environments experience 15% lower cortisol levels and sustained cognitive endurance over 8-hour shifts.',
      question: 'According to empirical studies, what measurable benefit do biophilic workspaces produce?',
      options: [
        'A fifteen percent reduction in cortisol levels',
        'An immediate doubling of engineering patents',
        'Complete eradication of all workplace stress',
        'A mandatory reduction in daily working hours',
      ],
      correctIndex: 0,
      explanation: 'The research explicitly measured a 15% reduction in biological cortisol markers.',
    },
    {
      id: 'r_m_2',
      difficultyLevel: 'Moderate',
      passageTitle: 'The Evolution of Cognitive Bilingualism',
      passageText: 'Bilingual individuals demonstrate superior executive function and inhibitory control compared to monolinguals. Managing two concurrent linguistic codes requires regular recruitment of the dorsolateral prefrontal cortex, effectively building cognitive reserve that delays symptomatic onset of neurodegeneration.',
      question: 'What biological consequence is linked to managing two linguistic codes?',
      options: [
        'Cognitive reserve that delays neurodegenerative symptoms',
        'Accelerated auditory decay in elderly demographics',
        'Permanent suppression of non-native phonetic intuition',
        'Total elimination of lexical retrieval pauses',
      ],
      correctIndex: 0,
      explanation: 'The text states that regular prefrontal cortex recruitment builds cognitive reserve.',
    },
    {
      id: 'r_m_3',
      difficultyLevel: 'Moderate',
      passageTitle: 'Renewable Power and Battery Chemistry',
      passageText: 'While lithium-ion chemistries dominate consumer electronics, grid-scale energy storage demands stationary solutions with higher thermal stability and abundant raw materials, such as sodium-sulfur and iron-flow architectures.',
      question: 'Why are sodium-sulfur and iron-flow systems preferred over lithium-ion for grid-scale storage?',
      options: [
        'Higher thermal stability and resource abundance',
        'Significantly smaller physical footprints in urban substations',
        'Compatibility with existing internal combustion motors',
        'Zero initial capital deployment expenditure',
      ],
      correctIndex: 0,
      explanation: 'Thermal stability and raw material abundance are stated as key requirements.',
    },
  ],

  Challenging: [
    {
      id: 'r_c_1',
      difficultyLevel: 'Challenging',
      passageTitle: 'Quantum Biology and Avian Magnetoreception',
      passageText: 'The radical pair mechanism posits that cryptochrome proteins embedded in the avian retina generate entangled electron pairs upon photon absorption. The quantum coherence of these entangled radical pairs is modulated by minute shifts in Earth’s ambient geomagnetic inclination, granting migratory birds a literal visual overlay of navigational vectors.',
      question: 'What fundamental quantum phenomenon underpins cryptochrome-mediated navigation?',
      options: [
        'Geomagnetic modulation of entangled radical electron pairs',
        'Thermodynamic dissipation through endothermic feather structures',
        'Static electrostatic polarization along coastal contours',
        'Photovoltaic energy transduction into acoustic pulses',
      ],
      correctIndex: 0,
      explanation: 'Cryptochromes create entangled electron pairs modulated by geomagnetic inclination.',
    },
    {
      id: 'r_c_2',
      difficultyLevel: 'Challenging',
      passageTitle: 'Epigenetics and Transgenerational Stress Phenotypes',
      passageText: 'DNA methylation patterns and histone modifications alter transcriptional accessibility without modifying base-pair sequencing. In rodent models, environmental stressors induced distinct microRNA signatures in spermatozoa, recapitulating anxiety phenotypes in unexposed F1 and F2 offspring despite cross-fostering protocols.',
      question: 'How did researchers establish that behavioral phenotypes in offspring were transgenerationally transmitted?',
      options: [
        'By utilizing spermatozoa microRNA signatures and cross-fostering controls',
        'By genetically mutating genomic DNA base sequences directly',
        'By observing parental grooming behaviors in wild colonies',
        'By tracking phenotypic changes over seventy generations',
      ],
      correctIndex: 0,
      explanation: 'Cross-fostering and microRNA signatures confirmed non-behavioral epigenetic transfer.',
    },
    {
      id: 'r_c_3',
      difficultyLevel: 'Challenging',
      passageTitle: 'Paleoclimatology and Pleistocene Glacial Oscillations',
      passageText: 'Analysis of stable isotope ratios (delta-18O) preserved within benthic foraminiferal calcite reveals that Milankovitch orbital cyclicity—specifically obliquity and orbital eccentricity—orchestrated the periodic expansion and retreat of continental ice sheets across the Northern Hemisphere.',
      question: 'Which astronomical parameter is directly linked to continental glacial fluctuations?',
      options: [
        'Milankovitch orbital cyclicity involving obliquity and eccentricity',
        'Periodic flares originating from extraterrestrial neutron stars',
        'Atmospheric ozone depletion driven by cosmic ray bombardment',
        'Tectonic plate subduction along continental margins',
      ],
      correctIndex: 0,
      explanation: 'Milankovitch orbital cyclicity (obliquity and eccentricity) is the primary driver.',
    },
  ],

  Mastery: [
    {
      id: 'r_x_1',
      difficultyLevel: 'Mastery',
      passageTitle: 'Linguistic Relativism and Epistemological Indeterminacy',
      passageText: 'The neo-Whorfian hypothesis asserts not that morphosyntax strictly constrains ontological possibility, but rather that habitual linguistic encodings create subtle attentional biases during non-verbal perceptual triage. Cognitive dissonance arises when cross-linguistic paradigms encounter concepts lacking dedicated morphosyntactic apparatus.',
      question: 'How does modern neo-Whorfian scholarship conceptualize the relationship between language and cognition?',
      options: [
        'Language creates habitual attentional biases during perceptual processing rather than rigid ontological boundaries',
        'Grammatical syntax deterministically locks speakers out of understanding foreign philosophical systems entirely',
        'Non-verbal cognition operates in complete autonomy without ever interfacing with lexical memory networks',
        'All natural languages encode identical cognitive universals without cultural variance in attention',
      ],
      correctIndex: 0,
      explanation: 'Neo-Whorfian theory posits habitual attentional biases rather than strict cognitive impossibility.',
    },
    {
      id: 'r_x_2',
      difficultyLevel: 'Mastery',
      passageTitle: 'Thermodynamics of Self-Organizing Dissipative Structures',
      passageText: 'Prigogine’s formulation of non-equilibrium thermodynamics illustrates that open systems driven far from thermodynamic equilibrium undergo symmetry-breaking bifurcations, culminating in coherent dissipative structures that generate local negentropy at the cost of accelerated global entropy production.',
      question: 'What characterizes dissipative structures far from thermodynamic equilibrium?',
      options: [
        'Symmetry-breaking bifurcations yielding local negentropy through accelerated global entropy generation',
        'The absolute violation of the second law of thermodynamics within closed adiabatic containers',
        'Spontaneous cessation of all chemical reactions at absolute zero temperatures',
        'Static equilibrium states devoid of microscopic fluctuation and particle interaction',
      ],
      correctIndex: 0,
      explanation: 'Dissipative structures maintain local negentropy by accelerating global entropy production.',
    },
  ],
};

// 2. LISTENING POOLS BY TIER
const LISTENING_POOLS: Record<'Foundation' | 'Moderate' | 'Challenging' | 'Mastery', ListeningQuestionItem[]> = {
  Foundation: [
    {
      id: 'l_f_1',
      difficultyLevel: 'Foundation',
      sectionTitle: 'Section 1: Community Sports Center Membership',
      audioScenario: 'Dialogue between a receptionist and an international student inquiring about pool access.',
      audioTranscriptSnippet: 'Receptionist: "The standard student gym membership is twenty pounds per month, which includes both the Olympic pool and the squash courts from 7 AM to 10 PM daily."',
      question: 'What is the monthly fee for the student gym and pool membership?',
      options: ['20 pounds per month', '35 pounds per month', '50 pounds per month', '15 pounds per month'],
      correctIndex: 0,
      explanation: 'The receptionist clearly quotes twenty pounds per month.',
    },
    {
      id: 'l_f_2',
      difficultyLevel: 'Foundation',
      sectionTitle: 'Section 2: Campus Bicycle Rental Scheme',
      audioScenario: 'Campus facilities coordinator explaining safety rules for electric bicycle rentals.',
      audioTranscriptSnippet: 'Coordinator: "Remember, helmets are legally mandatory across the city, and all rentals must be locked at official solar charging docks before 11 PM."',
      question: 'What is the latest time bicycles can be returned to solar charging docks?',
      options: ['Before 11 PM', 'Before 9 PM', 'Before midnight', 'Before 6 AM next morning'],
      correctIndex: 0,
      explanation: 'The coordinator highlights the 11 PM deadline.',
    },
  ],

  Moderate: [
    {
      id: 'l_m_1',
      difficultyLevel: 'Moderate',
      sectionTitle: 'Section 3: Environmental Policy Seminar',
      audioScenario: 'Two graduate researchers discussing coastal wetland conservation strategies.',
      audioTranscriptSnippet: 'Sarah: "Initially we assumed commercial fisheries were the primary culprit, but the hydrological telemetry actually proved that agricultural nitrogen runoff caused over 70% of the algal blooms."',
      question: 'What did hydrological telemetry identify as the primary cause of coastal algal blooms?',
      options: [
        'Agricultural nitrogen runoff',
        'Commercial trawling vessels',
        'Microplastic packaging debris',
        'Unregulated recreational boating',
      ],
      correctIndex: 0,
      explanation: 'Sarah explains the data pointed to agricultural nitrogen runoff over 70%.',
    },
    {
      id: 'l_m_2',
      difficultyLevel: 'Moderate',
      sectionTitle: 'Section 4: Archaeological Excavations in the Indus Valley',
      audioScenario: 'Academic lecture on urban hydraulic engineering in ancient Mohenjo-daro.',
      audioTranscriptSnippet: 'Professor: "The sophisticated covered brick drainage channels running beneath major boulevards indicate an unprecedented civic emphasis on municipal sanitation rather than monumental palaces."',
      question: 'What do the covered drainage channels reveal about Harappan civic priorities?',
      options: [
        'A pronounced emphasis on public sanitation over ostentatious palaces',
        'Extensive military preparations against incoming foreign invaders',
        'Total subservience to religious hierarchical priesthoods',
        'Early industrial metallurgic smelting factories',
      ],
      correctIndex: 0,
      explanation: 'The professor contrasts civic sanitation with royal palaces.',
    },
  ],

  Challenging: [
    {
      id: 'l_c_1',
      difficultyLevel: 'Challenging',
      sectionTitle: 'Section 3: Neuromarketing and Cognitive Heuristics',
      audioScenario: 'Colloquium discussion with rapid cross-talk between two cognitive economists.',
      audioTranscriptSnippet: 'Dr. Evans: "While Kahneman’s dual-process model predicted deliberate System 2 override under financial incentives, our fMRI scans indicated that anterior insula activation during loss anticipation entirely preempted rational prefrontal deliberation."',
      question: 'What did fMRI neuroimaging reveal regarding financial loss anticipation?',
      options: [
        'Anterior insula activation preempted rational prefrontal deliberation',
        'System 2 cognition systematically overruled all emotional affective impulses',
        'Dopaminergic pathways exhibited zero neurological change during uncertainty',
        'Subjects consistently adhered to classical neoclassical expected utility models',
      ],
      correctIndex: 0,
      explanation: 'Dr. Evans states anterior insula activation preempted prefrontal deliberation.',
    },
  ],

  Mastery: [
    {
      id: 'l_x_1',
      difficultyLevel: 'Mastery',
      sectionTitle: 'Section 4: Macroeconomic Asymmetries in Monetary Unions',
      audioScenario: 'Dense guest lecture at Oxford University with nuanced cadence and technical terminology.',
      audioTranscriptSnippet: 'Visiting Fellow: "The absence of a centralized fiscal stabilization mechanism inevitably forces peripheral economies to absorb asymmetrical demand shocks via internal deflation, depressing labor productivity and exacerbating capital flight toward core bond markets."',
      question: 'According to the speaker, what structural deficiency forces peripheral economies into internal deflation?',
      options: [
        'The lack of a centralized fiscal stabilization mechanism',
        'Excessive direct subsidies directed to municipal welfare boards',
        'Hyperinflation originating from unbacked digital currency issuance',
        'Overly flexible currency devaluation mechanisms on international exchanges',
      ],
      correctIndex: 0,
      explanation: 'The absence of centralized fiscal stabilization is identified as the root cause.',
    },
  ],
};

// 3. WRITING POOLS BY TIER
const WRITING_POOLS: Record<'Foundation' | 'Moderate' | 'Challenging' | 'Mastery', WritingTaskItem[]> = {
  Foundation: [
    {
      id: 'w_f_1',
      difficultyLevel: 'Foundation',
      taskType: 'Task 2',
      title: 'Technology and Modern Communication',
      prompt: 'Some people think that smartphones and social media make people feel more connected, while others argue that they isolate individuals from real-world relationships. Discuss both views and give your own opinion.',
      minimumWords: 250,
      bandGuidance: 'Focus on clear topic sentences, personal examples, and simple linking words (firstly, furthermore, in conclusion).',
      keyVocabularyHints: ['Interpersonal bonds', 'Virtual connectivity', 'Social isolation', 'Face-to-face engagement'],
    },
  ],
  Moderate: [
    {
      id: 'w_m_1',
      difficultyLevel: 'Moderate',
      taskType: 'Task 2',
      title: 'Urbanization vs Environmental Conservation',
      prompt: 'With rapid urban expansion, many governments prioritize commercial and residential development over green parklands and wildlife habitats. To what extent do you agree or disagree with this policy? Provide relevant arguments and real-world examples.',
      minimumWords: 250,
      bandGuidance: 'Construct balanced paragraphs examining ecological preservation alongside socioeconomic urbanization pressures.',
      keyVocabularyHints: ['Metropolitan expansion', 'Ecological equilibrium', 'Sustainable zoning', 'Biodiversity loss'],
    },
  ],
  Challenging: [
    {
      id: 'w_c_1',
      difficultyLevel: 'Challenging',
      taskType: 'Task 2',
      title: 'Artificial Intelligence and Epistemic Authority',
      prompt: 'As algorithmic artificial intelligence assumes diagnostic, pedagogical, and judicial responsibilities previously reserved for human specialists, concerns have arisen regarding accountability and ethical autonomy. To what extent should high-stakes societal decisions be entrusted to automated cognitive systems?',
      minimumWords: 250,
      bandGuidance: 'Demonstrate nuanced academic vocabulary, cohesive syntactic variety, and comprehensive counter-argumentation.',
      keyVocabularyHints: ['Algorithmic governance', 'Epistemic fallibility', 'Moral culpability', 'Human-in-the-loop oversight'],
    },
  ],
  Mastery: [
    {
      id: 'w_x_1',
      difficultyLevel: 'Mastery',
      taskType: 'Task 2',
      title: 'Technological Determinism vs Humanistic Agency',
      prompt: 'Philosophers debate whether technological advancement inexorably dictates socioeconomic paradigms, or whether cultural intentionality can actively subjugate technological trajectories. Critically analyze the interplay between deterministic technological momentum and humanistic agency.',
      minimumWords: 250,
      bandGuidance: 'Employ sophisticated philosophical vocabulary, complex syntactic inversions, and seamless coherence.',
      keyVocabularyHints: ['Technological determinism', 'Dialectical materialism', 'Sociotechnical hegemony', 'Existential teleology'],
    },
  ],
};

// 4. SPEAKING POOLS BY TIER
const SPEAKING_POOLS: Record<'Foundation' | 'Moderate' | 'Challenging' | 'Mastery', SpeakingInterviewItem[]> = {
  Foundation: [
    {
      id: 's_f_1',
      difficultyLevel: 'Foundation',
      part1Questions: [
        'Could you tell me your full name and where you currently reside?',
        'Do you prefer living in a bustling city or a peaceful countryside? Why?',
        'What is your favorite leisure activity during the weekends?',
      ],
      cueCardPart2: {
        topic: 'Describe a traditional festival or celebration in your country that you enjoy.',
        points: [
          'What the festival is and when it takes place',
          'Who you usually celebrate it with',
          'What special foods or activities are involved',
          'And explain why this festival is meaningful to you.',
        ],
        prepTimeSeconds: 60,
        speakTimeSeconds: 120,
      },
      part3Questions: [
        'How have cultural celebrations changed compared to your grandparents’ generation?',
        'Do you think commercialization has diminished the authenticity of traditional festivals?',
      ],
      examinerNotes: 'Foundation Tier (Target 5.5 - 6.0): Clear speech, everyday vocabulary, coherent narratives.',
    },
  ],

  Moderate: [
    {
      id: 's_m_1',
      difficultyLevel: 'Moderate',
      part1Questions: [
        'Let’s discuss technology and daily habits. How frequently do you utilize artificial intelligence tools in your study or work?',
        'Do you believe reading printed books remains superior to digital reading devices?',
        'How does architectural design influence your mood when entering a new building?',
      ],
      cueCardPart2: {
        topic: 'Describe an ambitious project or skill you successfully completed through self-directed study.',
        points: [
          'What the project or skill was',
          'What resources and methodologies you used',
          'What unexpected hurdles you had to overcome',
          'And explain how this achievement impacted your personal development.',
        ],
        prepTimeSeconds: 60,
        speakTimeSeconds: 120,
      },
      part3Questions: [
        'In an era of ubiquitous online tutorials, what is the indispensable role of physical university lecture halls?',
        'To what extent does autonomous self-learning exacerbate educational disparities across different socioeconomic strata?',
      ],
      examinerNotes: 'Moderate Tier (Target 6.5 - 7.0): Fluent sentence structures, idiomatic expressions, structured discourse.',
    },
  ],

  Challenging: [
    {
      id: 's_c_1',
      difficultyLevel: 'Challenging',
      part1Questions: [
        'Good day. Let’s talk about public transportation infrastructure. To what extent does high-speed rail transform demographic distribution across suburban peripheries?',
        'How do changing climatic weather patterns alter architectural choices in metropolitan planning?',
      ],
      cueCardPart2: {
        topic: 'Describe an ethical dilemma or difficult decision that required balancing competing moral priorities.',
        points: [
          'What the circumstances and conflicting values were',
          'Who was directly impacted by the potential outcomes',
          'What analytical framework or rationale guided your resolution',
          'And explain what you learned about human accountability through this experience.',
        ],
        prepTimeSeconds: 60,
        speakTimeSeconds: 120,
      },
      part3Questions: [
        'Should individual privacy rights ever be compromised for state-sponsored algorithmic surveillance?',
        'How can international legal frameworks regulate cross-border environmental degradation when sovereign interests clash?',
      ],
      examinerNotes: 'Challenging Tier (Target 7.5 - 8.0): High syntactic dexterity, nuanced abstract discourse, natural intonation.',
    },
  ],

  Mastery: [
    {
      id: 's_x_1',
      difficultyLevel: 'Mastery',
      part1Questions: [
        'Welcome. How do linguistic nuances in translation subtly distort the semantic fidelity of international diplomacy?',
        'In your view, does human memory function as an archival retrieval mechanism or a continuous reconstructive fiction?',
      ],
      cueCardPart2: {
        topic: 'Describe a transformative philosophical concept or paradigm shift that permanently altered your worldview.',
        points: [
          'What the philosophical proposition or paradigm was',
          'How you initially encountered it and your initial skepticism',
          'How it invalidated your previous epistemological assumptions',
          'And evaluate the lasting ramifications on your intellectual ethos.',
        ],
        prepTimeSeconds: 60,
        speakTimeSeconds: 120,
      },
      part3Questions: [
        'If artificial cognitive agents achieve self-referential consciousness, what are the metaphysical implications for human exceptionalism?',
        'Can egalitarian democracy endure amidst exponential asymmetries in algorithmic data monopoly?',
      ],
      examinerNotes: 'Mastery Tier (Target 8.5 - 9.0): Expert native-level command, speculative complexity, effortless fluency.',
    },
  ],
};

/**
 * Determines the tier based on user target score
 */
export const getTierFromScore = (scoreStr: string): 'Foundation' | 'Moderate' | 'Challenging' | 'Mastery' => {
  const s = parseFloat(scoreStr) || 7.0;
  if (s >= 8.5) return 'Mastery';
  if (s >= 7.5) return 'Challenging';
  if (s >= 6.5) return 'Moderate';
  return 'Foundation';
};

/**
 * Generates fresh questions dynamically for any module without repeating
 */
export const getFreshExamSet = (
  moduleType: SkillCategory,
  targetScore: string,
  randomSeed = Date.now()
) => {
  const tier = getTierFromScore(targetScore);

  if (moduleType === 'reading') {
    const pool = READING_POOLS[tier] || READING_POOLS.Moderate;
    // Shuffle based on seed
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return {
      tier,
      questions: shuffled,
      total: shuffled.length,
    };
  }

  if (moduleType === 'listening') {
    const pool = LISTENING_POOLS[tier] || LISTENING_POOLS.Moderate;
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return {
      tier,
      questions: shuffled,
      total: shuffled.length,
    };
  }

  if (moduleType === 'writing') {
    const pool = WRITING_POOLS[tier] || WRITING_POOLS.Moderate;
    const item = pool[Math.floor(Math.random() * pool.length)];
    return {
      tier,
      task: item,
    };
  }

  // Speaking
  const pool = SPEAKING_POOLS[tier] || SPEAKING_POOLS.Moderate;
  const item = pool[Math.floor(Math.random() * pool.length)];
  return {
    tier,
    speaking: item,
  };
};
