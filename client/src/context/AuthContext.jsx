import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      // Setup default axios header for subsequent requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${parsedUser.token}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
    if (res.data) {
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
    }
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await axios.post("http://localhost:5000/api/auth/register", { name, email, password });
    if (res.data) {
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
    }
    return res.data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
  };

  const updateProfile = async (userData) => {
    // Basic update logic - usually hits /api/auth/me or similar
    // For now we just update local state if name changes
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
