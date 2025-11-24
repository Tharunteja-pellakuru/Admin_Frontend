import React, { useState } from 'react';
import { X } from 'lucide-react';

/**
 * ChipInput Component
 * 
 * An input field that displays values as removable chips/tags.
 * 
 * @param {Object} props
 * @param {string} props.label - Input label
 * @param {Array<string>} props.value - Array of chip values
 * @param {function} props.onChange - Callback when chips change
 * @param {string} props.placeholder - Input placeholder
 * @param {boolean} props.required - Show required indicator
 * @param {string} props.helpText - Helper text
 */
const ChipInput = ({
  label,
  value = [],
  onChange,
  placeholder = "Type and press Enter",
  required = false,
  helpText,
  className = '',
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newChip = inputValue.trim();
      
      if (newChip && !value.includes(newChip)) {
        onChange([...value, newChip]);
        setInputValue('');
      }
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      // Remove last chip on backspace if input is empty
      onChange(value.slice(0, -1));
    }
  };

  const removeChip = (chipToRemove) => {
    onChange(value.filter(chip => chip !== chipToRemove));
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 transition-all duration-200 min-h-[42px]">
        <div className="flex flex-wrap gap-2">
          {value.map((chip, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium border border-primary-200"
            >
              {chip}
              <button
                type="button"
                onClick={() => removeChip(chip)}
                className="hover:bg-primary-200 rounded-full p-0.5 transition-colors"
                aria-label={`Remove ${chip}`}
              >
                <X size={14} />
              </button>
            </span>
          ))}
          
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={value.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[120px] outline-none bg-transparent text-gray-900 placeholder-gray-400"
          />
        </div>
      </div>
      
      {helpText && (
        <p className="mt-1.5 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
};

export default ChipInput;
