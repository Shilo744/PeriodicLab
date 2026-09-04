import { getElement } from './elements';
import { getDailyFeaturedElement } from './achievements';

export interface DailyChallenge {
  z: number;
  dateStr: string;
  question: string;
  options: number[];
  correctIndex: number;
  explanation: string;
}

function wrapAtomicNumber(value: number): number {
  return ((value - 1) % 118) + 1;
}

export function getDailyChallenge(today: Date = new Date()): DailyChallenge {
  const daily = getDailyFeaturedElement(today);
  const element = getElement(daily.z);
  const candidates = [0, 7, 19, 41].map(offset => wrapAtomicNumber(daily.z + offset));
  const rotation = (daily.z + today.getDate()) % candidates.length;
  const options = [...candidates.slice(rotation), ...candidates.slice(0, rotation)];

  return {
    z: daily.z,
    dateStr: daily.dateStr,
    question: `What is the atomic number of ${element.nameEn} (${element.sym})?`,
    options,
    correctIndex: options.indexOf(daily.z),
    explanation: `${element.nameEn} is element ${daily.z}. ${element.desc}`,
  };
}
