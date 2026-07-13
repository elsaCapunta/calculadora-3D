# Cotizador 3D

Calculadora de costos y generador de cotizaciones para impresión 3D. Corre 100% en el navegador: no hay backend ni base de datos, nada se guarda entre sesiones.

## Cómo correrlo

```bash
npm install
npm run dev
```

## Paso a paso de uso

### 1. Configura tu impresora y filamento (una sola vez)

Arriba de todo está el panel **⚙️ Impresora, filamento y fallas**. Esto se define **una sola vez por cotización** y aplica a todas las piezas que agregues:

- **Impresora**: elige tu modelo de la lista (o "Personalizada"). Al elegir un modelo se precarga el consumo en watts, que puedes afinar a mano.
- **Filamento**: precio y peso del rollo que estás usando.
- **Tarifa eléctrica**: costo por kWh.
- **Fallas**: % que agregas al costo para cubrir impresiones que fallan.

### 2. Agrega una pieza

Con **+ Agregar ítem** creas una pieza nueva (se abre sola, las demás se colapsan para no perderte). Por ítem completas:

- **Cantidad**: unidades de esa pieza.
- **Filamento**: gramos que pesa la pieza (Bambu Studio te lo dice como "Estimated total weight").
- **Electricidad**: horas y minutos que tarda en imprimirse.
- **Tu Tiempo** *(opcional)*: si le sumas horas de trabajo manual (lijar, pintar, armar), a qué valor hora.
- **Otros** *(opcional, apagado por defecto)*: costo de accesorios como llaveros o clickers que a veces se agregan a una pieza puntual.

### 3. Elige cómo fijar el precio

Cada pieza tiene 3 formas de definir el precio de venta (puedes cambiar entre ellas libremente):

| Modo | Cómo funciona |
|---|---|
| **Margen %** | Mueves un slider (110%–500%) y el precio sale de multiplicar el costo por ese margen. |
| **Precio final** | Escribes el precio al que quieres vender (con IVA) y el sistema te dice qué margen y ganancia neta te queda. |
| **Utilidad $** | Escribes cuánto quieres ganar por unidad y el sistema arma el precio final sumando costo + esa ganancia. |

Debajo de cada pieza ves el resultado: costo unitario, precio sin IVA, precio con IVA, total según cantidad, y ganancia neta.

### 4. Agrega todas las piezas que necesites

Repite el paso 2 por cada pieza distinta de la cotización. Los datos del último ítem (valor hora, margen, modo de precio, costo de "Otros") se copian al agregar uno nuevo, para no reescribir todo de cero.

### 5. Revisa el Resumen del pedido

Al final de la lista de ítems:

- **Comisión MercadoLibre**: un solo control para toda la cotización (incluir o no, y a qué tasa: Gratuita, Clásica o Premium).
- **Totales**: costo total, venta total (con IVA) y ganancia neta de toda la cotización.
- **Desglose**: cuánto de ese costo total es electricidad, fallas, "Otros" y comisión ML descontada — para entender de qué está compuesto el precio final.

### 6. Genera la cotización

Ve a la pestaña **📄 Cotización**:

1. Sube tu logo (opcional).
2. Completa tus datos (emisor) y los del cliente. Nombre y email del emisor, y nombre del cliente, son obligatorios.
3. Completa el número de cotización (se autogenera), fecha de validez y notas adicionales si quieres.
4. Acepta el checkbox de protección de datos (obligatorio para continuar).
5. Haz clic en **Ver previsualización →** para ver cómo queda el documento final.
6. Haz clic en **⬇ Descargar PDF** para bajar el archivo directamente, sin diálogos del navegador.

## Notas

- Todo el cálculo y la generación del PDF ocurren en tu navegador. No se envía ni se guarda ningún dato en ningún servidor.
- Si recargas la página, se pierde todo lo cargado (no hay persistencia). Guarda el PDF antes de cerrar la pestaña.

## Arquitectura del código

El código sigue **Atomic Design** dentro de `src/`:

```
domain/       lógica de cálculo y datos, sin React (calculo.js, constantes.js, item.js, formato.js)
hooks/        lógica de estado reusable (useDraftValue, usePdfDownload)
components/
  atoms/      piezas mínimas de UI (inputs, botones, chips)
  molecules/  combinaciones simples (secciones, switches, tabs)
  organisms/  bloques de dominio completos (panel maestro, editor de ítem, resumen, cotización)
  templates/  layout compartido (header + tabs)
pages/        la página, dueña de todo el estado (CalculadoraPage)
```
