import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';

/** @param {{children: import('react').ReactNode, className?: string, style?: import('react').CSSProperties}} props */
const SceneWrapper = ({ children, className, style }) => (
  <div className={className} style={style}>
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }} gl={{ antialias: true, alpha: true }} dpr={[1, 1.5]}>
      <Suspense fallback={null}>{children}</Suspense>
    </Canvas>
  </div>
);

export default SceneWrapper;
