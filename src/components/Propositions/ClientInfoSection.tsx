
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Search } from "lucide-react";

interface ClientInfo {
  type: "client" | "prospect";
  codeClient?: string;
  nom: string;
  prenom?: string;
  adresse: string;
  telephone: string;
  email: string;
  dateNaissance?: string;
  categorieJuridique?: string;
  secteurActivite?: string;
  identifiantNational?: string;
}

interface ClientInfoSectionProps {
  clientInfo: ClientInfo;
  onClientInfoChange: (clientInfo: ClientInfo) => void;
  clientsDemo: any[];
}

const ClientInfoSection = ({ clientInfo, onClientInfoChange, clientsDemo }: ClientInfoSectionProps) => {
  const [searchClientCode, setSearchClientCode] = useState("");
  const [isClientReadonly, setIsClientReadonly] = useState(false);

  const handleSearchClient = () => {
    const client = clientsDemo.find(c => c.codeClient === searchClientCode);
    if (client) {
      onClientInfoChange({
        type: "client",
        codeClient: client.codeClient,
        nom: client.nom,
        prenom: client.prenom,
        adresse: client.adresse,
        telephone: client.telephone,
        email: client.email,
        dateNaissance: client.dateNaissance,
        categorieJuridique: client.categorieJuridique,
        secteurActivite: client.secteurActivite,
        identifiantNational: client.identifiantNational
      });
      setIsClientReadonly(true);
    }
  };

  const handleClientTypeChange = (type: "client" | "prospect") => {
    if (type === "prospect") {
      onClientInfoChange({
        type: "prospect",
        nom: "",
        prenom: "",
        adresse: "",
        telephone: "",
        email: "",
        dateNaissance: "",
        categorieJuridique: "",
        secteurActivite: "",
        identifiantNational: ""
      });
      setIsClientReadonly(false);
      setSearchClientCode("");
    } else {
      onClientInfoChange({ ...clientInfo, type });
    }
  };

  const handleInputChange = (field: keyof ClientInfo, value: string) => {
    onClientInfoChange({ ...clientInfo, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations Client</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Type locataire */}
        <div>
          <Label>Type locataire *</Label>
          <div className="flex gap-2 mt-2">
            <Button 
              variant={clientInfo.type === "client" ? "default" : "outline"}
              onClick={() => handleClientTypeChange("client")}
            >
              Client
            </Button>
            <Button
              variant={clientInfo.type === "prospect" ? "default" : "outline"}
              onClick={() => handleClientTypeChange("prospect")}
            >
              Prospect
            </Button>
          </div>
        </div>

        {/* Code Client si type = client */}
        {clientInfo.type === "client" && (
          <div>
            <Label htmlFor="searchClient">Code Client *</Label>
            <div className="flex gap-2">
              <Input
                id="searchClient"
                value={searchClientCode}
                onChange={(e) => setSearchClientCode(e.target.value)}
                placeholder="Saisir le code client"
              />
              <Button onClick={handleSearchClient} variant="outline">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Première ligne : Nom Client, Prénom Client, Téléphone */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="nom">Nom Client *</Label>
            <Input 
              id="nom"
              value={clientInfo.nom || ""} 
              onChange={(e) => handleInputChange("nom", e.target.value)}
              readOnly={isClientReadonly}
              className={isClientReadonly ? "bg-gray-100" : ""}
            />
          </div>
          <div>
            <Label htmlFor="prenom">Prénom Client *</Label>
            <Input 
              id="prenom"
              value={clientInfo.prenom || ""} 
              onChange={(e) => handleInputChange("prenom", e.target.value)}
              readOnly={isClientReadonly}
              className={isClientReadonly ? "bg-gray-100" : ""}
            />
          </div>
          <div>
            <Label htmlFor="telephone">Téléphone</Label>
            <Input 
              id="telephone"
              type="tel"
              value={clientInfo.telephone || ""} 
              onChange={(e) => handleInputChange("telephone", e.target.value)}
              placeholder="XX XX XX XX"
            />
          </div>
        </div>

        {/* Deuxième ligne : Catégorie Juridique, Secteur activité, Date Naissance, Identifiant National */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="categorieJuridique">Catégorie Juridique</Label>
            <Select 
              value={clientInfo.categorieJuridique || ""} 
              onValueChange={(value) => handleInputChange("categorieJuridique", value)}
              disabled={isClientReadonly}
            >
              <SelectTrigger className={isClientReadonly ? "bg-gray-100" : ""}>
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Particulier">Particulier</SelectItem>
                <SelectItem value="Entreprise">Entreprise</SelectItem>
                <SelectItem value="Association">Association</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="secteurActivite">Secteur activité</Label>
            <Input 
              id="secteurActivite"
              value={clientInfo.secteurActivite || ""} 
              onChange={(e) => handleInputChange("secteurActivite", e.target.value)}
              readOnly={isClientReadonly}
              className={isClientReadonly ? "bg-gray-100" : ""}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dateNaissance">Date Naissance</Label>
            <Input 
              id="dateNaissance"
              type="date"
              value={clientInfo.dateNaissance || ""} 
              onChange={(e) => handleInputChange("dateNaissance", e.target.value)}
              readOnly={isClientReadonly}
              className={isClientReadonly ? "bg-gray-100" : ""}
              placeholder="JJ/MM/AAAA"
            />
          </div>
          <div>
            <Label htmlFor="identifiantNational">Identifiant National</Label>
            <Input 
              id="identifiantNational"
              value={clientInfo.identifiantNational || ""} 
              onChange={(e) => handleInputChange("identifiantNational", e.target.value)}
              readOnly={isClientReadonly}
              className={isClientReadonly ? "bg-gray-100" : ""}
            />
          </div>
        </div>

        {/* Email (toujours modifiable) */}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email"
            type="email"
            value={clientInfo.email || ""} 
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
        </div>
        
        {/* Adresse */}
        <div>
          <Label htmlFor="adresse">Adresse</Label>
          <Textarea 
            id="adresse"
            value={clientInfo.adresse || ""} 
            onChange={(e) => handleInputChange("adresse", e.target.value)}
            readOnly={isClientReadonly}
            className={isClientReadonly ? "bg-gray-100" : ""}
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientInfoSection;
