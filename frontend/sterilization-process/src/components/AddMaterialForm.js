import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AddMaterialForm({ onAdd }) {
  const [name, setName] = useState('');
  const [materialType, setMaterialType] = useState('');
  const [materialTypes, setMaterialTypes] = useState([]);

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
    axios.post('http://localhost:8000/api/materials/', {
      name: name,
      material_type: materialType
    })
    .then(response => {
      onAdd(response.data);
      setName('');
      setMaterialType('');
    })
    .catch(error => {
      console.error('Erro ao adicionar o material!', error);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Adicionar Material</h3>
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
          value={materialType} 
          onChange={(e) => setMaterialType(e.target.value)} 
          required
        >
          <option value="">Selecione um tipo</option>
          {materialTypes.map(type => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </select>
      </div>
      <button type="submit">Adicionar</button>
    </form>
  );
}

export default AddMaterialForm;