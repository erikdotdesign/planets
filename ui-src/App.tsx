import { useRef, useReducer } from "react";
import { PLANETS } from "./planets";
import planetReducer from "./planetStateReducer";
import usePlanetViewer from "./usePlanetViewer";
import useRecorder from "./useRecorder";
import usePluginStorage from "./usePluginStorage";
import PlanetButtons from "./PlanetButtons";
import PlanetCanvas from "./PlanetCanvas";
import PlanetControls from "./PlanetControls";
import "./App.css";

const App = () => {
  const [planetState, planetStateDispatch] = useReducer(planetReducer, {
    planet: "Earth",
    playing: true,
    rotationSpeed: 0.2,
    showEnvironment: true,
    includeTilt: true,
    lightMode: "sun",
    zoom: 5
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buttonRefs = useRef<Record<keyof typeof PLANETS, HTMLButtonElement | null>>({} as any);
  const viewerRef = usePlanetViewer(canvasRef, planetState, planetStateDispatch);
  const recorderRef = useRecorder(canvasRef, planetState.planet);

  usePluginStorage(
    planetState, 
    planetStateDispatch, 
    viewerRef, 
    buttonRefs
  );

  return (
    <main className="c-app">
      <section className="c-app__body">
        <PlanetButtons
          buttonRefs={buttonRefs}
          planet={planetState.planet}
          setPlanet={(planet: keyof typeof PLANETS) => {
            planetStateDispatch({
              type: "SET_PLANET",
              planet: planet
            })
          }} />
        <PlanetCanvas
          canvasRef={canvasRef}
          recorderRef={recorderRef} />
        <PlanetControls
          planetState={planetState}
          planetStateDispatch={planetStateDispatch}
          recorderRef={recorderRef} />
      </section>
    </main>
  );
};

export default App;