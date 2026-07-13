import "./ToggleButton.css";

export function ToggleButton({ label, checked, onChange }) {
  return (
    <button className={`toggle-btn ${checked ? "active" : ""}`} onClick={() => onChange(!checked)}>
      {checked ? `${label} ✓` : label}
    </button>
  );
}
