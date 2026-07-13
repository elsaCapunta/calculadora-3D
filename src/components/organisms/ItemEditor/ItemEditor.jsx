import { fmt } from "../../../domain/formato";
import { useDraftValue } from "../../../hooks/useDraftValue";
import { NumberInput } from "../../atoms/NumberInput/NumberInput";
import { SliderInput } from "../../atoms/SliderInput/SliderInput";
import { Chip } from "../../atoms/Chip/Chip";
import "../../atoms/inputPrimitives.css";
import "../../atoms/NumberInput/NumberInput.css";
import { Section } from "../../molecules/Section/Section";
import { ToggleSection } from "../../molecules/ToggleSection/ToggleSection";
import { TwoColumnLayout } from "../../molecules/TwoColumnLayout/TwoColumnLayout";
import { PriceModeSwitch } from "../../molecules/PriceModeSwitch/PriceModeSwitch";
import "./ItemEditor.css";

const MARGEN_PRESETS = [{ label: "1.5x", val: 150 }, { label: "2x", val: 200 }, { label: "3x", val: 300 }, { label: "4x", val: 400 }];

export function ItemEditor({ item, onChange, onDuplicate, onDelete, calc, expanded, onToggle }) {
  const upd = (key) => (val) => onChange({ ...item, [key]: val });

  // El margen (%) es la única fuente de verdad; los otros modos solo
  // resuelven qué margen produce el precio o la utilidad que el usuario pidió.
  const redondearMargen = (m) => Math.round(Math.max(0, m) * 10) / 10;
  const setMargenPorPrecioFinal = (precioConIvaDeseado) => {
    if (calc.costoUnitario <= 0) return;
    const precioVentaDeseado = precioConIvaDeseado / 1.19;
    upd("margenGanancia")(redondearMargen((precioVentaDeseado / calc.costoUnitario) * 100));
  };
  const setMargenPorUtilidad = (utilidadDeseada) => {
    if (calc.costoUnitario <= 0) return;
    const precioVentaDeseado = calc.costoUnitario + utilidadDeseada;
    upd("margenGanancia")(redondearMargen((precioVentaDeseado / calc.costoUnitario) * 100));
  };

  const precioFinalDraft = useDraftValue(Math.round(calc.precioConIva), setMargenPorPrecioFinal);
  const utilidadDraft = useDraftValue(Math.round(calc.ganancia), setMargenPorUtilidad);

  return (
    <div className="item-card">
      <div className="item-header" onClick={onToggle}>
        <div className="item-header-left">
          <span className="item-arrow">{expanded ? "▾" : "▸"}</span>
          <input className="item-name-input" value={item.nombre}
            onClick={e => e.stopPropagation()}
            onChange={e => upd("nombre")(e.target.value)}
            placeholder="Nombre de la pieza" />
          <span className="item-qty-badge">×{item.cantidad}</span>
        </div>
        <div className="item-header-right" onClick={e => e.stopPropagation()}>
          <span className="item-price-preview">{fmt(calc.precioConIva)}/u</span>
          <button className="icon-btn" title="Duplicar" onClick={onDuplicate}>⧉</button>
          <button className="icon-btn danger" title="Eliminar" onClick={onDelete}>✕</button>
        </div>
      </div>

      {expanded && (
        <div className="item-body">
          <TwoColumnLayout
            left={
              <>
                <Section title="📦 Cantidad">
                  <NumberInput label="Unidades" value={item.cantidad} onChange={upd("cantidad")} min={1} suffix=" u" />
                </Section>
                <Section title="🧵 Filamento">
                  <SliderInput label="Peso de la pieza" value={item.pesoFilamento} onChange={upd("pesoFilamento")} min={1} max={500} suffix=" g" help="Revisa en Bambu Studio → 'Estimated total weight'" />
                </Section>
              </>
            }
            right={
              <>
                <Section title="⚡ Electricidad">
                  <div className="two-col">
                    <NumberInput label="Horas" value={item.horasImpresion} onChange={upd("horasImpresion")} suffix=" h" />
                    <NumberInput label="Minutos" value={item.minutosImpresion} onChange={upd("minutosImpresion")} min={0} suffix=" min" />
                  </div>
                </Section>
                <ToggleSection icon="⏱" label="Tu Tiempo" enabled={item.incluirTrabajo} onToggle={upd("incluirTrabajo")}>
                  <SliderInput label="Horas de trabajo/pieza" value={item.tuTiempoHoras} onChange={upd("tuTiempoHoras")} min={0} max={8} step={0.25} suffix=" h" />
                  <NumberInput label="Valor hora" value={item.valorHoraTrabajo} onChange={upd("valorHoraTrabajo")} prefix="$ " suffix=" CLP/h" />
                </ToggleSection>
                <ToggleSection icon="🔗" label="Otros" enabled={item.incluirOtros} onToggle={upd("incluirOtros")}>
                  <NumberInput label="Costo adicional" value={item.costoOtros} onChange={upd("costoOtros")} prefix="$ " suffix=" CLP" help="Ej: llavero, clicker u otro accesorio agregado a esta pieza." />
                </ToggleSection>
              </>
            }
          />

          <div className="margen-row-full">
            <PriceModeSwitch value={item.modoPrecio} onChange={upd("modoPrecio")} />

            {item.modoPrecio === "precioFinal" ? (
              <div className="margen-alt-input">
                <div className="input-group">
                  <div className="input-label-row"><label>Precio final (con IVA)</label></div>
                  <p className="input-help">Escribe el precio al que vas a vender. Calculamos el margen que te queda.</p>
                  <div className="number-input-wrap">
                    <span className="unit-label">$</span>
                    <input type="number" min={0}
                      value={precioFinalDraft.value}
                      onFocus={precioFinalDraft.onFocus}
                      onBlur={precioFinalDraft.onBlur}
                      onChange={precioFinalDraft.onChange} />
                    <span className="unit-label">CLP</span>
                  </div>
                </div>
                <div className="margen-derived-info">
                  Margen resultante: <strong>{item.margenGanancia.toFixed(0)}%</strong> · Ganancia neta: <strong>{fmt(calc.gananciaNeta)}</strong>
                </div>
              </div>
            ) : item.modoPrecio === "utilidad" ? (
              <div className="margen-alt-input">
                <div className="input-group">
                  <div className="input-label-row"><label>Utilidad deseada (por unidad)</label></div>
                  <p className="input-help">Escribe cuánto quieres ganar por sobre el costo. Sumamos IVA y comisión, y armamos el precio final.</p>
                  <div className="number-input-wrap">
                    <span className="unit-label">$</span>
                    <input type="number" min={0}
                      value={utilidadDraft.value}
                      onFocus={utilidadDraft.onFocus}
                      onBlur={utilidadDraft.onBlur}
                      onChange={utilidadDraft.onChange} />
                    <span className="unit-label">CLP</span>
                  </div>
                </div>
                <div className="margen-derived-info">
                  Precio final: <strong>{fmt(calc.precioConIva)}</strong> · Margen: <strong>{item.margenGanancia.toFixed(0)}%</strong>
                </div>
              </div>
            ) : (
              <>
                <div className="margen-label-row">
                  <span>Margen de ganancia</span>
                  <span className="margen-val">{item.margenGanancia}% ({(item.margenGanancia / 100).toFixed(1)}x)</span>
                </div>
                <input type="range" min={110} max={500} step={5} value={item.margenGanancia}
                  onChange={e => upd("margenGanancia")(Number(e.target.value))} />
                <div className="tag-grid">
                  {MARGEN_PRESETS.map(t => (
                    <Chip key={t.val} active={item.margenGanancia === t.val} onClick={() => upd("margenGanancia")(t.val)}>{t.label}</Chip>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="item-result">
            <div className="item-result-col">
              <div className="ir-label">Costo unitario</div>
              <div className="ir-val">{fmt(calc.costoUnitario)}</div>
            </div>
            <div className="item-result-col accent-orange">
              <div className="ir-label">Precio sin IVA</div>
              <div className="ir-val">{fmt(calc.precioVenta)}</div>
            </div>
            <div className="item-result-col accent-green">
              <div className="ir-label">Precio con IVA</div>
              <div className="ir-val">{fmt(calc.precioConIva)}</div>
            </div>
            <div className="item-result-col accent-blue">
              <div className="ir-label">Total ×{item.cantidad}</div>
              <div className="ir-val">{fmt(calc.totalVenta)}</div>
            </div>
            <div className="item-result-col" style={{ borderLeft: "1px solid #2a2a36", paddingLeft: 12 }}>
              <div className="ir-label">Ganancia neta</div>
              <div className="ir-val" style={{ color: calc.gananciaNeta >= 0 ? "#4ecb71" : "#ff4444" }}>
                {fmt(calc.totalGanancia)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
