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
import { Plus, Edit, Trash2, Zap, Calendar, Target, TrendingUp, Settings, Eye } from "lucide-react";
import { Campagne } from "@/types/leasing";
import { DatePicker } from "@/components/ui/datepicker";
import CampagneWorkflow, { StatutCampagne } from "@/components/Campagnes/CampagneWorkflow";
import CampagneKPI from "@/components/Campagnes/CampagneKPI";
import CanauxDiffusion from "@/components/Campagnes/CanauxDiffusion";
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

// Interface étendue pour les campagnes
interface CampagneComplete extends Campagne {
  statut: StatutCampagne;
  objectifCommercial: {
    type: "volume" | "valeur";
    objectif: number;
    unite: string;
  };
  canauxDiffusion: string[];
  categoriesMaterielles: string[];
  kpi?: {
    nombreDossiers: number;
    objectifDossiers: number;
    tauxActivation: number;
    delaiMoyenSouscription: number;
    tauxTransformation: number;
    valeurGeneree: number;
    objectifValeur: number;
  };
}

// Données de démonstration pour les campagnes
const CAMPAGNES_DEMO: CampagneComplete[] = [
  {
    id: "camp-vehicules-2024",
    nom: "Promo Véhicules Été 2024",
    description: "Campagne promotionnelle spéciale pour les véhicules utilitaires pendant l'été",
    type: "fournisseur",
    fournisseurs: ["babacar-fils", "senegal-auto"],
    bareme: {
      taux: 5.5,
      marge: 2.0,
      valeurResiduelle: 1.5
    },
    dateDebut: new Date("2024-06-01"),
    dateFin: new Date("2024-08-31"),
    actif: true,
    prioritaire: true,
    statut: "active",
    objectifCommercial: {
      type: "volume",
      objectif: 50,
      unite: "dossiers"
    },
    canauxDiffusion: ["emailing", "portail-client", "agences"],
    categoriesMaterielles: ["Véhicules légers", "Véhicules utilitaires"],
    kpi: {
      nombreDossiers: 32,
      objectifDossiers: 50,
      tauxActivation: 78,
      delaiMoyenSouscription: 12,
      tauxTransformation: 28,
      valeurGeneree: 450000000,
      objectifValeur: 600000000
    }
  },
  {
    id: "camp-banque-agricole",
    nom: "Financement Agricole Banque",
    description: "Campagne banque pour soutenir le secteur agricole avec des taux préférentiels",
    type: "banque",
    bareme: {
      taux: 6.0,
      marge: 2.2,
      valeurResiduelle: 2.0
    },
    dateDebut: new Date("2024-01-01"),
    dateFin: new Date("2024-12-31"),
    actif: true,
    prioritaire: false,
    statut: "validee",
    objectifCommercial: {
      type: "valeur",
      objectif: 2000000000,
      unite: "FCFA"
    },
    canauxDiffusion: ["commercial", "agences"],
    categoriesMaterielles: ["Équipements agricoles"],
    kpi: {
      nombreDossiers: 18,
      objectifDossiers: 30,
      tauxActivation: 65,
      delaiMoyenSouscription: 18,
      tauxTransformation: 22,
      valeurGeneree: 850000000,
      objectifValeur: 2000000000
    }
  },
  {
    id: "camp-btp-expired",
    nom: "BTP Express - Expirée",
    description: "Campagne expirée pour les équipements BTP",
    type: "fournisseur",
    fournisseurs: ["dakar-equipement"],
    bareme: {
      taux: 5.8,
      marge: 2.3,
      valeurResiduelle: 1.8
    },
    dateDebut: new Date("2023-09-01"),
    dateFin: new Date("2023-12-31"),
    actif: false,
    prioritaire: false,
    statut: "terminee",
    objectifCommercial: {
      type: "volume",
      objectif: 25,
      unite: "dossiers"
    },
    canauxDiffusion: ["agences"],
    categoriesMaterielles: ["Équipements BTP"],
    kpi: {
      nombreDossiers: 28,
      objectifDossiers: 25,
      tauxActivation: 84,
      delaiMoyenSouscription: 10,
      tauxTransformation: 35,
      valeurGeneree: 1200000000,
      objectifValeur: 1000000000
    }
  }
];

const CATEGORIES_MATERIELLES = [
  "Véhicules légers", "Véhicules utilitaires", "Équipements agricoles", 
  "Équipements BTP", "Machines industrielles", "Matériel informatique",
  "Équipements médicaux", "Matériel de transport"
];

