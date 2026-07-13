import { TASAS_ML } from "./constantes";

// maestro (impresora/filamento/tarifa) y comisionCfg (comisión ML) son
// globales a toda la cotización; v trae solo lo que varía por pieza.
export function calcItem(v, maestro, comisionCfg) {
  const costoFilG = maestro.precioRollo / maestro.pesoRollo;
  const costoFilamento = costoFilG * v.pesoFilamento;
  const horasTotal = v.horasImpresion + v.minutosImpresion / 60;
  const kwh = (maestro.wattsPromedio * horasTotal) / 1000;
  const costoElectricidad = kwh * maestro.tarifaKwh;
  const costoTrabajo = v.incluirTrabajo ? v.tuTiempoHoras * v.valorHoraTrabajo : 0;
  const costoOtros = v.incluirOtros ? v.costoOtros : 0;
  const subtotal = costoFilamento + costoElectricidad + costoTrabajo + costoOtros;
  const costoFallas = subtotal * (maestro.porcentajeFallas / 100);
  const costoUnitario = subtotal + costoFallas;
  const precioVenta = costoUnitario * (v.margenGanancia / 100);
  const ganancia = precioVenta - costoUnitario;
  const iva = precioVenta * 0.19;
  const precioConIva = precioVenta + iva;
  const tasaML = comisionCfg.incluir ? (TASAS_ML[comisionCfg.tipo] || 0) : 0;
  const montoComisionML = precioConIva * tasaML;
  const gananciaNeta = ganancia - montoComisionML;
  return {
    costoFilamento, costoElectricidad, costoTrabajo, costoOtros,
    costoFallas, costoUnitario, precioVenta, ganancia, iva,
    precioConIva, montoComisionML, gananciaNeta, tasaML,
    costoFilG, kwh, horasTotal,
    totalCosto: costoUnitario * v.cantidad,
    totalVenta: precioConIva * v.cantidad,
    totalGanancia: gananciaNeta * v.cantidad,
  };
}
