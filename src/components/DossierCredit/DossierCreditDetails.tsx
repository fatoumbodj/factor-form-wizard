
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Building, 
  Calendar, 
  Euro, 
  FileText, 
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2
} from "lucide-react";

interface DossierCreditDetailsProps {
  dossier: any;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const DossierCreditDetails = ({ dossier, onClose, onEdit, onDelete }: DossierCreditDetailsProps) => {
  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "validation":
        return <Badge variant="outline" className="text-orange-600 border-orange-600"><Clock className="h-3 w-3 mr-1" />En validation</Badge>;
      case "approuve":
        return <Badge variant="outline" className="text-green-600 border-green-600"><CheckCircle className="h-3 w-3 mr-1" />Approuvé</Badge>;
      case "rejete":
        return <Badge variant="outline" className="text-red-600 border-red-600"><XCircle className="h-3 w-3 mr-1" />Rejeté</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <span>Dossier {dossier.id}</span>
              {getStatutBadge(dossier.statut)}
            </CardTitle>
            <CardDescription>
              Détails du dossier de crédit
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            {onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            )}
            {onDelete && (
              <Button variant="outline" size="sm" onClick={onDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={onClose}>
              Fermer
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Informations client */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            {dossier.type === "Entreprise" ? (
              <Building className="h-5 w-5 mr-2" />
            ) : (
              <User className="h-5 w-5 mr-2" />
            )}
            Informations Client
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Nom du client</p>
              <p className="font-medium">{dossier.client}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Type</p>
              <p className="font-medium">{dossier.type}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Détails du crédit */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Euro className="h-5 w-5 mr-2" />
            Détails du Crédit
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Montant</p>
              <p className="font-medium text-lg">{dossier.montant}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Durée</p>
              <p className="font-medium">{dossier.duree || "Non spécifiée"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Objet</p>
              <p className="font-medium">{dossier.objet || "Non spécifié"}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Informations de gestion */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Gestion du Dossier
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Responsable</p>
              <p className="font-medium">{dossier.responsable}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date de création</p>
              <p className="font-medium">
                {new Date(dossier.dateCreation).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Échéance</p>
              <p className="font-medium">
                {dossier.echeance ? new Date(dossier.echeance).toLocaleDateString('fr-FR') : "Non définie"}
              </p>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Documents ({dossier.documents})
          </h3>
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              Aucun document attaché pour le moment
            </p>
            <div className="mt-2 text-center">
              <Button variant="outline" size="sm">
                Ajouter des documents
              </Button>
            </div>
          </div>
        </div>

        {/* Notes */}
        {dossier.notes && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Notes</h3>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm">{dossier.notes}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DossierCreditDetails;
