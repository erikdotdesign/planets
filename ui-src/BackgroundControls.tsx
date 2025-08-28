import Control from "./Control";
import FieldSet from "./FieldSet";

const BackgroundControls = ({
  showEnvironment,
  setShowEnvironment
}: {
  showEnvironment: boolean;
  setShowEnvironment: (showEnvironment: boolean) => void;
}) => {
  return (
    <FieldSet label="Background">
      <Control
        label="Show"
        name="environment"
        type="radio"
        checked={showEnvironment}
        value="show"
        onChange={() => setShowEnvironment(true)} />
      <Control
        label="Hide"
        name="environment"
        type="radio"
        checked={!showEnvironment}
        value="hide"
        onChange={() => setShowEnvironment(false)} />
    </FieldSet>
  );
};

export default BackgroundControls;