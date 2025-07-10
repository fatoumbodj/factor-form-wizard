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
import { Plus, Edit, Trash2, Handshake, FileText, Calendar, RefreshCw, XCircle } from "lucide-react";
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

// Données de démonstration étendues
const CONVENTIONS_DEMO: Convention[] = [
  {
    id: "conv-vehicules-pro",
    nom: "Véhicules Professionnels 2024",
    description: "Convention dédiée aux véhicules utilitaires et professionnels avec conditions préférentielles",
    fournisseurs: ["babacar-fils"],
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
    id: "conv-equipement-industriel",
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
    id: "conv-btp-expire",
    nom: "BTP & Construction - Expirée",
    description: "Convention expirée pour les équipements de construction",
    fournisseurs: ["dakar-equipement"],
    prestatairesMaintenace: ["btp-services"],
    categoriesMateriels: ["engins-btp"],
    bareme: {
      taux: 6.8,
      marge: 3.0,
      valeurResiduelle: 1.5
    },
    dateDebut: new Date("2023-01-01"),
    dateFin: new Date("2023-12-31"),
    reconductionTacite: false,
    actif: false,
    statut: "expiree"
  }
];

const FOURNISSEURS_DISPONIBLES = [
  "babacar-fils", "senegal-auto", "sonacos", "afrique-materiel", "dakar-equipement", "techno-equipement"
];

const PRESTATAIRES_MAINTENANCE = [
  "garage-centrale", "maintenance-rapide", "techno-maintenance", "btp-services", "auto-services"
];

const CATEGORIES_MATERIELS: CategorieMatriel[] = [
  { id: "vehicules-utilitaires", nom: "Véhicules Utilitaires", description: "Camionnettes, fourgons, utilitaires légers" },
  { id: "camions", nom: "Camions", description: "Poids lourds, semi-remorques" },
  { id: "machines-industrielles", nom: "Machines Industrielles", description: "Équipements de production industrielle" },
  { id: "equipement-production", nom: "Équipement de Production", description: "Chaînes de production, robots" },
  { id: "engins-btp", nom: "Engins BTP", description: "Bulldozers, excavateurs, grues" }
];

