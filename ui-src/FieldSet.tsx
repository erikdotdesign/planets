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
      <div className="c-control-fieldset__crosshair c-control-fieldset__crosshair--top-left" />
      <div className="c-control-fieldset__crosshair c-control-fieldset__crosshair--top-right" />
      <div className="c-control-fieldset__rule c-control-fieldset__rule--top" />
      { children }
      <div className="c-control-fieldset__rule c-control-fieldset__rule--bottom" />
      <div className="c-control-fieldset__crosshair c-control-fieldset__crosshair--bottom-left" />
      <div className="c-control-fieldset__crosshair c-control-fieldset__crosshair--bottom-right" />
    </fieldset>
  );
}

export default FieldSet;