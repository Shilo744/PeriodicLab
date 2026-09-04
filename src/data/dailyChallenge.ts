import { getElement } from './elements';
import { getDailyFeaturedElement } from './achievements';

export interface DailyChallenge {
  z: number;
  dateStr: string;
  kind: 'atomic-number' | 'category' | 'state' | 'valence-electrons';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const CATEGORIES = ['Nonmetal', 'Noble gas', 'Alkali metal', 'Alkaline earth', 'Metalloid', 'Post-transition', 'Transition metal', 'Halogen', 'Actinide', 'Lanthanide', 'Unknown'];

function rotate<T>(values: T[], amount: number): T[] {
  const offset = amount % values.length;
  return [...values.slice(offset), ...values.slice(0, offset)];
}

function optionsWithAnswer(answer: string, alternatives: string[], seed: number): string[] {
  const distractors = rotate(alternatives.filter(value => value !== answer), seed).slice(0, 3);
  return rotate([answer, ...distractors], seed + 1);
}

function wrapAtomicNumber(value: number): number {
  return ((value - 1) % 118) + 1;
}

export function getDailyChallenge(today: Date = new Date()): DailyChallenge {
  const daily = getDailyFeaturedElement(today);
  const element = getElement(daily.z);
  const kind = (['atomic-number', 'category', 'state', 'valence-electrons'] as const)[daily.z % 4];
  const valenceElectrons = element.shells[element.shells.length - 1];
  let answer: string;
  let question: string;
  let options: string[];

  if (kind === 'category') {
    answer = element.category;
    question = `Which family or category does ${element.nameEn} belong to?`;
    options = optionsWithAnswer(answer, CATEGORIES, daily.z);
  } else if (kind === 'state') {
    answer = element.state;
    question = `What is the usual state of ${element.nameEn} at standard conditions?`;
    options = optionsWithAnswer(answer, ['solid', 'liquid', 'gas', 'unknown'], daily.z);
  } else if (kind === 'valence-electrons') {
    answer = String(valenceElectrons);
    question = `How many electrons are in ${element.nameEn}'s outermost shell?`;
    options = optionsWithAnswer(answer, Array.from({ length: 9 }, (_, index) => String(index)), daily.z);
  } else {
    answer = String(daily.z);
    question = `What is the atomic number of ${element.nameEn} (${element.sym})?`;
    options = optionsWithAnswer(answer, [7, 19, 41].map(offset => String(wrapAtomicNumber(daily.z + offset))), daily.z);
  }

  return {
    z: daily.z,
    dateStr: daily.dateStr,
    kind,
    question,
    options,
    correctIndex: options.indexOf(answer),
    explanation: `${answer} is correct. ${element.desc}`,
  };
}
