import React from 'react';
import AddMaterialTypeForm from './AddMaterialTypeForm';

function MaterialTypeList() {
  const handleAddMaterialType = (newMaterialType) => {
    console.log('Novo tipo de material adicionado:', newMaterialType);
  };

  return (
    <div>
      <AddMaterialTypeForm onAdd={handleAddMaterialType} />
    </div>
  );
}

export default MaterialTypeList;