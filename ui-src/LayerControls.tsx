import Control from "./Control";
import FieldSet from "./FieldSet";

const LayerControls = ({
  showEnvironment,
  setShowEnvironment,
  showAtmosphere,
  setShowAtmosphere
}: {
  showEnvironment: boolean;
  setShowEnvironment: (showEnvironment: boolean) => void;
  showAtmosphere: boolean;
  setShowAtmosphere: (showAtmosphere: boolean) => void;
}) => {
  return (
    <FieldSet 
      label="Layers"
      spaceDecor>
      <Control
        label="Background"
        type="checkbox"
        checked={showEnvironment}
        onChange={() => setShowEnvironment(!showEnvironment)} />
      <Control
        label="Atmosphere"
        type="checkbox"
        checked={showAtmosphere}
        onChange={() => setShowAtmosphere(!showAtmosphere)} />
    </FieldSet>
  );
};

export default LayerControls;