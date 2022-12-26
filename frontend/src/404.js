//Libraries & Components
import React, { useEffect } from 'react';

export default function Error404({setLoading}){
  useEffect( () => {
    setLoading(false);
  }, [setLoading]);

  return (
    <div>
      <h1>Error 404</h1>
      <p>No se encontró la ruta especificada</p>
    </div>
  );
}