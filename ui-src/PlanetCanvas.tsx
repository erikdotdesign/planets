const PlanetCanvas = ({
  canvasRef,
  recording,
  recordingTime,
  videoUrl
}: {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  recording: boolean;
  recordingTime: number;
  videoUrl?: any;
}) => {
  return (
    <div 
      className="c-app__canvas"
      id="three">
      {
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
      }
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
    </div>
  );
}

export default PlanetCanvas;