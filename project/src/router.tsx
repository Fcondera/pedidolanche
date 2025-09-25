import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import HelpPage from "./components/HelpPage";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/ajuda" element={<HelpPage />} />
      </Routes>
    </BrowserRouter>
  );
}
