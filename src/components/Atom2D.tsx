import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, G, Defs, RadialGradient, Stop } from 'react-native-svg';

interface Atom2DProps {
  protons: number;
  neutrons: number;
  electrons: number;
  size?: number;
}

const SHELL_MAX = [2, 8, 18, 18, 32, 32, 8];
const ELECTRON_COLORS = ['#74b9ff', '#0984e3', '#55efc4', '#fdcb6e', '#fd79a8', '#a29bfe', '#e17055'];
const SHELL_RADII = [0.15, 0.25, 0.35, 0.43, 0.49, 0.55, 0.59];

function getShellConfig(electrons: number): number[] {
  const config: number[] = [];
  let remain = electrons;
  for (const m of SHELL_MAX) {
    if (remain <= 0) { config.push(0); continue; }
    if (remain <= m) { config.push(remain); remain = 0; }
    else { config.push(m); remain -= m; }
  }
  if (remain > 0) config[config.length - 1] += remain;
  return config;
}

export default function Atom2D({ protons, neutrons, electrons, size = 280 }: Atom2DProps) {
  const half = size / 2;
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => t + 0.06);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const shellConfig = getShellConfig(electrons);
  const activeShells = shellConfig.filter(c => c > 0).length;
  const total = protons + neutrons;
  const centerR = Math.min(size * 0.1 + total * 0.28, size * 0.16);

  const nucleusParticles: { x: number; y: number; isProton: boolean }[] = [];
  for (let i = 0; i < total; i++) {
    const theta = ((i * 2.3999) % 1) * Math.PI * 2;
    const phi = ((i * 1.618) % 1) * 2 - 1;
    const r = centerR * 0.2 + (i / total) * centerR * 0.8;
    const r2d = Math.sqrt(1 - phi * phi);
    nucleusParticles.push({
      x: half + r * r2d * Math.cos(theta),
      y: half + r * phi,
      isProton: i < protons,
    });
  }

  const pRadius = Math.min(size * 0.075, 10);
  const nRadius = Math.min(size * 0.065, 9);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <RadialGradient id="nucleusGlow" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor="#ff6b6b" stopOpacity="0.25" />
            <Stop offset="60%" stopColor="#ff6b6b" stopOpacity="0.08" />
            <Stop offset="100%" stopColor="#ff6b6b" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Orbits */}
        {Array.from({ length: activeShells }).map((_, s) => (
          <Circle
            key={`o${s}`}
            cx={half}
            cy={half}
            r={SHELL_RADII[s] * size}
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={0.8}
            strokeDasharray={s % 2 === 0 ? "0" : "3,3"}
            fill="none"
            opacity={0.6}
          />
        ))}

        {/* Extra orbit rings for depth */}
        {Array.from({ length: Math.min(activeShells, 3) }).map((_, s) => (
          <Circle
            key={`o2-${s}`}
            cx={half + size * 0.02}
            cy={half - size * 0.01}
            r={SHELL_RADII[s] * size}
            stroke={ELECTRON_COLORS[s % ELECTRON_COLORS.length]}
            strokeWidth={0.3}
            fill="none"
            opacity={0.12}
          />
        ))}

        {/* Nucleus glow */}
        <Circle
          cx={half}
          cy={half}
          r={centerR * 2}
          fill="url(#nucleusGlow)"
        />

        {/* Nucleus particles */}
        {nucleusParticles.map((p, i) => (
          <Circle
            key={`n${i}`}
            cx={p.x}
            cy={p.y}
            r={p.isProton ? pRadius : nRadius}
            fill={p.isProton ? '#ff6b6b' : '#a29bfe'}
            opacity={0.9}
          />
        ))}

        {/* Nucleus highlight */}
        <Circle
          cx={half - centerR * 0.15}
          cy={half - centerR * 0.15}
          r={centerR * 0.5}
          fill="rgba(255,255,255,0.06)"
        />

        {/* Electrons */}
        {Array.from({ length: activeShells }).map((_, s) => {
          const count = shellConfig[s];
          const r = SHELL_RADII[s] * size;
          const speed = 1.5 - s * 0.2;
          const color = ELECTRON_COLORS[s % ELECTRON_COLORS.length];

          return Array.from({ length: count }).map((_, e) => {
            const angle = (e / count) * Math.PI * 2 + time * speed;
            const ex = half + Math.cos(angle) * r;
            const ey = half + Math.sin(angle) * r;
            return (
              <G key={`e${s}-${e}`}>
                <Circle
                  cx={ex}
                  cy={ey}
                  r={size * 0.022}
                  fill={color}
                  opacity={0.3}
                />
                <Circle
                  cx={ex}
                  cy={ey}
                  r={size * 0.014}
                  fill={color}
                  opacity={0.9}
                />
              </G>
            );
          });
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    borderRadius: 16,
    overflow: 'hidden',
  },
});
