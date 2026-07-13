import { Analytics } from "@vercel/analytics/react";
import { CalculadoraPage } from "./pages/CalculadoraPage/CalculadoraPage";

export default function App() {
  return (
    <>
      <CalculadoraPage />
      <Analytics />
    </>
  );
}
