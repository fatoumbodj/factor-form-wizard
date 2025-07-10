
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MaterialData, FAMILLES_MATERIELS } from "@/types/material";
import { Upload, Plus, X } from "lucide-react";

interface MaterialFormProps {
  onAddMaterial: (material: MaterialData) => void;
  onCancel: () => void;
  selectedFournisseur: string;
}

const MaterialForm = ({ onAddMaterial, onCancel, selectedFournisseur }: MaterialFormProps) => {
  const [formData, setFormData] = useState<Partial<MaterialData>>({
    referenceMateriel: `MAT-${Date.now()}`,
    designation: "",
    famille: "",
    marque: "",
    modele: "",
    numeroSerieChassis: "",
    anneeFabrication: new Date().getFullYear(),
    dateMiseEnService: new Date().toISOString().split('T')[0],
    dureeUtilisationEstimee: "",
    origineMateriel: "Local",
    statut: "En stock",
    etatMateriel: "Neuf",
    usage: "Professionnel",
    dateAcquisition: new Date().toISOString().split('T')[0],
    valeurInitialeHT: 0,
    valeurInitialeTTC: 0,
    valeurMarche: 0,
    observations: "",
    fournisseur: selectedFournisseur
  });

  const handleInputChange = (field: keyof MaterialData, value: any) => {
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
    if (formData.designation && formData.famille && formData.marque && formData.modele) {
      const material: MaterialData = {
        id: Date.now().toString(),
        referenceMateriel: formData.referenceMateriel!,
        designation: formData.designation!,
        famille: formData.famille!,
        marque: formData.marque!,
        modele: formData.modele!,
        numeroSerieChassis: formData.numeroSerieChassis!,
        anneeFabrication: formData.anneeFabrication!,
        dateMiseEnService: formData.dateMiseEnService!,
        dureeUtilisationEstimee: formData.dureeUtilisationEstimee!,
        origineMateriel: formData.origineMateriel!,
        statut: formData.statut!,
        etatMateriel: formData.etatMateriel!,
        usage: formData.usage!,
        dateAcquisition: formData.dateAcquisition!,
        valeurInitialeHT: formData.valeurInitialeHT!,
        valeurInitialeTTC: formData.valeurInitialeTTC!,
        valeurMarche: formData.valeurMarche!,
        observations: formData.observations,
        fournisseur: formData.fournisseur!,
        composants: []
      };
      onAddMaterial(material);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Ajouter un nouveau matériel
          <Button variant="outline" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Informations de base */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Référence matériel *</Label>
            <Input 
              value={formData.referenceMateriel} 
              readOnly 
              className="bg-gray-100"
            />
          </div>
          <div>
            <Label>Désignation *</Label>
            <Input 
              value={formData.designation} 
              onChange={(e) => handleInputChange('designation', e.target.value)}
              placeholder="Désignation du matériel"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Famille *</Label>
            <Select value={formData.famille} onValueChange={(value) => handleInputChange('famille', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir une famille" />
              </SelectTrigger>
              <SelectContent>
                {FAMILLES_MATERIELS.map(famille => (
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
              placeholder="Marque du matériel"
            />
          </div>
          <div>
            <Label>Modèle *</Label>
            <Input 
              value={formData.modele} 
              onChange={(e) => handleInputChange('modele', e.target.value)}
              placeholder="Modèle du matériel"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>N° série/châssis *</Label>
            <Input 
              value={formData.numeroSerieChassis} 
              onChange={(e) => handleInputChange('numeroSerieChassis', e.target.value)}
              placeholder="Numéro de série"
            />
          </div>
          <div>
            <Label>Année fabrication *</Label>
            <Input 
              type="number" 
              value={formData.anneeFabrication} 
              onChange={(e) => handleInputChange('anneeFabrication', parseInt(e.target.value))}
              max={new Date().getFullYear()}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Date mise en service *</Label>
            <Input 
              type="date" 
              value={formData.dateMiseEnService} 
              onChange={(e) => handleInputChange('dateMiseEnService', e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <Label>Durée d'utilisation estimée *</Label>
            <Input 
              value={formData.dureeUtilisationEstimee} 
              onChange={(e) => handleInputChange('dureeUtilisationEstimee', e.target.value)}
              placeholder="Ex: 5000 heures ou 100000 km"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Origine matériel *</Label>
            <Select value={formData.origineMateriel} onValueChange={(value) => handleInputChange('origineMateriel', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Local">Local</SelectItem>
                <SelectItem value="Importé">Importé</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Statut *</Label>
            <Select value={formData.statut} onValueChange={(value) => handleInputChange('statut', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="En stock">En stock</SelectItem>
                <SelectItem value="Loué">Loué</SelectItem>
                <SelectItem value="Restitué">Restitué</SelectItem>
                <SelectItem value="Repris">Repris</SelectItem>
                <SelectItem value="Vendu">Vendu</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>État matériel *</Label>
            <Select value={formData.etatMateriel} onValueChange={(value) => handleInputChange('etatMateriel', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Neuf">Neuf</SelectItem>
                <SelectItem value="Occasion">Occasion</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Usage *</Label>
            <Select value={formData.usage} onValueChange={(value) => handleInputChange('usage', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Professionnel">Professionnel</SelectItem>
                <SelectItem value="Privé">Privé</SelectItem>
              </SelectContent>
            </Select>
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
        </div>

        {/* Valeurs financières */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <div>
            <Label>Valeur marché (FCFA) *</Label>
            <Input 
              type="number" 
              value={formData.valeurMarche} 
              onChange={(e) => handleInputChange('valeurMarche', parseFloat(e.target.value) || 0)}
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
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter le matériel
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaterialForm;
