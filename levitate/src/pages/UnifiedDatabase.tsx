// levitate/src/pages/UnifiedDatabase.tsx
import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const UnifiedDatabase: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Unified Database Design</h1>
        <p className="text-gray-600 mt-2">
          Create a unified view of your data.
        </p>
      </div>
      <Card title="Common Schema Generation">
        <p className="text-gray-600">Coming soon: Generate a common schema and export your unified database.</p>
      </Card>
    </div>
  );
};