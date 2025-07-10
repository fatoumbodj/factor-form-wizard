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
import { Plus, Edit, Trash2, Calculator, FileText, Search, Calendar } from "lucide-react";
import { BaremeComplet } from "@/types/leasing";
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
import { Progress } from "@/components/ui/progress";

const BAREMES_DEMO: BaremeComplet[] = [
  {
    id: "bar-std-001",
    nom: "Barème Standard Véhicules",
    type: "standard",
    taux: 7.0,
    marge: 3.0,
    valeurResiduelle: 2.5,
    typologie: "Crédit-Bail",
    dateCreation: new Date("2024-01-01"),
    dateApplication: new Date("2024-01-15"),
    dateFin: new Date("2024-12-31"),
    actif: true
  },
  {
    id: "bar-der-001",
    nom: "Barème Préférentiel Client VIP",
    type: "derogatoire",
    taux: 6.2,
    marge: 2.5,
    valeurResiduelle: 2.0,
    typologie: "LOA",
    dateCreation: new Date("2024-02-15"),
    dateApplication: new Date("2024-03-01"),
    dateFin: new Date("2024-12-31"),
    actif: true
  },
  {
    id: "bar-std-002",
    nom: "Barème Standard Équipement",
    type: "standard",
    taux: 7.5,
    marge: 3.2,
    valeurResiduelle: 2.8,
    typologie: "LLD",
    dateCreation: new Date("2024-03-01"),
    dateApplication: new Date("2024-03-15"),
    dateFin: new Date("2024-12-31"),
    actif: false
  }
];

