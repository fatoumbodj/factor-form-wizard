import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Convention, BaremeComplet } from "@/types/leasing";
import { CheckCircle, Calendar, Users, Percent, Plus } from "lucide-react";
import ConventionActions from "../Conventions/ConventionActions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BaremeSelector, BaremeData } from "@/components/ui/bareme-selector";

// Updated BAREMES_DISPONIBLES to match BaremeData interface
const BAREMES_DISPONIBLES: BaremeData[] = [
  {
    id: "bar-std-001",
    nom: "Barème Standard Crédit-Bail",
    type: "standard",
    taux: 7.0,
    marge: 3.0,
    valeurResiduelle: 2.5
  },
  {
    id: "bar-conv-001",
    nom: "Barème Convention Véhicules",
    type: "derogatoire",
    taux: 6.5,
    marge: 2.8,
    valeurResiduelle: 1.8
  }
];

// Updated demo data to match the new Convention interface
const CONVENTIONS_DEMO: Convention[] = [
  {
    id: "conv-vehicules-001",
    nom: "Véhicules Professionnels 2024",
    description: "Convention dédiée aux véhicules utilitaires et professionnels avec conditions préférentielles",
    fournisseurs: ["babacar-fils", "senegal-auto"],
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
    id: "conv-equipement-002",
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
    id: "conv-agriculture-003",
    nom: "Matériel Agricole Spécialisé",
    description: "Convention spécialisée pour les équipements agricoles et agroalimentaires",
    fournisseurs: ["agri-senegal"],
    prestatairesMaintenace: ["maintenance-agricole", "techno-maintenance"],
    categoriesMateriels: ["tracteurs", "moissonneuses", "equipement-agricole"],
    bareme: {
      taux: 6.8,
      marge: 3.2,
      valeurResiduelle: 1.5
    },
    dateDebut: new Date("2024-01-01"),
    dateFin: new Date("2024-12-31"),
    reconductionTacite: true,
    actif: true,
    statut: "active"
  }
];

interface ConventionSelectorProps {
  selectedConvention: Convention | null;
  onConventionSelect: (convention: Convention) => void;
}

const ConventionSelector = ({ selectedConvention, onConventionSelect }: ConventionSelectorProps) => {
  const [selectedFournisseur, setSelectedFournisseur] = useState<string>("");
  const [selectedBareme, setSelectedBareme] = useState<BaremeData | null>(null);

  const fournisseurs = Array.from(
    new Set(CONVENTIONS_DEMO.flatMap(conv => conv.fournisseurs))
  );

  const filteredConventions = selectedFournisseur
    ? CONVENTIONS_DEMO.filter(conv => conv.fournisseurs.includes(selectedFournisseur))
    : CONVENTIONS_DEMO;

  const handleBaremeSelect = (bareme: BaremeData) => {
    setSelectedBareme(bareme);
    console.log("Barème sélectionné:", bareme);
  };

  const handleCreateNewBareme = (newBareme: Omit<BaremeData, 'id'>) => {
    const bareme: BaremeData = {
      id: `bar-${Date.now()}`,
      ...newBareme
    };
    setSelectedBareme(bareme);
    console.log("Nouveau barème créé:", bareme);
  };

  const handleReconduct = (convention: Convention, startDate: Date, motif: string) => {
    console.log("Reconduction:", convention.nom, startDate, motif);
    // Logique de reconduction
  };

  const handleResiliate = (convention: Convention, motif: string) => {
    console.log("Résiliation:", convention.nom, motif);
    // Logique de résiliation
  };

  const handleCancel = (convention: Convention, motif: string) => {
    console.log("Annulation:", convention.nom, motif);
    // Logique d'annulation
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Sélection du Fournisseur
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {fournisseurs.map(fournisseur => (
              <Button
                key={fournisseur}
                variant={selectedFournisseur === fournisseur ? "default" : "outline"}
                onClick={() => setSelectedFournisseur(fournisseur)}
                className="justify-start"
              >
                {fournisseur.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Updated Sélection du Barème */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5" />
            Sélection du Barème
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BaremeSelector
            selectedBareme={selectedBareme}
            onBaremeSelect={handleBaremeSelect}
            availableBaremes={BAREMES_DISPONIBLES}
            showCreateNew={true}
            onCreateNew={handleCreateNewBareme}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Conventions Disponibles
            {selectedFournisseur && (
              <Badge variant="secondary">
                {selectedFournisseur.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredConventions.map(convention => (
              <div
                key={convention.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedConvention?.id === convention.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => onConventionSelect(convention)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{convention.nom}</h3>
                      {selectedConvention?.id === convention.id && (
                        <CheckCircle className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {convention.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        Taux: {convention.bareme.taux}%
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Marge: {convention.bareme.marge}%
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        VR: {convention.bareme.valeurResiduelle}%
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <Badge variant={convention.statut === "active" ? "default" : "secondary"}>
                        {convention.statut}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        {convention.dateFin 
                          ? `Jusqu'au ${convention.dateFin.toLocaleDateString()}`
                          : "Durée indéterminée"
                        }
                      </div>
                    </div>
                    <ConventionActions
                      convention={convention}
                      onReconduct={handleReconduct}
                      onResiliate={handleResiliate}
                      onCancel={handleCancel}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConventionSelector;
