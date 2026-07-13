import "./TwoColumnLayout.css";

export function TwoColumnLayout({ left, right }) {
  return (
    <div className="two-column-layout">
      <div className="two-column-layout-col">{left}</div>
      <div className="two-column-layout-col">{right}</div>
    </div>
  );
}
