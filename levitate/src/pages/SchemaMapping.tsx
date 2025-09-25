// levitate/src/pages/SchemaMapping.tsx
import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const SchemaMapping: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Schema Mapping & Standardization</h1>
        <p className="text-gray-600 mt-2">
          Map and standardize columns across your datasets.
        </p>
      </div>
      <Card title="AI-Powered Column Matching">
        <p className="text-gray-600">Coming soon: AI-powered suggestions to map columns like 'cust_name' to 'fullName'.</p>
      </Card>
    </div>
  );
};