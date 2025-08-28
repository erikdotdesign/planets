import Control from "./Control";
import FieldSet from "./FieldSet";

const RotationControls = ({
  rotationSpeed,
  setRotationSpeed,
  includeTilt,
  setIncludeTilt
}: {
  rotationSpeed: number;
  setRotationSpeed: (rotationSpeed: number) => void;
  includeTilt: boolean;
  setIncludeTilt: (includeTilt: boolean) => void;
}) => {
  return (
    <FieldSet label="Rotation">
      <Control
        label="Speed"
        type="range"
        min={0.1}
        max={1}
        step={0.1}
        value={rotationSpeed}
        right={<span>{rotationSpeed}</span>}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRotationSpeed(e.target.valueAsNumber)} />
      <Control
        label="Tilt"
        name="environment"
        type="checkbox"
        checked={includeTilt}
        value="hide"
        onChange={() => setIncludeTilt(!includeTilt)} />
    </FieldSet>
  );
};

export default RotationControls;