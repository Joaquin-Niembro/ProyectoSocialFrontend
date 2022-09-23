import React, { createContext, useState } from "react";
export const AuthContext = createContext();

function AuthContextProvider({ children }) {
  const [auth, setAuth] = useState(null);
  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContextProvider };
