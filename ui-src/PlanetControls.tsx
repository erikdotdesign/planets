import { LightMode } from './planetViewer';
import { PlanetState, PlanetAction } from "./planetStateReducer";
import { Recorder } from './useRecorder';
import LightingControls from "./LightingControls";
import RotationControls from "./RotationControls";
import LayerControls from "./LayerControls";
import PlayerControls from './PlayerControls';

const PlanetControls = ({
  planetState,
  planetStateDispatch,
  recorderRef
}: {
  planetState: PlanetState;
  planetStateDispatch: (action: PlanetAction) => void;
  recorderRef: Recorder;
}) => {
  return (
    <div className="c-app__controls c-app__controls--right">
      <div className="c-app__control-group">
        <LightingControls
          lightMode={planetState.lightMode}
          setLightMode={(lightMode: LightMode) => {
            planetStateDispatch({
              type: "SET_LIGHT_MODE",
              lightMode
            })
          }} />
        <RotationControls
          rotationSpeed={planetState.rotationSpeed}
          setRotationSpeed={(rotationSpeed: number) => {
            planetStateDispatch({
              type: "SET_ROTATION_SPEED",
              rotationSpeed
            })
          }}
          includeTilt={planetState.includeTilt}
          setIncludeTilt={(includeTilt: boolean) => {
            planetStateDispatch({
              type: "SET_INCLUDE_TILT",
              includeTilt
            })
          }} />
        <LayerControls
          planet={planetState.planet}
          showEnvironment={planetState.showEnvironment}
          setShowEnvironment={(showEnvironment: boolean) => {
            planetStateDispatch({
              type: "SET_SHOW_ENVIRONMENT",
              showEnvironment
            })
          }}
          showAtmosphere={planetState.showAtmosphere}
          setShowAtmosphere={(showAtmosphere: boolean) => {
            planetStateDispatch({
              type: "SET_SHOW_ATMOSPHERE",
              showAtmosphere
            })
          }}
          showElevation={planetState.showElevation}
          setShowElevation={(showElevation: boolean) => {
            planetStateDispatch({
              type: "SET_SHOW_ELEVATION",
              showElevation
            })
          }} />
      </div>
      <div className="c-app__control-group c-app__control-group--row c-app__control-group--fixed">
        <PlayerControls
          playing={planetState.playing}
          setPlaying={(playing: boolean) => {
            planetStateDispatch({
              type: "SET_PLAYING",
              playing
            })
          }}
          recorderRef={recorderRef} />
      </div>
    </div>
  );
};

export default PlanetControls;