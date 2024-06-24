import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function CompletedList() {
  const [materials, setMaterials] = useState([]);
  const [materialTypes, setMaterialTypes] = useState([]);

  useEffect(() => {
    fetchMaterials();
    fetchMaterialTypes();
  }, []);

  const fetchMaterials = () => {
    axios.get('http://localhost:8000/api/materials/')
      .then(response => {
        setMaterials(response.data.filter(material => material.current_stage === 5));
      })
      .catch(error => {
        console.error('Houve um erro ao buscar os materiais concluídos!', error);
      });
  };

  const fetchMaterialTypes = () => {
    axios.get('http://localhost:8000/api/material-types/')
      .then(response => {
        setMaterialTypes(response.data);
      })
      .catch(error => {
        console.error('Houve um erro ao buscar os tipos de material!', error);
      });
  };

  const getMaterialTypeName = (typeId) => {
    const type = materialTypes.find(t => t.id === typeId);
    return type ? type.name : 'Desconhecido';
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString('pt-BR');
    const formattedTime = date.toLocaleTimeString('pt-BR', { hour12: false });
    return `${formattedTime} ${formattedDate}`;
  };

  return (
    <div>
      <h2>Materiais Concluídos</h2>
      <button className="report-button">
        <a href="http://localhost:8000/relatorio/concluidos/" style={{ textDecoration: 'none', color: 'white' }}>Gerar Relatório PDF</a>
      </button>
      <div className="material-grid">
        {materials.map(material => (
          <div key={material.id} className="material-card">
            <h3>
              <Link to={`/material/${material.id}`} className="link">
                {material.name}
              </Link>
            </h3>
            <p>Tipo: {getMaterialTypeName(material.material_type)}</p>
            <p>Concluído em: {formatTimestamp(material.timestamp)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CompletedList;