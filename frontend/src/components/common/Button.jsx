import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  loading = false,
  disabled = false,
  onClick,
  className = '',
  icon: Icon,
  iconRight: IconRight,
  ...props
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'navy':
        return 'btn-pm-navy';
      case 'outline':
        return 'btn-pm-outline';
      case 'ghost':
        return 'btn-pm-ghost';
      case 'danger':
        return 'btn btn-outline-danger';
      case 'primary':
      default:
        return 'btn-pm-primary';
    }
  };

  const getSizeClass = () => {
    if (size === 'sm') return 'btn-sm py-1 px-3 text-xs';
    if (size === 'lg') return 'btn-lg py-3 px-4';
    return '';
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${getVariantClass()} ${getSizeClass()} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
      ) : (
        Icon && <Icon size={16} className="flex-shrink-0" />
      )}
      <span>{children}</span>
      {IconRight && !loading && <IconRight size={16} className="flex-shrink-0" />}
    </button>
  );
};

export default Button;
