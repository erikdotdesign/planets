import Control from "./Control";
import FieldSet from "./FieldSet";
import { PLANETS } from "./planets";

const LayerControls = ({
  planet,
  showEnvironment,
  setShowEnvironment,
  showAtmosphere,
  setShowAtmosphere,
  showElevation,
  setShowElevation
}: {
  planet: keyof typeof PLANETS;
  showEnvironment: boolean;
  setShowEnvironment: (showEnvironment: boolean) => void;
  showAtmosphere: boolean;
  setShowAtmosphere: (showAtmosphere: boolean) => void;
  showElevation: boolean;
  setShowElevation: (showElevation: boolean) => void;
}) => {
  const hasAtmosphere = planet === "Earth" || planet === "Venus";
  const hasElevation = planet !== "Sun" && planet !== "Jupiter" && planet !== "Saturn" && planet !== "Uranus" && planet !== "Neptune";
  return (
    <FieldSet 
      label="Layers"
      spaceDecor>
      <Control
        modifier={[...(!hasAtmosphere ? ["disabled"] : [])]}
        disabled={!hasAtmosphere}
        label="Atmosphere"
        type="checkbox"
        checked={showAtmosphere}
        onChange={() => setShowAtmosphere(!showAtmosphere)} />
      <Control
        modifier={[...(!hasElevation ? ["disabled"] : [])]}
        disabled={!hasElevation}
        label="Elevation"
        type="checkbox"
        checked={showElevation}
        onChange={() => setShowElevation(!showElevation)} />
      <Control
        label="Background"
        type="checkbox"
        checked={showEnvironment}
        onChange={() => setShowEnvironment(!showEnvironment)} />
    </FieldSet>
  );
};

export default LayerControls;