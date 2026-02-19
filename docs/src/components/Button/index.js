import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Button = ({
  size = null,
  outline = false,
  variant = 'primary',
  block = false,
  disabled = false,
  className,
  style,
  link,
  label,
  icon,        // FontAwesomeIcon component goes here
  iconPosition = 'left' // optional prop to place icon left or right
}) => {
  const sizeMap = {
    sm: 'sm',
    small: 'sm',
    lg: 'lg',
    large: 'lg',
    medium: null,
  };
  const buttonSize = size ? sizeMap[size] : '';
  const sizeClass = buttonSize ? `button--${buttonSize}` : '';
  const outlineClass = outline ? 'button--outline' : '';
  const variantClass = variant ? `button--${variant}` : '';
  const blockClass = block ? 'button--block' : '';
  const disabledClass = disabled ? 'disabled' : '';
  const destination = disabled ? null : link;

  return (
    <Link to={destination}>
      <button
        className={clsx('button', sizeClass, outlineClass, variantClass, blockClass, disabledClass, className)}
        style={style}
        role="button"
        aria-disabled={disabled}
      >
        {icon && iconPosition === 'left' && (
          <span className="button__icon" style={{ marginRight: label ? 8 : 0 }}>
            <FontAwesomeIcon icon={icon} />
          </span>
        )}
        {label}
        {icon && iconPosition === 'right' && (
          <span className="button__icon" style={{ marginLeft: label ? 8 : 0 }}>
            <FontAwesomeIcon icon={icon} />
          </span>
        )}
      </button>
    </Link>
  );
};

export default Button;
