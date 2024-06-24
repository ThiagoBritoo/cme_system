import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MaterialStageHistory({ materialId }) {
  const [stageHistory, setStageHistory] = useState([]);

  useEffect(() => {
    fetchStageHistory();
  }, []);

  const fetchStageHistory = () => {
    axios.get(`http://localhost:8000/api/stage-history/?material=${materialId}`)
      .then(response => {
        setStageHistory(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar histórico de estágios!', error);
      });
  };

  return (
    <div>
      <h3>Histórico de Estágios</h3>
      <ul>
        {stageHistory.map(history => (
          <li key={history.id}>
            {history.stage_name} em {new Date(history.timestamp).toLocaleString('pt-BR')}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MaterialStageHistory;