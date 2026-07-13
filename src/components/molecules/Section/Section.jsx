import "./Section.css";

export function Section({ title, children }) {
  return (
    <div className="mini-section">
      <div className="mini-section-title">{title}</div>
      {children}
    </div>
  );
}
