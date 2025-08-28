import { useState, useEffect } from "react";
import { PLANETS } from "./planets";
import { generatePlanetThumbnails } from "./thumbnails";
import Button from "./Button";
import "./App.css";

const PlanetButtons = ({
  buttonRefs,
  planet,
  setPlanet
}: {
  buttonRefs: { [key: string]: HTMLButtonElement | null };
  planet: keyof typeof PLANETS;
  setPlanet: (planet: string) => void;
}) => {
  const [thumbnails, setThumbnails] = useState<{name: string; image: string}[] | null>(null);

  useEffect(() => {
    generatePlanetThumbnails().then(t => {
      setThumbnails(t);
    });
  }, []);

  return (
    <div className="c-button-group c-button-group--column">
      {
        Object.keys(PLANETS).map((k) => (
          <Button
            bRef={(el) => (buttonRefs.current[k] = el)}
            modifier={[...(planet === k ? ["radio-active"] : []), "planet", "space", "radio"]}
            key={k}
            onClick={() => setPlanet(k)}>
            <div
              className={`c-button__planet c-button__planet--${k.toLowerCase()} ${!thumbnails ? "c-button__planet--loading" : ""}`}
              style={{
                backgroundImage: thumbnails ? `url(${(
                  thumbnails.find((t) => t.name === k) as {name: string; image: string}).image
                })` : undefined
              }}/>
            <span>{ k }</span>
          </Button>
        ))
      }
    </div>
  );
}

export default PlanetButtons;