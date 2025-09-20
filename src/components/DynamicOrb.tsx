import React from 'react';
import BasicBlueOrb from '../../components/BasicBlueOrb';
import AnimatedAuraOrb from '../../components/AnimatedAuraOrb';
import SpiralGalaxyOrb from '../../components/SpiralGalaxyOrb';
import HeartbeatOrb from '../../components/HeartbeatOrb';
import LightningOrb from '../../components/LightningOrb';
import FireOrb from '../../components/FireOrb';
import WaveOrb from '../../components/WaveOrb';
import NatureOrb from '../../components/NatureOrb';

interface DynamicOrbProps {
  orbType: 'basic' | 'aura' | 'galaxy' | 'heartbeat' | 'lightning' | 'fire' | 'wave' | 'nature';
  size?: number;
}

export default function DynamicOrb({ orbType, size = 120 }: DynamicOrbProps) {
  switch (orbType) {
    case 'basic':
      return <BasicBlueOrb size={size} />;
    case 'aura':
      return <AnimatedAuraOrb size={size} />;
    case 'galaxy':
      return <SpiralGalaxyOrb size={size} />;
    case 'heartbeat':
      return <HeartbeatOrb size={size} />;
    case 'lightning':
      return <LightningOrb size={size} />;
    case 'fire':
      return <FireOrb size={size} />;
    case 'wave':
      return <WaveOrb size={size} />;
    case 'nature':
      return <NatureOrb size={size} />;
    default:
      return <BasicBlueOrb size={size} />;
  }
}