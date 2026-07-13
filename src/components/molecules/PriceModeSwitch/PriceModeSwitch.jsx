import "./PriceModeSwitch.css";

const MODOS = [
  { key: "margen", label: "Margen %" },
  { key: "precioFinal", label: "Precio final" },
  { key: "utilidad", label: "Utilidad $" },
];

export function PriceModeSwitch({ value, onChange }) {
  return (
    <div className="margen-mode-switch">
      {MODOS.map(m => (
        <button key={m.key} className={`margen-mode-btn ${value === m.key ? "active" : ""}`}
          onClick={() => onChange(m.key)}>{m.label}</button>
      ))}
    </div>
  );
}
