import React, { createContext, useContext, useState } from 'react';

// 1. Creamos el Contexto
const AuthContext = createContext();

// 2. Creamos el Proveedor (AuthProvider)
// Este envolverá tu App.js
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // 'null' significa que no ha iniciado sesión

  // Función para simular un inicio de sesión
  const login = () => {
    // Aquí iría tu lógica real de API
    // Por ahora, solo creamos un usuario falso para que funcione
    console.log("Simulando inicio de sesión...");
    setUser({ username: 'karen143004', email: 'tu@email.com' });
  };

  // Función para cerrar sesión
  const logout = () => {
    console.log("Cerrando sesión...");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Creamos el Hook (useAuth)
// Esto es lo que usarán tus pantallas para acceder a `user`, `login`, o `logout`
export const useAuth = () => {
  return useContext(AuthContext);
};