// Barèmes existants (simulés)
const BAREMES_EXISTANTS = [
  {
    id: "bareme-standard-1",
    nom: "Barème Standard Véhicules",
    taux: 7.5,
    marge: 2.0,
    valeurResiduelle: 1.5,
    type: "standard"
  },
  {
    id: "bareme-promo-1",
    nom: "Barème Promotionnel Agricole",
    taux: 6.0,
    marge: 1.8,
    valeurResiduelle: 2.0,
    type: "promotionnel"
  },
  {
    id: "bareme-btp-1",
    nom: "Barème Spécial BTP",
    taux: 7.0,
    marge: 2.2,
    valeurResiduelle: 1.8,
    type: "spécialisé"
  }
];

const CANAUX_DIFFUSION = [
  { id: "emailing", nom: "E-mailing", description: "Diffusion par email" },
  { id: "sms", nom: "SMS", description: "Notifications SMS" },
  { id: "portail-client", nom: "Portail Client", description: "Publication sur le portail client" },
  { id: "agences", nom: "Agences", description: "Communication en agences" },
  { id: "commercial", nom: "Force Commerciale", description: "Via l'équipe commerciale" },
  { id: "reseaux-sociaux", nom: "Réseaux Sociaux", description: "Publication sur les réseaux" }
];

