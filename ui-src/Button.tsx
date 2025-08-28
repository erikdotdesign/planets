import React from 'react';
import SpaceDecor from './SpaceDecor';
import './Button.css';

const Button = ({
  children,
  modifier,
  bRef,
  spaceDecor,
  ...props
}: {
  children?: React.ReactNode;
  modifier?: string | string[];
  bRef?: (el: HTMLButtonElement) => HTMLButtonElement | React.RefObject<HTMLButtonElement>;
  spaceDecor?: boolean;
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
      {children}
      {
        spaceDecor
        ? <SpaceDecor />
        : null
      }
    </button>
  )
};

export default Button;