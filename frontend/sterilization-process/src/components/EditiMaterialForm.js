import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EditMaterialForm({ material, onUpdate }) {
  const [name, setName] = useState(material.name);
  const [materialTypes, setMaterialTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(material.material_type);

  useEffect(() => {
    axios.get('http://localhost:8000/api/material-types/')
      .then(response => {
        setMaterialTypes(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar tipos de materiais!', error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:8000/api/materials/${material.id}/`, {
      name: name,
      material_type: selectedType,
      current_stage: material.current_stage,
      timestamp: material.timestamp
    })
    .then(response => {
      onUpdate(response.data);
    })
    .catch(error => {
      console.error('Erro ao atualizar o material!', error);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Editar Material</h2>
      <div>
        <label>Nome:</label>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
      </div>
      <div>
        <label>Tipo de Material:</label>
        <select 
          value={selectedType} 
          onChange={(e) => setSelectedType(e.target.value)} 
          required
        >
          {materialTypes.map(type => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </select>
      </div>
      <button type="submit">Atualizar</button>
    </form>
  );
}

export default EditMaterialForm;