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
      <div className="c-button__crosshair c-button__crosshair--top-left" />
      <div className="c-button__crosshair c-button__crosshair--top-right" />
      <div className='c-button__rule c-button__rule--top' />
      {children}
      <div className='c-button__rule c-button__rule--bottom' />
      <div className="c-button__crosshair c-button__crosshair--bottom-left" />
      <div className="c-button__crosshair c-button__crosshair--bottom-right" />
    </button>
  )
}

export default Button;