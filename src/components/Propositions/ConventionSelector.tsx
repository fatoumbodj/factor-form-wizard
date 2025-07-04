
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Convention, BaremeComplet } from "@/types/leasing";
import { CheckCircle, Calendar, Users, Percent, Plus } from "lucide-react";
import ConventionActions from "../Conventions/ConventionActions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Demo data - barèmes disponibles (récupérés depuis la page Barème)
const BAREMES_DISPONIBLES: BaremeComplet[] = [
  {
    id: "bar-std-001",
    nom: "Barème Standard Crédit-Bail",
    type: "standard",
    taux: 7.0,
    marge: 3.0,
    valeurResiduelle: 2.5,
    typologie: "Crédit-Bail",
    dateCreation: new Date("2024-01-01"),
    actif: true
  },
  {
    id: "bar-std-002",
    nom: "Barème Standard LLD",
    type: "standard",
    taux: 6.8,
    marge: 2.8,
    valeurResiduelle: 0,
    typologie: "LLD",
    dateCreation: new Date("2024-01-01"),
    actif: true
  },
  {
    id: "bar-conv-001",
    nom: "Barème Convention Véhicules",
    type: "derogatoire",
    taux: 6.5,
    marge: 2.8,
    valeurResiduelle: 1.8,
    typologie: "Crédit-Bail",
    dateCreation: new Date("2024-01-01"),
    actif: true
  }
];

// Updated demo data to match the new Convention interface
const CONVENTIONS_DEMO: Convention[] = [
  {
    id: "conv-vehicules-001",
    nom: "Véhicules Professionnels 2024",
    description: "Convention dédiée aux véhicules utilitaires et professionnels avec conditions préférentielles",
    fournisseurs: ["babacar-fils", "senegal-auto"],
    prestatairesMaintenace: ["garage-centrale", "maintenance-rapide"],
    categoriesMateriels: ["vehicules-utilitaires", "camions"],
    bareme: {
      taux: 6.5,
      marge: 2.8,
      valeurResiduelle: 1.8
    },
    dateDebut: new Date("2024-01-01"),
    dateFin: new Date("2024-12-31"),
    reconductionTacite: true,
    actif: true,
    statut: "active"
  },
  {
    id: "conv-equipement-002",
    nom: "Équipement Industriel Premium",
    description: "Convention pour les machines et équipements industriels haute gamme",
    fournisseurs: ["sonacos", "afrique-materiel"],
    prestatairesMaintenace: ["techno-maintenance"],
    categoriesMateriels: ["machines-industrielles", "equipement-production"],
    bareme: {
      taux: 6.0,
      marge: 2.5,
      valeurResiduelle: 2.0
    },
    dateDebut: new Date("2024-01-01"),
    reconductionTacite: false,
    actif: true,
    statut: "active"
  },
  {
    id: "conv-agriculture-003",
    nom: "Matériel Agricole Spécialisé",
    description: "Convention spécialisée pour les équipements agricoles et agroalimentaires",
    fournisseurs: ["agri-senegal"],
    prestatairesMaintenace: ["maintenance-agricole", "techno-maintenance"],
    categoriesMateriels: ["tracteurs", "moissonneuses", "equipement-agricole"],
    bareme: {
      taux: 6.8,
      marge: 3.2,
      valeurResiduelle: 1.5
    },
    dateDebut: new Date("2024-01-01"),
    dateFin: new Date("2024-12-31"),
    reconductionTacite: true,
    actif: true,
    statut: "active"
  }
];

interface ConventionSelectorProps {
  selectedConvention: Convention | null;
  onConventionSelect: (convention: Convention) => void;
}

