
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PrestationsData {
  fraisAssurance: number;
  fraisDossier: number;
  fraisTimbre: number;
}

interface PrestationsManagerProps {
  prestations: PrestationsData;
  onPrestationsChange: (prestations: PrestationsData) => void;
}

const PrestationsManager = ({ prestations, onPrestationsChange }: PrestationsManagerProps) => {
  const totalFrais = prestations.fraisAssurance + prestations.fraisDossier + prestations.fraisTimbre;

  const handleChange = (field: keyof PrestationsData, value: number) => {
    onPrestationsChange({
      ...prestations,
      [field]: value
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prestations et frais</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="fraisAssurance">Frais d'assurance (XAF)</Label>
            <Input
              id="fraisAssurance"
              type="number"
              value={prestations.fraisAssurance}
              onChange={(e) => handleChange("fraisAssurance", parseFloat(e.target.value) || 0)}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="fraisDossier">Frais de dossier (XAF)</Label>
            <Input
              id="fraisDossier"
              type="number"
              value={prestations.fraisDossier}
              onChange={(e) => handleChange("fraisDossier", parseFloat(e.target.value) || 0)}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="fraisTimbre">Frais de timbre (XAF)</Label>
            <Input
              id="fraisTimbre"
              type="number"
              value={prestations.fraisTimbre}
              onChange={(e) => handleChange("fraisTimbre", parseFloat(e.target.value) || 0)}
              placeholder="0"
            />
          </div>
        </div>

        {/* Récapitulatif */}
        <div className="bg-blue-50 p-4 rounded">
          <div className="flex justify-between items-center">
            <span className="text-blue-800 font-medium">Récapitulatif des frais</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-blue-800">Total frais :</span>
            <span className="text-blue-800 font-bold">{totalFrais.toLocaleString()} FCFA</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrestationsManager;
