import React, { createContext, useState } from "react";
export const LocationContext = createContext();

function LocationContextProvider({ children }) {
  const [path, setPath] = useState(null);
  return (
    <LocationContext.Provider value={[path, setPath]}>
      {children}
    </LocationContext.Provider>
  );
}

export { LocationContextProvider };
