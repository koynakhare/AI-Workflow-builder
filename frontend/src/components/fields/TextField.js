const TextField = ({ label, value, onChange, placeholder }) => (
  <label className="field">
    {label}
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
