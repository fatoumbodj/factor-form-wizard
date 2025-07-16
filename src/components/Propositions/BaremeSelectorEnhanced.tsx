
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BaremeComplet, Campagne, Convention } from "@/types/leasing";
import { Calculator, Star, AlertTriangle, Trophy } from "lucide-react";
import BaremeAlert from "./BaremeAlert";

interface BaremeSelectorEnhancedProps {
  selectedBareme: BaremeComplet | null;
  onBaremeSelect: (bareme: BaremeComplet) => void;
  clientId?: string;
  campagne?: Campagne | null;
  convention?: Convention | null;
}

// Données de démonstration pour les barèmes dérogatoires du client
const getClientBaremes = (clientId?: string): BaremeComplet[] => {
  if (!clientId) return [];
  
  return [
    {
      id: "bar-client-001",
      nom: "Barème Dérogatoire Client VIP",
      type: "derogatoire",
      taux: 5.2,
      marge: 2.0,
      valeurResiduelle: 1.5,
      typologie: "Crédit-Bail",
      dateCreation: new Date("2024-01-01"),
      dateApplication: new Date("2024-01-15"),
      actif: true,
      statut: "active",
      clientId: clientId,
      applicationUniqueDossier: false
    },
    {
      id: "bar-client-002",
      nom: "Barème Exceptionnel Dossier Unique",
      type: "derogatoire",
      taux: 3.8,
      marge: 1.5,
      valeurResiduelle: 0.8,
      typologie: "Crédit-Bail",
      dateCreation: new Date("2024-03-01"),
      dateApplication: new Date("2024-03-15"),
      actif: true,
      statut: "active",
      clientId: clientId,
      applicationUniqueDossier: true,
      dossierUniqueId: "DOSS-2024-001"
    },
    {
      id: "bar-client-003",
      nom: "Barème Spécial Équipement Industriel",
      type: "derogatoire",
      taux: 4.5,
      marge: 1.8,
      valeurResiduelle: 1.2,
      typologie: "Crédit-Bail",
      dateCreation: new Date("2024-06-01"),
      dateApplication: new Date("2024-06-15"),
      actif: true,
      statut: "active",
      clientId: clientId,
      applicationUniqueDossier: false
    }
  ];
};

