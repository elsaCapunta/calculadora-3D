import "./PrinterOption.css";

export function PrinterOption({ printer, active, onClick }) {
  return (
    <button className={`printer-btn ${active ? "active" : ""}`} onClick={onClick}>
      <span>{printer.nombre}</span>
      {printer.watts && <span className="printer-watts">{printer.watts}W</span>}
    </button>
  );
}
