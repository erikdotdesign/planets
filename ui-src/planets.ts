// === Imports ===
import sun from "./textures/sun.webp";

import mercury from "./textures/mercury.webp";
import mercuryBump from "./textures/mercury-bump.webp";

import venus from "./textures/venus.webp";
import venusClouds from "./textures/venus-clouds.webp";
import venusBump from "./textures/venus-bump.webp";

import earth from "./textures/earth.webp";
import earthBump from "./textures/earth-bump.webp";
import earthSpec from "./textures/earth-specular.webp";
import earthClouds from "./textures/earth-clouds.webp";
import earthCloudsAlpha from "./textures/earth-clouds-alpha.webp";

import moon from "./textures/moon.webp";
import moonBump from "./textures/moon-bump.webp";

import mars from "./textures/mars.webp";
import marsBump from "./textures/mars-bump.webp";

import jupiter from "./textures/jupiter.webp";

import saturn from "./textures/saturn.webp";
import saturnRing from "./textures/saturn-ring.webp";

import uranus from "./textures/uranus.webp";
import neptune from "./textures/neptune.webp";

import pluto from "./textures/pluto.webp";
import plutoBump from "./textures/pluto-bump.webp";

import ganymede from "./textures/ganymede.webp";
import ganymedeBump from "./textures/ganymede-bump.webp";

import titan from "./textures/titan.webp";
import titanBump from "./textures/titan-bump.webp";

import callisto from "./textures/callisto.webp";
import callistoBump from "./textures/callisto-bump.webp";

import io from "./textures/io.webp";
import ioBump from "./textures/io-bump.webp";

import europa from "./textures/europa.webp";
import europaBump from "./textures/europa-bump.webp";

import triton from "./textures/triton.webp";
import tritonBump from "./textures/triton-bump.webp";

import ceres from "./textures/ceres.webp";
import ceresBump from "./textures/ceres-bump.webp";

import haumea from "./textures/haumea.webp";
import haumeaBump from "./textures/haumea-bump.webp";

import makemake from "./textures/makemake.webp";
import makemakeBump from "./textures/makemake-bump.webp";

import eris from "./textures/eris.webp";
import erisBump from "./textures/eris-bump.webp";

// === Types ===
export type PlanetryObject = "star" | "planet" | "dwarf-planet" | "moon";

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
    textures: makeTextures(mercury, {bump: mercuryBump}),
    rotationDirection: "prograde",
  },
  Venus: {
    type: "planet",
    radius: 3760,
    tilt: 2.64,
    textures: makeTextures(venus, { bump: venusBump, atmosphere: venusClouds }),
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
  Pluto: {
    type: "dwarf-planet",
    radius: 738.38,
    tilt: 122.5,
    textures: makeTextures(pluto, { bump: plutoBump }),
    rotationDirection: "retrograde",
  },
  Ganymede: {
    type: "moon",
    radius: 2634,
    tilt: 3.33,
    textures: makeTextures(ganymede, { bump: ganymedeBump }),
    rotationDirection: "prograde"  // "synchronous",
  },
  Titan: {
    type: "moon",
    radius: 2574,
    tilt: 27,
    textures: makeTextures(titan, { bump: titanBump }),
    rotationDirection: "prograde" // "synchronous",
  },
  Callisto: {
    type: "moon",
    radius: 2410,
    tilt: 0,
    textures: makeTextures(callisto, { bump: callistoBump }),
    rotationDirection: "prograde" // "synchronous",
  },
  Io: {
    type: "moon",
    radius: 1821,
    tilt: 0.05,
    textures: makeTextures(io, { bump: ioBump }),
    rotationDirection: "prograde" // "synchronous",
  },
  Europa: {
    type: "moon",
    radius: 1560,
    tilt: 0.47,
    textures: makeTextures(europa, { bump: europaBump }),
    rotationDirection: "prograde" // "synchronous",
  },
  Triton: {
    type: "moon",
    radius: 1353,
    tilt: 156,
    textures: makeTextures(triton, { bump: tritonBump }),
    rotationDirection: "retrograde",
  },
  Ceres: {
    type: "dwarf-planet",
    radius: 293.91,
    tilt: 4,
    textures: makeTextures(ceres, { bump: ceresBump }),
    rotationDirection: "prograde"
  },
  Haumea: {
    type: "dwarf-planet",
    radius: 507.04,
    tilt: 126,
    textures: makeTextures(haumea, { bump: haumeaBump }),
    rotationDirection: "prograde"
  },
  Makemake: {
    type: "dwarf-planet",
    radius: 444.28,
    tilt: 29,
    textures: makeTextures(makemake, { bump: makemakeBump }),
    rotationDirection: "prograde"
  },
  Eris: {
    type: "dwarf-planet",
    radius: 722.65,
    tilt: 44,
    textures: makeTextures(eris, { bump: erisBump }),
    rotationDirection: "prograde"
  },
};