import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTheme } from '@/hooks/useTheme';

/** @param {{rotate?: boolean}} props */
const FloatingOrb = ({ rotate = true }) => {
  const meshRef = useRef();
  const { viewport } = useThree();
  const { resolvedTheme } = useTheme();

  useFrame(() => {
    if (!meshRef.current || !rotate) return;
    meshRef.current.rotation.x += 0.003;
    meshRef.current.rotation.y += 0.003;
  });

  const scale = useMemo(() => Math.min(viewport.width / 6, 1.2), [viewport.width]);
  const meshColor = resolvedTheme === 'dark' ? '#D4AF37' : '#B8860B';
  const opacity = resolvedTheme === 'dark' ? 0.34 : 0.2;
  const emissiveIntensity = resolvedTheme === 'dark' ? 0.35 : 0.12;

  return (
    <mesh ref={meshRef} scale={scale} position={[0, 0, 0]}>
      <torusKnotGeometry args={[1, 0.3, 80, 16]} />
      <meshStandardMaterial
        color={meshColor}
        emissive={meshColor}
        emissiveIntensity={emissiveIntensity}
        wireframe
        transparent
        opacity={opacity}
      />
    </mesh>
  );
};

export default FloatingOrb;
