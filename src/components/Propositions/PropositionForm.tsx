import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import LeasingTypeSelectorEnhanced from "./LeasingTypeSelectorEnhanced";
import ConventionSelector from "./ConventionSelector";
import CampagneSelector from "./CampagneSelector";
import AmortizationTable from "./AmortizationTable";
import { TypeProposition, Convention, Campagne, BaremeComplet } from "@/types/leasing";
import { Calculator, User, Package, FileText, Search } from "lucide-react";

interface ClientInfo {
  type: "client" | "prospect";
  codeClient?: string;
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  typeClient: "particulier" | "entreprise" | "association";
}

interface MaterialInfo {
  designation: string;
  prixHT: number;
  tva: number;
  categorie: string;
  fournisseur: string;
}

interface CalculationInfo {
  duree: number;
  apport: number;
  frequencePaiement: "mensuel" | "trimestriel" | "annuel";
  bareme: string;
}

// Demo data - clients existants
const CLIENTS_DEMO = [
  {
    codeClient: "CLI001",
    nom: "Société DIALLO & Frères",
    adresse: "Rue 15, Dakar",
    telephone: "77 123 45 67",
    email: "contact@diallo-freres.sn",
    typeClient: "entreprise" as const
  },
  {
    codeClient: "CLI002", 
    nom: "Mamadou FALL",
    adresse: "Avenue Cheikh Anta Diop, Dakar",
    telephone: "76 987 65 43",
    email: "mamadou.fall@email.com",
    typeClient: "particulier" as const
  }
];

// Demo data - barèmes disponibles
const BAREMES_DEMO: BaremeComplet[] = [
  {
    id: "bar-std-001",
    nom: "Barème Standard Crédit-Bail",
    type: "standard",
    taux: 7.0,
    marge: 3.0,
    valeurResiduelle: 2.5,
    typologie: "Crédit-Bail",
    dateCreation: new Date("2024-01-01"),
    actif: true
  },
  {
    id: "bar-der-001",
    nom: "Barème Dérogatoire PME",
    type: "derogatoire",
    taux: 6.5,
    marge: 2.5,
    valeurResiduelle: 2.0,
    typologie: "Crédit-Bail",
    dateCreation: new Date("2024-01-01"),
    actif: true
  }
];

const defaultClientInfo: ClientInfo = {
  type: "prospect",
  nom: "",
  adresse: "",
  telephone: "",
  email: "",
  typeClient: "particulier"
};

const defaultMaterialInfo: MaterialInfo = {
  designation: "",
  prixHT: 0,
  tva: 0,
  categorie: "",
  fournisseur: ""
};

const defaultCalculationInfo: CalculationInfo = {
  duree: 36,
  apport: 0,
  frequencePaiement: "mensuel",
  bareme: ""
};

const PropositionForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [typeProposition, setTypeProposition] = useState<TypeProposition | "classique" | null>(null);
  const [selectedConvention, setSelectedConvention] = useState<Convention | null>(null);
  const [selectedCampagne, setSelectedCampagne] = useState<Campagne | null>(null);
  
  const [clientInfo, setClientInfo] = useState<ClientInfo>(defaultClientInfo);
  const [materialInfo, setMaterialInfo] = useState<MaterialInfo>(defaultMaterialInfo);
  const [calculationInfo, setCalculationInfo] = useState<CalculationInfo>(defaultCalculationInfo);
  const [prestations, setPrestations] = useState<string[]>([]);
  const [showAmortization, setShowAmortization] = useState(false);
  const [searchClientCode, setSearchClientCode] = useState("");
  const [isClientReadonly, setIsClientReadonly] = useState(false);

  const handleTypePropositionSelect = (type: TypeProposition | "classique") => {
    setTypeProposition(type);
    setSelectedConvention(null);
    setSelectedCampagne(null);
    
    if (type === "classique") {
      setCurrentStep(3); // Aller directement à la saisie
    } else {
      setCurrentStep(2);
    }
  };

  const handleConventionSelect = (convention: Convention) => {
    setSelectedConvention(convention);
    setCurrentStep(3);
  };

  const handleCampagneSelect = (campagne: Campagne) => {
    setSelectedCampagne(campagne);
    setCurrentStep(3);
  };

  const handleSearchClient = () => {
    const client = CLIENTS_DEMO.find(c => c.codeClient === searchClientCode);
    if (client) {
      setClientInfo({
        type: "client",
        codeClient: client.codeClient,
        nom: client.nom,
        adresse: client.adresse,
        telephone: client.telephone,
        email: client.email,
        typeClient: client.typeClient
      });
      setIsClientReadonly(true);
    }
  };

  const handleClientTypeChange = (type: "client" | "prospect") => {
    if (type === "prospect") {
      setClientInfo(defaultClientInfo);
      setIsClientReadonly(false);
      setSearchClientCode("");
    } else {
      setClientInfo(prev => ({ ...prev, type }));
    }
  };

  const getAvailableBaremes = () => {
    if (typeProposition === "classique") {
      // Pour le type classique, d'abord les barèmes standard, puis dérogatoires si client a accès
      const standardBaremes = BAREMES_DEMO.filter(b => b.type === "standard");
      const derogatoireBaremes = BAREMES_DEMO.filter(b => b.type === "derogatoire");
      
      // Logique pour déterminer si le client a accès aux barèmes dérogatoires
      const clientHasDerogatory = clientInfo.typeClient === "entreprise"; // exemple
      
      return clientHasDerogatory ? [...standardBaremes, ...derogatoireBaremes] : standardBaremes;
    } else if (typeProposition === "convention") {
      return selectedConvention ? [
        {
          id: "conv-bareme",
          nom: `Barème ${selectedConvention.nom}`,
          type: "derogatoire" as const,
          taux: selectedConvention.bareme.taux,
          marge: selectedConvention.bareme.marge,
          valeurResiduelle: selectedConvention.bareme.valeurResiduelle,
          typologie: "Crédit-Bail",
          dateCreation: new Date(),
          actif: true
        }
      ] : [];
    }
    return BAREMES_DEMO;
  };

  const handleClientInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setClientInfo(prev => ({ ...prev, [id]: value }));
  };

  const handleMaterialInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const parsedValue = parseFloat(value);
    setMaterialInfo(prev => ({ ...prev, [id]: isNaN(parsedValue) ? 0 : parsedValue }));
  };

  const handleCalculationInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const parsedValue = parseInt(value, 10);
    setCalculationInfo(prev => ({ ...prev, [id]: isNaN(parsedValue) ? 0 : parsedValue }));
  };

  const handleFrequencyChange = (value: "mensuel" | "trimestriel" | "annuel") => {
    setCalculationInfo(prev => ({ ...prev, frequencePaiement: value }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <LeasingTypeSelectorEnhanced
            selectedType={typeProposition}
            onTypeSelect={handleTypePropositionSelect}
            onContinue={() => setCurrentStep(typeProposition === "classique" ? 3 : 2)}
          />
        );

      case 2:
        if (typeProposition === "convention") {
          return (
            <ConventionSelector
              selectedConvention={selectedConvention}
              onConventionSelect={(convention) => {
                setSelectedConvention(convention);
                setCurrentStep(3);
              }}
            />
          );
        } else if (typeProposition === "campagne") {
          return (
            <CampagneSelector
              selectedCampagne={selectedCampagne}
              onCampagneSelect={(campagne) => {
                setSelectedCampagne(campagne);
                setCurrentStep(3);
              }}
            />
          );
        } else {
          // Type standard - passer directement à l'étape 3
          setCurrentStep(3);
          return null;
        }

      case 3:
        return (
          <Tabs defaultValue="client" className="w-full">
            <TabsList>
              <TabsTrigger value="client">
                <User className="h-4 w-4 mr-2" />
                Client
              </TabsTrigger>
              <TabsTrigger value="materials">
                <Package className="h-4 w-4 mr-2" />
                Produit
              </TabsTrigger>
              <TabsTrigger value="calculation">
                <Calculator className="h-4 w-4 mr-2" />
                Barème
              </TabsTrigger>
              <TabsTrigger value="prestations">
                <FileText className="h-4 w-4 mr-2" />
                Prestations
              </TabsTrigger>
              <TabsTrigger value="amortissement">
                <Calculator className="h-4 w-4 mr-2" />
                Amortissement
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="client">
              <Card>
                <CardHeader>
                  <CardTitle>Informations Client</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Type de client : Client ou Prospect */}
                  <div>
                    <Label>Type</Label>
                    <div className="flex gap-2 mt-2">
                      <Button 
                        variant={clientInfo.type === "client" ? "default" : "outline"}
                        onClick={() => handleClientTypeChange("client")}
                      >
                        Client
                      </Button>
                      <Button
                        variant={clientInfo.type === "prospect" ? "default" : "outline"}
                        onClick={() => handleClientTypeChange("prospect")}
                      >
                        Prospect
                      </Button>
                    </div>
                  </div>

                  {/* Recherche client si type = client */}
                  {clientInfo.type === "client" && (
                    <div>
                      <Label htmlFor="searchClient">Code Client</Label>
                      <div className="flex gap-2">
                        <Input
                          id="searchClient"
                          value={searchClientCode}
                          onChange={(e) => setSearchClientCode(e.target.value)}
                          placeholder="Saisir le code client"
                        />
                        <Button onClick={handleSearchClient} variant="outline">
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nom">Nom du Client</Label>
                      <Input 
                        type="text" 
                        id="nom" 
                        value={clientInfo.nom} 
                        onChange={handleClientInfoChange}
                        readOnly={isClientReadonly}
                        className={isClientReadonly ? "bg-gray-100" : ""}
                      />
                    </div>
                    <div>
                      <Label htmlFor="typeClient">Type de Client</Label>
                      <Select 
                        value={clientInfo.typeClient} 
                        onValueChange={(value: "particulier" | "entreprise" | "association") => setClientInfo(prev => ({ ...prev, typeClient: value }))}
                        disabled={isClientReadonly}
                      >
                        <SelectTrigger className={isClientReadonly ? "bg-gray-100" : ""}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="particulier">Particulier</SelectItem>
                          <SelectItem value="entreprise">Entreprise</SelectItem>
                          <SelectItem value="association">Association</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="adresse">Adresse</Label>
                    <Textarea 
                      id="adresse" 
                      value={clientInfo.adresse} 
                      onChange={handleClientInfoChange}
                      readOnly={isClientReadonly}
                      className={isClientReadonly ? "bg-gray-100" : ""}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="telephone">Téléphone</Label>
                      <Input 
                        type="tel" 
                        id="telephone" 
                        value={clientInfo.telephone} 
                        onChange={handleClientInfoChange}
                        readOnly={false} // Toujours modifiable
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        type="email" 
                        id="email" 
                        value={clientInfo.email} 
                        onChange={handleClientInfoChange}
                        readOnly={false} // Toujours modifiable
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="materials">
              <Card>
                <CardHeader>
                  <CardTitle>Informations Matériel & Produit</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="designation">Désignation du Matériel</Label>
                    <Input type="text" id="designation" value={materialInfo.designation} onChange={(e) => setMaterialInfo(prev => ({ ...prev, designation: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="categorie">Catégorie</Label>
                      <Select value={materialInfo.categorie} onValueChange={(value) => setMaterialInfo(prev => ({ ...prev, categorie: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vehicules">Véhicules</SelectItem>
                          <SelectItem value="materiels-industriels">Matériels Industriels</SelectItem>
                          <SelectItem value="equipements-bureautique">Équipements Bureautique</SelectItem>
                          <SelectItem value="equipements-medicaux">Équipements Médicaux</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="fournisseur">Fournisseur</Label>
                      <Select value={materialInfo.fournisseur} onValueChange={(value) => setMaterialInfo(prev => ({ ...prev, fournisseur: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un fournisseur" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="babacar-fils">Babacar & Fils</SelectItem>
                          <SelectItem value="senegal-auto">Sénégal Auto</SelectItem>
                          <SelectItem value="sonacos">Sonacos</SelectItem>
                          <SelectItem value="afrique-materiel">Afrique Matériel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="prixHT">Prix HT</Label>
                      <Input type="number" id="prixHT" value={materialInfo.prixHT} onChange={handleMaterialInfoChange} />
                    </div>
                    <div>
                      <Label htmlFor="tva">TVA (%)</Label>
                      <Input type="number" id="tva" value={materialInfo.tva} onChange={handleMaterialInfoChange} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="calculation">
              <Card>
                <CardHeader>
                  <CardTitle>Barème & Calculs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="bareme">Barème à appliquer</Label>
                    <Select value={calculationInfo.bareme} onValueChange={(value) => setCalculationInfo(prev => ({ ...prev, bareme: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un barème" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableBaremes().map(bareme => (
                          <SelectItem key={bareme.id} value={bareme.id}>
                            {bareme.nom} ({bareme.type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="duree">Durée (mois)</Label>
                      <Input type="number" id="duree" value={calculationInfo.duree} onChange={handleCalculationInfoChange} />
                    </div>
                    <div>
                      <Label htmlFor="apport">Apport (%)</Label>
                      <Input type="number" id="apport" value={calculationInfo.apport} onChange={handleCalculationInfoChange} />
                    </div>
                  </div>
                  <div>
                    <Label>Fréquence de Paiement</Label>
                    <div className="flex gap-2 mt-2">
                      <Button 
                        variant={calculationInfo.frequencePaiement === "mensuel" ? "default" : "outline"}
                        onClick={() => handleFrequencyChange("mensuel")}
                      >
                        Mensuel
                      </Button>
                      <Button
                        variant={calculationInfo.frequencePaiement === "trimestriel" ? "default" : "outline"}
                        onClick={() => handleFrequencyChange("trimestriel")}
                      >
                        Trimestriel
                      </Button>
                      <Button
                        variant={calculationInfo.frequencePaiement === "annuel" ? "default" : "outline"}
                        onClick={() => handleFrequencyChange("annuel")}
                      >
                        Annuel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="prestations">
              <Card>
                <CardHeader>
                  <CardTitle>Prestations Complémentaires</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Services inclus</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {["Assurance", "Maintenance", "Extension de garantie", "Formation", "Installation", "Support technique"].map(prestation => (
                        <div key={prestation} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={prestation}
                            checked={prestations.includes(prestation)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setPrestations([...prestations, prestation]);
                              } else {
                                setPrestations(prestations.filter(p => p !== prestation));
                              }
                            }}
                          />
                          <Label htmlFor={prestation}>{prestation}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="amortissement">
              {showAmortization ? (
                <AmortizationTable 
                  montant={materialInfo.prixHT + (materialInfo.prixHT * materialInfo.tva / 100)}
                  duree={calculationInfo.duree}
                  taux={7.5}
                  className="w-full"
                />
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Tableau d'Amortissement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Générez le tableau d'amortissement basé sur vos paramètres de financement.
                      </p>
                      <Button onClick={() => setShowAmortization(true)}>
                        Générer le tableau d'amortissement
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {renderStepContent()}
    </div>
  );
};

export default PropositionForm;
