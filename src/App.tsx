import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Categorias from './components/Categorias';
import Productos from './components/Productos';
import { Menubar } from 'primereact/menubar';

const App: React.FC = () => {
  const items = [
    {
      label: 'Categorias',
      icon: 'pi pi-list',
      command: () => window.location.href = '/categorias'
    },
    {
      label: 'Productos',
      icon: 'pi pi-box',
      command: () => window.location.href = '/productos'
    }
  ];

  return (
    <Router>
      <div>
        <header style={{ padding: '1rem', textAlign: 'center', backgroundColor: '#f4f4f4' }}>
          <h1>Gestión de Productos y Categorías</h1>
        </header>
        
        <Menubar model={items} />
        
        <Routes>
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/productos" element={<Productos />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