const Campagnes = () => {
  const [campagnes, setCampagnes] = useState<CampagneComplete[]>(CAMPAGNES_DEMO);
  const [currentTab, setCurrentTab] = useState("actives");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isKPIDialogOpen, setIsKPIDialogOpen] = useState(false);
  const [selectedCampagneKPI, setSelectedCampagneKPI] = useState<CampagneComplete | null>(null);
  const [editingCampagne, setEditingCampagne] = useState<CampagneComplete | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    type: "fournisseur" as "fournisseur" | "banque",
    categoriesMaterielles: [] as string[],
    dateDebut: undefined as Date | undefined,
    dateFin: undefined as Date | undefined,
    prioritaire: false,
    actif: true,
    objectifType: "volume" as "volume" | "valeur",
    objectifValeur: "",
    canauxDiffusion: [] as string[],
    baremeExistant: "",
    nouveauBareme: {
      nom: "",
      taux: "",
      marge: "",
      valeurResiduelle: ""
    }
  });

  const resetForm = () => {
    setFormData({
      nom: "",
      description: "",
      type: "fournisseur",
      categoriesMaterielles: [],
      dateDebut: undefined,
      dateFin: undefined,
      prioritaire: false,
      actif: true,
      objectifType: "volume",
      objectifValeur: "",
      canauxDiffusion: [],
      baremeExistant: "",
      nouveauBareme: {
        nom: "",
        taux: "",
        marge: "",
        valeurResiduelle: ""
      }
    });
    setEditingCampagne(null);
    setCurrentStep(1);
  };

  const handleEdit = (campagne: CampagneComplete) => {
    setEditingCampagne(campagne);
    setFormData({
      nom: campagne.nom,
      description: campagne.description,
      type: campagne.type,
      categoriesMaterielles: campagne.categoriesMaterielles,
      dateDebut: campagne.dateDebut,
      dateFin: campagne.dateFin,
      prioritaire: campagne.prioritaire,
      actif: campagne.actif,
      objectifType: campagne.objectifCommercial.type,
      objectifValeur: campagne.objectifCommercial.objectif.toString(),
      canauxDiffusion: campagne.canauxDiffusion,
      baremeExistant: "",
      nouveauBareme: {
        nom: "",
        taux: campagne.bareme.taux.toString(),
        marge: campagne.bareme.marge.toString(),
        valeurResiduelle: campagne.bareme.valeurResiduelle.toString()
      }
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.dateDebut || !formData.dateFin) return;

    let bareme;
    if (formData.baremeExistant) {
      const baremeExist = BAREMES_EXISTANTS.find(b => b.id === formData.baremeExistant);
      bareme = {
        taux: baremeExist?.taux || 0,
        marge: baremeExist?.marge || 0,
        valeurResiduelle: baremeExist?.valeurResiduelle || 0
      };
    } else {
      bareme = {
        taux: parseFloat(formData.nouveauBareme.taux),
        marge: parseFloat(formData.nouveauBareme.marge),
        valeurResiduelle: parseFloat(formData.nouveauBareme.valeurResiduelle)
      };
    }

    const campagneData: CampagneComplete = {
      id: editingCampagne?.id || `camp-${Date.now()}`,
      nom: formData.nom,
      description: formData.description,
      type: formData.type,
      fournisseurs: formData.type === "fournisseur" ? [] : undefined,
      bareme,
      dateDebut: formData.dateDebut,
      dateFin: formData.dateFin,
      prioritaire: formData.prioritaire,
      actif: formData.actif,
      statut: "brouillon",
      objectifCommercial: {
        type: formData.objectifType,
        objectif: parseFloat(formData.objectifValeur),
        unite: formData.objectifType === "volume" ? "dossiers" : "FCFA"
      },
      canauxDiffusion: formData.canauxDiffusion,
      categoriesMaterielles: formData.categoriesMaterielles
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

  const handleWorkflowValidation = (campagneId: string, nouveauStatut: StatutCampagne) => {
    setCampagnes(prev => prev.map(c => 
      c.id === campagneId ? { ...c, statut: nouveauStatut } : c
    ));
  };

  const handleViewKPI = (campagne: CampagneComplete) => {
    setSelectedCampagneKPI(campagne);
    setIsKPIDialogOpen(true);
  };

  const getFilteredCampagnes = () => {
    const now = new Date();
    switch (currentTab) {
      case "actives":
        return campagnes.filter(c => c.statut === "active" && c.dateFin > now);
      case "expirees":
        return campagnes.filter(c => c.statut === "terminee" || c.dateFin <= now);
      case "prioritaires":
        return campagnes.filter(c => c.prioritaire && c.actif);
      case "validation":
        return campagnes.filter(c => ["brouillon", "en_attente_ra", "en_attente_dg", "validee"].includes(c.statut));
      default:
        return campagnes;
    }
  };

  const getStatutColor = (statut: StatutCampagne) => {
    switch (statut) {
      case "active": return "bg-green-100 text-green-800";
      case "validee": return "bg-blue-100 text-blue-800";
      case "en_attente_ra": case "en_attente_dg": return "bg-orange-100 text-orange-800";
      case "terminee": return "bg-gray-100 text-gray-800";
      case "refusee": return "bg-red-100 text-red-800";
      default: return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatutText = (statut: StatutCampagne) => {
    switch (statut) {
      case "brouillon": return "Brouillon";
      case "en_attente_ra": return "En attente RA";
      case "en_attente_dg": return "En attente DG";
      case "validee": return "Validée";
      case "active": return "Active";
      case "terminee": return "Terminée";
      case "refusee": return "Refusée";
      default: return statut;
    }
  };

  const toggleCategorieMaterielles = (categorie: string) => {
    setFormData(prev => ({
      ...prev,
      categoriesMaterielles: prev.categoriesMaterielles.includes(categorie)
        ? prev.categoriesMaterielles.filter(c => c !== categorie)
        : [...prev.categoriesMaterielles, categorie]
    }));
  };

  const toggleCanalDiffusion = (canal: string) => {
    setFormData(prev => ({
      ...prev,
      canauxDiffusion: prev.canauxDiffusion.includes(canal)
        ? prev.canauxDiffusion.filter(c => c !== canal)
        : [...prev.canauxDiffusion, canal]
    }));
  };

  const handleBaremeExistantChange = (baremeId: string) => {
    setFormData(prev => ({ ...prev, baremeExistant: baremeId }));
    if (baremeId) {
      const bareme = BAREMES_EXISTANTS.find(b => b.id === baremeId);
      if (bareme) {
        setFormData(prev => ({
          ...prev,
          nouveauBareme: {
            nom: bareme.nom,
            taux: bareme.taux.toString(),
            marge: bareme.marge.toString(),
            valeurResiduelle: bareme.valeurResiduelle.toString()
          }
        }));
      }
    }
  };

  const renderFormStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nom">Nom de la campagne *</Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                  placeholder="Ex: Promo Véhicules Été 2024"
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
                placeholder="Description de la campagne..."
                rows={3}
              />
            </div>

            <div>
              <Label>Catégories matérielles *</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {CATEGORIES_MATERIELLES.map(categorie => (
                  <div
                    key={categorie}
                    className={`p-2 border rounded cursor-pointer transition-colors ${
                      formData.categoriesMaterielles.includes(categorie)
                        ? "bg-primary/10 border-primary"
                        : "hover:bg-accent"
                    }`}
                    onClick={() => toggleCategorieMaterielles(categorie)}
                  >
                    <div className="text-sm font-medium">{categorie}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateDebut">Date de début *</Label>
                <DatePicker
                  value={formData.dateDebut}
                  onChange={(date) => setFormData(prev => ({ ...prev, dateDebut: date }))}
                  placeholder="Sélectionner la date de début"
                />
              </div>
              <div>
                <Label htmlFor="dateFin">Date de fin *</Label>
                <DatePicker
                  value={formData.dateFin}
                  onChange={(date) => setFormData(prev => ({ ...prev, dateFin: date }))}
                  placeholder="Sélectionner la date de fin"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type d'objectif commercial</Label>
                <Select value={formData.objectifType} onValueChange={(value: "volume" | "valeur") => setFormData(prev => ({ ...prev, objectifType: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="volume">Volume (nombre de dossiers)</SelectItem>
                    <SelectItem value="valeur">Valeur (montant en FCFA)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="objectifValeur">
                  Objectif {formData.objectifType === "volume" ? "(nombre)" : "(FCFA)"}
                </Label>
                <Input
                  id="objectifValeur"
                  type="number"
                  value={formData.objectifValeur}
                  onChange={(e) => setFormData(prev => ({ ...prev, objectifValeur: e.target.value }))}
                  placeholder={formData.objectifType === "volume" ? "50" : "1000000000"}
                />
              </div>
            </div>

            <div>
              <Label>Canaux de diffusion</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {CANAUX_DIFFUSION.map(canal => (
                  <div
                    key={canal.id}
                    className={`p-3 border rounded cursor-pointer transition-colors ${
                      formData.canauxDiffusion.includes(canal.id)
                        ? "bg-primary/10 border-primary"
                        : "hover:bg-accent"
                    }`}
                    onClick={() => toggleCanalDiffusion(canal.id)}
                  >
                    <div className="font-medium text-sm">{canal.nom}</div>
                    <div className="text-xs text-muted-foreground">{canal.description}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="prioritaire"
                  checked={formData.prioritaire}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, prioritaire: checked }))}
                />
                <Label htmlFor="prioritaire">Campagne prioritaire</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="actif"
                  checked={formData.actif}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, actif: checked }))}
                />
                <Label htmlFor="actif">Active</Label>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sélection du Barème</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Choisissez un barème existant ou créez-en un nouveau
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Barème existant</Label>
                  <Select value={formData.baremeExistant} onValueChange={handleBaremeExistantChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un barème existant" />
                    </SelectTrigger>
                    <SelectContent>
                      {BAREMES_EXISTANTS.map(bareme => (
                        <SelectItem key={bareme.id} value={bareme.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{bareme.nom}</span>
                            <span className="text-xs text-muted-foreground">
                              Taux: {bareme.taux}% - Marge: {bareme.marge}% - VR: {bareme.valeurResiduelle}%
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      ou créer un nouveau barème
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="nouveauBareme.nom">Nom du nouveau barème</Label>
                    <Input
                      id="nouveauBareme.nom"
                      value={formData.nouveauBareme.nom}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        nouveauBareme: { ...prev.nouveauBareme, nom: e.target.value }
                      }))}
                      placeholder="Ex: Barème Promo Été 2024"
                      disabled={!!formData.baremeExistant}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="nouveauBareme.taux">Taux (%)</Label>
                      <Input
                        id="nouveauBareme.taux"
                        type="number"
                        step="0.1"
                        value={formData.nouveauBareme.taux}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          nouveauBareme: { ...prev.nouveauBareme, taux: e.target.value }
                        }))}
                        placeholder="5.5"
                        disabled={!!formData.baremeExistant}
                      />
                    </div>
                    <div>
                      <Label htmlFor="nouveauBareme.marge">Marge (%)</Label>
                      <Input
                        id="nouveauBareme.marge"
                        type="number"
                        step="0.1"
                        value={formData.nouveauBareme.marge}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          nouveauBareme: { ...prev.nouveauBareme, marge: e.target.value }
                        }))}
                        placeholder="2.0"
                        disabled={!!formData.baremeExistant}
                      />
                    </div>
                    <div>
                      <Label htmlFor="nouveauBareme.valeurResiduelle">Valeur Résiduelle (%)</Label>
                      <Input
                        id="nouveauBareme.valeurResiduelle"
                        type="number"
                        step="0.1"
                        value={formData.nouveauBareme.valeurResiduelle}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          nouveauBareme: { ...prev.nouveauBareme, valeurResiduelle: e.target.value }
                        }))}
                        placeholder="1.5"
                        disabled={!!formData.baremeExistant}
                      />
                    </div>
                  </div>

                  {(formData.nouveauBareme.taux || formData.baremeExistant) && (
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Aperçu du barème</h4>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Taux:</span>
                          <span className="ml-2 font-medium">{formData.nouveauBareme.taux}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Marge:</span>
                          <span className="ml-2 font-medium">{formData.nouveauBareme.marge}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">VR:</span>
                          <span className="ml-2 font-medium">{formData.nouveauBareme.valeurResiduelle}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
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
                  <Zap className="h-8 w-8 text-red-500" />
                  Gestion des Campagnes Crédit-Bail
                </h1>
                <p className="text-muted-foreground mt-2">
                  Système complet de gestion des campagnes avec workflow de validation et suivi KPI
                </p>
              </div>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Créer une Campagne
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingCampagne ? "Modifier la Campagne" : "Nouvelle Campagne"} - Étape {currentStep}/2
                    </DialogTitle>
                    <DialogDescription>
                      {currentStep === 1 && "Informations générales et canaux de diffusion"}
                      {currentStep === 2 && "Sélection du barème"}
                    </DialogDescription>
                  </DialogHeader>
                  
                  {renderFormStep()}

                  <DialogFooter>
                    <div className="flex justify-between w-full">
                      <Button 
                        variant="outline" 
                        onClick={() => currentStep > 1 ? setCurrentStep(prev => prev - 1) : setIsDialogOpen(false)}
                      >
                        {currentStep > 1 ? "Précédent" : "Annuler"}
                      </Button>
                      <div className="flex gap-2">
                        {currentStep < 2 ? (
                          <Button onClick={() => setCurrentStep(prev => prev + 1)}>
                            Suivant
                          </Button>
                        ) : (
                          <Button onClick={handleSave}>
                            {editingCampagne ? "Modifier" : "Créer"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
              <TabsList>
                <TabsTrigger value="actives">Campagnes Actives</TabsTrigger>
                <TabsTrigger value="prioritaires">Prioritaires</TabsTrigger>
                <TabsTrigger value="validation">En Validation</TabsTrigger>
                <TabsTrigger value="expirees">Terminées</TabsTrigger>
              </TabsList>

              {["actives", "prioritaires", "validation", "expirees"].map(tab => (
                <TabsContent key={tab} value={tab}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {tab === "actives" && <><Calendar className="h-5 w-5" />Campagnes actives</>}
                        {tab === "prioritaires" && <><Target className="h-5 w-5" />Campagnes prioritaires</>}
                        {tab === "validation" && <><Settings className="h-5 w-5" />En cours de validation</>}
                        {tab === "expirees" && <><Calendar className="h-5 w-5" />Campagnes terminées</>}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Campagne</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Objectif</TableHead>
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
                                  <div className="font-medium flex items-center gap-2">
                                    {campagne.nom}
                                    {campagne.prioritaire && (
                                      <Badge variant="destructive" className="text-xs">
                                        PRIORITAIRE
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="text-sm text-muted-foreground">{campagne.description}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={campagne.type === "banque" ? "default" : "secondary"}>
                                  {campagne.type === "banque" ? "Banque" : "Fournisseur"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <div className="font-medium">
                                    {campagne.objectifCommercial.type === "volume" 
                                      ? `${campagne.objectifCommercial.objectif} dossiers`
                                      : `${new Intl.NumberFormat('fr-FR').format(campagne.objectifCommercial.objectif)} FCFA`
                                    }
                                  </div>
                                  {campagne.kpi && (
                                    <div className="text-muted-foreground">
                                      {campagne.objectifCommercial.type === "volume"
                                        ? `${campagne.kpi.nombreDossiers} réalisés`
                                        : `${new Intl.NumberFormat('fr-FR').format(campagne.kpi.valeurGeneree)} réalisés`
                                      }
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <div className="font-medium text-green-600">Taux: {campagne.bareme.taux}%</div>
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
                                <Badge className={getStatutColor(campagne.statut)}>
                                  {getStatutText(campagne.statut)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  {campagne.kpi && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleViewKPI(campagne)}
                                    >
                                      <TrendingUp className="h-4 w-4" />
                                    </Button>
                                  )}
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
                                    onClick={() => handleDelete(campagne.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
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

            {/* Dialog KPI */}
            <Dialog open={isKPIDialogOpen} onOpenChange={setIsKPIDialogOpen}>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    KPI - {selectedCampagneKPI?.nom}
                  </DialogTitle>
                </DialogHeader>
                {selectedCampagneKPI?.kpi && (
                  <CampagneKPI
                    kpiData={selectedCampagneKPI.kpi}
                    periode={{ debut: selectedCampagneKPI.dateDebut, fin: selectedCampagneKPI.dateFin }}
                  />
                )}
              </DialogContent>
            </Dialog>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Campagnes;
