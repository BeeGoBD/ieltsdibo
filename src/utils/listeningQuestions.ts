export interface ListeningSection {
  sectionNumber: number;
  title: string;
  context: string;
  speakerNames: string[];
  audioScript: string;
  durationEstimateSeconds: number;
}

export interface ListeningQuestion {
  id: string;
  questionNumber: number;
  sectionNumber: number;
  question: string;
  options: string[];
  correctAnswer: string;
  correctIndex: number;
  explanation: string;
}

export interface ListeningTestSet {
  id: string;
  tier: 'Foundation' | 'Moderate' | 'Challenging' | 'Mastery';
  title: string;
  description: string;
  timeAllowedMinutes: number;
  sections: ListeningSection[];
  questions: ListeningQuestion[];
}

export const LISTENING_TEST_SETS: Record<string, ListeningTestSet> = {
  Moderate: {
    id: 'listening_mod_1',
    tier: 'Moderate',
    title: 'Cambridge Academic Listening: Campus Life & Ecological Systems',
    description: 'Four authentic listening parts: Accommodation enquiry, Community facilities guide, Academic seminar, and Marine biology lecture.',
    timeAllowedMinutes: 30,
    sections: [
      {
        sectionNumber: 1,
        title: 'Section 1: University Student Accommodation Registration',
        context: 'A conversation between an international student, Tariq, and a university housing officer, Mrs. Higgins.',
        speakerNames: ['Mrs. Higgins (Housing Officer)', 'Tariq (Student)'],
        audioScript: `Mrs. Higgins: "Good morning, University Housing Office. How can I help you today?"
Tariq: "Hello. My name is Tariq Mansoor, and I need to register for on-campus accommodation for the upcoming autumn semester."
Mrs. Higgins: "Certainly, Tariq. Let me pull up the registration portal. Could you give me your student identification number first?"
Tariq: "Yes, it is ST-84920."
Mrs. Higgins: "ST-84920, splendid. Now, what type of room were you hoping for? We have self-catered single ensuite rooms in Elm Court, and standard twin rooms with shared facilities in Oakfield Hall."
Tariq: "I would definitely prefer Elm Court with an ensuite bathroom, as I need a quiet space for postgraduate research."
Mrs. Higgins: "Right. The weekly rental for Elm Court is one hundred and forty-five pounds per week, which includes high-speed fiber internet and heating. However, there is a refundable deposit of two hundred and fifty pounds payable before August 15th."
Tariq: "That sounds very reasonable. And is there a bicycle storage shed available?"
Mrs. Higgins: "Yes, Elm Court has a secure subterranean bicycle cage accessed via your electronic student keycard at no extra charge."`,
        durationEstimateSeconds: 120,
      },
      {
        sectionNumber: 2,
        title: 'Section 2: City Botanical Conservatory Orientation Guide',
        context: 'A recorded public audio guide for visitors touring the Royal Botanical Conservatory greenhouse complex.',
        speakerNames: ['Conservatory Curator'],
        audioScript: `Curator: "Welcome to the Royal Botanical Conservatory. Before you begin your self-guided audio tour, please take note of a few safety precautions and architectural highlights.
Our glass conservatory was originally erected in 1888, utilizing lightweight cast-iron arches imported from Scotland. Today, it houses over four thousand tropical specimen plants across three distinct climate zones.
To your immediate left is the High Humidity Cloud Forest Zone, maintained at twenty-four degrees Celsius with automated misting nozzles that fire every twenty minutes.
Please remain strictly on the elevated wooden boardwalks at all times, as our subterranean soil heating coils run directly beneath the mulch. Photography is warmly welcomed, but please note that flash illumination is strictly banned inside the Butterfly Pavilion.
If you need refreshments, our solar-powered tea café is situated on the mezzanine terrace, open until five-thirty PM."`,
        durationEstimateSeconds: 110,
      },
      {
        sectionNumber: 3,
        title: 'Section 3: Academic Tutorial on Urban Wetland Filtration',
        context: 'Two undergraduate environmental engineering students, Chloe and Liam, discussing their field research with Dr. Henderson.',
        speakerNames: ['Dr. Henderson', 'Chloe', 'Liam'],
        audioScript: `Dr. Henderson: "Chloe, Liam, come in. Let us review the laboratory water quality samples you gathered from the urban marshland site last Thursday."
Chloe: "Thanks, Dr. Henderson. The spectrophotometer results were quite surprising. We had hypothesized that industrial detergents would be the main contaminant entering the marsh via storm drains."
Liam: "Exactly, but when we tested the chemical oxygen demand, heavy road-surface runoff—specifically tire microparticulates and polycyclic aromatic hydrocarbons—actually accounted for sixty-five percent of the organic pollutant burden."
Dr. Henderson: "That is a significant finding. And how did the reed bed bio-filtration perform?"
Chloe: "Remarkably well. The Phragmites reed beds reduced the suspended sediment concentrations by nearly eighty percent within just seventy-two hours of retention."`,
        durationEstimateSeconds: 130,
      },
      {
        sectionNumber: 4,
        title: 'Section 4: University Lecture on Deep-Sea Bioluminescence',
        context: 'An academic lecture delivered by Professor Rebecca Vance at the Marine Science Institute.',
        speakerNames: ['Professor Vance'],
        audioScript: `Professor Vance: "In the oceanic twilight zone—the mesopelagic layer extending between two hundred and one thousand meters beneath the surface—sunlight dims into total darkness. In this high-pressure realm, over ninety percent of all metazoan life has evolved bioluminescence: the biochemical generation of cold light.
Unlike surface fluorescence which absorbs and re-emits external photons, marine bioluminescence depends on an enzyme called luciferase catalyzing the oxidation of a substrate pigment known as luciferin.
The primary evolutionary advantage of this light emission is not illumination, but counter-illumination camouflage. Predators hunting from below gaze upward looking for dark silhouettes against the faint downwelling ambient twilight. Animals such as the hatchetfish possess photophores along their ventral belly that emit downward blue-green light matching the downwelling sunlight exactly, effectively rendering them invisible to predators below."`,
        durationEstimateSeconds: 140,
      },
    ],
    questions: [
      {
        id: 'lq_1',
        questionNumber: 1,
        sectionNumber: 1,
        question: 'According to Section 1, what is Tariq’s student identification number?',
        options: ['ST-84920', 'ST-84290', 'ST-48920', 'ST-84902'],
        correctAnswer: 'ST-84920',
        correctIndex: 0,
        explanation: 'Tariq explicitly says: "Yes, it is ST-84920."',
      },
      {
        id: 'lq_2',
        questionNumber: 2,
        sectionNumber: 1,
        question: 'What is the weekly rental fee for Elm Court accommodation?',
        options: ['145 pounds per week', '250 pounds per week', '120 pounds per week', '180 pounds per week'],
        correctAnswer: '145 pounds per week',
        correctIndex: 0,
        explanation: 'Mrs. Higgins states the rent is 145 pounds per week, while 250 pounds is the refundable deposit.',
      },
      {
        id: 'lq_3',
        questionNumber: 3,
        sectionNumber: 1,
        question: 'What security feature is used to access the subterranean bicycle storage cage?',
        options: [
          'Electronic student keycard',
          'Biometric fingerprint scanner',
          'Four-digit numerical combination padlock',
          'Mechanical brass master key',
        ],
        correctAnswer: 'Electronic student keycard',
        correctIndex: 0,
        explanation: 'Mrs. Higgins mentions it is accessed via the student electronic keycard at no extra charge.',
      },
      {
        id: 'lq_4',
        questionNumber: 4,
        sectionNumber: 2,
        question: 'In Section 2, what material was used for the conservatory arches erected in 1888?',
        options: [
          'Cast-iron arches imported from Scotland',
          'Reinforced concrete arches from London',
          'Laminated timber trusses from Scandinavia',
          'Extruded aluminum beams from Germany',
        ],
        correctAnswer: 'Cast-iron arches imported from Scotland',
        correctIndex: 0,
        explanation: 'The curator states it utilized lightweight cast-iron arches imported from Scotland.',
      },
      {
        id: 'lq_5',
        questionNumber: 5,
        sectionNumber: 2,
        question: 'What activity is explicitly prohibited inside the Butterfly Pavilion?',
        options: [
          'Flash illumination photography',
          'Carrying drinking water bottles',
          'Wearing bright red colored clothing',
          'Speaking at conversational volume',
        ],
        correctAnswer: 'Flash illumination photography',
        correctIndex: 0,
        explanation: 'The curator notes: "flash illumination is strictly banned inside the Butterfly Pavilion."',
      },
      {
        id: 'lq_6',
        questionNumber: 6,
        sectionNumber: 3,
        question: 'In Section 3, what contaminant accounted for sixty-five percent of the organic pollutant burden?',
        options: [
          'Tire microparticulates and road-surface runoff',
          'Industrial laundry detergents',
          'Chemical agricultural fertilizers',
          'Raw municipal sewer overflow',
        ],
        correctAnswer: 'Tire microparticulates and road-surface runoff',
        correctIndex: 0,
        explanation: 'Liam clarifies that road-surface runoff and tire microparticulates accounted for 65% of the burden.',
      },
      {
        id: 'lq_7',
        questionNumber: 7,
        sectionNumber: 3,
        question: 'By how much did the Phragmites reed beds reduce suspended sediment concentrations within 72 hours?',
        options: [
          'Nearly eighty percent',
          'Exactly fifty percent',
          'Less than twenty percent',
          'One hundred percent complete filtration',
        ],
        correctAnswer: 'Nearly eighty percent',
        correctIndex: 0,
        explanation: 'Chloe notes the reed beds reduced suspended sediments by nearly eighty percent in 72 hours.',
      },
      {
        id: 'lq_8',
        questionNumber: 8,
        sectionNumber: 4,
        question: 'In Section 4, what enzyme catalyzes the oxidation of luciferin in marine bioluminescence?',
        options: ['Luciferase', 'Amylase', 'Polymerase', 'Hemoglobin'],
        correctAnswer: 'Luciferase',
        correctIndex: 0,
        explanation: 'Professor Vance mentions the enzyme luciferase catalyzing the oxidation of luciferin.',
      },
      {
        id: 'lq_9',
        questionNumber: 9,
        sectionNumber: 4,
        question: 'How do hatchetfish use counter-illumination camouflage to protect themselves?',
        options: [
          'By emitting blue-green light from ventral photophores to match downwelling sunlight',
          'By blinding predators with explosive high-intensity light flashes',
          'By turning completely black to absorb all visible light rays',
          'By mimicking the fluorescent warning signals of toxic jellyfish',
        ],
        correctAnswer: 'By emitting blue-green light from ventral photophores to match downwelling sunlight',
        correctIndex: 0,
        explanation: 'The professor explains they emit downward light matching downwelling sunlight to erase their silhouette.',
      },
      {
        id: 'lq_10',
        questionNumber: 10,
        sectionNumber: 4,
        question: 'At what depth range does the oceanic mesopelagic twilight zone occur?',
        options: [
          'Between two hundred and one thousand meters',
          'Between zero and fifty meters',
          'Between two thousand and five thousand meters',
          'Below ten thousand meters',
        ],
        correctAnswer: 'Between two hundred and one thousand meters',
        correctIndex: 0,
        explanation: 'The lecture specifies the mesopelagic layer as extending between 200 and 1,000 meters.',
      },
    ],
  },
};

export const getListeningTestSet = (tier: string): ListeningTestSet => {
  return LISTENING_TEST_SETS[tier] || LISTENING_TEST_SETS.Moderate;
};
