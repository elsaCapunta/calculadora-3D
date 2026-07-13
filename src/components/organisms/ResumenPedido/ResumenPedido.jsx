import { fmt } from "../../../domain/formato";
import { TIPOS_COMISION_ML } from "../../../domain/constantes";
import { ToggleSection } from "../../molecules/ToggleSection/ToggleSection";
import { ComisionOption } from "../../molecules/ComisionOption/ComisionOption";
import "./ResumenPedido.css";

export function ResumenPedido({ items, calcs, totales, comisionCfg, setComisionCfg }) {
  return (
    <div className="resumen">
      <div className="resumen-title">📋 Resumen del pedido</div>

      {items.length > 1 && (
        <div className="resumen-rows">
          {items.map(item => (
            <div className="resumen-row" key={item.id}>
              <span>{item.nombre} ×{item.cantidad}</span>
              <span>{fmt(calcs[item.id].totalVenta)}</span>
            </div>
          ))}
        </div>
      )}

      <div className="resumen-ml">
        <ToggleSection icon="🛒" label="Comisión MercadoLibre" enabled={comisionCfg.incluir}
          onToggle={(v) => setComisionCfg(prev => ({ ...prev, incluir: v }))}>
          <div className="ml-tipo-grid">
            {TIPOS_COMISION_ML.map(t => (
              <ComisionOption key={t.key} tipo={t} active={comisionCfg.tipo === t.key}
                onClick={() => setComisionCfg(prev => ({ ...prev, tipo: t.key }))} />
            ))}
          </div>
        </ToggleSection>
      </div>

      <div className="resumen-total">
        <div className="resumen-total-cell">
          <div className="rt-label">Total costo</div>
          <div className="rt-val orange">{fmt(totales.costo)}</div>
        </div>
        <div className="resumen-total-cell">
          <div className="rt-label">Total venta (c/IVA)</div>
          <div className="rt-val green">{fmt(totales.venta)}</div>
        </div>
        <div className="resumen-total-cell">
          <div className="rt-label">Ganancia neta</div>
          <div className="rt-val green">{fmt(totales.ganancia)}</div>
        </div>
      </div>

      <div className="resumen-breakdown">
        <div className="resumen-breakdown-row">
          <span>⚡ Gasto en electricidad</span>
          <span>{fmt(totales.electricidad)}</span>
        </div>
        <div className="resumen-breakdown-row">
          <span>⚠️ Costo por fallas</span>
          <span>{fmt(totales.fallas)}</span>
        </div>
        {totales.otros > 0 && (
          <div className="resumen-breakdown-row">
            <span>🔗 Otros (llaveros, clickers, etc.)</span>
            <span>{fmt(totales.otros)}</span>
          </div>
        )}
        {comisionCfg.incluir && (
          <div className="resumen-breakdown-row">
            <span>🛒 Comisión MercadoLibre descontada</span>
            <span>{fmt(totales.comision)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
