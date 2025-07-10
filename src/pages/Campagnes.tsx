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
import { Plus, Edit, Trash2, Megaphone, FileText, Calendar, RefreshCw, XCircle } from "lucide-react";
import { Campagne, BaremeComplet, CategorieMatriel } from "@/types/leasing";
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

const CAMPAGNES_DEMO: Campagne[] = [
  {
    id: "camp-vehicules-2024",
    nom: "Promotion Véhicules Été 2024",
    description: "Campagne promotionnelle pour les véhicules utilitaires avec taux préférentiels",
    type: "fournisseur",
    fournisseurs: ["babacar-fils", "senegal-auto"],
    bareme: {
      taux: 5.8,
      marge: 2.2,
      valeurResiduelle: 2.2
    },
    dateDebut: new Date("2024-06-01"),
    dateFin: new Date("2024-08-31"),
    actif: true,
    prioritaire: true
  },
  {
    id: "camp-materiel-industriel",
    nom: "Équipement Industriel - Rentrée",
    description: "Offre spéciale pour l'acquisition d'équipements industriels",
    type: "banque",
    bareme: {
      taux: 6.2,
      marge: 2.0,
      valeurResiduelle: 2.5
    },
    dateDebut: new Date("2024-09-01"),
    dateFin: new Date("2024-11-30"),
    actif: true,
    prioritaire: false
  }
];

const BAREMES_EXISTANTS: BaremeComplet[] = [
  {
    id: "bareme-standard-campagne",
    nom: "Barème Standard Campagne",
    type: "standard",
    taux: 6.5,
    marge: 2.8,
    valeurResiduelle: 2.0,
    dateCreation: new Date(),
    actif: true
  }
];

const TYPES_CRITERES = [
  { id: "segment", nom: "Segment client" },
  { id: "secteur", nom: "Secteur d'activité" },
  { id: "profession", nom: "Profession" },
  { id: "groupe_client", nom: "Groupe client" }
];

const CRITERES_PAR_TYPE = {
  segment: ["Particulier", "Professionnel", "Entreprise", "Grand compte"],
  secteur: ["Agriculture", "Commerce", "Industrie", "Services", "BTP"],
  profession: ["Médecin", "Avocat", "Commerçant", "Agriculteur", "Artisan"],
  groupe_client: ["Groupe A", "Groupe B", "Groupe C", "VIP"]
};

const CATEGORIES_MATERIELS: CategorieMatriel[] = [
  { id: "vehicules-utilitaires", nom: "Véhicules Utilitaires", description: "Camionnettes, fourgons, utilitaires légers" },
  { id: "camions", nom: "Camions", description: "Poids lourds, semi-remorques" },
  { id: "machines-industrielles", nom: "Machines Industrielles", description: "Équipements de production industrielle" },
  { id: "equipement-production", nom: "Équipement de Production", description: "Chaînes de production, robots" },
  { id: "engins-btp", nom: "Engins BTP", description: "Bulldozers, excavateurs, grues" }
];

const FOURNISSEURS_DISPONIBLES = [
  "babacar-fils", "senegal-auto", "sonacos", "afrique-materiel", "dakar-equipement", "techno-equipement"
];

