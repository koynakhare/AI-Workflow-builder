// TextField.js

export const TextField = ({ label, value, onChange, placeholder }) => {
  return (
    <label>
      {label}:
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </label>
  );
};
