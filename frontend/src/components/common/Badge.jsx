import React from 'react';

const Badge = ({ children, variant = 'violet', className = '', icon: Icon }) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'navy':
        return 'pm-badge-navy';
      case 'emerald':
      case 'success':
        return 'pm-badge-emerald';
      case 'amber':
      case 'warning':
        return 'pm-badge-amber';
      case 'rose':
      case 'danger':
        return 'pm-badge-rose';
      case 'violet':
      default:
        return 'pm-badge-violet';
    }
  };

  return (
    <span className={`pm-badge ${getVariantClass()} ${className}`}>
      {Icon && <Icon size={12} className="flex-shrink-0" />}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
