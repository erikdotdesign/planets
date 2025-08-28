import { capitalize } from "./helpers";
import { LightMode } from './three-planet';
import Control from "./Control";
import FieldSet from "./FieldSet";

const LightingControls = ({
  lighting,
  setLighting
}: {
  lighting: LightMode;
  setLighting: (lighting: LightMode) => void;
}) => {
  return (
    <FieldSet label="Lighting">
      {
        ["sun", "neutral"].map((l) => (
          <Control
            label={capitalize(l)}
            type="radio"
            value={l}
            name="light-mode"
            checked={l === lighting}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              setLighting(e.target.value as LightMode)
            } />
        ))
      }
    </FieldSet>
  );
}

export default LightingControls;