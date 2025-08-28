import { capitalize } from "./helpers";
import { LightMode } from './planetViewer';
import Control from "./Control";
import FieldSet from "./FieldSet";

const LightingControls = ({
  lightMode,
  setLightMode
}: {
  lightMode: LightMode;
  setLightMode: (lighting: LightMode) => void;
}) => {
  return (
    <FieldSet 
      label="Lighting"
      spaceDecor>
      {
        ["sun", "neutral"].map((l) => (
          <Control
            label={capitalize(l)}
            type="radio"
            value={l}
            name="light-mode"
            checked={l === lightMode}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              setLightMode(e.target.value as LightMode)
            } />
        ))
      }
    </FieldSet>
  );
};

export default LightingControls;