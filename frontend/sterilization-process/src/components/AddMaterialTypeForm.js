import React, { useState } from 'react';
import axios from 'axios';

function AddMaterialTypeForm({ onAdd }) {
  const [name, setName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/material-types/', {
      name: name,
    })
    .then(response => {
      setSuccessMessage('Tipo de material adicionado com sucesso!');
      onAdd(response.data);  
    })
    .catch(error => {
      console.error('Houve um erro ao adicionar o tipo de material!', error);
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h3>Adicionar Tipo de Material</h3>
        <div>
          <label>Nome:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <button type="submit">Adicionar</button>
      </form>
      {successMessage && <p>{successMessage}</p>}
    </div>
  );
}

export default AddMaterialTypeForm;