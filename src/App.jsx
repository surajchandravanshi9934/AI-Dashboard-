import { Routes, Route } from "react-router-dom";
import HeroSection from "./pages/hero";
import Dashboard from "./pages/dashboard";


function App() {
  return (
    <Routes>
      <Route path="/" element={<HeroSection />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
