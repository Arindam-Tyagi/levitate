import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Upload } from './pages/Upload';
import { ConnectDatabase } from './pages/ConnectDatabase'; // 1. Import the new page
import { DataCleaning } from './pages/DataCleaning';
import { DataMerging } from './pages/DataMerging';
import { AIInsights } from './pages/AIInsights';
import { Charts } from './pages/Charts';
import { Export } from './pages/Export';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AuthProvider } from './hooks/useAuth';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="upload" element={<Upload />} />
              <Route path="connect-db" element={<ConnectDatabase />} /> {/* 2. Add the route */}
              <Route path="cleaning" element={<DataCleaning />} />
              <Route path="merging" element={<DataMerging />} />
              <Route path="insights" element={<AIInsights />} />
              <Route path="charts" element={<Charts />} />
              <Route path="export" element={<Export />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;