import { useDraftValue } from "../../../hooks/useDraftValue";
import "../inputPrimitives.css";
import "./NumberInput.css";

export function NumberInput({ label, value, onChange, prefix = "", suffix = "", help, min = 0 }) {
  const draft = useDraftValue(value, (n) => onChange(Math.max(min, n)));

  return (
    <div className="input-group">
      <div className="input-label-row"><label>{label}</label></div>
      {help && <p className="input-help">{help}</p>}
      <div className="number-input-wrap">
        {prefix && <span className="unit-label">{prefix}</span>}
        <input type="number" min={min}
          value={draft.value}
          onFocus={draft.onFocus}
          onBlur={draft.onBlur}
          onChange={draft.onChange} />
        {suffix && <span className="unit-label">{suffix}</span>}
      </div>
    </div>
  );
}
