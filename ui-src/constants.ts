import sunTexture from "./textures/sun.jpg";
import mercuryTexture from "./textures/mercury.jpg";
import mercuryBumpTexture from "./textures/mercury-bump.jpg";
import venusTexture from "./textures/venus.jpg";
import venusBumpTexture from "./textures/venus-bump.jpg";
import earthTexture from "./textures/earth.jpg";
import earthBumpTexture from "./textures/earth-bump.jpg";
import earthSpecularTexture from "./textures/earth-specular.jpg";
import earthAtmosphereTexture from "./textures/earth-clouds.jpg";
import earthAtmosphereAlphaTexture from "./textures/earth-clouds-alpha.jpg";
import moonTexture from "./textures/moon.jpg";
import moonBumpTexture from "./textures/moon-bump.jpg";
import marsTexture from "./textures/mars.jpg";
import marsBumpTexture from "./textures/mars-bump.jpg";
import jupiterTexture from "./textures/jupiter.jpg";
import saturnTexture from "./textures/saturn.jpg";
import saturnRingTexture from "./textures/saturn-ring.png";
import uranusTexture from "./textures/uranus.jpg";
import neptuneTexture from "./textures/neptune.jpg";

export type PlanetryObject = "star" | "planet" | "moon";

export type TextureMap = {
  map: string;
  bump?: string;
  specular?: string;
  atmosphere?: string;
  atmosphereAlpha?: string;
  ring?: string;
};

const SUN_TEXTURES: TextureMap = {
  map: sunTexture
};

const MERCURY_TEXTURES: TextureMap = {
  map: mercuryTexture,
  bump: mercuryBumpTexture
};

const VENUS_TEXTURES: TextureMap = {
  map: venusTexture,
  bump: venusBumpTexture
};

const EARTH_TEXTURES: TextureMap = {
  map: earthTexture,
  bump: earthBumpTexture,
  specular: earthSpecularTexture,
  atmosphere: earthAtmosphereTexture,
  atmosphereAlpha: earthAtmosphereAlphaTexture
};

const MOON_TEXTURES: TextureMap = {
  map: moonTexture,
  bump: moonBumpTexture
};

const MARS_TEXTURES: TextureMap = {
  map: marsTexture,
  bump: marsBumpTexture
};

const JUPITER_TEXTURES: TextureMap = {
  map: jupiterTexture
};

const SATURN_TEXTURES: TextureMap = {
  map: saturnTexture,
  ring: saturnRingTexture
};

const URANUS_TEXTURES: TextureMap = {
  map: uranusTexture
};

const NEPTUNE_TEXTURES: TextureMap = {
  map: neptuneTexture
};

// Update these file names to match your textures under ui-src/assets/planets/
export const PLANETS: Record<string, { type: PlanetryObject; textures: TextureMap; radius: number; bg?: string }> = {
  Sun:     { type: "star",   textures: SUN_TEXTURES,     radius: 1, bg: '#0b0e13' },
  Mercury: { type: "planet", textures: MERCURY_TEXTURES, radius: 1, bg: '#0b0e13' },
  Venus:   { type: "planet", textures: VENUS_TEXTURES,   radius: 1, bg: '#0b0e13' },
  Earth:   { type: "planet", textures: EARTH_TEXTURES,   radius: 1, bg: '#02050a' },
  Moon:    { type: "moon",   textures: MOON_TEXTURES,    radius: 1, bg: '#0b0e13' },
  Mars:    { type: "planet", textures: MARS_TEXTURES,    radius: 1, bg: '#120b0b' },
  Jupiter: { type: "planet", textures: JUPITER_TEXTURES, radius: 1, bg: '#0b0e13' },
  Saturn:  { type: "planet", textures: SATURN_TEXTURES,  radius: 1, bg: '#0b0e13' },
  Uranus:  { type: "planet", textures: URANUS_TEXTURES,  radius: 1, bg: '#0b0e13' },
  Neptune: { type: "planet", textures: NEPTUNE_TEXTURES, radius: 1, bg: '#0b0e13' }
};