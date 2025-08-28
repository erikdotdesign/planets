import { useEffect, useRef } from "react";
import { PLANETS } from "./planets";
import { PlanetViewer } from "./planetViewer";
import { PlanetAction, PlanetState } from "./planetStateReducer";

const usePlanetViewer = (
  canvasRef: React.RefObject<HTMLCanvasElement>, 
  planetState: PlanetState,
  planetStateDispatch: (action: PlanetAction) => void
) => {
  const viewerRef = useRef<PlanetViewer | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const viewer = new PlanetViewer(canvasRef.current, { 
      lightMode: planetState.lightMode, 
      onZoomChange: (zoom: number) => planetStateDispatch({ type: "SET_ZOOM", zoom })
    });
    viewerRef.current = viewer;
    viewer.startLoop();
    return () => viewer.stopLoop();
  }, []);

  useEffect(() => {
    const v = viewerRef.current; if (!v) return;
    const { type, textures, rotationDirection, tilt, radius } = PLANETS[planetState.planet];
    v.setPlanet({ type, textures, rotationDirection, tilt, radius });
  }, [planetState.planet]);

  useEffect(() => {
    if (!viewerRef.current) return;
    viewerRef.current.setRotationSpeed(planetState.playing ? planetState.rotationSpeed : 0);
  }, [planetState.playing, planetState.rotationSpeed]);

  useEffect(() => { viewerRef.current?.toggleEnvironment(planetState.showEnvironment); }, [planetState.showEnvironment]);
  useEffect(() => { viewerRef.current?.setLightMode(planetState.lightMode); }, [planetState.lightMode]);
  useEffect(() => { viewerRef.current?.toggleTilt(planetState.includeTilt); }, [planetState.includeTilt]);

  return viewerRef;
};

export default usePlanetViewer;