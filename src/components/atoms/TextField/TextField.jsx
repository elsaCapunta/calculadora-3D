import "../inputPrimitives.css";
import "./TextField.css";

export function TextField({ label, value, onChange, placeholder = "", type = "text", help }) {
  return (
    <div className="input-group">
      <div className="input-label-row"><label>{label}</label></div>
      {help && <p className="input-help">{help}</p>}
      <input
        className="text-input"
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}
