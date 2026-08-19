export interface Element {
  z: number;
  sym: string;
  name: string;
  nameEn: string;
  state: 'solid' | 'liquid' | 'gas' | 'unknown';
  color: string;
  category: string;
  desc: string;
  mass?: number;
  discovered?: number;
  electronConfig?: string;
  electronegativity?: number;
  density?: number;
  meltingPoint?: number;
  boilingPoint?: number;
}

const RAW_ELEMENTS: Partial<Element>[] = [
  {z:1,sym:'H',nameEn:'Hydrogen',state:'gas',color:'#e8e8e8',category:'Nonmetal',desc:'Lightest element, colorless gas',mass:1.008,discovered:1766,electronConfig:'1s\xB9',electronegativity:2.2,density:0.00009,meltingPoint:-259.1,boilingPoint:-252.9},
  {z:2,sym:'He',nameEn:'Helium',state:'gas',color:'#d6d6e0',category:'Noble gas',desc:'Noble gas, lighter than air',mass:4.003,discovered:1868,electronConfig:'1s\xB2',electronegativity:0,density:0.00018,meltingPoint:-272.2,boilingPoint:-268.9},
  {z:3,sym:'Li',nameEn:'Lithium',state:'solid',color:'#c0c0c0',category:'Alkali metal',desc:'Soft silvery-white alkali metal',mass:6.941,discovered:1817,electronConfig:'[He] 2s\xB9',electronegativity:0.98,density:0.53,meltingPoint:180.5,boilingPoint:1342},
  {z:4,sym:'Be',nameEn:'Beryllium',state:'solid',color:'#a0a0a0',category:'Alkaline earth',desc:'Light gray alkaline earth metal',mass:9.012,discovered:1798,electronConfig:'[He] 2s\xB2',electronegativity:1.57,density:1.85,meltingPoint:1278,boilingPoint:2970},
  {z:5,sym:'B',nameEn:'Boron',state:'solid',color:'#8a6e45',category:'Metalloid',desc:'Black-brown metalloid, very hard',mass:10.811,discovered:1808,electronConfig:'[He] 2s\xB2 2p\xB9',electronegativity:2.04,density:2.34,meltingPoint:2075,boilingPoint:4000},
  {z:6,sym:'C',nameEn:'Carbon',state:'solid',color:'#404040',category:'Nonmetal',desc:'Black solid (graphite) or transparent (diamond)',mass:12.011,discovered:0,electronConfig:'[He] 2s\xB2 2p\xB2',electronegativity:2.55,density:2.26,meltingPoint:3550,boilingPoint:4827},
  {z:7,sym:'N',nameEn:'Nitrogen',state:'gas',color:'#c0d0e0',category:'Nonmetal',desc:'Colorless gas, 78% of air',mass:14.007,discovered:1772,electronConfig:'[He] 2s\xB2 2p\xB3',electronegativity:3.04,density:0.00125,meltingPoint:-210.1,boilingPoint:-195.8},
  {z:8,sym:'O',nameEn:'Oxygen',state:'gas',color:'#b0d0ff',category:'Nonmetal',desc:'Pale blue gas, essential for breathing',mass:15.999,discovered:1774,electronConfig:'[He] 2s\xB2 2p\xB4',electronegativity:3.44,density:0.00143,meltingPoint:-218.3,boilingPoint:-183.0},
  {z:9,sym:'F',nameEn:'Fluorine',state:'gas',color:'#90e090',category:'Halogen',desc:'Yellow-green toxic gas, most electronegative',mass:18.998,discovered:1886,electronConfig:'[He] 2s\xB2 2p\xB5',electronegativity:3.98,density:0.0017,meltingPoint:-219.6,boilingPoint:-188.1},
  {z:10,sym:'Ne',nameEn:'Neon',state:'gas',color:'#ff6b6b',category:'Noble gas',desc:'Noble gas, glows red-orange in discharge tubes',mass:20.180,discovered:1898,electronConfig:'[He] 2s\xB2 2p\xB6',electronegativity:0,density:0.0009,meltingPoint:-248.6,boilingPoint:-246.1},
  {z:11,sym:'Na',nameEn:'Sodium',state:'solid',color:'#c0c0c0',category:'Alkali metal',desc:'Soft silvery metal, reacts violently with water',mass:22.990,discovered:1807,electronConfig:'[Ne] 3s\xB9',electronegativity:0.93,density:0.97,meltingPoint:97.8,boilingPoint:883},
  {z:12,sym:'Mg',nameEn:'Magnesium',state:'solid',color:'#c0c0c0',category:'Alkaline earth',desc:'Light silvery metal, burns with bright white light',mass:24.305,discovered:1755,electronConfig:'[Ne] 3s\xB2',electronegativity:1.31,density:1.74,meltingPoint:650,boilingPoint:1090},
  {z:13,sym:'Al',nameEn:'Aluminium',state:'solid',color:'#c0c8d0',category:'Post-transition',desc:'Light silvery metal, most abundant in crust',mass:26.982,discovered:1825,electronConfig:'[Ne] 3s\xB2 3p\xB9',electronegativity:1.61,density:2.7,meltingPoint:660.3,boilingPoint:2519},
  {z:14,sym:'Si',nameEn:'Silicon',state:'solid',color:'#506070',category:'Metalloid',desc:'Gray metalloid, basis of semiconductor chips',mass:28.086,discovered:1824,electronConfig:'[Ne] 3s\xB2 3p\xB2',electronegativity:1.9,density:2.33,meltingPoint:1414,boilingPoint:3265},
  {z:15,sym:'P',nameEn:'Phosphorus',state:'solid',color:'#c05030',category:'Nonmetal',desc:'White/red solid, essential for DNA',mass:30.974,discovered:1669,electronConfig:'[Ne] 3s\xB2 3p\xB3',electronegativity:2.19,density:1.82,meltingPoint:44.2,boilingPoint:280},
  {z:16,sym:'S',nameEn:'Sulfur',state:'solid',color:'#e8c820',category:'Nonmetal',desc:'Yellow solid, characteristic smell',mass:32.065,discovered:0,electronConfig:'[Ne] 3s\xB2 3p\xB4',electronegativity:2.58,density:2.07,meltingPoint:115.2,boilingPoint:444.6},
  {z:17,sym:'Cl',nameEn:'Chlorine',state:'gas',color:'#60d060',category:'Halogen',desc:'Yellow-green toxic gas, disinfectant',mass:35.453,discovered:1774,electronConfig:'[Ne] 3s\xB2 3p\xB5',electronegativity:3.16,density:0.0032,meltingPoint:-101.5,boilingPoint:-34.0},
  {z:18,sym:'Ar',nameEn:'Argon',state:'gas',color:'#c0d0e8',category:'Noble gas',desc:'Noble gas, 0.93% of air',mass:39.948,discovered:1894,electronConfig:'[Ne] 3s\xB2 3p\xB6',electronegativity:0,density:0.00178,meltingPoint:-189.3,boilingPoint:-185.8},
  {z:19,sym:'K',nameEn:'Potassium',state:'solid',color:'#c0c0c0',category:'Alkali metal',desc:'Soft silvery metal, essential for nerve cells',mass:39.098,discovered:1807,electronConfig:'[Ar] 4s\xB9',electronegativity:0.82,density:0.86,meltingPoint:63.5,boilingPoint:759},
  {z:20,sym:'Ca',nameEn:'Calcium',state:'solid',color:'#c0c0c0',category:'Alkaline earth',desc:'Silvery-gray metal, essential for bones',mass:40.078,discovered:1808,electronConfig:'[Ar] 4s\xB2',electronegativity:1,density:1.54,meltingPoint:842,boilingPoint:1484},
  {z:21,sym:'Sc',nameEn:'Scandium',state:'solid',color:'#c0c0c0',category:'Transition metal',desc:'Silvery-white transition metal',mass:44.956,discovered:1879,electronConfig:'[Ar] 3d\xB9 4s\xB2',electronegativity:1.36,density:2.99,meltingPoint:1541,boilingPoint:2836},
  {z:22,sym:'Ti',nameEn:'Titanium',state:'solid',color:'#808080',category:'Transition metal',desc:'Strong silvery metal, used in aerospace',mass:47.867,discovered:1791,electronConfig:'[Ar] 3d\xB2 4s\xB2',electronegativity:1.54,density:4.51,meltingPoint:1668,boilingPoint:3287},
  {z:23,sym:'V',nameEn:'Vanadium',state:'solid',color:'#808080',category:'Transition metal',desc:'Silvery-gray transition metal',mass:50.942,discovered:1801,electronConfig:'[Ar] 3d\xB3 4s\xB2',electronegativity:1.63,density:6.11,meltingPoint:1910,boilingPoint:3407},
  {z:24,sym:'Cr',nameEn:'Chromium',state:'solid',color:'#a0a0b0',category:'Transition metal',desc:'Shiny silvery metal, used in plating',mass:51.996,discovered:1797,electronConfig:'[Ar] 3d\xB5 4s\xB9',electronegativity:1.66,density:7.15,meltingPoint:1907,boilingPoint:2671},
  {z:25,sym:'Mn',nameEn:'Manganese',state:'solid',color:'#a0a0a0',category:'Transition metal',desc:'Gray-silvery transition metal',mass:54.938,discovered:1774,electronConfig:'[Ar] 3d\xB5 4s\xB2',electronegativity:1.55,density:7.21,meltingPoint:1246,boilingPoint:2061},
  {z:26,sym:'Fe',nameEn:'Iron',state:'solid',color:'#a08060',category:'Transition metal',desc:'Magnetic gray metal, core of Earth',mass:55.845,discovered:0,electronConfig:'[Ar] 3d\xB6 4s\xB2',electronegativity:1.83,density:7.87,meltingPoint:1538,boilingPoint:2861},
  {z:27,sym:'Co',nameEn:'Cobalt',state:'solid',color:'#9090a0',category:'Transition metal',desc:'Bluish-gray magnetic metal',mass:58.933,discovered:1735,electronConfig:'[Ar] 3d\xB7 4s\xB2',electronegativity:1.88,density:8.9,meltingPoint:1495,boilingPoint:2927},
  {z:28,sym:'Ni',nameEn:'Nickel',state:'solid',color:'#a0a0a0',category:'Transition metal',desc:'Silvery-white metal, used in alloys',mass:58.693,discovered:1751,electronConfig:'[Ar] 3d\xB8 4s\xB2',electronegativity:1.91,density:8.91,meltingPoint:1455,boilingPoint:2913},
  {z:29,sym:'Cu',nameEn:'Copper',state:'solid',color:'#b87333',category:'Transition metal',desc:'Reddish-orange metal, excellent conductor',mass:63.546,discovered:0,electronConfig:'[Ar] 3d\xB9 4s\xB9',electronegativity:1.9,density:8.96,meltingPoint:1084.6,boilingPoint:2562},
  {z:30,sym:'Zn',nameEn:'Zinc',state:'solid',color:'#a0a8b0',category:'Transition metal',desc:'Bluish-white metal, used in galvanizing',mass:65.380,discovered:0,electronConfig:'[Ar] 3d\xB9 4s\xB2',electronegativity:1.65,density:7.13,meltingPoint:419.5,boilingPoint:907},
  {z:31,sym:'Ga',nameEn:'Gallium',state:'solid',color:'#c0c0c0',category:'Post-transition',desc:'Soft silvery metal, melts in hand',mass:69.723,discovered:1875,electronConfig:'[Ar] 3d\xB9 4s\xB2 4p\xB9',electronegativity:1.81,density:5.9,meltingPoint:29.8,boilingPoint:2204},
  {z:32,sym:'Ge',nameEn:'Germanium',state:'solid',color:'#8090a0',category:'Metalloid',desc:'Gray-white metalloid, semiconductor',mass:72.630,discovered:1886,electronConfig:'[Ar] 3d\xB9 4s\xB2 4p\xB2',electronegativity:2.01,density:5.32,meltingPoint:938.2,boilingPoint:2833},
  {z:33,sym:'As',nameEn:'Arsenic',state:'solid',color:'#606060',category:'Metalloid',desc:'Gray metalloid, toxic',mass:74.922,discovered:0,electronConfig:'[Ar] 3d\xB9 4s\xB2 4p\xB3',electronegativity:2.18,density:5.78,meltingPoint:817,boilingPoint:614},
  {z:34,sym:'Se',nameEn:'Selenium',state:'solid',color:'#b06030',category:'Nonmetal',desc:'Gray-reddish nonmetal',mass:78.971,discovered:1817,electronConfig:'[Ar] 3d\xB9 4s\xB2 4p\xB4',electronegativity:2.55,density:4.81,meltingPoint:221,boilingPoint:685},
  {z:35,sym:'Br',nameEn:'Bromine',state:'liquid',color:'#a02020',category:'Halogen',desc:'Red-brown liquid, only liquid nonmetal',mass:79.904,discovered:1826,electronConfig:'[Ar] 3d\xB9 4s\xB2 4p\xB5',electronegativity:2.96,density:3.12,meltingPoint:-7.2,boilingPoint:58.8},
  {z:36,sym:'Kr',nameEn:'Krypton',state:'gas',color:'#c0d0e8',category:'Noble gas',desc:'Colorless noble gas',mass:83.798,discovered:1898,electronConfig:'[Ar] 3d\xB9 4s\xB2 4p\xB6',electronegativity:3,density:0.00375,meltingPoint:-157.4,boilingPoint:-153.4},
  {z:37,sym:'Rb',nameEn:'Rubidium',state:'solid',color:'#c0c0c0',category:'Alkali metal',desc:'Very soft silvery alkali metal',mass:85.468,discovered:1861,electronConfig:'[Kr] 5s\xB9',electronegativity:0.82,density:1.53,meltingPoint:39.3,boilingPoint:688},
  {z:38,sym:'Sr',nameEn:'Strontium',state:'solid',color:'#c0c0c0',category:'Alkaline earth',desc:'Silvery-white alkaline earth metal',mass:87.620,discovered:1808,electronConfig:'[Kr] 5s\xB2',electronegativity:0.95,density:2.64,meltingPoint:777,boilingPoint:1382},
  {z:39,sym:'Y',nameEn:'Yttrium',state:'solid',color:'#c0c0c0',category:'Transition metal',desc:'Silvery transition metal',mass:88.906,discovered:1794,electronConfig:'[Kr] 4d\xB9 5s\xB2',electronegativity:1.22,density:4.47,meltingPoint:1526,boilingPoint:3336},
  {z:40,sym:'Zr',nameEn:'Zirconium',state:'solid',color:'#a0a0a0',category:'Transition metal',desc:'Gray-white transition metal',mass:91.224,discovered:1789,electronConfig:'[Kr] 4d\xB2 5s\xB2',electronegativity:1.33,density:6.52,meltingPoint:1855,boilingPoint:4409},
  {z:41,sym:'Nb',nameEn:'Niobium',state:'solid',color:'#a0a0a0',category:'Transition metal',desc:'Shiny gray transition metal',mass:92.906,discovered:1801,electronConfig:'[Kr] 4d\xB4 5s\xB9',electronegativity:1.6,density:8.57,meltingPoint:2477,boilingPoint:4744},
  {z:42,sym:'Mo',nameEn:'Molybdenum',state:'solid',color:'#808080',category:'Transition metal',desc:'Silvery-gray refractory metal',mass:95.950,discovered:1778,electronConfig:'[Kr] 4d\xB5 5s\xB9',electronegativity:2.16,density:10.28,meltingPoint:2623,boilingPoint:4639},
  {z:43,sym:'Tc',nameEn:'Technetium',state:'solid',color:'#a0a0a0',category:'Transition metal',desc:'Silvery-gray, first synthetic element',mass:98,discovered:1937,electronConfig:'[Kr] 4d\xB5 5s\xB2',electronegativity:1.9,density:11.5,meltingPoint:2157,boilingPoint:4265},
  {z:44,sym:'Ru',nameEn:'Ruthenium',state:'solid',color:'#a0a0a0',category:'Transition metal',desc:'Hard silvery-white platinum group metal',mass:101.070,discovered:1844,electronConfig:'[Kr] 4d\xB7 5s\xB9',electronegativity:2.2,density:12.37,meltingPoint:2334,boilingPoint:4150},
  {z:45,sym:'Rh',nameEn:'Rhodium',state:'solid',color:'#c0c0c0',category:'Transition metal',desc:'Silvery-white precious metal',mass:102.906,discovered:1803,electronConfig:'[Kr] 4d\xB8 5s\xB9',electronegativity:2.28,density:12.41,meltingPoint:1964,boilingPoint:3695},
  {z:46,sym:'Pd',nameEn:'Palladium',state:'solid',color:'#c0c0c0',category:'Transition metal',desc:'Silvery-white precious metal',mass:106.420,discovered:1803,electronConfig:'[Kr] 4d\xB9',electronegativity:2.2,density:12.02,meltingPoint:1555,boilingPoint:2963},
  {z:47,sym:'Ag',nameEn:'Silver',state:'solid',color:'#c0c0cf',category:'Transition metal',desc:'White precious metal, best electrical conductor',mass:107.868,discovered:0,electronConfig:'[Kr] 4d\xB9 5s\xB9',electronegativity:1.93,density:10.49,meltingPoint:961.8,boilingPoint:2162},
  {z:48,sym:'Cd',nameEn:'Cadmium',state:'solid',color:'#a0a0a0',category:'Transition metal',desc:'Bluish-white soft metal',mass:112.414,discovered:1817,electronConfig:'[Kr] 4d\xB9 5s\xB2',electronegativity:1.69,density:8.65,meltingPoint:321.1,boilingPoint:767},
  {z:49,sym:'In',nameEn:'Indium',state:'solid',color:'#c0c0c0',category:'Post-transition',desc:'Soft silvery post-transition metal',mass:114.818,discovered:1863,electronConfig:'[Kr] 4d\xB9 5s\xB2 5p\xB9',electronegativity:1.78,density:7.31,meltingPoint:156.6,boilingPoint:2072},
  {z:50,sym:'Sn',nameEn:'Tin',state:'solid',color:'#c0c0c0',category:'Post-transition',desc:'Silvery-white soft metal',mass:118.710,discovered:0,electronConfig:'[Kr] 4d\xB9 5s\xB2 5p\xB2',electronegativity:1.96,density:7.27,meltingPoint:231.9,boilingPoint:2602},
  {z:51,sym:'Sb',nameEn:'Antimony',state:'solid',color:'#808080',category:'Metalloid',desc:'Silvery-gray metalloid',mass:121.760,discovered:0,electronConfig:'[Kr] 4d\xB9 5s\xB2 5p\xB3',electronegativity:2.05,density:6.7,meltingPoint:630.6,boilingPoint:1587},
  {z:52,sym:'Te',nameEn:'Tellurium',state:'solid',color:'#a0a080',category:'Metalloid',desc:'Silvery-gray metalloid',mass:127.600,discovered:1782,electronConfig:'[Kr] 4d\xB9 5s\xB2 5p\xB4',electronegativity:2.1,density:6.24,meltingPoint:449.5,boilingPoint:988},
  {z:53,sym:'I',nameEn:'Iodine',state:'solid',color:'#4060a0',category:'Halogen',desc:'Purple-black solid, sublimes into violet gas',mass:126.904,discovered:1811,electronConfig:'[Kr] 4d\xB9 5s\xB2 5p\xB5',electronegativity:2.66,density:4.93,meltingPoint:113.7,boilingPoint:184.3},
  {z:54,sym:'Xe',nameEn:'Xenon',state:'gas',color:'#8080c0',category:'Noble gas',desc:'Heavy colorless noble gas',mass:131.293,discovered:1898,electronConfig:'[Kr] 4d\xB9 5s\xB2 5p\xB6',electronegativity:2.6,density:0.0059,meltingPoint:-111.8,boilingPoint:-108.1},
  {z:55,sym:'Cs',nameEn:'Caesium',state:'solid',color:'#c0b060',category:'Alkali metal',desc:'Soft golden alkali metal, most reactive',mass:132.905,discovered:1860,electronConfig:'[Xe] 6s\xB9',electronegativity:0.79,density:1.93,meltingPoint:28.5,boilingPoint:671},
  {z:56,sym:'Ba',nameEn:'Barium',state:'solid',color:'#a0a0a0',category:'Alkaline earth',desc:'Silvery-white alkaline earth metal',mass:137.327,discovered:1808,electronConfig:'[Xe] 6s\xB2',electronegativity:0.89,density:3.62,meltingPoint:727,boilingPoint:1845},
  {z:57,sym:'La',nameEn:'Lanthanum',state:'solid',color:'#a0a0a0',category:'Lanthanide',desc:'Silvery-white lanthanide',mass:138.905,discovered:1839,electronConfig:'[Xe] 5d\xB9 6s\xB2',electronegativity:1.1,density:6.15,meltingPoint:920,boilingPoint:3464},
  {z:58,sym:'Ce',nameEn:'Cerium',state:'solid',color:'#a0a0a0',category:'Lanthanide',desc:'Silvery-gray lanthanide',mass:140.116,discovered:1803,electronConfig:'[Xe] 4f\xB9 5d\xB9 6s\xB2',electronegativity:1.12,density:6.77,meltingPoint:798,boilingPoint:3443},
  {z:59,sym:'Pr',nameEn:'Praseodymium',state:'solid',color:'#a0a0a0',category:'Lanthanide',desc:'Yellowish-silvery lanthanide',mass:140.908,discovered:1885,electronConfig:'[Xe] 4f\xB3 6s\xB2',electronegativity:1.13,density:6.77,meltingPoint:931,boilingPoint:3520},
  {z:60,sym:'Nd',nameEn:'Neodymium',state:'solid',color:'#a0a0a0',category:'Lanthanide',desc:'Yellowish-silvery lanthanide, used in magnets',mass:144.243,discovered:1885,electronConfig:'[Xe] 4f\xB4 6s\xB2',electronegativity:1.14,density:7.01,meltingPoint:1016,boilingPoint:3127},
  {z:61,sym:'Pm',nameEn:'Promethium',state:'solid',color:'#a0a0a0',category:'Lanthanide',desc:'Radioactive lanthanide',mass:145,discovered:1945,electronConfig:'[Xe] 4f\xB5 6s\xB2',electronegativity:1.13,density:7.26,meltingPoint:1042,boilingPoint:3000},
  {z:62,sym:'Sm',nameEn:'Samarium',state:'solid',color:'#a0a0a0',category:'Lanthanide',desc:'Silvery-white lanthanide',mass:150.362,discovered:1879,electronConfig:'[Xe] 4f\xB6 6s\xB2',electronegativity:1.17,density:7.52,meltingPoint:1072,boilingPoint:1900},
  {z:63,sym:'Eu',nameEn:'Europium',state:'solid',color:'#a0a0a0',category:'Lanthanide',desc:'Silvery lanthanide, most reactive',mass:151.964,discovered:1901,electronConfig:'[Xe] 4f\xB7 6s\xB2',electronegativity:1.2,density:5.24,meltingPoint:826,boilingPoint:1529},
  {z:64,sym:'Gd',nameEn:'Gadolinium',state:'solid',color:'#a0a0a0',category:'Lanthanide',desc:'Silvery-white lanthanide',mass:157.250,discovered:1880,electronConfig:'[Xe] 4f\xB7 5d\xB9 6s\xB2',electronegativity:1.2,density:7.9,meltingPoint:1312,boilingPoint:3273},
  {z:65,sym:'Tb',nameEn:'Terbium',state:'solid',color:'#a0a0a0',category:'Lanthanide',desc:'Silvery-white lanthanide',mass:158.925,discovered:1843,electronConfig:'[Xe] 4f\xB9 6s\xB2',electronegativity:1.2,density:8.23,meltingPoint:1356,boilingPoint:3230},
  {z:66,sym:'Dy',nameEn:'Dysprosium',state:'solid',color:'#a0a0a0',category:'Lanthanide',desc:'Silvery lanthanide',mass:162.500,discovered:1886,electronConfig:'[Xe] 4f\xB9 6s\xB2',electronegativity:1.22,density:8.55,meltingPoint:1407,boilingPoint:2567},
  {z:67,sym:'Ho',nameEn:'Holmium',state:'solid',color:'#a0a0a0',category:'Lanthanide',desc:'Silvery lanthanide',mass:164.930,discovered:1878,electronConfig:'[Xe] 4f\xB9 6s\xB2',electronegativity:1.23,density:8.8,meltingPoint:1461,boilingPoint:2720},
  {z:68,sym:'Er',nameEn:'Erbium',state:'solid',color:'#a0a0a0',category:'Lanthanide',desc:'Silvery lanthanide',mass:167.259,discovered:1843,electronConfig:'[Xe] 4f\xB9 6s\xB2',electronegativity:1.24,density:9.07,meltingPoint:1529,boilingPoint:2868},
  {z:69,sym:'Tm',nameEn:'Thulium',state:'solid',color:'#a0a0a0',category:'Lanthanide',desc:'Silvery-gray lanthanide',mass:168.934,discovered:1879,electronConfig:'[Xe] 4f\xB9 6s\xB2',electronegativity:1.25,density:9.32,meltingPoint:1545,boilingPoint:1950},
  {z:70,sym:'Yb',nameEn:'Ytterbium',state:'solid',color:'#a0a0a0',category:'Lanthanide',desc:'Silvery lanthanide',mass:173.045,discovered:1878,electronConfig:'[Xe] 4f\xB9 6s\xB2',electronegativity:1.1,density:6.9,meltingPoint:824,boilingPoint:1196},
  {z:71,sym:'Lu',nameEn:'Lutetium',state:'solid',color:'#a0a0a0',category:'Lanthanide',desc:'Silvery-white lanthanide',mass:174.967,discovered:1907,electronConfig:'[Xe] 4f\xB9 5d\xB9 6s\xB2',electronegativity:1.27,density:9.84,meltingPoint:1652,boilingPoint:3402},
  {z:72,sym:'Hf',nameEn:'Hafnium',state:'solid',color:'#a0a0a0',category:'Transition metal',desc:'Silvery-gray transition metal',mass:178.490,discovered:1923,electronConfig:'[Xe] 4f\xB9 5d\xB2 6s\xB2',electronegativity:1.3,density:13.31,meltingPoint:2233,boilingPoint:4603},
  {z:73,sym:'Ta',nameEn:'Tantalum',state:'solid',color:'#808090',category:'Transition metal',desc:'Bluish-gray refractory metal',mass:180.948,discovered:1802,electronConfig:'[Xe] 4f\xB9 5d\xB3 6s\xB2',electronegativity:1.5,density:16.65,meltingPoint:3017,boilingPoint:5458},
  {z:74,sym:'W',nameEn:'Tungsten',state:'solid',color:'#808080',category:'Transition metal',desc:'Gray-white metal, highest melting point',mass:183.840,discovered:1781,electronConfig:'[Xe] 4f\xB9 5d\xB4 6s\xB2',electronegativity:2.36,density:19.25,meltingPoint:3422,boilingPoint:5555},
  {z:75,sym:'Re',nameEn:'Rhenium',state:'solid',color:'#a0a0a0',category:'Transition metal',desc:'Gray-white refractory metal',mass:186.207,discovered:1925,electronConfig:'[Xe] 4f\xB9 5d\xB5 6s\xB2',electronegativity:1.9,density:21.02,meltingPoint:3186,boilingPoint:5596},
  {z:76,sym:'Os',nameEn:'Osmium',state:'solid',color:'#9090a0',category:'Transition metal',desc:'Bluish-gray metal, densest element',mass:190.230,discovered:1803,electronConfig:'[Xe] 4f\xB9 5d\xB6 6s\xB2',electronegativity:2.2,density:22.59,meltingPoint:3033,boilingPoint:5012},
  {z:77,sym:'Ir',nameEn:'Iridium',state:'solid',color:'#c0c0c0',category:'Transition metal',desc:'Silvery-white precious metal, most corrosion-resistant',mass:192.217,discovered:1803,electronConfig:'[Xe] 4f\xB9 5d\xB7 6s\xB2',electronegativity:2.2,density:22.56,meltingPoint:2446,boilingPoint:4428},
  {z:78,sym:'Pt',nameEn:'Platinum',state:'solid',color:'#c0c0c0',category:'Transition metal',desc:'Silvery-white precious metal, catalytic',mass:195.084,discovered:0,electronConfig:'[Xe] 4f\xB9 5d\xB8 6s\xB9',electronegativity:2.28,density:21.45,meltingPoint:1768.2,boilingPoint:3825},
  {z:79,sym:'Au',nameEn:'Gold',state:'solid',color:'#d4a017',category:'Transition metal',desc:'Yellow precious metal, chemically inert',mass:196.967,discovered:0,electronConfig:'[Xe] 4f\xB9 5d\xB9 6s\xB9',electronegativity:2.54,density:19.32,meltingPoint:1064.2,boilingPoint:2856},
  {z:80,sym:'Hg',nameEn:'Mercury',state:'liquid',color:'#c0c0c0',category:'Post-transition',desc:'Only liquid metal at room temp, silvery',mass:200.592,discovered:0,electronConfig:'[Xe] 4f\xB9 5d\xB9 6s\xB2',electronegativity:2,density:13.53,meltingPoint:-38.8,boilingPoint:356.7},
  {z:81,sym:'Tl',nameEn:'Thallium',state:'solid',color:'#a0a0a0',category:'Post-transition',desc:'Gray-silvery post-transition metal, toxic',mass:204.380,discovered:1861,electronConfig:'[Xe] 4f\xB9 5d\xB9 6s\xB2 6p\xB9',electronegativity:1.62,density:11.85,meltingPoint:304,boilingPoint:1473},
  {z:82,sym:'Pb',nameEn:'Lead',state:'solid',color:'#808090',category:'Post-transition',desc:'Heavy bluish-gray metal, toxic',mass:207.200,discovered:0,electronConfig:'[Xe] 4f\xB9 5d\xB9 6s\xB2 6p\xB2',electronegativity:2.33,density:11.34,meltingPoint:327.5,boilingPoint:1749},
  {z:83,sym:'Bi',nameEn:'Bismuth',state:'solid',color:'#a0a0b0',category:'Post-transition',desc:'White-pinkish post-transition metal',mass:208.980,discovered:0,electronConfig:'[Xe] 4f\xB9 5d\xB9 6s\xB2 6p\xB3',electronegativity:2.02,density:9.78,meltingPoint:271.4,boilingPoint:1564},
  {z:84,sym:'Po',nameEn:'Polonium',state:'solid',color:'#a0a0a0',category:'Post-transition',desc:'Radioactive post-transition metal',mass:209,discovered:1898,electronConfig:'[Xe] 4f\xB9 5d\xB9 6s\xB2 6p\xB4',electronegativity:2,density:9.32,meltingPoint:254,boilingPoint:962},
  {z:85,sym:'At',nameEn:'Astatine',state:'solid',color:'#606060',category:'Halogen',desc:'Radioactive halogen',mass:210,discovered:1940,electronConfig:'[Xe] 4f\xB9 5d\xB9 6s\xB2 6p\xB5',electronegativity:2.2,density:7,meltingPoint:302,boilingPoint:337},
  {z:86,sym:'Rn',nameEn:'Radon',state:'gas',color:'#80d0d0',category:'Noble gas',desc:'Radioactive noble gas',mass:222,discovered:1900,electronConfig:'[Xe] 4f\xB9 5d\xB9 6s\xB2 6p\xB6',electronegativity:2.2,density:0.00973,meltingPoint:-71,boilingPoint:-61.7},
  {z:87,sym:'Fr',nameEn:'Francium',state:'solid',color:'#c0c0c0',category:'Alkali metal',desc:'Highly radioactive alkali metal',mass:223,discovered:1939,electronConfig:'[Rn] 7s\xB9',electronegativity:0.7,density:1.87,meltingPoint:27,boilingPoint:677},
  {z:88,sym:'Ra',nameEn:'Radium',state:'solid',color:'#c0c0c0',category:'Alkaline earth',desc:'Radioactive alkaline earth, glows blue',mass:226,discovered:1898,electronConfig:'[Rn] 7s\xB2',electronegativity:0.9,density:5.5,meltingPoint:700,boilingPoint:1140},
  {z:89,sym:'Ac',nameEn:'Actinium',state:'solid',color:'#a0a0a0',category:'Actinide',desc:'Silvery radioactive actinide',mass:227,discovered:1899,electronConfig:'[Rn] 6d\xB9 7s\xB2',electronegativity:1.1,density:10.07,meltingPoint:1050,boilingPoint:3200},
  {z:90,sym:'Th',nameEn:'Thorium',state:'solid',color:'#a0a0a0',category:'Actinide',desc:'Silvery radioactive actinide',mass:232.038,discovered:1829,electronConfig:'[Rn] 6d\xB2 7s\xB2',electronegativity:1.3,density:11.78,meltingPoint:1750,boilingPoint:4820},
  {z:91,sym:'Pa',nameEn:'Protactinium',state:'solid',color:'#a0a0a0',category:'Actinide',desc:'Radioactive actinide',mass:231.036,discovered:1913,electronConfig:'[Rn] 5f\xB2 6d\xB9 7s\xB2',electronegativity:1.5,density:15.37,meltingPoint:1568,boilingPoint:4027},
  {z:92,sym:'U',nameEn:'Uranium',state:'solid',color:'#808080',category:'Actinide',desc:'Silvery-gray radioactive, nuclear fuel',mass:238.029,discovered:1789,electronConfig:'[Rn] 5f\xB3 6d\xB9 7s\xB2',electronegativity:1.38,density:18.95,meltingPoint:1132.2,boilingPoint:4131},
  {z:93,sym:'Np',nameEn:'Neptunium',state:'solid',color:'#a0a0a0',category:'Actinide',desc:'Silvery radioactive actinide',mass:237,discovered:1940,electronConfig:'[Rn] 5f\xB4 6d\xB9 7s\xB2',electronegativity:1.36,density:20.45,meltingPoint:639,boilingPoint:3900},
  {z:94,sym:'Pu',nameEn:'Plutonium',state:'solid',color:'#a0a0a0',category:'Actinide',desc:'Silvery-white radioactive, weapon fuel',mass:244,discovered:1940,electronConfig:'[Rn] 5f\xB6 7s\xB2',electronegativity:1.28,density:19.82,meltingPoint:639.5,boilingPoint:3228},
  {z:95,sym:'Am',nameEn:'Americium',state:'solid',color:'#a0a0a0',category:'Actinide',desc:'Silvery-white synthetic actinide',mass:243,discovered:1944,electronConfig:'[Rn] 5f\xB7 7s\xB2',electronegativity:1.3,density:13.67,meltingPoint:1176,boilingPoint:2607},
  {z:96,sym:'Cm',nameEn:'Curium',state:'solid',color:'#a0a0a0',category:'Actinide',desc:'Silvery synthetic actinide',mass:247,discovered:1944,electronConfig:'[Rn] 5f\xB7 6d\xB9 7s\xB2',electronegativity:1.3,density:13.51,meltingPoint:1345,boilingPoint:3110},
  {z:97,sym:'Bk',nameEn:'Berkelium',state:'solid',color:'#a0a0a0',category:'Actinide',desc:'Silvery synthetic actinide',mass:247,discovered:1949,electronConfig:'[Rn] 5f\xB9 7s\xB2',electronegativity:1.3,density:14.78,meltingPoint:986,boilingPoint:2627},
  {z:98,sym:'Cf',nameEn:'Californium',state:'solid',color:'#a0a0a0',category:'Actinide',desc:'Silvery synthetic actinide',mass:251,discovered:1950,electronConfig:'[Rn] 5f\xB9 7s\xB2',electronegativity:1.3,density:15.1,meltingPoint:900,boilingPoint:1470},
  {z:99,sym:'Es',nameEn:'Einsteinium',state:'solid',color:'#a0a0a0',category:'Actinide',desc:'Synthetic radioactive actinide',mass:252,discovered:1952,electronConfig:'[Rn] 5f\xB9 7s\xB2',electronegativity:1.3,density:8.84,meltingPoint:860,boilingPoint:996},
  {z:100,sym:'Fm',nameEn:'Fermium',state:'unknown',color:'#888888',category:'Actinide',desc:'Synthetic radioactive actinide',mass:257,discovered:1952,electronConfig:'[Rn] 5f\xB9 7s\xB2',electronegativity:1.3,density:9.7,meltingPoint:1527,boilingPoint:0},
  {z:101,sym:'Md',nameEn:'Mendelevium',state:'unknown',color:'#888888',category:'Actinide',desc:'Synthetic radioactive actinide',mass:258,discovered:1955,electronConfig:'[Rn] 5f\xB9 7s\xB2',electronegativity:1.3,density:10.3,meltingPoint:1100,boilingPoint:0},
  {z:102,sym:'No',nameEn:'Nobelium',state:'unknown',color:'#888888',category:'Actinide',desc:'Synthetic radioactive actinide',mass:259,discovered:1958,electronConfig:'[Rn] 5f\xB9 7s\xB2',electronegativity:1.3,density:9.9,meltingPoint:1100,boilingPoint:0},
  {z:103,sym:'Lr',nameEn:'Lawrencium',state:'unknown',color:'#888888',category:'Actinide',desc:'Synthetic radioactive actinide',mass:266,discovered:1961,electronConfig:'[Rn] 5f\xB9 7s\xB2 7p\xB9',electronegativity:1.3,density:15.6,meltingPoint:1900,boilingPoint:0},
  {z:104,sym:'Rf',nameEn:'Rutherfordium',state:'unknown',color:'#888888',category:'Transition metal',desc:'Synthetic radioactive transition metal',mass:267,discovered:1964,electronConfig:'[Rn] 5f\xB9 6d\xB2 7s\xB2',electronegativity:0,density:18.1,meltingPoint:2400,boilingPoint:5800},
  {z:105,sym:'Db',nameEn:'Dubnium',state:'unknown',color:'#888888',category:'Transition metal',desc:'Synthetic radioactive transition metal',mass:268,discovered:1967,electronConfig:'[Rn] 5f\xB9 6d\xB3 7s\xB2',electronegativity:0,density:21.6,meltingPoint:0,boilingPoint:0},
  {z:106,sym:'Sg',nameEn:'Seaborgium',state:'unknown',color:'#888888',category:'Transition metal',desc:'Synthetic radioactive transition metal',mass:269,discovered:1974,electronConfig:'[Rn] 5f\xB9 6d\xB4 7s\xB2',electronegativity:0,density:23.2,meltingPoint:0,boilingPoint:0},
  {z:107,sym:'Bh',nameEn:'Bohrium',state:'unknown',color:'#888888',category:'Transition metal',desc:'Synthetic radioactive transition metal',mass:270,discovered:1976,electronConfig:'[Rn] 5f\xB9 6d\xB5 7s\xB2',electronegativity:0,density:26.7,meltingPoint:0,boilingPoint:0},
  {z:108,sym:'Hs',nameEn:'Hassium',state:'unknown',color:'#888888',category:'Transition metal',desc:'Synthetic radioactive transition metal',mass:277,discovered:1984,electronConfig:'[Rn] 5f\xB9 6d\xB6 7s\xB2',electronegativity:0,density:27.6,meltingPoint:0,boilingPoint:0},
  {z:109,sym:'Mt',nameEn:'Meitnerium',state:'unknown',color:'#888888',category:'Unknown',desc:'Synthetic radioactive element',mass:278,discovered:1982,electronConfig:'[Rn] 5f\xB9 6d\xB7 7s\xB2',electronegativity:0,density:28.4,meltingPoint:0,boilingPoint:0},
  {z:110,sym:'Ds',nameEn:'Darmstadtium',state:'unknown',color:'#888888',category:'Unknown',desc:'Synthetic radioactive element',mass:281,discovered:1994,electronConfig:'[Rn] 5f\xB9 6d\xB8 7s\xB2',electronegativity:0,density:27.2,meltingPoint:0,boilingPoint:0},
  {z:111,sym:'Rg',nameEn:'Roentgenium',state:'unknown',color:'#888888',category:'Unknown',desc:'Synthetic radioactive element',mass:282,discovered:1994,electronConfig:'[Rn] 5f\xB9 6d\xB9 7s\xB2',electronegativity:0,density:23.7,meltingPoint:0,boilingPoint:0},
  {z:112,sym:'Cn',nameEn:'Copernicium',state:'unknown',color:'#888888',category:'Transition metal',desc:'Synthetic radioactive transition metal',mass:285,discovered:1996,electronConfig:'[Rn] 5f\xB9 6d\xB9 7s\xB2',electronegativity:0,density:23.7,meltingPoint:0,boilingPoint:0},
  {z:113,sym:'Nh',nameEn:'Nihonium',state:'unknown',color:'#888888',category:'Unknown',desc:'Synthetic radioactive element',mass:286,discovered:2003,electronConfig:'[Rn] 5f\xB9 6d\xB9 7s\xB2 7p\xB9',electronegativity:0,density:16,meltingPoint:700,boilingPoint:1130},
  {z:114,sym:'Fl',nameEn:'Flerovium',state:'unknown',color:'#888888',category:'Unknown',desc:'Synthetic radioactive element',mass:289,discovered:1998,electronConfig:'[Rn] 5f\xB9 6d\xB9 7s\xB2 7p\xB2',electronegativity:0,density:11.4,meltingPoint:0,boilingPoint:0},
  {z:115,sym:'Mc',nameEn:'Moscovium',state:'unknown',color:'#888888',category:'Unknown',desc:'Synthetic radioactive element',mass:290,discovered:2003,electronConfig:'[Rn] 5f\xB9 6d\xB9 7s\xB2 7p\xB3',electronegativity:0,density:13.5,meltingPoint:700,boilingPoint:1130},
  {z:116,sym:'Lv',nameEn:'Livermorium',state:'unknown',color:'#888888',category:'Unknown',desc:'Synthetic radioactive element',mass:293,discovered:2000,electronConfig:'[Rn] 5f\xB9 6d\xB9 7s\xB2 7p\xB4',electronegativity:0,density:12.9,meltingPoint:0,boilingPoint:0},
  {z:117,sym:'Ts',nameEn:'Tennessine',state:'unknown',color:'#888888',category:'Halogen',desc:'Synthetic radioactive halogen',mass:294,discovered:2010,electronConfig:'[Rn] 5f\xB9 6d\xB9 7s\xB2 7p\xB5',electronegativity:0,density:7.2,meltingPoint:700,boilingPoint:1130},
  {z:118,sym:'Og',nameEn:'Oganesson',state:'unknown',color:'#888888',category:'Noble gas',desc:'Synthetic radioactive noble gas',mass:295,discovered:2002,electronConfig:'[Rn] 5f\xB9 6d\xB9 7s\xB2 7p\xB6',electronegativity:0,density:5,meltingPoint:0,boilingPoint:0},
];

