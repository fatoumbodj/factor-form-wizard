
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Globe, Smartphone, Building2, Users, Settings } from "lucide-react";

interface CanalDiffusion {
  id: string;
  nom: string;
  type: "digital" | "physique" | "communication";
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  parametres?: {
    [key: string]: string | boolean;
  };
}

interface CanauxDiffusionProps {
  canauxSelectionnes: string[];
  onCanalToggle: (canalId: string) => void;
  onParametresChange: (canalId: string, parametres: any) => void;
}

const CANAUX_DISPONIBLES: CanalDiffusion[] = [
  {
    id: "emailing",
    nom: "Emailing",
    type: "digital",
    icon: Mail,
    description: "Envoi d'emails promotionnels aux clients"
  },
  {
    id: "portail-client",
    nom: "Portail Client",
    type: "digital",
    icon: Globe,
    description: "Affichage sur l'espace client en ligne"
  },
  {
    id: "push-mobile",
    nom: "Notifications Push",
    type: "digital",
    icon: Smartphone,
    description: "Notifications mobiles sur l'application"
  },
  {
    id: "agences",
    nom: "Réseau d'Agences",
    type: "physique",
    icon: Building2,
    description: "Promotion dans les agences physiques"
  },
  {
    id: "commercial",
    nom: "Force de Vente",
    type: "communication",
    icon: Users,
    description: "Communication via les commerciaux"
  }
];

const CanauxDiffusion = ({ 
  canauxSelectionnes, 
  onCanalToggle, 
  onParametresChange 
}: CanauxDiffusionProps) => {
  const [parametres, setParametres] = useState<{[key: string]: any}>({});

  const handleParametreChange = (canalId: string, key: string, value: any) => {
    const nouveauxParametres = {
      ...parametres,
      [canalId]: {
        ...parametres[canalId],
        [key]: value
      }
    };
    setParametres(nouveauxParametres);
    onParametresChange(canalId, nouveauxParametres[canalId]);
  };

  const renderParametresCanal = (canal: CanalDiffusion) => {
    if (!canauxSelectionnes.includes(canal.id)) return null;

    switch (canal.id) {
      case "emailing":
        return (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Objet de l'email</label>
              <Input
                placeholder="Ex: Offre spéciale véhicules..."
                value={parametres[canal.id]?.objet || ""}
                onChange={(e) => handleParametreChange(canal.id, "objet", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Segmentation</label>
              <div className="space-y-2">
                {["Tous les clients", "Clients actifs", "Prospects qualifiés"].map((segment) => (
                  <div key={segment} className="flex items-center space-x-2">
                    <Checkbox
                      checked={parametres[canal.id]?.segments?.includes(segment) || false}
                      onCheckedChange={(checked) => {
                        const segments = parametres[canal.id]?.segments || [];
                        const nouveauxSegments = checked
                          ? [...segments, segment]
                          : segments.filter((s: string) => s !== segment);
                        handleParametreChange(canal.id, "segments", nouveauxSegments);
                      }}
                    />
                    <label className="text-sm">{segment}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "portail-client":
        return (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Position d'affichage</label>
              <select
                className="w-full p-2 border rounded-md"
                value={parametres[canal.id]?.position || "banner"}
                onChange={(e) => handleParametreChange(canal.id, "position", e.target.value)}
              >
                <option value="banner">Bannière principale</option>
                <option value="sidebar">Barre latérale</option>
                <option value="popup">Pop-up à la connexion</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={parametres[canal.id]?.autoShow || false}
                onCheckedChange={(checked) => handleParametreChange(canal.id, "autoShow", checked)}
              />
              <label className="text-sm">Affichage automatique</label>
            </div>
          </div>
        );

      case "agences":
        return (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Agences concernées</label>
              <div className="space-y-2">
                {["Dakar Centre", "Almadies", "Parcelles", "Pikine", "Rufisque"].map((agence) => (
                  <div key={agence} className="flex items-center space-x-2">
                    <Checkbox
                      checked={parametres[canal.id]?.agences?.includes(agence) || false}
                      onCheckedChange={(checked) => {
                        const agences = parametres[canal.id]?.agences || [];
                        const nouvellesAgences = checked
                          ? [...agences, agence]
                          : agences.filter((a: string) => a !== agence);
                        handleParametreChange(canal.id, "agences", nouvellesAgences);
                      }}
                    />
                    <label className="text-sm">{agence}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div>
            <label className="text-sm font-medium mb-1 block">Message personnalisé</label>
            <Textarea
              placeholder="Message spécifique pour ce canal..."
              value={parametres[canal.id]?.message || ""}
              onChange={(e) => handleParametreChange(canal.id, "message", e.target.value)}
              rows={3}
            />
          </div>
        );
    }
  };

  const groupedCanaux = CANAUX_DISPONIBLES.reduce((acc, canal) => {
    if (!acc[canal.type]) acc[canal.type] = [];
    acc[canal.type].push(canal);
    return acc;
  }, {} as {[key: string]: CanalDiffusion[]});

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "digital": return "Canaux Digitaux";
      case "physique": return "Canaux Physiques";
      case "communication": return "Communication Directe";
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "digital": return "text-blue-600";
      case "physique": return "text-green-600";
      case "communication": return "text-purple-600";
      default: return "text-gray-600";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-blue-500" />
          Canaux de Diffusion
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Sélectionnez les canaux pour promouvoir votre campagne
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedCanaux).map(([type, canaux]) => (
          <div key={type} className="space-y-4">
            <h3 className={`font-medium ${getTypeColor(type)}`}>
              {getTypeLabel(type)}
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {canaux.map((canal) => {
                const IconComponent = canal.icon;
                return (
                  <Card key={canal.id} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            checked={canauxSelectionnes.includes(canal.id)}
                            onCheckedChange={() => onCanalToggle(canal.id)}
                          />
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4 text-primary" />
                            <span className="font-medium">{canal.nom}</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {getTypeLabel(canal.type)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground ml-6">
                        {canal.description}
                      </p>
                      {renderParametresCanal(canal)}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CanauxDiffusion;
