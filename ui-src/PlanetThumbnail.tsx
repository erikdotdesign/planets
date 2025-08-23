import { useEffect, useRef } from 'react';
import { PlanetViewer } from './three-planet';
import { PlanetryObject, TextureMap } from './constants';

interface PlanetThumbnailProps {
  type: PlanetryObject;
  textures: TextureMap;
  radius?: number;
}

const PlanetThumbnail = ({ type, textures, radius = 1 }: PlanetThumbnailProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const viewer = new PlanetViewer(containerRef.current, false, false);

    // Small, subtle rotation
    viewer.setPlanet({ type, textures, radius });
    viewer.setRotationSpeed(0.05); // optional slow spin
    viewer.startLoop();

    return () => viewer.stopLoop();
  }, [textures, radius]);

  return (
    <div
      ref={containerRef}
      style={{ width: 32, height: 32, cursor: 'pointer' }}
    />
  );
};

export default PlanetThumbnail;