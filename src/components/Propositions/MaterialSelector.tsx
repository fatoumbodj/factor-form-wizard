
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Package, ExternalLink } from "lucide-react";
import { MaterialData } from "@/types/material";

interface MaterialSelectorProps {
  selectedMaterials: string[];
  onMaterialsChange: (materialIds: string[]) => void;
  onMaterialsDataChange: (materials: MaterialData[]) => void;
}

const MaterialSelector = ({ 
  selectedMaterials, 
  onMaterialsChange, 
  onMaterialsDataChange 
}: MaterialSelectorProps) => {
  const [availableMaterials, setAvailableMaterials] = useState<MaterialData[]>([]);

  // Simuler la récupération des matériels depuis la section Matériel
  useEffect(() => {
    // En réalité, ceci devrait venir d'un contexte global ou d'une API
    const storedMaterials = localStorage.getItem('materials');
    if (storedMaterials) {
      try {
        const materials = JSON.parse(storedMaterials);
        setAvailableMaterials(materials);
      } catch (error) {
        console.error('Error parsing stored materials:', error);
      }
    }
  }, []);

  const handleMaterialToggle = (materialId: string) => {
    const newSelected = selectedMaterials.includes(materialId)
      ? selectedMaterials.filter(id => id !== materialId)
      : [...selectedMaterials, materialId];
    
    onMaterialsChange(newSelected);
    
    // Mettre à jour les données des matériels sélectionnés
    const selectedMaterialsData = availableMaterials.filter(m => 
      newSelected.includes(m.id)
    );
    onMaterialsDataChange(selectedMaterialsData);
  };

  const calculateTotalValue = () => {
    return availableMaterials
      .filter(m => selectedMaterials.includes(m.id))
      .reduce((total, material) => total + material.valeurInitialeHT, 0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-blue-500" />
          Sélection des Matériels
        </CardTitle>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Choisissez les matériels à inclure dans la proposition
          </p>
          <Button variant="outline" size="sm" asChild>
            <a href="/materiel" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Gérer les matériels
            </a>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {availableMaterials.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="mb-2">Aucun matériel disponible</p>
            <p className="text-sm">Ajoutez des matériels dans la section "Matériel" pour les utiliser ici</p>
            <Button variant="outline" className="mt-4" asChild>
              <a href="/materiel">
                Aller à la gestion des matériels
              </a>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {availableMaterials.map((material) => (
              <Card key={material.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={selectedMaterials.includes(material.id)}
                      onCheckedChange={() => handleMaterialToggle(material.id)}
                    />
                    <div>
                      <h4 className="font-medium">{material.designation}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{material.famille}</Badge>
                        <Badge variant="secondary">{material.fournisseur}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {material.referenceMateriel} - {material.marque} {material.modele}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {material.valeurInitialeHT.toLocaleString()} XAF HT
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {material.valeurInitialeTTC.toLocaleString()} XAF TTC
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            
            {selectedMaterials.length > 0 && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-blue-800">
                      Total sélectionné ({selectedMaterials.length} matériel{selectedMaterials.length > 1 ? 's' : ''}) :
                    </span>
                    <span className="font-bold text-blue-800 text-lg">
                      {calculateTotalValue().toLocaleString()} XAF HT
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MaterialSelector;
