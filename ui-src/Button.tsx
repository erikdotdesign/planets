import React from 'react';
import './Button.css';

const Button = ({
  children,
  modifier,
  bRef,
  ...props
}: {
  children?: React.ReactNode;
  modifier?: string | string[];
  bRef?: React.RefObject<HTMLButtonElement>;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const modifierClasses = Array.isArray(modifier)
    ? modifier.map((m) => `c-button--${m}`).join(' ')
    : modifier
    ? `c-button--${modifier}`
    : '';
  return (
    <button
      ref={bRef}
      className={`c-button ${modifierClasses}`}
      {...props}>
      {
        modifierClasses.includes("space")
        ? <>
            <div className="h-crosshair h-crosshair--top-left" />
            <div className="h-crosshair h-crosshair--top-right" />
            <div className='h-rule h-rule--top' />
            <div className="h-rule h-rule--left" />
          </>
        : null
      }
      {children}
      {
        modifierClasses.includes("space")
        ? <>
            <div className="h-rule h-rule--right" />
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