const BAREMES_DISPONIBLES: BaremeComplet[] = [
  {
    id: "bar-std-001",
    nom: "Barème Standard",
    type: "standard",
    taux: 7.0,
    marge: 3.0,
    valeurResiduelle: 2.5,
    dateCreation: new Date(),
    actif: true
  },
  {
    id: "bar-pref-001",
    nom: "Barème Préférentiel",
    type: "derogatoire",
    taux: 6.2,
    marge: 2.5,
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

const Conventions = () => {
  const [conventions, setConventions] = useState<Convention[]>(CONVENTIONS_DEMO);
  const [currentTab, setCurrentTab] = useState("actives");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingConvention, setEditingConvention] = useState<Convention | null>(null);
  const [selectedTypeCritere, setSelectedTypeCritere] = useState<string>("");
  const [selectedCriteres, setSelectedCriteres] = useState<string[]>([]);
  const [tauxRange, setTauxRange] = useState<number[]>([6, 8]);
  const [dureeRange, setDureeRange] = useState<number[]>([12, 60]);
  const [activeBaremeTab, setActiveBaremeTab] = useState<"existing" | "new">("existing");
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    fournisseur: "", // Single fournisseur instead of array
    prestatairesMaintenace: [] as string[],
    categoriesMateriels: [] as string[],
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
    conditions: [] as any[],
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
      fournisseur: "",
      prestatairesMaintenace: [],
      categoriesMateriels: [],
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
      conditions: [],
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
    setEditingConvention(null);
    setSelectedTypeCritere("");
    setSelectedCriteres([]);
    setTauxRange([6, 8]);
    setDureeRange([12, 60]);
    setActiveBaremeTab("existing");
  };

  const handleEdit = (convention: Convention) => {
    setEditingConvention(convention);
    setFormData({
      nom: convention.nom,
      description: convention.description,
      fournisseur: convention.fournisseurs[0] || "",
      prestatairesMaintenace: convention.prestatairesMaintenace,
      categoriesMateriels: convention.categoriesMateriels,
      typologie: "",
      type: "",
      taux: convention.bareme.taux.toString(),
      duree: "",
      periodicite: "",
      typeEcheancier: "",
      marge: convention.bareme.marge.toString(),
      valeurResiduelle: convention.bareme.valeurResiduelle.toString(),
      valeurReprise: "",
      premierLoyerMajore: "",
      premierLoyerType: "sup",
      conditions: [],
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
      taux: parseFloat(formData.newBareme.taux || formData.taux),
      marge: parseFloat(formData.newBareme.marge || formData.marge),
      valeurResiduelle: parseFloat(formData.newBareme.valeurResiduelle || formData.valeurResiduelle)
    };

    const conventionData: Convention = {
      id: editingConvention?.id || `conv-${Date.now()}`,
      nom: formData.nom,
      description: formData.description,
      fournisseurs: [formData.fournisseur],
      prestatairesMaintenace: formData.prestatairesMaintenace,
      categoriesMateriels: formData.categoriesMateriels,
      bareme,
      dateDebut: new Date(formData.dateDebut),
      dateFin: formData.dateFin ? new Date(formData.dateFin) : undefined,
      reconductionTacite: formData.reconductionTacite,
      actif: formData.actif,
      statut: formData.actif ? "active" : "suspendue"
    };

    if (editingConvention) {
      setConventions(prev => prev.map(c => c.id === editingConvention.id ? conventionData : c));
    } else {
      setConventions(prev => [...prev, conventionData]);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleResilier = (id: string) => {
    setConventions(prev => prev.map(c => 
      c.id === id ? { ...c, statut: "resiliee" as const, actif: false } : c
    ));
  };

  const handleReconduire = (convention: Convention) => {
    const nouvelleConvention: Convention = {
      ...convention,
      id: `conv-${Date.now()}`,
      nom: `${convention.nom} - Reconduite`,
      dateDebut: new Date(),
      dateFin: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      statut: "active",
      actif: true
    };
    setConventions(prev => [...prev, nouvelleConvention]);
  };

  const generatePDF = (convention: Convention) => {
    // Simulation de génération PDF
    console.log(`Génération PDF pour la convention: ${convention.nom}`);
    alert(`PDF généré pour la convention "${convention.nom}"`);
  };

  const getFilteredConventions = () => {
    switch (currentTab) {
      case "actives":
        return conventions.filter(c => c.statut === "active");
      case "expirees":
        return conventions.filter(c => c.statut === "expiree");
      case "resiliees":
        return conventions.filter(c => c.statut === "resiliee");
      default:
        return conventions;
    }
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "active":
        return "bg-green-100 text-green-800";
      case "expiree":
        return "bg-yellow-100 text-yellow-800";
      case "resiliee":
        return "bg-red-100 text-red-800";
      case "suspendue":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const toggleArrayValue = (array: string[], value: string, setter: (prev: any) => void) => {
    setter((prev: any) => ({
      ...prev,
      [array === formData.prestatairesMaintenace ? 'prestatairesMaintenace' : 'categoriesMateriels']: 
       array.includes(value) ? array.filter(item => item !== value) : [...array, value]
    }));
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
                  <Handshake className="h-8 w-8 text-purple-500" />
                  Gestion des Conventions
                </h1>
                <p className="text-muted-foreground mt-2">
                  Gérez les conventions de leasing avec les fournisseurs partenaires
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
                      Configurez les détails de la convention de leasing
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Tabs defaultValue="details" className="space-y-4">
                    <TabsList>
                      <TabsTrigger value="details">Détails</TabsTrigger>
                      <TabsTrigger value="partenaires">Partenaires</TabsTrigger>
                      <TabsTrigger value="baremes">Barèmes</TabsTrigger>
                      <TabsTrigger value="clientele">Clientèle éligible</TabsTrigger>
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
                            placeholder="Ex: Véhicules Professionnels 2024"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="reconduction"
                            checked={formData.reconductionTacite}
                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, reconductionTacite: checked }))}
                          />
                          <Label htmlFor="reconduction">Reconduction tacite</Label>
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
                          <Label htmlFor="dateDebut">Date de début *</Label>
                          <Input
                            id="dateDebut"
                            type="date"
                            value={formData.dateDebut}
                            onChange={(e) => setFormData(prev => ({ ...prev, dateDebut: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="dateFin">Date de fin</Label>
                          <Input
                            id="dateFin"
                            type="date"
                            value={formData.dateFin}
                            onChange={(e) => setFormData(prev => ({ ...prev, dateFin: e.target.value }))}
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="partenaires" className="space-y-4">
                      <div>
                        <Label>Fournisseur agréé *</Label>
                        <Select value={formData.fournisseur} onValueChange={(value) => setFormData(prev => ({ ...prev, fournisseur: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un fournisseur" />
                          </SelectTrigger>
                          <SelectContent>
                            {FOURNISSEURS_DISPONIBLES.map(fournisseur => (
                              <SelectItem key={fournisseur} value={fournisseur}>
                                {fournisseur.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                            {PRESTATAIRES_MAINTENANCE.filter(p => !formData.prestatairesMaintenace.includes(p)).map(prestataire => (
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

                      <div>
                        <Label>Catégories de matériel *</Label>
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
                            return (
                              <Badge key={categorieId} variant="secondary" className="gap-1">
                                {categorie?.nom}
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
                            );
                          })}
                        </div>
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
                            {BAREMES_DISPONIBLES.map((bareme) => (
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
                                  placeholder="Ex: Barème Convention Spécial"
                                />
                              </div>
                              <div>
                                <Label htmlFor="typeBareme">Type de barème</Label>
                                <Input
                                  id="typeBareme"
                                  value="Convention"
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
                                  <Badge key={critere} variant="outline">{critere}</Badge>
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
                          <CardTitle>Aperçu de la Convention</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Nom</Label>
                              <p className="font-medium">{formData.nom || "Non renseigné"}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Période</Label>
                              <p className="font-medium">
                                {formData.dateDebut ? new Date(formData.dateDebut).toLocaleDateString() : "Non définie"} 
                                {formData.dateFin && ` - ${new Date(formData.dateFin).toLocaleDateString()}`}
                              </p>
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Fournisseur</Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {formData.fournisseur ? (
                                <Badge variant="outline">{formData.fournisseur.replace('-', ' ')}</Badge>
                              ) : <span className="text-muted-foreground text-sm">Aucun sélectionné</span>}
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Prestataires de maintenance</Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {formData.prestatairesMaintenace.length > 0 ? formData.prestatairesMaintenace.map(p => (
                                <Badge key={p} variant="outline">{p.replace('-', ' ')}</Badge>
                              )) : <span className="text-muted-foreground text-sm">Aucun sélectionné</span>}
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Catégories de matériel</Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {formData.categoriesMateriels.length > 0 ? formData.categoriesMateriels.map(catId => {
                                const cat = CATEGORIES_MATERIELS.find(c => c.id === catId);
                                return <Badge key={catId} variant="outline">{cat?.nom}</Badge>;
                              }) : <span className="text-muted-foreground text-sm">Aucune sélectionnée</span>}
                            </div>
                          </div>

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
                <TabsTrigger value="resiliees">Résiliées</TabsTrigger>
              </TabsList>

              {["actives", "expirees", "resiliees"].map(tab => (
                <TabsContent key={tab} value={tab}>
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {tab === "actives" && "Conventions actives"}
                        {tab === "expirees" && "Conventions expirées"}
                        {tab === "resiliees" && "Conventions résiliées"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Convention</TableHead>
                            <TableHead>Fournisseurs</TableHead>
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
                                  {convention.reconductionTacite && (
                                    <Badge variant="secondary" className="text-xs mt-1">
                                      Reconduction tacite
                                    </Badge>
                                  )}
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
                                <div className="text-sm">
                                  <div>Taux: {convention.bareme.taux}%</div>
                                  <div>Marge: {convention.bareme.marge}%</div>
                                  <div>VR: {convention.bareme.valeurResiduelle}%</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <div>Début: {convention.dateDebut.toLocaleDateString()}</div>
                                  {convention.dateFin && (
                                    <div>Fin: {convention.dateFin.toLocaleDateString()}</div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={getStatutColor(convention.statut)}>
                                  {convention.statut}
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
                                  {convention.statut === "expiree" && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleReconduire(convention)}
                                      className="text-green-600"
                                    >
                                      <RefreshCw className="h-4 w-4" />
                                    </Button>
                                  )}
                                  {convention.statut === "active" && (
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="text-red-600 hover:text-red-700"
                                        >
                                          <XCircle className="h-4 w-4" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Résilier la convention</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Êtes-vous sûr de vouloir résilier la convention "{convention.nom}" ? 
                                            Cette action est irréversible.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                                          <AlertDialogAction 
                                            onClick={() => handleResilier(convention.id)}
                                            className="bg-red-600 hover:bg-red-700"
                                          >
                                            Résilier
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  )}
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
