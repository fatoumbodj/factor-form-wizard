
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Index = () => {
  const [formData, setFormData] = useState({});

  // Données de test pour simuler vos critères
  const testCriteria = [
    {
      code: 'nom',
      description: 'Nom',
      type: 'text'
    },
    {
      code: 'age',
      description: 'Âge',
      type: 'select',
      referentialValues: [
        { value: '18-25', label: '18-25 ans' },
        { value: '26-35', label: '26-35 ans' },
        { value: '36-45', label: '36-45 ans' },
        { value: '46+', label: '46+ ans' }
      ]
    },
    {
      code: 'email',
      description: 'Email',
      type: 'text'
    }
  ];

  const handleInputChange = (code: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [code]: value
    }));
  };

  const renderField = (criteria: any) => {
    if (criteria.type === 'select' && criteria.referentialValues) {
      return (
        <div key={criteria.code} className="mb-4">
          <label className="block text-sm font-medium mb-2">
            {criteria.description}
          </label>
          <Select
            value={formData[criteria.code] || ""}
            onValueChange={(value) => handleInputChange(criteria.code, value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionnez une option" />
            </SelectTrigger>
            <SelectContent>
              {criteria.referentialValues.map((option: any) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    return (
      <div key={criteria.code} className="mb-4">
        <label className="block text-sm font-medium mb-2">
          {criteria.description}
        </label>
        <Input
          type="text"
          placeholder={`Saisissez ${criteria.description.toLowerCase()}`}
          value={formData[criteria.code] || ""}
          onChange={(e) => handleInputChange(criteria.code, e.target.value)}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Formulaire Dynamique</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              {testCriteria.map(criteria => renderField(criteria))}
            </form>
            
            {/* Affichage des données pour debug */}
            <div className="mt-6 p-4 bg-gray-100 rounded">
              <h3 className="font-medium mb-2">Données du formulaire :</h3>
              <pre className="text-sm">
                {JSON.stringify(formData, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
