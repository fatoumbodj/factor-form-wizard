
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BaremeComplet } from "@/types/leasing";
import { Trophy, AlertTriangle } from "lucide-react";

interface BaremeTypeSelectorProps {
  clientBaremes: BaremeComplet[];
  selectedBareme: BaremeComplet | null;
  onBaremeSelect: (bareme: BaremeComplet) => void;
}

const BaremeTypeSelector = ({
  clientBaremes,
  selectedBareme,
  onBaremeSelect
}: BaremeTypeSelectorProps) => {
  const baremesClientDossierUnique = clientBaremes.filter(b => b.applicationUniqueDossier);
  const baremesClientMultiDossiers = clientBaremes.filter(b => !b.applicationUniqueDossier);

  if (clientBaremes.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>Aucun barème dérogatoire disponible pour ce client</p>
      </div>
    );
  }

  const handleValueChange = (baremeId: string) => {
    const bareme = clientBaremes.find(b => b.id === baremeId);
    if (bareme) {
      onBaremeSelect(bareme);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">
          Sélectionner un barème dérogatoire
        </label>
        <Select 
          value={selectedBareme?.id || ""} 
          onValueChange={handleValueChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choisir un barème dérogatoire..." />
          </SelectTrigger>
          <SelectContent className="bg-white border shadow-lg z-50">
            {baremesClientDossierUnique.length > 0 && (
              <>
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground flex items-center gap-2">
                  <Trophy className="h-3 w-3 text-green-500" />
                  Barèmes Dossier Unique
                </div>
                {baremesClientDossierUnique.map((bareme) => (
                  <SelectItem key={bareme.id} value={bareme.id}>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex-1">
                        <div className="font-medium">{bareme.nom}</div>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="destructive" className="text-xs">
                            Dossier Unique
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Taux: {bareme.taux}% | Marge: {bareme.marge}% | VR: {bareme.valeurResiduelle}%
                          </span>
                        </div>
                        {bareme.dossierUniqueId && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Dossier: {bareme.dossierUniqueId}
                          </div>
                        )}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </>
            )}
            
            {baremesClientMultiDossiers.length > 0 && (
              <>
                {baremesClientDossierUnique.length > 0 && (
                  <div className="border-t mx-2 my-2"></div>
                )}
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground flex items-center gap-2">
                  <AlertTriangle className="h-3 w-3 text-orange-500" />
                  Barèmes Dérogatoires Client
                </div>
                {baremesClientMultiDossiers.map((bareme) => (
                  <SelectItem key={bareme.id} value={bareme.id}>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex-1">
                        <div className="font-medium">{bareme.nom}</div>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            Dérogatoire
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Taux: {bareme.taux}% | Marge: {bareme.marge}% | VR: {bareme.valeurResiduelle}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      {selectedBareme && (
        <div className="p-4 bg-muted rounded-lg">
          <div className="font-medium mb-2">Barème sélectionné : {selectedBareme.nom}</div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Taux :</span> {selectedBareme.taux}%
            </div>
            <div>
              <span className="font-medium">Marge :</span> {selectedBareme.marge}%
            </div>
            <div>
              <span className="font-medium">VR :</span> {selectedBareme.valeurResiduelle}%
            </div>
          </div>
          {selectedBareme.applicationUniqueDossier && selectedBareme.dossierUniqueId && (
            <div className="mt-2 text-xs text-muted-foreground">
              <span className="font-medium">Application :</span> Dossier unique ({selectedBareme.dossierUniqueId})
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BaremeTypeSelector;
