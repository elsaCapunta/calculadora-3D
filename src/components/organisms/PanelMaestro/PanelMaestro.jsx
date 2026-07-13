import { IMPRESORAS } from "../../../domain/constantes";
import { SliderInput } from "../../atoms/SliderInput/SliderInput";
import { NumberInput } from "../../atoms/NumberInput/NumberInput";
import { Section } from "../../molecules/Section/Section";
import { TwoColumnLayout } from "../../molecules/TwoColumnLayout/TwoColumnLayout";
import { PrinterOption } from "../../molecules/PrinterOption/PrinterOption";
import "./PanelMaestro.css";

export function PanelMaestro({ maestro, setMaestro }) {
  const upd = (key) => (val) => setMaestro(prev => ({ ...prev, [key]: val }));
  const selectPrinter = (p) => setMaestro(prev => ({
    ...prev, impresora: p.id,
    ...(p.watts ? { wattsPromedio: p.watts } : {}),
  }));

  return (
    <div className="maestro-card">
      <div className="maestro-card-title">
        ⚙️ Impresora, filamento y fallas <span className="maestro-card-hint">— se aplica a todos los ítems de esta cotización</span>
      </div>
      <TwoColumnLayout
        left={
          <Section title="🖨 Impresora">
            <div className="printer-grid">
              {IMPRESORAS.map(p => (
                <PrinterOption key={p.id} printer={p} active={maestro.impresora === p.id} onClick={() => selectPrinter(p)} />
              ))}
            </div>
            <SliderInput label="Consumo promedio" value={maestro.wattsPromedio} onChange={upd("wattsPromedio")} min={30} max={500} step={5} suffix=" W" help="Se ajusta solo al elegir un modelo; puedes afinarlo a mano." />
          </Section>
        }
        right={
          <>
            <Section title="🧵 Filamento">
              <NumberInput label="Precio del rollo" value={maestro.precioRollo} onChange={upd("precioRollo")} prefix="$ " suffix=" CLP" />
              <SliderInput label="Peso del rollo" value={maestro.pesoRollo} onChange={upd("pesoRollo")} min={250} max={3000} step={50} suffix=" g" />
            </Section>
            <Section title="⚡ Tarifa eléctrica">
              <SliderInput label="Costo por kWh" value={maestro.tarifaKwh} onChange={upd("tarifaKwh")} min={80} max={300} prefix="$ " suffix="/kWh" />
            </Section>
            <Section title="⚠️ Fallas">
              <SliderInput label="Porcentaje de fallas" value={maestro.porcentajeFallas} onChange={upd("porcentajeFallas")} min={0} max={50} suffix="%" />
            </Section>
          </>
        }
      />
    </div>
  );
}
