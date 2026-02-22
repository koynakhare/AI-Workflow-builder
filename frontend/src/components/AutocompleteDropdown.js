import { useEffect, useRef } from 'react';
import { isEmpty } from 'lodash';

const AutocompleteDropdown = ({
  position,
  suggestions,
  selectedIndex,
  onSelect,
  onClose,
  onHover,
  step,
}) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef.current.contains(event?.target)) onClose?.();
    };
    const handleEscape = (event) => {
      if (event?.key === 'Escape') onClose?.();
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  if (isEmpty(suggestions)) return null;

  return (
    <div
      ref={dropdownRef}
      className="autocomplete"
      style={{
        ['--autocomplete-x']: position?.x ?? 0,
        ['--autocomplete-y']: position?.y ?? 0,
      }}
    >
      {step === 1 && <div className="autocomplete__header">Step 1: Select Node</div>}
      {step === 2 && <div className="autocomplete__header">Step 2: Select Output Field</div>}
      {suggestions?.map((suggestion, index) => (
        <div
          key={index}
          className={`autocomplete__item ${index === selectedIndex ? 'autocomplete__item--selected' : ''}`}
          onClick={() => onSelect?.(suggestion)}
          onMouseEnter={() => onHover?.(index)}
          onMouseDown={(e) => {
            e?.preventDefault?.();
            onSelect?.(suggestion);
          }}
        >
          {suggestion?.label}
        </div>
      ))}
    </div>
  );
};

export { AutocompleteDropdown };
