import { useState, useRef, useEffect } from "react";

// Texto "en borrador" para inputs numéricos controlados por un valor derivado:
// el valor mostrado no puede estar atado directo a `value` mientras se escribe,
// porque cualquier recálculo (redondeos, formato) pisaría lo que el usuario
// está tecleando. Solo se resincroniza con `value` cuando el input no tiene
// el foco (cambios externos, o al salir del input).
export function useDraftValue(value, onCommit) {
  const [texto, setTexto] = useState(() => String(value));
  const focused = useRef(false);

  useEffect(() => {
    if (!focused.current) setTexto(String(value));
  }, [value]);

  return {
    value: texto,
    onFocus: () => { focused.current = true; },
    onBlur: () => {
      focused.current = false;
      setTexto(String(value));
    },
    onChange: (e) => {
      setTexto(e.target.value);
      const n = Number(e.target.value);
      if (!Number.isNaN(n)) onCommit(n);
    },
  };
}
