
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface DossierCreditFormProps {
  onSubmit: (dossier: any) => void;
  onCancel: () => void;
}

const DossierCreditForm = ({ onSubmit, onCancel }: DossierCreditFormProps) => {
  const [formData, setFormData] = useState({
    client: "",
    typeClient: "",
    montant: "",
    duree: "",
    objet: "",
    responsable: "",
    echeance: null as Date | null,
    notes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newDossier = {
      id: `DC${String(Date.now()).slice(-3).padStart(3, '0')}`,
      client: formData.client,
      type: formData.typeClient,
      montant: `${formData.montant} €`,
      statut: "validation",
      dateCreation: new Date().toISOString().split('T')[0],
      echeance: formData.echeance ? format(formData.echeance, 'yyyy-MM-dd') : "",
      documents: 0,
      responsable: formData.responsable,
      objet: formData.objet,
      duree: formData.duree,
      notes: formData.notes
    };
    
    onSubmit(newDossier);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Nouveau Dossier de Crédit</CardTitle>
            <CardDescription>
              Créer un nouveau dossier de crédit après validation de proposition
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client">Nom du Client *</Label>
              <Input
                id="client"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                placeholder="Nom du client ou entreprise"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="typeClient">Type de Client *</Label>
              <Select 
                value={formData.typeClient} 
                onValueChange={(value) => setFormData({ ...formData, typeClient: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Particulier">Particulier</SelectItem>
                  <SelectItem value="Entreprise">Entreprise</SelectItem>
                  <SelectItem value="Association">Association</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="montant">Montant du Crédit *</Label>
              <Input
                id="montant"
                type="number"
                value={formData.montant}
                onChange={(e) => setFormData({ ...formData, montant: e.target.value })}
                placeholder="Montant en euros"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duree">Durée (en mois)</Label>
              <Input
                id="duree"
                type="number"
                value={formData.duree}
                onChange={(e) => setFormData({ ...formData, duree: e.target.value })}
                placeholder="Durée du crédit"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="objet">Objet du Crédit</Label>
            <Input
              id="objet"
              value={formData.objet}
              onChange={(e) => setFormData({ ...formData, objet: e.target.value })}
              placeholder="Objet ou raison du crédit"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="responsable">Responsable du Dossier *</Label>
              <Input
                id="responsable"
                value={formData.responsable}
                onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
                placeholder="Nom du responsable"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Date d'Échéance</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.echeance ? (
                      format(formData.echeance, "dd MMMM yyyy", { locale: fr })
                    ) : (
                      <span>Sélectionner une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.echeance}
                    onSelect={(date) => setFormData({ ...formData, echeance: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Notes additionnelles..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit">
              Créer le Dossier
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DossierCreditForm;
