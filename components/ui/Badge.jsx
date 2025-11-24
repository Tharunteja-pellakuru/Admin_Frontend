import React from 'react';

/**
 * Badge Component
 * 
 * A small label component for status indicators.
 * 
 * @param {Object} props
 * @param {'success' | 'error' | 'warning' | 'info' | 'gray'} props.variant - Color variant
 * @param {'sm' | 'md' | 'lg'} props.size - Badge size
 * @param {React.ReactNode} props.icon - Optional icon
 * @param {boolean} props.dot - Show dot indicator
 */
const Badge = ({
  variant = 'gray',
  size = 'md',
  icon,
  dot = false,
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full border';
  
  const variants = {
    success: 'bg-primary-50 text-primary-700 border-primary-200',
    error: 'bg-red-50 text-red-700 border-red-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    gray: 'bg-gray-100 text-gray-700 border-gray-200',
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-sm gap-1.5',
    lg: 'px-3 py-1.5 text-base gap-2',
  };
  
  const dotColors = {
    success: 'bg-primary-500',
    error: 'bg-red-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500',
    gray: 'bg-gray-500',
  };
  
  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };
  
  const badgeClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <span className={badgeClasses} {...props}>
      {dot && (
        <span className={`${dotColors[variant]} ${dotSizes[size]} rounded-full`}></span>
      )}
      {icon && (
        <span className="flex-shrink-0">{icon}</span>
      )}
      <span className="uppercase tracking-wide font-bold">{children}</span>
    </span>
  );
};

export default Badge;
