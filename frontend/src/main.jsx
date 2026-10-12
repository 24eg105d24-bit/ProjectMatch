import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// CSS imports: Bootstrap base followed by variables and custom theme styling
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/variables.css';
import './styles/custom.css';

import { AuthProvider } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ProjectProvider>
        <App />
      </ProjectProvider>
    </AuthProvider>
  </StrictMode>
);
