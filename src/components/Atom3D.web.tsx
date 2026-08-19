import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface Atom3DProps {
  protons: number;
  neutrons: number;
  electrons: number;
  size?: number;
  elementColor?: string;
}

const SHELL_COLORS = [0x74b9ff, 0x55efc4, 0xfdcb6e, 0xfd79a8, 0xa29bfe, 0x00b894, 0x6c5ce7];
const SHELL_SIZES = [1.6, 2.6, 3.6, 4.6, 5.6, 6.6, 7.4];

function getShellConfig(electrons: number): number[] {
  const maxPerShell = [2, 8, 18, 18, 32, 32, 8];
  const config: number[] = [];
  let remain = electrons;
  for (const m of maxPerShell) {
    if (remain <= 0) config.push(0);
    else if (remain <= m) { config.push(remain); remain = 0; }
    else { config.push(m); remain -= m; }
  }
  if (remain > 0) config[config.length - 1] += remain;
  return config;
}

function createGlowTexture(color: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64; canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, color);
  g.addColorStop(0.3, color.slice(0, 7) + '88');
  g.addColorStop(1, 'transparent');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

export default function Atom3D({ protons, neutrons, electrons, size = 300, elementColor = '#ff6b6b' }: Atom3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const atomGroupRef = useRef<THREE.Group | null>(null);
  const nucleusGroupRef = useRef<THREE.Group | null>(null);
  const shellGroupsRef = useRef<THREE.Group[]>([]);
  const animFrameRef = useRef<number>(0);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());
  const pointLightRef = useRef<THREE.PointLight | null>(null);

  // Init scene once
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const w = container.clientWidth || size;
    const h = container.clientHeight || size;

    const camera = new THREE.PerspectiveCamera(40, w / h || 1, 0.1, 1000);
    camera.position.set(6, 3, 8);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 3;
    controls.maxDistance = 16;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.7;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    scene.add(new THREE.AmbientLight(0x222244, 0.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);
    const fillLight = new THREE.DirectionalLight(0x6c5ce7, 0.7);
    fillLight.position.set(-5, -3, -5);
    scene.add(fillLight);
    const rimLight = new THREE.DirectionalLight(0x74b9ff, 0.5);
    rimLight.position.set(0, -8, 5);
    scene.add(rimLight);

    const pLight = new THREE.PointLight(elementColor, 0.8, 20);
    pLight.position.set(0, 0, 4);
    scene.add(pLight);
    pointLightRef.current = pLight;

    const atomGroup = new THREE.Group();
    scene.add(atomGroup);
    atomGroupRef.current = atomGroup;

    const nucleusGroup = new THREE.Group();
    atomGroup.add(nucleusGroup);
    nucleusGroupRef.current = nucleusGroup;

    const shells: THREE.Group[] = [];
    for (let i = 0; i < 7; i++) {
      const g = new THREE.Group();
      atomGroup.add(g);
      shells.push(g);
    }
    shellGroupsRef.current = shells;

    function animate() {
      animFrameRef.current = requestAnimationFrame(animate);
      const time = clockRef.current.getElapsedTime();
      for (const shell of shellGroupsRef.current) {
        for (const child of shell.children) {
          const d = (child as any).userData;
          if (d?.angle !== undefined) {
            const angle = d.angle + time * d.speed * 0.7;
            child.position.set(
              d.radius * Math.cos(angle),
              d.radius * Math.sin(angle) * Math.cos(d.tiltX || 0),
              d.radius * Math.sin(angle) * Math.sin((d.tiltZ || 0) + (d.tiltX || 0))
            );
          }
        }
      }
      if (nucleusGroup) {
        nucleusGroup.rotation.y = time * 0.1;
        nucleusGroup.rotation.x = Math.sin(time * 0.07) * 0.1;
      }
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    const onResize = () => {
      const cw = container.clientWidth || size;
      const ch = container.clientHeight || size;
      if (cw === 0 || ch === 0) return;
      camera.aspect = cw / ch;
      camera.updateProjectionMatrix();
      renderer.setSize(cw, ch);
    };
    window.addEventListener('resize', onResize);
    renderer.domElement.addEventListener('pointerdown', () => { controls.autoRotate = false; });
    renderer.domElement.addEventListener('pointerup', () => { setTimeout(() => { controls.autoRotate = true; }, 3000); });

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      controls.dispose();
      scene.traverse((obj: any) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry?.dispose();
          if (obj.material) {
            if (Array.isArray(obj.material)) obj.material.forEach((m: any) => m.dispose());
            else obj.material.dispose();
          }
        }
      });
    };
  }, []);

  // Rebuild atom when props change
  useEffect(() => {
    const nucleusGroup = nucleusGroupRef.current;
    const shellGroups = shellGroupsRef.current;
    const pLight = pointLightRef.current;
    if (!nucleusGroup || !shellGroups.length) return;

    // Clear
    while (nucleusGroup.children.length) {
      const c = nucleusGroup.children[0] as THREE.Mesh;
      if (c.geometry) c.geometry.dispose();
      if (c.material) {
        if (Array.isArray(c.material)) c.material.forEach((m: any) => m.dispose());
        else c.material.dispose();
      }
      nucleusGroup.remove(c);
    }
    for (const sg of shellGroups) {
      while (sg.children.length) {
        const c = sg.children[0] as THREE.Mesh;
        if (c.geometry) c.geometry.dispose();
        if (c.material) {
          if (Array.isArray(c.material)) c.material.forEach((m: any) => m.dispose());
          else c.material.dispose();
        }
        sg.remove(c);
      }
    }

    const total = protons + neutrons;
    const glowSize = Math.max(2.5, Math.min(8, total * 0.08 + 1.5));

    const glowTex = createGlowTexture(elementColor);
    const glowMat = new THREE.SpriteMaterial({ map: glowTex, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.5 });
    const glowSprite = new THREE.Sprite(glowMat);
    glowSprite.scale.set(glowSize * 1.8, glowSize * 1.8, 1);
    nucleusGroup.add(glowSprite);

    if (pLight) { pLight.color.set(new THREE.Color(elementColor)); pLight.intensity = Math.min(1.5, 0.5 + total * 0.015); }

    for (let i = 0; i < total; i++) {
      const isP = (i * protons) % total < protons;
      const particleSize = total <= 6 ? 0.3 : total <= 15 ? 0.26 : total <= 40 ? 0.22 : total <= 80 ? 0.18 : 0.14;
      const maxR = total <= 6 ? 0.48 : total <= 15 ? 0.62 : total <= 40 ? 0.82 : total <= 80 ? 1.05 : 1.3;
      const phi = Math.acos(1 - 2 * (i + 0.5) / total);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const x = maxR * Math.sin(phi) * Math.cos(theta);
      const y = maxR * Math.sin(phi) * Math.sin(theta);
      const z1 = maxR * Math.cos(phi);
      const geo = new THREE.SphereGeometry(particleSize, 16, 16);
      const color = isP ? 0xff6b6b : 0xa29bfe;
      const emis = isP ? 0xff4444 : 0x7c6ce7;
      const mat = new THREE.MeshPhysicalMaterial({ color, emissive: emis, emissiveIntensity: 0.3, metalness: 0.05, roughness: 0.25, clearcoat: 0.15 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z1);
      nucleusGroup.add(mesh);

      const pglowTex = createGlowTexture(isP ? '#ff6b6b' : '#a29bfe');
      const pglowMat = new THREE.SpriteMaterial({ map: pglowTex, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.4 });
      const pglow = new THREE.Sprite(pglowMat);
      pglow.scale.set(particleSize * 2.5, particleSize * 2.5, 1);
      pglow.position.copy(mesh.position);
      nucleusGroup.add(pglow);
    }

    const shellConfig = getShellConfig(electrons);
    for (let s = 0; s < shellConfig.length && s < 7; s++) {
      const count = shellConfig[s];
      if (count === 0) continue;
      const radius = SHELL_SIZES[s];
      const shellColor = SHELL_COLORS[s % SHELL_COLORS.length];

      for (let e = 0; e < count; e++) {
        const eSize = Math.max(0.07, 0.14 - s * 0.01 - count * 0.002);
        const eGeo = new THREE.SphereGeometry(eSize, 12, 12);
        const eMat = new THREE.MeshPhysicalMaterial({ color: shellColor, emissive: shellColor, emissiveIntensity: 0.5, metalness: 0, roughness: 0.15, transparent: true, opacity: 0.85 });
        const eMesh = new THREE.Mesh(eGeo, eMat);
        (eMesh as any).userData = {
          angle: (e / count) * Math.PI * 2,
          radius, speed: 0.5 + s * 0.25 + e * 0.03,
          tiltX: (s % 3) * 0.5, tiltZ: s * 0.6,
        };
        shellGroups[s].add(eMesh);

        const eGlowTex = createGlowTexture('#' + shellColor.toString(16).padStart(6, '0'));
        const eGlowMat = new THREE.SpriteMaterial({ map: eGlowTex, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.4 });
        const eGlow = new THREE.Sprite(eGlowMat);
        eGlow.scale.set(eSize * 3, eSize * 3, 1);
        (eGlow as any).userData = (eMesh as any).userData;
        shellGroups[s].add(eGlow);
      }
    }
  }, [protons, neutrons, electrons, elementColor]);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignSelf: 'center' as const, borderRadius: 20, overflow: 'hidden' as const, backgroundColor: 'transparent' },
});
