// === Imports ===
import sun from "./textures/sun.jpg";

import mercury from "./textures/mercury-2k.jpg";
import mercuryBump from "./textures/mercury-bump-2k.jpg";

import venus from "./textures/venus-2k.jpg";
import venusClouds from "./textures/venus-clouds-2k.jpg";
import venusBump from "./textures/venus-bump-2k.jpg";

import earth from "./textures/earth-2k.jpg";
import earthBump from "./textures/earth-bump-2k.jpg";
import earthSpec from "./textures/earth-specular-2k.jpg";
import earthClouds from "./textures/earth-clouds-2k.png";
import earthCloudsAlpha from "./textures/earth-clouds-alpha-2k.jpg";

import moon from "./textures/moon-2k.jpg";
import moonBump from "./textures/moon-bump-2k.jpg";

import mars from "./textures/mars.jpg";
import marsBump from "./textures/mars-bump.jpg";

import jupiter from "./textures/jupiter.jpg";

import saturn from "./textures/saturn.jpg";
import saturnRing from "./textures/saturn-ring.png";

import uranus from "./textures/uranus.jpg";
import neptune from "./textures/neptune.jpg";

import pluto from "./textures/pluto.jpg";
import plutoBump from "./textures/pluto-bump.jpg";

import ganymede from "./textures/ganymede.jpg";
import ganymedeBump from "./textures/ganymede-bump.jpg";

import titan from "./textures/titan.webp";
import titanBump from "./textures/titan-bump.jpg";

import callisto from "./textures/callisto.jpg";
import callistoBump from "./textures/callisto-bump.jpg";

import io from "./textures/io.jpg";
import ioBump from "./textures/io-bump.jpg";

import europa from "./textures/europa-2k.jpg";
import europaBump from "./textures/europa-bump-2k.jpg";

import triton from "./textures/triton.jpg";
import tritonBump from "./textures/triton-bump.jpg";

import ceres from "./textures/ceres.jpg";
import ceresBump from "./textures/ceres-bump.jpg";

import haumea from "./textures/haumea.jpg";
import haumeaBump from "./textures/haumea-bump.jpg";

import makemake from "./textures/makemake.jpg";
import makemakeBump from "./textures/makemake-bump.jpg";

import eris from "./textures/eris.jpg";
import erisBump from "./textures/eris-bump.jpg";

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