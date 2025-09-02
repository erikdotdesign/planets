import { PlanetViewer } from './planetViewer';
import { PLANETS } from './planets';

export const generatePlanetThumbnails = async () => {
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
      planet: name,
      textures: planet.textures,
      tilt: planet.tilt
    });

    const image = await viewer.renderOnce(true);
    previews.push({ name, image });
  }

  return previews;
};