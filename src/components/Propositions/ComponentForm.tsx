
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ComponentData, FAMILLES_COMPOSANTS } from "@/types/material";
import { Plus, X } from "lucide-react";

interface ComponentFormProps {
  onAddComponent: (component: ComponentData) => void;
  onCancel: () => void;
  materielParentId: string;
  materielParentRef: string;
  fournisseurs: string[];
}

const ComponentForm = ({ onAddComponent, onCancel, materielParentId, materielParentRef, fournisseurs }: ComponentFormProps) => {
  const [formData, setFormData] = useState<Partial<ComponentData>>({
    numeroComposant: `COMP-${Date.now()}`,
    designation: "",
    familleComposant: "",
    marque: "",
    modele: "",
    numeroSerieChassis: "",
    referenceMaterielAssocie: materielParentRef,
    anneeFabrication: new Date().getFullYear(),
    dateMiseEnService: new Date().toISOString().split('T')[0],
    dureeUtilisationEstimee: "",
    dureeUtilisationType: "heures",
    fournisseur: "",
    puissance: "",
    dateAcquisition: new Date().toISOString().split('T')[0],
    valeurInitialeHT: 0,
    valeurInitialeTTC: 0,
    caracteristique1: "",
    caracteristique2: "",
    caracteristique3: "",
    observations: "",
    materielParentId
  });

  const handleInputChange = (field: keyof ComponentData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Calcul automatique TTC quand HT change
    if (field === 'valeurInitialeHT') {
      const taux = 0.18; // 18% de TVA
      setFormData(prev => ({
        ...prev,
        valeurInitialeTTC: value * (1 + taux)
      }));
    }
  };

  const handleSubmit = () => {
    if (formData.designation && formData.familleComposant && formData.marque && formData.modele && formData.fournisseur) {
      const component: ComponentData = {
        id: Date.now().toString(),
        numeroComposant: formData.numeroComposant!,
        designation: formData.designation!,
        familleComposant: formData.familleComposant!,
        marque: formData.marque!,
        modele: formData.modele!,
        numeroSerieChassis: formData.numeroSerieChassis,
        referenceMaterielAssocie: formData.referenceMaterielAssocie,
        anneeFabrication: formData.anneeFabrication!,
        dateMiseEnService: formData.dateMiseEnService!,
        dureeUtilisationEstimee: formData.dureeUtilisationEstimee!,
        dureeUtilisationType: formData.dureeUtilisationType!,
        fournisseur: formData.fournisseur!,
        puissance: formData.puissance,
        dateAcquisition: formData.dateAcquisition!,
        valeurInitialeHT: formData.valeurInitialeHT!,
        valeurInitialeTTC: formData.valeurInitialeTTC!,
        caracteristique1: formData.caracteristique1,
        caracteristique2: formData.caracteristique2,
        caracteristique3: formData.caracteristique3,
        observations: formData.observations,
        materielParentId: formData.materielParentId!
      };
      onAddComponent(component);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Ajouter un composant
          <Button variant="outline" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Composant pour le matériel : {materielParentRef}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Informations de base */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Numéro composant *</Label>
            <Input 
              value={formData.numeroComposant} 
              readOnly 
              className="bg-gray-100"
            />
          </div>
          <div>
            <Label>Désignation *</Label>
            <Input 
              value={formData.designation} 
              onChange={(e) => handleInputChange('designation', e.target.value)}
              placeholder="Désignation du composant"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Famille composant *</Label>
            <Select value={formData.familleComposant} onValueChange={(value) => handleInputChange('familleComposant', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir une famille" />
              </SelectTrigger>
              <SelectContent>
                {FAMILLES_COMPOSANTS.map(famille => (
                  <SelectItem key={famille} value={famille}>{famille}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Marque *</Label>
            <Input 
              value={formData.marque} 
              onChange={(e) => handleInputChange('marque', e.target.value)}
              placeholder="Marque du composant"
            />
          </div>
          <div>
            <Label>Modèle *</Label>
            <Input 
              value={formData.modele} 
              onChange={(e) => handleInputChange('modele', e.target.value)}
              placeholder="Modèle du composant"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>N° série/châssis</Label>
            <Input 
              value={formData.numeroSerieChassis} 
              onChange={(e) => handleInputChange('numeroSerieChassis', e.target.value)}
              placeholder="Numéro de série (optionnel)"
            />
          </div>
          <div>
            <Label>Référence matériel associé</Label>
            <Input 
              value={formData.referenceMaterielAssocie} 
              readOnly 
              className="bg-gray-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Année fabrication *</Label>
            <Input 
              type="number" 
              value={formData.anneeFabrication} 
              onChange={(e) => handleInputChange('anneeFabrication', parseInt(e.target.value))}
              max={new Date().getFullYear()}
            />
          </div>
          <div>
            <Label>Date mise en service *</Label>
            <Input 
              type="date" 
              value={formData.dateMiseEnService} 
              onChange={(e) => handleInputChange('dateMiseEnService', e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <div>
          <Label>Durée d'utilisation estimée *</Label>
          <div className="flex gap-4 items-end">
            <Input 
              value={formData.dureeUtilisationEstimee} 
              onChange={(e) => handleInputChange('dureeUtilisationEstimee', e.target.value)}
              placeholder="Ex: 5000"
              className="flex-1"
            />
            <RadioGroup 
              value={formData.dureeUtilisationType} 
              onValueChange={(value) => handleInputChange('dureeUtilisationType', value)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="heures" id="heures" />
                <Label htmlFor="heures">Heures</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="kilometrage" id="kilometrage" />
                <Label htmlFor="kilometrage">Kilométrage</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Fournisseur *</Label>
            <Select value={formData.fournisseur} onValueChange={(value) => handleInputChange('fournisseur', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un fournisseur" />
              </SelectTrigger>
              <SelectContent>
                {fournisseurs.map(fournisseur => (
                  <SelectItem key={fournisseur} value={fournisseur}>{fournisseur}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Puissance</Label>
            <Input 
              value={formData.puissance} 
              onChange={(e) => handleInputChange('puissance', e.target.value)}
              placeholder="Ex: 150 CV (optionnel)"
            />
          </div>
        </div>

        <div>
          <Label>Date acquisition *</Label>
          <Input 
            type="date" 
            value={formData.dateAcquisition} 
            onChange={(e) => handleInputChange('dateAcquisition', e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Valeurs financières */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Valeur initiale HT (FCFA) *</Label>
            <Input 
              type="number" 
              value={formData.valeurInitialeHT} 
              onChange={(e) => handleInputChange('valeurInitialeHT', parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <Label>Valeur initiale TTC (FCFA) *</Label>
            <Input 
              type="number" 
              value={formData.valeurInitialeTTC} 
              onChange={(e) => handleInputChange('valeurInitialeTTC', parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>

        {/* Caractéristiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Caractéristique 1</Label>
            <Input 
              value={formData.caracteristique1} 
              onChange={(e) => handleInputChange('caracteristique1', e.target.value)}
              placeholder="Caractéristique 1 (optionnel)"
            />
          </div>
          <div>
            <Label>Caractéristique 2</Label>
            <Input 
              value={formData.caracteristique2} 
              onChange={(e) => handleInputChange('caracteristique2', e.target.value)}
              placeholder="Caractéristique 2 (optionnel)"
            />
          </div>
          <div>
            <Label>Caractéristique 3</Label>
            <Input 
              value={formData.caracteristique3} 
              onChange={(e) => handleInputChange('caracteristique3', e.target.value)}
              placeholder="Caractéristique 3 (optionnel)"
            />
          </div>
        </div>

        <div>
          <Label>Observations</Label>
          <Textarea 
            value={formData.observations} 
            onChange={(e) => handleInputChange('observations', e.target.value)}
            placeholder="Observations facultatives"
            rows={3}
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter le composant
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComponentForm;