export const ELEMENTS: Element[] = RAW_ELEMENTS.map(e => ({
  z: e.z!,
  sym: e.sym!,
  name: e.nameEn!,
  nameEn: e.nameEn!,
  state: e.state!,
  color: e.color!,
  category: e.category!,
  desc: e.desc!,
  mass: e.mass,
  discovered: e.discovered,
  electronConfig: e.electronConfig,
  electronegativity: e.electronegativity,
  density: e.density,
  meltingPoint: e.meltingPoint,
  boilingPoint: e.boilingPoint,
}));

ELEMENTS.sort((a, b) => a.z - b.z);

export function getElement(z: number): Element {
  z = Math.max(0, Math.min(118, Math.round(z)));
  return ELEMENTS.find(e => e.z === z) || ELEMENTS[0];
}

export function getStableNeutrons(protons: number): number {
  if (protons <= 1) return 0;
  if (protons <= 20) return protons;
  if (protons <= 40) return protons + Math.round((protons - 20) * 0.3);
  if (protons <= 60) return protons + Math.round(6 + (protons - 40) * 0.5);
  if (protons <= 80) return protons + Math.round(16 + (protons - 60) * 0.6);
  return protons + Math.round(28 + (protons - 80) * 0.65);
}

const NEUTRON_CACHE: number[] = [];
for (let z = 0; z <= 118; z++) { NEUTRON_CACHE[z] = getStableNeutrons(z); }
export function getCachedNeutrons(z: number): number {
  return NEUTRON_CACHE[Math.max(0, Math.min(118, Math.round(z)))] || 0;
}

export function getShellConfig(electrons: number): number[] {
  const max = [2, 8, 18, 18, 32, 32, 8];
  const config: number[] = [];
  let remain = electrons;
  for (const m of max) {
    if (remain <= 0) config.push(0);
    else if (remain <= m) { config.push(remain); remain = 0; }
    else { config.push(m); remain -= m; }
  }
  if (remain > 0) config[config.length - 1] += remain;
  return config;
}

import { getCategoryColor as gcc } from '../theme';

export function getCategoryColor(category: string): string {
  return gcc(category);
}
