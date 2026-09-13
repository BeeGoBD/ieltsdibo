export interface ReadingParagraph {
  letter: string;
  text: string;
}

export interface ReadingQuestion {
  id: string;
  questionNumber: number;
  type: 'multiple_choice' | 'true_false_not_given';
  question: string;
  options: string[];
  correctAnswer: string;
  correctIndex: number;
  paragraphRef: string;
  explanation: string;
}

export interface ReadingTestSet {
  id: string;
  tier: 'Foundation' | 'Moderate' | 'Challenging' | 'Mastery';
  passageTitle: string;
  passageSubtitle: string;
  passageCategory: string;
  timeAllowedMinutes: number;
  paragraphs: ReadingParagraph[];
  questions: ReadingQuestion[];
}

export const READING_TEST_SETS: Record<string, ReadingTestSet> = {
  Moderate: {
    id: 'reading_mod_1',
    tier: 'Moderate',
    passageTitle: 'The Architecture of Water: Ancient Stepwells of South Asia',
    passageSubtitle: 'A historic testament to hydraulic ingenuity, subterranean cooling, and communal sanctuaries.',
    passageCategory: 'Archaeology & Civil Engineering',
    timeAllowedMinutes: 20,
    paragraphs: [
      {
        letter: 'A',
        text: 'During the sixth and seventh centuries, the inhabitants of the semi-arid northwestern states of Gujarat and Rajasthan in India developed a unique subterranean architectural method of gaining access to clean groundwater: the stepwell. In regions where months of relentless drought alternate with brief, torrential monsoon cloudbursts, surface reservoirs quickly evaporate. To guarantee water supplies throughout the scorching dry season, builders excavated deep pits into the earth, cutting through silt, sand, and rock to reach perennial underground aquifers.',
      },
      {
        letter: 'B',
        text: 'As their name implies, stepwells comprise a series of stone staircases that descend directly to the water table. When the monsoon rains arrived, the subterranean water table rose, and users needed only negotiate a few stone steps to fill their clay pots. As the dry season progressed and the groundwater level gradually receded, more tiers of steps were exposed, allowing women and travelers to continue collecting water from ever deeper reservoirs. Beyond their practical hydraulic function, stepwells served as vital social hubs and cool subterranean sanctuaries from the relentless desert heat.',
      },
      {
        letter: 'C',
        text: 'Over the centuries, stepwell architecture transitioned from rudimentary stone trenches into magnificent multistory subterranean palaces. The most ambitious structures, such as the Rani ki Vav (Queen’s Stepwell) in Patan, featured five or seven subterranean levels adorned with hundreds of intricate stone sculptures depicting deities, celestial nymphs, and geometric mandalas. The thick stone retaining walls, shaded pavilions, and constant proximity to cool subterranean water created an internal microclimate up to 6 degrees Celsius cooler than the surface ambient air.',
      },
      {
        letter: 'D',
        text: 'During the British colonial era in the nineteenth century, the traditional stepwell system experienced severe neglect and catastrophic decline. European administrators viewed the communal pools as unhygienic breeding grounds for waterborne parasites and introduced mechanical municipal pipe infrastructure. Subterranean stepwells were abandoned, filled with debris, or deliberately capped with concrete. Consequently, centuries of localized hydrological knowledge were nearly extinguished.',
      },
      {
        letter: 'E',
        text: 'Today, however, mounting climate crises, erratic monsoon cycles, and the rapid depletion of regional deep-tube aquifers have sparked a renaissance of interest in ancient water harvesting techniques. Modern hydrologists and conservation architects are actively de-silting historical stepwells. When cleared of silt and restored, stepwells facilitate rapid rainwater infiltration, re-charging the surrounding water table naturally and offering decentralized, sustainable climate resilience.',
      },
    ],
    questions: [
      {
        id: 'rq_m_1',
        questionNumber: 1,
        type: 'multiple_choice',
        question: 'According to Paragraph A, why did ancient builders excavate stepwells rather than rely purely on surface reservoirs?',
        options: [
          'Surface reservoirs evaporated rapidly during long periods of relentless drought',
          'Surface waters were reserved exclusively for royal irrigation canals',
          'Religious mandates strictly prohibited collecting water from open rivers',
          'Subterranean rock formations prevented surface dam construction',
        ],
        correctAnswer: 'Surface reservoirs evaporated rapidly during long periods of relentless drought',
        correctIndex: 0,
        paragraphRef: 'Paragraph A',
        explanation: 'Paragraph A explains that surface reservoirs quickly evaporated during the semi-arid drought, requiring subterranean excavation down to perennial aquifers.',
      },
      {
        id: 'rq_m_2',
        questionNumber: 2,
        type: 'multiple_choice',
        question: 'In Paragraph B, how did stepwells accommodate fluctuating water levels across different seasons?',
        options: [
          'Stone steps allowed people to descend progressively lower as the water receded',
          'Mechanical wooden pulleys hauled water containers directly to the upper terrace',
          'Underground valves regulated water pressure during monsoon downpours',
          'Flooding chambers forced excess groundwater into adjacent riverbeds',
        ],
        correctAnswer: 'Stone steps allowed people to descend progressively lower as the water receded',
        correctIndex: 0,
        paragraphRef: 'Paragraph B',
        explanation: 'Paragraph B highlights that as the dry season progressed and groundwater receded, more tiers of steps were exposed so people could reach the water.',
      },
      {
        id: 'rq_m_3',
        questionNumber: 3,
        type: 'multiple_choice',
        question: 'What made stepwells function as cool subterranean sanctuaries as mentioned in Paragraph C?',
        options: [
          'Thick stone retaining walls, shaded pavilions, and proximity to cool water',
          'Mechanical fan systems powered by rooftop windmills',
          'Deep ice storage vaults excavated at the bottom levels',
          'External reflective mirrors deflecting sun rays away from openings',
        ],
        correctAnswer: 'Thick stone retaining walls, shaded pavilions, and proximity to cool water',
        correctIndex: 0,
        paragraphRef: 'Paragraph C',
        explanation: 'Paragraph C details that thick retaining walls, shaded pavilions, and cool water produced an internal microclimate up to 6 degrees Celsius cooler.',
      },
      {
        id: 'rq_m_4',
        questionNumber: 4,
        type: 'multiple_choice',
        question: 'Why did British colonial administrators abandon and cap traditional stepwells in the nineteenth century?',
        options: [
          'They considered communal pools unhygienic and installed piped infrastructure',
          'Earthquakes had compromised the structural stability of the stone pavilions',
          'Local populations refused to pay municipal taxes for stepwell maintenance',
          'The groundwater had turned excessively saline and acidic',
        ],
        correctAnswer: 'They considered communal pools unhygienic and installed piped infrastructure',
        correctIndex: 0,
        paragraphRef: 'Paragraph D',
        explanation: 'Paragraph D states administrators saw communal pools as unhygienic breeding grounds for parasites and replaced them with mechanical pipes.',
      },
      {
        id: 'rq_m_5',
        questionNumber: 5,
        type: 'true_false_not_given',
        question: 'TRUE / FALSE / NOT GIVEN: Rani ki Vav contains fewer than one hundred decorative sculptures.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        correctAnswer: 'FALSE',
        correctIndex: 1,
        paragraphRef: 'Paragraph C',
        explanation: 'Paragraph C mentions that Rani ki Vav was adorned with "hundreds of intricate stone sculptures", directly contradicting fewer than one hundred.',
      },
      {
        id: 'rq_m_6',
        questionNumber: 6,
        type: 'true_false_not_given',
        question: 'TRUE / FALSE / NOT GIVEN: Stepwells served both utilitarian hydrological and communal social functions.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        correctAnswer: 'TRUE',
        correctIndex: 0,
        paragraphRef: 'Paragraph B',
        explanation: 'Paragraph B explicitly states that beyond hydraulic functions, stepwells served as vital social hubs and sanctuaries.',
      },
      {
        id: 'rq_m_7',
        questionNumber: 7,
        type: 'true_false_not_given',
        question: 'TRUE / FALSE / NOT GIVEN: Modern de-silting projects have completely eliminated drought across all of Gujarat.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        correctAnswer: 'NOT GIVEN',
        correctIndex: 2,
        paragraphRef: 'Paragraph E',
        explanation: 'Paragraph E explains that de-silting facilitates rainwater infiltration and natural recharge, but does not claim drought has been completely eliminated.',
      },
      {
        id: 'rq_m_8',
        questionNumber: 8,
        type: 'multiple_choice',
        question: 'According to Paragraph E, what primary ecological benefit does restoring silted stepwells offer today?',
        options: [
          'Facilitating rainwater infiltration to recharge surrounding underground aquifers',
          'Generating hydroelectric power for rural farming cooperatives',
          'Eliminating the need for municipal wastewater treatment plants',
          'Creating protected sanctuaries for endangered migratory fish species',
        ],
        correctAnswer: 'Facilitating rainwater infiltration to recharge surrounding underground aquifers',
        correctIndex: 0,
        paragraphRef: 'Paragraph E',
        explanation: 'Paragraph E explicitly states that restored stepwells facilitate rapid rainwater infiltration and recharge the surrounding water table naturally.',
      },
      {
        id: 'rq_m_9',
        questionNumber: 9,
        type: 'true_false_not_given',
        question: 'TRUE / FALSE / NOT GIVEN: In the sixth century, stepwells were originally designed with computerized water filtration.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        correctAnswer: 'FALSE',
        correctIndex: 1,
        paragraphRef: 'Paragraph A',
        explanation: 'The technology in the 6th century was masonry and manual excavation; computerized filtration is completely false.',
      },
      {
        id: 'rq_m_10',
        questionNumber: 10,
        type: 'multiple_choice',
        question: 'Which title best summarizes the central message of the whole passage?',
        options: [
          'The Rise, Fall, and Ecological Renaissance of Ancient Stepwell Engineering',
          'The Health Dangers of Unfiltered Communal Wells in Modern Cities',
          'A Comparison of British Municipal Piping and Desert Canals',
          'Sculptural Iconography of Queens in Medieval Western India',
        ],
        correctAnswer: 'The Rise, Fall, and Ecological Renaissance of Ancient Stepwell Engineering',
        correctIndex: 0,
        paragraphRef: 'Whole Passage',
        explanation: 'The passage tracks the inception (A/B), artistic zenith (C), colonial decline (D), and modern sustainable revival (E) of stepwells.',
      },
    ],
  },

  Challenging: {
    id: 'reading_chal_1',
    tier: 'Challenging',
    passageTitle: 'The Mycorrhizal Web: Underground Arboreal Communication Networks',
    passageSubtitle: 'Investigating how fungal symbiosis facilitates resource allocation and defense signaling across forest biomes.',
    passageCategory: 'Evolutionary Botany & Ecology',
    timeAllowedMinutes: 20,
    paragraphs: [
      {
        letter: 'A',
        text: 'For generations, orthodox forestry theory viewed the woodland canopy primarily through the lens of Darwinian competition: towering individual trees ruthlessly competing with their neighbors for solar irradiance, soil moisture, and essential nitrogen. However, over the past three decades, groundbreaking isotopic tracing experiments led by forest ecologists have demolished this individualistic paradigm. Rather than isolated entities fighting in zero-sum rivalry, trees are interconnected through an intricate, subterranean biological internet known as the mycorrhizal fungal network.',
      },
      {
        letter: 'B',
        text: 'Mycorrhizae represent a mutualistic symbiosis between plant root tips and microscopic fungal hyphae. Because fungi lack chlorophyll, they cannot synthesize carbohydrates through photosynthesis; instead, they depend on host trees for up to 30 percent of their fixed carbon sugars. In return, the hyper-dense, expansive mycelial threads permeate microscopic soil pores inaccessible to coarser tree roots, extracting phosphorus, nitrogen, potassium, and water to deliver back to their photosynthetic partners.',
      },
      {
        letter: 'C',
        text: 'Crucially, these fungal networks do not merely link a tree to the soil; they link trees directly to one another. Known colloquially as the "Wood Wide Web," mature older trees—often designated by researchers as "Mother Trees"—act as central logistical hubs in complex scale-free network topologies. Utilizing radioactive carbon isotopes (Carbon-14), scientists demonstrated that a mature Douglas fir growing in full sunlight will pump surplus photosynthate sugars through fungal conduits to nourish shade-stunted saplings growing beneath dense canopies.',
      },
      {
        letter: 'D',
        text: 'Furthermore, the communication across mycorrhizal networks extends beyond energetic nourishment to active biochemical defense warnings. When an individual tree is colonized by herbivorous insects such as aphids or pathogenic fungi, it rapidly synthesizes volatile organic defense compounds, including methyl jasmonate. Simultaneously, it broadcasts biochemical warning impulses through the connecting fungal hyphae. Neighboring trees receiving these subterranean signals preemptively ramp up their production of defensive tannins and protease inhibitors hours before the pests physically arrive.',
      },
      {
        letter: 'E',
        text: 'Despite the profound ecological implications of this research, intensive commercial monoculture forestry continues to disrupt mycorrhizal ecosystems. Clear-cut harvesting, heavy industrial soil compaction, and chemical fungicide applications sever the delicate fungal scaffolding. Without this subterranean support system, replanted single-species plantations exhibit heightened vulnerability to pest infestations, drought stress, and catastrophic die-offs. Preserving fungal network integrity is increasingly recognized as vital for forest resilience in an era of accelerating climate upheaval.',
      },
    ],
    questions: [
      {
        id: 'rq_c_1',
        questionNumber: 1,
        type: 'multiple_choice',
        question: 'According to Paragraph A, how did isotopic tracing experiments alter traditional orthodox forestry assumptions?',
        options: [
          'They disproved the assumption that forest trees operate solely as competitive, isolated entities',
          'They proved that trees do not require solar radiation to produce energy',
          'They established that underground fungi act as aggressive parasites destroying root systems',
          'They confirmed that canopy density is unrelated to soil nitrogen levels',
        ],
        correctAnswer: 'They disproved the assumption that forest trees operate solely as competitive, isolated entities',
        correctIndex: 0,
        paragraphRef: 'Paragraph A',
        explanation: 'Paragraph A explains that experiments demolished the orthodox view of individualistic competition, proving trees are interconnected via fungal networks.',
      },
      {
        id: 'rq_c_2',
        questionNumber: 2,
        type: 'multiple_choice',
        question: 'In Paragraph B, what essential reciprocal benefit do fungal mycelia provide to their host trees?',
        options: [
          'Extracting vital minerals and water from tiny soil pores inaccessible to tree roots',
          'Synthesizing chlorophyll to boost photosynthetic sugar generation',
          'Directly neutralizing toxic industrial pesticides in the atmosphere',
          'Constructing mechanical barriers that block all ground herbivores',
        ],
        correctAnswer: 'Extracting vital minerals and water from tiny soil pores inaccessible to tree roots',
        correctIndex: 0,
        paragraphRef: 'Paragraph B',
        explanation: 'Paragraph B states that mycelial threads permeate microscopic pores, extracting phosphorus, nitrogen, potassium, and water for the tree.',
      },
      {
        id: 'rq_c_3',
        questionNumber: 3,
        type: 'true_false_not_given',
        question: 'TRUE / FALSE / NOT GIVEN: Fungi produce their own carbohydrates independently through chlorophyll synthesis.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        correctAnswer: 'FALSE',
        correctIndex: 1,
        paragraphRef: 'Paragraph B',
        explanation: 'Paragraph B explicitly notes: "Because fungi lack chlorophyll, they cannot synthesize carbohydrates through photosynthesis."',
      },
      {
        id: 'rq_c_4',
        questionNumber: 4,
        type: 'multiple_choice',
        question: 'What did radioactive carbon-14 isotope experiments reveal about "Mother Trees" in Paragraph C?',
        options: [
          'They transfer surplus photosynthate sugars to nourish shaded saplings nearby',
          'They deliberately starve surrounding saplings to monopolize root territory',
          'They absorb all fungal minerals without returning any carbon sugars',
          'They undergo rapid radioactive mutation during drought seasons',
        ],
        correctAnswer: 'They transfer surplus photosynthate sugars to nourish shaded saplings nearby',
        correctIndex: 0,
        paragraphRef: 'Paragraph C',
        explanation: 'Paragraph C states that mature trees pump surplus photosynthate sugars through fungal conduits to nourish shade-stunted saplings.',
      },
      {
        id: 'rq_c_5',
        questionNumber: 5,
        type: 'multiple_choice',
        question: 'According to Paragraph D, how do neighboring trees respond when they receive warning signals via fungal hyphae?',
        options: [
          'They preemptively synthesize protective tannins and protease inhibitors',
          'They immediately shed all their leaves to prevent insect colonization',
          'They emit sonic vibrations that physically repel predatory beetles',
          'They sever their connection with the fungal network to isolate infection',
        ],
        correctAnswer: 'They preemptively synthesize protective tannins and protease inhibitors',
        correctIndex: 0,
        paragraphRef: 'Paragraph D',
        explanation: 'Paragraph D explains that neighbors receiving subterranean signals preemptively ramp up defensive tannins and protease inhibitors.',
      },
      {
        id: 'rq_c_6',
        questionNumber: 6,
        type: 'true_false_not_given',
        question: 'TRUE / FALSE / NOT GIVEN: Chemical fungicides used in commercial forestry help preserve the delicate mycelial scaffolding.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        correctAnswer: 'FALSE',
        correctIndex: 1,
        paragraphRef: 'Paragraph E',
        explanation: 'Paragraph E states clear-cutting and fungicide applications sever and disrupt the delicate fungal scaffolding.',
      },
      {
        id: 'rq_c_7',
        questionNumber: 7,
        type: 'true_false_not_given',
        question: 'TRUE / FALSE / NOT GIVEN: Single-species commercial plantations with severed networks exhibit greater vulnerability to environmental stresses.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        correctAnswer: 'TRUE',
        correctIndex: 0,
        paragraphRef: 'Paragraph E',
        explanation: 'Paragraph E notes that without the fungal system, plantations exhibit heightened vulnerability to pest infestations and drought.',
      },
      {
        id: 'rq_c_8',
        questionNumber: 8,
        type: 'true_false_not_given',
        question: 'TRUE / FALSE / NOT GIVEN: The researcher Suzanne Simard received a Nobel Prize for her work on Mother Trees.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        correctAnswer: 'NOT GIVEN',
        correctIndex: 2,
        paragraphRef: 'Whole Passage',
        explanation: 'The text discusses the scientific findings but never mentions awards or Nobel Prizes.',
      },
      {
        id: 'rq_c_9',
        questionNumber: 9,
        type: 'multiple_choice',
        question: 'What term does the author use in Paragraph C to describe the interconnected arboreal system?',
        options: ['The Wood Wide Web', 'The Subterranean Pipeline', 'The Mycelial Supercomputer', 'The Forest Foliage Grid'],
        correctAnswer: 'The Wood Wide Web',
        correctIndex: 0,
        paragraphRef: 'Paragraph C',
        explanation: 'Paragraph C explicitly states: "Known colloquially as the \'Wood Wide Web\'".',
      },
      {
        id: 'rq_c_10',
        questionNumber: 10,
        type: 'multiple_choice',
        question: 'What is the primary conclusion drawn by the author in Paragraph E?',
        options: [
          'Protecting fungal network integrity is essential for sustainable forest resilience',
          'All commercial forestry should immediately cease in every continent',
          'Fungi will inevitably eradicate all hardwood trees by the end of the century',
          'Artificial synthetic fertilizers are superior to natural mycorrhizal symbiosis',
        ],
        correctAnswer: 'Protecting fungal network integrity is essential for sustainable forest resilience',
        correctIndex: 0,
        paragraphRef: 'Paragraph E',
        explanation: 'Paragraph E concludes: "Preserving fungal network integrity is increasingly recognized as vital for forest resilience in an era of accelerating climate upheaval."',
      },
    ],
  },
};

export const getReadingTestSet = (tier: string): ReadingTestSet => {
  return READING_TEST_SETS[tier] || READING_TEST_SETS.Moderate;
};
