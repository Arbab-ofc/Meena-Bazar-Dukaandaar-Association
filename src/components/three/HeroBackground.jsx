import { Component } from 'react';
import SceneWrapper from '@/components/three/SceneWrapper';
import FloatingOrb from '@/components/three/FloatingOrb';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useReducedMotionPreference } from '@/hooks/useReducedMotion';
import { useTheme } from '@/hooks/useTheme';

class CanvasErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

const HeroBackground = () => {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const reduceMotion = useReducedMotionPreference();
  const { resolvedTheme } = useTheme();

  if (isMobile) return null;

  return (
    <CanvasErrorBoundary>
      <SceneWrapper className="pointer-events-none absolute inset-0 z-0">
        <ambientLight intensity={resolvedTheme === 'dark' ? 0.72 : 0.5} />
        <pointLight position={[5, 5, 5]} intensity={resolvedTheme === 'dark' ? 1.45 : 1} />
        <FloatingOrb rotate={!reduceMotion} />
      </SceneWrapper>
    </CanvasErrorBoundary>
  );
};

export default HeroBackground;
