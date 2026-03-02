import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Problems from "./pages/Problems";
import Study from "./pages/Study";

export default function RoutesApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/projetos" element={<Projects />} />
        <Route path="/problemas" element={<Problems />} />
        <Route path="/estudos" element={<Study />} />
      </Routes>
    </BrowserRouter>
  );
}
