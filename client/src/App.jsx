import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Templates from "./pages/Templates";
import Navbar from "./components/Navbar";
import AnimatedBackground from "./components/AnimatedBackground";
import DashboardLayout from "./components/DashboardLayout";

function App() {
  return (
    <Router>
      <AnimatedBackground />
      <Routes>
        <Route path="/" element={
          <div className="flex flex-col min-h-screen">
             <Navbar />
             <Home />
          </div>
        } />
        <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
        <Route path="/history" element={<DashboardLayout><History /></DashboardLayout>} />
        <Route path="/templates" element={<DashboardLayout><Templates /></DashboardLayout>} />
      </Routes>
    </Router>
  );
}

export default App;