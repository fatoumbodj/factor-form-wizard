
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Plus, 
  Package, 
  Upload, 
  Search, 
  ChevronDown, 
  ChevronRight,
  Trash2 
} from "lucide-react";
import { TypeProposition, Convention, Campagne } from "@/types/leasing";
import { MaterialData, ComponentData, FAMILLES_MATERIELS } from "@/types/material";
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

// Données de démonstration des matériels par fournisseur et catégorie
const MATERIELS_PAR_FOURNISSEUR = {
  "babacar-fils": {
    "Véhicules utilitaires": [
      { ref: "VU-001", designation: "Camionnette Ford Transit", prix: 15000000, disponible: true },
      { ref: "VU-002", designation: "Fourgon Renault Master", prix: 12000000, disponible: true },
      { ref: "VU-003", designation: "Camion Iveco Daily", prix: 20000000, disponible: false },
    ],
    "Véhicules particuliers": [
      { ref: "VP-001", designation: "Berline Toyota Corolla", prix: 8000000, disponible: true },
      { ref: "VP-002", designation: "SUV Hyundai Tucson", prix: 12000000, disponible: true },
    ]
  },
  "senegal-auto": {
    "Véhicules utilitaires": [
      { ref: "VU-101", designation: "Pick-up Mitsubishi L200", prix: 14000000, disponible: true },
      { ref: "VU-102", designation: "Minibus Mercedes Sprinter", prix: 25000000, disponible: true },
    ],
    "Matériels industriels": [
      { ref: "MI-001", designation: "Chariot élévateur Toyota", prix: 18000000, disponible: true },
      { ref: "MI-002", designation: "Compresseur Atlas Copco", prix: 5000000, disponible: true },
    ]
  },
  "sonacos": {
    "Matériels industriels": [
      { ref: "MI-101", designation: "Machine de production alimentaire", prix: 35000000, disponible: true },
      { ref: "MI-102", designation: "Ligne de conditionnement", prix: 50000000, disponible: true },
    ],
    "Équipements bureautique": [
      { ref: "EB-001", designation: "Imprimante industrielle HP", prix: 2000000, disponible: true },
      { ref: "EB-002", designation: "Photocopieur Canon", prix: 1500000, disponible: true },
    ]
  }
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
  const [selectedFournisseur, setSelectedFournisseur] = useState<string>("");
  const [selectedCategorie, setSelectedCategorie] = useState<string>("");
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [expandedMaterials, setExpandedMaterials] = useState<string[]>([]);

  const handleFournisseurChange = (fournisseur: string) => {
    setSelectedFournisseur(fournisseur);
    setSelectedCategorie("");
    setSelectedMaterials([]);
  };

  const handleCategorieChange = (categorie: string) => {
    setSelectedCategorie(categorie);
    setSelectedMaterials([]);
  };

  const handleMaterialSelect = (materialRef: string) => {
    const isSelected = selectedMaterials.includes(materialRef);
    if (isSelected) {
      setSelectedMaterials(selectedMaterials.filter(ref => ref !== materialRef));
    } else {
      setSelectedMaterials([...selectedMaterials, materialRef]);
    }
  };

  const handleAddSelectedMaterials = () => {
    const fournisseurData = MATERIELS_PAR_FOURNISSEUR[selectedFournisseur as keyof typeof MATERIELS_PAR_FOURNISSEUR];
    const categorieData = fournisseurData?.[selectedCategorie as keyof typeof fournisseurData];
    
    if (categorieData) {
      const newMaterials = selectedMaterials.map(ref => {
        const materielData = categorieData.find(m => m.ref === ref);
        if (materielData) {
          return {
            id: Date.now().toString() + Math.random(),
            referenceMateriel: materielData.ref,
            designation: materielData.designation,
            famille: selectedCategorie,
            marque: "Non spécifié",
            modele: "Non spécifié",
            numeroSerieChassis: "",
            anneeFabrication: new Date().getFullYear(),
            dateMiseEnService: new Date().toISOString().split('T')[0],
            dureeUtilisationEstimee: "",
            origineMateriel: "Importé" as const,
            statut: "En stock" as const,
            etatMateriel: "Neuf" as const,
            usage: "Professionnel" as const,
            dateAcquisition: new Date().toISOString().split('T')[0],
            valeurInitialeHT: materielData.prix,
            valeurInitialeTTC: materielData.prix * 1.18,
            valeurMarche: materielData.prix,
            fournisseur: selectedFournisseur,
            composants: []
          };
        }
        return null;
      }).filter(Boolean) as MaterialData[];
      
      onMaterialsChange([...materials, ...newMaterials]);
      setSelectedMaterials([]);
    }
  };

  const toggleMaterialExpansion = (materialId: string) => {
    const isExpanded = expandedMaterials.includes(materialId);
    if (isExpanded) {
      setExpandedMaterials(expandedMaterials.filter(id => id !== materialId));
    } else {
      setExpandedMaterials([...expandedMaterials, materialId]);
    }
  };

  const handleRemoveMaterial = (materialId: string) => {
    onMaterialsChange(materials.filter(m => m.id !== materialId));
  };

  const handleFileUpload = (file: File, type: "materials" | "components") => {
    console.log(`Uploading ${type} file:`, file.name);
    // Logique d'upload à implémenter
  };

  const getAvailableCategories = () => {
    if (!selectedFournisseur) return [];
    const fournisseurData = MATERIELS_PAR_FOURNISSEUR[selectedFournisseur as keyof typeof MATERIELS_PAR_FOURNISSEUR];
    return fournisseurData ? Object.keys(fournisseurData) : [];
  };

  const getAvailableMaterials = () => {
    if (!selectedFournisseur || !selectedCategorie) return [];
    const fournisseurData = MATERIELS_PAR_FOURNISSEUR[selectedFournisseur as keyof typeof MATERIELS_PAR_FOURNISSEUR];
    const categorieData = fournisseurData?.[selectedCategorie as keyof typeof fournisseurData];
    return categorieData || [];
  };

  const calculateTotalValue = () => {
    return materials.reduce((total, material) => {
      const materialValue = material.valeurInitialeHT;
      const componentsValue = (material.composants || []).reduce((sum, comp) => sum + comp.valeurInitialeHT, 0);
      return total + materialValue + componentsValue;
    }, 0);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Gestion des Matériels
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="selection" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="selection">Sélection</TabsTrigger>
              <TabsTrigger value="upload">Import</TabsTrigger>
              <TabsTrigger value="components">Composants</TabsTrigger>
            </TabsList>
            
            <TabsContent value="selection" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Fournisseur</label>
                  <Select value={selectedFournisseur} onValueChange={handleFournisseurChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un fournisseur" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFournisseurs.map(fournisseur => (
                        <SelectItem key={fournisseur} value={fournisseur}>
                          {fournisseur.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Catégorie matérielle</label>
                  <Select 
                    value={selectedCategorie} 
                    onValueChange={handleCategorieChange}
                    disabled={!selectedFournisseur}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableCategories().map(categorie => (
                        <SelectItem key={categorie} value={categorie}>
                          {categorie}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedFournisseur && selectedCategorie && (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox 
                            checked={selectedMaterials.length === getAvailableMaterials().length}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedMaterials(getAvailableMaterials().map(m => m.ref));
                              } else {
                                setSelectedMaterials([]);
                              }
                            }}
                          />
                        </TableHead>
                        <TableHead>Référence</TableHead>
                        <TableHead>Désignation</TableHead>
                        <TableHead>Prix HT</TableHead>
                        <TableHead>Statut</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getAvailableMaterials().map((materiel) => (
                        <TableRow key={materiel.ref}>
                          <TableCell>
                            <Checkbox 
                              checked={selectedMaterials.includes(materiel.ref)}
                              onCheckedChange={() => handleMaterialSelect(materiel.ref)}
                              disabled={!materiel.disponible}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{materiel.ref}</TableCell>
                          <TableCell>{materiel.designation}</TableCell>
                          <TableCell>{materiel.prix.toLocaleString()} FCFA</TableCell>
                          <TableCell>
                            <Badge variant={materiel.disponible ? "default" : "secondary"}>
                              {materiel.disponible ? "Disponible" : "Indisponible"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {selectedMaterials.length > 0 && (
                    <div className="p-4 bg-gray-50 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {selectedMaterials.length} matériel(s) sélectionné(s)
                        </span>
                        <Button onClick={handleAddSelectedMaterials}>
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter à la proposition
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="upload" className="space-y-4">
              <FileUploadSection
                title="Importer des matériels"
                onFileUpload={(file) => handleFileUpload(file, "materials")}
                acceptedFormats="csv, xlsx, xls"
                maxSize={5}
              />
            </TabsContent>
            
            <TabsContent value="components" className="space-y-4">
              <FileUploadSection
                title="Importer des composants"
                onFileUpload={(file) => handleFileUpload(file, "components")}
                acceptedFormats="csv, xlsx, xls"
                maxSize={5}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Liste des matériels ajoutés */}
      {materials.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Matériels ajoutés à la proposition</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Référence</TableHead>
                    <TableHead>Désignation</TableHead>
                    <TableHead>Fournisseur</TableHead>
                    <TableHead>Valeur HT</TableHead>
                    <TableHead>Composants</TableHead>
                    <TableHead className="w-12">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materials.map((material) => (
                    <>
                      <TableRow key={material.id}>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleMaterialExpansion(material.id)}
                          >
                            {expandedMaterials.includes(material.id) ? 
                              <ChevronDown className="h-4 w-4" /> : 
                              <ChevronRight className="h-4 w-4" />
                            }
                          </Button>
                        </TableCell>
                        <TableCell className="font-medium">{material.referenceMateriel}</TableCell>
                        <TableCell>{material.designation}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{material.fournisseur}</Badge>
                        </TableCell>
                        <TableCell>{material.valeurInitialeHT.toLocaleString()} FCFA</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {material.composants?.length || 0} composant(s)
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveMaterial(material.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      
                      {expandedMaterials.includes(material.id) && material.composants && (
                        <TableRow>
                          <TableCell colSpan={7} className="bg-gray-50">
                            <div className="p-4">
                              <h4 className="font-medium mb-2">Composants associés</h4>
                              {material.composants.length > 0 ? (
                                <div className="space-y-2">
                                  {material.composants.map((component) => (
                                    <div key={component.id} className="flex items-center justify-between bg-white p-2 rounded border">
                                      <div>
                                        <span className="font-medium">{component.designation}</span>
                                        <span className="text-sm text-gray-500 ml-2">
                                          {component.numeroComposant}
                                        </span>
                                      </div>
                                      <div className="text-right">
                                        <span className="text-sm">{component.valeurInitialeHT.toLocaleString()} FCFA</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500">Aucun composant associé</p>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {/* Total */}
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
              <div className="flex justify-between items-center">
                <span className="font-medium text-blue-800">Total général HT :</span>
                <span className="font-bold text-blue-800 text-lg">
                  {calculateTotalValue().toLocaleString()} FCFA
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MaterialManager;
