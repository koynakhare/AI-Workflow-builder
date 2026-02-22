const SelectField = ({ label, value, onChange, options = [] }) => (
  <label className="field">
    {label}
    <div className="field__select-wrapper">
      <select
        className="field__select"
        value={value ?? ''}
        onChange={onChange}
      >
        {options?.map((opt) => (
          <option key={opt?.value} value={opt?.value} className="field__option">
            {opt?.label}
          </option>
        ))}
      </select>
      <span className="field__select-chevron">▾</span>
    </div>
  </label>
);

export { SelectField };
