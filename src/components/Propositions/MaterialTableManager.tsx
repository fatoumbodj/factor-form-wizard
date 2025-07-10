
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
  Trash2,
  Eye,
  ToggleLeft,
  ToggleRight,
  Download
} from "lucide-react";
import { MaterialData, ComponentData } from "@/types/material";

interface MaterialTableManagerProps {
  materials: MaterialData[];
  onMaterialsChange: (materials: MaterialData[]) => void;
}

const MaterialTableManager = ({ 
  materials, 
  onMaterialsChange
}: MaterialTableManagerProps) => {
  const [expandedMaterials, setExpandedMaterials] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    fournisseur: "",
    reference: "",
    designation: "",
    categorie: "",
    montantHT: 0,
    tva: 18
  });

  const toggleMaterialExpansion = (materialId: string) => {
    setExpandedMaterials(prev => 
      prev.includes(materialId) 
        ? prev.filter(id => id !== materialId)
        : [...prev, materialId]
    );
  };

  const handleAddMaterial = () => {
    if (!newMaterial.fournisseur || !newMaterial.designation || !newMaterial.categorie) {
      return;
    }

    const material: MaterialData = {
      id: Date.now().toString(),
      referenceMateriel: newMaterial.reference || `MAT-${Date.now()}`,
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
    setNewMaterial({
      fournisseur: "",
      reference: "",
      designation: "",
      categorie: "",
      montantHT: 0,
      tva: 18
    });
    setShowAddForm(false);
  };

  const handleRemoveMaterial = (materialId: string) => {
    onMaterialsChange(materials.filter(m => m.id !== materialId));
  };

  const filteredMaterials = materials.filter(material =>
    material.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.referenceMateriel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Matériel et Composants à financer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="materials" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="materials">Tout</TabsTrigger>
              <TabsTrigger value="active">Actif</TabsTrigger>
            </TabsList>
            
            <TabsContent value="materials" className="space-y-4">
              {/* Barre d'actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Matériel
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>

              {/* Formulaire d'ajout */}
              {showAddForm && (
                <Card className="border-2 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Ajouter un nouveau matériel</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Fournisseur</Label>
                        <Select value={newMaterial.fournisseur} onValueChange={(value) => setNewMaterial(prev => ({ ...prev, fournisseur: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sénégal-Auto" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="senegal-auto">Sénégal-Auto</SelectItem>
                            <SelectItem value="babacar-fils">Babacar & Fils</SelectItem>
                            <SelectItem value="sonacos">SONACOS</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Référence</Label>
                        <Input
                          placeholder="Choisir une référence"
                          value={newMaterial.reference}
                          onChange={(e) => setNewMaterial(prev => ({ ...prev, reference: e.target.value }))}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Désignation</Label>
                      <Input
                        placeholder="Désignation automatique selon référence"
                        value={newMaterial.designation}
                        onChange={(e) => setNewMaterial(prev => ({ ...prev, designation: e.target.value }))}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Catégorie</Label>
                        <Select value={newMaterial.categorie} onValueChange={(value) => setNewMaterial(prev => ({ ...prev, categorie: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Catégorie" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Véhicules particuliers">Véhicules particuliers</SelectItem>
                            <SelectItem value="Véhicules utilitaires">Véhicules utilitaires</SelectItem>
                            <SelectItem value="Matériels industriels">Matériels industriels</SelectItem>
                            <SelectItem value="Équipements bureautique">Équipements bureautique</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Montant HT (FCFA)</Label>
                        <Input
                          type="number"
                          value={newMaterial.montantHT}
                          onChange={(e) => setNewMaterial(prev => ({ ...prev, montantHT: parseInt(e.target.value) || 0 }))}
                        />
                      </div>
                      <div>
                        <Label>TVA (%)</Label>
                        <Input
                          type="number"
                          value={newMaterial.tva}
                          onChange={(e) => setNewMaterial(prev => ({ ...prev, tva: parseInt(e.target.value) || 18 }))}
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
                  </CardContent>
                </Card>
              )}

              {/* Tableau des matériels */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-purple-50">
                      <TableHead className="w-12">Actions</TableHead>
                      <TableHead>Matériel</TableHead>
                      <TableHead>Poids %</TableHead>
                      <TableHead>Score par Défaut</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date de création</TableHead>
                      <TableHead>Dernière mise à jour</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMaterials.map((material) => (
                      <>
                        <TableRow key={material.id} className="hover:bg-gray-50">
                          <TableCell className="flex items-center gap-2">
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
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <ToggleLeft className="h-4 w-4" />
                            </Button>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{material.designation}</div>
                              <div className="text-sm text-gray-500">{material.fournisseur} - {material.referenceMateriel}</div>
                            </div>
                          </TableCell>
                          <TableCell>1</TableCell>
                          <TableCell>1</TableCell>
                          <TableCell>
                            <Badge variant="destructive">
                              INACTIVE
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{new Date().toLocaleDateString('fr-FR')}</TableCell>
                          <TableCell className="text-sm">{new Date().toLocaleDateString('fr-FR')}</TableCell>
                        </TableRow>
                        
                        {expandedMaterials.includes(material.id) && (
                          <TableRow>
                            <TableCell colSpan={7} className="bg-orange-50 border-l-4 border-orange-500">
                              <div className="p-4">
                                <div className="flex items-center justify-between mb-4">
                                  <h4 className="font-medium text-orange-800">Sous-Matériels (Composants)</h4>
                                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add New SubMaterial
                                  </Button>
                                </div>
                                
                                <Table>
                                  <TableHeader>
                                    <TableRow className="bg-orange-100">
                                      <TableHead>Actions</TableHead>
                                      <TableHead>Composant</TableHead>
                                      <TableHead>Poids %</TableHead>
                                      <TableHead>Score par Défaut</TableHead>
                                      <TableHead>Statut</TableHead>
                                      <TableHead>Date de création</TableHead>
                                      <TableHead>Dernière mise à jour</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {material.composants && material.composants.length > 0 ? (
                                      material.composants.map((component) => (
                                        <TableRow key={component.id}>
                                          <TableCell className="flex items-center gap-2">
                                            <Button variant="ghost" size="sm">
                                              <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm">
                                              <ToggleLeft className="h-4 w-4" />
                                            </Button>
                                          </TableCell>
                                          <TableCell>
                                            <div>
                                              <div className="font-medium">{component.designation}</div>
                                              <div className="text-sm text-gray-500">{component.numeroComposant}</div>
                                            </div>
                                          </TableCell>
                                          <TableCell>1</TableCell>
                                          <TableCell>1</TableCell>
                                          <TableCell>
                                            <Badge variant="destructive">
                                              INACTIVE
                                            </Badge>
                                          </TableCell>
                                          <TableCell className="text-sm">{new Date().toLocaleDateString('fr-FR')}</TableCell>
                                          <TableCell className="text-sm">{new Date().toLocaleDateString('fr-FR')}</TableCell>
                                        </TableRow>
                                      ))
                                    ) : (
                                      <TableRow>
                                        <TableCell colSpan={7} className="text-center text-gray-500 py-4">
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
                    ))}
                  </TableBody>
                </Table>
                
                {filteredMaterials.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Aucun matériel ajouté. Cliquez sur "Add New Matériel" pour commencer.
                  </div>
                )}
              </div>

              {/* Section des matériels ajoutés */}
              {materials.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Matériels et composants ajoutés</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {materials.map((material) => (
                        <div key={material.id} className="flex items-center justify-between p-4 border rounded-lg bg-blue-50">
                          <div className="flex items-center gap-4">
                            <Badge className="bg-blue-800">Matériel</Badge>
                            <div>
                              <div className="font-medium">{material.designation}</div>
                              <div className="text-sm text-gray-600">{material.fournisseur} - {material.referenceMateriel}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="font-bold">{material.valeurInitialeHT.toLocaleString()} FCFA</div>
                              <Button variant="link" className="text-blue-600 p-0 h-auto">
                                + Ajouter composant
                              </Button>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveMaterial(material.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="active">
              <div className="text-center py-8 text-gray-500">
                Filtres pour matériels actifs - à implémenter
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaterialTableManager;
