import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SterilizationStageList() {
  const [stages, setStages] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/sterilization-stages/')
      .then(response => {
        setStages(response.data);
      })
      .catch(error => {
        console.error('Houve um erro ao buscar os estágios de esterilização!', error);
      });
  }, []);

  return (
    <div>
      <h2>Estágios de Esterilização</h2>
      <ul>
        {stages.map(stage => (
          <li key={stage.id}>{stage.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default SterilizationStageList;