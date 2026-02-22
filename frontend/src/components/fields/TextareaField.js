import { useRef, useEffect } from 'react';

const MAX_HEIGHT = 120;

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
    const newWidth = Math.max(scrollWidth + 20, minWidth);
    const cappedHeight = Math.min(Math.max(scrollHeight + 20, minHeight), MAX_HEIGHT);
    onResize(newWidth, cappedHeight);
  }, [value, onResize, minWidth, minHeight, textareaRef]);

  return (
    <label className="field">
      {label}
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
