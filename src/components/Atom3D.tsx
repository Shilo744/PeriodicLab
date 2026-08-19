import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Ellipse, G, Defs, RadialGradient, Stop } from 'react-native-svg';

interface Atom3DProps {
  protons: number;
  neutrons: number;
  electrons: number;
  size?: number;
  elementColor?: string;
}

interface Point3D { x: number; y: number; z: number; }

function project(p: Point3D, angleY: number, angleX: number, focalLength: number, cx: number, cy: number) {
  const cosY = Math.cos(angleY), sinY = Math.sin(angleY);
  let x = p.x * cosY - p.z * sinY;
  let z = p.x * sinY + p.z * cosY;
  const cosX = Math.cos(angleX), sinX = Math.sin(angleX);
  let y = p.y * cosX - z * sinX;
  z = p.y * sinX + z * cosX;
  const scale = focalLength / (focalLength + z + 6);
  return { x: cx + x * scale * cx * 0.8, y: cy + y * scale * cy * 0.8, z, scale };
}

function getShellConfig(electrons: number): number[] {
  const maxPer = [2, 8, 18, 18, 32];
  const cfg: number[] = [];
  let rem = electrons;
  for (const m of maxPer) {
    if (rem <= 0) break;
    cfg.push(Math.min(rem, m));
    rem -= Math.min(rem, m);
  }
  return cfg;
}

export default function Atom3D({ size = 300, elementColor = '#ff6b6b', protons, neutrons, electrons }: Atom3DProps) {
  const [angle, setAngle] = useState(0);
  const frameRef = useRef(0);

  useEffect(() => {
    let last = Date.now();
    function tick() {
      const now = Date.now();
      const dt = (now - last) / 1000;
      last = now;
      setAngle(a => a + dt * 0.5);
      frameRef.current = requestAnimationFrame(tick);
    }
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  const shellConfig = getShellConfig(electrons);
  const shellColors = ['#00f5ff', '#00ff87', '#ffaf00', '#ff00d4', '#8a2be2'];
  const shellRadii = [1.3, 2.2, 3.1, 4.0, 5.0];

  const maxActiveRadius = shellConfig.length > 0 ? shellRadii[shellConfig.length - 1] : 1.2;
  const viewScale = 3.6 / maxActiveRadius;

  const total = protons + neutrons;
  const cx = size / 2, cy = size / 2;
  const focal = size;
  const tiltX = 0.4;

  const nucRadius = total <= 6 ? 0.35 : total <= 15 ? 0.45 : total <= 40 ? 0.6 : total <= 80 ? 0.75 : 0.9;

  const nucParticles: { pos: Point3D; isProton: boolean }[] = [];
  for (let i = 0; i < total; i++) {
    const isP = (i * protons) % total < protons;
    const phi = Math.acos(1 - 2 * (i + 0.5) / total);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const r = nucRadius;
    nucParticles.push({
      pos: { x: r * Math.sin(phi) * Math.cos(theta), y: r * Math.sin(phi) * Math.sin(theta), z: r * Math.cos(phi) },
      isProton: isP,
    });
  }

  const projectedNuc = nucParticles.map((p, idx) => ({
    ...project({ x: p.pos.x * viewScale, y: p.pos.y * viewScale, z: p.pos.z * viewScale }, angle, tiltX, focal, cx, cy),
    isProton: p.isProton,
    idx,
  }));

  const orbitProj: { shell: number; rx: number; ry: number }[] = [];
  shellConfig.forEach((count, s) => {
    if (count === 0) return;
    const r = shellRadii[s] * viewScale;
    const points = [
      project({ x: r, y: 0, z: 0 }, angle, tiltX, focal, cx, cy),
      project({ x: 0, y: r, z: 0 }, angle, tiltX, focal, cx, cy),
      project({ x: -r, y: 0, z: 0 }, angle, tiltX, focal, cx, cy),
      project({ x: 0, y: -r, z: 0 }, angle, tiltX, focal, cx, cy),
    ];
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    points.forEach(p => { minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x); minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y); });
    orbitProj.push({ shell: s, rx: (maxX - minX) / 2, ry: (maxY - minY) / 2 });
  });

  const electrons3D: { pos: Point3D; shell: number }[] = [];
  shellConfig.forEach((count, s) => {
    if (count === 0) return;
    const r = shellRadii[s];
    for (let e = 0; e < count; e++) {
      const phi = Math.acos(1 - 2 * (e + 0.5) / count);
      const theta = e * Math.PI * (3 - Math.sqrt(5));
      electrons3D.push({
        pos: { x: r * Math.sin(phi) * Math.cos(theta), y: r * Math.sin(phi) * Math.sin(theta), z: r * Math.cos(phi) },
        shell: s,
      });
    }
  });

  const projectedEls = electrons3D.map(e => ({
    ...project({ x: e.pos.x * viewScale, y: e.pos.y * viewScale, z: e.pos.z * viewScale }, angle, tiltX, focal, cx, cy),
    shell: e.shell
  }));

  projectedNuc.sort((a, b) => b.z - a.z);
  projectedEls.sort((a, b) => b.z - a.z);

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ backgroundColor: 'transparent' }}>
        <Defs>
          <RadialGradient id="nucGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={elementColor} stopOpacity="0.45" />
            <Stop offset="60%" stopColor={elementColor} stopOpacity="0.15" />
            <Stop offset="100%" stopColor={elementColor} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        
        <Circle cx={cx} cy={cy} r={Math.min(size * 0.45, size * nucRadius * viewScale * 0.45)} fill="url(#nucGlow)" />

        {orbitProj.map((o) => (
          <Ellipse key={o.shell} cx={cx} cy={cy} rx={o.rx} ry={o.ry} fill="none" stroke={shellColors[o.shell]} strokeOpacity="0.25" strokeWidth="1.2" strokeDasharray="3,3" />
        ))}

        {projectedNuc.map((p, i) => {
          const r = Math.max(3, Math.min(8.5, 7.5 - p.z * 1.5));
          const color = p.isProton ? '#ef4444' : '#60a5fa';
          const glowColor = p.isProton ? 'rgba(239, 68, 68, 0.3)' : 'rgba(96, 165, 250, 0.3)';
          const opacity = Math.max(0.4, Math.min(1, 1 + p.z * 0.15));
          return (
            <G key={`n${p.idx}`}>
              {/* Outer Glow Halo */}
              <Circle cx={p.x} cy={p.y} r={r * 1.4} fill={glowColor} opacity={opacity * 0.4} />
              {/* Core Particle */}
              <Circle cx={p.x} cy={p.y} r={r} fill={color} opacity={opacity} />
            </G>
          );
        })}

        {projectedEls.map((p, i) => {
          const r = Math.max(2.5, 4.5 - p.z * 0.5);
          const color = shellColors[p.shell];
          const glowColor = color + '40';
          const opacity = Math.max(0.6, Math.min(1, 1 + p.z * 0.08));
          return (
            <G key={`e${i}`}>
              {/* Electron Glow */}
              <Circle cx={p.x} cy={p.y} r={r * 1.6} fill={glowColor} opacity={opacity * 0.3} />
              {/* Electron Core */}
              <Circle cx={p.x} cy={p.y} r={r} fill={color} opacity={opacity} />
            </G>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' },
});