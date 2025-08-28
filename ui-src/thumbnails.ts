import { PlanetViewer } from './planetViewer';
import { PLANETS } from './planets'; // an array of 16 PlanetOptions or { type, textures }

export async function generatePlanetThumbnails() {
  const canvas = document.createElement('canvas');
  const viewer = new PlanetViewer(canvas, {
    lightMode: "neutral",
    environment: false,
    controls: false,
    headless: true,
    width: 48,
    height: 48,
  });

  const previews: { name: string; image: string }[] = [];

  for (const [name, planet] of Object.entries(PLANETS)) {
    await viewer.setPlanet({
      type: planet.type,
      textures: planet.textures,
      tilt: planet.tilt
    });

    const image = await viewer.renderOnce();
    previews.push({ name, image });
  }

  return previews;
}