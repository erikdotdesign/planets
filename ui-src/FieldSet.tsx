import SpaceDecor from "./SpaceDecor";

import "./Control.css";

const FieldSet = ({
  label,
  children,
  spaceDecor,
  ...props
}: {
  label: string;
  children: any;
  spaceDecor?: boolean;
}) => {
  return (
    <fieldset 
      className="c-control-fieldset"
      {...props}>
      <legend className="c-control__label c-control__label--legend">
        { label }
      </legend>
      { children }
      {
        spaceDecor
        ? <SpaceDecor />
        : null
      }
    </fieldset>
  );
};

export default FieldSet;