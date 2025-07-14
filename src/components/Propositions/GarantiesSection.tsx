
import { useState } from "react";
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
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Plus, Trash2, Shield } from "lucide-react";

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

interface GarantiesSectionProps {
  garanties: Garantie[];
  onGarantiesChange: (garanties: Garantie[]) => void;
}

const GarantiesSection = ({ garanties, onGarantiesChange }: GarantiesSectionProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGarantie, setNewGarantie] = useState<Omit<Garantie, 'id'>>({
    natureGarantie: "",
    designationGarantie: "",
    typeGarantie: "",
    montantGarantie: 0,
    pourcentageGarantie: 0,
    dateDebutGarantie: "",
    dateFinGarantie: ""
  });

  const handleAddGarantie = () => {
    if (!newGarantie.natureGarantie || !newGarantie.designationGarantie) {
      alert("Veuillez remplir au moins la nature et la désignation de la garantie");
      return;
    }

    const garantie: Garantie = {
      id: Date.now().toString(),
      ...newGarantie
    };

    onGarantiesChange([...garanties, garantie]);
    
    // Reset du formulaire
    setNewGarantie({
      natureGarantie: "",
      designationGarantie: "",
      typeGarantie: "",
      montantGarantie: 0,
      pourcentageGarantie: 0,
      dateDebutGarantie: "",
      dateFinGarantie: ""
    });
    setShowAddForm(false);
  };

  const handleRemoveGarantie = (id: string) => {
    onGarantiesChange(garanties.filter(g => g.id !== id));
  };

  return (
    <Card>
      <CardHeader className="bg-green-600 text-white">
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Garanties
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="border-b bg-green-50 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-green-700">
              Ajout de la garantie (rapatrier depuis le CBS)
            </p>
            <Button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une Garantie
            </Button>
          </div>
          
          <p className="text-xs text-green-600 mt-1">
            (garantie requise ou garantie proposée par le client)
          </p>
        </div>

        {/* Formulaire d'ajout garantie */}
        {showAddForm && (
          <div className="border-b bg-green-25 p-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nature Garantie *</Label>
                  <Select 
                    value={newGarantie.natureGarantie} 
                    onValueChange={(value) => setNewGarantie(prev => ({ ...prev, natureGarantie: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner la nature" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hypotheque">Hypothèque</SelectItem>
                      <SelectItem value="nantissement">Nantissement</SelectItem>
                      <SelectItem value="caution_solidaire">Caution Solidaire</SelectItem>
                      <SelectItem value="depot_garantie">Dépôt de Garantie</SelectItem>
                      <SelectItem value="assurance">Assurance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Désignation Garantie *</Label>
                  <Input
                    placeholder="Désignation de la garantie"
                    value={newGarantie.designationGarantie}
                    onChange={(e) => setNewGarantie(prev => ({ ...prev, designationGarantie: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Type de Garantie</Label>
                  <Select 
                    value={newGarantie.typeGarantie} 
                    onValueChange={(value) => setNewGarantie(prev => ({ ...prev, typeGarantie: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reelle">Réelle</SelectItem>
                      <SelectItem value="personnelle">Personnelle</SelectItem>
                      <SelectItem value="mixte">Mixte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Montant Garantie (XAF)</Label>
                  <Input
                    type="number"
                    placeholder="Montant"
                    value={newGarantie.montantGarantie}
                    onChange={(e) => setNewGarantie(prev => ({ ...prev, montantGarantie: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <Label>Pourcentage Garantie (%)</Label>
                  <Input
                    type="number"
                    placeholder="Pourcentage"
                    value={newGarantie.pourcentageGarantie}
                    onChange={(e) => setNewGarantie(prev => ({ ...prev, pourcentageGarantie: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Date Début Garantie</Label>
                  <Input
                    type="date"
                    value={newGarantie.dateDebutGarantie}
                    onChange={(e) => setNewGarantie(prev => ({ ...prev, dateDebutGarantie: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Date Fin Garantie</Label>
                  <Input
                    type="date"
                    value={newGarantie.dateFinGarantie}
                    onChange={(e) => setNewGarantie(prev => ({ ...prev, dateFinGarantie: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleAddGarantie} className="bg-green-600 hover:bg-green-700">
                  Ajouter la garantie
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Annuler
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Tableau des garanties */}
        <div className="border rounded-none">
          <Table>
            <TableHeader>
              <TableRow className="bg-green-50 border-b-2">
                <TableHead className="font-semibold">Nature Garantie</TableHead>
                <TableHead className="font-semibold">Désignation</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Montant (XAF)</TableHead>
                <TableHead className="font-semibold">Pourcentage (%)</TableHead>
                <TableHead className="font-semibold">Date Début</TableHead>
                <TableHead className="font-semibold">Date Fin</TableHead>
                <TableHead className="font-semibold w-16">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {garanties.length > 0 ? (
                garanties.map((garantie) => (
                  <TableRow key={garantie.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{garantie.natureGarantie}</TableCell>
                    <TableCell>{garantie.designationGarantie}</TableCell>
                    <TableCell>{garantie.typeGarantie}</TableCell>
                    <TableCell>{garantie.montantGarantie.toLocaleString()} XAF</TableCell>
                    <TableCell>{garantie.pourcentageGarantie}%</TableCell>
                    <TableCell>{garantie.dateDebutGarantie}</TableCell>
                    <TableCell>{garantie.dateFinGarantie}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveGarantie(garantie.id)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    Aucune garantie ajoutée. Cliquez sur "Ajouter une Garantie" pour commencer.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default GarantiesSection;
