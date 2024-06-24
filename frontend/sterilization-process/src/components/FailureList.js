import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function FailureList() {
  const [failures, setFailures] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [stages, setStages] = useState([]);

  useEffect(() => {
    fetchFailures();
    fetchMaterials();
    fetchStages();
  }, []);

  const fetchFailures = () => {
    axios.get('http://localhost:8000/api/failures/')
      .then(response => {
        setFailures(response.data);
      })
      .catch(error => {
        console.error('Houve um erro ao buscar as falhas!', error);
      });
  };

  const fetchMaterials = () => {
    axios.get('http://localhost:8000/api/materials/')
      .then(response => {
        setMaterials(response.data);
      })
      .catch(error => {
        console.error('Houve um erro ao buscar os materiais!', error);
      });
  };

  const fetchStages = () => {
    axios.get('http://localhost:8000/api/sterilization-stages/')
      .then(response => {
        setStages(response.data);
      })
      .catch(error => {
        console.error('Houve um erro ao buscar os estágios de esterilização!', error);
      });
  };

  const getMaterialName = (materialId) => {
    const material = materials.find(m => m.id === materialId);
    return material ? material.name : 'Desconhecido';
  };

  const getStageName = (stageId) => {
    const stage = stages.find(s => s.id === stageId);
    return stage ? stage.name : 'Desconhecido';
  };

  return (
    <div>
      <h2>Falhas</h2>
      <div className="material-grid">
        {failures.map(failure => (
          <div key={failure.id} className="material-card">
            <h3>
              <Link to={`/material/${failure.material}`} className="link">
                {getMaterialName(failure.material)}
              </Link>
            </h3>
            <p>Processo: {getStageName(failure.stage)}</p>
            <p>Descrição: {failure.description}</p>
            <p>Ocorreu em: {new Date(failure.timestamp).toLocaleString('pt-BR')}</p>
          </div>
        ))}
      </div>
      <button className="report-button">
        <a href="/relatorio/falhas/" style={{ textDecoration: 'none', color: 'white' }}>Gerar Relatório Excel</a>
      </button>
    </div>
  );
}

export default FailureList;