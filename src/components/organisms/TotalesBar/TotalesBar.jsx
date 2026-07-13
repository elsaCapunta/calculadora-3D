import { fmt } from "../../../domain/formato";
import "./TotalesBar.css";

export function TotalesBar({ itemsCount, totales }) {
  return (
    <div className="totales-bar">
      <div className="total-card">
        <div className="total-card-label">Ítems</div>
        <div className="total-card-val">{itemsCount}</div>
      </div>
      <div className="total-card">
        <div className="total-card-label">Unidades</div>
        <div className="total-card-val">{totales.unidades}</div>
      </div>
      <div className="total-card highlight">
        <div className="total-card-label">Total venta (c/IVA)</div>
        <div className="total-card-val">{fmt(totales.venta)}</div>
      </div>
    </div>
  );
}
