import "../inputPrimitives.css";
import "./SliderInput.css";

export function SliderInput({ label, value, onChange, min, max, step = 1, prefix = "", suffix = "", help }) {
  return (
    <div className="input-group">
      <div className="input-label-row">
        <label>{label}</label>
        <span className="input-value">{prefix}{value.toLocaleString("es-CL")}{suffix}</span>
      </div>
      {help && <p className="input-help">{help}</p>}
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))} />
      <div className="range-labels">
        <span>{prefix}{min.toLocaleString("es-CL")}{suffix}</span>
        <span>{prefix}{max.toLocaleString("es-CL")}{suffix}</span>
      </div>
    </div>
  );
}
