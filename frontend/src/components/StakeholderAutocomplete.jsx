import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';

const StakeholderAutocomplete = ({ 
  value, 
  onChange, 
  placeholder = "Type Name of Stakeholder",
  className = "",
  onSelect 
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!value || value.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await api.get(`/api/stakeholders/without-justification?q=${value}`);
        setSuggestions(response.data);
        setShowSuggestions(response.data.length > 0);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [value]);

  const handleInputChange = (e) => {
    onChange(e);
  };

  const handleSuggestionClick = (suggestion) => {
    onChange({ target: { value: suggestion.name } });
    setShowSuggestions(false);
    if (onSelect) {
      onSelect(suggestion);
    }
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = (e) => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      if (!suggestionsRef.current?.contains(document.activeElement)) {
        setShowSuggestions(false);
      }
    }, 200);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        className={`w-full h-10 rounded-md shadow-xl px-3 border-gray-400 font-semibold text-black bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
        placeholder={placeholder}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
      />
      
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion) => (
            <div
              key={suggestion._id}
              className="px-4 py-3 cursor-pointer hover:bg-blue-50 border-b border-gray-100 transition-colors duration-150"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold text-gray-900">{suggestion.name}</div>
                  <div className="text-sm text-gray-600">
                    {suggestion.role?.name || 'No role'} • {suggestion.stakeholderType?.name || 'No type'}
                  </div>
                </div>
                <div className="text-xs text-blue-600 font-medium">
                  Select
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StakeholderAutocomplete;