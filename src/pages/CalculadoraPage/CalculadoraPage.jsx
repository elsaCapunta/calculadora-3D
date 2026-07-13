import { useState, useMemo } from "react";
import { calcItem } from "../../domain/calculo";
import { newItem, nCot } from "../../domain/item";
import { DEFAULT_MAESTRO, DEFAULT_COMISION_ML, DEFAULT_COT } from "../../domain/constantes";
import { AppShell } from "../../components/templates/AppShell/AppShell";
import { PanelMaestro } from "../../components/organisms/PanelMaestro/PanelMaestro";
import { ItemEditor } from "../../components/organisms/ItemEditor/ItemEditor";
import { TotalesBar } from "../../components/organisms/TotalesBar/TotalesBar";
import { ResumenPedido } from "../../components/organisms/ResumenPedido/ResumenPedido";
import { TabCotizacion } from "../../components/organisms/TabCotizacion/TabCotizacion";
import "./CalculadoraPage.css";

export function CalculadoraPage() {
  const [tab, setTab] = useState("calc");
  const [items, setItems] = useState([newItem()]);
  const [expanded, setExpanded] = useState({ [items[0].id]: true });
  const [cot, setCot] = useState({ ...DEFAULT_COT, numeroCot: nCot() });
  const [maestro, setMaestro] = useState(DEFAULT_MAESTRO);
  const [comisionCfg, setComisionCfg] = useState(DEFAULT_COMISION_ML);

  const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const addItem = () => {
    const last = items[items.length - 1];
    const item = newItem(last ? {
      valorHoraTrabajo: last.valorHoraTrabajo, margenGanancia: last.margenGanancia,
      modoPrecio: last.modoPrecio, incluirTrabajo: last.incluirTrabajo,
      costoOtros: last.costoOtros,
    } : {});
    setItems(prev => [...prev, item]);
    setExpanded({ [item.id]: true });
  };

  const updateItem = (id, updated) =>
    setItems(prev => prev.map(i => i.id === id ? updated : i));

  const deleteItem = (id) => {
    setItems(prev => {
      const next = prev.filter(i => i.id !== id);
      if (next.length === 0) {
        const fresh = newItem();
        setExpanded({ [fresh.id]: true });
        return [fresh];
      }
      return next;
    });
    setExpanded(prev => { const n = { ...prev }; delete n[id]; return n; });
  };

  const duplicateItem = (item) => {
    const copy = newItem({ ...item });
    copy.nombre = item.nombre + " (copia)";
    setItems(prev => {
      const idx = prev.findIndex(i => i.id === item.id);
      const next = [...prev];
      next.splice(idx + 1, 0, copy);
      return next;
    });
    setExpanded(prev => ({ ...prev, [copy.id]: true }));
  };

  const calcs = useMemo(() => {
    const map = {};
    items.forEach(item => { map[item.id] = calcItem(item, maestro, comisionCfg); });
    return map;
  }, [items, maestro, comisionCfg]);

  const totales = useMemo(() => ({
    costo:        items.reduce((s, i) => s + calcs[i.id].totalCosto,     0),
    venta:        items.reduce((s, i) => s + calcs[i.id].totalVenta,     0),
    ganancia:     items.reduce((s, i) => s + calcs[i.id].totalGanancia,  0),
    comision:     items.reduce((s, i) => s + calcs[i.id].montoComisionML * i.cantidad, 0),
    electricidad: items.reduce((s, i) => s + calcs[i.id].costoElectricidad * i.cantidad, 0),
    fallas:       items.reduce((s, i) => s + calcs[i.id].costoFallas * i.cantidad, 0),
    otros:        items.reduce((s, i) => s + calcs[i.id].costoOtros * i.cantidad, 0),
    unidades:     items.reduce((s, i) => s + i.cantidad, 0),
  }), [items, calcs]);

  return (
    <AppShell activeTab={tab} onTabChange={setTab}>
      {tab === "calc" && (
        <>
          <TotalesBar itemsCount={items.length} totales={totales} />
          <PanelMaestro maestro={maestro} setMaestro={setMaestro} />

          {items.map(item => (
            calcs[item.id] ? (
              <ItemEditor
                key={item.id}
                item={item}
                calc={calcs[item.id]}
                expanded={!!expanded[item.id]}
                onToggle={() => toggleExpand(item.id)}
                onChange={(updated) => updateItem(item.id, updated)}
                onDuplicate={() => duplicateItem(item)}
                onDelete={() => deleteItem(item.id)}
              />
            ) : null
          ))}

          <button className="add-btn" onClick={addItem}>+ Agregar ítem</button>

          <ResumenPedido items={items} calcs={calcs} totales={totales} comisionCfg={comisionCfg} setComisionCfg={setComisionCfg} />
        </>
      )}

      {tab === "cot" && (
        <TabCotizacion
          cot={cot}
          setCot={setCot}
          items={items}
          calcs={calcs}
          totales={totales}
        />
      )}
    </AppShell>
  );
}
