import { useState, useRef } from "react";
import { usePdfDownload } from "../../../hooks/usePdfDownload";
import { TextField } from "../../atoms/TextField/TextField";
import { CotizacionPreview } from "../CotizacionPreview/CotizacionPreview";
import "./TabCotizacion.css";

export function TabCotizacion({ cot, setCot, items, calcs, totales }) {
  const logoRef = useRef();
  const previewRef = useRef();
  const [vista, setVista] = useState("form"); // "form" | "preview"
  const [errores, setErrores] = useState({});

  const { descargando, errorPdf, handleDownloadPdf } = usePdfDownload(
    previewRef,
    `Cotizacion-${cot.numeroCot || "001"}.pdf`
  );

  const upd = (key) => (val) => setCot(prev => ({ ...prev, [key]: val }));

  const handleLogo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => upd("logoUrl")(ev.target.result);
    reader.readAsDataURL(file);
  };

  const validar = () => {
    const e = {};
    if (!cot.emisorNombre.trim()) e.emisorNombre = "Requerido";
    if (!cot.emisorEmail.trim())  e.emisorEmail  = "Requerido";
    if (!cot.clienteNombre.trim()) e.clienteNombre = "Requerido";
    if (!cot.consentimiento) e.consentimiento = "Debes aceptar el consentimiento";
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handlePreview = () => {
    if (validar()) setVista("preview");
  };

  const sinItems = items.length === 0;

  if (vista === "preview") {
    return (
      <div>
        <div className="cot-toolbar no-print">
          <button className="cot-back-btn" onClick={() => setVista("form")}>← Volver al formulario</button>
          <button className="cot-print-btn" onClick={handleDownloadPdf} disabled={descargando}>
            {descargando ? "Generando…" : "⬇ Descargar PDF"}
          </button>
        </div>
        {errorPdf && <p className="field-error no-print">{errorPdf}</p>}
        <div ref={previewRef}>
          <CotizacionPreview cot={cot} items={items} calcs={calcs} totales={totales} />
        </div>
      </div>
    );
  }

  return (
    <div className="cot-form">
      {sinItems && (
        <div className="cot-warning">
          ⚠️ Aún no tienes ítems en la calculadora. Ve al tab <strong>Calculadora</strong> y agrega al menos una pieza antes de generar la cotización.
        </div>
      )}

      {/* Logo */}
      <div className="cot-section">
        <div className="cot-section-title">🖼 Logo (opcional)</div>
        <div className="logo-upload-area" onClick={() => logoRef.current.click()}>
          {cot.logoUrl
            ? <img src={cot.logoUrl} alt="Logo" className="logo-preview-img" />
            : <div className="logo-upload-placeholder">
                <span className="logo-upload-icon">↑</span>
                <span>Haz clic para subir tu logo</span>
                <span className="logo-upload-hint">PNG, JPG — máx 2MB</span>
              </div>
          }
        </div>
        <input ref={logoRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleLogo} />
        {cot.logoUrl && (
          <button className="logo-remove-btn" onClick={() => upd("logoUrl")("")}>✕ Quitar logo</button>
        )}
      </div>

      {/* Datos emisor */}
      <div className="cot-section">
        <div className="cot-section-title">👤 Tus datos (emisor)</div>
        <div className="cot-grid">
          <div>
            <TextField label="Nombre / Empresa *" value={cot.emisorNombre} onChange={upd("emisorNombre")} placeholder="Tu nombre o razón social" />
            {errores.emisorNombre && <p className="field-error">{errores.emisorNombre}</p>}
          </div>
          <TextField label="RUT" value={cot.emisorRut} onChange={upd("emisorRut")} placeholder="12.345.678-9" />
          <div>
            <TextField label="Email *" value={cot.emisorEmail} onChange={upd("emisorEmail")} type="email" placeholder="tu@email.com" />
            {errores.emisorEmail && <p className="field-error">{errores.emisorEmail}</p>}
          </div>
          <TextField label="Teléfono" value={cot.emisorTelefono} onChange={upd("emisorTelefono")} placeholder="+56 9 1234 5678" />
          <div style={{ gridColumn: "1 / -1" }}>
            <TextField label="Dirección" value={cot.emisorDireccion} onChange={upd("emisorDireccion")} placeholder="Tu dirección" />
          </div>
        </div>
      </div>

      {/* Datos cliente */}
      <div className="cot-section">
        <div className="cot-section-title">🏢 Datos del cliente</div>
        <div className="cot-grid">
          <div>
            <TextField label="Nombre del cliente *" value={cot.clienteNombre} onChange={upd("clienteNombre")} placeholder="Nombre completo" />
            {errores.clienteNombre && <p className="field-error">{errores.clienteNombre}</p>}
          </div>
          <TextField label="Empresa" value={cot.clienteEmpresa} onChange={upd("clienteEmpresa")} placeholder="Nombre empresa (opcional)" />
          <TextField label="RUT" value={cot.clienteRut} onChange={upd("clienteRut")} placeholder="12.345.678-9" />
          <TextField label="Email" value={cot.clienteEmail} onChange={upd("clienteEmail")} type="email" placeholder="cliente@email.com" />
        </div>
      </div>

      {/* Datos cotización */}
      <div className="cot-section">
        <div className="cot-section-title">📋 Datos de la cotización</div>
        <div className="cot-grid">
          <TextField label="N° Cotización" value={cot.numeroCot} onChange={upd("numeroCot")} placeholder="001" />
          <TextField label="Válida hasta" value={cot.fechaVigencia} onChange={upd("fechaVigencia")} type="date" />
          <div style={{ gridColumn: "1 / -1" }}>
            <div className="input-group">
              <div className="input-label-row"><label>Notas adicionales</label></div>
              <textarea
                className="text-input textarea"
                value={cot.notas}
                onChange={e => upd("notas")(e.target.value)}
                placeholder="Ej: Tiempo de entrega estimado, condiciones de pago, etc."
                rows={3}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Consentimiento */}
      <div className="cot-section">
        <div className="cot-consent-box">
          <div className="cot-consent-icon">🔒</div>
          <div className="cot-consent-text">
            <div className="cot-consent-title">Protección de datos personales</div>
            <p>Los datos ingresados en este formulario son utilizados <strong>únicamente</strong> para generar la cotización. <strong>No se almacenan en ninguna base de datos</strong> ni se transmiten a servidores externos. Todo el procesamiento ocurre localmente en tu navegador, en cumplimiento con la <strong>Ley N° 19.628</strong> sobre Protección de la Vida Privada y las modificaciones establecidas por la <strong>Ley N° 21.719</strong> (nueva Ley de Datos Personales de Chile, vigente desde 2026).</p>
            <label className={`cot-consent-check ${errores.consentimiento ? "error" : ""}`}>
              <input
                type="checkbox"
                checked={cot.consentimiento}
                onChange={e => {
                  upd("consentimiento")(e.target.checked);
                  if (e.target.checked) setErrores(prev => ({ ...prev, consentimiento: undefined }));
                }}
              />
              <span>Entiendo y acepto que los datos ingresados son procesados solo en mi navegador y no se almacenan en ninguna base de datos.</span>
            </label>
            {errores.consentimiento && <p className="field-error">{errores.consentimiento}</p>}
          </div>
        </div>
      </div>

      <button
        className={`cot-preview-btn ${sinItems ? "disabled" : ""}`}
        onClick={handlePreview}
        disabled={sinItems}
      >
        Ver previsualización →
      </button>
    </div>
  );
}
