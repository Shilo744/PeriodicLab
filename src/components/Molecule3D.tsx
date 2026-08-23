import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, Line, Defs, RadialGradient, Stop, Text as SvgText } from 'react-native-svg';
import { Compound } from '../data/compounds';
import { getElement } from '../data/elements';

interface Molecule3DProps {
  compound: Compound;
  size?: number;
}

interface AtomNode {
  z: number;
  sym: string;
  x: number;
  y: number;
  radius: number;
  color: string;
}

interface BondLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
}

export default function Molecule3D({ compound, size = 180 }: Molecule3DProps) {
  const center = size / 2;

  const { nodes, bonds } = useMemo(() => {
    const calculatedNodes: AtomNode[] = [];
    const calculatedBonds: BondLine[] = [];

    if (compound.id === 'water') {
      // H2O: Central Oxygen with 2 Hydrogen atoms at 104.5 degrees
      calculatedNodes.push({ z: 8, sym: 'O', x: center, y: center - 15, radius: 24, color: '#ef4444' });
      calculatedNodes.push({ z: 1, sym: 'H', x: center - 45, y: center + 30, radius: 15, color: '#e2e8f0' });
      calculatedNodes.push({ z: 1, sym: 'H', x: center + 45, y: center + 30, radius: 15, color: '#e2e8f0' });

      calculatedBonds.push({ x1: center, y1: center - 15, x2: center - 45, y2: center + 30, color: 'rgba(255,255,255,0.4)' });
      calculatedBonds.push({ x1: center, y1: center - 15, x2: center + 45, y2: center + 30, color: 'rgba(255,255,255,0.4)' });
    } else if (compound.id === 'carbon_dioxide') {
      // CO2: Linear O=C=O
      calculatedNodes.push({ z: 6, sym: 'C', x: center, y: center, radius: 22, color: '#64748b' });
      calculatedNodes.push({ z: 8, sym: 'O', x: center - 60, y: center, radius: 22, color: '#ef4444' });
      calculatedNodes.push({ z: 8, sym: 'O', x: center + 60, y: center, radius: 22, color: '#ef4444' });

      calculatedBonds.push({ x1: center - 60, y1: center, x2: center, y2: center, color: 'rgba(255,255,255,0.5)' });
      calculatedBonds.push({ x1: center, y1: center, x2: center + 60, y2: center, color: 'rgba(255,255,255,0.5)' });
    } else if (compound.id === 'methane') {
      // CH4: Central Carbon with 4 Hydrogens
      calculatedNodes.push({ z: 6, sym: 'C', x: center, y: center, radius: 24, color: '#64748b' });
      calculatedNodes.push({ z: 1, sym: 'H', x: center, y: center - 50, radius: 14, color: '#e2e8f0' });
      calculatedNodes.push({ z: 1, sym: 'H', x: center - 48, y: center + 25, radius: 14, color: '#e2e8f0' });
      calculatedNodes.push({ z: 1, sym: 'H', x: center + 48, y: center + 25, radius: 14, color: '#e2e8f0' });
      calculatedNodes.push({ z: 1, sym: 'H', x: center, y: center + 45, radius: 12, color: '#cbd5e1' });

      calculatedBonds.push({ x1: center, y1: center, x2: center, y2: center - 50, color: 'rgba(255,255,255,0.4)' });
      calculatedBonds.push({ x1: center, y1: center, x2: center - 48, y2: center + 25, color: 'rgba(255,255,255,0.4)' });
      calculatedBonds.push({ x1: center, y1: center, x2: center + 48, y2: center + 25, color: 'rgba(255,255,255,0.4)' });
      calculatedBonds.push({ x1: center, y1: center, x2: center, y2: center + 45, color: 'rgba(255,255,255,0.2)' });
    } else if (compound.id === 'table_salt') {
      // NaCl: Ionic pair
      calculatedNodes.push({ z: 11, sym: 'Na⁺', x: center - 35, y: center, radius: 22, color: '#a855f7' });
      calculatedNodes.push({ z: 17, sym: 'Cl⁻', x: center + 35, y: center, radius: 28, color: '#34d399' });
      calculatedBonds.push({ x1: center - 35, y1: center, x2: center + 35, y2: center, color: 'rgba(251,191,36,0.5)' });
    } else {
      // Generic circular cluster
      calculatedNodes.push({ z: 1, sym: compound.formula, x: center, y: center, radius: 36, color: '#6366f1' });
    }

    return { nodes: calculatedNodes, bonds: calculatedBonds };
  }, [compound, center]);

  return (
    <View style={[M.box, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          {nodes.map((node, i) => (
            <RadialGradient key={`grad-${i}`} id={`nodeGrad-${i}`} cx="35%" cy="35%" r="65%">
              <Stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
              <Stop offset="50%" stopColor={node.color} stopOpacity="1" />
              <Stop offset="100%" stopColor="#000000" stopOpacity="0.6" />
            </RadialGradient>
          ))}
        </Defs>

        {/* Bond cylinders */}
        {bonds.map((b, idx) => (
          <Line
            key={`bond-${idx}`}
            x1={b.x1}
            y1={b.y1}
            x2={b.x2}
            y2={b.y2}
            stroke={b.color}
            strokeWidth="5"
            strokeLinecap="round"
          />
        ))}

        {/* Atom Spheres */}
        {nodes.map((node, idx) => (
          <React.Fragment key={`atom-${idx}`}>
            <Circle
              cx={node.x}
              cy={node.y}
              r={node.radius}
              fill={`url(#nodeGrad-${idx})`}
            />
            <SvgText
              x={node.x}
              y={node.y + 4}
              fontSize={node.radius > 20 ? 12 : 9}
              fontWeight="bold"
              fill="#ffffff"
              textAnchor="middle"
            >
              {node.sym}
            </SvgText>
          </React.Fragment>
        ))}
      </Svg>
    </View>
  );
}

const M = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
