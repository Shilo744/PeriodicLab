export interface Element {
  z: number;
  sym: string;
  name: string;
  nameEn: string;
  state: 'solid' | 'liquid' | 'gas' | 'unknown';
  color: string;
  category: string;
  desc: string;
  mass: number;
  stableNeutrons: number;
  shells: number[];
  discovered: number | string;
  discoveredBy?: string;
  electronConfig: string;
  electronegativity?: number;
  density?: number;
  meltingPoint?: number;
  boilingPoint?: number;
  crystalStructure?: string; // e.g. 'FCC', 'BCC', 'HCP', 'Diamond Cubic'
  ionizationEnergy?: number; // kJ/mol
  atomicRadius?: number; // pm
}

export const ELEMENTS: Element[] = [
  {
    z: 1, sym: 'H', name: 'Hydrogen', nameEn: 'Hydrogen', state: 'gas', color: '#e8e8e8', category: 'Nonmetal',
    desc: 'Lightest and most abundant element in the universe. Colorless, odorless, highly flammable diatomic gas.',
    mass: 1.008, stableNeutrons: 0, shells: [1], discovered: 1766, discoveredBy: 'Henry Cavendish',
    electronConfig: '1s¹', electronegativity: 2.20, density: 0.00008988, meltingPoint: -259.16, boilingPoint: -252.87,
    crystalStructure: 'Hexagonal', ionizationEnergy: 1312, atomicRadius: 53
  },
  {
    z: 2, sym: 'He', name: 'Helium', nameEn: 'Helium', state: 'gas', color: '#d6d6e0', category: 'Noble gas',
    desc: 'Inert, colorless noble gas. Second lightest and second most abundant element in the observable universe.',
    mass: 4.0026, stableNeutrons: 2, shells: [2], discovered: 1868, discoveredBy: 'Pierre Janssen, Norman Lockyer',
    electronConfig: '1s²', electronegativity: undefined, density: 0.0001785, meltingPoint: -272.20, boilingPoint: -268.93,
    crystalStructure: 'HCP', ionizationEnergy: 2372, atomicRadius: 31
  },
  {
    z: 3, sym: 'Li', name: 'Lithium', nameEn: 'Lithium', state: 'solid', color: '#c0c0c0', category: 'Alkali metal',
    desc: 'Soft, silvery-white alkali metal. Lightest metal and least dense solid element under standard conditions.',
    mass: 6.94, stableNeutrons: 4, shells: [2, 1], discovered: 1817, discoveredBy: 'Johan August Arfwedson',
    electronConfig: '[He] 2s¹', electronegativity: 0.98, density: 0.534, meltingPoint: 180.54, boilingPoint: 1342,
    crystalStructure: 'BCC', ionizationEnergy: 520, atomicRadius: 167
  },
  {
    z: 4, sym: 'Be', name: 'Beryllium', nameEn: 'Beryllium', state: 'solid', color: '#a0a0a0', category: 'Alkaline earth',
    desc: 'Relatively rare, divalent alkaline earth metal. Steel-gray, strong, lightweight and brittle.',
    mass: 9.0122, stableNeutrons: 5, shells: [2, 2], discovered: 1798, discoveredBy: 'Louis-Nicolas Vauquelin',
    electronConfig: '[He] 2s²', electronegativity: 1.57, density: 1.85, meltingPoint: 1287, boilingPoint: 2470,
    crystalStructure: 'HCP', ionizationEnergy: 899, atomicRadius: 112
  },
  {
    z: 5, sym: 'B', name: 'Boron', nameEn: 'Boron', state: 'solid', color: '#8a6e45', category: 'Metalloid',
    desc: 'Low-abundance metalloid synthesized entirely by cosmic ray spallation and supernovae.',
    mass: 10.81, stableNeutrons: 6, shells: [2, 3], discovered: 1808, discoveredBy: 'Joseph Louis Gay-Lussac, Louis Jacques Thénard',
    electronConfig: '[He] 2s² 2p¹', electronegativity: 2.04, density: 2.34, meltingPoint: 2076, boilingPoint: 3927,
    crystalStructure: 'Rhombohedral', ionizationEnergy: 801, atomicRadius: 87
  },
  {
    z: 6, sym: 'C', name: 'Carbon', nameEn: 'Carbon', state: 'solid', color: '#404040', category: 'Nonmetal',
    desc: 'Basis of all known organic life. Forms versatile allotropes including graphite, diamond, and graphene.',
    mass: 12.011, stableNeutrons: 6, shells: [2, 4], discovered: 'Ancient', discoveredBy: 'Known to antiquity',
    electronConfig: '[He] 2s² 2p²', electronegativity: 2.55, density: 2.267, meltingPoint: 3550, boilingPoint: 4827,
    crystalStructure: 'Diamond Cubic / Hexagonal', ionizationEnergy: 1086, atomicRadius: 67
  },
  {
    z: 7, sym: 'N', name: 'Nitrogen', nameEn: 'Nitrogen', state: 'gas', color: '#c0d0e0', category: 'Nonmetal',
    desc: 'Transparent, odorless diatomic gas making up about 78% of Earth\'s atmosphere. Essential in amino acids.',
    mass: 14.007, stableNeutrons: 7, shells: [2, 5], discovered: 1772, discoveredBy: 'Daniel Rutherford',
    electronConfig: '[He] 2s² 2p³', electronegativity: 3.04, density: 0.0012506, meltingPoint: -210.00, boilingPoint: -195.79
  },
  {
    z: 8, sym: 'O', name: 'Oxygen', nameEn: 'Oxygen', state: 'gas', color: '#b0d0ff', category: 'Nonmetal',
    desc: 'Highly reactive nonmetal and oxidizing agent. Makes up 21% of Earth\'s atmosphere and essential for aerobic respiration.',
    mass: 15.999, stableNeutrons: 8, shells: [2, 6], discovered: 1774, discoveredBy: 'Joseph Priestley, Carl Wilhelm Scheele',
    electronConfig: '[He] 2s² 2p⁴', electronegativity: 3.44, density: 0.001429, meltingPoint: -218.79, boilingPoint: -182.96
  },
  {
    z: 9, sym: 'F', name: 'Fluorine', nameEn: 'Fluorine', state: 'gas', color: '#90e090', category: 'Halogen',
    desc: 'Extremely toxic, pale yellow halogen gas. Most electronegative and chemically reactive of all elements.',
    mass: 18.998, stableNeutrons: 10, shells: [2, 7], discovered: 1886, discoveredBy: 'Henri Moissan',
    electronConfig: '[He] 2s² 2p⁵', electronegativity: 3.98, density: 0.001696, meltingPoint: -219.67, boilingPoint: -188.11
  },
  {
    z: 10, sym: 'Ne', name: 'Neon', nameEn: 'Neon', state: 'gas', color: '#ff6b6b', category: 'Noble gas',
    desc: 'Colorless, odorless noble gas. Glows with a reddish-orange light in high-voltage electrical discharge signs.',
    mass: 20.180, stableNeutrons: 10, shells: [2, 8], discovered: 1898, discoveredBy: 'William Ramsay, Morris Travers',
    electronConfig: '[He] 2s² 2p⁶', electronegativity: undefined, density: 0.0009002, meltingPoint: -248.59, boilingPoint: -246.05
  },
  {
    z: 11, sym: 'Na', name: 'Sodium', nameEn: 'Sodium', state: 'solid', color: '#c0c0c0', category: 'Alkali metal',
    desc: 'Soft, silvery-white, highly reactive alkali metal. Reacts vigorously with water to produce hydrogen gas.',
    mass: 22.990, stableNeutrons: 12, shells: [2, 8, 1], discovered: 1807, discoveredBy: 'Humphry Davy',
    electronConfig: '[Ne] 3s¹', electronegativity: 0.93, density: 0.968, meltingPoint: 97.79, boilingPoint: 882.9
  },
  {
    z: 12, sym: 'Mg', name: 'Magnesium', nameEn: 'Magnesium', state: 'solid', color: '#c0c0c0', category: 'Alkaline earth',
    desc: 'Shiny gray alkaline earth metal. Burns with an intense, brilliant white light; vital in cellular energy metabolism.',
    mass: 24.305, stableNeutrons: 12, shells: [2, 8, 2], discovered: 1755, discoveredBy: 'Joseph Black',
    electronConfig: '[Ne] 3s²', electronegativity: 1.31, density: 1.738, meltingPoint: 650, boilingPoint: 1090
  },
  {
    z: 13, sym: 'Al', name: 'Aluminium', nameEn: 'Aluminium', state: 'solid', color: '#c0c8d0', category: 'Post-transition',
    desc: 'Low density, corrosion-resistant post-transition metal. Most abundant metallic element in Earth\'s crust.',
    mass: 26.982, stableNeutrons: 14, shells: [2, 8, 3], discovered: 1825, discoveredBy: 'Hans Christian Ørsted',
    electronConfig: '[Ne] 3s² 3p¹', electronegativity: 1.61, density: 2.70, meltingPoint: 660.32, boilingPoint: 2470
  },
  {
    z: 14, sym: 'Si', name: 'Silicon', nameEn: 'Silicon', state: 'solid', color: '#506070', category: 'Metalloid',
    desc: 'Hard, brittle crystalline metalloid with blue-grey metallic lustre. The foundation of modern semiconductor chips.',
    mass: 28.085, stableNeutrons: 14, shells: [2, 8, 4], discovered: 1824, discoveredBy: 'Jöns Jacob Berzelius',
    electronConfig: '[Ne] 3s² 3p²', electronegativity: 1.90, density: 2.329, meltingPoint: 1414, boilingPoint: 3265
  },
  {
    z: 15, sym: 'P', name: 'Phosphorus', nameEn: 'Phosphorus', state: 'solid', color: '#c05030', category: 'Nonmetal',
    desc: 'Highly reactive nonmetal existing in white, red, and black allotropes. Essential component of DNA, RNA, and ATP.',
    mass: 30.974, stableNeutrons: 16, shells: [2, 8, 5], discovered: 1669, discoveredBy: 'Hennig Brand',
    electronConfig: '[Ne] 3s² 3p³', electronegativity: 2.19, density: 1.823, meltingPoint: 44.15, boilingPoint: 280.5
  },
  {
    z: 16, sym: 'S', name: 'Sulfur', nameEn: 'Sulfur', state: 'solid', color: '#e8c820', category: 'Nonmetal',
    desc: 'Bright yellow crystalline solid at room temperature. Essential element for all life, found in cysteine and methionine.',
    mass: 32.06, stableNeutrons: 16, shells: [2, 8, 6], discovered: 'Ancient', discoveredBy: 'Known to antiquity',
    electronConfig: '[Ne] 3s² 3p⁴', electronegativity: 2.58, density: 2.07, meltingPoint: 115.21, boilingPoint: 444.72
  },
  {
    z: 17, sym: 'Cl', name: 'Chlorine', nameEn: 'Chlorine', state: 'gas', color: '#60d060', category: 'Halogen',
    desc: 'Yellow-green halogen gas. Powerful oxidizing and bleaching agent widely used as a water disinfectant.',
    mass: 35.45, stableNeutrons: 18, shells: [2, 8, 7], discovered: 1774, discoveredBy: 'Carl Wilhelm Scheele',
    electronConfig: '[Ne] 3s² 3p⁵', electronegativity: 3.16, density: 0.0032, meltingPoint: -101.5, boilingPoint: -34.04
  },
  {
    z: 18, sym: 'Ar', name: 'Argon', nameEn: 'Argon', state: 'gas', color: '#c0d0e8', category: 'Noble gas',
    desc: 'Colorless, odorless noble gas. Third most abundant gas in Earth\'s atmosphere, used as an inert shielding gas in welding.',
    mass: 39.948, stableNeutrons: 22, shells: [2, 8, 8], discovered: 1894, discoveredBy: 'Lord Rayleigh, William Ramsay',
    electronConfig: '[Ne] 3s² 3p⁶', electronegativity: undefined, density: 0.001784, meltingPoint: -189.34, boilingPoint: -185.85
  },
  {
    z: 19, sym: 'K', name: 'Potassium', nameEn: 'Potassium', state: 'solid', color: '#c0c0c0', category: 'Alkali metal',
    desc: 'Silvery-white, soft alkali metal. Crucial nutrient for biological nerve impulse transmission and muscle contraction.',
    mass: 39.098, stableNeutrons: 20, shells: [2, 8, 8, 1], discovered: 1807, discoveredBy: 'Humphry Davy',
    electronConfig: '[Ar] 4s¹', electronegativity: 0.82, density: 0.862, meltingPoint: 63.5, boilingPoint: 759
  },
  {
    z: 20, sym: 'Ca', name: 'Calcium', nameEn: 'Calcium', state: 'solid', color: '#c0c0c0', category: 'Alkaline earth',
    desc: 'Reactive, silvery-white alkaline earth metal. Fifth most abundant element in Earth\'s crust and vital for bone structure.',
    mass: 40.078, stableNeutrons: 20, shells: [2, 8, 8, 2], discovered: 1808, discoveredBy: 'Humphry Davy',
    electronConfig: '[Ar] 4s²', electronegativity: 1.00, density: 1.55, meltingPoint: 842, boilingPoint: 1484
  },
  {
    z: 21, sym: 'Sc', name: 'Scandium', nameEn: 'Scandium', state: 'solid', color: '#c0c0c0', category: 'Transition metal',
    desc: 'Silvery-white metallic transition metal. Used in aerospace components and high-intensity sports equipment alloys.',
    mass: 44.956, stableNeutrons: 24, shells: [2, 8, 9, 2], discovered: 1879, discoveredBy: 'Lars Fredrik Nilson',
    electronConfig: '[Ar] 3d¹ 4s²', electronegativity: 1.36, density: 2.985, meltingPoint: 1541, boilingPoint: 2836
  },
  {
    z: 22, sym: 'Ti', name: 'Titanium', nameEn: 'Titanium', state: 'solid', color: '#808080', category: 'Transition metal',
    desc: 'Lustrous transition metal with a silver color, low density, and immense strength. Outstanding corrosion resistance.',
    mass: 47.867, stableNeutrons: 26, shells: [2, 8, 10, 2], discovered: 1791, discoveredBy: 'William Gregor',
    electronConfig: '[Ar] 3d² 4s²', electronegativity: 1.54, density: 4.506, meltingPoint: 1668, boilingPoint: 3287
  },
  {
    z: 23, sym: 'V', name: 'Vanadium', nameEn: 'Vanadium', state: 'solid', color: '#808080', category: 'Transition metal',
    desc: 'Hard, silvery-grey, ductile transition metal. Primarily used in steel alloys to increase strength and shock resistance.',
    mass: 50.942, stableNeutrons: 28, shells: [2, 8, 11, 2], discovered: 1801, discoveredBy: 'Andrés Manuel del Río',
    electronConfig: '[Ar] 3d³ 4s²', electronegativity: 1.63, density: 6.11, meltingPoint: 1910, boilingPoint: 3407
  },
  {
    z: 24, sym: 'Cr', name: 'Chromium', nameEn: 'Chromium', state: 'solid', color: '#a0a0b0', category: 'Transition metal',
    desc: 'Steely-grey, lustrous, hard transition metal with high melting point. Notable for its half-filled 3d⁵ 4s¹ quantum state.',
    mass: 51.996, stableNeutrons: 28, shells: [2, 8, 13, 1], discovered: 1797, discoveredBy: 'Louis-Nicolas Vauquelin',
    electronConfig: '[Ar] 3d⁵ 4s¹', electronegativity: 1.66, density: 7.19, meltingPoint: 1907, boilingPoint: 2671
  },
  {
    z: 25, sym: 'Mn', name: 'Manganese', nameEn: 'Manganese', state: 'solid', color: '#a0a0a0', category: 'Transition metal',
    desc: 'Hard, brittle silvery metal often found in minerals in combination with iron. Essential in stainless steel production.',
    mass: 54.938, stableNeutrons: 30, shells: [2, 8, 13, 2], discovered: 1774, discoveredBy: 'Johan Gottlieb Gahn',
    electronConfig: '[Ar] 3d⁵ 4s²', electronegativity: 1.55, density: 7.21, meltingPoint: 1246, boilingPoint: 2061
  },
  {
    z: 26, sym: 'Fe', name: 'Iron', nameEn: 'Iron', state: 'solid', color: '#a08060', category: 'Transition metal',
    desc: 'Most common element on Earth by mass, forming much of Earth\'s outer and inner core. Centerpiece of hemoglobin.',
    mass: 55.845, stableNeutrons: 30, shells: [2, 8, 14, 2], discovered: 'Ancient', discoveredBy: 'Known to antiquity',
    electronConfig: '[Ar] 3d⁶ 4s²', electronegativity: 1.83, density: 7.874, meltingPoint: 1538, boilingPoint: 2862
  },
  {
    z: 27, sym: 'Co', name: 'Cobalt', nameEn: 'Cobalt', state: 'solid', color: '#9090a0', category: 'Transition metal',
    desc: 'Hard, lustrous, silver-gray ferromagnetic transition metal. Crucial component in rechargeable lithium-ion battery cathodes.',
    mass: 58.933, stableNeutrons: 32, shells: [2, 8, 15, 2], discovered: 1735, discoveredBy: 'Georg Brandt',
    electronConfig: '[Ar] 3d⁷ 4s²', electronegativity: 1.88, density: 8.90, meltingPoint: 1495, boilingPoint: 2927
  },
  {
    z: 28, sym: 'Ni', name: 'Nickel', nameEn: 'Nickel', state: 'solid', color: '#a0a0a0', category: 'Transition metal',
    desc: 'Silvery-white lustrous metal with a slight golden tinge. Corrosion-resistant, used extensively in superalloys and plating.',
    mass: 58.693, stableNeutrons: 31, shells: [2, 8, 16, 2], discovered: 1751, discoveredBy: 'Axel Fredrik Cronstedt',
    electronConfig: '[Ar] 3d⁸ 4s²', electronegativity: 1.91, density: 8.908, meltingPoint: 1455, boilingPoint: 2913
  },
  {
    z: 29, sym: 'Cu', name: 'Copper', nameEn: 'Copper', state: 'solid', color: '#b87333', category: 'Transition metal',
    desc: 'Soft, malleable, and ductile reddish metal with very high thermal and electrical conductivity. Features filled 3d¹⁰ 4s¹ shells.',
    mass: 63.546, stableNeutrons: 35, shells: [2, 8, 18, 1], discovered: 'Ancient', discoveredBy: 'Known to antiquity',
    electronConfig: '[Ar] 3d¹⁰ 4s¹', electronegativity: 1.90, density: 8.96, meltingPoint: 1084.62, boilingPoint: 2562
  },
  {
    z: 30, sym: 'Zn', name: 'Zinc', nameEn: 'Zinc', state: 'solid', color: '#a0a8b0', category: 'Transition metal',
    desc: 'Slightly brittle, bluish-silvery transition metal. Widely used for galvanizing steel against rust and corrosion.',
    mass: 65.38, stableNeutrons: 35, shells: [2, 8, 18, 2], discovered: 'Ancient', discoveredBy: 'Known to Indian metallurgists',
    electronConfig: '[Ar] 3d¹⁰ 4s²', electronegativity: 1.65, density: 7.14, meltingPoint: 419.53, boilingPoint: 907
  },
  {
    z: 31, sym: 'Ga', name: 'Gallium', nameEn: 'Gallium', state: 'solid', color: '#c0c0c0', category: 'Post-transition',
    desc: 'Soft, silvery-blue post-transition metal. Melts at just 29.76 °C, easily liquefying in the palm of a human hand.',
    mass: 69.723, stableNeutrons: 39, shells: [2, 8, 18, 3], discovered: 1875, discoveredBy: 'Paul-Émile Lecoq de Boisbaudran',
    electronConfig: '[Ar] 3d¹⁰ 4s² 4p¹', electronegativity: 1.81, density: 5.91, meltingPoint: 29.76, boilingPoint: 2204
  },
  {
    z: 32, sym: 'Ge', name: 'Germanium', nameEn: 'Germanium', state: 'solid', color: '#8090a0', category: 'Metalloid',
    desc: 'Lustrous, hard, grayish-white metalloid. Key historical semiconductor element used in radar and early transistors.',
    mass: 72.630, stableNeutrons: 41, shells: [2, 8, 18, 4], discovered: 1886, discoveredBy: 'Clemens Winkler',
    electronConfig: '[Ar] 3d¹⁰ 4s² 4p²', electronegativity: 2.01, density: 5.323, meltingPoint: 938.25, boilingPoint: 2833
  },
  {
    z: 33, sym: 'As', name: 'Arsenic', nameEn: 'Arsenic', state: 'solid', color: '#606060', category: 'Metalloid',
    desc: 'Brittle, metallic-grey metalloid. Historically notorious for toxicity; used as a doping agent in semiconductors.',
    mass: 74.922, stableNeutrons: 42, shells: [2, 8, 18, 5], discovered: 1250, discoveredBy: 'Albertus Magnus',
    electronConfig: '[Ar] 3d¹⁰ 4s² 4p³', electronegativity: 2.18, density: 5.727, meltingPoint: 817, boilingPoint: 614
  },
  {
    z: 34, sym: 'Se', name: 'Selenium', nameEn: 'Selenium', state: 'solid', color: '#b06030', category: 'Nonmetal',
    desc: 'Nonmetal with properties intermediate between sulfur and tellurium. Photoconductive, used in glassmaking and photocells.',
    mass: 78.971, stableNeutrons: 45, shells: [2, 8, 18, 6], discovered: 1817, discoveredBy: 'Jöns Jacob Berzelius',
    electronConfig: '[Ar] 3d¹⁰ 4s² 4p⁴', electronegativity: 2.55, density: 4.81, meltingPoint: 221, boilingPoint: 685
  },
  {
    z: 35, sym: 'Br', name: 'Bromine', nameEn: 'Bromine', state: 'liquid', color: '#a02020', category: 'Halogen',
    desc: 'Red-brown fuming halogen liquid at room temperature. Only nonmetallic liquid element under standard conditions.',
    mass: 79.904, stableNeutrons: 45, shells: [2, 8, 18, 7], discovered: 1826, discoveredBy: 'Antoine Jérôme Balard',
    electronConfig: '[Ar] 3d¹⁰ 4s² 4p⁵', electronegativity: 2.96, density: 3.1028, meltingPoint: -7.2, boilingPoint: 58.8
  },
  {
    z: 36, sym: 'Kr', name: 'Krypton', nameEn: 'Krypton', state: 'gas', color: '#c0d0e8', category: 'Noble gas',
    desc: 'Colorless, odorless, heavy noble gas. Characterized by bright green and orange-red spectral lines in discharge tubes.',
    mass: 83.798, stableNeutrons: 48, shells: [2, 8, 18, 8], discovered: 1898, discoveredBy: 'William Ramsay, Morris Travers',
    electronConfig: '[Ar] 3d¹⁰ 4s² 4p⁶', electronegativity: 3.00, density: 0.003749, meltingPoint: -157.36, boilingPoint: -153.22
  },
  {
    z: 37, sym: 'Rb', name: 'Rubidium', nameEn: 'Rubidium', state: 'solid', color: '#c0c0c0', category: 'Alkali metal',
    desc: 'Extremely soft, silvery-white alkali metal. Spontaneously ignites in air and reacts violently with water.',
    mass: 85.468, stableNeutrons: 48, shells: [2, 8, 18, 8, 1], discovered: 1861, discoveredBy: 'Robert Bunsen, Gustav Kirchhoff',
    electronConfig: '[Kr] 5s¹', electronegativity: 0.82, density: 1.532, meltingPoint: 39.30, boilingPoint: 688
  },
  {
    z: 38, sym: 'Sr', name: 'Strontium', nameEn: 'Strontium', state: 'solid', color: '#c0c0c0', category: 'Alkaline earth',
    desc: 'Soft, yellowish-silver alkaline earth metal. Gives a brilliant, intense crimson red color to fireworks and flares.',
    mass: 87.62, stableNeutrons: 50, shells: [2, 8, 18, 8, 2], discovered: 1790, discoveredBy: 'Adair Crawford',
    electronConfig: '[Kr] 5s²', electronegativity: 0.95, density: 2.64, meltingPoint: 777, boilingPoint: 1382
  },
  {
    z: 39, sym: 'Y', name: 'Yttrium', nameEn: 'Yttrium', state: 'solid', color: '#c0c0c0', category: 'Transition metal',
    desc: 'Silvery-metallic transition metal. Used in high-temperature superconductors and red phosphor in older CRT displays.',
    mass: 88.906, stableNeutrons: 50, shells: [2, 8, 18, 9, 2], discovered: 1794, discoveredBy: 'Johan Gadolin',
    electronConfig: '[Kr] 4d¹ 5s²', electronegativity: 1.22, density: 4.472, meltingPoint: 1526, boilingPoint: 3336
  },
  {
    z: 40, sym: 'Zr', name: 'Zirconium', nameEn: 'Zirconium', state: 'solid', color: '#a0a0a0', category: 'Transition metal',
    desc: 'Lustrous, greyish-white, strong transition metal. Exceptional resistance to corrosion by acids and used in nuclear reactor cladding.',
    mass: 91.224, stableNeutrons: 51, shells: [2, 8, 18, 10, 2], discovered: 1789, discoveredBy: 'Martin Heinrich Klaproth',
    electronConfig: '[Kr] 4d² 5s²', electronegativity: 1.33, density: 6.52, meltingPoint: 1855, boilingPoint: 4409
  },
  {
    z: 41, sym: 'Nb', name: 'Niobium', nameEn: 'Niobium', state: 'solid', color: '#a0a0a0', category: 'Transition metal',
    desc: 'Light grey, crystalline, ductile transition metal. Becomes a superconductor at cryogenic temperatures, used in MRI magnets.',
    mass: 92.906, stableNeutrons: 52, shells: [2, 8, 18, 12, 1], discovered: 1801, discoveredBy: 'Charles Hatchett',
    electronConfig: '[Kr] 4d⁴ 5s¹', electronegativity: 1.60, density: 8.57, meltingPoint: 2477, boilingPoint: 4744
  },
  {
    z: 42, sym: 'Mo', name: 'Molybdenum', nameEn: 'Molybdenum', state: 'solid', color: '#808080', category: 'Transition metal',
    desc: 'Silvery metal with one of the highest melting points of all pure elements. High-strength steel alloy component.',
    mass: 95.95, stableNeutrons: 54, shells: [2, 8, 18, 13, 1], discovered: 1778, discoveredBy: 'Carl Wilhelm Scheele',
    electronConfig: '[Kr] 4d⁵ 5s¹', electronegativity: 2.16, density: 10.28, meltingPoint: 2623, boilingPoint: 4639
  },
  {
    z: 43, sym: 'Tc', name: 'Technetium', nameEn: 'Technetium', state: 'solid', color: '#a0a0a0', category: 'Transition metal',
    desc: 'First artificially produced chemical element. Radioisotope Tc-99m is the most widely used medical diagnostic tracer.',
    mass: 98, stableNeutrons: 55, shells: [2, 8, 18, 13, 2], discovered: 1937, discoveredBy: 'Emilio Segrè, Carlo Perrier',
    electronConfig: '[Kr] 4d⁵ 5s²', electronegativity: 1.90, density: 11.0, meltingPoint: 2157, boilingPoint: 4265
  },
  {
    z: 44, sym: 'Ru', name: 'Ruthenium', nameEn: 'Ruthenium', state: 'solid', color: '#a0a0a0', category: 'Transition metal',
    desc: 'Rare polyvalent transition metal belonging to the platinum group. Exceptional catalyst in chemical syntheses.',
    mass: 101.07, stableNeutrons: 58, shells: [2, 8, 18, 15, 1], discovered: 1844, discoveredBy: 'Karl Ernst Claus',
    electronConfig: '[Kr] 4d⁷ 5s¹', electronegativity: 2.20, density: 12.45, meltingPoint: 2334, boilingPoint: 4150
  },
  {
    z: 45, sym: 'Rh', name: 'Rhodium', nameEn: 'Rhodium', state: 'solid', color: '#c0c0c0', category: 'Transition metal',
    desc: 'Extremely rare, silvery-white, hard, corrosion-resistant platinum group metal. Chiefly used in catalytic converters.',
    mass: 102.91, stableNeutrons: 58, shells: [2, 8, 18, 16, 1], discovered: 1803, discoveredBy: 'William Hyde Wollaston',
    electronConfig: '[Kr] 4d⁸ 5s¹', electronegativity: 2.28, density: 12.41, meltingPoint: 1964, boilingPoint: 3695
  },
  {
    z: 46, sym: 'Pd', name: 'Palladium', nameEn: 'Palladium', state: 'solid', color: '#c0c0c0', category: 'Transition metal',
    desc: 'Lustrous silvery-white metal. Has the unique ability to absorb up to 900 times its own volume of hydrogen gas.',
    mass: 106.42, stableNeutrons: 60, shells: [2, 8, 18, 18, 0], discovered: 1803, discoveredBy: 'William Hyde Wollaston',
    electronConfig: '[Kr] 4d¹⁰', electronegativity: 2.20, density: 12.023, meltingPoint: 1554.9, boilingPoint: 2963
  },
  {
    z: 47, sym: 'Ag', name: 'Silver', nameEn: 'Silver', state: 'solid', color: '#c0c0cf', category: 'Transition metal',
    desc: 'Soft, white, lustrous transition metal. Possesses the highest electrical and thermal conductivity of any known metal.',
    mass: 107.87, stableNeutrons: 61, shells: [2, 8, 18, 18, 1], discovered: 'Ancient', discoveredBy: 'Known to antiquity',
    electronConfig: '[Kr] 4d¹⁰ 5s¹', electronegativity: 1.93, density: 10.49, meltingPoint: 961.78, boilingPoint: 2162
  },
  {
    z: 48, sym: 'Cd', name: 'Cadmium', nameEn: 'Cadmium', state: 'solid', color: '#a0a0a0', category: 'Transition metal',
    desc: 'Soft, bluish-white transition metal. Used in rechargeable nickel-cadmium batteries and nuclear control rods.',
    mass: 112.41, stableNeutrons: 64, shells: [2, 8, 18, 18, 2], discovered: 1817, discoveredBy: 'Karl Samuel Leberecht Hermann',
    electronConfig: '[Kr] 4d¹⁰ 5s²', electronegativity: 1.69, density: 8.65, meltingPoint: 321.07, boilingPoint: 767
  },
  {
    z: 49, sym: 'In', name: 'Indium', nameEn: 'Indium', state: 'solid', color: '#c0c0c0', category: 'Post-transition',
    desc: 'Very soft, malleable silvery-white post-transition metal. Indium tin oxide (ITO) is essential for touchscreen transparent conductors.',
    mass: 114.82, stableNeutrons: 66, shells: [2, 8, 18, 18, 3], discovered: 1863, discoveredBy: 'Ferdinand Reich, Hieronymous Theodor Richter',
    electronConfig: '[Kr] 4d¹⁰ 5s² 5p¹', electronegativity: 1.78, density: 7.31, meltingPoint: 156.60, boilingPoint: 2072
  },
  {
    z: 50, sym: 'Sn', name: 'Tin', nameEn: 'Tin', state: 'solid', color: '#c0c0c0', category: 'Post-transition',
    desc: 'Silvery metal that is malleable and ductile. When bent, emits a characteristic "tin cry" sound caused by crystal twinning.',
    mass: 118.71, stableNeutrons: 70, shells: [2, 8, 18, 18, 4], discovered: 'Ancient', discoveredBy: 'Known to antiquity',
    electronConfig: '[Kr] 4d¹⁰ 5s² 5p²', electronegativity: 1.96, density: 7.287, meltingPoint: 231.93, boilingPoint: 2602
  },
  {
    z: 51, sym: 'Sb', name: 'Antimony', nameEn: 'Antimony', state: 'solid', color: '#808080', category: 'Metalloid',
    desc: 'Lustrous gray metalloid found in nature mainly as the sulfide mineral stibnite. Used in flame retardants and microelectronics.',
    mass: 121.76, stableNeutrons: 71, shells: [2, 8, 18, 18, 5], discovered: 'Ancient', discoveredBy: 'Known to antiquity',
    electronConfig: '[Kr] 4d¹⁰ 5s² 5p³', electronegativity: 2.05, density: 6.697, meltingPoint: 630.63, boilingPoint: 1587
  },
  {
    z: 52, sym: 'Te', name: 'Tellurium', nameEn: 'Tellurium', state: 'solid', color: '#a0a080', category: 'Metalloid',
    desc: 'Brittle, mildly toxic, rare silver-white metalloid. Key constituent of cadmium telluride (CdTe) high-efficiency solar panels.',
    mass: 127.60, stableNeutrons: 78, shells: [2, 8, 18, 18, 6], discovered: 1782, discoveredBy: 'Franz-Joseph Müller von Reichenstein',
    electronConfig: '[Kr] 4d¹⁰ 5s² 5p⁴', electronegativity: 2.10, density: 6.24, meltingPoint: 449.51, boilingPoint: 988
  },
  {
    z: 53, sym: 'I', name: 'Iodine', nameEn: 'Iodine', state: 'solid', color: '#4060a0', category: 'Halogen',
    desc: 'Lustrous, purple-black solid nonmetal that sublimes easily into a deep violet gas. Essential dietary nutrient for thyroid hormones.',
    mass: 126.90, stableNeutrons: 74, shells: [2, 8, 18, 18, 7], discovered: 1811, discoveredBy: 'Bernard Courtois',
    electronConfig: '[Kr] 4d¹⁰ 5s² 5p⁵', electronegativity: 2.66, density: 4.933, meltingPoint: 113.7, boilingPoint: 184.3
  },
  {
    z: 54, sym: 'Xe', name: 'Xenon', nameEn: 'Xenon', state: 'gas', color: '#8080c0', category: 'Noble gas',
    desc: 'Dense, colorless, odorless noble gas. Used in high-intensity photographic flash lamps, ion propulsion thrusters in spacecraft.',
    mass: 131.29, stableNeutrons: 77, shells: [2, 8, 18, 18, 8], discovered: 1898, discoveredBy: 'William Ramsay, Morris Travers',
    electronConfig: '[Kr] 4d¹⁰ 5s² 5p⁶', electronegativity: 2.60, density: 0.005887, meltingPoint: -111.75, boilingPoint: -108.09
  },
  {
    z: 55, sym: 'Cs', name: 'Caesium', nameEn: 'Caesium', state: 'solid', color: '#c0b060', category: 'Alkali metal',
    desc: 'Soft, golden alkali metal. Resonating frequency of the caesium-133 atom defines the international standard SI unit of the second.',
    mass: 132.91, stableNeutrons: 78, shells: [2, 8, 18, 18, 8, 1], discovered: 1860, discoveredBy: 'Robert Bunsen, Gustav Kirchhoff',
    electronConfig: '[Xe] 6s¹', electronegativity: 0.79, density: 1.93, meltingPoint: 28.44, boilingPoint: 671
  },
  {
    z: 56, sym: 'Ba', name: 'Barium', nameEn: 'Barium', state: 'solid', color: '#a0a0a0', category: 'Alkaline earth',
    desc: 'Soft, silvery alkaline earth metal. Insoluble barium sulfate is used as a medical radiocontrast agent for X-ray gastrointestinal imaging.',
    mass: 137.33, stableNeutrons: 81, shells: [2, 8, 18, 18, 8, 2], discovered: 1808, discoveredBy: 'Humphry Davy',
    electronConfig: '[Xe] 6s²', electronegativity: 0.89, density: 3.51, meltingPoint: 727, boilingPoint: 1897
  },
  {
    z: 57, sym: 'La', name: 'Lanthanum', nameEn: 'Lanthanum', state: 'solid', color: '#a0a0a0', category: 'Lanthanide',
    desc: 'Soft, ductile, silvery-white rare earth element that names the lanthanide series. Used in optical glass and hybrid car batteries.',
    mass: 138.91, stableNeutrons: 82, shells: [2, 8, 18, 18, 9, 2], discovered: 1839, discoveredBy: 'Carl Gustaf Mosander',
    electronConfig: '[Xe] 5d¹ 6s²', electronegativity: 1.10, density: 6.162, meltingPoint: 920, boilingPoint: 3464
  },
  {
    z: 58, sym: 'Ce', name: 'Cerium', nameEn: 'Cerium', state: 'solid', color: '#a0a0a0', category: 'Lanthanide',
    desc: 'Most abundant of the lanthanides. Cerium oxide is an essential polishing compound for precision optics and automotive catalysts.',
    mass: 140.12, stableNeutrons: 82, shells: [2, 8, 18, 19, 9, 2], discovered: 1803, discoveredBy: 'Martin Heinrich Klaproth, Jöns Jacob Berzelius',
    electronConfig: '[Xe] 4f¹ 5d¹ 6s²', electronegativity: 1.12, density: 6.77, meltingPoint: 798, boilingPoint: 3443
  },
  {
    z: 59, sym: 'Pr', name: 'Praseodymium', nameEn: 'Praseodymium', state: 'solid', color: '#a0a0a0', category: 'Lanthanide',
    desc: 'Soft, silvery, malleable lanthanide. Used in alloy with magnesium for high-strength aircraft engines and yellow-green glasses.',
    mass: 140.91, stableNeutrons: 82, shells: [2, 8, 18, 21, 8, 2], discovered: 1885, discoveredBy: 'Carl Auer von Welsbach',
    electronConfig: '[Xe] 4f³ 6s²', electronegativity: 1.13, density: 6.77, meltingPoint: 931, boilingPoint: 3520
  },
  {
    z: 60, sym: 'Nd', name: 'Neodymium', nameEn: 'Neodymium', state: 'solid', color: '#a0a0a0', category: 'Lanthanide',
    desc: 'Hard, silvery lanthanide. Forms the basis of NdFeB permanent magnets, the strongest type of permanent magnet known.',
    mass: 144.24, stableNeutrons: 84, shells: [2, 8, 18, 22, 8, 2], discovered: 1885, discoveredBy: 'Carl Auer von Welsbach',
    electronConfig: '[Xe] 4f⁴ 6s²', electronegativity: 1.14, density: 7.01, meltingPoint: 1024, boilingPoint: 3074
  },
  {
    z: 61, sym: 'Pm', name: 'Promethium', nameEn: 'Promethium', state: 'solid', color: '#a0a0a0', category: 'Lanthanide',
    desc: 'Extremely rare, radioactive lanthanide with no stable isotopes. Used in nuclear batteries and luminous paint for instruments.',
    mass: 145, stableNeutrons: 84, shells: [2, 8, 18, 23, 8, 2], discovered: 1945, discoveredBy: 'Chien Shiung Wu, Jacob A. Marinsky',
    electronConfig: '[Xe] 4f⁵ 6s²', electronegativity: 1.13, density: 7.26, meltingPoint: 1042, boilingPoint: 3000
  },
  {
    z: 62, sym: 'Sm', name: 'Samarium', nameEn: 'Samarium', state: 'solid', color: '#a0a0a0', category: 'Lanthanide',
    desc: 'Hard silvery lanthanide. Samarium-cobalt (SmCo) magnets maintain magnetic strength at very high temperatures.',
    mass: 150.36, stableNeutrons: 88, shells: [2, 8, 18, 24, 8, 2], discovered: 1879, discoveredBy: 'Paul-Émile Lecoq de Boisbaudran',
    electronConfig: '[Xe] 4f⁶ 6s²', electronegativity: 1.17, density: 7.52, meltingPoint: 1072, boilingPoint: 1794
  },
  {
    z: 63, sym: 'Eu', name: 'Europium', nameEn: 'Europium', state: 'solid', color: '#a0a0a0', category: 'Lanthanide',
    desc: 'Most reactive lanthanide metal. Essential red phosphor in televisions and fluorescent lamps; anti-counterfeiting tag in Euro banknotes.',
    mass: 151.96, stableNeutrons: 90, shells: [2, 8, 18, 25, 8, 2], discovered: 1901, discoveredBy: 'Eugène-Anatole Demarçay',
    electronConfig: '[Xe] 4f⁷ 6s²', electronegativity: 1.20, density: 5.244, meltingPoint: 826, boilingPoint: 1529
  },
  {
    z: 64, sym: 'Gd', name: 'Gadolinium', nameEn: 'Gadolinium', state: 'solid', color: '#a0a0a0', category: 'Lanthanide',
    desc: 'Silvery-white rare earth metal with unusual paramagnetic properties. Compounds are widely used as MRI contrast agents.',
    mass: 157.25, stableNeutrons: 93, shells: [2, 8, 18, 25, 9, 2], discovered: 1880, discoveredBy: 'Jean Charles Galissard de Marignac',
    electronConfig: '[Xe] 4f⁷ 5d¹ 6s²', electronegativity: 1.20, density: 7.90, meltingPoint: 1312, boilingPoint: 3273
  },
  {
    z: 65, sym: 'Tb', name: 'Terbium', nameEn: 'Terbium', state: 'solid', color: '#a0a0a0', category: 'Lanthanide',
    desc: 'Silvery-white, malleable rare earth metal. Provides the brilliant green phosphor color in video monitors and Terfenol-D actuators.',
    mass: 158.93, stableNeutrons: 94, shells: [2, 8, 18, 27, 8, 2], discovered: 1843, discoveredBy: 'Carl Gustaf Mosander',
    electronConfig: '[Xe] 4f⁹ 6s²', electronegativity: 1.20, density: 8.23, meltingPoint: 1356, boilingPoint: 3230
  },
  {
    z: 66, sym: 'Dy', name: 'Dysprosium', nameEn: 'Dysprosium', state: 'solid', color: '#a0a0a0', category: 'Lanthanide',
    desc: 'Lanthanide with a bright silver metallic luster. High thermal neutron absorption cross section makes it ideal in nuclear control rods.',
    mass: 162.50, stableNeutrons: 98, shells: [2, 8, 18, 28, 8, 2], discovered: 1886, discoveredBy: 'Paul-Émile Lecoq de Boisbaudran',
    electronConfig: '[Xe] 4f¹⁰ 6s²', electronegativity: 1.22, density: 8.540, meltingPoint: 1407, boilingPoint: 2567
  },
  {
    z: 67, sym: 'Ho', name: 'Holmium', nameEn: 'Holmium', state: 'solid', color: '#a0a0a0', category: 'Lanthanide',
    desc: 'Soft and malleable rare-earth metal. Possesses the highest magnetic strength of any element, used in high-power flux magnets.',
    mass: 164.93, stableNeutrons: 98, shells: [2, 8, 18, 29, 8, 2], discovered: 1878, discoveredBy: 'Marc Delafontaine, Jacques-Louis Soret',
    electronConfig: '[Xe] 4f¹¹ 6s²', electronegativity: 1.23, density: 8.79, meltingPoint: 1461, boilingPoint: 2720
  },
  {
    z: 68, sym: 'Er', name: 'Erbium', nameEn: 'Erbium', state: 'solid', color: '#a0a0a0', category: 'Lanthanide',
    desc: 'Silvery-white lanthanide metal. Erbium-doped fiber amplifiers (EDFAs) form the backbone of modern global fiber optic internet.',
    mass: 167.26, stableNeutrons: 99, shells: [2, 8, 18, 30, 8, 2], discovered: 1843, discoveredBy: 'Carl Gustaf Mosander',
    electronConfig: '[Xe] 4f¹² 6s²', electronegativity: 1.24, density: 9.066, meltingPoint: 1529, boilingPoint: 2868
  },
  {
    z: 69, sym: 'Tm', name: 'Thulium', nameEn: 'Thulium', state: 'solid', color: '#a0a0a0', category: 'Lanthanide',
    desc: 'Second-least abundant of the lanthanides. Irradiated thulium isotopes serve as portable X-ray sources for medical radiography.',
    mass: 168.93, stableNeutrons: 100, shells: [2, 8, 18, 31, 8, 2], discovered: 1879, discoveredBy: 'Per Teodor Cleve',
    electronConfig: '[Xe] 4f¹³ 6s²', electronegativity: 1.25, density: 9.32, meltingPoint: 1545, boilingPoint: 1950
  },
  {
    z: 70, sym: 'Yb', name: 'Ytterbium', nameEn: 'Ytterbium', state: 'solid', color: '#a0a0a0', category: 'Lanthanide',
    desc: 'Soft, malleable, silvery-white rare earth metal. Key component in high-stability optical atomic clocks and stainless steel stress gauges.',
    mass: 173.05, stableNeutrons: 104, shells: [2, 8, 18, 32, 8, 2], discovered: 1878, discoveredBy: 'Jean Charles Galissard de Marignac',
    electronConfig: '[Xe] 4f¹⁴ 6s²', electronegativity: 1.10, density: 6.90, meltingPoint: 824, boilingPoint: 1196
  },
  {
    z: 71, sym: 'Lu', name: 'Lutetium', nameEn: 'Lutetium', state: 'solid', color: '#a0a0a0', category: 'Lanthanide',
    desc: 'Final element in the lanthanide series. Hardest and densest lanthanide, used in petroleum cracking catalysts and PET scan detectors.',
    mass: 174.97, stableNeutrons: 104, shells: [2, 8, 18, 32, 9, 2], discovered: 1907, discoveredBy: 'Georges Urbain, Carl Auer von Welsbach',
    electronConfig: '[Xe] 4f¹⁴ 5d¹ 6s²', electronegativity: 1.27, density: 9.841, meltingPoint: 1663, boilingPoint: 3402
  },
  {
    z: 72, sym: 'Hf', name: 'Hafnium', nameEn: 'Hafnium', state: 'solid', color: '#a0a0a0', category: 'Transition metal',
    desc: 'Lustrous, silvery transition metal chemically almost identical to zirconium. Used in nuclear submarine control rods and high-k chip gates.',
    mass: 178.49, stableNeutrons: 106, shells: [2, 8, 18, 32, 10, 2], discovered: 1923, discoveredBy: 'Dirk Coster, George de Hevesy',
    electronConfig: '[Xe] 4f¹⁴ 5d² 6s²', electronegativity: 1.30, density: 13.31, meltingPoint: 2233, boilingPoint: 4603
  },
  {
    z: 73, sym: 'Ta', name: 'Tantalum', nameEn: 'Tantalum', state: 'solid', color: '#808090', category: 'Transition metal',
    desc: 'Rare, hard, blue-gray refractory transition metal. Highly resistant to corrosion; essential for compact capacitors in smartphones.',
    mass: 180.95, stableNeutrons: 108, shells: [2, 8, 18, 32, 11, 2], discovered: 1802, discoveredBy: 'Anders Gustaf Ekeberg',
    electronConfig: '[Xe] 4f¹⁴ 5d³ 6s²', electronegativity: 1.50, density: 16.69, meltingPoint: 3017, boilingPoint: 5458
  },
  {
    z: 74, sym: 'W', name: 'Tungsten', nameEn: 'Tungsten', state: 'solid', color: '#808080', category: 'Transition metal',
    desc: 'Remarkably robust steel-gray transition metal. Has the highest melting point of all elements at 3422 °C and highest tensile strength.',
    mass: 183.84, stableNeutrons: 110, shells: [2, 8, 18, 32, 12, 2], discovered: 1781, discoveredBy: 'Carl Wilhelm Scheele, Juan José Elhuyar',
    electronConfig: '[Xe] 4f¹⁴ 5d⁴ 6s²', electronegativity: 2.36, density: 19.25, meltingPoint: 3422, boilingPoint: 5555
  },
  {
    z: 75, sym: 'Re', name: 'Rhenium', nameEn: 'Rhenium', state: 'solid', color: '#a0a0a0', category: 'Transition metal',
    desc: 'Silvery-white heavy refractory transition metal with the third-highest melting point. Crucial in nickel-based superalloys for jet engines.',
    mass: 186.21, stableNeutrons: 111, shells: [2, 8, 18, 32, 13, 2], discovered: 1925, discoveredBy: 'Masataka Ogawa, Walter Noddack',
    electronConfig: '[Xe] 4f¹⁴ 5d⁵ 6s²', electronegativity: 1.90, density: 21.02, meltingPoint: 3186, boilingPoint: 5596
  },
  {
    z: 76, sym: 'Os', name: 'Osmium', nameEn: 'Osmium', state: 'solid', color: '#9090a0', category: 'Transition metal',
    desc: 'Hard, brittle, bluish-white platinum group metal. Densest naturally occurring element with a density of 22.59 g/cm³.',
    mass: 190.23, stableNeutrons: 116, shells: [2, 8, 18, 32, 14, 2], discovered: 1803, discoveredBy: 'Smithson Tennant',
    electronConfig: '[Xe] 4f¹⁴ 5d⁶ 6s²', electronegativity: 2.20, density: 22.59, meltingPoint: 3033, boilingPoint: 5012
  },
  {
    z: 77, sym: 'Ir', name: 'Iridium', nameEn: 'Iridium', state: 'solid', color: '#c0c0c0', category: 'Transition metal',
    desc: 'Silvery-white platinum group metal. Most corrosion-resistant metal known; the geological K-Pg boundary layer is enriched in meteoritic iridium.',
    mass: 192.22, stableNeutrons: 115, shells: [2, 8, 18, 32, 15, 2], discovered: 1803, discoveredBy: 'Smithson Tennant',
    electronConfig: '[Xe] 4f¹⁴ 5d⁷ 6s²', electronegativity: 2.20, density: 22.56, meltingPoint: 2446, boilingPoint: 4428
  },
  {
    z: 78, sym: 'Pt', name: 'Platinum', nameEn: 'Platinum', state: 'solid', color: '#c0c0c0', category: 'Transition metal',
    desc: 'Dense, malleable, ductile, highly unreactive, precious silver-white metal. Premium catalyst and anticancer drug component (cisplatin).',
    mass: 195.08, stableNeutrons: 117, shells: [2, 8, 18, 32, 17, 1], discovered: 1735, discoveredBy: 'Antonio de Ulloa',
    electronConfig: '[Xe] 4f¹⁴ 5d⁹ 6s¹', electronegativity: 2.28, density: 21.45, meltingPoint: 1768.3, boilingPoint: 3825
  },
  {
    z: 79, sym: 'Au', name: 'Gold', nameEn: 'Gold', state: 'solid', color: '#d4a017', category: 'Transition metal',
    desc: 'Bright, slightly orange-yellow, dense, soft, malleable and ductile noble metal. Chemically unreactive; symbol Au comes from Latin aurum.',
    mass: 196.97, stableNeutrons: 118, shells: [2, 8, 18, 32, 18, 1], discovered: 'Ancient', discoveredBy: 'Known to antiquity',
    electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹', electronegativity: 2.54, density: 19.30, meltingPoint: 1064.18, boilingPoint: 2970
  },
  {
    z: 80, sym: 'Hg', name: 'Mercury', nameEn: 'Mercury', state: 'liquid', color: '#c0c0c0', category: 'Post-transition',
    desc: 'Heavy, silvery d-block element. Only metallic element that is liquid at standard conditions for temperature and pressure.',
    mass: 200.59, stableNeutrons: 122, shells: [2, 8, 18, 32, 18, 2], discovered: 'Ancient', discoveredBy: 'Known to antiquity',
    electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s²', electronegativity: 2.00, density: 13.534, meltingPoint: -38.83, boilingPoint: 356.73
  },
  {
    z: 81, sym: 'Tl', name: 'Thallium', nameEn: 'Thallium', state: 'solid', color: '#a0a0a0', category: 'Post-transition',
    desc: 'Soft, malleable gray post-transition metal. Historically used as a lethal rodenticide and infamous poison ("the poisoner\'s poison").',
    mass: 204.38, stableNeutrons: 124, shells: [2, 8, 18, 32, 18, 3], discovered: 1861, discoveredBy: 'William Crookes',
    electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹', electronegativity: 1.62, density: 11.85, meltingPoint: 304, boilingPoint: 1473
  },
  {
    z: 82, sym: 'Pb', name: 'Lead', nameEn: 'Lead', state: 'solid', color: '#808090', category: 'Post-transition',
    desc: 'Heavy metal that is denser than most common materials. Soft, malleable, and possesses the stable end product isotope Pb-208.',
    mass: 207.2, stableNeutrons: 126, shells: [2, 8, 18, 32, 18, 4], discovered: 'Ancient', discoveredBy: 'Known to antiquity',
    electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²', electronegativity: 2.33, density: 11.34, meltingPoint: 327.46, boilingPoint: 1749
  },
  {
    z: 83, sym: 'Bi', name: 'Bismuth', nameEn: 'Bismuth', state: 'solid', color: '#a0a0b0', category: 'Post-transition',
    desc: 'High-density, silvery-pink post-transition metal. Diamagnetic metal famous for iridescent rainbow oxidation layers in crystal forms.',
    mass: 208.98, stableNeutrons: 126, shells: [2, 8, 18, 32, 18, 5], discovered: 1753, discoveredBy: 'Claude François Geoffroy',
    electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³', electronegativity: 2.02, density: 9.78, meltingPoint: 271.4, boilingPoint: 1564
  },
  {
    z: 84, sym: 'Po', name: 'Polonium', nameEn: 'Polonium', state: 'solid', color: '#a0a0a0', category: 'Post-transition',
    desc: 'Rare and highly radioactive post-transition metal. Discovered by Marie and Pierre Curie and named after Marie\'s homeland of Poland.',
    mass: 209, stableNeutrons: 125, shells: [2, 8, 18, 32, 18, 6], discovered: 1898, discoveredBy: 'Marie Curie, Pierre Curie',
    electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁴', electronegativity: 2.00, density: 9.196, meltingPoint: 254, boilingPoint: 962
  },
  {
    z: 85, sym: 'At', name: 'Astatine', nameEn: 'Astatine', state: 'solid', color: '#606060', category: 'Halogen',
    desc: 'Extremely rare, radioactive halogen. Second rarest natural element in Earth\'s crust, with less than 1 gram present at any given moment.',
    mass: 210, stableNeutrons: 125, shells: [2, 8, 18, 32, 18, 7], discovered: 1940, discoveredBy: 'Dale R. Corson, Kenneth Ross MacKenzie',
    electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁵', electronegativity: 2.20, density: 7.0, meltingPoint: 302, boilingPoint: 337
  },
  {
    z: 86, sym: 'Rn', name: 'Radon', nameEn: 'Radon', state: 'gas', color: '#80d0d0', category: 'Noble gas',
    desc: 'Radioactive, colorless, odorless noble gas produced by the decay of radium. Significant health hazard when accumulated indoors.',
    mass: 222, stableNeutrons: 136, shells: [2, 8, 18, 32, 18, 8], discovered: 1900, discoveredBy: 'Friedrich Ernst Dorn',
    electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶', electronegativity: 2.20, density: 0.00973, meltingPoint: -71, boilingPoint: -61.7
  },
  {
    z: 87, sym: 'Fr', name: 'Francium', nameEn: 'Francium', state: 'solid', color: '#c0c0c0', category: 'Alkali metal',
    desc: 'Extremely radioactive alkali metal. Second-rarest element in Earth\'s crust; its most stable isotope Fr-223 has a half-life of only 22 minutes.',
    mass: 223, stableNeutrons: 136, shells: [2, 8, 18, 32, 18, 8, 1], discovered: 1939, discoveredBy: 'Marguerite Perey',
    electronConfig: '[Rn] 7s¹', electronegativity: 0.79, density: 1.87, meltingPoint: 27, boilingPoint: 677
  },
  {
    z: 88, sym: 'Ra', name: 'Radium', nameEn: 'Radium', state: 'solid', color: '#c0c0c0', category: 'Alkaline earth',
    desc: 'Silvery-white radioactive alkaline earth metal that glows with a faint blue light in the dark due to intense radioactivity.',
    mass: 226, stableNeutrons: 138, shells: [2, 8, 18, 32, 18, 8, 2], discovered: 1898, discoveredBy: 'Marie Curie, Pierre Curie',
    electronConfig: '[Rn] 7s²', electronegativity: 0.90, density: 5.5, meltingPoint: 700, boilingPoint: 1737
  },
  {
    z: 89, sym: 'Ac', name: 'Actinium', nameEn: 'Actinium', state: 'solid', color: '#a0a0a0', category: 'Actinide',
    desc: 'Radioactive silvery-white actinide metal that names the actinide series. Glows eerily blue in darkness.',
    mass: 227, stableNeutrons: 138, shells: [2, 8, 18, 32, 18, 9, 2], discovered: 1899, discoveredBy: 'André-Louis Debierne',
    electronConfig: '[Rn] 6d¹ 7s²', electronegativity: 1.10, density: 10.07, meltingPoint: 1050, boilingPoint: 3198
  },
  {
    z: 90, sym: 'Th', name: 'Thorium', nameEn: 'Thorium', state: 'solid', color: '#a0a0a0', category: 'Actinide',
    desc: 'Naturally occurring, weakly radioactive actinide metal. Investigated worldwide as an alternative nuclear fuel cycle technology.',
    mass: 232.04, stableNeutrons: 142, shells: [2, 8, 18, 32, 18, 10, 2], discovered: 1829, discoveredBy: 'Jöns Jacob Berzelius',
    electronConfig: '[Rn] 6d² 7s²', electronegativity: 1.30, density: 11.72, meltingPoint: 1750, boilingPoint: 4788
  },
  {
    z: 91, sym: 'Pa', name: 'Protactinium', nameEn: 'Protactinium', state: 'solid', color: '#a0a0a0', category: 'Actinide',
    desc: 'Dense, silvery-gray actinide metal which readily reacts with oxygen, water vapor and inorganic acids.',
    mass: 231.04, stableNeutrons: 140, shells: [2, 8, 18, 32, 20, 9, 2], discovered: 1913, discoveredBy: 'Kasimir Fajans, Oswald Helmuth Göhring',
    electronConfig: '[Rn] 5f² 6d¹ 7s²', electronegativity: 1.50, density: 15.37, meltingPoint: 1568, boilingPoint: 4027
  },
  {
    z: 92, sym: 'U', name: 'Uranium', nameEn: 'Uranium', state: 'solid', color: '#808080', category: 'Actinide',
    desc: 'Very dense, radioactive actinide metal. Isotope U-235 is the primary fissile fuel utilized in commercial nuclear power reactors.',
    mass: 238.03, stableNeutrons: 146, shells: [2, 8, 18, 32, 21, 9, 2], discovered: 1789, discoveredBy: 'Martin Heinrich Klaproth',
    electronConfig: '[Rn] 5f³ 6d¹ 7s²', electronegativity: 1.38, density: 19.1, meltingPoint: 1132.2, boilingPoint: 4131
  },
  {
    z: 93, sym: 'Np', name: 'Neptunium', nameEn: 'Neptunium', state: 'solid', color: '#a0a0a0', category: 'Actinide',
    desc: 'Hard, silvery radioactive transuranic actinide metal. First synthetic transuranium element created in a particle accelerator.',
    mass: 237, stableNeutrons: 144, shells: [2, 8, 18, 32, 22, 9, 2], discovered: 1940, discoveredBy: 'Edwin McMillan, Philip H. Abelson',
    electronConfig: '[Rn] 5f⁴ 6d¹ 7s²', electronegativity: 1.36, density: 20.45, meltingPoint: 639, boilingPoint: 3902
  },
  {
    z: 94, sym: 'Pu', name: 'Plutonium', nameEn: 'Plutonium', state: 'solid', color: '#a0a0a0', category: 'Actinide',
    desc: 'Radioactive actinide with silvery appearance that tarnishes when oxidized. Used as fuel in radioisotope thermoelectric generators (RTGs).',
    mass: 244, stableNeutrons: 150, shells: [2, 8, 18, 32, 24, 8, 2], discovered: 1940, discoveredBy: 'Glenn T. Seaborg, Arthur Wahl',
    electronConfig: '[Rn] 5f⁶ 7s²', electronegativity: 1.28, density: 19.816, meltingPoint: 639.4, boilingPoint: 3228
  },
  {
    z: 95, sym: 'Am', name: 'Americium', nameEn: 'Americium', state: 'solid', color: '#a0a0a0', category: 'Actinide',
    desc: 'Synthetic radioactive actinide. Am-241 is widely used in household ionization-type smoke detectors.',
    mass: 243, stableNeutrons: 148, shells: [2, 8, 18, 32, 25, 8, 2], discovered: 1944, discoveredBy: 'Glenn T. Seaborg, Ralph A. James',
    electronConfig: '[Rn] 5f⁷ 7s²', electronegativity: 1.30, density: 12.0, meltingPoint: 1176, boilingPoint: 2607
  },
  {
    z: 96, sym: 'Cm', name: 'Curium', nameEn: 'Curium', state: 'solid', color: '#a0a0a0', category: 'Actinide',
    desc: 'Synthetic radioactive actinide named in honor of Marie and Pierre Curie. Generates substantial decay heat, used in space probes.',
    mass: 247, stableNeutrons: 151, shells: [2, 8, 18, 32, 25, 9, 2], discovered: 1944, discoveredBy: 'Glenn T. Seaborg, Ralph A. James',
    electronConfig: '[Rn] 5f⁷ 6d¹ 7s²', electronegativity: 1.30, density: 13.51, meltingPoint: 1345, boilingPoint: 3110
  },
  {
    z: 97, sym: 'Bk', name: 'Berkelium', nameEn: 'Berkelium', state: 'solid', color: '#a0a0a0', category: 'Actinide',
    desc: 'Soft, silvery-white radioactive transuranic actinide. Named after the city of Berkeley and University of California.',
    mass: 247, stableNeutrons: 150, shells: [2, 8, 18, 32, 27, 8, 2], discovered: 1949, discoveredBy: 'Lawrence Berkeley National Laboratory',
    electronConfig: '[Rn] 5f⁹ 7s²', electronegativity: 1.30, density: 14.78, meltingPoint: 986, boilingPoint: 2627
  },
  {
    z: 98, sym: 'Cf', name: 'Californium', nameEn: 'Californium', state: 'solid', color: '#a0a0a0', category: 'Actinide',
    desc: 'Radioactive actinide and powerful neutron emitter. One microgram of californium-252 emits 170 million neutrons per minute.',
    mass: 251, stableNeutrons: 153, shells: [2, 8, 18, 32, 28, 8, 2], discovered: 1950, discoveredBy: 'Lawrence Berkeley National Laboratory',
    electronConfig: '[Rn] 5f¹⁰ 7s²', electronegativity: 1.30, density: 15.1, meltingPoint: 900, boilingPoint: 1470
  },
  {
    z: 99, sym: 'Es', name: 'Einsteinium', nameEn: 'Einsteinium', state: 'solid', color: '#a0a0a0', category: 'Actinide',
    desc: 'Synthetic element named in honor of Albert Einstein. First identified in the debris of the Ivy Mike thermonuclear test in 1952.',
    mass: 252, stableNeutrons: 153, shells: [2, 8, 18, 32, 29, 8, 2], discovered: 1952, discoveredBy: 'Albert Ghiorso and team',
    electronConfig: '[Rn] 5f¹¹ 7s²', electronegativity: 1.30, density: 8.84, meltingPoint: 860, boilingPoint: 996
  },
  {
    z: 100, sym: 'Fm', name: 'Fermium', nameEn: 'Fermium', state: 'unknown', color: '#888888', category: 'Actinide',
    desc: 'Heaviest element that can be prepared by neutron bombardment of lighter elements. Named after nuclear pioneer Enrico Fermi.',
    mass: 257, stableNeutrons: 157, shells: [2, 8, 18, 32, 30, 8, 2], discovered: 1952, discoveredBy: 'Albert Ghiorso and team',
    electronConfig: '[Rn] 5f¹² 7s²', electronegativity: 1.30, density: undefined, meltingPoint: 1527, boilingPoint: undefined
  },
  {
    z: 101, sym: 'Md', name: 'Mendelevium', nameEn: 'Mendelevium', state: 'unknown', color: '#888888', category: 'Actinide',
    desc: 'Synthetic radioactive actinide element named after Dmitri Mendeleev, father of the Periodic Table.',
    mass: 258, stableNeutrons: 157, shells: [2, 8, 18, 32, 31, 8, 2], discovered: 1955, discoveredBy: 'Lawrence Berkeley National Laboratory',
    electronConfig: '[Rn] 5f¹³ 7s²', electronegativity: 1.30, density: undefined, meltingPoint: 827, boilingPoint: undefined
  },
  {
    z: 102, sym: 'No', name: 'Nobelium', nameEn: 'Nobelium', state: 'unknown', color: '#888888', category: 'Actinide',
    desc: 'Synthetic radioactive element named in honor of Alfred Nobel, inventor of dynamite and benefactor of the Nobel Prizes.',
    mass: 259, stableNeutrons: 157, shells: [2, 8, 18, 32, 32, 8, 2], discovered: 1958, discoveredBy: 'Joint Institute for Nuclear Research (JINR)',
    electronConfig: '[Rn] 5f¹⁴ 7s²', electronegativity: 1.30, density: undefined, meltingPoint: 827, boilingPoint: undefined
  },
  {
    z: 103, sym: 'Lr', name: 'Lawrencium', nameEn: 'Lawrencium', state: 'unknown', color: '#888888', category: 'Actinide',
    desc: 'Final member of the actinide series. Named in honor of Ernest O. Lawrence, inventor of the cyclotron particle accelerator.',
    mass: 266, stableNeutrons: 163, shells: [2, 8, 18, 32, 32, 8, 3], discovered: 1961, discoveredBy: 'Albert Ghiorso and team',
    electronConfig: '[Rn] 5f¹⁴ 7s² 7p¹', electronegativity: 1.30, density: undefined, meltingPoint: 1627, boilingPoint: undefined
  },
  {
    z: 104, sym: 'Rf', name: 'Rutherfordium', nameEn: 'Rutherfordium', state: 'unknown', color: '#888888', category: 'Transition metal',
    desc: 'First transactinide superheavy element. Named in honor of Ernest Rutherford, discoverer of the atomic nucleus.',
    mass: 267, stableNeutrons: 163, shells: [2, 8, 18, 32, 32, 10, 2], discovered: 1964, discoveredBy: 'JINR Dubna & Berkeley',
    electronConfig: '[Rn] 5f¹⁴ 6d² 7s²', electronegativity: undefined, density: 23.2, meltingPoint: 2100, boilingPoint: 5500
  },
  {
    z: 105, sym: 'Db', name: 'Dubnium', nameEn: 'Dubnium', state: 'unknown', color: '#888888', category: 'Transition metal',
    desc: 'Synthetic superheavy transition metal named after Dubna, Russia, home of the Joint Institute for Nuclear Research.',
    mass: 268, stableNeutrons: 163, shells: [2, 8, 18, 32, 32, 11, 2], discovered: 1968, discoveredBy: 'JINR Dubna & Berkeley',
    electronConfig: '[Rn] 5f¹⁴ 6d³ 7s²', electronegativity: undefined, density: 29.3, meltingPoint: undefined, boilingPoint: undefined
  },
  {
    z: 106, sym: 'Sg', name: 'Seaborgium', nameEn: 'Seaborgium', state: 'unknown', color: '#888888', category: 'Transition metal',
    desc: 'Synthetic superheavy element named after nuclear chemist Glenn T. Seaborg, first living person to have an element named after him.',
    mass: 269, stableNeutrons: 163, shells: [2, 8, 18, 32, 32, 12, 2], discovered: 1974, discoveredBy: 'Lawrence Berkeley Laboratory',
    electronConfig: '[Rn] 5f¹⁴ 6d⁴ 7s²', electronegativity: undefined, density: 35.0, meltingPoint: undefined, boilingPoint: undefined
  },
  {
    z: 107, sym: 'Bh', name: 'Bohrium', nameEn: 'Bohrium', state: 'unknown', color: '#888888', category: 'Transition metal',
    desc: 'Synthetic radioactive transition metal named in honor of Danish quantum physicist Niels Bohr.',
    mass: 270, stableNeutrons: 163, shells: [2, 8, 18, 32, 32, 13, 2], discovered: 1981, discoveredBy: 'GSI Helmholtz Centre, Darmstadt',
    electronConfig: '[Rn] 5f¹⁴ 6d⁵ 7s²', electronegativity: undefined, density: 37.1, meltingPoint: undefined, boilingPoint: undefined
  },
  {
    z: 108, sym: 'Hs', name: 'Hassium', nameEn: 'Hassium', state: 'unknown', color: '#888888', category: 'Transition metal',
    desc: 'Superheavy element belonging to group 8. Named after the German state of Hesse (Latin Hassia) where it was first synthesized.',
    mass: 269, stableNeutrons: 161, shells: [2, 8, 18, 32, 32, 14, 2], discovered: 1984, discoveredBy: 'GSI Darmstadt, Germany',
    electronConfig: '[Rn] 5f¹⁴ 6d⁶ 7s²', electronegativity: undefined, density: 40.7, meltingPoint: undefined, boilingPoint: undefined
  },
  {
    z: 109, sym: 'Mt', name: 'Meitnerium', nameEn: 'Meitnerium', state: 'unknown', color: '#888888', category: 'Unknown',
    desc: 'Extremely radioactive synthetic element named after Austrian-Swedish physicist Lise Meitner, discoverer of nuclear fission.',
    mass: 278, stableNeutrons: 169, shells: [2, 8, 18, 32, 32, 15, 2], discovered: 1982, discoveredBy: 'GSI Darmstadt, Germany',
    electronConfig: '[Rn] 5f¹⁴ 6d⁷ 7s²', electronegativity: undefined, density: 37.4, meltingPoint: undefined, boilingPoint: undefined
  },
  {
    z: 110, sym: 'Ds', name: 'Darmstadtium', nameEn: 'Darmstadtium', state: 'unknown', color: '#888888', category: 'Unknown',
    desc: 'Synthetic superheavy element named after the German city of Darmstadt, where it was discovered at GSI.',
    mass: 281, stableNeutrons: 171, shells: [2, 8, 18, 32, 32, 16, 2], discovered: 1994, discoveredBy: 'GSI Darmstadt, Germany',
    electronConfig: '[Rn] 5f¹⁴ 6d⁸ 7s²', electronegativity: undefined, density: 34.8, meltingPoint: undefined, boilingPoint: undefined
  },
  {
    z: 111, sym: 'Rg', name: 'Roentgenium', nameEn: 'Roentgenium', state: 'unknown', color: '#888888', category: 'Unknown',
    desc: 'Synthetic element named in honor of Wilhelm Conrad Röntgen, who discovered X-rays in 1895.',
    mass: 282, stableNeutrons: 171, shells: [2, 8, 18, 32, 32, 17, 2], discovered: 1994, discoveredBy: 'GSI Darmstadt, Germany',
    electronConfig: '[Rn] 5f¹⁴ 6d⁹ 7s²', electronegativity: undefined, density: 28.7, meltingPoint: undefined, boilingPoint: undefined
  },
  {
    z: 112, sym: 'Cn', name: 'Copernicium', nameEn: 'Copernicium', state: 'unknown', color: '#888888', category: 'Transition metal',
    desc: 'Superheavy element named after astronomer Nicolaus Copernicus. Extremely volatile, behaving somewhat like a noble gas.',
    mass: 285, stableNeutrons: 173, shells: [2, 8, 18, 32, 32, 18, 2], discovered: 1996, discoveredBy: 'GSI Darmstadt, Germany',
    electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s²', electronegativity: undefined, density: 23.7, meltingPoint: undefined, boilingPoint: 67
  },
  {
    z: 113, sym: 'Nh', name: 'Nihonium', nameEn: 'Nihonium', state: 'unknown', color: '#888888', category: 'Unknown',
    desc: 'First chemical element discovered in an Asian country, synthesized at RIKEN in Japan and named after Nihon (Japan).',
    mass: 286, stableNeutrons: 173, shells: [2, 8, 18, 32, 32, 18, 3], discovered: 2004, discoveredBy: 'RIKEN, Japan',
    electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p¹', electronegativity: undefined, density: 16, meltingPoint: 430, boilingPoint: 1130
  },
  {
    z: 114, sym: 'Fl', name: 'Flerovium', nameEn: 'Flerovium', state: 'unknown', color: '#888888', category: 'Unknown',
    desc: 'Superheavy synthetic element named after the Flerov Laboratory of Nuclear Reactions in Dubna, Russia.',
    mass: 289, stableNeutrons: 175, shells: [2, 8, 18, 32, 32, 18, 4], discovered: 1998, discoveredBy: 'JINR Dubna & LLNL',
    electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p²', electronegativity: undefined, density: 14, meltingPoint: 70, boilingPoint: 150
  },
  {
    z: 115, sym: 'Mc', name: 'Moscovium', nameEn: 'Moscovium', state: 'unknown', color: '#888888', category: 'Unknown',
    desc: 'Extremely radioactive synthetic element named in honor of the Moscow Oblast where JINR Dubna is located.',
    mass: 290, stableNeutrons: 175, shells: [2, 8, 18, 32, 32, 18, 5], discovered: 2003, discoveredBy: 'JINR Dubna & LLNL',
    electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p³', electronegativity: undefined, density: 13.5, meltingPoint: 400, boilingPoint: 1100
  },
  {
    z: 116, sym: 'Lv', name: 'Livermorium', nameEn: 'Livermorium', state: 'unknown', color: '#888888', category: 'Unknown',
    desc: 'Synthetic superheavy element named after the Lawrence Livermore National Laboratory in California.',
    mass: 293, stableNeutrons: 177, shells: [2, 8, 18, 32, 32, 18, 6], discovered: 2000, discoveredBy: 'JINR Dubna & LLNL',
    electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁴', electronegativity: undefined, density: 12.9, meltingPoint: 435, boilingPoint: 812
  },
  {
    z: 117, sym: 'Ts', name: 'Tennessine', nameEn: 'Tennessine', state: 'unknown', color: '#888888', category: 'Halogen',
    desc: 'Second-heaviest known element. Named after the U.S. state of Tennessee, home of Oak Ridge National Laboratory and Vanderbilt.',
    mass: 294, stableNeutrons: 177, shells: [2, 8, 18, 32, 32, 18, 7], discovered: 2010, discoveredBy: 'JINR Dubna, LLNL & ORNL',
    electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁵', electronegativity: undefined, density: 7.2, meltingPoint: 450, boilingPoint: 610
  },
  {
    z: 118, sym: 'Og', name: 'Oganesson', nameEn: 'Oganesson', state: 'unknown', color: '#888888', category: 'Noble gas',
    desc: 'Heaviest known chemical element with atomic number 118. Named in honor of Russian nuclear physicist Yuri Oganessian.',
    mass: 294, stableNeutrons: 176, shells: [2, 8, 18, 32, 32, 18, 8], discovered: 2002, discoveredBy: 'JINR Dubna & LLNL',
    electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶', electronegativity: undefined, density: 5.0, meltingPoint: 50, boilingPoint: 80
  }
];

export function getElement(z: number): Element {
  z = Math.max(1, Math.min(118, Math.round(z)));
  return ELEMENTS[z - 1] || ELEMENTS[0];
}

export function getStableNeutrons(z: number): number {
  const el = getElement(z);
  return el.stableNeutrons;
}

export function getCachedNeutrons(z: number): number {
  return getStableNeutrons(z);
}

export function getShellConfig(zOrElectrons: number): number[] {
  if (zOrElectrons <= 118 && zOrElectrons >= 1) {
    const el = ELEMENTS[Math.round(zOrElectrons) - 1];
    if (el && el.shells) return el.shells;
  }
  // Fallback Aufbau filling for non-standard counts
  const maxPerShell = [2, 8, 18, 32, 32, 18, 8];
  const config: number[] = [];
  let remain = Math.max(0, Math.round(zOrElectrons));
  for (const max of maxPerShell) {
    if (remain <= 0) break;
    const take = Math.min(remain, max);
    config.push(take);
    remain -= take;
  }
  return config.length > 0 ? config : [0];
}

import { getCategoryColor as gcc } from '../theme';

export function getCategoryColor(category: string): string {
  return gcc(category);
}
