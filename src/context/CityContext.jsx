import React, { createContext, useState } from 'react';

export const CityContext = createContext();

export const CityProvider = ({ children }) => {
  const [selectedCityId, setSelectedCityId] = useState(null);

  return (
    <CityContext.Provider value={{ selectedCityId, setSelectedCityId }}>
      {children}
    </CityContext.Provider>
  );
};
