import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Swagger from "./pages/Swagger";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="swagger" element={<Swagger />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