const BaremeSelectorEnhanced = ({
  selectedBareme,
  onBaremeSelect,
  clientId,
  campagne,
  convention
}: BaremeSelectorEnhancedProps) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState<{
    baremeClient: BaremeComplet;
    baremeCampagne: BaremeComplet;
  } | null>(null);

  const clientBaremes = getClientBaremes(clientId);
  
  // Barème de campagne par défaut
  const baremeCampagne = campagne ? {
    id: "bar-campagne",
    nom: `Barème ${campagne.nom}`,
    type: "derogatoire" as const,
    taux: campagne.bareme.taux,
    marge: campagne.bareme.marge,
    valeurResiduelle: campagne.bareme.valeurResiduelle,
    typologie: "Crédit-Bail",
    dateCreation: new Date(),
    actif: true,
    statut: "active" as const
  } : null;

  // Barème de convention
  const baremeConvention = convention ? {
    id: "bar-convention",
    nom: `Barème ${convention.nom}`,
    type: "derogatoire" as const,
    taux: convention.bareme.taux,
    marge: convention.bareme.marge,
    valeurResiduelle: convention.bareme.valeurResiduelle,
    typologie: "Crédit-Bail",
    dateCreation: new Date(),
    actif: true,
    statut: "active" as const
  } : null;

  // Séparer les barèmes client : dossier unique vs multi-dossiers
  const baremesClientDossierUnique = clientBaremes.filter(b => b.applicationUniqueDossier);
  const baremesClientMultiDossiers = clientBaremes.filter(b => !b.applicationUniqueDossier);

  const handleBaremeSelect = (bareme: BaremeComplet) => {
    // Si on sélectionne un barème de campagne/convention et que le client a un barème plus favorable
    if ((bareme.id === "bar-campagne" || bareme.id === "bar-convention") && clientBaremes.length > 0) {
      const bestClientBareme = clientBaremes.reduce((best, current) => 
        current.taux < best.taux ? current : best
      );
      
      if (bestClientBareme.taux < bareme.taux) {
        setAlertData({
          baremeClient: bestClientBareme,
          baremeCampagne: bareme
        });
        setShowAlert(true);
        return;
      }
    }
    
    onBaremeSelect(bareme);
  };

  const handleContinueWithCampagne = () => {
    if (alertData) {
      onBaremeSelect(alertData.baremeCampagne);
    }
    setShowAlert(false);
    setAlertData(null);
  };

  const handleUseClientBareme = () => {
    if (alertData) {
      onBaremeSelect(alertData.baremeClient);
    }
    setShowAlert(false);
    setAlertData(null);
  };

  // Auto-sélection du barème de campagne par défaut si c'est une campagne
  React.useEffect(() => {
    if (campagne && baremeCampagne && !selectedBareme) {
      // Vérifier s'il y a un barème client plus favorable
      if (clientBaremes.length > 0) {
        const bestClientBareme = clientBaremes.reduce((best, current) => 
          current.taux < best.taux ? current : best
        );
        
        if (bestClientBareme.taux < baremeCampagne.taux) {
          setAlertData({
            baremeClient: bestClientBareme,
            baremeCampagne: baremeCampagne
          });
          setShowAlert(true);
          return;
        }
      }
      onBaremeSelect(baremeCampagne);
    }
  }, [campagne, baremeCampagne, selectedBareme, clientBaremes, onBaremeSelect]);

  return (
    <div className="space-y-6">
      {showAlert && alertData && (
        <BaremeAlert
          baremeClient={alertData.baremeClient}
          baremeCampagne={alertData.baremeCampagne}
          onContinueWithCampagne={handleContinueWithCampagne}
          onUseClientBareme={handleUseClientBareme}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Sélection du Barème
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Colonne de gauche : Barème de campagne/convention */}
            <div className="space-y-4">
              {/* Barème de campagne par défaut */}
              {baremeCampagne && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    Barème Campagne
                  </h4>
                  <div
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedBareme?.id === baremeCampagne.id
                        ? "border-primary bg-primary/5 ring-2 ring-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => handleBaremeSelect(baremeCampagne)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium">{baremeCampagne.nom}</h5>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <Badge variant="destructive" className="text-xs">
                            Campagne
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Taux: {baremeCampagne.taux}%
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Marge: {baremeCampagne.marge}%
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            VR: {baremeCampagne.valeurResiduelle}%
                          </Badge>
                        </div>
                      </div>
                      {selectedBareme?.id === baremeCampagne.id && (
                        <Badge variant="default" className="text-xs">
                          Sélectionné
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Barème de convention */}
              {baremeConvention && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Star className="h-4 w-4 text-blue-500" />
                    Barème Convention
                  </h4>
                  <div
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedBareme?.id === baremeConvention.id
                        ? "border-primary bg-primary/5 ring-2 ring-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => handleBaremeSelect(baremeConvention)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium">{baremeConvention.nom}</h5>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <Badge variant="secondary" className="text-xs">
                            Convention
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Taux: {baremeConvention.taux}%
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Marge: {baremeConvention.marge}%
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            VR: {baremeConvention.valeurResiduelle}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Colonne de droite : Barèmes dérogatoires client */}
            <div className="space-y-4">
              {/* Barèmes dérogatoires pour dossier unique */}
              {baremesClientDossierUnique.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-green-500" />
                    Barèmes Dossier Unique
                  </h4>
                  <div className="space-y-3">
                    {baremesClientDossierUnique.map((bareme) => (
                      <div
                        key={bareme.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedBareme?.id === bareme.id
                            ? "border-primary bg-primary/5 ring-2 ring-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => onBaremeSelect(bareme)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium">{bareme.nom}</h5>
                            <div className="flex gap-2 mt-2 flex-wrap">
                              <Badge variant="destructive" className="text-xs">
                                Dossier Unique
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                Taux: {bareme.taux}%
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                Marge: {bareme.marge}%
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                VR: {bareme.valeurResiduelle}%
                              </Badge>
                            </div>
                            {bareme.dossierUniqueId && (
                              <div className="text-xs text-muted-foreground mt-1">
                                Dossier: {bareme.dossierUniqueId}
                              </div>
                            )}
                          </div>
                          {selectedBareme?.id === bareme.id && (
                            <Badge variant="default" className="text-xs">
                              Sélectionné
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Barèmes dérogatoires multi-dossiers */}
              {baremesClientMultiDossiers.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    Barèmes Dérogatoires Client
                  </h4>
                  <div className="space-y-3">
                    {baremesClientMultiDossiers.map((bareme) => (
                      <div
                        key={bareme.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedBareme?.id === bareme.id
                            ? "border-primary bg-primary/5 ring-2 ring-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => onBaremeSelect(bareme)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium">{bareme.nom}</h5>
                            <div className="flex gap-2 mt-2 flex-wrap">
                              <Badge variant="secondary" className="text-xs">
                                Dérogatoire
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                Taux: {bareme.taux}%
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                Marge: {bareme.marge}%
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                VR: {bareme.valeurResiduelle}%
                              </Badge>
                            </div>
                          </div>
                          {selectedBareme?.id === bareme.id && (
                            <Badge variant="default" className="text-xs">
                              Sélectionné
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Message si pas de barèmes client */}
              {clientBaremes.length === 0 && (
                <div className="text-center p-8 text-muted-foreground">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Aucun barème dérogatoire disponible pour ce client</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BaremeSelectorEnhanced;
