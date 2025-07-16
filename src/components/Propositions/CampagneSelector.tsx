
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Campagne } from "@/types/leasing";
import { Zap, Calendar, Percent, Building } from "lucide-react";

interface CampagneSelectorProps {
  selectedCampagne: Campagne | null;
  onCampagneSelect: (campagne: Campagne) => void;
}

// Données de démonstration pour les campagnes avec des dates valides
const CAMPAGNES_DISPONIBLES: Campagne[] = [
  {
    id: "camp-ete-2024",
    nom: "Campagne Été 2024",
    description: "Offre spéciale véhicules avec taux exceptionnel",
    type: "fournisseur",
    fournisseurs: ["babacar-fils", "senegal-auto"],
    bareme: {
      taux: 4.5,
      marge: 2.0,
      valeurResiduelle: 1.0
    },
    dateDebut: new Date("2024-07-01"),
    dateFin: new Date("2025-08-31"),
    actif: true,
    prioritaire: true
  },
  {
    id: "camp-equipement-industriel",
    nom: "Industrialisation 2024",
    description: "Campagne banque pour l'équipement industriel",
    type: "banque",
    bareme: {
      taux: 5.0,
      marge: 2.2,
      valeurResiduelle: 1.5
    },
    dateDebut: new Date("2024-01-01"),
    dateFin: new Date("2025-12-31"),
    actif: true,
    prioritaire: true
  },
  {
    id: "camp-btp-urgent",
    nom: "BTP Express",
    description: "Financement accéléré pour équipements BTP",
    type: "fournisseur",
    fournisseurs: ["dakar-equipement"],
    bareme: {
      taux: 5.5,
      marge: 2.8,
      valeurResiduelle: 2.0
    },
    dateDebut: new Date("2024-11-01"),
    dateFin: new Date("2025-09-30"),
    actif: true,
    prioritaire: true
  },
  {
    id: "camp-agriculture-2024",
    nom: "Financement Agricole 2024",
    description: "Campagne spéciale matériel agricole - Conditions exceptionnelles",
    type: "banque",
    bareme: {
      taux: 4.2,
      marge: 1.8,
      valeurResiduelle: 0.5
    },
    dateDebut: new Date("2024-03-01"),
    dateFin: new Date("2025-10-31"),
    actif: true,
    prioritaire: true
  },
  {
    id: "camp-auto-noel-2024",
    nom: "Spécial Auto Fin d'Année",
    description: "Campagne exceptionnelle véhicules particuliers et utilitaires",
    type: "fournisseur",
    fournisseurs: ["senegal-auto", "dakar-motors"],
    bareme: {
      taux: 3.9,
      marge: 1.5,
      valeurResiduelle: 0.8
    },
    dateDebut: new Date("2024-12-01"),
    dateFin: new Date("2025-02-28"),
    actif: true,
    prioritaire: true
  },
  {
    id: "camp-pme-boost-2025",
    nom: "PME Boost 2025",
    description: "Soutien aux PME pour leur équipement professionnel",
    type: "banque",
    bareme: {
      taux: 4.8,
      marge: 2.0,
      valeurResiduelle: 1.2
    },
    dateDebut: new Date("2024-11-15"),
    dateFin: new Date("2025-06-30"),
    actif: true,
    prioritaire: true
  }
];

const CampagneSelector = ({ selectedCampagne, onCampagneSelect }: CampagneSelectorProps) => {
  const isValidCampagne = (campagne: Campagne) => {
    const now = new Date();
    return campagne.actif && 
           campagne.dateDebut <= now && 
           campagne.dateFin >= now;
  };

  const validCampagnes = CAMPAGNES_DISPONIBLES.filter(camp => isValidCampagne(camp));

  if (validCampagnes.length === 0) {
    return (
      <div className="text-center p-8">
        <div className="mb-4">
          <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-muted-foreground">Aucune campagne active</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Il n'y a actuellement aucune campagne promotionnelle en cours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Sélectionner une campagne</h3>
        <p className="text-sm text-muted-foreground">
          Choisissez la campagne promotionnelle applicable (taux prioritaire sur tout autre barème)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {validCampagnes.map((campagne) => (
          <Card 
            key={campagne.id}
            className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
              selectedCampagne?.id === campagne.id 
                ? "ring-2 ring-primary border-primary bg-primary/5" 
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => onCampagneSelect(campagne)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <Zap className="h-5 w-5 text-orange-500 mt-1" />
                <div className="flex gap-1">
                  <Badge variant="destructive" className="text-xs">
                    Prioritaire
                  </Badge>
                  <Badge 
                    variant={campagne.type === "banque" ? "default" : "secondary"} 
                    className="text-xs"
                  >
                    {campagne.type === "banque" ? "Banque" : "Fournisseur"}
                  </Badge>
                </div>
              </div>
              <CardTitle className="text-base">{campagne.nom}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {campagne.description}
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Percent className="h-4 w-4 text-red-500" />
                  <span className="font-medium text-red-600">
                    Taux exceptionnel : {campagne.bareme.taux}%
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-orange-500" />
                  <span>
                    Jusqu'au {campagne.dateFin.toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>

              {campagne.fournisseurs && (
                <div className="pt-2">
                  <div className="text-xs text-muted-foreground mb-1">Fournisseurs :</div>
                  <div className="flex flex-wrap gap-1">
                    {campagne.fournisseurs.slice(0, 2).map((fournisseur) => (
                      <Badge key={fournisseur} variant="outline" className="text-xs">
                        {fournisseur}
                      </Badge>
                    ))}
                    {campagne.fournisseurs.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{campagne.fournisseurs.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {campagne.type === "banque" && (
                <div className="pt-2">
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Building className="h-4 w-4" />
                    <span>Tous fournisseurs éligibles</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedCampagne && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-green-600" />
            <span className="font-medium text-green-800">Campagne sélectionnée</span>
          </div>
          <p className="text-sm text-green-700">
            <strong>{selectedCampagne.nom}</strong> - Taux exceptionnel : {selectedCampagne.bareme.taux}%
          </p>
        </div>
      )}
    </div>
  );
};

export default CampagneSelector;
