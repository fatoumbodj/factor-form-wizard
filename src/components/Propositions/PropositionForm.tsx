
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TypeProposition, Convention, Campagne, BaremeComplet } from "@/types/leasing";
import { MaterialData } from "@/types/material";
import { Calculator, User, Package, FileText, Settings, Shield } from "lucide-react";
import LeasingTypeSelectorEnhanced from "./LeasingTypeSelectorEnhanced";
import ConventionSelector from "./ConventionSelector";
import CampagneSelector from "./CampagneSelector";
import LeasingTypeSection from "./LeasingTypeSection";
import PrestationsManager from "./PrestationsManager";
import AmortizationTable from "./AmortizationTable";
import ClientInfoSection from "./ClientInfoSection";
import GarantiesSection from "./GarantiesSection";
import BaremeSelectorEnhanced from "./BaremeSelectorEnhanced";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import MaterialTableManager from "./MaterialTableManager";

interface ClientInfo {
  type: "client" | "prospect";
  codeClient?: string;
  nom: string;
  prenom?: string;
  adresse: string;
  telephone: string;
  email: string;
  dateNaissance?: string;
  categorieJuridique?: string;
  secteurActivite?: string;
  identifiantNational?: string;
}

interface LeasingTypeData {
  libelleProduit: string;
  codeProduit: string;
  agence: string;
  dateDemande: string;
  dateMiseEnServiceProvisionnelle: string;
}

interface PrestationsData {
  fraisAssurance: number;
  fraisDossier: number;
  fraisTimbre: number;
}

interface CalculationInfo {
  duree: number;
  apport: number;
  frequencePaiement: "mensuel" | "trimestriel" | "annuel";
  bareme: string;
}

interface Garantie {
  id: string;
  natureGarantie: string;
  designationGarantie: string;
  typeGarantie: string;
  montantGarantie: number;
  pourcentageGarantie: number;
  dateDebutGarantie: string;
  dateFinGarantie: string;
}

// Demo data - clients existants
const CLIENTS_DEMO = [
  {
    codeClient: "CLI001",
    nom: "DIALLO",
    prenom: "Mamadou",
    adresse: "Rue 15, Dakar",
    telephone: "77 123 45 67",
    email: "mamadou.diallo@email.com",
    dateNaissance: "1985-05-15",
    categorieJuridique: "Particulier",
    secteurActivite: "Commerce",
    identifiantNational: "123456789"
  },
  {
    codeClient: "CLI002", 
    nom: "FALL",
    prenom: "Aminata",
    adresse: "Avenue Cheikh Anta Diop, Dakar",
    telephone: "76 987 65 43",
    email: "aminata.fall@email.com",
    dateNaissance: "1990-08-22",
    categorieJuridique: "Particulier",
    secteurActivite: "Services",
    identifiantNational: "987654321"
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
    actif: true,
    statut: "active"
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
    actif: true,
    statut: "active"
  }
];

// Fournisseurs disponibles pour le MaterialManager
const AVAILABLE_FOURNISSEURS = ["babacar-fils", "senegal-auto", "sonacos"];

const defaultClientInfo: ClientInfo = {
  type: "prospect",
  nom: "",
  prenom: "",
  adresse: "",
  telephone: "",
  email: "",
  dateNaissance: "",
  categorieJuridique: "",
  secteurActivite: "",
  identifiantNational: ""
};

const defaultLeasingTypeData: LeasingTypeData = {
  libelleProduit: "credit-bail",
  codeProduit: "CB 001",
  agence: "",
  dateDemande: new Date().toISOString().split('T')[0],
  dateMiseEnServiceProvisionnelle: ""
};

const defaultPrestationsData: PrestationsData = {
  fraisAssurance: 0,
  fraisDossier: 0,
  fraisTimbre: 0
};

const PropositionForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [typeProposition, setTypeProposition] = useState<TypeProposition | "classique" | null>(null);
  const [selectedConvention, setSelectedConvention] = useState<Convention | null>(null);
  const [selectedCampagne, setSelectedCampagne] = useState<Campagne | null>(null);
  const [selectedBareme, setSelectedBareme] = useState<BaremeComplet | null>(null);
  
  const [clientInfo, setClientInfo] = useState<ClientInfo>(defaultClientInfo);
  
  const [leasingTypeData, setLeasingTypeData] = useState<LeasingTypeData>(defaultLeasingTypeData);
  const [selectedMaterials, setSelectedMaterials] = useState<MaterialData[]>([]);
  const [selectedFournisseurs, setSelectedFournisseurs] = useState<string[]>([]);
  const [prestations, setPrestations] = useState<PrestationsData>(defaultPrestationsData);
  const [calculationInfo, setCalculationInfo] = useState<CalculationInfo>({
    duree: 36,
    apport: 0,
    frequencePaiement: "mensuel",
    bareme: ""
  });
  const [showAmortization, setShowAmortization] = useState(false);
  const [garanties, setGaranties] = useState<Garantie[]>([]);

  const handleTypePropositionSelect = (type: TypeProposition | "classique") => {
    setTypeProposition(type);
    setSelectedConvention(null);
    setSelectedCampagne(null);
    setSelectedBareme(null);
    
    if (type === "classique") {
      setCurrentStep(3);
    } else {
      setCurrentStep(2);
    }
  };

  const handleConventionSelect = (convention: Convention) => {
    setSelectedConvention(convention);
    setSelectedCampagne(null);
    setCurrentStep(3);
  };

  const handleCampagneSelect = (campagne: Campagne) => {
    setSelectedCampagne(campagne);
    setSelectedConvention(null);
    setCurrentStep(3);
  };

  const handleBaremeSelect = (bareme: BaremeComplet) => {
    setSelectedBareme(bareme);
    setCalculationInfo(prev => ({ ...prev, bareme: bareme.id }));
  };

  const getAvailableBaremes = () => {
    if (typeProposition === "classique") {
      const standardBaremes = BAREMES_DEMO.filter(b => b.type === "standard");
      const derogatoireBaremes = BAREMES_DEMO.filter(b => b.type === "derogatoire");
      
      const clientHasDerogatory = clientInfo.categorieJuridique === "Entreprise";
      
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
          actif: true,
          statut: "active"
        }
      ] : [];
    }
    return BAREMES_DEMO;
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
              onConventionSelect={handleConventionSelect}
            />
          );
        } else if (typeProposition === "campagne") {
          return (
            <CampagneSelector
              selectedCampagne={selectedCampagne}
              onCampagneSelect={handleCampagneSelect}
            />
          );
        } else {
          setCurrentStep(3);
          return null;
        }

      case 3:
        return (
          <div className="space-y-6">
            {/* Navigation par étapes */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-2">
                {[
                  { num: 1, label: "Client", icon: User },
                  { num: 2, label: "Produit", icon: Settings },
                  { num: 3, label: "Matériel", icon: Package },
                  { num: 4, label: "Barèmes", icon: Calculator },
                  { num: 5, label: "Prestations", icon: FileText },
                  { num: 6, label: "Garanties", icon: Shield },
                  { num: 7, label: "Amortissement", icon: Calculator }
                ].map((step, index) => (
                  <div key={step.num} className="flex items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                        {step.num}
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-900">{step.label}</span>
                    </div>
                    {index < 6 && <div className="w-8 h-px bg-gray-300 mx-4"></div>}
                  </div>
                ))}
              </div>
            </div>
            
            <Tabs defaultValue="client" className="w-full">
              <TabsList>
                <TabsTrigger value="client">
                  <User className="h-4 w-4 mr-2" />
                  1. Client
                </TabsTrigger>
                <TabsTrigger value="produit">
                  <Settings className="h-4 w-4 mr-2" />
                  2. Produit
                </TabsTrigger>
                <TabsTrigger value="materials">
                  <Package className="h-4 w-4 mr-2" />
                  3. Matériel
                </TabsTrigger>
                <TabsTrigger value="bareme">
                  <Calculator className="h-4 w-4 mr-2" />
                  4. Barème
                </TabsTrigger>
                <TabsTrigger value="prestations">
                  <FileText className="h-4 w-4 mr-2" />
                  5. Prestations
                </TabsTrigger>
                <TabsTrigger value="garanties">
                  <Shield className="h-4 w-4 mr-2" />
                  6. Garanties
                </TabsTrigger>
                <TabsTrigger value="amortissement">
                  <Calculator className="h-4 w-4 mr-2" />
                  7. Amortissement
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="client">
                <ClientInfoSection
                  clientInfo={clientInfo}
                  onClientInfoChange={setClientInfo}
                  clientsDemo={CLIENTS_DEMO}
                />
              </TabsContent>

              <TabsContent value="produit">
                <LeasingTypeSection 
                  data={leasingTypeData}
                  onDataChange={setLeasingTypeData}
                />
              </TabsContent>
              
              <TabsContent value="materials">
                <MaterialTableManager
                  materials={selectedMaterials}
                  onMaterialsChange={setSelectedMaterials}
                />
              </TabsContent>
              
              <TabsContent value="bareme">
                <BaremeSelectorEnhanced
                  selectedBareme={selectedBareme}
                  onBaremeSelect={handleBaremeSelect}
                  clientId={clientInfo.codeClient}
                  campagne={selectedCampagne}
                  convention={selectedConvention}
                />
                
                {selectedBareme && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Paramètres de calcul</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="duree">Durée (mois)</Label>
                          <Input 
                            type="number" 
                            id="duree" 
                            value={calculationInfo.duree} 
                            onChange={(e) => setCalculationInfo(prev => ({ ...prev, duree: parseInt(e.target.value) || 0 }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="apport">Apport (%)</Label>
                          <Input 
                            type="number" 
                            id="apport" 
                            value={calculationInfo.apport} 
                            onChange={(e) => setCalculationInfo(prev => ({ ...prev, apport: parseInt(e.target.value) || 0 }))}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Fréquence de Paiement</Label>
                        <div className="flex gap-2 mt-2">
                          <Button 
                            variant={calculationInfo.frequencePaiement === "mensuel" ? "default" : "outline"}
                            onClick={() => setCalculationInfo(prev => ({ ...prev, frequencePaiement: "mensuel" }))}
                          >
                            Mensuel
                          </Button>
                          <Button
                            variant={calculationInfo.frequencePaiement === "trimestriel" ? "default" : "outline"}
                            onClick={() => setCalculationInfo(prev => ({ ...prev, frequencePaiement: "trimestriel" }))}
                          >
                            Trimestriel
                          </Button>
                          <Button
                            variant={calculationInfo.frequencePaiement === "annuel" ? "default" : "outline"}
                            onClick={() => setCalculationInfo(prev => ({ ...prev, frequencePaiement: "annuel" }))}
                          >
                            Annuel
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="prestations">
                <PrestationsManager
                  prestations={prestations}
                  onPrestationsChange={setPrestations}
                />
              </TabsContent>

              <TabsContent value="garanties">
                <GarantiesSection
                  garanties={garanties}
                  onGarantiesChange={setGaranties}
                />
              </TabsContent>
              
              <TabsContent value="amortissement">
                {showAmortization ? (
                  <AmortizationTable 
                    montant={selectedMaterials.reduce((sum, m) => sum + (m.valeurInitialeHT || 0), 0)}
                    duree={calculationInfo.duree}
                    taux={selectedBareme?.taux || 7.5}
                    onSaveDraft={() => console.log("Sauvegarder en brouillon")}
                    onSendForValidation={() => console.log("Envoyer pour validation")}
                    className="w-full"
                  />
                ) : (
                  <div className="text-center p-8">
                    <p className="text-muted-foreground mb-4">
                      Complétez les informations matériel et barème pour générer le tableau d'amortissement.
                    </p>
                    <button 
                      onClick={() => setShowAmortization(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Générer le tableau d'amortissement
                    </button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
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
