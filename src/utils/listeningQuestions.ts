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
  Foundation: {
    id: 'listening_found_1',
    tier: 'Foundation',
    title: 'Cambridge IELTS Foundation: Daily Community & Campus Facilities',
    description: 'Direct, clear conversational parts tailored for Band 4.5 - 5.5: Sports club membership, City library facilities, Course project preparation, and Bee communication.',
    timeAllowedMinutes: 30,
    sections: [
      {
        sectionNumber: 1,
        title: 'Section 1: Community Sports Club Membership Registration',
        context: 'A phone conversation between a prospective member, David, and the sports club coordinator, Sarah.',
        speakerNames: ['Sarah (Coordinator)', 'David (Applicant)'],
        audioScript: `Sarah: "Good morning! Westside Community Sports Complex. How can I assist you today?"
David: "Hello! I am calling to register for a bronze gym and swimming membership for the summer."
Sarah: "Certainly! Let me take down your details. May I have your full name and contact telephone number, please?"
David: "Yes, my name is David Miller, and my mobile number is 07945 228190."
Sarah: "Thank you, David. And which membership tier did you say you wanted to register for?"
David: "The bronze tier, which gives me pool access and morning gym sessions from Monday to Friday."
Sarah: "Splendid. The bronze membership fee is thirty-five pounds per month. There is also a one-time joining fee of fifteen pounds payable on your first visit."
David: "That is fine. Are there locker facilities available on site?"
Sarah: "Yes, all locker areas in the changing rooms operate with a one-pound coin or a reusable club token."`,
        durationEstimateSeconds: 110,
      },
      {
        sectionNumber: 2,
        title: 'Section 2: City Central Public Library Information Guide',
        context: 'A recorded informational guide for visitors introducing the newly upgraded public library facilities.',
        speakerNames: ['Library Officer Marcus'],
        audioScript: `Marcus: "Welcome to the City Central Library orientation guide. We are delighted to introduce our renovated study zones.
On the ground floor, you will find our lending desk and the digital media lab, open seven days a week from nine AM until eight PM.
The first floor is dedicated entirely to our Silent Study Sanctuary. Please remember that all mobile phones must be switched to silent mode, and food or hot drinks are strictly prohibited in this room.
If you wish to borrow study laptops, please present your green library card at the information counter in room twelve.
Finally, children's storytelling sessions take place every Saturday morning at ten-thirty in the courtyard garden."`,
        durationEstimateSeconds: 105,
      },
      {
        sectionNumber: 3,
        title: 'Section 3: Undergraduate Fieldwork Project Planning',
        context: 'Two undergraduate biology students, Emma and Toby, discussing their ecology field study with their course tutor, Dr. Adams.',
        speakerNames: ['Dr. Adams (Tutor)', 'Emma (Student)', 'Toby (Student)'],
        audioScript: `Dr. Adams: "Good afternoon, Emma and Toby. How is your plan for the freshwater river study progressing?"
Emma: "Good afternoon, Dr. Adams. We have chosen three sample points along the River Cam to collect water temperature and acidity readings."
Toby: "Yes, and we decided to use digital pH meters rather than paper strips because they give much more precise decimal figures."
Dr. Adams: "Very wise choice, Toby. And what time of day will you collect your water samples?"
Emma: "We plan to take our measurements at eight o'clock each morning for five consecutive days so the sunlight exposure remains consistent."
Dr. Adams: "Excellent. Remember to wear protective rubber boots and waterproof gloves when taking water samples from the river bank."`,
        durationEstimateSeconds: 115,
      },
      {
        sectionNumber: 4,
        title: 'Section 4: University Lecture on Honeybee Waggle Dance',
        context: 'An introductory biology lecture delivered by Professor Wilson on how honeybees communicate food locations.',
        speakerNames: ['Professor Wilson'],
        audioScript: `Professor Wilson: "Today we examine one of the most fascinating communication systems in the animal kingdom: the honeybee waggle dance, first decoded by Nobel laureate Karl von Frisch.
When a worker bee discovers an abundant nectar source such as a field of wildflowers, she returns inside the dark hive to share this navigational information with other forager bees.
She performs a figure-eight pattern on the vertical honeycomb. The angle of her run relative to vertical gravity communicates the compass direction of the flowers relative to the sun.
Furthermore, the duration of the waggle phase communicates the precise distance: roughly one second of waggle indicates a flight distance of one kilometer.
By interpreting both the angle and duration of this dance, nestmates can fly directly to the nectar source with remarkable accuracy."`,
        durationEstimateSeconds: 125,
      },
    ],
    questions: [
      {
        id: 'flq_1',
        questionNumber: 1,
        sectionNumber: 1,
        question: 'According to Section 1, what is David Miller’s mobile telephone number?',
        options: ['07945 228190', '07945 228109', '07954 228190', '07945 282190'],
        correctAnswer: '07945 228190',
        correctIndex: 0,
        explanation: 'David clearly states: "my mobile number is 07945 228190."',
      },
      {
        id: 'flq_2',
        questionNumber: 2,
        sectionNumber: 1,
        question: 'How much is the monthly fee for the bronze sports club membership?',
        options: ['Thirty-five pounds', 'Fifty pounds', 'Fifteen pounds', 'Twenty-five pounds'],
        correctAnswer: 'Thirty-five pounds',
        correctIndex: 0,
        explanation: 'Sarah specifies: "The bronze membership fee is thirty-five pounds per month."',
      },
      {
        id: 'flq_3',
        questionNumber: 3,
        sectionNumber: 1,
        question: 'What is required to operate the lockers in the sports club changing rooms?',
        options: [
          'A one-pound coin or reusable club token',
          'An electronic smartphone barcode',
          'A four-digit digital padlock code',
          'A physical brass key from reception',
        ],
        correctAnswer: 'A one-pound coin or reusable club token',
        correctIndex: 0,
        explanation: 'Sarah states that locker areas operate with a one-pound coin or a reusable club token.',
      },
      {
        id: 'flq_4',
        questionNumber: 4,
        sectionNumber: 2,
        question: 'On which floor of the library is the Silent Study Sanctuary situated?',
        options: ['The first floor', 'The ground floor', 'The basement level', 'The roof terrace'],
        correctAnswer: 'The first floor',
        correctIndex: 0,
        explanation: 'Marcus notes: "The first floor is dedicated entirely to our Silent Study Sanctuary."',
      },
      {
        id: 'flq_5',
        questionNumber: 5,
        sectionNumber: 2,
        question: 'At what time do children’s storytelling sessions begin on Saturday mornings?',
        options: ['Ten-thirty AM', 'Nine o’clock AM', 'Eleven AM', 'Twelve noon'],
        correctAnswer: 'Ten-thirty AM',
        correctIndex: 0,
        explanation: 'The guide explicitly says storytelling sessions take place every Saturday at ten-thirty.',
      },
      {
        id: 'flq_6',
        questionNumber: 6,
        sectionNumber: 3,
        question: 'Why did Emma and Toby choose to use digital pH meters rather than paper strips?',
        options: [
          'Because digital meters give much more precise decimal figures',
          'Because paper strips were completely out of stock in the campus store',
          'Because paper strips dissolve too quickly in cold river water',
          'Because digital meters are lighter to carry during long walks',
        ],
        correctAnswer: 'Because digital meters give much more precise decimal figures',
        correctIndex: 0,
        explanation: 'Toby explains: "we decided to use digital pH meters rather than paper strips because they give much more precise decimal figures."',
      },
      {
        id: 'flq_7',
        questionNumber: 7,
        sectionNumber: 3,
        question: 'At what time each morning do the students plan to take their river samples?',
        options: ['Eight o’clock', 'Seven o’clock', 'Ten o’clock', 'Six o’clock'],
        correctAnswer: 'Eight o’clock',
        correctIndex: 0,
        explanation: 'Emma says: "We plan to take our measurements at eight o\'clock each morning."',
      },
      {
        id: 'flq_8',
        questionNumber: 8,
        sectionNumber: 4,
        question: 'Who first decoded the waggle dance of honeybees?',
        options: ['Karl von Frisch', 'Charles Darwin', 'Gregor Mendel', 'Professor Wilson'],
        correctAnswer: 'Karl von Frisch',
        correctIndex: 0,
        explanation: 'The lecturer notes the dance was first decoded by Nobel laureate Karl von Frisch.',
      },
      {
        id: 'flq_9',
        questionNumber: 9,
        sectionNumber: 4,
        question: 'What does the angle of the bee’s waggle dance relative to gravity communicate?',
        options: [
          'The compass direction of the flowers relative to the sun',
          'The sugar concentration of the collected nectar',
          'The total number of predator hornets nearby',
          'The temperature of the outside atmosphere',
        ],
        correctAnswer: 'The compass direction of the flowers relative to the sun',
        correctIndex: 0,
        explanation: 'The lecture explains the angle communicates the compass direction of the flowers relative to the sun.',
      },
      {
        id: 'flq_10',
        questionNumber: 10,
        sectionNumber: 4,
        question: 'Roughly what flight distance does one second of the waggle phase indicate?',
        options: ['One kilometer', 'Five hundred meters', 'Five kilometers', 'Ten meters'],
        correctAnswer: 'One kilometer',
        correctIndex: 0,
        explanation: 'Professor Wilson states: "roughly one second of waggle indicates a flight distance of one kilometer."',
      },
    ],
  },
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
  Challenging: {
    id: 'listening_chal_1',
    tier: 'Challenging',
    title: 'Cambridge Academic Listening: Advanced Sciences & Heritage Restoration',
    description: 'Authentic Cambridge parts with natural corrections and subtle distractors (Band 7.5 - 8.0).',
    timeAllowedMinutes: 30,
    sections: [
      {
        sectionNumber: 1,
        title: 'Section 1: Postgraduate Lab Placement & Spectrometer Booking',
        context: 'A dialogue between Arjun, a doctoral researcher, and Dr. Eleanor Vance, the departmental equipment supervisor.',
        speakerNames: ['Dr. Vance (Supervisor)', 'Arjun (Researcher)'],
        audioScript: `Dr. Vance: "Good morning, Arjun. Have you completed the safety induction for the high-resolution mass spectrometry facility?"
Arjun: "Yes, Dr. Vance. I completed the online certification on Tuesday, and Professor Davies signed off my hazardous solvent protocol."
Dr. Vance: "Excellent. Now, regarding your equipment time slots: the spectrometer is reserved on Mondays and Wednesdays for undergraduate classes. You may book either Thursday morning from nine to one, or Friday afternoon from two to six."
Arjun: "Thursday morning from nine to one would be optimal, as my biological samples require immediate centrifugal separation beforehand."
Dr. Vance: "Very well. Now, about the consumables budget. The argon carrier gas cylinders were originally quoted at eighty pounds, but due to supply chain revisions, the current billing code charges ninety-five pounds per cylinder."
Arjun: "Noted. My grant index code is GR-5542-C. That will cover the argon cylinders and the quartz cuvettes."
Dr. Vance: "Splendid. Your access fob will be coded for room 304 by four PM today."`,
        durationEstimateSeconds: 130,
      },
      {
        sectionNumber: 2,
        title: 'Section 2: Historic Harbor Quayside Regeneration Tour',
        context: 'An orientation talk given by architectural historian Julian Croft regarding the preservation of Victorian docklands.',
        speakerNames: ['Julian Croft (Architect)'],
        audioScript: `Julian Croft: "Welcome to the St. Jude's Maritime Quayside architectural tour. When this deep-water basin was engineered in 1862, it handled over four hundred thousand tons of merchant timber annually.
However, with the transition to containerized shipping in the 1970s, the Victorian brick warehouses were abandoned to dereliction.
Our municipal conservation trust adopted a strategy of adaptive reuse rather than wholesale demolition.
Notice the cast-iron crane gantries to your right: instead of selling them for scrap metal, structural engineers reinforced the footings with carbon-fiber jackets, integrating them as illuminated public viewing platforms.
The historic customs warehouse now hosts twenty-two incubator workshops for marine artisans and naval software designers.
Please note that during high spring tides, the lower pedestrian promenade can be slick with algae; visitors are urged to walk along the upper granite arcade."`,
        durationEstimateSeconds: 120,
      },
      {
        sectionNumber: 3,
        title: 'Section 3: Environmental Chemistry Colloquium on Microplastics',
        context: 'Two postgraduate researchers, Maya and Sam, reviewing their gas chromatography data with Professor Davies.',
        speakerNames: ['Professor Davies', 'Maya', 'Sam'],
        audioScript: `Professor Davies: "Maya, Sam, let us examine the gas chromatography results from the river estuary sediment cores."
Maya: "Professor Davies, the spectroscopic fingerprinting revealed a distinct anomaly. We expected polyethylene microbeads from cosmetic products to dominate the shallow sediment layers."
Sam: "Yet unexpectedly, secondary polyester microfibers shed from synthetic textiles during residential laundry cycles accounted for seventy-two percent of all detected polymer fragments."
Professor Davies: "And what did the bio-accumulation assays in benthic invertebrates demonstrate?"
Maya: "We observed that estuarine amphipods ingested fibers under fifty microns at three times the rate of larger spherical beads, resulting in severe hepatopancreatic inflammation within just four days."`,
        durationEstimateSeconds: 135,
      },
      {
        sectionNumber: 4,
        title: 'Section 4: Academic Lecture on Synaptic Pruning & Neuroplasticity',
        context: 'A lecture delivered by neurobiologist Dr. Fiona Campbell at the Institute of Cognitive Science.',
        speakerNames: ['Dr. Fiona Campbell'],
        audioScript: `Dr. Campbell: "In early human neurodevelopment, the cerebral cortex undergoes a transient period of massive synaptic overproduction. By age two, a toddler possesses roughly twice the number of neuronal synapses as a mature adult.
The subsequent sculpting of functional cognitive architecture depends fundamentally on synaptic pruning: the targeted enzymatic elimination of non-essential or redundant neural connections.
This selective elimination is governed by non-neuronal glial cells known as microglia.
Microglia continuously extend and retract motile filopodia to survey the synaptic landscape. Synapses that are infrequently activated fail to recruit neurotrophic factors and become tagged with complement proteins, specifically C1q and C3.
Upon detecting these complement tags, microglia phagocytose—or engulf—the inactive dendritic spines.
This process demonstrates that the refinement of human intellectual capacity is driven not by the indiscriminate growth of neural connections, but by the precise biological elimination of background noise."`,
        durationEstimateSeconds: 145,
      },
    ],
    questions: [
      {
        id: 'clq_1',
        questionNumber: 1,
        sectionNumber: 1,
        question: 'Which time slot did Arjun choose for his spectrometer laboratory work?',
        options: [
          'Thursday morning from nine to one',
          'Friday afternoon from two to six',
          'Monday morning from eight to twelve',
          'Wednesday afternoon from one to five',
        ],
        correctAnswer: 'Thursday morning from nine to one',
        correctIndex: 0,
        explanation: 'Arjun states: "Thursday morning from nine to one would be optimal."',
      },
      {
        id: 'clq_2',
        questionNumber: 2,
        sectionNumber: 1,
        question: 'What is the revised price per cylinder for argon carrier gas?',
        options: ['Ninety-five pounds', 'Eighty pounds', 'One hundred pounds', 'Seventy-five pounds'],
        correctAnswer: 'Ninety-five pounds',
        correctIndex: 0,
        explanation: 'Dr. Vance explains that while originally quoted at 80, the current billing charges ninety-five pounds per cylinder.',
      },
      {
        id: 'clq_3',
        questionNumber: 3,
        sectionNumber: 1,
        question: 'What is Arjun’s grant index billing code?',
        options: ['GR-5542-C', 'GR-5452-C', 'GR-5524-C', 'GR-4552-C'],
        correctAnswer: 'GR-5542-C',
        correctIndex: 0,
        explanation: 'Arjun specifies: "My grant index code is GR-5542-C."',
      },
      {
        id: 'clq_4',
        questionNumber: 4,
        sectionNumber: 2,
        question: 'How did structural engineers preserve the cast-iron crane gantries?',
        options: [
          'By reinforcing footings with carbon-fiber jackets into viewing platforms',
          'By dismantling them and reassembling them inside a glass museum gallery',
          'By melting them down to forge new pedestrian bridge railings',
          'By selling them to private naval collector societies',
        ],
        correctAnswer: 'By reinforcing footings with carbon-fiber jackets into viewing platforms',
        correctIndex: 0,
        explanation: 'The architect explains engineers reinforced footings with carbon-fiber jackets to create viewing platforms.',
      },
      {
        id: 'clq_5',
        questionNumber: 5,
        sectionNumber: 2,
        question: 'What safety caution does Julian Croft give about high spring tides?',
        options: [
          'The lower pedestrian promenade can be slick with algae',
          'High winds frequently dislodge loose Victorian roof slates',
          'The ferry dock becomes submerged beneath five feet of water',
          'Strong sea spray damages visitor electronic mobile phones',
        ],
        correctAnswer: 'The lower pedestrian promenade can be slick with algae',
        correctIndex: 0,
        explanation: 'Julian warns that the lower promenade can be slick with algae and urges walking on the upper arcade.',
      },
      {
        id: 'clq_6',
        questionNumber: 6,
        sectionNumber: 3,
        question: 'What percentage of detected polymer fragments did polyester laundry microfibers account for?',
        options: ['Seventy-two percent', 'Fifty percent', 'Thirty-five percent', 'Ninety percent'],
        correctAnswer: 'Seventy-two percent',
        correctIndex: 0,
        explanation: 'Sam explains that secondary polyester microfibers accounted for seventy-two percent of fragments.',
      },
      {
        id: 'clq_7',
        questionNumber: 7,
        sectionNumber: 3,
        question: 'In Section 3, what effect did ingesting microfibers have on estuarine amphipods?',
        options: [
          'Severe hepatopancreatic inflammation within four days',
          'Immediate reproductive acceleration and enlarged shells',
          'Loss of swimming ability within thirty minutes',
          'No measurable pathological impact on metabolic activity',
        ],
        correctAnswer: 'Severe hepatopancreatic inflammation within four days',
        correctIndex: 0,
        explanation: 'Maya explicitly reports: "resulting in severe hepatopancreatic inflammation within just four days."',
      },
      {
        id: 'clq_8',
        questionNumber: 8,
        sectionNumber: 4,
        question: 'According to Dr. Campbell, what glial cell type is responsible for synaptic pruning?',
        options: ['Microglia', 'Astrocytes', 'Oligodendrocytes', 'Schwann cells'],
        correctAnswer: 'Microglia',
        correctIndex: 0,
        explanation: 'Dr. Campbell states: "This selective elimination is governed by non-neuronal glial cells known as microglia."',
      },
      {
        id: 'clq_9',
        questionNumber: 9,
        sectionNumber: 4,
        question: 'Which complement proteins tag inactive synapses destined for elimination?',
        options: ['C1q and C3', 'ATP and RNA', 'Hemoglobin and Myoglobin', 'Dopamine and Serotonin'],
        correctAnswer: 'C1q and C3',
        correctIndex: 0,
        explanation: 'The lecture specifies synapses become tagged with complement proteins, specifically C1q and C3.',
      },
      {
        id: 'clq_10',
        questionNumber: 10,
        sectionNumber: 4,
        question: 'What core conclusion does Dr. Campbell draw regarding human intellectual refinement?',
        options: [
          'It is driven by precise biological elimination of redundant background connections',
          'It requires maximizing the absolute total quantity of cortical synapses',
          'It depends exclusively on genetic factors unaffected by environmental stimulus',
          'It ceases completely following early childhood neurodevelopment',
        ],
        correctAnswer: 'It is driven by precise biological elimination of redundant background connections',
        correctIndex: 0,
        explanation: 'Dr. Campbell concludes refinement is driven by the precise elimination of background noise.',
      },
    ],
  },
  Mastery: {
    id: 'listening_mast_1',
    tier: 'Mastery',
    title: 'Cambridge Academic Mastery: Geopolitics & Quantum Thermodynamics',
    description: 'Ultra-high-rigor Cambridge dialogue with rapid turn-taking, scientific abstraction, and sophisticated inference for Band 8.5 - 9.0.',
    timeAllowedMinutes: 30,
    sections: [
      {
        sectionNumber: 1,
        title: 'Section 1: International Grid Modernization & Sovereign Grant Protocol',
        context: 'A negotiation between multilateral infrastructure director Helena Rostova and energy systems economist Henrik Lindqvist.',
        speakerNames: ['Helena Rostova', 'Henrik Lindqvist'],
        audioScript: `Helena: "Henrik, welcome. We have only forty-eight hours to finalize the cross-border renewable transmission dossier before the Copenhagen Ministerial plenary."
Henrik: "Understood, Helena. I have consolidated the capital expenditure projections. The subsea high-voltage direct current interconnectors require an initial capital outlay of two point four billion euros."
Helena: "However, our sovereign co-financing covenants mandate that non-EU consortium partners provide at least thirty-five percent of the mezzanine equity. Did the Nordic Sovereign Wealth Fund agree to that threshold?"
Henrik: "They agreed in principle, but under one strict caveat: they demand sovereign risk guarantees against curtailment losses exceeding four percent of annual gigawatt-hour throughput."
Helena: "That is manageable. We can underwrite that through the European Green Guarantee Facility under article twelve-B."
Henrik: "Perfect. I will adjust the underwriting appendix by seven PM tonight."`,
        durationEstimateSeconds: 135,
      },
      {
        sectionNumber: 2,
        title: 'Section 2: High-Altitude Cryogenic Radio Observatory Architecture',
        context: 'A technical overview delivered by Chief Engineer Dr. Arthur Pendelton at the Atacama Submillimeter Array.',
        speakerNames: ['Dr. Arthur Pendelton'],
        audioScript: `Dr. Pendelton: "At five thousand meters above sea level in the Atacama Plateau, atmospheric water vapor drops below zero point five millimeters of precipitable column, opening an unprecedented spectral window for submillimeter astronomy.
However, capturing cosmic microwave background emissions requires maintaining our heterodyne superconducting bolometers at four Kelvin—colder than deep interstellar space.
We achieve this through a closed-cycle pulse-tube cryocooler running liquid helium without mechanical pistons inside the focal plane chamber.
This minimizes mechanical vibration down to less than three nanometers RMS.
Because ambient barometric pressure is only fifty-five kilopascals at this altitude, visiting astronomers must acclimate for thirty-six hours at base camp and utilize supplementary oxygen during all observing shifts."`,
        durationEstimateSeconds: 130,
      },
      {
        sectionNumber: 3,
        title: 'Section 3: Behavioral Economics Colloquium on Dual-Process Heuristics',
        context: 'A seminar discussion between Professor Lawrence Sterling, doctoral fellow Priya, and behavioral theorist Dr. Evelyn Chen.',
        speakerNames: ['Professor Sterling', 'Priya', 'Dr. Evelyn Chen'],
        audioScript: `Professor Sterling: "Let us turn to the experimental findings on cognitive depletion and intertemporal discounting in financial decision-making."
Priya: "In our randomized control trial, subjects subjected to high cognitive load via complex working-memory tasks consistently exhibited present-bias discount rates forty percent steeper than the baseline control cohort."
Dr. Chen: "That aligns precisely with Kahneman and Tversky’s dual-process architecture: when System 2 executive resources are exhausted by cognitive strain, System 1 default affective heuristics dominate, leading individuals to discount long-term returns in favor of immediate gratification."
Professor Sterling: "Fascinating. And did framing the financial choices as opportunity costs rather than direct cash penalties mitigate the bias?"
Priya: "Remarkably, opportunity cost framing reduced hyperbolic discounting by nearly half, restoring choice consistency even under severe cognitive exhaustion."`,
        durationEstimateSeconds: 140,
      },
      {
        sectionNumber: 4,
        title: 'Section 4: Advanced Theoretical Physics Lecture on Topological Insulators',
        context: 'A specialized lecture delivered by Professor Sir Alistair MacIntyre on quantum spin Hall states and dissipationless surface currents.',
        speakerNames: ['Prof. Sir Alistair MacIntyre'],
        audioScript: `Prof. MacIntyre: "Topological insulators represent a paradigm shift in condensed matter physics: materials that behave as macroscopic electrical insulators throughout their three-dimensional bulk, yet host metallic, conducting edge states along their two-dimensional boundaries.
The physical origin of these boundary states lies not in chemical interface bonding, but in the non-trivial topology of their electronic bulk wavefunctions, characterized by a quantized topological invariant known as the Z2 index.
Because of strong spin-orbit coupling, these surface electrons experience Kramers time-reversal symmetry protection.
This enforces quantum spin-momentum locking: an electron traveling forward possesses spin-up, while an electron traveling backward must possess spin-down.
Consequently, backscattering from non-magnetic impurities is strictly forbidden by quantum mechanical interference, permitting dissipationless electronic transport even at non-cryogenic room temperatures.
This opens revolutionary possibilities for low-power spintronic memory architectures and fault-tolerant topological quantum computation."`,
        durationEstimateSeconds: 150,
      },
    ],
    questions: [
      {
        id: 'mlq_1',
        questionNumber: 1,
        sectionNumber: 1,
        question: 'What is the projected capital expenditure for the subsea direct current interconnectors?',
        options: ['2.4 billion euros', '4.2 billion euros', '1.2 billion euros', '3.5 billion euros'],
        correctAnswer: '2.4 billion euros',
        correctIndex: 0,
        explanation: 'Henrik states: "The subsea high-voltage direct current interconnectors require an initial capital outlay of two point four billion euros."',
      },
      {
        id: 'mlq_2',
        questionNumber: 2,
        sectionNumber: 1,
        question: 'Under what caveat did the Nordic Sovereign Wealth Fund agree to co-financing?',
        options: [
          'Risk guarantees against curtailment losses exceeding four percent',
          'A guaranteed ten percent fixed annual dividend return',
          'Exclusive ownership of all subsea optical fiber conduits',
          'Exemption from all European Union environmental impact assessments',
        ],
        correctAnswer: 'Risk guarantees against curtailment losses exceeding four percent',
        correctIndex: 0,
        explanation: 'Henrik clarifies they demand risk guarantees against curtailment losses exceeding four percent.',
      },
      {
        id: 'mlq_3',
        questionNumber: 3,
        sectionNumber: 1,
        question: 'Under which European Green Guarantee Facility article will the risk be underwritten?',
        options: ['Article 12-B', 'Article 14-A', 'Article 8-C', 'Article 22-D'],
        correctAnswer: 'Article 12-B',
        correctIndex: 0,
        explanation: 'Helena specifies underwriting through article twelve-B.',
      },
      {
        id: 'mlq_4',
        questionNumber: 4,
        sectionNumber: 2,
        question: 'At what operating temperature are the heterodyne bolometers maintained?',
        options: ['Four Kelvin', 'Zero degrees Celsius', 'Seventy-seven Kelvin', 'Negative twenty Celsius'],
        correctAnswer: 'Four Kelvin',
        correctIndex: 0,
        explanation: 'Dr. Pendelton explains bolometers are maintained at four Kelvin.',
      },
      {
        id: 'mlq_5',
        questionNumber: 5,
        sectionNumber: 2,
        question: 'How does the pulse-tube cryocooler achieve vibration reduction under three nanometers?',
        options: [
          'By operating without mechanical moving pistons in the focal plane',
          'By suspending the telescope on giant electromagnetic shock absorbers',
          'By anchoring the concrete foundation deep into bedrock granite',
          'By operating only during windless nighttime hours',
        ],
        correctAnswer: 'By operating without mechanical moving pistons in the focal plane',
        correctIndex: 0,
        explanation: 'He states: "without mechanical pistons inside the focal plane chamber... minimizes mechanical vibration down to less than three nanometers."',
      },
      {
        id: 'mlq_6',
        questionNumber: 6,
        sectionNumber: 3,
        question: 'By how much did high cognitive load steepen subjects’ present-bias discount rates?',
        options: ['Forty percent', 'Twenty percent', 'Sixty-five percent', 'Ten percent'],
        correctAnswer: 'Forty percent',
        correctIndex: 0,
        explanation: 'Priya notes subjects exhibited discount rates forty percent steeper than baseline.',
      },
      {
        id: 'mlq_7',
        questionNumber: 7,
        sectionNumber: 3,
        question: 'What behavioral intervention significantly mitigated hyperbolic discounting?',
        options: [
          'Framing financial choices as opportunity costs rather than cash penalties',
          'Offering high monetary bonuses for completing cognitive tests',
          'Shortening the total duration of the experimental evaluation',
          'Providing caffeine stimulants prior to test sessions',
        ],
        correctAnswer: 'Framing financial choices as opportunity costs rather than cash penalties',
        correctIndex: 0,
        explanation: 'Priya confirms opportunity cost framing reduced hyperbolic discounting by nearly half.',
      },
      {
        id: 'mlq_8',
        questionNumber: 8,
        sectionNumber: 4,
        question: 'What mathematical topological invariant characterizes topological insulator electronic states?',
        options: ['The Z2 index', 'The Euler characteristic', 'The Riemann curvature tensor', 'The Fourier coefficient'],
        correctAnswer: 'The Z2 index',
        correctIndex: 0,
        explanation: 'Prof. MacIntyre identifies the topological invariant known as the Z2 index.',
      },
      {
        id: 'mlq_9',
        questionNumber: 9,
        sectionNumber: 4,
        question: 'What physical phenomenon forbids backscattering from non-magnetic impurities in edge states?',
        options: [
          'Quantum spin-momentum locking enforced by time-reversal symmetry',
          'Superconducting Meissner magnetic flux expulsion',
          'Classical frictional resistance along the crystal lattice',
          'Electrostatic repulsion from atomic core nuclei',
        ],
        correctAnswer: 'Quantum spin-momentum locking enforced by time-reversal symmetry',
        correctIndex: 0,
        explanation: 'The lecture explains quantum spin-momentum locking strictly forbids backscattering by destructive interference.',
      },
      {
        id: 'mlq_10',
        questionNumber: 10,
        sectionNumber: 4,
        question: 'What major practical application is enabled by room-temperature dissipationless transport?',
        options: [
          'Low-power spintronic memory and fault-tolerant quantum computation',
          'High-speed commercial fossil fuel locomotive engines',
          'Underwater sonar acoustic transmission amplification',
          'Synthetic photosynthesis solar cells',
        ],
        correctAnswer: 'Low-power spintronic memory and fault-tolerant quantum computation',
        correctIndex: 0,
        explanation: 'Prof. MacIntyre highlights low-power spintronic memory architectures and fault-tolerant topological quantum computation.',
      },
    ],
  },
};

export const getListeningTestSet = (tier: string): ListeningTestSet => {
  return LISTENING_TEST_SETS[tier] || LISTENING_TEST_SETS.Moderate;
};
