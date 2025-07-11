
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Plus, 
  Package, 
  Search, 
  ChevronDown, 
  ChevronRight,
  Eye,
  ToggleLeft,
  Download
} from "lucide-react";
import { MaterialData, ComponentData } from "@/types/material";

interface MaterialTableManagerProps {
  materials: MaterialData[];
  onMaterialsChange: (materials: MaterialData[]) => void;
}

// Données de référence pour la simulation
const REFERENCES_DATA = {
  "senegal-auto": {
    "Véhicules particuliers": [
      { ref: "SA-VP-001", designation: "Toyota Corolla 2023", montantHT: 15000000 },
      { ref: "SA-VP-002", designation: "Nissan Sentra 2023", montantHT: 12000000 },
      { ref: "SA-VP-003", designation: "Hyundai Accent 2023", montantHT: 11500000 }
    ],
    "Véhicules utilitaires": [
      { ref: "SA-VU-001", designation: "Toyota Hilux 2023", montantHT: 20000000 },
      { ref: "SA-VU-002", designation: "Ford Ranger 2023", montantHT: 22000000 }
    ],
    "Composants": [
      { ref: "SA-CP-001", designation: "Moteur Toyota 2.0L", montantHT: 3000000 },
      { ref: "SA-CP-002", designation: "Transmission automatique", montantHT: 2500000 },
      { ref: "SA-CP-003", designation: "Système électronique", montantHT: 1500000 }
    ]
  },
  "babacar-fils": {
    "Véhicules particuliers": [
      { ref: "BF-VP-001", designation: "Peugeot 308 2023", montantHT: 16000000 },
      { ref: "BF-VP-002", designation: "Renault Clio 2023", montantHT: 13000000 }
    ],
    "Matériels industriels": [
      { ref: "BF-MI-001", designation: "Groupe électrogène 100KVA", montantHT: 8000000 },
      { ref: "BF-MI-002", designation: "Compresseur industriel", montantHT: 5000000 }
    ],
    "Composants": [
      { ref: "BF-CP-001", designation: "Moteur diesel 50CV", montantHT: 2800000 },
      { ref: "BF-CP-002", designation: "Alternateur industriel", montantHT: 800000 },
      { ref: "BF-CP-003", designation: "Système hydraulique", montantHT: 1200000 }
    ]
  }
};

