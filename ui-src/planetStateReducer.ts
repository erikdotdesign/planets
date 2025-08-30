import { PLANETS } from "./planets";
import { LightMode } from "./planetViewer";

export type PlanetState = {
  planet: keyof typeof PLANETS;
  playing: boolean;
  rotationSpeed: number;
  showEnvironment: boolean;
  showAtmosphere: boolean;
  showElevation: boolean;
  includeTilt: boolean;
  lightMode: LightMode;
  zoom: number;
};

export type PlanetAction = 
  | { type: "HYDRATE_STATE"; state: PlanetState } 
  | { type: "SET_PLANET"; planet: keyof typeof PLANETS } 
  | { type: "SET_PLAYING", playing: boolean } 
  | { type: "SET_ROTATION_SPEED"; rotationSpeed: number } 
  | { type: "SET_SHOW_ENVIRONMENT"; showEnvironment: boolean }
  | { type: "SET_SHOW_ATMOSPHERE"; showAtmosphere: boolean }
  | { type: "SET_SHOW_ELEVATION"; showElevation: boolean }
  | { type: "SET_INCLUDE_TILT"; includeTilt: boolean }
  | { type: "SET_LIGHT_MODE"; lightMode: LightMode }
  | { type: "SET_ZOOM"; zoom: number }

const planetReducer = (state: PlanetState, action: PlanetAction): PlanetState => {
  switch (action.type) {
    case "HYDRATE_STATE": return { ...state, ...action.state };
    case "SET_PLANET": return { ...state, planet: action.planet };
    case "SET_PLAYING": return { ...state, playing: action.playing };
    case "SET_ROTATION_SPEED": return { ...state, rotationSpeed: action.rotationSpeed };
    case "SET_SHOW_ENVIRONMENT": return { ...state, showEnvironment: action.showEnvironment };
    case "SET_SHOW_ATMOSPHERE": return { ...state, showAtmosphere: action.showAtmosphere };
    case "SET_SHOW_ELEVATION": return { ...state, showElevation: action.showElevation };
    case "SET_INCLUDE_TILT": return { ...state, includeTilt: action.includeTilt };
    case "SET_LIGHT_MODE": return { ...state, lightMode: action.lightMode };
    case "SET_ZOOM": return { ...state, zoom: action.zoom };
    default: return state;
  }
};

export default planetReducer;