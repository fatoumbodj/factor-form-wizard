
import { useState } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ComponentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (component: any) => void;
  editingComponent?: any;
  materiels: any[];
  fournisseurs: string[];
}

const FAMILLES_COMPOSANTS = [
  "Moteur",
  "Transmission", 
  "Freinage",
  "Électronique",
  "Hydraulique",
  "Pneumatique",
  "Accessoires"
];

const ComponentFormModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editingComponent, 
  materiels, 
  fournisseurs 
}: ComponentFormModalProps) => {
  const [formData, setFormData] = useState({
    numeroComposant: editingComponent?.numeroComposant || `COMP-${Date.now()}`,
    designation: editingComponent?.designation || "",
    familleComposant: editingComponent?.familleComposant || "",
    marque: editingComponent?.marque || "",
    modele: editingComponent?.modele || "",
    numeroSerieChassis: editingComponent?.numeroSerieChassis || "",
    referenceMaterielAssocie: editingComponent?.referenceMaterielAssocie || "",
    anneeFabrication: editingComponent?.anneeFabrication || new Date().getFullYear(),
    dateMiseEnService: editingComponent?.dateMiseEnService || new Date().toISOString().split('T')[0],
    dureeUtilisationEstimee: editingComponent?.dureeUtilisationEstimee || "",
    dureeUtilisationType: editingComponent?.dureeUtilisationType || "heures",
    fournisseur: editingComponent?.fournisseur || "",
    puissance: editingComponent?.puissance || "",
    dateAcquisition: editingComponent?.dateAcquisition || new Date().toISOString().split('T')[0],
    valeurInitialeHT: editingComponent?.valeurInitialeHT || "",
    valeurInitialeTTC: editingComponent?.valeurInitialeTTC || "",
    caracteristique1: editingComponent?.caracteristique1 || "",
    caracteristique2: editingComponent?.caracteristique2 || "",
    caracteristique3: editingComponent?.caracteristique3 || "",
    observations: editingComponent?.observations || ""
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Calcul automatique TTC
    if (field === 'valeurInitialeHT') {
      const ht = parseFloat(value) || 0;
      setFormData(prev => ({ ...prev, valeurInitialeTTC: (ht * 1.18).toString() }));
    }
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {editingComponent ? "Modifier le composant" : "Ajouter un nouveau composant"}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
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
              <Select value={formData.referenceMaterielAssocie} onValueChange={(value) => handleInputChange('referenceMaterielAssocie', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un matériel" />
                </SelectTrigger>
                <SelectContent>
                  {materiels.map(materiel => (
                    <SelectItem key={materiel.id} value={materiel.referenceMateriel}>
                      {materiel.referenceMateriel} - {materiel.designation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Valeur initiale HT (FCFA) *</Label>
              <Input 
                type="number"
                value={formData.valeurInitialeHT}
                onChange={(e) => handleInputChange('valeurInitialeHT', e.target.value)}
              />
            </div>
            <div>
              <Label>Valeur initiale TTC (FCFA) *</Label>
              <Input 
                type="number"
                value={formData.valeurInitialeTTC}
                onChange={(e) => handleInputChange('valeurInitialeTTC', e.target.value)}
              />
            </div>
          </div>

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
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              {editingComponent ? "Modifier le composant" : "Ajouter le composant"}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComponentFormModal;
