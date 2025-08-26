// === Imports ===
import sun from "./textures/sun.jpg";

import mercury from "./textures/mercury.jpg";
import mercuryBump from "./textures/mercury-bump.jpg";

import venus from "./textures/venus.jpg";
import venusBump from "./textures/venus-bump.jpg";

import earth from "./textures/earth.jpg";
import earthBump from "./textures/earth-bump.jpg";
import earthSpec from "./textures/earth-specular.jpg";
import earthClouds from "./textures/earth-clouds.jpg";
import earthCloudsAlpha from "./textures/earth-clouds-alpha.jpg";

import moon from "./textures/moon.jpg";
import moonBump from "./textures/moon-bump.jpg";

import mars from "./textures/mars.jpg";
import marsBump from "./textures/mars-bump.jpg";

import jupiter from "./textures/jupiter.jpg";

import saturn from "./textures/saturn.jpg";
import saturnRing from "./textures/saturn-ring.png";

import uranus from "./textures/uranus.jpg";
import neptune from "./textures/neptune.jpg";

import ganymede from "./textures/ganymede.jpg";
import titan from "./textures/titan.webp";
import callisto from "./textures/callisto.jpg";
import io from "./textures/io.jpg";
import europa from "./textures/europa.jpg";
import triton from "./textures/triton.jpg";

// === Types ===
export type PlanetryObject = "star" | "planet" | "moon";

export type TextureMap = {
  map: string;
  bump?: string;
  specular?: string;
  atmosphere?: string;
  atmosphereAlpha?: string;
  ring?: string;
};

export type RotationDirection = "prograde" | "retrograde" | "synchronous";

export interface PlanetData {
  type: PlanetryObject;
  textures: TextureMap;
  radius: number;
  tilt: number;
  rotationDirection?: RotationDirection;
  bg?: string;
}

// === Helpers ===
const makeTextures = (map: string, extras: Partial<TextureMap> = {}): TextureMap => ({
  map,
  ...extras,
});

// === Data ===
export const PLANETS: Record<string, PlanetData> = {
  Sun: {
    type: "star",
    radius: 432000,
    tilt: 0,
    textures: makeTextures(sun),
    rotationDirection: "prograde", // arbitrary for star
  },
  Mercury: {
    type: "planet",
    radius: 1516,
    tilt: 0.03,
    textures: makeTextures(mercury, { bump: mercuryBump }),
    rotationDirection: "prograde",
  },
  Venus: {
    type: "planet",
    radius: 3760,
    tilt: 2.64,
    textures: makeTextures(venus, { bump: venusBump }),
    rotationDirection: "retrograde",
  },
  Earth: {
    type: "planet",
    radius: 3959,
    tilt: 23.44,
    textures: makeTextures(earth, {
      bump: earthBump,
      specular: earthSpec,
      atmosphere: earthClouds,
      atmosphereAlpha: earthCloudsAlpha,
    }),
    rotationDirection: "prograde",
  },
  Moon: {
    type: "moon",
    radius: 1737,
    tilt: 5.8,
    textures: makeTextures(moon, { bump: moonBump }),
    rotationDirection: "prograde"  // "synchronous",
  },
  Mars: {
    type: "planet",
    radius: 2106,
    tilt: 25.19,
    textures: makeTextures(mars, { bump: marsBump }),
    rotationDirection: "prograde",
  },
  Jupiter: {
    type: "planet",
    radius: 43441,
    tilt: 3.13,
    textures: makeTextures(jupiter),
    rotationDirection: "prograde",
  },
  Saturn: {
    type: "planet",
    radius: 36184,
    tilt: 26.73,
    textures: makeTextures(saturn, { ring: saturnRing }),
    rotationDirection: "prograde",
  },
  Uranus: {
    type: "planet",
    radius: 15759,
    tilt: 82.23,
    textures: makeTextures(uranus),
    rotationDirection: "retrograde",
  },
  Neptune: {
    type: "planet",
    radius: 15299,
    tilt: 28.32,
    textures: makeTextures(neptune),
    rotationDirection: "prograde",
  },
  Ganymede: {
    type: "moon",
    radius: 2634,
    tilt: 3.33,
    textures: makeTextures(ganymede),
    rotationDirection: "prograde"  // "synchronous",
  },
  Titan: {
    type: "moon",
    radius: 2574,
    tilt: 27,
    textures: makeTextures(titan),
    rotationDirection: "prograde" // "synchronous",
  },
  Callisto: {
    type: "moon",
    radius: 2410,
    tilt: 0,
    textures: makeTextures(callisto),
    rotationDirection: "prograde" // "synchronous",
  },
  Io: {
    type: "moon",
    radius: 1821,
    tilt: 0.05,
    textures: makeTextures(io),
    rotationDirection: "prograde" // "synchronous",
  },
  Europa: {
    type: "moon",
    radius: 1560,
    tilt: 0.47,
    textures: makeTextures(europa),
    rotationDirection: "prograde" // "synchronous",
  },
  Triton: {
    type: "moon",
    radius: 1353,
    tilt: 156,
    textures: makeTextures(triton),
    rotationDirection: "retrograde",
  },
};