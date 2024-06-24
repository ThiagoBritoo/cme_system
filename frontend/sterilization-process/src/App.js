import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import MaterialList from './components/MaterialList';
import MaterialTypeList from './components/MaterialTypeList';
import FailureList from './components/FailureList';
import CompletedList from './components/CompletedList';
import MaterialDetails from './components/MaterialDetails';

function App() {
  return (
    <Router>
      <div className="App">
        <header>
          <h1>Centro de Materiais e Esterilização</h1>
          <nav>
            <ul>
              <li><Link to="/">Materiais</Link></li>
              <li><Link to="/material-types">Tipos de Material</Link></li>
              <li><Link to="/failures">Falhas</Link></li>
              <li><Link to="/completed">Concluídos</Link></li>
            </ul>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<MaterialList />} />
          <Route path="/material-types" element={<MaterialTypeList />} />
          <Route path="/failures" element={<FailureList />} />
          <Route path="/completed" element={<CompletedList />} />
          <Route path="/material/:id" element={<MaterialDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;