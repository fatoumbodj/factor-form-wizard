
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Settings, Upload, FileText } from "lucide-react";
import { TypeProposition, Convention, Campagne } from "@/types/leasing";
import { MaterialData, ComponentData } from "@/types/material";
import MaterialForm from "./MaterialForm";
import ComponentForm from "./ComponentForm";
import FileUploadSection from "./FileUploadSection";

interface MaterialManagerProps {
  materials: MaterialData[];
  onMaterialsChange: (materials: MaterialData[]) => void;
  selectedFournisseurs: string[];
  onFournisseursChange: (fournisseurs: string[]) => void;
  availableFournisseurs: string[];
  typeProposition: TypeProposition | "classique" | null;
  selectedConvention?: Convention | null;
  selectedCampagne?: Campagne | null;
}

const MaterialManager = ({ 
  materials, 
  onMaterialsChange, 
  selectedFournisseurs, 
  onFournisseursChange,
  availableFournisseurs,
  typeProposition,
  selectedConvention,
  selectedCampagne
}: MaterialManagerProps) => {
  const [showMaterialForm, setShowMaterialForm] = useState(false);
  const [showComponentForm, setShowComponentForm] = useState(false);
  const [selectedMaterialForComponent, setSelectedMaterialForComponent] = useState<MaterialData | null>(null);

  const handleFournisseurSelect = (fournisseur: string) => {
    if (!selectedFournisseurs.includes(fournisseur)) {
      onFournisseursChange([...selectedFournisseurs, fournisseur]);
    }
  };

  const handleRemoveFournisseur = (fournisseur: string) => {
    onFournisseursChange(selectedFournisseurs.filter(f => f !== fournisseur));
  };

  const handleAddMaterial = (material: MaterialData) => {
    onMaterialsChange([...materials, material]);
    setShowMaterialForm(false);
  };

  const handleAddComponent = (component: ComponentData) => {
    const updatedMaterials = materials.map(material => {
      if (material.id === component.materielParentId) {
        return {
          ...material,
          composants: [...(material.composants || []), component]
        };
      }
      return material;
    });
    onMaterialsChange(updatedMaterials);
    setShowComponentForm(false);
    setSelectedMaterialForComponent(null);
  };

  const handleRemoveMaterial = (materialId: string) => {
    onMaterialsChange(materials.filter(m => m.id !== materialId));
  };

  const handleRemoveComponent = (materialId: string, componentId: string) => {
    const updatedMaterials = materials.map(material => {
      if (material.id === materialId) {
        return {
          ...material,
          composants: material.composants?.filter(c => c.id !== componentId) || []
        };
      }
      return material;
    });
    onMaterialsChange(updatedMaterials);
  };

  const handleFileUpload = (file: File, type: "materials" | "components") => {
    console.log(`Uploading ${type} file:`, file.name);
    // Ici vous pouvez implémenter la logique de traitement du fichier
    // Par exemple, parser un CSV/Excel et créer des matériels/composants
  };

  const getTypeLabel = () => {
    if (typeProposition === "classique") return "Standard";
    if (typeProposition === "convention") return `Convention: ${selectedConvention?.nom}`;
    if (typeProposition === "campagne") return `Campagne: ${selectedCampagne?.nom}`;
    return "";
  };

  const calculateTotalValue = () => {
    return materials.reduce((total, material) => {
      const materialValue = material.valeurInitialeHT;
      const componentsValue = (material.composants || []).reduce((sum, comp) => sum + comp.valeurInitialeHT, 0);
      return total + materialValue + componentsValue;
    }, 0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Matériels et Composants à financer</CardTitle>
        {typeProposition && (
          <div className="text-sm text-muted-foreground">
            Type: {getTypeLabel()}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sélection des fournisseurs */}
        <div>
          <Label htmlFor="fournisseur">Fournisseur(s) agréé(s) *</Label>
          <Select onValueChange={handleFournisseurSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un fournisseur" />
            </SelectTrigger>
            <SelectContent>
              {availableFournisseurs.map(fournisseur => (
                <SelectItem key={fournisseur} value={fournisseur}>
                  {fournisseur}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedFournisseurs.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedFournisseurs.map(fournisseur => (
                <Badge key={fournisseur} variant="secondary" className="flex items-center gap-1">
                  {fournisseur}
                  <button onClick={() => handleRemoveFournisseur(fournisseur)}>
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Sélection de fournisseurs supplémentaires */}
        {selectedFournisseurs.length > 0 && (
          <div>
            <Label htmlFor="fournisseur-supplementaire">Ajouter d'autres fournisseurs</Label>
            <Select onValueChange={handleFournisseurSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un fournisseur supplémentaire" />
              </SelectTrigger>
              <SelectContent>
                {availableFournisseurs
                  .filter(f => !selectedFournisseurs.includes(f))
                  .map(fournisseur => (
                    <SelectItem key={fournisseur} value={fournisseur}>
                      {fournisseur}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Onglets pour matériels et composants */}
        {selectedFournisseurs.length > 0 && (
          <Tabs defaultValue="materials" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="materials">
                <Settings className="h-4 w-4 mr-2" />
                Matériels
              </TabsTrigger>
              <TabsTrigger value="components">
                <Plus className="h-4 w-4 mr-2" />
                Composants
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="materials" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Upload de fichier matériels */}
                <FileUploadSection
                  title="Importer des matériels"
                  onFileUpload={(file) => handleFileUpload(file, "materials")}
                  acceptedFormats="csv, xlsx, xls"
                  maxSize={5}
                />
                
                {/* Saisie manuelle matériel */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Saisie manuelle</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => setShowMaterialForm(true)}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={showMaterialForm || showComponentForm}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter un matériel
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Formulaire d'ajout de matériel */}
              {showMaterialForm && (
                <MaterialForm
                  onAddMaterial={handleAddMaterial}
                  onCancel={() => setShowMaterialForm(false)}
                  selectedFournisseur={selectedFournisseurs[0]}
                />
              )}
            </TabsContent>
            
            <TabsContent value="components" className="space-y-4">
              {materials.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground">
                  Ajoutez d'abord des matériels avant de pouvoir ajouter des composants.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Upload de fichier composants */}
                  <FileUploadSection
                    title="Importer des composants"
                    onFileUpload={(file) => handleFileUpload(file, "components")}
                    acceptedFormats="csv, xlsx, xls"
                    maxSize={5}
                  />
                  
                  {/* Saisie manuelle composant */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Saisie manuelle</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Label>Choisir le matériel parent</Label>
                        <Select 
                          onValueChange={(materialId) => {
                            const material = materials.find(m => m.id === materialId);
                            if (material) {
                              setSelectedMaterialForComponent(material);
                              setShowComponentForm(true);
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un matériel" />
                          </SelectTrigger>
                          <SelectContent>
                            {materials.map(material => (
                              <SelectItem key={material.id} value={material.id}>
                                {material.referenceMateriel} - {material.designation}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Formulaire d'ajout de composant */}
              {showComponentForm && selectedMaterialForComponent && (
                <ComponentForm
                  onAddComponent={handleAddComponent}
                  onCancel={() => {
                    setShowComponentForm(false);
                    setSelectedMaterialForComponent(null);
                  }}
                  materielParentId={selectedMaterialForComponent.id}
                  materielParentRef={selectedMaterialForComponent.referenceMateriel}
                  fournisseurs={selectedFournisseurs}
                />
              )}
            </TabsContent>
          </Tabs>
        )}

        {/* Liste des matériels ajoutés */}
        {materials.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium text-lg">Matériels ajoutés</h4>
            
            {materials.map(material => (
              <Card key={material.id} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">{material.designation}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {material.referenceMateriel} - {material.marque} {material.modele}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{material.famille}</Badge>
                      <span className="font-medium">{material.valeurInitialeHT.toLocaleString()} FCFA HT</span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleRemoveMaterial(material.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                {material.composants && material.composants.length > 0 && (
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Composants associés:</Label>
                      {material.composants.map(component => (
                        <div key={component.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <div>
                            <span className="text-sm font-medium">{component.designation}</span>
                            <span className="text-xs text-muted-foreground ml-2">
                              {component.numeroComposant}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{component.valeurInitialeHT.toLocaleString()} FCFA</span>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleRemoveComponent(material.id, component.id)}
                            >
                              <Trash2 className="h-3 w-3 text-red-600" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
            
            {/* Total général */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-blue-800">Total général HT :</span>
                  <span className="font-bold text-blue-800 text-lg">
                    {calculateTotalValue().toLocaleString()} FCFA
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MaterialManager;
