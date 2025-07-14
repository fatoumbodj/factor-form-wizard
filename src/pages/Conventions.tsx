import { useState } from "react";
import Header from "@/components/Layout/Header";
import { AppSidebar } from "@/components/Layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, FileText, Calendar, RefreshCw, XCircle, Shield } from "lucide-react";
import { Convention, BaremeComplet, CategorieMatriel } from "@/types/leasing";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Slider } from "@/components/ui/slider";

const CONVENTIONS_DEMO: Convention[] = [
  {
    id: "conv-materiel-agricole",
    nom: "Convention Matériel Agricole 2024",
    description: "Conditions spéciales pour le financement de matériel agricole",
    fournisseurs: ["sonacos", "afrique-materiel"],
    prestatairesMaintenace: ["sonacos-maintenance", "afrique-materiel-services"],
    categoriesMateriels: ["tracteurs", "moissonneuses-batteuses"],
    bareme: {
      taux: 4.5,
      marge: 1.8,
      valeurResiduelle: 1.5
    },
    dateDebut: new Date("2024-01-01"),
    dateFin: new Date("2024-12-31"),
    reconductionTacite: true,
    actif: true,
    statut: "active"
  },
  {
    id: "conv-equipement-medical",
    nom: "Convention Équipement Médical 2024",
    description: "Offre de financement pour l'équipement médical de pointe",
    fournisseurs: ["dakar-equipement", "techno-equipement"],
    prestatairesMaintenace: ["dakar-maintenance", "techno-services"],
    categoriesMateriels: ["imagerie-medicale", "materiel-laboratoire"],
    bareme: {
      taux: 3.9,
      marge: 1.5,
      valeurResiduelle: 1.2
    },
    dateDebut: new Date("2024-01-15"),
    dateFin: new Date("2024-12-31"),
    reconductionTacite: false,
    actif: false,
    statut: "expiree"
  }
];

const BAREMES_EXISTANTS: BaremeComplet[] = [
  {
    id: "bareme-standard-convention",
    nom: "Barème Standard Convention",
    type: "standard",
    taux: 6.5,
    marge: 2.8,
    valeurResiduelle: 2.0,
    dateCreation: new Date(),
    actif: true,
    statut: "active"
  },
  {
    id: "bareme-derogatoire-convention",
    nom: "Barème Dérogatoire Convention",
    type: "derogatoire",
    taux: 5.8,
    marge: 2.2,
    valeurResiduelle: 2.0,
    dateCreation: new Date(),
    actif: true,
    statut: "active"
  }
];

const FOURNISSEURS_DISPONIBLES = [
  "babacar-fils", "senegal-auto", "sonacos", "afrique-materiel", "dakar-equipement", "techno-equipement"
];

const PRESTATAIRES_MAINTENANCE_DISPONIBLES = [
  "sonacos-maintenance", "afrique-materiel-services", "dakar-maintenance", "techno-services"
];

const CATEGORIES_MATERIELS: CategorieMatriel[] = [
  { id: "tracteurs", nom: "Tracteurs", description: "Tracteurs agricoles de toutes marques" },
  { id: "moissonneuses-batteuses", nom: "Moissonneuses-batteuses", description: "Moissonneuses pour la récolte" },
  { id: "imagerie-medicale", nom: "Imagerie Médicale", description: "Appareils d'imagerie médicale" },
  { id: "materiel-laboratoire", nom: "Matériel de Laboratoire", description: "Équipements pour laboratoires d'analyse" }
];

