import React from 'react';
import './Button.css';

const Button = ({
  children,
  modifier,
  ...props
}: {
  children?: React.ReactNode;
  modifier?: string | string[];
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const modifierClasses = Array.isArray(modifier)
    ? modifier.map((m) => `c-button--${m}`).join(' ')
    : modifier
    ? `c-button--${modifier}`
    : '';
  return (
    <button
      className={`c-button ${modifierClasses}`}
      {...props}>
      {
        modifierClasses.includes("planet")
        ? <>
            <div className="h-crosshair h-crosshair--top-left" />
            <div className="h-crosshair h-crosshair--top-right" />
            <div className='h-rule h-rule--top' />
          </>
        : null
      }
      {children}
      {
        modifierClasses.includes("planet")
        ? <>
            <div className='h-rule h-rule--bottom' />
            <div className="h-crosshair h-crosshair--bottom-left" />
            <div className="h-crosshair h-crosshair--bottom-right" />
          </>
        : null
      }
    </button>
  )
}

export default Button;