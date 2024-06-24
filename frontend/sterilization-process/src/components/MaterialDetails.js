import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function MaterialDetails() {
  const { id } = useParams();
  const [material, setMaterial] = useState(null);
  const [stages, setStages] = useState([]);
  const [materialType, setMaterialType] = useState('');

  const fetchMaterial = useCallback(() => {
    axios.get(`http://localhost:8000/api/materials/${id}/`)
      .then(response => {
        setMaterial(response.data);
        fetchMaterialType(response.data.material_type);
      })
      .catch(error => {
        console.error('Erro ao buscar material!', error);
      });
  }, [id]);

  const fetchStages = useCallback(() => {
    axios.get('http://localhost:8000/api/sterilization-stages/')
      .then(response => {
        setStages(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar estágios de esterilização!', error);
      });
  }, []);

  const fetchMaterialType = (typeId) => {
    axios.get(`http://localhost:8000/api/material-types/${typeId}/`)
      .then(response => {
        setMaterialType(response.data.name);
      })
      .catch(error => {
        console.error('Erro ao buscar tipo de material!', error);
      });
  };

  useEffect(() => {
    fetchMaterial();
    fetchStages();
  }, [fetchMaterial, fetchStages]);

  const getPassedStages = () => {
    if (!material || !stages.length) return [];

    const currentStageIndex = stages.findIndex(stage => stage.id === material.current_stage);
    return stages.slice(0, currentStageIndex);
  };

  const passedStages = getPassedStages();

  return (
    <div className="material-details">
      {material && (
        <div className="material-details-card">
          <h2>{material.name}</h2>
          <p>Tipo: {materialType}</p>
          <p>Processo Atual: {stages.find(stage => stage.id === material.current_stage)?.name}</p>
          <p>Iniciado em: {new Date(material.timestamp).toLocaleString('pt-BR')}</p>
          
          <h3>Histórico de Processos</h3>
          <ul>
            {passedStages.map(stage => (
              <li key={stage.id}>{stage.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default MaterialDetails;