const ConventionSelector = ({ selectedConvention, onConventionSelect }: ConventionSelectorProps) => {
  const [selectedFournisseur, setSelectedFournisseur] = useState<string>("");
  const [isBaremeDialogOpen, setIsBaremeDialogOpen] = useState(false);
  const [selectedBaremeId, setSelectedBaremeId] = useState<string>("");
  const [baremes, setBaremes] = useState<BaremeComplet[]>(BAREMES_DISPONIBLES);
  const [baremeSelectionMode, setBaremeSelectionMode] = useState<"existing" | "new">("existing");
  
  // Formulaire pour créer un nouveau barème (simplifié pour les conventions)
  const [newBaremeForm, setNewBaremeForm] = useState({
    nom: "",
    typologie: "Crédit-Bail",
    type: "derogatoire" as "standard" | "derogatoire",
    taux: "",
    marge: "",
    valeurResiduelle: "",
    duree: "36",
    periodiciteModifiable: false,
    premierLoyerMajore: ""
  });

  const fournisseurs = Array.from(
    new Set(CONVENTIONS_DEMO.flatMap(conv => conv.fournisseurs))
  );

  const filteredConventions = selectedFournisseur
    ? CONVENTIONS_DEMO.filter(conv => conv.fournisseurs.includes(selectedFournisseur))
    : CONVENTIONS_DEMO;

  const resetBaremeForm = () => {
    setNewBaremeForm({
      nom: "",
      typologie: "Crédit-Bail",
      type: "derogatoire",
      taux: "",
      marge: "",
      valeurResiduelle: "",
      duree: "36",
      periodiciteModifiable: false,
      premierLoyerMajore: ""
    });
    setBaremeSelectionMode("existing");
  };

  const handleCreateBareme = () => {
    const newBareme: BaremeComplet = {
      id: `bar-conv-${Date.now()}`,
      nom: newBaremeForm.nom,
      type: newBaremeForm.type,
      taux: parseFloat(newBaremeForm.taux),
      marge: parseFloat(newBaremeForm.marge),
      valeurResiduelle: parseFloat(newBaremeForm.valeurResiduelle),
      typologie: newBaremeForm.typologie,
      dateCreation: new Date(),
      actif: true
    };
    
    setBaremes(prev => [...prev, newBareme]);
    setSelectedBaremeId(newBareme.id);
    setIsBaremeDialogOpen(false);
    resetBaremeForm();
    
    console.log("Nouveau barème créé pour convention:", newBareme);
  };

  const handleReconduct = (convention: Convention, startDate: Date, motif: string) => {
    console.log("Reconduction:", convention.nom, startDate, motif);
    // Logique de reconduction
  };

  const handleResiliate = (convention: Convention, motif: string) => {
    console.log("Résiliation:", convention.nom, motif);
    // Logique de résiliation
  };

  const handleCancel = (convention: Convention, motif: string) => {
    console.log("Annulation:", convention.nom, motif);
    // Logique d'annulation
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Sélection du Fournisseur
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {fournisseurs.map(fournisseur => (
              <Button
                key={fournisseur}
                variant={selectedFournisseur === fournisseur ? "default" : "outline"}
                onClick={() => setSelectedFournisseur(fournisseur)}
                className="justify-start"
              >
                {fournisseur.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sélection du Barème - Version améliorée avec barèmes existants */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <Percent className="h-5 w-5" />
              Barèmes pour la Convention
            </div>
            <Dialog open={isBaremeDialogOpen} onOpenChange={setIsBaremeDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" onClick={resetBaremeForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Gérer les barèmes
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Sélection du Barème pour la Convention</DialogTitle>
                  <DialogDescription>
                    Choisissez un barème existant ou créez-en un nouveau
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Mode de sélection */}
                  <div className="flex gap-2">
                    <Button 
                      variant={baremeSelectionMode === "existing" ? "default" : "outline"}
                      onClick={() => setBaremeSelectionMode("existing")}
                      size="sm"
                    >
                      Barème existant
                    </Button>
                    <Button
                      variant={baremeSelectionMode === "new" ? "default" : "outline"}
                      onClick={() => setBaremeSelectionMode("new")}
                      size="sm"
                    >
                      Nouveau barème
                    </Button>
                  </div>

                  {baremeSelectionMode === "existing" ? (
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">
                        Sélectionnez un barème existant depuis votre bibliothèque
                      </div>
                      <div className="max-h-96 overflow-y-auto space-y-2">
                        {baremes.filter(b => b.actif).map(bareme => (
                          <div
                            key={bareme.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-all ${
                              selectedBaremeId === bareme.id
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                            onClick={() => setSelectedBaremeId(bareme.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium">{bareme.nom}</h4>
                                  {selectedBaremeId === bareme.id && (
                                    <CheckCircle className="h-4 w-4 text-primary" />
                                  )}
                                </div>
                                <div className="flex gap-2 mt-2">
                                  <Badge variant="outline" className="text-xs">
                                    Taux: {bareme.taux}%
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    Marge: {bareme.marge}%
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    VR: {bareme.valeurResiduelle}%
                                  </Badge>
                                  <Badge variant={bareme.type === "standard" ? "default" : "secondary"} className="text-xs">
                                    {bareme.type}
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {bareme.typologie}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-sm text-muted-foreground">
                        Créez un nouveau barème personnalisé pour cette convention
                      </div>
                      
                      <div>
                        <Label htmlFor="newBaremeNom">Nom du barème *</Label>
                        <Input
                          id="newBaremeNom"
                          value={newBaremeForm.nom}
                          onChange={(e) => setNewBaremeForm(prev => ({ ...prev, nom: e.target.value }))}
                          placeholder="Ex: Barème Convention Spéciale Véhicules"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="newBaremeTypologie">Typologie *</Label>
                          <Select value={newBaremeForm.typologie} onValueChange={(value) => setNewBaremeForm(prev => ({ ...prev, typologie: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Crédit-Bail">Crédit-Bail / LOA</SelectItem>
                              <SelectItem value="LLD">LLD</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="newBaremeType">Type *</Label>
                          <Select value={newBaremeForm.type} onValueChange={(value: "standard" | "derogatoire") => setNewBaremeForm(prev => ({ ...prev, type: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="standard">Standard</SelectItem>
                              <SelectItem value="derogatoire">Dérogatoire</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="newBaremeTaux">Taux (%)</Label>
                          <Input
                            id="newBaremeTaux"
                            type="number"
                            step="0.1"
                            value={newBaremeForm.taux}
                            onChange={(e) => setNewBaremeForm(prev => ({ ...prev, taux: e.target.value }))}
                            placeholder="6.5"
                          />
                        </div>
                        <div>
                          <Label htmlFor="newBaremeMarge">Marge (%)</Label>
                          <Input
                            id="newBaremeMarge"
                            type="number"
                            step="0.1"
                            value={newBaremeForm.marge}
                            onChange={(e) => setNewBaremeForm(prev => ({ ...prev, marge: e.target.value }))}
                            placeholder="2.8"
                          />
                        </div>
                        <div>
                          <Label htmlFor="newBaremeVR">
                            {newBaremeForm.type === "standard" ? "Valeur résiduelle (%)" : "Valeur de reprise (%)"}
                          </Label>
                          <Input
                            id="newBaremeVR"
                            type="number"
                            step="0.1"
                            value={newBaremeForm.valeurResiduelle}
                            onChange={(e) => setNewBaremeForm(prev => ({ ...prev, valeurResiduelle: e.target.value }))}
                            placeholder="1.8"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="newBaremeDuree">Durée par défaut (mois)</Label>
                          <Input
                            id="newBaremeDuree"
                            type="number"
                            value={newBaremeForm.duree}
                            onChange={(e) => setNewBaremeForm(prev => ({ ...prev, duree: e.target.value }))}
                            placeholder="36"
                          />
                        </div>
                        <div>
                          <Label htmlFor="newBaremePLM">Premier Loyer Majoré (%)</Label>
                          <Input
                            id="newBaremePLM"
                            type="number"
                            step="0.1"
                            value={newBaremeForm.premierLoyerMajore}
                            onChange={(e) => setNewBaremeForm(prev => ({ ...prev, premierLoyerMajore: e.target.value }))}
                            placeholder="10.0"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="periodiciteModifiable"
                          checked={newBaremeForm.periodiciteModifiable}
                          onCheckedChange={(checked) => setNewBaremeForm(prev => ({ ...prev, periodiciteModifiable: checked as boolean }))}
                        />
                        <Label htmlFor="periodiciteModifiable">Périodicité modifiable</Label>
                      </div>
                    </div>
                  )}
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsBaremeDialogOpen(false)}>
                    Annuler
                  </Button>
                  {baremeSelectionMode === "existing" ? (
                    <Button 
                      onClick={() => setIsBaremeDialogOpen(false)}
                      disabled={!selectedBaremeId}
                    >
                      Sélectionner ce barème
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleCreateBareme}
                      disabled={!newBaremeForm.nom || !newBaremeForm.taux || !newBaremeForm.marge}
                    >
                      Créer le barème
                    </Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedBaremeId ? (
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                Barème sélectionné pour cette convention :
              </div>
              {(() => {
                const selectedBareme = baremes.find(b => b.id === selectedBaremeId);
                return selectedBareme ? (
                  <div className="p-4 border rounded-lg bg-primary/5 border-primary">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{selectedBareme.nom}</h4>
                          <CheckCircle className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            Taux: {selectedBareme.taux}%
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Marge: {selectedBareme.marge}%
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            VR: {selectedBareme.valeurResiduelle}%
                          </Badge>
                          <Badge variant={selectedBareme.type === "standard" ? "default" : "secondary"} className="text-xs">
                            {selectedBareme.type}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {selectedBareme.typologie}
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          ) : (
            <div className="p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg text-center">
              <p className="text-muted-foreground">
                Aucun barème sélectionné. Cliquez sur "Gérer les barèmes" pour choisir ou créer un barème.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Conventions Disponibles
            {selectedFournisseur && (
              <Badge variant="secondary">
                {selectedFournisseur.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredConventions.map(convention => (
              <div
                key={convention.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedConvention?.id === convention.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => onConventionSelect(convention)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{convention.nom}</h3>
                      {selectedConvention?.id === convention.id && (
                        <CheckCircle className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {convention.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        Taux: {convention.bareme.taux}%
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Marge: {convention.bareme.marge}%
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        VR: {convention.bareme.valeurResiduelle}%
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <Badge variant={convention.statut === "active" ? "default" : "secondary"}>
                        {convention.statut}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        {convention.dateFin 
                          ? `Jusqu'au ${convention.dateFin.toLocaleDateString()}`
                          : "Durée indéterminée"
                        }
                      </div>
                    </div>
                    <ConventionActions
                      convention={convention}
                      onReconduct={handleReconduct}
                      onResiliate={handleResiliate}
                      onCancel={handleCancel}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConventionSelector;
