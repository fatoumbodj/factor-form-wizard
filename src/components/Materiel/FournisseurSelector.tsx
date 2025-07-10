
import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FournisseurSelectorProps {
  selectedFournisseurs: string[];
  onFournisseurChange: (fournisseurs: string[]) => void;
}

const FOURNISSEURS_DISPONIBLES = [
  "Sonacos",
  "Senegal-Auto", 
  "Babacar & Fils",
  "Afrique Matériel"
];

const FournisseurSelector = ({ selectedFournisseurs, onFournisseurChange }: FournisseurSelectorProps) => {
  const [selectedFournisseur, setSelectedFournisseur] = useState<string>("");

  const addFournisseur = () => {
    if (selectedFournisseur && !selectedFournisseurs.includes(selectedFournisseur)) {
      onFournisseurChange([...selectedFournisseurs, selectedFournisseur]);
      setSelectedFournisseur("");
    }
  };

  const removeFournisseur = (fournisseur: string) => {
    onFournisseurChange(selectedFournisseurs.filter(f => f !== fournisseur));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Fournisseur(s) agréé(s) *
        </label>
        <div className="flex gap-2">
          <Select value={selectedFournisseur} onValueChange={setSelectedFournisseur}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Sélectionner un fournisseur" />
            </SelectTrigger>
            <SelectContent>
              {FOURNISSEURS_DISPONIBLES
                .filter(f => !selectedFournisseurs.includes(f))
                .map(fournisseur => (
                  <SelectItem key={fournisseur} value={fournisseur}>
                    {fournisseur}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={addFournisseur} 
            disabled={!selectedFournisseur}
            size="sm"
          >
            <Check className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {selectedFournisseurs.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedFournisseurs.map(fournisseur => (
            <Badge key={fournisseur} variant="secondary" className="px-3 py-1">
              {fournisseur}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-2 hover:bg-transparent"
                onClick={() => removeFournisseur(fournisseur)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default FournisseurSelector;
