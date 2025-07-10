
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle } from "lucide-react";

export interface BaremeData {
  id: string;
  nom: string;
  type: "standard" | "derogatoire";
  taux: number;
  marge: number;
  valeurResiduelle: number;
}

interface BaremeSelectorProps {
  selectedBareme?: BaremeData | null;
  onBaremeSelect: (bareme: BaremeData) => void;
  availableBaremes?: BaremeData[];
  showCreateNew?: boolean;
  onCreateNew?: (bareme: Omit<BaremeData, 'id'>) => void;
}

const DEFAULT_BAREMES: BaremeData[] = [
  {
    id: "bareme-standard",
    nom: "Barème Standard",
    type: "standard",
    taux: 7,
    marge: 3,
    valeurResiduelle: 2.5
  },
  {
    id: "bareme-preferentiel",
    nom: "Barème Préférentiel",
    type: "derogatoire", 
    taux: 6.2,
    marge: 2.5,
    valeurResiduelle: 2
  }
];

export function BaremeSelector({ 
  selectedBareme, 
  onBaremeSelect, 
  availableBaremes = DEFAULT_BAREMES,
  showCreateNew = false,
  onCreateNew 
}: BaremeSelectorProps) {
  const [activeTab, setActiveTab] = useState<"existing" | "new">("existing");
  const [newBaremeForm, setNewBaremeForm] = useState({
    nom: "",
    type: "standard" as "standard" | "derogatoire",
    taux: "",
    marge: "",
    valeurResiduelle: ""
  });

  const handleCreateBareme = () => {
    if (onCreateNew && newBaremeForm.nom && newBaremeForm.taux && newBaremeForm.marge && newBaremeForm.valeurResiduelle) {
      onCreateNew({
        nom: newBaremeForm.nom,
        type: newBaremeForm.type,
        taux: parseFloat(newBaremeForm.taux),
        marge: parseFloat(newBaremeForm.marge),
        valeurResiduelle: parseFloat(newBaremeForm.valeurResiduelle)
      });
      setNewBaremeForm({
        nom: "",
        type: "standard",
        taux: "",
        marge: "",
        valeurResiduelle: ""
      });
      setActiveTab("existing");
    }
  };

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === "existing" ? "default" : "outline"}
          onClick={() => setActiveTab("existing")}
          className="rounded-full px-6"
        >
          Barème existant
        </Button>
        {showCreateNew && (
          <Button
            variant={activeTab === "new" ? "default" : "outline"}
            onClick={() => setActiveTab("new")}
            className="rounded-full px-6"
          >
            Nouveau barème
          </Button>
        )}
      </div>

      {activeTab === "existing" && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Sélectionnez un barème existant depuis votre bibliothèque
          </p>
          
          <div className="space-y-3">
            {availableBaremes.map((bareme) => (
              <Card
                key={bareme.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedBareme?.id === bareme.id 
                    ? "ring-2 ring-primary border-primary" 
                    : "border-border"
                }`}
                onClick={() => onBaremeSelect(bareme)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{bareme.nom}</h3>
                        {selectedBareme?.id === bareme.id && (
                          <CheckCircle className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div className="flex gap-4 text-sm">
                        <span>Taux: {bareme.taux}%</span>
                        <span>Marge: {bareme.marge}%</span>
                        <span>VR: {bareme.valeurResiduelle}%</span>
                      </div>
                    </div>
                    <Badge 
                      variant={bareme.type === "standard" ? "default" : "secondary"}
                      className="capitalize"
                    >
                      {bareme.type}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === "new" && showCreateNew && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Créez un nouveau barème personnalisé
          </p>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="nom">Nom du barème</Label>
              <Input
                id="nom"
                value={newBaremeForm.nom}
                onChange={(e) => setNewBaremeForm(prev => ({ ...prev, nom: e.target.value }))}
                placeholder="Ex: Barème Spécial Client"
              />
            </div>

            <div>
              <Label htmlFor="type">Type de barème</Label>
              <Select 
                value={newBaremeForm.type} 
                onValueChange={(value: "standard" | "derogatoire") => 
                  setNewBaremeForm(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="derogatoire">Dérogatoire</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="taux">Taux (%)</Label>
                <Input
                  id="taux"
                  type="number"
                  step="0.1"
                  value={newBaremeForm.taux}
                  onChange={(e) => setNewBaremeForm(prev => ({ ...prev, taux: e.target.value }))}
                  placeholder="7.0"
                />
              </div>
              <div>
                <Label htmlFor="marge">Marge (%)</Label>
                <Input
                  id="marge"
                  type="number"
                  step="0.1"
                  value={newBaremeForm.marge}
                  onChange={(e) => setNewBaremeForm(prev => ({ ...prev, marge: e.target.value }))}
                  placeholder="3.0"
                />
              </div>
              <div>
                <Label htmlFor="valeurResiduelle">VR (%)</Label>
                <Input
                  id="valeurResiduelle"
                  type="number"
                  step="0.1"
                  value={newBaremeForm.valeurResiduelle}
                  onChange={(e) => setNewBaremeForm(prev => ({ ...prev, valeurResiduelle: e.target.value }))}
                  placeholder="2.5"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setActiveTab("existing")}>
                Annuler
              </Button>
              <Button onClick={handleCreateBareme}>
                Créer le barème
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