const Bareme = () => {
  const [baremes, setBaremes] = useState<BaremeComplet[]>(BAREMES_DEMO);
  const [currentTab, setCurrentTab] = useState("standard");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBareme, setEditingBareme] = useState<BaremeComplet | null>(null);
  const [tauxRange, setTauxRange] = useState<number[]>([6, 8]);
  const [dureeRange, setDureeRange] = useState<number[]>([12, 60]);
  const [tauxDefaut, setTauxDefaut] = useState(7.0);
  const [dureeDefaut, setDureeDefaut] = useState(36);
  const [formData, setFormData] = useState({
    nom: "",
    type: "standard" as "standard" | "derogatoire",
    typologie: "",
    periodicite: "mensuelle",
    typeEcheancier: "",
    marge: "",
    valeurResiduelle: "",
    valeurReprise: "",
    premierLoyerMajore: "",
    premierLoyerType: "sup",
    codeClient: "",
    clientInfo: null as any,
    dateCreation: new Date().toISOString().split('T')[0],
    dateApplication: "",
    dateFin: "",
    actif: true
  });

  const resetForm = () => {
    setFormData({
      nom: "",
      type: "standard",
      typologie: "",
      periodicite: "mensuelle",
      typeEcheancier: "",
      marge: "",
      valeurResiduelle: "",
      valeurReprise: "",
      premierLoyerMajore: "",
      premierLoyerType: "sup",
      codeClient: "",
      clientInfo: null,
      dateCreation: new Date().toISOString().split('T')[0],
      dateApplication: "",
      dateFin: "",
      actif: true
    });
    setEditingBareme(null);
    setTauxRange([6, 8]);
    setDureeRange([12, 60]);
    setTauxDefaut(7.0);
    setDureeDefaut(36);
  };

  const handleEdit = (bareme: BaremeComplet) => {
    setEditingBareme(bareme);
    setFormData({
      nom: bareme.nom,
      type: bareme.type,
      typologie: bareme.typologie || "",
      periodicite: "mensuelle",
      typeEcheancier: "",
      marge: bareme.marge.toString(),
      valeurResiduelle: bareme.valeurResiduelle.toString(),
      valeurReprise: "",
      premierLoyerMajore: "",
      premierLoyerType: "sup",
      codeClient: "",
      clientInfo: null,
      dateCreation: bareme.dateCreation.toISOString().split('T')[0],
      dateApplication: bareme.dateApplication?.toISOString().split('T')[0] || "",
      dateFin: bareme.dateFin?.toISOString().split('T')[0] || "",
      actif: bareme.actif
    });
    setTauxRange([bareme.tauxMin || 6, bareme.tauxMax || 8]);
    setDureeRange([bareme.dureeMin || 12, bareme.dureeMax || 60]);
    setTauxDefaut(bareme.tauxDefaut || bareme.taux);
    setDureeDefaut(bareme.dureeDefaut || 36);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    const baremeData: BaremeComplet = {
      id: editingBareme?.id || `bar-${Date.now()}`,
      nom: formData.nom,
      type: formData.type,
      taux: tauxDefaut,
      tauxDefaut: tauxDefaut,
      tauxMin: tauxRange[0],
      tauxMax: tauxRange[1],
      dureeDefaut: dureeDefaut,
      dureeMin: dureeRange[0],
      dureeMax: dureeRange[1],
      marge: parseFloat(formData.marge),
      valeurResiduelle: parseFloat(formData.valeurResiduelle),
      typologie: formData.typologie,
      dateCreation: new Date(formData.dateCreation),
      dateApplication: formData.dateApplication ? new Date(formData.dateApplication) : undefined,
      dateFin: formData.dateFin ? new Date(formData.dateFin) : undefined,
      dateModification: editingBareme ? new Date() : undefined,
      actif: formData.actif
    };

    if (editingBareme) {
      setBaremes(prev => prev.map(b => b.id === editingBareme.id ? baremeData : b));
    } else {
      setBaremes(prev => [...prev, baremeData]);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setBaremes(prev => prev.filter(b => b.id !== id));
  };

  const handleSearchClient = () => {
    // Simulation de recherche client
    if (formData.codeClient) {
      const mockClientInfo = {
        nom: "Dupont",
        prenom: "Jean",
        adresse: "123 Rue de la Paix, Dakar",
        telephone: "+221 77 123 45 67",
        email: "jean.dupont@email.com"
      };
      setFormData(prev => ({ ...prev, clientInfo: mockClientInfo }));
    }
  };

  const getFilteredBaremes = () => {
    switch (currentTab) {
      case "standard":
        return baremes.filter(b => b.type === "standard");
      case "derogatoire":
        return baremes.filter(b => b.type === "derogatoire");
      case "inactif":
        return baremes.filter(b => !b.actif);
      default:
        return baremes;
    }
  };

  const getStatutColor = (actif: boolean) => {
    return actif ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
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
                  <Calculator className="h-8 w-8 text-blue-500" />
                  Gestion des Barèmes
                </h1>
                <p className="text-muted-foreground mt-2">
                  Configurez et gérez les barèmes de financement pour vos offres de leasing
                </p>
              </div>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau Barème
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingBareme ? "Modifier le Barème" : "Nouveau Barème"}
                    </DialogTitle>
                    <DialogDescription>
                      Configurez les paramètres financiers du barème
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nom">Nom du barème *</Label>
                        <Input
                          id="nom"
                          value={formData.nom}
                          onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                          placeholder="Ex: Barème Standard Véhicules"
                        />
                      </div>
                      <div>
                        <Label htmlFor="type">Type de barème *</Label>
                        <Select value={formData.type} onValueChange={(value: "standard" | "derogatoire") => setFormData(prev => ({ ...prev, type: value }))}>
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

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="typologie">Typologie *</Label>
                        <Select value={formData.typologie} onValueChange={(value) => setFormData(prev => ({ ...prev, typologie: value }))}>
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
                        <Label htmlFor="periodicite">Périodicité</Label>
                        <Select value={formData.periodicite} onValueChange={(value) => setFormData(prev => ({ ...prev, periodicite: value }))}>
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
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Configuration du Taux</Label>
                        <div className="space-y-4 p-4 border rounded-lg">
                          <div>
                            <Label>Plage autorisée (Min: {tauxRange[0]}% - Max: {tauxRange[1]}%)</Label>
                            <Slider
                              value={tauxRange}
                              onValueChange={setTauxRange}
                              min={0}
                              max={20}
                              step={0.1}
                              className="w-full mt-2"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="tauxDefaut">Taux par défaut (%) *</Label>
                            <Input
                              id="tauxDefaut"
                              type="number"
                              step="0.1"
                              min={tauxRange[0]}
                              max={tauxRange[1]}
                              value={tauxDefaut}
                              onChange={(e) => setTauxDefaut(parseFloat(e.target.value) || 0)}
                              placeholder="7.0"
                            />
                            <div className="mt-2">
                              <Progress
                                value={tauxDefaut}
                                defaultValue={tauxDefaut}
                                min={tauxRange[0]}
                                max={tauxRange[1]}
                                showDefaultIndicator={true}
                                className="w-full"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <Label>Configuration de la Durée</Label>
                        <div className="space-y-4 p-4 border rounded-lg">
                          <div>
                            <Label>Plage autorisée (Min: {dureeRange[0]} - Max: {dureeRange[1]} mois)</Label>
                            <Slider
                              value={dureeRange}
                              onValueChange={setDureeRange}
                              min={6}
                              max={120}
                              step={1}
                              className="w-full mt-2"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="dureeDefaut">Durée par défaut (mois) *</Label>
                            <Input
                              id="dureeDefaut"
                              type="number"
                              min={dureeRange[0]}
                              max={dureeRange[1]}
                              value={dureeDefaut}
                              onChange={(e) => setDureeDefaut(parseInt(e.target.value) || 0)}
                              placeholder="36"
                            />
                            <div className="mt-2">
                              <Progress
                                value={dureeDefaut}
                                defaultValue={dureeDefaut}
                                min={dureeRange[0]}
                                max={dureeRange[1]}
                                showDefaultIndicator={true}
                                className="w-full"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="typeEcheancier">Type échéancier</Label>
                      <Select value={formData.typeEcheancier} onValueChange={(value) => setFormData(prev => ({ ...prev, typeEcheancier: value }))}>
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

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="dateCreation">Date de création *</Label>
                        <Input
                          id="dateCreation"
                          type="date"
                          value={formData.dateCreation}
                          onChange={(e) => setFormData(prev => ({ ...prev, dateCreation: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="dateApplication">Date d'application</Label>
                        <Input
                          id="dateApplication"
                          type="date"
                          value={formData.dateApplication}
                          onChange={(e) => setFormData(prev => ({ ...prev, dateApplication: e.target.value }))}
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

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="valeurResiduelle">
                          {formData.typologie === "LLD" ? "Valeur de reprise (%)" : "Valeur résiduelle (%)"}
                        </Label>
                        <Input
                          id="valeurResiduelle"
                          type="number"
                          step="0.1"
                          value={formData.typologie === "LLD" ? formData.valeurReprise : formData.valeurResiduelle}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            [formData.typologie === "LLD" ? "valeurReprise" : "valeurResiduelle"]: e.target.value 
                          }))}
                          placeholder="1.8"
                        />
                      </div>
                      <div>
                        <Label htmlFor="marge">Marge (%)</Label>
                        <Input
                          id="marge"
                          type="number"
                          step="0.1"
                          value={formData.marge}
                          onChange={(e) => setFormData(prev => ({ ...prev, marge: e.target.value }))}
                          placeholder="2.8"
                        />
                      </div>
                    </div>

                    {formData.type === "derogatoire" && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="codeClient">Code client</Label>
                          <div className="flex gap-2">
                            <Input
                              id="codeClient"
                              value={formData.codeClient}
                              onChange={(e) => setFormData(prev => ({ ...prev, codeClient: e.target.value }))}
                              placeholder="Rechercher un code client..."
                            />
                            <Button variant="outline" onClick={handleSearchClient}>
                              <Search className="h-4 w-4 mr-2" />
                              Rechercher
                            </Button>
                          </div>
                        </div>

                        {formData.clientInfo && (
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Informations Client</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Nom et Prénom</Label>
                                  <p className="font-medium">{formData.clientInfo.nom} {formData.clientInfo.prenom}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Téléphone</Label>
                                  <p className="font-medium">{formData.clientInfo.telephone}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                                  <p className="font-medium">{formData.clientInfo.email}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Adresse</Label>
                                  <p className="font-medium">{formData.clientInfo.adresse}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        <div>
                          <Label>1er loyer majoré</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <Select value={formData.premierLoyerType} onValueChange={(value) => setFormData(prev => ({ ...prev, premierLoyerType: value }))}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="sup">Supérieur à</SelectItem>
                                <SelectItem value="inf">Inférieur à</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input
                              type="number"
                              step="0.1"
                              value={formData.premierLoyerMajore}
                              onChange={(e) => setFormData(prev => ({ ...prev, premierLoyerMajore: e.target.value }))}
                              placeholder="Valeur (%)"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Aperçu */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Aperçu du Barème</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-4 gap-4">
                          <div className="text-center p-3 bg-blue-50 rounded">
                            <div className="text-lg font-bold text-blue-600">
                              {tauxDefaut}%
                            </div>
                            <div className="text-xs text-muted-foreground">Taux par défaut</div>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded">
                            <div className="text-lg font-bold text-green-600">
                              {dureeDefaut} mois
                            </div>
                            <div className="text-xs text-muted-foreground">Durée par défaut</div>
                          </div>
                          <div className="text-center p-3 bg-purple-50 rounded">
                            <div className="text-lg font-bold text-purple-600">
                              {formData.typologie === "LLD" ? (formData.valeurReprise || "0") : (formData.valeurResiduelle || "0")}%
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formData.typologie === "LLD" ? "Valeur reprise" : "VR"}
                            </div>
                          </div>
                          <div className="text-center p-3 bg-red-50 rounded">
                            <div className="text-lg font-bold text-red-600">{formData.marge || "0"}%</div>
                            <div className="text-xs text-muted-foreground">Marge</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleSave}>
                      {editingBareme ? "Modifier" : "Créer"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
              <TabsList>
                <TabsTrigger value="standard">Barèmes Standard</TabsTrigger>
                <TabsTrigger value="derogatoire">Dérogatoires</TabsTrigger>
                <TabsTrigger value="inactif">Inactifs</TabsTrigger>
              </TabsList>

              {["standard", "derogatoire", "inactif"].map(tab => (
                <TabsContent key={tab} value={tab}>
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {tab === "standard" && "Barèmes standards"}
                        {tab === "derogatoire" && "Barèmes dérogatoires"}
                        {tab === "inactif" && "Barèmes inactifs"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Barème</TableHead>
                            <TableHead>Typologie</TableHead>
                            <TableHead>Paramètres financiers</TableHead>
                            <TableHead>Dates</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getFilteredBaremes().map((bareme) => (
                            <TableRow key={bareme.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{bareme.nom}</div>
                                  <Badge 
                                    variant={bareme.type === "standard" ? "default" : "secondary"}
                                    className="text-xs mt-1"
                                  >
                                    {bareme.type}
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {bareme.typologie || "Non définie"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <div>Taux: {bareme.taux}%</div>
                                  <div>Marge: {bareme.marge}%</div>
                                  <div>VR: {bareme.valeurResiduelle}%</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Créé: {bareme.dateCreation.toLocaleDateString()}
                                  </div>
                                  {bareme.dateApplication && (
                                    <div className="text-xs text-muted-foreground">
                                      App: {bareme.dateApplication.toLocaleDateString()}
                                    </div>
                                  )}
                                  {bareme.dateFin && (
                                    <div className="text-xs text-muted-foreground">
                                      Fin: {bareme.dateFin.toLocaleDateString()}
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={getStatutColor(bareme.actif)}>
                                  {bareme.actif ? "Actif" : "Inactif"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-1 flex-wrap">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEdit(bareme)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
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
                                        <AlertDialogTitle>Supprimer le barème</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Êtes-vous sûr de vouloir supprimer le barème "{bareme.nom}" ? 
                                          Cette action est irréversible.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                                        <AlertDialogAction 
                                          onClick={() => handleDelete(bareme.id)}
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

export default Bareme;
