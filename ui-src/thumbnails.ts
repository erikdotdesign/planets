import { PlanetViewer } from './three-planet';
import { PLANETS } from './planets'; // an array of 16 PlanetOptions or { type, textures }

export async function generatePlanetThumbnails() {
  const canvas = document.createElement('canvas');
  const viewer = new PlanetViewer(canvas, {
    lightMode: "neutral",
    environment: false,
    controls: false,
    headless: true,
    width: 64,
    height: 64,
  });

  const previews: { name: string; image: string }[] = [];

  for (const [name, planet] of Object.entries(PLANETS)) {
    await viewer.setPlanet({
      type: planet.type,
      textures: planet.textures,
      radius: planet.radius,
    });

    const image = await viewer.renderOnce();
    previews.push({ name, image });
  }

  return previews;
}