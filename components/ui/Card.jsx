import React from 'react';

/**
 * Card Component
 * 
 * A flexible container component with shadow and border options.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.title - Optional card title
 * @param {React.ReactNode} props.headerAction - Optional action in header
 * @param {string} props.footer - Optional footer content
 * @param {'sm' | 'md' | 'lg'} props.padding - Padding size
 * @param {boolean} props.hover - Enable hover effect
 */
const Card = ({
  children,
  title,
  headerAction,
  footer,
  padding = 'md',
  hover = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'bg-white rounded-xl border border-gray-200 transition-all duration-200';
  
  const paddingSizes = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  const hoverStyles = hover ? 'hover:shadow-lg hover:border-gray-300 cursor-pointer' : 'shadow-sm';
  
  const cardClasses = `${baseStyles} ${hoverStyles} ${className}`;
  
  return (
    <div className={cardClasses} {...props}>
      {(title || headerAction) && (
        <div className={`flex items-center justify-between ${paddingSizes[padding]} pb-4 border-b border-gray-100`}>
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          )}
          {headerAction && (
            <div>{headerAction}</div>
          )}
        </div>
      )}
      
      <div className={!title && !headerAction ? paddingSizes[padding] : `${paddingSizes[padding]} pt-${padding === 'sm' ? '4' : padding === 'lg' ? '6' : '5'}`}>
        {children}
      </div>
      
      {footer && (
        <div className={`${paddingSizes[padding]} pt-4 border-t border-gray-100 bg-gray-50 rounded-b-xl`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
