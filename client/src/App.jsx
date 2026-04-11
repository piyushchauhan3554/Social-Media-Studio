import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Templates from "./pages/Templates";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Settings from "./pages/Settings";
import Navbar from "./components/Navbar";
import AnimatedBackground from "./components/AnimatedBackground";
import DashboardLayout from "./components/DashboardLayout";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null; // Or a loader spinner
  if (!user) return <Navigate to="/login" />;
  
  return <DashboardLayout>{children}</DashboardLayout>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AnimatedBackground />
        <Routes>
          <Route path="/" element={
            <div className="flex flex-col min-h-screen">
               <Navbar />
               <Home />
            </div>
          } />
          
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;