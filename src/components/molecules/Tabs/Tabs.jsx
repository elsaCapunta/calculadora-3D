import "./Tabs.css";

export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="tabs no-print">
      {tabs.map(t => (
        <button key={t.key} className={`tab-btn ${active === t.key ? "active" : ""}`}
          onClick={() => onChange(t.key)}>
          {t.label}
        </button>
      ))}
    </div>
  );
}
