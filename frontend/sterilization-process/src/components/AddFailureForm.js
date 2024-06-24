import React, { useState } from 'react';
import axios from 'axios';

function AddFailureForm({ materialId, stageId, onAdd }) {
  const [showForm, setShowForm] = useState(false);
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/failures/', {
      material: materialId,
      stage: stageId,
      description: description
    })
    .then(response => {
      onAdd(response.data);
      setDescription('');
      setShowForm(false); // Ocultar o formulário após adicionar
    })
    .catch(error => {
      console.error('Houve um erro ao adicionar a falha!', error);
    });
  };

  return (
    <div>
      <button className="report-failure" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancelar' : 'Reportar Falha'}
      </button>
      {showForm && (
        <form className="add-failure-form" onSubmit={handleSubmit}>
          <h3>Adicionar Falha</h3>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrição da falha"
            required
          />
          <button type="submit">Reportar</button>
        </form>
      )}
    </div>
  );
}

export default AddFailureForm;