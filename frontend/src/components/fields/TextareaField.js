import { useRef, useEffect } from 'react';

const MAX_HEIGHT = 480;

const TextareaField = ({
  label,
  value,
  onChange,
  onKeyDown,
  placeholder,
  onResize,
  minWidth = 200,
  minHeight = 80,
  textareaRef: externalRef,
}) => {
  const internalRef = useRef(null);
  const textareaRef = externalRef ?? internalRef;

  useEffect(() => {
    if (!textareaRef?.current || !onResize) return;
    const textarea = textareaRef.current;
    textarea.style.height = 'auto';
    const scrollHeight = textarea.scrollHeight;
    const scrollWidth = textarea.scrollWidth;
    const newWidth = Math.max(scrollWidth + 24, minWidth);
    const newHeight = Math.min(Math.max(scrollHeight + 24, minHeight), MAX_HEIGHT);
    onResize(newWidth, newHeight);
    textarea.style.height = `${newHeight}px`;
  }, [value, onResize, minWidth, minHeight, textareaRef]);

  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <textarea
        ref={textareaRef}
        className="field__textarea"
        value={value ?? ''}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder ?? ''}
      />
    </label>
  );
};

export { TextareaField };
