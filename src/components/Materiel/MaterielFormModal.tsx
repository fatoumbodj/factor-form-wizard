
import { useState } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

interface MaterielFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (materiel: any) => void;
  editingMateriel?: any;
}

const FAMILLES = [
  "Véhicules légers",
  "Véhicules utilitaires", 
  "Équipements agricoles",
  "Équipements BTP",
  "Machines industrielles",
  "Matériel informatique",
  "Équipements médicaux"
];

const MaterielFormModal = ({ isOpen, onClose, onSave, editingMateriel }: MaterielFormModalProps) => {
  const [formData, setFormData] = useState({
    referenceMateriel: editingMateriel?.referenceMateriel || `MAT-${Date.now()}`,
    designation: editingMateriel?.designation || "",
    famille: editingMateriel?.famille || "",
    marque: editingMateriel?.marque || "",
    modele: editingMateriel?.modele || "",
    numeroSerie: editingMateriel?.numeroSerie || "",
    anneeFabrication: editingMateriel?.anneeFabrication || new Date().getFullYear(),
    dateMiseEnService: editingMateriel?.dateMiseEnService || new Date().toISOString().split('T')[0],
    dureeUtilisation: editingMateriel?.dureeUtilisation || "",
    origine: editingMateriel?.origine || "Local",
    statut: editingMateriel?.statut || "En stock",
    etat: editingMateriel?.etat || "Neuf",
    usage: editingMateriel?.usage || "Professionnel",
    dateAcquisition: editingMateriel?.dateAcquisition || new Date().toISOString().split('T')[0],
    valeurHT: editingMateriel?.valeurHT || "",
    valeurTTC: editingMateriel?.valeurTTC || "",
    valeurMarche: editingMateriel?.valeurMarche || "",
    observations: editingMateriel?.observations || ""
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Calcul automatique TTC
    if (field === 'valeurHT') {
      const ht = parseFloat(value) || 0;
      setFormData(prev => ({ ...prev, valeurTTC: (ht * 1.18).toString() }));
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
            Ajouter un nouveau matériel
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
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
                  {FAMILLES.map(famille => (
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
                value={formData.numeroSerie}
                onChange={(e) => handleInputChange('numeroSerie', e.target.value)}
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
              />
            </div>
            <div>
              <Label>Durée d'utilisation estimée *</Label>
              <Input 
                value={formData.dureeUtilisation}
                onChange={(e) => handleInputChange('dureeUtilisation', e.target.value)}
                placeholder="Ex: 5000 heures ou 100000 km"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Valeur initiale HT (FCFA) *</Label>
              <Input 
                type="number"
                value={formData.valeurHT}
                onChange={(e) => handleInputChange('valeurHT', e.target.value)}
              />
            </div>
            <div>
              <Label>Valeur initiale TTC (FCFA) *</Label>
              <Input 
                type="number"
                value={formData.valeurTTC}
                onChange={(e) => handleInputChange('valeurTTC', e.target.value)}
              />
            </div>
            <div>
              <Label>Valeur marché (FCFA) *</Label>
              <Input 
                type="number"
                value={formData.valeurMarche}
                onChange={(e) => handleInputChange('valeurMarche', e.target.value)}
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
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter le matériel
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

export default MaterielFormModal;
