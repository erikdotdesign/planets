import "./Control.css";

const FieldSet = ({
  label,
  children,
  ...props
}: {
  label: string;
  children: any;
}) => {
  return (
    <fieldset 
      className="c-control-fieldset"
      {...props}>
      <legend className="c-control__label c-control__label--legend">
        { label }
      </legend>
      <div className="c-control-fieldset__rule c-control-fieldset__rule--top" />
      { children }
      <div className="c-control-fieldset__rule c-control-fieldset__rule--bottom" />
    </fieldset>
  );
}

export default FieldSet;