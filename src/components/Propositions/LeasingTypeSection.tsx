
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LeasingTypeData {
  libelleProduit: string;
  codeProduit: string;
  agence: string;
  dateDemande: string;
  dateMiseEnServiceProvisionnelle: string;
}

interface LeasingTypeSectionProps {
  data: LeasingTypeData;
  onDataChange: (data: LeasingTypeData) => void;
}

const AGENCES_DEMO = [
  "Agence Dakar Centre",
  "Agence Plateau", 
  "Agence Almadies",
  "Agence Pikine"
];

const LeasingTypeSection = ({ data, onDataChange }: LeasingTypeSectionProps) => {
  const handleChange = (field: keyof LeasingTypeData, value: string) => {
    onDataChange({
      ...data,
      [field]: value
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Type de Leasing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="libelleProduit">Libellé produit *</Label>
            <Select value={data.libelleProduit} onValueChange={(value) => handleChange("libelleProduit", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Crédit Bail" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit-bail">Crédit Bail</SelectItem>
                <SelectItem value="lld">Location Longue Durée</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="codeProduit">Code produit *</Label>
            <Input
              id="codeProduit"
              value={data.codeProduit}
              onChange={(e) => handleChange("codeProduit", e.target.value)}
              placeholder="CB 001"
            />
          </div>
          
          <div>
            <Label htmlFor="agence">Agence *</Label>
            <Select value={data.agence} onValueChange={(value) => handleChange("agence", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une agence" />
              </SelectTrigger>
              <SelectContent>
                {AGENCES_DEMO.map(agence => (
                  <SelectItem key={agence} value={agence}>{agence}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dateDemande">Date de la demande *</Label>
            <Input
              id="dateDemande"
              type="date"
              value={data.dateDemande}
              onChange={(e) => handleChange("dateDemande", e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="dateMiseEnServiceProvisionnelle">Date de mise en service provisionnelle *</Label>
            <Input
              id="dateMiseEnServiceProvisionnelle"
              type="date"
              value={data.dateMiseEnServiceProvisionnelle}
              onChange={(e) => handleChange("dateMiseEnServiceProvisionnelle", e.target.value)}
              placeholder="JJ/MM/AAAA"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeasingTypeSection;
