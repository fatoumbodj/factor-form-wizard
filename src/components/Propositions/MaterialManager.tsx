import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Minus, Edit } from "lucide-react";
import { TypeProposition, Convention, Campagne } from "@/types/leasing";

interface MaterialItem {
  id: string;
  type: "materiel" | "composant";
  fournisseur: string;
  reference: string;
  designation: string;
  categorie: string;
  montantHT: number;
  taux: number;
  qte: number;
  parentMaterialId?: string; // Pour lier les composants à un matériel
}

interface MaterialManagerProps {
  materials: MaterialItem[];
  onMaterialsChange: (materials: MaterialItem[]) => void;
  selectedFournisseurs: string[];
  onFournisseursChange: (fournisseurs: string[]) => void;
  availableFournisseurs: string[];
  typeProposition: TypeProposition | "classique" | null;
  selectedConvention?: Convention | null;
  selectedCampagne?: Campagne | null;
}

const CATEGORIES_DEMO = [
  "Véhicules",
  "Matériels Industriels", 
  "Équipements Bureautique",
  "Équipements Médicaux"
];

// Demo data pour références et désignations
const MATERIELS_DEMO = {
  "Sonacos": [
    { reference: "VH001", designation: "Véhicule utilitaire Peugeot" },
    { reference: "VH002", designation: "Camionnette Renault" }
  ],
  "Senegal-Auto": [
    { reference: "VP001", designation: "Voiture particulière Toyota" },
    { reference: "VP002", designation: "SUV Honda" }
  ],
  "Babacar & Fils": [
    { reference: "MI001", designation: "Machine industrielle" },
    { reference: "MI002", designation: "Équipement de production" }
  ],
  "Afrique Matériel": [
    { reference: "BUR001", designation: "Ordinateur portable" },
    { reference: "BUR002", designation: "Imprimante multifonction" }
  ]
};

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
  const [newMaterial, setNewMaterial] = useState<Partial<MaterialItem>>({
    type: "materiel",
    fournisseur: "",
    reference: "",
    designation: "",
    categorie: "",
    montantHT: 0,
    taux: 18,
    qte: 1
  });

  const [showCustomReference, setShowCustomReference] = useState(false);
  const [selectedMaterialForComponent, setSelectedMaterialForComponent] = useState<string | null>(null);
  const [addingNewMaterial, setAddingNewMaterial] = useState(false);

  const handleFournisseurSelect = (fournisseur: string) => {
    if (!selectedFournisseurs.includes(fournisseur)) {
      onFournisseursChange([...selectedFournisseurs, fournisseur]);
      if (!newMaterial.fournisseur) {
        setNewMaterial(prev => ({ ...prev, fournisseur }));
      }
    }
  };

  const handleRemoveFournisseur = (fournisseur: string) => {
    onFournisseursChange(selectedFournisseurs.filter(f => f !== fournisseur));
    if (newMaterial.fournisseur === fournisseur) {
      setNewMaterial(prev => ({ ...prev, fournisseur: "", reference: "", designation: "" }));
    }
  };

  const handleFournisseurChange = (fournisseur: string) => {
    setNewMaterial(prev => ({ 
      ...prev, 
      fournisseur,
      reference: "",
      designation: ""
    }));
    setShowCustomReference(false);
  };

  const handleReferenceChange = (reference: string) => {
    if (reference === "custom") {
      setShowCustomReference(true);
      setNewMaterial(prev => ({ 
        ...prev, 
        reference: "",
        designation: ""
      }));
      return;
    }

    const materielData = MATERIELS_DEMO[newMaterial.fournisseur as keyof typeof MATERIELS_DEMO]?.find(
      m => m.reference === reference
    );
    
    setNewMaterial(prev => ({ 
      ...prev, 
      reference,
      designation: materielData?.designation || ""
    }));
    setShowCustomReference(false);
  };

  const getAvailableReferences = () => {
    if (!newMaterial.fournisseur) return [];
    return MATERIELS_DEMO[newMaterial.fournisseur as keyof typeof MATERIELS_DEMO] || [];
  };

  const handleAddMaterial = () => {
    if (newMaterial.designation && newMaterial.fournisseur && newMaterial.reference) {
      const material: MaterialItem = {
        id: Date.now().toString(),
        type: "materiel",
        fournisseur: newMaterial.fournisseur,
        reference: newMaterial.reference,
        designation: newMaterial.designation,
        categorie: newMaterial.categorie || "",
        montantHT: newMaterial.montantHT || 0,
        taux: newMaterial.taux || 18,
        qte: newMaterial.qte || 1
      };
      onMaterialsChange([...materials, material]);
      resetNewMaterialForm();
      setAddingNewMaterial(false);
    }
  };

  const handleAddComponent = (parentMaterialId?: string) => {
    if (newMaterial.designation && newMaterial.fournisseur && newMaterial.reference) {
      const component: MaterialItem = {
        id: Date.now().toString(),
        type: "composant",
        fournisseur: newMaterial.fournisseur,
        reference: newMaterial.reference,
        designation: newMaterial.designation,
        categorie: newMaterial.categorie || "",
        montantHT: newMaterial.montantHT || 0,
        taux: newMaterial.taux || 18,
        qte: newMaterial.qte || 1,
        parentMaterialId
      };
      onMaterialsChange([...materials, component]);
      resetNewMaterialForm();
      setSelectedMaterialForComponent(null);
    }
  };

  const resetNewMaterialForm = () => {
    setNewMaterial({
      type: "materiel",
      fournisseur: selectedFournisseurs[0] || "",
      reference: "",
      designation: "",
      categorie: "",
      montantHT: 0,
      taux: 18,
      qte: 1
    });
    setShowCustomReference(false);
  };

  const handleRemoveMaterial = (id: string) => {
    // Supprimer le matériel et tous ses composants
    onMaterialsChange(materials.filter(m => m.id !== id && m.parentMaterialId !== id));
  };

  const handleRemoveComponent = (id: string) => {
    onMaterialsChange(materials.filter(m => m.id !== id));
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    onMaterialsChange(materials.map(m => 
      m.id === id ? { ...m, qte: Math.max(1, m.qte + delta) } : m
    ));
  };

  const getTypeLabel = () => {
    if (typeProposition === "classique") return "Standard";
    if (typeProposition === "convention") return `Convention: ${selectedConvention?.nom}`;
    if (typeProposition === "campagne") return `Campagne: ${selectedCampagne?.nom}`;
    return "";
  };

  // Grouper les matériels et leurs composants
  const groupedMaterials = () => {
    const materiels = materials.filter(m => m.type === "materiel");
    const composants = materials.filter(m => m.type === "composant");
    
    return materiels.map(materiel => ({
      materiel,
      composants: composants.filter(c => c.parentMaterialId === materiel.id)
    }));
  };

  const renderMaterialForm = (isForComponent = false, parentMaterialId?: string) => (
    <div className="p-4 bg-gray-50 rounded space-y-4">
      <h4 className="font-medium">
        {isForComponent ? 
          `Ajouter un composant au matériel ${materials.find(m => m.id === parentMaterialId)?.designation}` : 
          "Ajouter un nouveau matériel"
        }
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Fournisseur</Label>
          <Select value={newMaterial.fournisseur} onValueChange={handleFournisseurChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir un fournisseur" />
            </SelectTrigger>
            <SelectContent>
              {selectedFournisseurs.map(fournisseur => (
                <SelectItem key={fournisseur} value={fournisseur}>
                  {fournisseur}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Référence</Label>
          <Select value={newMaterial.reference} onValueChange={handleReferenceChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir une référence" />
            </SelectTrigger>
            <SelectContent>
              {getAvailableReferences().map(ref => (
                <SelectItem key={ref.reference} value={ref.reference}>
                  {ref.reference}
                </SelectItem>
              ))}
              <SelectItem value="custom">
                <div className="flex items-center">
                  <Edit className="h-4 w-4 mr-2" />
                  Nouvelle référence
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Saisie manuelle de référence */}
      {showCustomReference && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Nouvelle référence *</Label>
            <Input
              value={newMaterial.reference}
              onChange={(e) => setNewMaterial(prev => ({ ...prev, reference: e.target.value }))}
              placeholder="Saisir la référence"
            />
          </div>
          <div>
            <Label>Désignation *</Label>
            <Input
              value={newMaterial.designation}
              onChange={(e) => setNewMaterial(prev => ({ ...prev, designation: e.target.value }))}
              placeholder="Saisir la désignation"
            />
          </div>
        </div>
      )}

      {/* Désignation automatique ou manuelle */}
      {!showCustomReference && (
        <div>
          <Label>Désignation</Label>
          <Input
            value={newMaterial.designation}
            onChange={(e) => setNewMaterial(prev => ({ ...prev, designation: e.target.value }))}
            placeholder="Désignation automatique selon référence"
            readOnly={!showCustomReference}
            className={!showCustomReference ? "bg-white" : ""}
          />
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Catégorie</Label>
          <Select value={newMaterial.categorie} onValueChange={(value) => setNewMaterial(prev => ({ ...prev, categorie: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES_DEMO.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Montant HT (FCFA)</Label>
          <Input
            type="number"
            value={newMaterial.montantHT}
            onChange={(e) => setNewMaterial(prev => ({ ...prev, montantHT: parseFloat(e.target.value) || 0 }))}
          />
        </div>
        <div>
          <Label>TVA (%)</Label>
          <Input
            type="number"
            value={newMaterial.taux}
            onChange={(e) => setNewMaterial(prev => ({ ...prev, taux: parseFloat(e.target.value) || 0 }))}
          />
        </div>
      </div>

      {/* Boutons d'ajout */}
      <div className="flex gap-2">
        {isForComponent ? (
          <>
            <Button 
              onClick={() => handleAddComponent(parentMaterialId)} 
              className="bg-green-600"
              disabled={!newMaterial.designation || !newMaterial.fournisseur || !newMaterial.reference}
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter le composant
            </Button>
            <Button 
              onClick={() => {
                setSelectedMaterialForComponent(null);
                resetNewMaterialForm();
              }} 
              variant="outline"
            >
              Annuler
            </Button>
          </>
        ) : (
          <>
            <Button 
              onClick={handleAddMaterial} 
              className="bg-blue-600"
              disabled={!newMaterial.designation || !newMaterial.fournisseur || !newMaterial.reference}
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter le matériel
            </Button>
            <Button 
              onClick={() => {
                setAddingNewMaterial(false);
                resetNewMaterialForm();
              }} 
              variant="outline"
            >
              Annuler
            </Button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Matériel et Composants à financer</CardTitle>
        {typeProposition && (
          <div className="text-sm text-muted-foreground">
            Type: {getTypeLabel()}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sélection fournisseur */}
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
          
          {/* Fournisseurs sélectionnés */}
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

        {/* Bouton pour ajouter un nouveau matériel */}
        {!addingNewMaterial && !selectedMaterialForComponent && (
          <div className="flex justify-center">
            <Button 
              onClick={() => setAddingNewMaterial(true)}
              className="bg-blue-600"
              disabled={selectedFournisseurs.length === 0}
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un nouveau matériel
            </Button>
          </div>
        )}

        {/* Formulaire d'ajout de matériel */}
        {addingNewMaterial && renderMaterialForm(false)}

        {/* Formulaire d'ajout de composant */}
        {selectedMaterialForComponent && renderMaterialForm(true, selectedMaterialForComponent)}

        {/* Liste des matériels groupés */}
        {groupedMaterials().length > 0 && (
          <div className="space-y-6">
            <h4 className="font-medium">Matériels et composants ajoutés</h4>
            
            {groupedMaterials().map(({ materiel, composants }) => (
              <div key={materiel.id} className="border rounded-lg p-4 space-y-3">
                {/* En-tête du matériel */}
                <div className="flex items-center justify-between bg-blue-50 p-3 rounded">
                  <div className="flex items-center gap-4">
                    <Badge variant="default">Matériel</Badge>
                    <div>
                      <div className="font-medium">{materiel.designation}</div>
                      <div className="text-sm text-gray-600">
                        {materiel.fournisseur} - {materiel.reference}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{materiel.montantHT.toLocaleString()} FCFA</span>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setSelectedMaterialForComponent(materiel.id);
                        setAddingNewMaterial(false);
                      }}
                      disabled={selectedMaterialForComponent === materiel.id || addingNewMaterial}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter composant
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleRemoveMaterial(materiel.id)}>
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>

                {/* Composants du matériel */}
                {composants.length > 0 && (
                  <div className="ml-4 space-y-2">
                    <div className="text-sm font-medium text-gray-700">Composants :</div>
                    {composants.map(composant => (
                      <div key={composant.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <div className="flex items-center gap-4">
                          <Badge variant="secondary" className="text-xs">Composant</Badge>
                          <div>
                            <div className="text-sm font-medium">{composant.designation}</div>
                            <div className="text-xs text-gray-600">
                              {composant.fournisseur} - {composant.reference}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Button size="sm" variant="outline" onClick={() => handleUpdateQuantity(composant.id, -1)}>
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">{composant.qte}</span>
                            <Button size="sm" variant="outline" onClick={() => handleUpdateQuantity(composant.id, 1)}>
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <span className="text-sm font-medium">{composant.montantHT.toLocaleString()} FCFA</span>
                          <Button size="sm" variant="outline" onClick={() => handleRemoveComponent(composant.id)}>
                            <Trash2 className="h-3 w-3 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Total du matériel + composants */}
                <div className="bg-blue-100 p-2 rounded text-right">
                  <span className="text-sm font-medium text-blue-800">
                    Total matériel : {(materiel.montantHT * materiel.qte + 
                      composants.reduce((sum, c) => sum + (c.montantHT * c.qte), 0)).toLocaleString()} FCFA
                  </span>
                </div>
              </div>
            ))}
            
            {/* Total général */}
            <div className="bg-blue-50 p-3 rounded">
              <div className="flex justify-between items-center">
                <span className="font-medium text-blue-800">Total général HT :</span>
                <span className="font-bold text-blue-800">
                  {materials.reduce((sum, m) => sum + (m.montantHT * m.qte), 0).toLocaleString()} FCFA
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MaterialManager;
