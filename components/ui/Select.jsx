import React, { forwardRef } from 'react';

/**
 * Select Component
 * 
 * A styled select dropdown component.
 * 
 * @param {Object} props
 * @param {string} props.label - Select label
 * @param {string} props.error - Error message
 * @param {string} props.helpText - Helper text
 * @param {boolean} props.required - Show required indicator
 * @param {Array} props.options - Array of {value, label} objects
 * @param {'sm' | 'md' | 'lg'} props.size - Select size
 */
const Select = forwardRef(({
  label,
  error,
  helpText,
  required = false,
  options = [],
  size = 'md',
  className = '',
  children,
  ...props
}, ref) => {
  const baseStyles = 'w-full border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed appearance-none';
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm pr-8',
    md: 'px-4 py-2 text-base pr-10',
    lg: 'px-5 py-3 text-lg pr-12',
  };
  
  const stateStyles = error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500';
  
  const selectClasses = `${baseStyles} ${sizes[size]} ${stateStyles} ${className}`;
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          ref={ref}
          className={selectClasses}
          {...props}
        >
          {children || options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Custom dropdown arrow */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <svg className={size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {error && (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      )}
      
      {helpText && !error && (
        <p className="mt-1.5 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
