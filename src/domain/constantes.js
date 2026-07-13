export const IMPRESORAS = [
  { id: "bambu_a1_mini",   nombre: "Bambu Lab A1 Mini",      watts: 150, precio: 280000 },
  { id: "bambu_a1",        nombre: "Bambu Lab A1",           watts: 215, precio: 420000 },
  { id: "bambu_p1s",       nombre: "Bambu Lab P1S",          watts: 300, precio: 750000 },
  { id: "bambu_x1c",       nombre: "Bambu Lab X1C",          watts: 350, precio: 980000 },
  { id: "prusa_mk4s",      nombre: "Prusa MK4S",             watts: 100, precio: 600000 },
  { id: "prusa_mini",      nombre: "Prusa MINI+",            watts: 75,  precio: 380000 },
  { id: "ender3_v3_se",    nombre: "Creality Ender 3 V3 SE", watts: 140, precio: 150000 },
  { id: "creality_k1",     nombre: "Creality K1",            watts: 300, precio: 380000 },
  { id: "creality_k1_max", nombre: "Creality K1 Max",        watts: 425, precio: 520000 },
  { id: "flashforge_ad5x", nombre: "FlashForge AD5X",        watts: 260, precio: 450000 },
  { id: "anycubic_kobra",  nombre: "Anycubic Kobra S1",      watts: 185, precio: 300000 },
  { id: "elegoo_centauri", nombre: "Elegoo Centauri Carbon", watts: 200, precio: 350000 },
  { id: "custom",          nombre: "Personalizada",          watts: null, precio: null  },
];

export const TASAS_ML = { gratuita: 0, clasica: 0.1199, premium: 0.1599 };

// Dato maestro: impresora, filamento y % de fallas se eligen una vez para toda la cotización.
export const DEFAULT_MAESTRO = {
  impresora: "bambu_a1_mini",
  wattsPromedio: 150,
  precioRollo: 12000,
  pesoRollo: 1000,
  tarifaKwh: 241,
  porcentajeFallas: 15,
};

// Comisión de MercadoLibre: control único para toda la cotización.
export const DEFAULT_COMISION_ML = { incluir: true, tipo: "clasica" };

export const TIPOS_COMISION_ML = [
  { key: "gratuita", label: "Gratuita", tasa: "0%",     desc: "Sin costo" },
  { key: "clasica",  label: "Clásica",  tasa: "11.99%", desc: "La más usada" },
  { key: "premium",  label: "Premium",  tasa: "15.99%", desc: "Mayor exposición" },
];

export const DEFAULT_COT = {
  // Emisor
  emisorNombre: "", emisorRut: "", emisorDireccion: "", emisorTelefono: "", emisorEmail: "",
  // Cliente
  clienteNombre: "", clienteRut: "", clienteEmpresa: "", clienteEmail: "",
  // Cotización
  numeroCot: "001", fechaVigencia: "",
  notas: "",
  // Logo
  logoUrl: "",
  // Consentimiento
  consentimiento: false,
};
