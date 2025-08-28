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
  bRef?: (el: HTMLButtonElement) => HTMLButtonElement | React.RefObject<HTMLButtonElement>;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const modifierClasses = Array.isArray(modifier)
    ? modifier.map((m) => `c-button--${m}`).join(' ')
    : modifier
    ? `c-button--${modifier}`
    : '';
  const isSpace = modifierClasses.includes("space");
  return (
    <button
      ref={bRef}
      className={`c-button ${modifierClasses}`}
      {...props}>
      {
        isSpace
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
        isSpace
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