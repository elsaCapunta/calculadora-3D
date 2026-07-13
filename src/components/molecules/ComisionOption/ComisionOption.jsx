import "./ComisionOption.css";

export function ComisionOption({ tipo, active, onClick }) {
  return (
    <button className={`ml-tipo-btn ${active ? "active" : ""}`} onClick={onClick}>
      <span className="ml-tipo-label">{tipo.label}</span>
      <span className="ml-tipo-tasa">{tipo.tasa}</span>
      <span className="ml-tipo-desc">{tipo.desc}</span>
    </button>
  );
}
