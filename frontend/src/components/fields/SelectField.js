// SelectField.js

export const SelectField = ({ label, value, onChange, options }) => {
  return (
    <label>
      {label}:
      <select value={value} onChange={onChange}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
};