const Campagnes = () => {
  const [campagnes, setCampagnes] = useState<Campagne[]>(CAMPAGNES_DEMO);
  const [currentTab, setCurrentTab] = useState("actives");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCampagne, setEditingCampagne] = useState<Campagne | null>(null);
  const [selectedTypeCritere, setSelectedTypeCritere] = useState<string>("");
  const [selectedCriteres, setSelectedCriteres] = useState<string[]>([]);
  const [selectedCategorieId, setSelectedCategorieId] = useState<string>("");
  const [tauxRange, setTauxRange] = useState<number[]>([6, 8]);
  const [dureeRange, setDureeRange] = useState<number[]>([12, 60]);
  const [activeBaremeTab, setActiveBaremeTab] = useState<"existing" | "new">("existing");
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    type: "fournisseur" as "fournisseur" | "banque",
    fournisseurs: [] as string[],
    objectifCommercial: "",
    montantObjectif: "",
    quantiteObjectif: "",
    dateDebut: "",
    dateFin: "",
    prioritaire: false,
    actif: true,
    selectedBareme: null as BaremeComplet | null,
    newBareme: {
      nom: "",
      typeBareme: "campagne",
      typologie: "",
      type: "",
      taux: "",
      duree: "",
      periodicite: "",
      typeEcheancier: "",
      marge: "",
      valeurResiduelle: "",
      valeurReprise: "",
      premierLoyerMajore: "",
      premierLoyerType: "sup",
      codeClient: "",
      tauxMin: 6,
      tauxMax: 8,
      dureeMin: 12,
      dureeMax: 60
    }
  });

  const resetForm = () => {
    setFormData({
      nom: "",
      description: "",
      type: "fournisseur",
      fournisseurs: [],
      objectifCommercial: "",
      montantObjectif: "",
      quantiteObjectif: "",
      dateDebut: "",
      dateFin: "",
      prioritaire: false,
      actif: true,
      selectedBareme: null,
      newBareme: {
        nom: "",
        typeBareme: "campagne",
        typologie: "",
        type: "",
        taux: "",
        duree: "",
        periodicite: "",
        typeEcheancier: "",
        marge: "",
        valeurResiduelle: "",
        valeurReprise: "",
        premierLoyerMajore: "",
        premierLoyerType: "sup",
        codeClient: "",
        tauxMin: 6,
        tauxMax: 8,
        dureeMin: 12,
        dureeMax: 60
      }
    });
    setEditingCampagne(null);
    setSelectedTypeCritere("");
    setSelectedCriteres([]);
    setSelectedCategorieId("");
    setTauxRange([6, 8]);
    setDureeRange([12, 60]);
    setActiveBaremeTab("existing");
  };

  const handleEdit = (campagne: Campagne) => {
    setEditingCampagne(campagne);
    setFormData({
      nom: campagne.nom,
      description: campagne.description,
      type: campagne.type,
      fournisseurs: campagne.fournisseurs || [],
      objectifCommercial: "",
      montantObjectif: "",
      quantiteObjectif: "",
      dateDebut: campagne.dateDebut.toISOString().split('T')[0],
      dateFin: campagne.dateFin.toISOString().split('T')[0],
      prioritaire: campagne.prioritaire,
      actif: campagne.actif,
      selectedBareme: null,
      newBareme: {
        nom: "",
        typeBareme: "campagne",
        typologie: "",
        type: "",
        taux: "",
        duree: "",
        periodicite: "",
        typeEcheancier: "",
        marge: "",
        valeurResiduelle: "",
        valeurReprise: "",
        premierLoyerMajore: "",
        premierLoyerType: "sup",
        codeClient: "",
        tauxMin: 6,
        tauxMax: 8,
        dureeMin: 12,
        dureeMax: 60
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

    const campagneData: Campagne = {
      id: editingCampagne?.id || `camp-${Date.now()}`,
      nom: formData.nom,
      description: formData.description,
      type: formData.type,
      fournisseurs: formData.fournisseurs,
      bareme,
      dateDebut: new Date(formData.dateDebut),
      dateFin: new Date(formData.dateFin),
      actif: formData.actif,
      prioritaire: formData.prioritaire
    };

    if (editingCampagne) {
      setCampagnes(prev => prev.map(c => c.id === editingCampagne.id ? campagneData : c));
    } else {
      setCampagnes(prev => [...prev, campagneData]);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setCampagnes(prev => prev.filter(c => c.id !== id));
  };

  const generatePDF = (campagne: Campagne) => {
    console.log(`Génération PDF pour la campagne: ${campagne.nom}`);
    alert(`PDF généré pour la campagne "${campagne.nom}"`);
  };

  const getFilteredCampagnes = () => {
    switch (currentTab) {
      case "actives":
        return campagnes.filter(c => c.actif);
      case "expirees":
        return campagnes.filter(c => !c.actif);
      default:
        return campagnes;
    }
  };

  const selectedCategorie = CATEGORIES_MATERIELS.find(cat => cat.id === selectedCategorieId);

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
                  <Megaphone className="h-8 w-8 text-orange-500" />
                  Gestion des Campagnes
                </h1>
                <p className="text-muted-foreground mt-2">
                  Créez et gérez les campagnes de financement avec des conditions préférentielles
                </p>
              </div>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle Campagne
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingCampagne ? "Modifier la Campagne" : "Nouvelle Campagne"}
                    </DialogTitle>
                    <DialogDescription>
                      Configurez les détails de la campagne de financement
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Tabs defaultValue="details" className="space-y-4">
                    <TabsList>
                      <TabsTrigger value="details">Détails</TabsTrigger>
                      <TabsTrigger value="objectifs">Objectifs</TabsTrigger>
                      <TabsTrigger value="materiel">Matériel</TabsTrigger>
                      <TabsTrigger value="baremes">Barèmes</TabsTrigger>
                      <TabsTrigger value="clientele">Clientèle éligible</TabsTrigger>
                      <TabsTrigger value="apercu">Aperçu</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="nom">Nom de la campagne *</Label>
                          <Input
                            id="nom"
                            value={formData.nom}
                            onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                            placeholder="Ex: Promotion Véhicules Été 2024"
                          />
                        </div>
                        <div>
                          <Label htmlFor="type">Type de campagne *</Label>
                          <Select value={formData.type} onValueChange={(value: "fournisseur" | "banque") => setFormData(prev => ({ ...prev, type: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fournisseur">Campagne Fournisseur</SelectItem>
                              <SelectItem value="banque">Campagne Banque</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Description détaillée de la campagne..."
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="dateDebut">Date de début *</Label>
                          <Input
                            id="dateDebut"
                            type="date"
                            value={formData.dateDebut}
                            onChange={(e) => setFormData(prev => ({ ...prev, dateDebut: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="dateFin">Date de fin *</Label>
                          <Input
                            id="dateFin"
                            type="date"
                            value={formData.dateFin}
                            onChange={(e) => setFormData(prev => ({ ...prev, dateFin: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="prioritaire"
                          checked={formData.prioritaire}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, prioritaire: checked }))}
                        />
                        <Label htmlFor="prioritaire">Campagne prioritaire</Label>
                      </div>

                      {formData.type === "fournisseur" && (
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
                      )}
                    </TabsContent>

                    <TabsContent value="objectifs" className="space-y-4">
                      <div>
                        <Label htmlFor="objectifCommercial">Objectif commercial (XAF, QTE)</Label>
                        <Textarea
                          id="objectifCommercial"
                          value={formData.objectifCommercial}
                          onChange={(e) => setFormData(prev => ({ ...prev, objectifCommercial: e.target.value }))}
                          placeholder="Décrivez l'objectif commercial de la campagne en XAF et quantité..."
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="montantObjectif">Montant objectif (XAF)</Label>
                          <Input
                            id="montantObjectif"
                            type="number"
                            value={formData.montantObjectif}
                            onChange={(e) => setFormData(prev => ({ ...prev, montantObjectif: e.target.value }))}
                            placeholder="Ex: 50000000"
                          />
                        </div>
                        <div>
                          <Label htmlFor="quantiteObjectif">Quantité objectif</Label>
                          <Input
                            id="quantiteObjectif"
                            type="number"
                            value={formData.quantiteObjectif}
                            onChange={(e) => setFormData(prev => ({ ...prev, quantiteObjectif: e.target.value }))}
                            placeholder="Ex: 100"
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="materiel" className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Catégorie de matériel éligible</h3>
                        
                        <div>
                          <Label>Sélectionner une catégorie</Label>
                          <Select value={selectedCategorieId} onValueChange={setSelectedCategorieId}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choisir une catégorie de matériel" />
                            </SelectTrigger>
                            <SelectContent>
                              {CATEGORIES_MATERIELS.map(categorie => (
                                <SelectItem key={categorie.id} value={categorie.id}>
                                  {categorie.nom}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {selectedCategorie && (
                          <Card className="mt-4">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-semibold text-lg">{selectedCategorie.nom}</h3>
                                  <p className="text-sm text-muted-foreground mt-1">{selectedCategorie.description}</p>
                                </div>
                                <Badge variant="outline">Sélectionnée</Badge>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="baremes" className="space-y-4">
                      <div className="flex gap-2">
                        <Button
                          variant={activeBaremeTab === "existing" ? "default" : "outline"}
                          onClick={() => setActiveBaremeTab("existing")}
                          className="rounded-full px-6"
                        >
                          Barème existant
                        </Button>
                        <Button
                          variant={activeBaremeTab === "new" ? "default" : "outline"}
                          onClick={() => setActiveBaremeTab("new")}
                          className="rounded-full px-6"
                        >
                          Nouveau barème
                        </Button>
                      </div>

                      {activeBaremeTab === "existing" && (
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            Sélectionnez un barème existant
                          </p>
                          
                          <div className="space-y-3">
                            {BAREMES_EXISTANTS.map((bareme) => (
                              <Card
                                key={bareme.id}
                                className={`cursor-pointer transition-all hover:shadow-md ${
                                  formData.selectedBareme?.id === bareme.id 
                                    ? "ring-2 ring-primary border-primary" 
                                    : "border-border"
                                }`}
                                onClick={() => setFormData(prev => ({ ...prev, selectedBareme: bareme }))}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between">
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <h3 className="font-semibold">{bareme.nom}</h3>
                                      </div>
                                      <div className="flex gap-4 text-sm">
                                        <span>Taux: {bareme.taux}%</span>
                                        <span>Marge: {bareme.marge}%</span>
                                        <span>VR: {bareme.valeurResiduelle}%</span>
                                      </div>
                                    </div>
                                    <Badge 
                                      variant={bareme.type === "standard" ? "default" : "secondary"}
                                      className="capitalize"
                                    >
                                      {bareme.type}
                                    </Badge>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}

                      {activeBaremeTab === "new" && (
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            Créez un nouveau barème personnalisé
                          </p>
                          
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="newBaremeNom">Nom du barème</Label>
                                <Input
                                  id="newBaremeNom"
                                  value={formData.newBareme.nom}
                                  onChange={(e) => setFormData(prev => ({ 
                                    ...prev, 
                                    newBareme: { ...prev.newBareme, nom: e.target.value }
                                  }))}
                                  placeholder="Ex: Barème Campagne Spécial"
                                />
                              </div>
                              <div>
                                <Label htmlFor="typeBareme">Type de barème</Label>
                                <Input
                                  id="typeBareme"
                                  value="Campagne"
                                  disabled
                                  className="bg-gray-100"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="newTypologie">Typologie *</Label>
                                <Select 
                                  value={formData.newBareme.typologie} 
                                  onValueChange={(value) => setFormData(prev => ({ 
                                    ...prev, 
                                    newBareme: { ...prev.newBareme, typologie: value }
                                  }))}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner une typologie" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Crédit-Bail">Crédit-Bail</SelectItem>
                                    <SelectItem value="LOA">LOA</SelectItem>
                                    <SelectItem value="LLD">LLD</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="newType">Type *</Label>
                                <Select 
                                  value={formData.newBareme.type} 
                                  onValueChange={(value) => setFormData(prev => ({ 
                                    ...prev, 
                                    newBareme: { ...prev.newBareme, type: value }
                                  }))}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner un type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="standard">Standard</SelectItem>
                                    <SelectItem value="derogatoire">Dérogatoire</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Taux (Min: {tauxRange[0]}% - Max: {tauxRange[1]}%)</Label>
                                <Slider
                                  value={tauxRange}
                                  onValueChange={setTauxRange}
                                  min={0}
                                  max={20}
                                  step={0.1}
                                  className="w-full"
                                />
                              </div>
                              <div>
                                <Label>Durée (Min: {dureeRange[0]} - Max: {dureeRange[1]} mois)</Label>
                                <Slider
                                  value={dureeRange}
                                  onValueChange={setDureeRange}
                                  min={6}
                                  max={120}
                                  step={1}
                                  className="w-full"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="newPeriodicite">Périodicité</Label>
                                <Select 
                                  value={formData.newBareme.periodicite} 
                                  onValueChange={(value) => setFormData(prev => ({ 
                                    ...prev, 
                                    newBareme: { ...prev.newBareme, periodicite: value }
                                  }))}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="mensuelle">Mensuelle</SelectItem>
                                    <SelectItem value="trimestrielle">Trimestrielle</SelectItem>
                                    <SelectItem value="semestrielle">Semestrielle</SelectItem>
                                    <SelectItem value="annuelle">Annuelle</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="newTypeEcheancier">Type échéancier</Label>
                                <Select 
                                  value={formData.newBareme.typeEcheancier} 
                                  onValueChange={(value) => setFormData(prev => ({ 
                                    ...prev, 
                                    newBareme: { ...prev.newBareme, typeEcheancier: value }
                                  }))}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="constant">Constant</SelectItem>
                                    <SelectItem value="progressif">Progressif</SelectItem>
                                    <SelectItem value="degressif">Dégressif</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="newMarge">Marge (%)</Label>
                                <Input
                                  id="newMarge"
                                  type="number"
                                  step="0.1"
                                  value={formData.newBareme.marge}
                                  onChange={(e) => setFormData(prev => ({ 
                                    ...prev, 
                                    newBareme: { ...prev.newBareme, marge: e.target.value }
                                  }))}
                                  placeholder="2.8"
                                />
                              </div>
                              <div>
                                <Label htmlFor="newValeurResiduelle">
                                  {formData.newBareme.typologie === "LLD" ? "Valeur de reprise (%)" : "Valeur résiduelle (%)"}
                                </Label>
                                <Input
                                  id="newValeurResiduelle"
                                  type="number"
                                  step="0.1"
                                  value={formData.newBareme.typologie === "LLD" ? formData.newBareme.valeurReprise : formData.newBareme.valeurResiduelle}
                                  onChange={(e) => setFormData(prev => ({ 
                                    ...prev, 
                                    newBareme: { 
                                      ...prev.newBareme, 
                                      [formData.newBareme.typologie === "LLD" ? "valeurReprise" : "valeurResiduelle"]: e.target.value 
                                    }
                                  }))}
                                  placeholder="1.8"
                                />
                              </div>
                            </div>

                            {formData.newBareme.type === "derogatoire" && (
                              <div>
                                <Label htmlFor="codeClient">Code client</Label>
                                <div className="flex gap-2">
                                  <Input
                                    id="codeClient"
                                    value={formData.newBareme.codeClient}
                                    onChange={(e) => setFormData(prev => ({ 
                                      ...prev, 
                                      newBareme: { ...prev.newBareme, codeClient: e.target.value }
                                    }))}
                                    placeholder="Rechercher un code client..."
                                  />
                                  <Button variant="outline">Rechercher</Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="clientele" className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Clientèle éligible</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <Label>Type de critère</Label>
                            <Select value={selectedTypeCritere} onValueChange={setSelectedTypeCritere}>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un type de critère" />
                              </SelectTrigger>
                              <SelectContent>
                                {TYPES_CRITERES.map(type => (
                                  <SelectItem key={type.id} value={type.id}>
                                    {type.nom}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {selectedTypeCritere && (
                            <div>
                              <Label>Critères</Label>
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                {CRITERES_PAR_TYPE[selectedTypeCritere as keyof typeof CRITERES_PAR_TYPE]?.map(critere => (
                                  <div key={critere} className="flex items-center space-x-2">
                                    <input
                                      type="checkbox"
                                      id={critere}
                                      checked={selectedCriteres.includes(critere)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedCriteres(prev => [...prev, critere]);
                                        } else {
                                          setSelectedCriteres(prev => prev.filter(c => c !== critere));
                                        }
                                      }}
                                      className="rounded"
                                    />
                                    <Label htmlFor={critere} className="text-sm">{critere}</Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {selectedCriteres.length > 0 && (
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Critères sélectionnés</Label>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {selectedCriteres.map(critere => (
                                  <Badge key={critere} variant="outline" className="gap-1">
                                    {critere}
                                    <button
                                      onClick={() => setSelectedCriteres(prev => prev.filter(c => c !== critere))}
                                      className="text-xs"
                                    >
                                      ×
                                    </button>
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="apercu" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Aperçu de la Campagne</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Nom</Label>
                              <p className="font-medium">{formData.nom || "Non renseigné"}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                              <Badge variant="outline" className="ml-2">
                                {formData.type === "fournisseur" ? "Campagne Fournisseur" : "Campagne Banque"}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Période</Label>
                              <p className="font-medium">
                                {formData.dateDebut ? new Date(formData.dateDebut).toLocaleDateString() : "Non définie"} 
                                {formData.dateFin && ` - ${new Date(formData.dateFin).toLocaleDateString()}`}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Priorité</Label>
                              <Badge variant={formData.prioritaire ? "default" : "secondary"} className="ml-2">
                                {formData.prioritaire ? "Prioritaire" : "Standard"}
                              </Badge>
                            </div>
                          </div>

                          {formData.type === "fournisseur" && formData.fournisseurs.length > 0 && (
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Fournisseurs partenaires</Label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {formData.fournisseurs.map(f => (
                                  <Badge key={f} variant="outline">{f.replace('-', ' ')}</Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {selectedCategorie && (
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Catégorie de matériel</Label>
                              <div className="p-3 bg-gray-50 rounded mt-1">
                                <div className="font-medium">{selectedCategorie.nom}</div>
                                <div className="text-sm text-muted-foreground">{selectedCategorie.description}</div>
                              </div>
                            </div>
                          )}

                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Barème sélectionné</Label>
                            <div className="p-3 bg-gray-50 rounded mt-2">
                              <div className="text-lg font-bold">
                                {formData.selectedBareme ? formData.selectedBareme.nom : "Nouveau barème personnalisé"}
                              </div>
                              <div className="grid grid-cols-3 gap-4 mt-2">
                                <div className="text-center">
                                  <div className="font-medium">Taux</div>
                                  <div className="text-blue-600">
                                    {formData.selectedBareme ? `${formData.selectedBareme.taux}%` : `${tauxRange[0]}-${tauxRange[1]}%`}
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="font-medium">Marge</div>
                                  <div className="text-green-600">
                                    {formData.selectedBareme ? `${formData.selectedBareme.marge}%` : `${formData.newBareme.marge || "0"}%`}
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="font-medium">VR</div>
                                  <div className="text-purple-600">
                                    {formData.selectedBareme ? `${formData.selectedBareme.valeurResiduelle}%` : `${formData.newBareme.valeurResiduelle || "0"}%`}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {selectedCriteres.length > 0 && (
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Clientèle éligible</Label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {selectedCriteres.map(critere => (
                                  <Badge key={critere} variant="outline">{critere}</Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {(formData.objectifCommercial || formData.montantObjectif || formData.quantiteObjectif) && (
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Objectifs</Label>
                              <div className="p-3 bg-blue-50 rounded mt-1">
                                {formData.objectifCommercial && (
                                  <div className="mb-2">
                                    <div className="font-medium">Description</div>
                                    <div className="text-sm">{formData.objectifCommercial}</div>
                                  </div>
                                )}
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <div className="font-medium">Montant (XAF)</div>
                                    <div className="text-lg font-bold text-blue-600">
                                      {formData.montantObjectif ? parseInt(formData.montantObjectif).toLocaleString() : "Non défini"}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="font-medium">Quantité</div>
                                    <div className="text-lg font-bold text-green-600">
                                      {formData.quantiteObjectif || "Non définie"}
                                    </div>
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
                      {editingCampagne ? "Modifier" : "Créer"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
              <TabsList>
                <TabsTrigger value="actives">Campagnes Actives</TabsTrigger>
                <TabsTrigger value="expirees">Expirées</TabsTrigger>
              </TabsList>

              {["actives", "expirees"].map(tab => (
                <TabsContent key={tab} value={tab}>
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {tab === "actives" && "Campagnes actives"}
                        {tab === "expirees" && "Campagnes expirées"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Campagne</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Partenaires</TableHead>
                            <TableHead>Barème</TableHead>
                            <TableHead>Période</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getFilteredCampagnes().map((campagne) => (
                            <TableRow key={campagne.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{campagne.nom}</div>
                                  <div className="text-sm text-muted-foreground">{campagne.description}</div>
                                  {campagne.prioritaire && (
                                    <Badge variant="default" className="text-xs mt-1">
                                      Prioritaire
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {campagne.type === "fournisseur" ? "Fournisseur" : "Banque"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {campagne.fournisseurs?.slice(0, 2).map(f => (
                                    <Badge key={f} variant="outline" className="text-xs">
                                      {f.replace('-', ' ')}
                                    </Badge>
                                  )) || <span className="text-muted-foreground text-sm">Tous</span>}
                                  {(campagne.fournisseurs?.length || 0) > 2 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{(campagne.fournisseurs?.length || 0) - 2}
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <div>Taux: {campagne.bareme.taux}%</div>
                                  <div>Marge: {campagne.bareme.marge}%</div>
                                  <div>VR: {campagne.bareme.valeurResiduelle}%</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <div>Début: {campagne.dateDebut.toLocaleDateString()}</div>
                                  <div>Fin: {campagne.dateFin.toLocaleDateString()}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={campagne.actif ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                  {campagne.actif ? "Active" : "Expirée"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-1 flex-wrap">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEdit(campagne)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => generatePDF(campagne)}
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
                                        <AlertDialogTitle>Supprimer la campagne</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Êtes-vous sûr de vouloir supprimer la campagne "{campagne.nom}" ? 
                                          Cette action est irréversible.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                                        <AlertDialogAction 
                                          onClick={() => handleDelete(campagne.id)}
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

export default Campagnes;
