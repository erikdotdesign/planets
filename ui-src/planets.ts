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

export interface PlanetData {
  type: PlanetryObject;
  textures: TextureMap;
  radius: number;
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
    radius: 1,
    textures: makeTextures(sun),
  },
  Mercury: {
    type: "planet",
    radius: 1,
    textures: makeTextures(mercury, { bump: mercuryBump }),
  },
  Venus: {
    type: "planet",
    radius: 1,
    textures: makeTextures(venus, { bump: venusBump }),
  },
  Earth: {
    type: "planet",
    radius: 1,
    textures: makeTextures(earth, {
      bump: earthBump,
      specular: earthSpec,
      atmosphere: earthClouds,
      atmosphereAlpha: earthCloudsAlpha,
    }),
  },
  Moon: {
    type: "moon",
    radius: 1,
    textures: makeTextures(moon, { bump: moonBump }),
  },
  Mars: {
    type: "planet",
    radius: 1,
    textures: makeTextures(mars, { bump: marsBump }),
  },
  Jupiter: {
    type: "planet",
    radius: 1,
    textures: makeTextures(jupiter),
  },
  Saturn: {
    type: "planet",
    radius: 1,
    textures: makeTextures(saturn, { ring: saturnRing }),
  },
  Uranus: {
    type: "planet",
    radius: 1,
    textures: makeTextures(uranus),
  },
  Neptune: {
    type: "planet",
    radius: 1,
    textures: makeTextures(neptune),
  },
  Ganymede: {
    type: "moon",
    radius: 1,
    textures: makeTextures(ganymede),
  },
  Titan: {
    type: "moon",
    radius: 1,
    textures: makeTextures(titan),
  },
  Callisto: {
    type: "moon",
    radius: 1,
    textures: makeTextures(callisto),
  },
  Io: {
    type: "moon",
    radius: 1,
    textures: makeTextures(io),
  },
  Europa: {
    type: "moon",
    radius: 1,
    textures: makeTextures(europa),
  },
  Triton: {
    type: "moon",
    radius: 1,
    textures: makeTextures(triton),
  },
};