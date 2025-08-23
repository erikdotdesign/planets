export type DisplayType = "static" | "animated";

export type ColorMethod = "random" | "angle" | "grid";

export type PathVisual = "particle" | "trace";

export type ParticleState = {
  count: number;
  size: number;
  speed: number;
};

export type NoiseState = {
  scale: number;
  strength: number;
};

export type Palette = {
  background: string;
  colors: string[];
};