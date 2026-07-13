import { fmt, today } from "../../../domain/formato";
import "./CotizacionPreview.css";

export function CotizacionPreview({ cot, items, calcs, totales }) {
  const neto = totales.venta / 1.19;
  const iva  = totales.venta - neto;

  return (
    <div className="pdf-preview">
      {/* Encabezado */}
      <div className="pdf-header">
        <div className="pdf-logo-block">
          {cot.logoUrl
            ? <img src={cot.logoUrl} alt="Logo" className="pdf-logo" />
            : <div className="pdf-logo-placeholder">LOGO</div>
          }
          <div className="pdf-emisor-info">
            <div className="pdf-emisor-nombre">{cot.emisorNombre || "Tu nombre / empresa"}</div>
            {cot.emisorRut      && <div className="pdf-emisor-line">RUT: {cot.emisorRut}</div>}
            {cot.emisorDireccion && <div className="pdf-emisor-line">{cot.emisorDireccion}</div>}
            {cot.emisorTelefono && <div className="pdf-emisor-line">Tel: {cot.emisorTelefono}</div>}
            {cot.emisorEmail    && <div className="pdf-emisor-line">{cot.emisorEmail}</div>}
          </div>
        </div>
        <div className="pdf-cot-info">
          <div className="pdf-cot-title">COTIZACIÓN</div>
          <div className="pdf-cot-num">N° {cot.numeroCot || "001"}</div>
          <div className="pdf-cot-date">Fecha: {today()}</div>
          {cot.fechaVigencia && <div className="pdf-cot-date">Válida hasta: {cot.fechaVigencia}</div>}
        </div>
      </div>

      <div className="pdf-divider" />

      {/* Cliente */}
      <div className="pdf-section">
        <div className="pdf-section-title">DATOS DEL CLIENTE</div>
        <div className="pdf-client-grid">
          {cot.clienteNombre  && <div><span>Nombre:</span> {cot.clienteNombre}</div>}
          {cot.clienteEmpresa && <div><span>Empresa:</span> {cot.clienteEmpresa}</div>}
          {cot.clienteRut     && <div><span>RUT:</span> {cot.clienteRut}</div>}
          {cot.clienteEmail   && <div><span>Email:</span> {cot.clienteEmail}</div>}
        </div>
      </div>

      <div className="pdf-divider" />

      {/* Tabla de ítems */}
      <div className="pdf-section">
        <div className="pdf-section-title">DETALLE</div>
        <table className="pdf-table">
          <thead>
            <tr>
              <th className="col-desc">Descripción</th>
              <th className="col-qty">Cant.</th>
              <th className="col-price">Precio Unit. (neto)</th>
              <th className="col-total">Total (neto)</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => {
              const c = calcs[item.id];
              return (
                <tr key={item.id}>
                  <td className="col-desc">{item.nombre}</td>
                  <td className="col-qty">{item.cantidad}</td>
                  <td className="col-price">{fmt(c.precioVenta)}</td>
                  <td className="col-total">{fmt(c.precioVenta * item.cantidad)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Totales */}
      <div className="pdf-totales">
        <div className="pdf-totales-inner">
          <div className="pdf-total-row"><span>Subtotal neto</span><span>{fmt(neto)}</span></div>
          <div className="pdf-total-row"><span>IVA (19%)</span><span>{fmt(iva)}</span></div>
          <div className="pdf-total-row grand"><span>TOTAL</span><span>{fmt(totales.venta)}</span></div>
        </div>
      </div>

      {/* Notas */}
      {cot.notas && (
        <div className="pdf-notas">
          <div className="pdf-section-title">NOTAS</div>
          <p>{cot.notas}</p>
        </div>
      )}

      {/* Footer legal */}
      <div className="pdf-footer">
        <p>Los precios incluyen IVA (19%). Esta cotización tiene validez de 30 días desde su emisión.</p>
        <p className="pdf-footer-privacy">Los datos personales del cliente son utilizados exclusivamente para generar esta cotización y no son almacenados en ninguna base de datos, en cumplimiento con la Ley N° 19.628 sobre Protección de la Vida Privada y sus modificaciones vigentes.</p>
      </div>
    </div>
  );
}
