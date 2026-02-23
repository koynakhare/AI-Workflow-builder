const TextField = ({ label, value, onChange, placeholder }) => (
  <label className="field">
    <span className="field__label">{label}</span>
    <input
      type="text"
      className="field__input"
      value={value ?? ''}
      onChange={onChange}
      placeholder={placeholder ?? ''}
    />
  </label>
);

export { TextField };
