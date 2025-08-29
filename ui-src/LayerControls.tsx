import Control from "./Control";
import FieldSet from "./FieldSet";
import { PLANETS } from "./planets";

const LayerControls = ({
  planet,
  showEnvironment,
  setShowEnvironment,
  showAtmosphere,
  setShowAtmosphere
}: {
  planet: keyof typeof PLANETS;
  showEnvironment: boolean;
  setShowEnvironment: (showEnvironment: boolean) => void;
  showAtmosphere: boolean;
  setShowAtmosphere: (showAtmosphere: boolean) => void;
}) => {
  const hasAtmosphere = planet === "Earth" || planet === "Venus";
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
        label="Background"
        type="checkbox"
        checked={showEnvironment}
        onChange={() => setShowEnvironment(!showEnvironment)} />
    </FieldSet>
  );
};

export default LayerControls;