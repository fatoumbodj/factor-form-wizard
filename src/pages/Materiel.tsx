import { useState, useEffect } from "react";
import Header from "@/components/Layout/Header";
import { AppSidebar } from "@/components/Layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Plus, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import FournisseurSelector from "@/components/Materiel/FournisseurSelector";
import ImportMaterielSection from "@/components/Materiel/ImportMaterielSection";
import FileUploadSection from "@/components/Propositions/FileUploadSection";
import MaterielFormModal from "@/components/Materiel/MaterielFormModal";
import ComponentFormModal from "@/components/Materiel/ComponentFormModal";

interface Materiel {
  id: string;
  designation: string;
  famille: string;
  marque: string;
  modele: string;
  referenceMateriel: string;
  fournisseur: string;
  valeurInitialeHT: number;
  valeurInitialeTTC: number;
  dateAcquisition: Date;
  statut: "disponible" | "loue" | "maintenance" | "retire";
  description?: string;
}

interface Composant {
  id: string;
  numeroComposant: string;
  designation: string;
  familleComposant: string;
  marque: string;
  modele: string;
  referenceMaterielAssocie: string;
  fournisseur: string;
  valeurInitialeHT: number;
  valeurInitialeTTC: number;
  dateAcquisition: Date;
  puissance?: string;
  observations?: string;
}

const MATERIELS_DEMO: Materiel[] = [
  {
    id: "mat-001",
    designation: "Véhicule Peugeot 308",
    famille: "Véhicules légers",
    marque: "Peugeot",
    modele: "308 SW",
    referenceMateriel: "PEU-308-001",
    fournisseur: "Peugeot Sénégal",
    valeurInitialeHT: 15000000,
    valeurInitialeTTC: 17700000,
    dateAcquisition: new Date("2024-01-15"),
    statut: "disponible",
    description: "Véhicule familial spacieux et économique"
  },
  {
    id: "mat-002",
    designation: "Tracteur agricole",
    famille: "Équipements agricoles",
    marque: "John Deere",
    modele: "5075E",
    referenceMateriel: "JD-5075E-001",
    fournisseur: "Agri-Sénégal",
    valeurInitialeHT: 45000000,
    valeurInitialeTTC: 53100000,
    dateAcquisition: new Date("2024-02-10"),
    statut: "loue",
    description: "Tracteur polyvalent pour exploitations agricoles"
  }
];

