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
      <div className="h-crosshair h-crosshair--top-left" />
      <div className="h-crosshair h-crosshair--top-right" />
      <div className="h-rule h-rule--top" />
      <div className="h-rule h-rule--left" />
      { children }
      <div className="h-rule h-rule--right" />
      <div className="h-rule h-rule--bottom" />
      <div className="h-crosshair h-crosshair--bottom-left" />
      <div className="h-crosshair h-crosshair--bottom-right" />
    </fieldset>
  );
}

export default FieldSet;