const MaterialTableManager = ({ 
  materials, 
  onMaterialsChange
}: MaterialTableManagerProps) => {
  const [expandedMaterials, setExpandedMaterials] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showComponentForm, setShowComponentForm] = useState<string | null>(null);
  const [newMaterial, setNewMaterial] = useState({
    fournisseur: "",
    reference: "",
    designation: "",
    categorie: "",
    montantHT: 0,
    tva: 18,
    taxeSupp: 0
  });
  const [newComponent, setNewComponent] = useState({
    fournisseur: "",
    reference: "",
    designation: "",
    categorie: "",
    montantHT: 0,
    tva: 18,
    taxeSupp: 0
  });

  const toggleMaterialExpansion = (materialId: string) => {
    setExpandedMaterials(prev => 
      prev.includes(materialId) 
        ? prev.filter(id => id !== materialId)
        : [...prev, materialId]
    );
  };

  // Récupérer les références disponibles selon le fournisseur et la catégorie
  const getAvailableReferences = (fournisseur: string, categorie: string) => {
    if (!fournisseur || !categorie) return [];
    return REFERENCES_DATA[fournisseur as keyof typeof REFERENCES_DATA]?.[categorie] || [];
  };

  // Gérer la sélection d'une référence pour matériel
  const handleReferenceSelect = (refValue: string) => {
    const availableRefs = getAvailableReferences(newMaterial.fournisseur, newMaterial.categorie);
    const selectedRef = availableRefs.find(item => item.ref === refValue);
    
    if (selectedRef) {
      setNewMaterial(prev => ({
        ...prev,
        reference: selectedRef.ref,
        designation: selectedRef.designation,
        montantHT: selectedRef.montantHT
      }));
    }
  };

  // Gérer la sélection d'une référence pour composant
  const handleComponentReferenceSelect = (refValue: string) => {
    const availableRefs = getAvailableReferences(newComponent.fournisseur, "Composants");
    const selectedRef = availableRefs.find(item => item.ref === refValue);
    
    if (selectedRef) {
      setNewComponent(prev => ({
        ...prev,
        reference: selectedRef.ref,
        designation: selectedRef.designation,
        montantHT: selectedRef.montantHT
      }));
    }
  };

  const handleAddMaterial = () => {
    if (!newMaterial.fournisseur || !newMaterial.designation || !newMaterial.categorie || !newMaterial.reference) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const material: MaterialData = {
      id: Date.now().toString(),
      referenceMateriel: newMaterial.reference,
      designation: newMaterial.designation,
      famille: newMaterial.categorie,
      marque: "Non spécifié",
      modele: "Non spécifié",
      numeroSerieChassis: "",
      anneeFabrication: new Date().getFullYear(),
      dateMiseEnService: new Date().toISOString().split('T')[0],
      dureeUtilisationEstimee: "",
      origineMateriel: "Importé",
      statut: "En stock",
      etatMateriel: "Neuf",
      usage: "Professionnel",
      dateAcquisition: new Date().toISOString().split('T')[0],
      valeurInitialeHT: newMaterial.montantHT,
      valeurInitialeTTC: newMaterial.montantHT * (1 + newMaterial.tva / 100),
      valeurMarche: newMaterial.montantHT,
      fournisseur: newMaterial.fournisseur,
      composants: []
    };

    onMaterialsChange([...materials, material]);
    
    // Reset du formulaire
    setNewMaterial({
      fournisseur: "",
      reference: "",
      designation: "",
      categorie: "",
      montantHT: 0,
      tva: 18,
      taxeSupp: 0
    });
    setShowAddForm(false);
  };

  const handleAddComponent = (materialId: string) => {
    if (!newComponent.fournisseur || !newComponent.designation || !newComponent.reference) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const component: ComponentData = {
      id: Date.now().toString(),
      numeroComposant: newComponent.reference,
      designation: newComponent.designation,
      familleComposant: "Composants",
      marque: "Non spécifié",
      modele: "Non spécifié",
      anneeFabrication: new Date().getFullYear(),
      dateMiseEnService: new Date().toISOString().split('T')[0],
      dureeUtilisationEstimee: "",
      dureeUtilisationType: "heures",
      fournisseur: newComponent.fournisseur,
      dateAcquisition: new Date().toISOString().split('T')[0],
      valeurInitialeHT: newComponent.montantHT,
      valeurInitialeTTC: newComponent.montantHT * (1 + newComponent.tva / 100),
      materielParentId: materialId
    };

    const updatedMaterials = materials.map(material => {
      if (material.id === materialId) {
        return {
          ...material,
          composants: [...(material.composants || []), component]
        };
      }
      return material;
    });

    onMaterialsChange(updatedMaterials);
    setNewComponent({
      fournisseur: "",
      reference: "",
      designation: "",
      categorie: "",
      montantHT: 0,
      tva: 18,
      taxeSupp: 0
    });
    setShowComponentForm(null);
  };

  const filteredMaterials = materials.filter(material =>
    material.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.referenceMateriel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-blue-600 text-white">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Matériel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="tout" className="w-full">
            <div className="border-b bg-blue-50">
              <div className="flex items-center justify-between p-4">
                <TabsList className="bg-white">
                  <TabsTrigger value="tout" className="text-blue-600">Tout</TabsTrigger>
                  <TabsTrigger value="active" className="text-blue-600">Actif</TabsTrigger>
                  <TabsTrigger value="inactive" className="text-blue-600">Inactif</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter Nouveau Matériel
                  </Button>
                  <Button variant="outline" className="border-gray-300">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </div>
            </div>

            <TabsContent value="tout" className="space-y-0 m-0">
              {/* Formulaire d'ajout matériel */}
              {showAddForm && (
                <div className="border-b bg-blue-50 p-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Fournisseur *</Label>
                        <Select 
                          value={newMaterial.fournisseur} 
                          onValueChange={(value) => {
                            setNewMaterial(prev => ({ 
                              ...prev, 
                              fournisseur: value, 
                              categorie: "", 
                              reference: "", 
                              designation: "", 
                              montantHT: 0 
                            }));
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir un fournisseur" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="senegal-auto">Sénégal-Auto</SelectItem>
                            <SelectItem value="babacar-fils">Babacar & Fils</SelectItem>
                            <SelectItem value="sonacos">SONACOS</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Catégorie *</Label>
                        <Select 
                          value={newMaterial.categorie} 
                          onValueChange={(value) => {
                            setNewMaterial(prev => ({ 
                              ...prev, 
                              categorie: value, 
                              reference: "", 
                              designation: "", 
                              montantHT: 0 
                            }));
                          }}
                          disabled={!newMaterial.fournisseur}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir une catégorie" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Véhicules particuliers">Véhicules particuliers</SelectItem>
                            <SelectItem value="Véhicules utilitaires">Véhicules utilitaires</SelectItem>
                            <SelectItem value="Matériels industriels">Matériels industriels</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Référence *</Label>
                        <Select 
                          value={newMaterial.reference} 
                          onValueChange={handleReferenceSelect}
                          disabled={!newMaterial.fournisseur || !newMaterial.categorie}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir une référence" />
                          </SelectTrigger>
                          <SelectContent>
                            {getAvailableReferences(newMaterial.fournisseur, newMaterial.categorie).map(item => (
                              <SelectItem key={item.ref} value={item.ref}>
                                {item.ref} - {item.designation}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Désignation *</Label>
                        <Input
                          placeholder="Désignation automatique"
                          value={newMaterial.designation}
                          readOnly
                          className="bg-gray-100"
                        />
                      </div>
                      <div>
                        <Label>Montant HT (XAF) *</Label>
                        <Input
                          type="number"
                          placeholder="Montant automatique"
                          value={newMaterial.montantHT}
                          readOnly
                          className="bg-gray-100"
                        />
                      </div>
                      <div>
                        <Label>Taxe Supp. (%)</Label>
                        <Input
                          type="number"
                          placeholder="Taxe supplémentaire"
                          value={newMaterial.taxeSupp}
                          onChange={(e) => setNewMaterial(prev => ({ ...prev, taxeSupp: parseFloat(e.target.value) || 0 }))}
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button onClick={handleAddMaterial} className="bg-blue-600 hover:bg-blue-700">
                        Ajouter le matériel
                      </Button>
                      <Button variant="outline" onClick={() => setShowAddForm(false)}>
                        Annuler
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tableau principal des matériels */}
              <div className="border rounded-none">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-blue-50 border-b-2">
                      <TableHead className="w-16">Actions</TableHead>
                      <TableHead className="font-semibold">Matériel</TableHead>
                      <TableHead className="font-semibold">Fournisseur</TableHead>
                      <TableHead className="font-semibold">Catégorie</TableHead>
                      <TableHead className="font-semibold">Montant HT (XAF)</TableHead>
                      <TableHead className="font-semibold">Taxe (%)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMaterials.length > 0 ? (
                      filteredMaterials.map((material) => (
                        <>
                          {/* Ligne principale du matériel */}
                          <TableRow key={material.id} className="hover:bg-gray-50">
                            <TableCell className="p-2">
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleMaterialExpansion(material.id)}
                                  className="p-1"
                                >
                                  {expandedMaterials.includes(material.id) ? 
                                    <ChevronDown className="h-4 w-4" /> : 
                                    <ChevronRight className="h-4 w-4" />
                                  }
                                </Button>
                                <Button variant="ghost" size="sm" className="p-1">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="p-1">
                                  <ToggleLeft className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{material.designation}</div>
                                <div className="text-sm text-gray-500">{material.referenceMateriel}</div>
                              </div>
                            </TableCell>
                            <TableCell>{material.fournisseur}</TableCell>
                            <TableCell>{material.famille}</TableCell>
                            <TableCell>{material.valeurInitialeHT?.toLocaleString()} XAF</TableCell>
                            <TableCell>18%</TableCell>
                          </TableRow>
                          
                          {/* Section des composants (sous-tableau) */}
                          {expandedMaterials.includes(material.id) && (
                            <TableRow>
                              <TableCell colSpan={6} className="p-0">
                                <div className="border-l-4 border-blue-500 bg-blue-50">
                                  {/* En-tête des composants */}
                                  <div className="bg-blue-600 text-white p-3">
                                    <div className="flex items-center justify-between">
                                      <h4 className="font-semibold flex items-center gap-2">
                                        <Package className="h-4 w-4" />
                                        Composants
                                      </h4>
                                      <div className="flex items-center gap-2">
                                        <Button 
                                          size="sm" 
                                          className="bg-blue-700 hover:bg-blue-800 text-white"
                                          onClick={() => setShowComponentForm(material.id)}
                                        >
                                          <Plus className="h-4 w-4 mr-2" />
                                          Ajouter Nouveau Composant
                                        </Button>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Formulaire d'ajout composant */}
                                  {showComponentForm === material.id && (
                                    <div className="bg-white border-b p-4">
                                      <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                          <div>
                                            <Label>Fournisseur *</Label>
                                            <Select 
                                              value={newComponent.fournisseur} 
                                              onValueChange={(value) => {
                                                setNewComponent(prev => ({ 
                                                  ...prev, 
                                                  fournisseur: value, 
                                                  reference: "", 
                                                  designation: "", 
                                                  montantHT: 0 
                                                }));
                                              }}
                                            >
                                              <SelectTrigger>
                                                <SelectValue placeholder="Choisir un fournisseur" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="senegal-auto">Sénégal-Auto</SelectItem>
                                                <SelectItem value="babacar-fils">Babacar & Fils</SelectItem>
                                                <SelectItem value="sonacos">SONACOS</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                          <div>
                                            <Label>Référence *</Label>
                                            <Select 
                                              value={newComponent.reference} 
                                              onValueChange={handleComponentReferenceSelect}
                                              disabled={!newComponent.fournisseur}
                                            >
                                              <SelectTrigger>
                                                <SelectValue placeholder="Choisir une référence" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {getAvailableReferences(newComponent.fournisseur, "Composants").map(item => (
                                                  <SelectItem key={item.ref} value={item.ref}>
                                                    {item.ref} - {item.designation}
                                                  </SelectItem>
                                                ))}
                                              </SelectContent>
                                            </Select>
                                          </div>
                                          <div>
                                            <Label>Désignation *</Label>
                                            <Input
                                              placeholder="Désignation automatique"
                                              value={newComponent.designation}
                                              readOnly
                                              className="bg-gray-100"
                                            />
                                          </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div>
                                            <Label>Montant HT (XAF) *</Label>
                                            <Input
                                              type="number"
                                              placeholder="Montant automatique"
                                              value={newComponent.montantHT}
                                              readOnly
                                              className="bg-gray-100"
                                            />
                                          </div>
                                          <div>
                                            <Label>Taxe Supp. (%)</Label>
                                            <Input
                                              type="number"
                                              placeholder="Taxe supplémentaire"
                                              value={newComponent.taxeSupp}
                                              onChange={(e) => setNewComponent(prev => ({ ...prev, taxeSupp: parseFloat(e.target.value) || 0 }))}
                                            />
                                          </div>
                                        </div>
                                        
                                        <div className="flex gap-2">
                                          <Button onClick={() => handleAddComponent(material.id)} className="bg-blue-600 hover:bg-blue-700">
                                            Ajouter le composant
                                          </Button>
                                          <Button variant="outline" onClick={() => setShowComponentForm(null)}>
                                            Annuler
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Tableau des composants */}
                                  <Table>
                                    <TableHeader>
                                      <TableRow className="bg-blue-100">
                                        <TableHead className="w-16">Actions</TableHead>
                                        <TableHead>Composant</TableHead>
                                        <TableHead>Fournisseur</TableHead>
                                        <TableHead>Catégorie</TableHead>
                                        <TableHead>Montant HT (XAF)</TableHead>
                                        <TableHead>Taxe (%)</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {material.composants && material.composants.length > 0 ? (
                                        material.composants.map((component) => (
                                          <TableRow key={component.id} className="bg-white hover:bg-blue-25">
                                            <TableCell className="p-2">
                                              <div className="flex items-center gap-1">
                                                <Button variant="ghost" size="sm" className="p-1">
                                                  <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm" className="p-1">
                                                  <ToggleLeft className="h-4 w-4" />
                                                </Button>
                                              </div>
                                            </TableCell>
                                            <TableCell>
                                              <div>
                                                <div className="font-medium">{component.designation}</div>
                                                <div className="text-sm text-gray-500">{component.numeroComposant}</div>
                                              </div>
                                            </TableCell>
                                            <TableCell>{component.fournisseur}</TableCell>
                                            <TableCell>Composants</TableCell>
                                            <TableCell>{component.valeurInitialeHT?.toLocaleString()} XAF</TableCell>
                                            <TableCell>18%</TableCell>
                                          </TableRow>
                                        ))
                                      ) : (
                                        <TableRow>
                                          <TableCell colSpan={6} className="text-center text-gray-500 py-4 bg-white">
                                            Aucun composant ajouté
                                          </TableCell>
                                        </TableRow>
                                      )}
                                    </TableBody>
                                  </Table>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          Aucun matériel ajouté. Cliquez sur "Ajouter Nouveau Matériel" pour commencer.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="active">
              <div className="text-center py-8 text-gray-500">
                Filtres pour matériels actifs - à implémenter
              </div>
            </TabsContent>

            <TabsContent value="inactive">
              <div className="text-center py-8 text-gray-500">
                Filtres pour matériels inactifs - à implémenter
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaterialTableManager;
