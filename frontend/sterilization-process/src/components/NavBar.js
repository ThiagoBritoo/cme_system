import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav>
      <ul>
        <li><Link to="/">Materiais</Link></li>
        <li><Link to="/material-types">Tipos de Materiais</Link></li>
        <li><Link to="/sterilization-stages">Estágios de Esterilização</Link></li>
        <li><Link to="/failures">Falhas</Link></li>
        <li><Link to="/completed">Concluídos</Link></li>
      </ul>
    </nav>
  );
}

export default NavBar;