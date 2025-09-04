import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Upload } from './pages/Upload';
import { DataCleaning } from './pages/DataCleaning';
import { DataMerging } from './pages/DataMerging';
import { AIInsights } from './pages/AIInsights';
import { Charts } from './pages/Charts';
import { Export } from './pages/Export';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="upload" element={<Upload />} />
          <Route path="cleaning" element={<DataCleaning />} />
          <Route path="merging" element={<DataMerging />} />
          <Route path="insights" element={<AIInsights />} />
          <Route path="charts" element={<Charts />} />
          <Route path="export" element={<Export />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;