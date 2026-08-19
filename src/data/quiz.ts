export type Question = {
  id: number;
  category: string;
  difficulty: number; // 1-5
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  rewardPoints: number;
};

export const QUIZZES: Question[] = [
  { id: 1, category: 'mivne haatom', difficulty: 1,
    question: 'From what is the atomic nucleus composed?',
    options: ['Protons and electrons', 'Protons and neutrons', 'Neutrons and electrons', 'Only protons'],
    correctIndex: 1, explanation: 'The nucleus contains protons (positively charged) and neutrons (neutral). Electrons orbit around the nucleus.', rewardPoints: 10 },
  { id: 2, category: 'protons', difficulty: 1,
    question: 'What determines the atomic number (Z) of an element?',
    options: ['Number of neutrons', 'Number of electrons', 'Number of protons', 'Atomic mass'],
    correctIndex: 2, explanation: 'The atomic number Z equals the number of protons. This is the unique identifier of each element.', rewardPoints: 10 },
  { id: 3, category: 'element id', difficulty: 1,
    question: 'Which element has 8 protons?',
    options: ['Nitrogen (N)', 'Oxygen (O)', 'Fluorine (F)', 'Neon (Ne)'],
    correctIndex: 1, explanation: 'Oxygen has 8 protons. Atomic number 8.', rewardPoints: 10 },
  { id: 4, category: 'states', difficulty: 1,
    question: 'Which of the following is a liquid at room temperature?',
    options: ['Iron (Fe)', 'Mercury (Hg)', 'Aluminum (Al)', 'Copper (Cu)'],
    correctIndex: 1, explanation: 'Mercury is the only metal that is liquid at room temperature. Melting point: -38.8 C.', rewardPoints: 15 },
  { id: 5, category: 'atom structure', difficulty: 2,
    question: 'How many electrons can fit in the first shell (closest to nucleus)?',
    options: ['2', '8', '18', '1'],
    correctIndex: 0, explanation: 'The first shell (K) can hold a maximum of 2 electrons. The second shell can hold up to 8.', rewardPoints: 15 },
  { id: 6, category: 'isotopes', difficulty: 2,
    question: 'What is the difference between isotopes of the same element?',
    options: ['Different number of protons', 'Different number of neutrons', 'Different number of electrons', 'Different electric charge'],
    correctIndex: 1, explanation: 'Isotopes have the same number of protons but different numbers of neutrons. E.g., C-12 (6 neutrons) and C-14 (8 neutrons).', rewardPoints: 20 },
  { id: 7, category: 'periodicity', difficulty: 2,
    question: 'What do elements in the same group (column) share?',
    options: ['Same mass', 'Same number of valence electrons', 'Same number of protons', 'Same state of matter'],
    correctIndex: 1, explanation: 'Elements in the same group have the same number of electrons in their outer shell, giving them similar chemical properties.', rewardPoints: 20 },
  { id: 8, category: 'element id', difficulty: 3,
    question: 'Which element has 79 protons?',
    options: ['Platinum (Pt)', 'Gold (Au)', 'Silver (Ag)', 'Lead (Pb)'],
    correctIndex: 1, explanation: 'Gold (Au) has 79 protons. It is a chemically inert precious yellow metal.', rewardPoints: 25 },
  { id: 9, category: 'properties', difficulty: 2,
    question: 'Which element has the highest electronegativity?',
    options: ['Oxygen (O)', 'Nitrogen (N)', 'Fluorine (F)', 'Chlorine (Cl)'],
    correctIndex: 2, explanation: 'Fluorine has the highest electronegativity (3.98 on the Pauling scale). It is the most electronegative element.', rewardPoints: 20 },
  { id: 10, category: 'states', difficulty: 3,
    question: 'At what temperature does water boil (in Celsius)?',
    options: ['0', '50', '100', '212'],
    correctIndex: 2, explanation: 'Water boils at 100 C (212 F) at sea level. Freezing point is 0 C.', rewardPoints: 10 },
  { id: 11, category: 'periodic trends', difficulty: 3,
    question: 'What happens to atomic radius across a period (left to right)?',
    options: ['Increases', 'Decreases', 'Stays the same', 'Changes randomly'],
    correctIndex: 1, explanation: 'Atomic radius decreases across a period due to increasing nuclear charge pulling electrons closer.', rewardPoints: 30 },
  { id: 12, category: 'electron config', difficulty: 4,
    question: 'What is the electron configuration of Carbon (C)?',
    options: ['1s2 2s2 2p2', '1s2 2s2 2p4', '1s2 2s2 2p6', '1s2 2s2 2p1'],
    correctIndex: 0, explanation: 'Carbon has 6 electrons: 2 in the first shell, 4 in the second. Configuration: 1s2 2s2 2p2.', rewardPoints: 35 },
  { id: 13, category: 'metals', difficulty: 3,
    question: 'Which metal is the best electrical conductor?',
    options: ['Copper (Cu)', 'Gold (Au)', 'Aluminum (Al)', 'Silver (Ag)'],
    correctIndex: 3, explanation: 'Silver is the best electrical conductor. Copper is second but more widely used due to cost.', rewardPoints: 25 },
  { id: 14, category: 'gases', difficulty: 2,
    question: 'Which gas makes up about 78% of the atmosphere?',
    options: ['Oxygen (O2)', 'Nitrogen (N2)', 'Carbon dioxide (CO2)', 'Argon (Ar)'],
    correctIndex: 1, explanation: 'Nitrogen makes up 78% of air. Oxygen 21%, Argon 0.93%, CO2 0.04%.', rewardPoints: 10 },
  { id: 15, category: 'chemistry', difficulty: 4,
    question: 'What happens when Sodium (Na) reacts with water?',
    options: ['Quiet dissolution', 'Slow heat release', 'Violent reaction with yellow flame', 'No reaction'],
    correctIndex: 2, explanation: 'Sodium reacts violently with water, releasing hydrogen gas and heat that produces a yellow flame.', rewardPoints: 35 },
  { id: 16, category: 'history', difficulty: 2,
    question: 'Who created the first periodic table?',
    options: ['Albert Einstein', 'Dmitri Mendeleev', 'Marie Curie', 'Isaac Newton'],
    correctIndex: 1, explanation: 'Dmitri Mendeleev published the first periodic table in 1869.', rewardPoints: 20 },
  { id: 17, category: 'atom structure', difficulty: 5,
    question: 'Which uranium isotope is used as nuclear fuel?',
    options: ['235', '238', '239', '232'],
    correctIndex: 0, explanation: 'Uranium-235 is used as nuclear fuel. It has 92 protons and 143 neutrons (total 235). U-238 is more common.', rewardPoints: 40 },
  { id: 18, category: 'groups', difficulty: 4,
    question: 'Which group does Neon (Ne) belong to?',
    options: ['Halogens', 'Noble gases', 'Alkali metals', 'Transition metals'],
    correctIndex: 1, explanation: 'Neon belongs to the Noble Gases (Group 18). They have full valence shells, making them stable and unreactive.', rewardPoints: 15 },
  { id: 19, category: 'atom structure', difficulty: 4,
    question: 'How many electrons are in the outer shell of Oxygen (O)?',
    options: ['2', '4', '6', '8'],
    correctIndex: 2, explanation: 'Oxygen has 8 total electrons. 2 in first shell, 6 in second (outer). It needs 2 more to complete its octet.', rewardPoints: 25 },
  { id: 20, category: 'elements', difficulty: 2,
    question: 'Which of the following is a metalloid?',
    options: ['Oxygen (O)', 'Silicon (Si)', 'Silver (Ag)', 'Neon (Ne)'],
    correctIndex: 1, explanation: 'Silicon is a metalloid with properties of both metals and non-metals. It is used in chip manufacturing.', rewardPoints: 15 },
  { id: 21, category: 'radioactivity', difficulty: 4,
    question: 'What is the heaviest naturally occurring radioactive element?',
    options: ['Plutonium (Pu)', 'Uranium (U)', 'Radium (Ra)', 'Radon (Rn)'],
    correctIndex: 1, explanation: 'Uranium (Z=92) is the heaviest naturally occurring radioactive element. All elements beyond it are synthetic.', rewardPoints: 35 },
  { id: 22, category: 'physical', difficulty: 3,
    question: 'What is the melting point of Iron (Fe)?',
    options: ['1064 C', '1538 C', '660 C', '327 C'],
    correctIndex: 1, explanation: 'Iron melts at 1538 C. For comparison: Gold at 1064 C, Aluminum at 660 C.', rewardPoints: 30 },
  { id: 23, category: 'electron config', difficulty: 5,
    question: 'Why does Copper (Cu) have configuration [Ar] 3d10 4s1 instead of [Ar] 3d9 4s2?',
    options: ['Configuration error', 'Preference for filled d-shell', 'No difference', 'Temperature dependent'],
    correctIndex: 1, explanation: 'A full d-subshell provides extra stability. Copper "prefers" a full 3d10 shell over a full 4s2.', rewardPoints: 50 },
  { id: 24, category: 'periodicity', difficulty: 3,
    question: 'How many elements are in the periodic table?',
    options: ['92', '103', '118', '126'],
    correctIndex: 2, explanation: 'The periodic table contains 118 confirmed elements, from H (Z=1) to Og (Z=118). 92 occur in nature.', rewardPoints: 20 },
  { id: 25, category: 'properties', difficulty: 5,
    question: 'What is the densest element?',
    options: ['Gold (Au)', 'Platinum (Pt)', 'Osmium (Os)', 'Uranium (U)'],
    correctIndex: 2, explanation: 'Osmium is the densest element at 22.59 g/cm3. Iridium is second (22.56). Gold: 19.32.', rewardPoints: 40 },
];

export function getRandomQuestions(count: number, maxDifficulty?: number): Question[] {
  let pool = [...QUIZZES];
  if (maxDifficulty) pool = pool.filter(q => q.difficulty <= maxDifficulty);
  const shuffled = pool.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, pool.length));
}

export function getQuestionsByCategory(category: string): Question[] {
  return QUIZZES.filter(q => q.category === category);
}
