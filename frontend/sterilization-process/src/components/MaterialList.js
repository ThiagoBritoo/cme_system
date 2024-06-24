import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AddMaterialForm from './AddMaterialForm';
import AddFailureForm from './AddFailureForm';

function MaterialList() {
  const [materials, setMaterials] = useState([]);
  const [materialTypes, setMaterialTypes] = useState([]);
  const [stages, setStages] = useState([]);
  const [failures, setFailures] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchMaterials = useCallback(() => {
    axios.get('http://localhost:8000/api/materials/')
      .then(response => {
        setMaterials(response.data);
        setIsLoaded(true);
      })
      .catch(error => {
        console.error('Houve um erro ao buscar os materiais!', error);
      });
  }, []);

  useEffect(() => {
    fetchMaterialTypes();
    fetchStages();
    fetchFailures();
  }, []);

  const fetchMaterialTypes = () => {
    axios.get('http://localhost:8000/api/material-types/')
      .then(response => {
        setMaterialTypes(response.data);
      })
      .catch(error => {
        console.error('Houve um erro ao buscar os tipos de material!', error);
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

  const fetchFailures = () => {
    axios.get('http://localhost:8000/api/failures/')
      .then(response => {
        setFailures(response.data);
        fetchMaterials(); // Buscar materiais após falhas
      })
      .catch(error => {
        console.error('Houve um erro ao buscar as falhas!', error);
      });
  };

  const handleAddMaterial = (newMaterial) => {
    setMaterials([...materials, newMaterial]);
  };

  const handleAdvanceStage = (id) => {
    axios.post(`http://localhost:8000/api/materials/${id}/advance_stage/`)
      .then(() => {
        fetchFailures(); // Recarregar falhas e materiais
      })
      .catch(error => {
        console.error('Houve um erro ao avançar o estágio do material!', error);
      });
  };

  const handleAddFailure = (newFailure) => {
    setFailures([...failures, newFailure]);
    fetchFailures(); // Atualiza a lista de falhas e materiais
  };

  const getMaterialTypeName = (typeId) => {
    const type = materialTypes.find(t => t.id === typeId);
    return type ? type.name : 'Desconhecido';
  };

  const getStageName = (stageId) => {
    const stage = stages.find(s => s.id === stageId);
    return stage ? stage.name : 'Desconhecido';
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString('pt-BR');
    const formattedTime = date.toLocaleTimeString('pt-BR', { hour12: false });
    return `${formattedTime} ${formattedDate}`;
  };

  const filteredMaterials = materials.filter(material => 
    material.current_stage !== 5 && !failures.some(failure => failure.material === material.id)
  );

  if (!isLoaded) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <AddMaterialForm onAdd={handleAddMaterial} />
      <div className="material-grid">
        {filteredMaterials.map(material => (
          <div key={material.id} className="material-card">
            <Link to={`/material/${material.id}`}><h3>{material.name}</h3></Link>
            <p>Tipo: {getMaterialTypeName(material.material_type)}</p>
            <p>Processo Atual: {getStageName(material.current_stage)}</p>
            <p>
              {material.current_stage === 5 ? (
                `Concluído em: ${formatTimestamp(material.timestamp, true)}`
              ) : (
                `Iniciado em: ${formatTimestamp(material.timestamp, false)}`
              )}
            </p>
            {material.current_stage !== 5 && (
              <div className="button-group">
                <button className="advance-stage" onClick={() => handleAdvanceStage(material.id)}>Avançar Processo</button>
                <AddFailureForm
                  materialId={material.id}
                  stageId={material.current_stage}
                  onAdd={handleAddFailure}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MaterialList;