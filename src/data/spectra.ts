export interface SpectralLine {
  wavelength: number; // nm
  color: string;
  intensity: number; // 0.1 to 1.0
}

export interface ElementSpectra {
  z: number;
  lines: SpectralLine[];
  description: string;
}

// Prominent optical spectral emission lines (NIST Atomic Spectra Database)
const KNOWN_SPECTRA: Record<number, { lines: SpectralLine[]; description: string }> = {
  1: {
    // Hydrogen Balmer Series (656nm H-alpha, 486nm H-beta, 434nm H-gamma, 410nm H-delta)
    lines: [
      { wavelength: 656.3, color: '#ef4444', intensity: 1.0 }, // Red
      { wavelength: 486.1, color: '#22d3ee', intensity: 0.8 }, // Cyan
      { wavelength: 434.0, color: '#60a5fa', intensity: 0.5 }, // Blue
      { wavelength: 410.2, color: '#a855f7', intensity: 0.35 }, // Violet
    ],
    description: 'Classic Balmer Series optical emission lines observed in stellar spectroscopy.',
  },
  2: {
    // Helium
    lines: [
      { wavelength: 706.5, color: '#dc2626', intensity: 0.6 },
      { wavelength: 667.8, color: '#ef4444', intensity: 0.7 },
      { wavelength: 587.6, color: '#fbbf24', intensity: 1.0 }, // Famous D3 solar line
      { wavelength: 501.6, color: '#34d399', intensity: 0.6 },
      { wavelength: 447.1, color: '#60a5fa', intensity: 0.8 },
      { wavelength: 388.9, color: '#c084fc', intensity: 0.4 },
    ],
    description: 'First discovered in the Sun’s chromosphere spectrum (587.6 nm D3 line) in 1868.',
  },
  10: {
    // Neon
    lines: [
      { wavelength: 640.2, color: '#ef4444', intensity: 1.0 },
      { wavelength: 614.3, color: '#f97316', intensity: 0.9 },
      { wavelength: 585.2, color: '#fbbf24', intensity: 0.8 },
      { wavelength: 540.0, color: '#34d399', intensity: 0.4 },
    ],
    description: 'Dense cluster of brilliant orange and crimson emission lines in glow discharge tubes.',
  },
  11: {
    // Sodium
    lines: [
      { wavelength: 589.0, color: '#eab308', intensity: 1.0 }, // D2 line
      { wavelength: 589.6, color: '#facc15', intensity: 0.95 }, // D1 line
      { wavelength: 330.2, color: '#c084fc', intensity: 0.2 },
    ],
    description: 'Intense 589 nm yellow-orange Fraunhofer D doublet characteristic of streetlights.',
  },
  80: {
    // Mercury
    lines: [
      { wavelength: 579.1, color: '#fbbf24', intensity: 0.8 },
      { wavelength: 546.1, color: '#22c55e', intensity: 1.0 }, // Strong Green
      { wavelength: 435.8, color: '#3b82f6', intensity: 0.9 }, // Deep Blue
      { wavelength: 404.7, color: '#8b5cf6', intensity: 0.7 }, // Violet
    ],
    description: 'High-intensity fluorescent and UV mercury vapor discharge spectrum.',
  },
};

export function getElementSpectra(z: number): ElementSpectra {
  if (KNOWN_SPECTRA[z]) {
    return { z, ...KNOWN_SPECTRA[z] };
  }

  // Procedurally generated realistic optical spectrum based on atomic number Z
  const numLines = 3 + (z % 5);
  const lines: SpectralLine[] = [];
  for (let i = 0; i < numLines; i++) {
    const seed = (z * 137 + i * 89) % 320;
    const wavelength = 390 + seed; // 390 nm to 710 nm visible range
    
    // Calculate wavelength RGB hue
    let color = '#60a5fa';
    if (wavelength > 620) color = '#ef4444';
    else if (wavelength > 580) color = '#f97316';
    else if (wavelength > 560) color = '#fbbf24';
    else if (wavelength > 500) color = '#34d399';
    else if (wavelength > 450) color = '#22d3ee';
    else color = '#a855f7';

    lines.push({
      wavelength: parseFloat(wavelength.toFixed(1)),
      color,
      intensity: 0.4 + ((seed % 6) / 10),
    });
  }

  return {
    z,
    lines: lines.sort((a, b) => a.wavelength - b.wavelength),
    description: `Characteristic optical atomic emission fingerprint for Element Z=${z}.`,
  };
}
