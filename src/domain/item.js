let nextId = 1;

export const newItem = (overrides = {}) => ({
  id: nextId++,
  nombre: "Pieza sin nombre",
  cantidad: 1,
  pesoFilamento: 25,
  horasImpresion: 3, minutosImpresion: 30,
  tuTiempoHoras: 0.5, valorHoraTrabajo: 5000,
  margenGanancia: 200, modoPrecio: "margen",
  incluirTrabajo: true,
  incluirOtros: false, costoOtros: 0,
  ...overrides,
});

export const nCot = () => `COT-${String(nextId).padStart(4, "0")}-${new Date().getFullYear()}`;
