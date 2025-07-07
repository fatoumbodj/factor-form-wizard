
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Package, Search, Tag } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Materiel {
  id: string;
  designation: string;
  categorie: string;
  fournisseur: string;
  prixMin: number;
  prixMax: number;
  argumentsMarketing?: string[];
}

interface MaterielSelectorProps {
  fournisseursSelectionnes: string[];
  materielsSelectionnes: string[];
  onMaterielToggle: (materielId: string) => void;
  onArgumentsChange: (materielId: string, argumentsMarketing: string[]) => void;
  onFournisseurChange?: (fournisseurs: string[]) => void;
}

// Données de démonstration étendues
const MATERIELS_DISPONIBLES: Materiel[] = [
  {
    id: "mat-1",
    designation: "Peugeot 308 SW",
    categorie: "Véhicules légers",
    fournisseur: "babacar-fils",
    prixMin: 15000000,
    prixMax: 22000000,
    argumentsMarketing: ["Économique", "Fiable", "Spacieux"]
  },
  {
    id: "mat-2",
    designation: "Renault Master",
    categorie: "Véhicules utilitaires",
    fournisseur: "senegal-auto",
    prixMin: 18000000,
    prixMax: 25000000,
    argumentsMarketing: ["Robuste", "Grande capacité"]
  },
  {
    id: "mat-3",
    designation: "Tracteur agricole John Deere",
    categorie: "Équipements agricoles",
    fournisseur: "agri-senegal",
    prixMin: 35000000,
    prixMax: 80000000,
    argumentsMarketing: ["Haute performance", "Technologie avancée"]
  },
  {
    id: "mat-4",
    designation: "Pelleteuse Caterpillar",
    categorie: "Équipements BTP",
    fournisseur: "dakar-equipement",
    prixMin: 45000000,
    prixMax: 120000000,
    argumentsMarketing: ["Puissant", "Durable", "Efficace"]
  },
  {
    id: "mat-5",
    designation: "Renault Trafic",
    categorie: "Véhicules utilitaires",
    fournisseur: "senegal-auto",
    prixMin: 12000000,
    prixMax: 18000000,
    argumentsMarketing: ["Compact", "Économique", "Maniable"]
  },
  {
    id: "mat-6",
    designation: "Toyota Hilux",
    categorie: "Pick-up",
    fournisseur: "babacar-fils",
    prixMin: 20000000,
    prixMax: 28000000,
    argumentsMarketing: ["Robuste", "Tout-terrain", "Fiable"]
  },
  {
    id: "mat-7",
    designation: "Équipement industriel Sonacos",
    categorie: "Machines industrielles",
    fournisseur: "sonacos",
    prixMin: 25000000,
    prixMax: 50000000,
    argumentsMarketing: ["Haute qualité", "Production locale"]
  },
  {
    id: "mat-8",
    designation: "Matériel BTP Techno",
    categorie: "Équipements BTP",
    fournisseur: "techno-equipement",
    prixMin: 30000000,
    prixMax: 75000000,
    argumentsMarketing: ["Innovation", "Performance"]
  }
];

const FOURNISSEURS_DISPONIBLES = [
  { id: "babacar-fils", nom: "Babacar Fils" },
  { id: "senegal-auto", nom: "Senegal Auto" },
  { id: "sonacos", nom: "Sonacos" },
  { id: "afrique-materiel", nom: "Afrique Materiel" },
  { id: "dakar-equipement", nom: "Dakar Equipement" },
  { id: "techno-equipement", nom: "Techno Equipement" },
  { id: "agri-senegal", nom: "Agri Senegal" }
];

const MaterielSelector = ({ 
  fournisseursSelectionnes, 
  materielsSelectionnes, 
  onMaterielToggle,
  onArgumentsChange,
  onFournisseurChange 
}: MaterielSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [nouveauxArguments, setNouveauxArguments] = useState<{[key: string]: string}>({});
  const [selectedFournisseur, setSelectedFournisseur] = useState<string>("");

  const handleFournisseurChange = (fournisseurId: string) => {
    setSelectedFournisseur(fournisseurId);
    if (onFournisseurChange) {
      onFournisseurChange([fournisseurId]);
    }
  };

  const materielsFiltres = MATERIELS_DISPONIBLES.filter(materiel => {
    const fournisseurMatch = selectedFournisseur === "" || materiel.fournisseur === selectedFournisseur;
    const searchMatch = searchTerm === "" || 
      materiel.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      materiel.categorie.toLowerCase().includes(searchTerm.toLowerCase());
    
    return fournisseurMatch && searchMatch;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const ajouterArgument = (materielId: string) => {
    const argument = nouveauxArguments[materielId];
    if (argument && argument.trim()) {
      const materiel = MATERIELS_DISPONIBLES.find(m => m.id === materielId);
      if (materiel) {
        const nouveauxArgs = [...(materiel.argumentsMarketing || []), argument.trim()];
        onArgumentsChange(materielId, nouveauxArgs);
        setNouveauxArguments(prev => ({ ...prev, [materielId]: "" }));
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-blue-500" />
          Sélection des Matériels Éligibles
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Choisissez les matériels inclus dans la campagne et personnalisez les arguments marketing
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Fournisseurs partenaires *
            </label>
            <Select value={selectedFournisseur} onValueChange={handleFournisseurChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un fournisseur" />
              </SelectTrigger>
              <SelectContent>
                {FOURNISSEURS_DISPONIBLES.map(fournisseur => (
                  <SelectItem key={fournisseur.id} value={fournisseur.id}>
                    {fournisseur.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un matériel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-4">
          {materielsFiltres.map((materiel) => (
            <Card key={materiel.id} className="p-4">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={materielsSelectionnes.includes(materiel.id)}
                      onCheckedChange={() => onMaterielToggle(materiel.id)}
                    />
                    <div>
                      <h4 className="font-medium">{materiel.designation}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{materiel.categorie}</Badge>
                        <Badge variant="secondary">
                          {FOURNISSEURS_DISPONIBLES.find(f => f.id === materiel.fournisseur)?.nom || materiel.fournisseur}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {formatCurrency(materiel.prixMin)} - {formatCurrency(materiel.prixMax)}
                    </div>
                  </div>
                </div>

                {materielsSelectionnes.includes(materiel.id) && (
                  <div className="ml-6 space-y-3 pt-3 border-t">
                    <div>
                      <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Arguments Marketing
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {materiel.argumentsMarketing?.map((arg, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {arg}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Ajouter un argument..."
                          value={nouveauxArguments[materiel.id] || ""}
                          onChange={(e) => setNouveauxArguments(prev => ({
                            ...prev,
                            [materiel.id]: e.target.value
                          }))}
                          className="flex-1"
                        />
                        <Button
                          size="sm"
                          onClick={() => ajouterArgument(materiel.id)}
                          disabled={!nouveauxArguments[materiel.id]?.trim()}
                        >
                          Ajouter
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {selectedFournisseur && materielsFiltres.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucun matériel disponible pour ce fournisseur</p>
          </div>
        )}

        {!selectedFournisseur && (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Veuillez sélectionner un fournisseur pour voir les matériels disponibles</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MaterielSelector;
