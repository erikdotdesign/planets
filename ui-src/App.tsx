import { useState, useRef, useEffect } from "react";
import { capitalize } from "./helpers";
import { PLANETS } from "./planets";
import { LightMode, PlanetViewer } from './three-planet';
import { generatePlanetThumbnails } from "./thumbnails";
import Button from "./Button";
import Control from "./Control";
import FieldSet from "./FieldSet";
import "./App.css";

const App = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [recording, setRecording] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [playing, setPlaying] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<BlobPart[]>([]);
  const stillImageDataUrl = useRef<string>("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [planet, setPlanet] = useState<keyof typeof PLANETS>('Earth');
  const [rotationSpeed, setRotationSpeed] = useState(0.2);
  const [showEnvironment, setShowEnvironment] = useState(true);
  const [includeTilt, setIncludeTilt] = useState(true);
  const [lighting, setLighting] = useState<LightMode>("sun");
  const viewerRef = useRef<PlanetViewer | null>(null);

  const [thumbnails, setThumbnails] = useState<{name: string; image: string}[] | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const viewer = new PlanetViewer(canvasRef.current, {
      lightMode: lighting
    });
    viewerRef.current = viewer;
    viewer.startLoop();
    generatePlanetThumbnails().then(t => {
      setThumbnails(t);
    });
    return () => viewer.stopLoop();
  }, []);

  useEffect(() => {
    const v = viewerRef.current; if (!v) return;
    const { type, textures, rotationDirection, tilt, radius } = PLANETS[planet];
    v.setPlanet({ type, textures, rotationDirection, tilt, radius });
  }, [planet]);

  useEffect(() => {
    if (!viewerRef.current) return;
    if (playing) {
      viewerRef.current.setRotationSpeed(rotationSpeed);
    } else {
      viewerRef.current.setRotationSpeed(0); // pause planet spin, but keep controls alive
    }
  }, [playing, rotationSpeed]);

  useEffect(() => {
    if (!viewerRef.current) return;
    viewerRef.current.toggleEnvironment(showEnvironment);
  }, [showEnvironment]);

  useEffect(() => {
    if (!viewerRef.current) return;
    viewerRef.current.setLighting(lighting);
  }, [lighting]);

  useEffect(() => {
    if (!viewerRef.current) return;
    viewerRef.current.toggleTilt(includeTilt);
  }, [includeTilt]);

  const startPlanetRecording = () => {
    if (!canvasRef.current) return;

    setRecording(true);
    
    // RESET: clear old video chunks and still image
    recordedChunksRef.current = [];
    stillImageDataUrl.current = "";

    const canvas = canvasRef.current;
    stillImageDataUrl.current = canvas.toDataURL("image/png"); // still frame

    const stream = canvas.captureStream(60); // 60 FPS
    recorderRef.current = new MediaRecorder(stream, { mimeType: "video/webm" });

    recorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) recordedChunksRef.current.push(e.data);
    };

    recorderRef.current.start();

    timerRef.current = setInterval(() => {
      setRecordingTime((t: number) => {
        if (t + 1 >= 60) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          stopPlanetRecording(); // auto-stop at 60s
          return 60;
        }
        return t + 1;
      });
    }, 1000);
  };

  const stopPlanetRecording = async () => {
    if (!recorderRef.current) return;

    return new Promise<void>((resolve) => {
      recorderRef.current!.onstop = () => {
        const videoBlob = new Blob(recordedChunksRef.current, { type: "video/webm" });

        // console.log("Video size in MB:", videoBlob.size / (1024 * 1024));

        // // Dev preview
        // const url = URL.createObjectURL(videoBlob);
        // setVideoUrl(url);

        const reader = new FileReader();
        reader.onload = () => {
          const videoDataUrl = reader.result as string;

          parent.postMessage(
            {
              pluginMessage: {
                type: "add-planet-video",
                video: videoDataUrl,
                image: stillImageDataUrl.current,
                planet: planet
              },
            },
            "*"
          );

          setRecording(false);
          setRecordingTime(0);
          clearInterval(timerRef.current!); // stop timer
          timerRef.current = null;
          resolve();
        };
        reader.readAsDataURL(videoBlob);

        recorderRef.current = null; // cleanup
      };

      (recorderRef.current as MediaRecorder).stop();
    });
  };

  const addPlanetImage = async () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const stillImageDataUrl = canvas.toDataURL("image/png");
    
    parent.postMessage(
      {
        pluginMessage: {
          type: "add-planet-image",
          image: stillImageDataUrl,
          planet: planet
        },
      },
      "*"
    );
  };

  const handleAddPlanet = async () => {
    if (playing) {
      if (recording) {
        await stopPlanetRecording();
      } else {
        startPlanetRecording();
      }
    } else {
      addPlanetImage();
    }
  };

  return (
    <main className="c-app">
      <section className="c-app__body">
        <div className="c-app__controls">
          <div className="c-button-group c-button-group--column">
            {
              Object.keys(PLANETS).map((k) => (
                <Button
                  modifier={[...(planet === k ? ["radio-active"] : []), "planet", "rule", "radio"]}
                  key={k}
                  onClick={() => setPlanet(k)}>
                  <div
                    className={`c-button__planet c-button__planet--${k.toLowerCase()} ${!thumbnails ? "c-button__planet--loading" : ""}`}
                    style={{
                      backgroundImage: thumbnails ? `url(${thumbnails.find((t) => t.name === k).image})` : undefined
                    }}/>
                  <span>{ k }</span>
                </Button>
              ))
            }
          </div>
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
              <span>{recordingTime}s</span>
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
            <FieldSet label="Lighting">
              {
                ["sun", "neutral"].map((l) => (
                  <Control
                    label={capitalize(l)}
                    type="radio"
                    value={l}
                    name="light-mode"
                    checked={l === lighting}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setLighting(e.target.value as LightMode)
                    } />
                ))
              }
            </FieldSet>
            <FieldSet label="Rotation">
              <Control
                label="Speed"
                type="range"
                min={0.1}
                max={1}
                step={0.1}
                value={rotationSpeed}
                right={<span>{rotationSpeed}</span>}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRotationSpeed(e.target.valueAsNumber)} />
              <Control
                label="Tilt"
                name="environment"
                type="checkbox"
                checked={includeTilt}
                value="hide"
                onChange={() => setIncludeTilt(!includeTilt)} />
            </FieldSet>
            <FieldSet label="Background">
              <Control
                label="Show"
                name="environment"
                type="radio"
                checked={showEnvironment}
                value="show"
                onChange={() => setShowEnvironment(true)} />
              <Control
                label="Hide"
                name="environment"
                type="radio"
                checked={!showEnvironment}
                value="hide"
                onChange={() => setShowEnvironment(false)} />
            </FieldSet>
          </div>
          <div className="c-app__control-group c-app__control-group--row c-app__control-group--fixed">
            <Button
              modifier={["icon", "circle"]}
              onClick={() => setPlaying(!playing)}>
              {
                playing
                ? <svg height="24px" viewBox="0 -960 960 960" width="24px"><path d="M546-252v-456h162v456H546Zm-294 0v-456h162v456H252Zm322-28h106v-400H574v400Zm-294 0h106v-400H280v400Zm0-400v400-400Zm294 0v400-400Z"/></svg>
                : <svg width="24" height="24" viewBox="0 0 24 24"><path d="M18 12L7 19V5L18 12ZM7.66016 17.7969L16.7705 12L7.66016 6.20215V17.7969Z"/></svg>
              }
            </Button>
            <Button
              modifier={["primary", "icon", "circle", ...[recording ? "red" : []] as string[]]}
              onClick={handleAddPlanet}>
              {
                recording
                ? <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M333-333h294v-294H333v294Zm147.17 233q-78.81 0-148.21-29.91T211.23-211.1q-51.34-51.28-81.28-120.59Q100-401.01 100-479.83q0-79.07 29.97-148.69t81.35-121.13q51.38-51.5 120.59-80.92Q401.13-860 479.83-860q79.06 0 148.67 29.39 69.62 29.39 121.13 80.85 51.52 51.46 80.94 121.02Q860-559.18 860-480.09t-29.39 148.15q-29.39 69.06-80.84 120.49-51.44 51.44-120.98 81.45-69.55 30-148.62 30Zm-.17-54q136.51 0 231.26-94.74Q806-343.49 806-480t-94.74-231.26Q616.51-806 480-806t-231.26 94.74Q154-616.51 154-480t94.74 231.26Q343.49-154 480-154Zm0-326Z"/></svg>
                : !playing
                  ? <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M480-294q61.5 0 103.75-42.25T626-440q0-61.5-42.25-103.75T480-586q-61.5 0-103.75 42.25T334-440q0 61.5 42.25 103.75T480-294Zm-.28-54Q440-348 414-374.08q-26-26.07-26-65.5 0-39.42 26.08-65.92 26.07-26.5 65.5-26.5 39.42 0 65.92 26.28t26.5 66Q572-400 545.72-374t-66 26ZM186-140q-36.73 0-61.36-24.64Q100-189.27 100-226v-428q0-36.72 24.64-61.36Q149.27-740 186-740h111l82-80h202l82 80h111q36.72 0 61.36 24.64T860-654v428q0 36.73-24.64 61.36Q810.72-140 774-140H186Zm0-54h588q14 0 23-9t9-23v-428q0-14-9-23t-23-9H642l-82-80H399l-80 80H186q-14 0-23 9t-9 23v428q0 14 9 23t23 9Zm294-246Z"/></svg>
                  : <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M199-182q-36.73 0-61.36-24.64Q113-231.27 113-268v-424q0-36.72 24.64-61.36Q162.27-778 199-778h424q36.72 0 61.36 24.64T709-692v174l138-138v352L709-442v174q0 36.73-24.64 61.36Q659.72-182 623-182H199Zm0-54h424q14 0 23-9t9-23v-424q0-14-9-23t-23-9H199q-14 0-23 9t-9 23v424q0 14 9 23t23 9Zm-32 0v-488 488Z"/></svg>
              }
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;