import { Tabs } from "../../molecules/Tabs/Tabs";
import "./AppShell.css";

const TABS = [
  { key: "calc", label: "🧮 Calculadora" },
  { key: "cot", label: "📄 Cotización" },
];

export function AppShell({ activeTab, onTabChange, children }) {
  return (
    <div className="app">
      <div className="header no-print">
        <div className="header-eyebrow">Impresión 3D Chile</div>
        <h1>Calculadora & Cotizador</h1>
        <p>Calcula costos, define precios y genera cotizaciones profesionales</p>
      </div>

      <Tabs tabs={TABS} active={activeTab} onChange={onTabChange} />

      {children}

      <div className="app-footer no-print">
        <p>Desarrollado por <strong>loopa-store</strong> con ❤️ — sin fines de lucro, solo las ganas de aportar a la comunidad.</p>
        <p className="app-footer-version">v.1.0.0</p>
      </div>
    </div>
  );
}
