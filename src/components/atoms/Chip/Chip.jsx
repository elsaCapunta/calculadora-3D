import "./Chip.css";

export function Chip({ active, onClick, children }) {
  return (
    <button className={`tag ${active ? "active" : ""}`} onClick={onClick}>
      {children}
    </button>
  );
}
