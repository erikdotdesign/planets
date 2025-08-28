import { useState, useRef, useEffect } from "react";
import { PLANETS } from "./planets";
import { LightMode } from './three-planet';
import usePlanetViewer from "./usePlanetViewer";
import useRecorder from "./useRecorder";
import PlanetButtons from "./PlanetButtons";
import LightingControls from "./LightingControls";
import RotationControls from "./RotationControls";
import BackgroundControls from "./BackgroundControls";
import PlayerControls from "./PlayerControls";
import "./App.css";

const App = () => {
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const [planet, setPlanet] = useState<keyof typeof PLANETS>('Earth');
  const [playing, setPlaying] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState<number>(0.2);
  const [showEnvironment, setShowEnvironment] = useState<boolean>(true);
  const [includeTilt, setIncludeTilt] = useState<boolean>(true);
  const [lighting, setLighting] = useState<LightMode>("sun");
  const [zoom, setZoom] = useState<number>(5);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewerRef = usePlanetViewer(canvasRef, {
    planet, lighting, rotationSpeed, playing, showEnvironment, includeTilt, zoom,
    onZoomChange: setZoom,
  });

  // Video url for dev debug
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const { recording, time, start, stop, snapshot } = useRecorder(canvasRef, planet, setVideoUrl);

  useEffect(() => {
    parent.postMessage({ pluginMessage: { type: "load-storage", key: "cache" } }, "*");
    window.onmessage = (event) => {
      const msg = event.data.pluginMessage;
      if (msg.type === "storage-loaded") {
        if (msg.key === "cache" && msg.value) {
          setPlanet(msg.value.planet),
          setPlaying(msg.value.playing),
          setRotationSpeed(msg.value.rotationSpeed),
          setShowEnvironment(msg.value.showEnvironment),
          setLighting(msg.value.lighting),
          setIncludeTilt(msg.value.includeTilt),
          setZoom(msg.value.zoom)

          if (msg.value.planet) {
            setTimeout(() => {
              buttonRefs.current[msg.value.planet]?.scrollIntoView({ 
                behavior: "smooth", 
                block: "center" 
              });
            }, 0);
          }
          if (viewerRef.current) {
            viewerRef.current.setZoomLevel(msg.value.zoom);
          }
        }
      }
    };
  }, []);

  useEffect(() => {
    parent.postMessage({
      pluginMessage: { type: "save-storage", key: "cache", value: {
        planet,
        playing,
        rotationSpeed,
        showEnvironment,
        lighting,
        includeTilt,
        zoom
      }},
    }, "*");
  }, [planet, playing, rotationSpeed, showEnvironment, lighting, includeTilt, zoom]);

  const handleAddPlanet = () => {
    if (playing) recording ? stop() : start();
    else snapshot();
  };

  return (
    <main className="c-app">
      <section className="c-app__body">
        <div className="c-app__controls">
          <PlanetButtons
            buttonRefs={buttonRefs}
            planet={planet}
            setPlanet={setPlanet} />
        </div>
        <div 
          className="c-app__canvas"
          id="three">
          <div 
            className="c-app__canvas-overlay c-app__canvas-overlay--recording"
            style={{
              display: recording ? "flex" : "none"
            }}>
            <div>
              <span>{time}s</span>
            </div>
          </div>
          <canvas ref={canvasRef} />
          {/* {
            videoUrl
            ? <div className="c-app__canvas-overlay">
                <video 
                className="c-app__video-preview"
                style={{
                  width: "100%",
                  height: "100%"
                }}
                src={videoUrl} 
                controls 
                autoPlay 
                loop />
              </div>
            : null
          } */}
        </div>
        <div className="c-app__controls c-app__controls--right">
          <div className="c-app__control-group">
            <LightingControls
              lighting={lighting}
              setLighting={setLighting} />
            <RotationControls
              rotationSpeed={rotationSpeed}
              setRotationSpeed={setRotationSpeed}
              includeTilt={includeTilt}
              setIncludeTilt={setIncludeTilt} />
            <BackgroundControls
              showEnvironment={showEnvironment}
              setShowEnvironment={setShowEnvironment} />
          </div>
          <div className="c-app__control-group c-app__control-group--row c-app__control-group--fixed">
            <PlayerControls
              playing={playing}
              setPlaying={setPlaying}
              recording={recording}
              handleAddPlanet={handleAddPlanet} />
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;