const Materiel = () => {
  const [materiels, setMateriels] = useState<Materiel[]>([]);
  const [composants, setComposants] = useState<Composant[]>([]);
  const [selectedFournisseurs, setSelectedFournisseurs] = useState<string[]>([]);
  const [currentTab, setCurrentTab] = useState("materiels");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isComponentModalOpen, setIsComponentModalOpen] = useState(false);
  const [editingMateriel, setEditingMateriel] = useState<Materiel | null>(null);
  const [editingComponent, setEditingComponent] = useState<Composant | null>(null);

  useEffect(() => {
    const storedMateriels = localStorage.getItem('materiels');
    if (storedMateriels) {
      try {
        const parsed = JSON.parse(storedMateriels);
        setMateriels(parsed.map((m: any) => ({
          ...m,
          dateAcquisition: new Date(m.dateAcquisition)
        })));
      } catch (error) {
        console.error('Erreur lors du chargement des matériels:', error);
        setMateriels(MATERIELS_DEMO);
      }
    } else {
      setMateriels(MATERIELS_DEMO);
    }
  }, []);

  useEffect(() => {
    if (materiels.length > 0) {
      localStorage.setItem('materiels', JSON.stringify(materiels));
    }
  }, [materiels]);

  const handleAddMaterial = () => {
    setEditingMateriel(null);
    setIsFormModalOpen(true);
  };

  const handleSaveMaterial = (materialData: any) => {
    const material: Materiel = {
      id: editingMateriel?.id || `mat-${Date.now()}`,
      designation: materialData.designation,
      famille: materialData.famille,
      marque: materialData.marque,
      modele: materialData.modele,
      referenceMateriel: materialData.referenceMateriel,
      fournisseur: selectedFournisseurs[0] || "Fournisseur",
      valeurInitialeHT: parseFloat(materialData.valeurHT) || 0,
      valeurInitialeTTC: parseFloat(materialData.valeurTTC) || 0,
      dateAcquisition: new Date(materialData.dateAcquisition),
      statut: "disponible",
      description: materialData.observations
    };

    if (editingMateriel) {
      setMateriels(prev => prev.map(m => m.id === editingMateriel.id ? material : m));
    } else {
      setMateriels(prev => [...prev, material]);
    }
  };

  const handleEdit = (materiel: Materiel) => {
    setEditingMateriel(materiel);
    setIsFormModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setMateriels(prev => prev.filter(m => m.id !== id));
  };

  const handleImportMateriels = (importedMateriels: any[]) => {
    console.log("Importing materials:", importedMateriels);
  };

  const handleImportComposants = (importedComposants: any[]) => {
    console.log("Importing components:", importedComposants);
  };

  // New wrapper function to handle file upload for components
  const handleComponentFileUpload = (file: File) => {
    console.log("Processing component file:", file.name);
    // TODO: Process the file (CSV/Excel) and extract component data
    // For now, we'll simulate with empty array
    const extractedComponents: any[] = [];
    handleImportComposants(extractedComponents);
  };

  const handleAddComponent = () => {
    setEditingComponent(null);
    setIsComponentModalOpen(true);
  };

  const handleSaveComponent = (componentData: any) => {
    const component: Composant = {
      id: editingComponent?.id || `comp-${Date.now()}`,
      numeroComposant: componentData.numeroComposant,
      designation: componentData.designation,
      familleComposant: componentData.familleComposant,
      marque: componentData.marque,
      modele: componentData.modele,
      referenceMaterielAssocie: componentData.referenceMaterielAssocie,
      fournisseur: componentData.fournisseur,
      valeurInitialeHT: parseFloat(componentData.valeurInitialeHT) || 0,
      valeurInitialeTTC: parseFloat(componentData.valeurInitialeTTC) || 0,
      dateAcquisition: new Date(componentData.dateAcquisition),
      puissance: componentData.puissance,
      observations: componentData.observations
    };

    if (editingComponent) {
      setComposants(prev => prev.map(c => c.id === editingComponent.id ? component : c));
    } else {
      setComposants(prev => [...prev, component]);
    }
  };

  const handleEditComponent = (component: Composant) => {
    setEditingComponent(component);
    setIsComponentModalOpen(true);
  };

  const handleDeleteComponent = (id: string) => {
    setComposants(prev => prev.filter(c => c.id !== id));
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "disponible": return "bg-green-100 text-green-800";
      case "loue": return "bg-blue-100 text-blue-800";
      case "maintenance": return "bg-orange-100 text-orange-800";
      case "retire": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case "disponible": return "Disponible";
      case "loue": return "Loué";
      case "maintenance": return "Maintenance";
      case "retire": return "Retiré";
      default: return statut;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1">
          <Header />
          
          <main className="max-w-7xl mx-auto px-6 py-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                <Package className="h-7 w-7 text-blue-600" />
                Matériels et Composants à financer
              </h1>
              <p className="text-sm text-gray-600">Type: Standard</p>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <FournisseurSelector
                    selectedFournisseurs={selectedFournisseurs}
                    onFournisseurChange={setSelectedFournisseurs}
                  />
                </CardContent>
              </Card>

              <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="materiels" className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Matériels
                  </TabsTrigger>
                  <TabsTrigger value="composants" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Composants
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="materiels" className="space-y-6">
                  <ImportMaterielSection onImport={handleImportMateriels} />

                  {materiels.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          Matériels ajoutés ({materiels.length})
                          <Button onClick={handleAddMaterial} className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter un matériel
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Matériel</TableHead>
                              <TableHead>Famille</TableHead>
                              <TableHead>Marque/Modèle</TableHead>
                              <TableHead>Fournisseur</TableHead>
                              <TableHead>Valeur</TableHead>
                              <TableHead>Statut</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {materiels.map((materiel) => (
                              <TableRow key={materiel.id}>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">{materiel.designation}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {materiel.referenceMateriel}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">{materiel.famille}</Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="text-sm">
                                    <div className="font-medium">{materiel.marque}</div>
                                    <div className="text-muted-foreground">{materiel.modele}</div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="secondary">{materiel.fournisseur}</Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="text-sm">
                                    <div className="font-medium">
                                      {materiel.valeurInitialeHT.toLocaleString()} FCFA HT
                                    </div>
                                    <div className="text-muted-foreground">
                                      {materiel.valeurInitialeTTC.toLocaleString()} FCFA TTC
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge className={getStatutColor(materiel.statut)}>
                                    {getStatutLabel(materiel.statut)}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-1">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleEdit(materiel)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="text-red-600 hover:text-red-700"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Supprimer le matériel</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Êtes-vous sûr de vouloir supprimer "{materiel.designation}" ? 
                                            Cette action est irréversible.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                                          <AlertDialogAction 
                                            onClick={() => handleDelete(materiel.id)}
                                            className="bg-red-600 hover:bg-red-700"
                                          >
                                            Supprimer
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="composants" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <FileUploadSection
                      title="Importer des composants"
                      onFileUpload={handleComponentFileUpload}
                      acceptedFormats="csv,xlsx,xls"
                      maxSize={5}
                    />
                    
                    <Card className="border-dashed border-2 border-gray-300">
                      <CardContent className="p-6">
                        <div className="text-center">
                          <div className="flex items-center gap-2 mb-2 justify-center">
                            <Plus className="h-5 w-5 text-green-600" />
                            <h3 className="font-medium text-gray-900">Saisie manuelle</h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">Ajouter des composants individuellement</p>
                          <Button onClick={handleAddComponent} className="bg-green-600 hover:bg-green-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter un composant
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {composants.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          Composants ajoutés ({composants.length})
                          <Button onClick={handleAddComponent} className="bg-green-600 hover:bg-green-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter un composant
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Composant</TableHead>
                              <TableHead>Famille</TableHead>
                              <TableHead>Marque/Modèle</TableHead>
                              <TableHead>Matériel associé</TableHead>
                              <TableHead>Fournisseur</TableHead>
                              <TableHead>Valeur</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {composants.map((composant) => (
                              <TableRow key={composant.id}>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">{composant.designation}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {composant.numeroComposant}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">{composant.familleComposant}</Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="text-sm">
                                    <div className="font-medium">{composant.marque}</div>
                                    <div className="text-muted-foreground">{composant.modele}</div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="secondary" className="text-xs">
                                    {composant.referenceMaterielAssocie}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="secondary">{composant.fournisseur}</Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="text-sm">
                                    <div className="font-medium">
                                      {composant.valeurInitialeHT.toLocaleString()} FCFA HT
                                    </div>
                                    <div className="text-muted-foreground">
                                      {composant.valeurInitialeTTC.toLocaleString()} FCFA TTC
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-1">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleEditComponent(composant)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="text-red-600 hover:text-red-700"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Supprimer le composant</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Êtes-vous sûr de vouloir supprimer "{composant.designation}" ? 
                                            Cette action est irréversible.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                                          <AlertDialogAction 
                                            onClick={() => handleDeleteComponent(composant.id)}
                                            className="bg-red-600 hover:bg-red-700"
                                          >
                                            Supprimer
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  )}

                  {composants.length === 0 && (
                    <div className="p-12 text-center">
                      <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Aucun composant ajouté
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Commencez par ajouter des composants via upload de fichier ou saisie manuelle
                      </p>
                      <div className="flex gap-2 justify-center">
                        <Button onClick={handleAddComponent} className="bg-green-600 hover:bg-green-700">
                          <Plus className="h-4 w-4 mr-2" />
                          Saisie manuelle
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            <MaterielFormModal
              isOpen={isFormModalOpen}
              onClose={() => setIsFormModalOpen(false)}
              onSave={handleSaveMaterial}
              editingMateriel={editingMateriel}
            />

            <ComponentFormModal
              isOpen={isComponentModalOpen}
              onClose={() => setIsComponentModalOpen(false)}
              onSave={handleSaveComponent}
              editingComponent={editingComponent}
              materiels={materiels}
              fournisseurs={selectedFournisseurs}
            />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Materiel;
