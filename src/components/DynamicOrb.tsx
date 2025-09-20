import React, { lazy, Suspense } from 'react';
import { ActivityIndicator, View } from 'react-native';

// Lazy load orb components for better performance
const BasicBlueOrb = lazy(() => import('../../components/BasicBlueOrb'));
const AnimatedAuraOrb = lazy(() => import('../../components/AnimatedAuraOrb'));
const SpiralGalaxyOrb = lazy(() => import('../../components/SpiralGalaxyOrb'));
const HeartbeatOrb = lazy(() => import('../../components/HeartbeatOrb'));
const LightningOrb = lazy(() => import('../../components/LightningOrb'));
const FireOrb = lazy(() => import('../../components/FireOrb'));
const WaveOrb = lazy(() => import('../../components/WaveOrb'));
const NatureOrb = lazy(() => import('../../components/NatureOrb'));

// Loading component for lazy-loaded orbs
const OrbLoader = ({ size }: { size: number }) => (
  <View style={{
    width: size,
    height: size,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: size / 2,
    backgroundColor: 'rgba(37, 99, 235, 0.1)'
  }}>
    <ActivityIndicator size="small" color="#2563eb" />
  </View>
);

interface DynamicOrbProps {
  orbType: 'basic' | 'aura' | 'galaxy' | 'heartbeat' | 'lightning' | 'fire' | 'wave' | 'nature';
  size?: number;
}

export default function DynamicOrb({ orbType, size = 120 }: DynamicOrbProps) {
  const renderOrb = () => {
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
  };

  return (
    <Suspense fallback={<OrbLoader size={size} />}>
      {renderOrb()}
    </Suspense>
  );
}