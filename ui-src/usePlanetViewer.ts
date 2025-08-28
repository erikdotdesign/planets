import { useEffect, useRef } from "react";
import { PLANETS } from "./planets";
import { PlanetViewer, LightMode } from "./three-planet";

const usePlanetViewer = (
  canvasRef: React.RefObject<HTMLCanvasElement>, 
  { 
    planet, 
    lighting, 
    rotationSpeed, 
    playing, 
    showEnvironment, 
    includeTilt, 
    zoom, 
    onZoomChange 
  }: {
    planet: string;
    lighting: LightMode;
    rotationSpeed: number;
    playing: boolean;
    showEnvironment: boolean;
    includeTilt: boolean;
    zoom: number;
    onZoomChange: (zoom: number) => void;
  }
) => {
  const viewerRef = useRef<PlanetViewer | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const viewer = new PlanetViewer(canvasRef.current, { lightMode: lighting, onZoomChange });
    viewerRef.current = viewer;
    viewer.startLoop();
    return () => viewer.stopLoop();
  }, []);

  useEffect(() => {
    const v = viewerRef.current; if (!v) return;
    const { type, textures, rotationDirection, tilt, radius } = PLANETS[planet];
    v.setPlanet({ type, textures, rotationDirection, tilt, radius });
  }, [planet]);

  useEffect(() => {
    if (!viewerRef.current) return;
    viewerRef.current.setRotationSpeed(playing ? rotationSpeed : 0);
  }, [playing, rotationSpeed]);

  useEffect(() => { viewerRef.current?.toggleEnvironment(showEnvironment); }, [showEnvironment]);
  useEffect(() => { viewerRef.current?.setLighting(lighting); }, [lighting]);
  useEffect(() => { viewerRef.current?.toggleTilt(includeTilt); }, [includeTilt]);

  return viewerRef;
};

export default usePlanetViewer;