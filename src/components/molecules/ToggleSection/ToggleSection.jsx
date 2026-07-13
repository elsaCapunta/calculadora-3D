import { ToggleButton } from "../../atoms/ToggleButton/ToggleButton";
import "./ToggleSection.css";

export function ToggleSection({ icon, label, enabled, onToggle, children }) {
  return (
    <div className={`opt-panel ${!enabled ? "panel-disabled" : ""}`}>
      <div className="opt-panel-title">
        <span>{icon} {label}</span>
        <ToggleButton label={enabled ? "Incluido" : "Excluido"} checked={enabled} onChange={onToggle} />
      </div>
      {enabled && <div className="opt-panel-body">{children}</div>}
    </div>
  );
}
