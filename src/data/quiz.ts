export type QuestionCategory = 
  | 'structure' 
  | 'groups' 
  | 'trends' 
  | 'reactions' 
  | 'history' 
  | 'applications'
  | 'bonding'
  | 'superheavy';

export type Question = {
  id: number;
  category: QuestionCategory;
  difficulty: number; // 1-5
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  rewardPoints: number;
};

export const QUIZZES: Question[] = [
  // --- Structure & Subatomic Particles ---
  {
    id: 1, category: 'structure', difficulty: 1,
    question: 'What subatomic particles reside within the atomic nucleus?',
    options: ['Protons and Electrons', 'Protons and Neutrons', 'Neutrons and Electrons', 'Only Protons'],
    correctIndex: 1,
    explanation: 'The atomic nucleus consists of positively charged protons and electrically neutral neutrons bound by the strong nuclear force.',
    rewardPoints: 15
  },
  {
    id: 2, category: 'structure', difficulty: 1,
    question: 'What fundamental property uniquely defines an element\'s atomic number (Z)?',
    options: ['Total number of Neutrons', 'Total number of Electrons', 'Total number of Protons', 'Standard Atomic Mass'],
    correctIndex: 2,
    explanation: 'The atomic number (Z) equals the exact count of protons in the nucleus, defining the chemical identity of the element.',
    rewardPoints: 15
  },
  {
    id: 3, category: 'structure', difficulty: 2,
    question: 'What maximum number of electrons can inhabit the first quantum shell (n = 1)?',
    options: ['2 electrons', '8 electrons', '18 electrons', '32 electrons'],
    correctIndex: 0,
    explanation: 'The first principal shell (K-shell, n=1) contains only the 1s subshell, holding a maximum of 2 electrons with opposite spins.',
    rewardPoints: 20
  },
  {
    id: 4, category: 'structure', difficulty: 2,
    question: 'What distinguishes different isotopes of the same chemical element?',
    options: ['Different proton count', 'Different neutron count', 'Different electron count', 'Different net charge'],
    correctIndex: 1,
    explanation: 'Isotopes possess the identical number of protons (same Z) but differing numbers of neutrons in their nucleus (e.g. Carbon-12 vs Carbon-14).',
    rewardPoints: 20
  },
  {
    id: 5, category: 'structure', difficulty: 3,
    question: 'Which quantum rule states that no two electrons in an atom can have the same four quantum numbers?',
    options: ['Hund\'s Rule', 'Pauli Exclusion Principle', 'Aufbau Principle', 'Heisenberg Uncertainty Principle'],
    correctIndex: 1,
    explanation: 'The Pauli Exclusion Principle dictates that an orbital can hold a maximum of two electrons, and they must have opposite spins.',
    rewardPoints: 25
  },
  {
    id: 6, category: 'structure', difficulty: 4,
    question: 'What is the ground-state electron configuration of Chromium (Z = 24)?',
    options: ['[Ar] 3d⁴ 4s²', '[Ar] 3d⁵ 4s¹', '[Ar] 3d⁶ 4s⁰', '[Ar] 4s² 4p⁴'],
    correctIndex: 1,
    explanation: 'Chromium promotes an electron from 4s to 3d to achieve a half-filled 3d⁵ subshell, which grants enhanced exchange energy stability.',
    rewardPoints: 35
  },
  {
    id: 7, category: 'structure', difficulty: 4,
    question: 'Why does Copper (Z = 29) adopt an anomalous configuration [Ar] 3d¹⁰ 4s¹?',
    options: ['Measurement uncertainty', 'Fully filled d-subshell stability', 'Relativistic contraction', 'High ionization potential'],
    correctIndex: 1,
    explanation: 'A completely filled 3d¹⁰ subshell provides greater thermodynamic stability than a partially filled 3d⁹ 4s² state.',
    rewardPoints: 35
  },

  // --- Periodic Groups & Chemical Families ---
  {
    id: 8, category: 'groups', difficulty: 1,
    question: 'Which chemical group contains elements with full valence electron shells that are chemically inert?',
    options: ['Alkali Metals', 'Halogens', 'Noble Gases', 'Alkaline Earth Metals'],
    correctIndex: 2,
    explanation: 'Noble gases (Group 18) have complete valence shells (octet, or duet for He), rendering them exceptionally stable and unreactive.',
    rewardPoints: 15
  },
  {
    id: 9, category: 'groups', difficulty: 2,
    question: 'Why do elements in the same vertical column (Group) exhibit similar chemical properties?',
    options: ['Same atomic mass', 'Identical valence electron count', 'Same number of neutrons', 'Equal density'],
    correctIndex: 1,
    explanation: 'Elements within a periodic group share the same number of electrons in their outermost shell, dictating their bonding behavior.',
    rewardPoints: 20
  },
  {
    id: 10, category: 'groups', difficulty: 2,
    question: 'Which group 1 alkali metal produces a violent hydrogen explosion when placed in water?',
    options: ['Aluminum (Al)', 'Sodium (Na)', 'Lead (Pb)', 'Silver (Ag)'],
    correctIndex: 1,
    explanation: 'Sodium rapidly oxidizes in water, producing aqueous sodium hydroxide and flammable hydrogen gas with vigorous exothermic heat.',
    rewardPoints: 20
  },
  {
    id: 11, category: 'groups', difficulty: 2,
    question: 'Which of the following is the only nonmetallic element that exists as a liquid at STP?',
    options: ['Mercury (Hg)', 'Bromine (Br)', 'Gallium (Ga)', 'Chlorine (Cl)'],
    correctIndex: 1,
    explanation: 'Bromine is a reddish-brown halogen and the only nonmetal that is liquid at standard temperature and pressure.',
    rewardPoints: 25
  },
  {
    id: 12, category: 'groups', difficulty: 3,
    question: 'Which group contains the most chemically active nonmetals on the periodic table?',
    options: ['Group 17 (Halogens)', 'Group 18 (Noble Gases)', 'Group 14 (Carbon Group)', 'Group 16 (Chalcogens)'],
    correctIndex: 0,
    explanation: 'Halogens require just one electron to complete their octet, making them extremely electronegative and reactive oxidizing agents.',
    rewardPoints: 25
  },
  {
    id: 13, category: 'groups', difficulty: 3,
    question: 'What collective name is given to the f-block elements with atomic numbers 57 to 71?',
    options: ['Actinides', 'Lanthanides', 'Alkali Metals', 'Transition Metals'],
    correctIndex: 1,
    explanation: 'The Lanthanide series (La through Lu) consists of 15 rare earth elements characterized by the progressive filling of 4f orbitals.',
    rewardPoints: 25
  },

  // --- Periodic Trends ---
  {
    id: 14, category: 'trends', difficulty: 2,
    question: 'What element possesses the highest electronegativity on the Pauling scale?',
    options: ['Oxygen (O)', 'Chlorine (Cl)', 'Fluorine (F)', 'Nitrogen (N)'],
    correctIndex: 2,
    explanation: 'Fluorine has an electronegativity value of 3.98, the highest of all elements, due to its small radius and high effective nuclear charge.',
    rewardPoints: 20
  },
  {
    id: 15, category: 'trends', difficulty: 3,
    question: 'How does atomic radius generally change as you move from left to right across a period?',
    options: ['Increases steadily', 'Decreases steadily', 'Remains constant', 'Fluctuates randomly'],
    correctIndex: 1,
    explanation: 'Across a period, increasing nuclear charge pulls the electron cloud closer to the nucleus without adding new principal energy shells.',
    rewardPoints: 25
  },
  {
    id: 16, category: 'trends', difficulty: 3,
    question: 'What general trend occurs for first ionization energy moving down a periodic group?',
    options: ['Increases down the group', 'Decreases down the group', 'Remains identical', 'Doubles per period'],
    correctIndex: 1,
    explanation: 'Ionization energy decreases down a group because valence electrons are located further from the nucleus and shielded by inner shells.',
    rewardPoints: 25
  },
  {
    id: 17, category: 'trends', difficulty: 4,
    question: 'What phenomenon causes second- and third-row transition metals (e.g. Zr and Hf) to have nearly identical atomic radii?',
    options: ['Relativistic Expansion', 'Lanthanide Contraction', 'Inert Pair Effect', 'Jahn-Teller Effect'],
    correctIndex: 1,
    explanation: 'The poor shielding of 4f electrons in lanthanides causes a steady reduction in ionic radius, neutralizing expected radial expansion.',
    rewardPoints: 35
  },
  {
    id: 18, category: 'trends', difficulty: 4,
    question: 'Which of the following pure elements has the highest melting point (3422 °C)?',
    options: ['Osmium (Os)', 'Carbon (Diamond)', 'Tungsten (W)', 'Tantalum (Ta)'],
    correctIndex: 2,
    explanation: 'Tungsten (W, Z=74) has the highest melting point of all metals (3422 °C) due to strong covalent-metallic bonding across 5d orbitals.',
    rewardPoints: 30
  },
  {
    id: 19, category: 'trends', difficulty: 5,
    question: 'Which element is confirmed as the densest naturally occurring material on Earth (22.59 g/cm³)?',
    options: ['Lead (Pb)', 'Gold (Au)', 'Iridium (Ir)', 'Osmium (Os)'],
    correctIndex: 3,
    explanation: 'Osmium (Os, Z=76) has a density of 22.59 g/cm³, marginally edging out Iridium (22.56 g/cm³) as the densest element.',
    rewardPoints: 40
  },

  // --- Real-world Applications & Famous Discoveries ---
  {
    id: 20, category: 'applications', difficulty: 2,
    question: 'Which gas accounts for approximately 78% of Earth\'s atmospheric volume?',
    options: ['Oxygen (O₂)', 'Nitrogen (N₂)', 'Argon (Ar)', 'Carbon Dioxide (CO₂)'],
    correctIndex: 1,
    explanation: 'Diatomic nitrogen (N₂) constitutes roughly 78.08% of Earth\'s air, with oxygen providing 20.95% and argon 0.93%.',
    rewardPoints: 15
  },
  {
    id: 21, category: 'applications', difficulty: 2,
    question: 'Which metalloid element is the fundamental substrate for microprocessors and integrated circuits?',
    options: ['Germanium (Ge)', 'Boron (B)', 'Silicon (Si)', 'Arsenic (As)'],
    correctIndex: 2,
    explanation: 'Silicon\'s abundance, semiconducting bandgap, and stable natural oxide layer (SiO₂) make it the global standard for computer chips.',
    rewardPoints: 20
  },
  {
    id: 22, category: 'applications', difficulty: 3,
    question: 'Which element exhibits the highest electrical and thermal conductivity of all known metals?',
    options: ['Gold (Au)', 'Copper (Cu)', 'Silver (Ag)', 'Graphene'],
    correctIndex: 2,
    explanation: 'Silver (Ag, Z=47) possesses the highest electrical conductivity and thermal conductivity of all elements.',
    rewardPoints: 25
  },
  {
    id: 23, category: 'applications', difficulty: 3,
    question: 'Which synthetic isotope is used in millions of household ionization smoke detectors?',
    options: ['Americium-241', 'Cobalt-60', 'Cesium-137', 'Polonium-210'],
    correctIndex: 0,
    explanation: 'Americium-241 emits alpha particles that ionize air in a detection chamber; smoke entering disrupts the current and triggers the alarm.',
    rewardPoints: 25
  },
  {
    id: 24, category: 'applications', difficulty: 3,
    question: 'Which element melts at only 29.76 °C, liquefying in a warm human hand?',
    options: ['Lead (Pb)', 'Gallium (Ga)', 'Tin (Sn)', 'Indium (In)'],
    correctIndex: 1,
    explanation: 'Gallium (Ga, Z=31) has an unusually low melting point of 29.76 °C, well below standard human body temperature.',
    rewardPoints: 25
  },
  {
    id: 25, category: 'applications', difficulty: 4,
    question: 'Which radioactive element isotope (U-235) is the primary fissile fuel in nuclear energy reactors?',
    options: ['Uranium-238', 'Uranium-235', 'Thorium-232', 'Plutonium-238'],
    correctIndex: 1,
    explanation: 'Uranium-235 is fissile, meaning it can sustain a nuclear fission chain reaction when struck by thermal neutrons.',
    rewardPoints: 30
  },

  // --- History & Nuclear Synthesis ---
  {
    id: 26, category: 'history', difficulty: 2,
    question: 'Who published the first periodic table arranged by periodic atomic weight in 1869?',
    options: ['Antoine Lavoisier', 'Dmitri Mendeleev', 'John Dalton', 'Ernest Rutherford'],
    correctIndex: 1,
    explanation: 'Dmitri Mendeleev formulated the Periodic Law and famously predicted the properties of undiscovered elements like Gallium and Germanium.',
    rewardPoints: 20
  },
  {
    id: 27, category: 'history', difficulty: 3,
    question: 'Which Polish-French scientist discovered Polonium and Radium, winning Nobel Prizes in Physics and Chemistry?',
    options: ['Lise Meitner', 'Marie Curie', 'Rosalind Franklin', 'Irène Joliot-Curie'],
    correctIndex: 1,
    explanation: 'Marie Curie discovered radioactivity and two elements (Po and Ra), becoming the first person to win Nobel Prizes in two distinct sciences.',
    rewardPoints: 25
  },
  {
    id: 28, category: 'history', difficulty: 4,
    question: 'What is currently the highest atomic number element officially recognized on the Periodic Table (Z = 118)?',
    options: ['Tennessine (Ts)', 'Moscovium (Mc)', 'Oganesson (Og)', 'Flerovium (Fl)'],
    correctIndex: 2,
    explanation: 'Oganesson (Og, Z=118) completes the 7th period of the periodic table, named after Russian nuclear physicist Yuri Oganessian.',
    rewardPoints: 30
  },
  {
    id: 29, category: 'history', difficulty: 4,
    question: 'What is the heaviest naturally occurring primordial element found on Earth in significant quantity?',
    options: ['Bismuth (Z=83)', 'Radium (Z=88)', 'Uranium (Z=92)', 'Plutonium (Z=94)'],
    correctIndex: 2,
    explanation: 'Uranium (Z=92) is the heaviest element that occurs in primordial abundance in Earth\'s crust; elements beyond are synthetic.',
    rewardPoints: 30
  },
  {
    id: 30, category: 'reactions', difficulty: 4,
    question: 'What type of radioactive decay occurs when a neutron turns into a proton, emitting an electron and antineutrino?',
    options: ['Alpha (α) Decay', 'Beta Minus (β⁻) Decay', 'Beta Plus (β⁺) Decay', 'Gamma (γ) Radiation'],
    correctIndex: 1,
    explanation: 'In Beta-minus (β⁻) decay, a down quark transforms into an up quark, converting a neutron into a proton and increasing Z by +1.',
    rewardPoints: 35
  },

  // --- Chemical Bonding & Molecular Shape ---
  {
    id: 31, category: 'bonding', difficulty: 1,
    question: 'What happens to valence electrons when a typical ionic bond forms?',
    options: ['They disappear', 'They remain equally shared', 'They are transferred between atoms', 'They become neutrons'],
    correctIndex: 2,
    explanation: 'Ionic bonding typically begins with electron transfer, creating oppositely charged ions that attract electrostatically.',
    rewardPoints: 15
  },
  {
    id: 32, category: 'bonding', difficulty: 1,
    question: 'What is the defining feature of a covalent bond?',
    options: ['Transferred protons', 'Shared electron pairs', 'Free-moving nuclei', 'Radioactive decay'],
    correctIndex: 1,
    explanation: 'A covalent bond forms when atoms share one or more pairs of valence electrons.',
    rewardPoints: 15
  },
  {
    id: 33, category: 'bonding', difficulty: 2,
    question: 'Which model best describes bonding in a solid metal?',
    options: ['Separate neutral molecules', 'Alternating neutrons and protons', 'Only localized electron pairs', 'Positive ions in delocalized electrons'],
    correctIndex: 3,
    explanation: 'Metallic bonding is modeled as positive metal ions held together by mobile, delocalized valence electrons.',
    rewardPoints: 20
  },
  {
    id: 34, category: 'bonding', difficulty: 2,
    question: 'Why is a water molecule bent rather than linear?',
    options: ['Hydrogen has d orbitals', 'Oxygen has no valence electrons', 'Two lone pairs repel bonding pairs', 'Gravity bends the bonds'],
    correctIndex: 2,
    explanation: 'Four electron domains surround oxygen; two are lone pairs whose stronger repulsion produces a bent molecular shape.',
    rewardPoints: 20
  },
  {
    id: 35, category: 'bonding', difficulty: 3,
    question: 'What is the molecular geometry of carbon dioxide, CO₂?',
    options: ['Bent', 'Linear', 'Trigonal pyramidal', 'Tetrahedral'],
    correctIndex: 1,
    explanation: 'Carbon has two electron domains in CO₂, so VSEPR predicts a linear O=C=O geometry with a 180° angle.',
    rewardPoints: 25
  },
  {
    id: 36, category: 'bonding', difficulty: 3,
    question: 'Which intermolecular attraction explains water\'s unusually high boiling point?',
    options: ['Metallic bonding', 'Ionic bonding', 'Nuclear attraction', 'Hydrogen bonding'],
    correctIndex: 3,
    explanation: 'Strong hydrogen bonds form between the partially positive hydrogen of one molecule and oxygen of another.',
    rewardPoints: 25
  },

  // --- Superheavy Elements & Modern Discovery ---
  {
    id: 37, category: 'superheavy', difficulty: 2,
    question: 'Which atomic-number range is commonly called the transactinide elements?',
    options: ['1 through 10', '57 through 71', 'Greater than 103', '89 through 103'],
    correctIndex: 2,
    explanation: 'Transactinides follow lawrencium (Z=103), beginning with rutherfordium at atomic number 104.',
    rewardPoints: 20
  },
  {
    id: 38, category: 'superheavy', difficulty: 3,
    question: 'What does the proposed island of stability describe?',
    options: ['A continent rich in uranium', 'Superheavy nuclei with relatively longer half-lives', 'A group of inert gases', 'A stable electron orbital'],
    correctIndex: 1,
    explanation: 'Certain predicted combinations of proton and neutron shell closures may make some superheavy nuclei live longer than their neighbors.',
    rewardPoints: 25
  },
  {
    id: 39, category: 'superheavy', difficulty: 3,
    question: 'Which element has atomic number 114?',
    options: ['Livermorium (Lv)', 'Nihonium (Nh)', 'Flerovium (Fl)', 'Moscovium (Mc)'],
    correctIndex: 2,
    explanation: 'Flerovium is element 114 and was named for the Flerov Laboratory of Nuclear Reactions.',
    rewardPoints: 25
  },
  {
    id: 40, category: 'superheavy', difficulty: 3,
    question: 'Which halogen-named element occupies atomic number 117?',
    options: ['Oganesson (Og)', 'Copernicium (Cn)', 'Darmstadtium (Ds)', 'Tennessine (Ts)'],
    correctIndex: 3,
    explanation: 'Tennessine, element 117, occupies group 17 beneath astatine, although its chemistry is known only from predictions and scarce atoms.',
    rewardPoints: 25
  },
  {
    id: 41, category: 'superheavy', difficulty: 4,
    question: 'How are most superheavy elements produced in laboratories?',
    options: ['Cooling noble gases', 'Bombarding heavy target nuclei with accelerated ions', 'Electrolyzing seawater', 'Splitting light with a prism'],
    correctIndex: 1,
    explanation: 'Accelerators drive ion beams into heavy targets; extremely rare fusion events can form a new, heavier nucleus.',
    rewardPoints: 30
  },
  {
    id: 42, category: 'superheavy', difficulty: 4,
    question: 'Why is direct chemistry with the heaviest elements especially difficult?',
    options: ['They cannot contain electrons', 'They are invisible to detectors', 'Only a few atoms are made and they decay quickly', 'They exist only below absolute zero'],
    correctIndex: 2,
    explanation: 'Production rates may be only a few atoms, and short half-lives leave little time for chemical experiments.',
    rewardPoints: 30
  }
];

export function getRandomQuestions(count: number, maxDifficulty?: number): Question[] {
  let pool = [...QUIZZES];
  if (maxDifficulty) pool = pool.filter(q => q.difficulty <= maxDifficulty);
  const shuffled = pool.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, pool.length));
}

export function getQuestionsByCategory(category: QuestionCategory): Question[] {
  return QUIZZES.filter(q => q.category === category);
}