const Conventions = () => {
  const [conventions, setConventions] = useState<Convention[]>(CONVENTIONS_DEMO);
  const [currentTab, setCurrentTab] = useState("actives");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingConvention, setEditingConvention] = useState<Convention | null>(null);
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    fournisseurs: [] as string[],
    prestatairesMaintenace: [] as string[],
    categoriesMateriels: [] as string[],
    dateDebut: "",
    dateFin: "",
    reconductionTacite: false,
    actif: true,
    selectedBareme: null as BaremeComplet | null,
    newBareme: {
      nom: "",
      typeBareme: "convention",
      typologie: "",
      type: "",
      taux: "",
      duree: "",
      periodicite: "",
      typeEcheancier: "",
      marge: "",
      valeurResiduelle: "",
    }
  });

  const resetForm = () => {
    setFormData({
      nom: "",
      description: "",
      fournisseurs: [],
      prestatairesMaintenace: [],
      categoriesMateriels: [],
      dateDebut: "",
      dateFin: "",
      reconductionTacite: false,
      actif: true,
      selectedBareme: null,
      newBareme: {
        nom: "",
        typeBareme: "convention",
        typologie: "",
        type: "",
        taux: "",
        duree: "",
        periodicite: "",
        typeEcheancier: "",
        marge: "",
        valeurResiduelle: "",
      }
    });
    setEditingConvention(null);
  };

  const handleEdit = (convention: Convention) => {
    setEditingConvention(convention);
    setFormData({
      nom: convention.nom,
      description: convention.description,
      fournisseurs: convention.fournisseurs || [],
      prestatairesMaintenace: convention.prestatairesMaintenace || [],
      categoriesMateriels: convention.categoriesMateriels || [],
      dateDebut: convention.dateDebut.toISOString().split('T')[0],
      dateFin: convention.dateFin ? convention.dateFin.toISOString().split('T')[0] : "",
      reconductionTacite: convention.reconductionTacite,
      actif: convention.actif,
      selectedBareme: null,
      newBareme: {
        nom: "",
        typeBareme: "convention",
        typologie: "",
        type: "",
        taux: "",
        duree: "",
        periodicite: "",
        typeEcheancier: "",
        marge: "",
        valeurResiduelle: "",
      }
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    const bareme = formData.selectedBareme || {
      taux: parseFloat(formData.newBareme.taux) || 0,
      marge: parseFloat(formData.newBareme.marge) || 0,
      valeurResiduelle: parseFloat(formData.newBareme.valeurResiduelle) || 0
    };

    const conventionData: Convention = {
      id: editingConvention?.id || `conv-${Date.now()}`,
      nom: formData.nom,
      description: formData.description,
      fournisseurs: formData.fournisseurs,
      prestatairesMaintenace: formData.prestatairesMaintenace,
      categoriesMateriels: formData.categoriesMateriels,
      bareme,
      dateDebut: new Date(formData.dateDebut),
      dateFin: formData.dateFin ? new Date(formData.dateFin) : undefined,
      reconductionTacite: formData.reconductionTacite,
      actif: formData.actif,
      statut: "active"
    };

    if (editingConvention) {
      setConventions(prev => prev.map(c => c.id === editingConvention.id ? conventionData : c));
    } else {
      setConventions(prev => [...prev, conventionData]);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setConventions(prev => prev.filter(c => c.id !== id));
  };

  const generatePDF = (convention: Convention) => {
    console.log(`Génération PDF pour la convention: ${convention.nom}`);
    alert(`PDF généré pour la convention "${convention.nom}"`);
  };

  const getFilteredConventions = () => {
    switch (currentTab) {
      case "actives":
        return conventions.filter(c => c.actif);
      case "expirees":
        return conventions.filter(c => !c.actif);
      default:
        return conventions;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1">
          <Header />

          <main className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                  <Shield className="h-8 w-8 text-orange-500" />
                  Gestion des Conventions
                </h1>
                <p className="text-muted-foreground mt-2">
                  Créez et gérez les conventions de financement avec des conditions spécifiques
                </p>
              </div>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle Convention
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingConvention ? "Modifier la Convention" : "Nouvelle Convention"}
                    </DialogTitle>
                    <DialogDescription>
                      Configurez les détails de la convention de financement
                    </DialogDescription>
                  </DialogHeader>

                  <Tabs defaultValue="details" className="space-y-4">
                    <TabsList>
                      <TabsTrigger value="details">Détails</TabsTrigger>
                      <TabsTrigger value="fournisseurs">Fournisseurs & Maintenance</TabsTrigger>
                      <TabsTrigger value="materiel">Matériel</TabsTrigger>
                      <TabsTrigger value="baremes">Barèmes</TabsTrigger>
                      <TabsTrigger value="apercu">Aperçu</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="nom">Nom de la convention *</Label>
                          <Input
                            id="nom"
                            value={formData.nom}
                            onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                            placeholder="Ex: Convention Matériel Agricole 2024"
                          />
                        </div>
                        <div>
                          <Label htmlFor="dateDebut">Date de début *</Label>
                          <Input
                            id="dateDebut"
                            type="date"
                            value={formData.dateDebut}
                            onChange={(e) => setFormData(prev => ({ ...prev, dateDebut: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Description détaillée de la convention..."
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="dateFin">Date de fin</Label>
                          <Input
                            id="dateFin"
                            type="date"
                            value={formData.dateFin}
                            onChange={(e) => setFormData(prev => ({ ...prev, dateFin: e.target.value }))}
                          />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="reconductionTacite"
                              checked={formData.reconductionTacite}
                              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, reconductionTacite: checked }))}
                            />
                            <Label htmlFor="reconductionTacite">Reconduction tacite</Label>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="fournisseurs" className="space-y-4">
                      <div>
                        <Label>Fournisseurs partenaires</Label>
                        <Select onValueChange={(value) => {
                          if (!formData.fournisseurs.includes(value)) {
                            setFormData(prev => ({ ...prev, fournisseurs: [...prev.fournisseurs, value] }));
                          }
                        }}>
                          <SelectTrigger>
                            <SelectValue placeholder="Ajouter un fournisseur" />
                          </SelectTrigger>
                          <SelectContent>
                            {FOURNISSEURS_DISPONIBLES.filter(f => !formData.fournisseurs.includes(f)).map(fournisseur => (
                              <SelectItem key={fournisseur} value={fournisseur}>
                                {fournisseur.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {formData.fournisseurs.map(fournisseur => (
                            <Badge key={fournisseur} variant="secondary" className="gap-1">
                              {fournisseur.replace('-', ' ')}
                              <button
                                onClick={() => setFormData(prev => ({
                                  ...prev,
                                  fournisseurs: prev.fournisseurs.filter(f => f !== fournisseur)
                                }))}
                                className="text-xs"
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label>Prestataires de maintenance</Label>
                        <Select onValueChange={(value) => {
                          if (!formData.prestatairesMaintenace.includes(value)) {
                            setFormData(prev => ({ ...prev, prestatairesMaintenace: [...prev.prestatairesMaintenace, value] }));
                          }
                        }}>
                          <SelectTrigger>
                            <SelectValue placeholder="Ajouter un prestataire" />
                          </SelectTrigger>
                          <SelectContent>
                            {PRESTATAIRES_MAINTENANCE_DISPONIBLES.filter(p => !formData.prestatairesMaintenace.includes(p)).map(prestataire => (
                              <SelectItem key={prestataire} value={prestataire}>
                                {prestataire.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {formData.prestatairesMaintenace.map(prestataire => (
                            <Badge key={prestataire} variant="secondary" className="gap-1">
                              {prestataire.replace('-', ' ')}
                              <button
                                onClick={() => setFormData(prev => ({
                                  ...prev,
                                  prestatairesMaintenace: prev.prestatairesMaintenace.filter(p => p !== prestataire)
                                }))}
                                className="text-xs"
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="materiel" className="space-y-4">
                      <div>
                        <Label>Catégories de matériel éligibles</Label>
                        <Select onValueChange={(value) => {
                          if (!formData.categoriesMateriels.includes(value)) {
                            setFormData(prev => ({ ...prev, categoriesMateriels: [...prev.categoriesMateriels, value] }));
                          }
                        }}>
                          <SelectTrigger>
                            <SelectValue placeholder="Ajouter une catégorie" />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIES_MATERIELS.filter(c => !formData.categoriesMateriels.includes(c.id)).map(categorie => (
                              <SelectItem key={categorie.id} value={categorie.id}>
                                {categorie.nom}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {formData.categoriesMateriels.map(categorieId => {
                            const categorie = CATEGORIES_MATERIELS.find(c => c.id === categorieId);
                            return categorie ? (
                              <Badge key={categorie.id} variant="secondary" className="gap-1">
                                {categorie.nom}
                                <button
                                  onClick={() => setFormData(prev => ({
                                    ...prev,
                                    categoriesMateriels: prev.categoriesMateriels.filter(c => c !== categorieId)
                                  }))}
                                  className="text-xs"
                                >
                                  ×
                                </button>
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="baremes" className="space-y-4">
                      <div>
                        <Label>Barème applicable</Label>
                        <Select onValueChange={(value) => setFormData(prev => ({ ...prev, selectedBareme: BAREMES_EXISTANTS.find(b => b.id === value) || null }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un barème existant" />
                          </SelectTrigger>
                          <SelectContent>
                            {BAREMES_EXISTANTS.map(bareme => (
                              <SelectItem key={bareme.id} value={bareme.id}>
                                {bareme.nom}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {formData.selectedBareme && (
                          <Card className="mt-4">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-semibold text-lg">{formData.selectedBareme.nom}</h3>
                                  <div className="text-sm text-muted-foreground mt-1">
                                    Taux: {formData.selectedBareme.taux}%, Marge: {formData.selectedBareme.marge}%, VR: {formData.selectedBareme.valeurResiduelle}%
                                  </div>
                                </div>
                                <Badge variant="outline">Sélectionné</Badge>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="apercu" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Aperçu de la Convention</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Nom</Label>
                            <p className="font-medium">{formData.nom || "Non renseigné"}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                            <p>{formData.description || "Non renseignée"}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Date de début</Label>
                              <p>{formData.dateDebut ? new Date(formData.dateDebut).toLocaleDateString() : "Non définie"}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Date de fin</Label>
                              <p>{formData.dateFin ? new Date(formData.dateFin).toLocaleDateString() : "Non définie"}</p>
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Fournisseurs</Label>
                            {formData.fournisseurs.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {formData.fournisseurs.map(f => <Badge key={f} variant="secondary">{f}</Badge>)}
                              </div>
                            ) : (
                              <p>Tous</p>
                            )}
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Prestataires de maintenance</Label>
                            {formData.prestatairesMaintenace.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {formData.prestatairesMaintenace.map(p => <Badge key={p} variant="secondary">{p}</Badge>)}
                              </div>
                            ) : (
                              <p>Non spécifié</p>
                            )}
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Catégories de matériel</Label>
                            {formData.categoriesMateriels.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {formData.categoriesMateriels.map(c => <Badge key={c} variant="secondary">{c}</Badge>)}
                              </div>
                            ) : (
                              <p>Toutes</p>
                            )}
                          </div>
                          {formData.selectedBareme && (
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Barème sélectionné</Label>
                              <div className="p-3 bg-gray-50 rounded mt-2">
                                <div className="text-lg font-bold">{formData.selectedBareme.nom}</div>
                                <div className="grid grid-cols-3 gap-4 mt-2">
                                  <div className="text-center">
                                    <div className="font-medium">Taux</div>
                                    <div className="text-blue-600">{formData.selectedBareme.taux}%</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-medium">Marge</div>
                                    <div className="text-green-600">{formData.selectedBareme.marge}%</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-medium">VR</div>
                                    <div className="text-purple-600">{formData.selectedBareme.valeurResiduelle}%</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleSave}>
                      {editingConvention ? "Modifier" : "Créer"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
              <TabsList>
                <TabsTrigger value="actives">Conventions Actives</TabsTrigger>
                <TabsTrigger value="expirees">Expirées</TabsTrigger>
              </TabsList>

              {["actives", "expirees"].map(tab => (
                <TabsContent key={tab} value={tab}>
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {tab === "actives" && "Conventions actives"}
                        {tab === "expirees" && "Conventions expirées"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Convention</TableHead>
                            <TableHead>Fournisseurs</TableHead>
                            <TableHead>Matériel</TableHead>
                            <TableHead>Barème</TableHead>
                            <TableHead>Période</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getFilteredConventions().map((convention) => (
                            <TableRow key={convention.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{convention.nom}</div>
                                  <div className="text-sm text-muted-foreground">{convention.description}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {convention.fournisseurs.slice(0, 2).map(f => (
                                    <Badge key={f} variant="outline" className="text-xs">
                                      {f.replace('-', ' ')}
                                    </Badge>
                                  ))}
                                  {convention.fournisseurs.length > 2 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{convention.fournisseurs.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {convention.categoriesMateriels.slice(0, 2).map(c => (
                                    <Badge key={c} variant="outline" className="text-xs">
                                      {c.replace('-', ' ')}
                                    </Badge>
                                  ))}
                                  {convention.categoriesMateriels.length > 2 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{convention.categoriesMateriels.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <div>Taux: {convention.bareme.taux}%</div>
                                  <div>Marge: {convention.bareme.marge}%</div>
                                  <div>VR: {convention.bareme.valeurResiduelle}%</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <div>Début: {convention.dateDebut.toLocaleDateString()}</div>
                                  <div>Fin: {convention.dateFin?.toLocaleDateString() || "N/A"}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={convention.actif ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                  {convention.actif ? "Active" : "Expirée"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-1 flex-wrap">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEdit(convention)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => generatePDF(convention)}
                                  >
                                    <FileText className="h-4 w-4" />
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
                                        <AlertDialogTitle>Supprimer la convention</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Êtes-vous sûr de vouloir supprimer la convention "{convention.nom}" ?
                                          Cette action est irréversible.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDelete(convention.id)}
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
                </TabsContent>
              ))}
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Conventions;
