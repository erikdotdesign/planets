import { Recorder } from "./useRecorder";

const PlanetCanvas = ({
  canvasRef,
  recorderRef
}: {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  recorderRef: Recorder;
}) => {
  return (
    <div 
      className="c-app__canvas"
      id="three">
      {
        recorderRef.videoUrl
        ? <div className="c-app__canvas-overlay">
            <video 
            className="c-app__video-preview"
            style={{
              width: "100%",
              height: "100%"
            }}
            src={recorderRef.videoUrl} 
            controls 
            autoPlay 
            loop />
          </div>
        : null
      }
      <div 
        className="c-app__canvas-overlay c-app__canvas-overlay--recording"
        style={{
          display: recorderRef.recording ? "flex" : "none"
        }}>
        <div>
          <span>{recorderRef.time}s</span>
        </div>
      </div>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default PlanetCanvas;