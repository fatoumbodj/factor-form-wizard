
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Clock, AlertCircle, User, UserCheck, Crown } from "lucide-react";

export type StatutCampagne = "brouillon" | "en_attente_ra" | "en_attente_dg" | "validee" | "active" | "terminee" | "refusee";

interface WorkflowStep {
  id: string;
  nom: string;
  role: string;
  statut: "pending" | "approved" | "rejected" | "waiting";
  date?: Date;
  commentaire?: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface CampagneWorkflowProps {
  statutActuel: StatutCampagne;
  onValidation: (statut: StatutCampagne, commentaire?: string) => void;
  userRole?: "cc" | "ra" | "dg";
}

const CampagneWorkflow = ({ statutActuel, onValidation, userRole = "cc" }: CampagneWorkflowProps) => {
  const [commentaire, setCommentaire] = useState("");

  const getWorkflowSteps = (): WorkflowStep[] => {
    return [
      {
        id: "creation",
        nom: "Création",
        role: "Chargé Clientèle",
        statut: "approved",
        date: new Date(),
        icon: User
      },
      {
        id: "validation_ra",
        nom: "Validation RA",
        role: "Responsable Agence",
        statut: statutActuel === "brouillon" ? "waiting" : 
                statutActuel === "en_attente_ra" ? "pending" :
                statutActuel === "refusee" ? "rejected" : "approved",
        icon: UserCheck
      },
      {
        id: "validation_dg",
        nom: "Validation DG",
        role: "Direction Générale",
        statut: statutActuel === "en_attente_dg" ? "pending" :
                statutActuel === "validee" || statutActuel === "active" || statutActuel === "terminee" ? "approved" :
                "waiting",
        icon: Crown
      }
    ];
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "approved": return "bg-green-100 text-green-800";
      case "pending": return "bg-orange-100 text-orange-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case "approved": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending": return <Clock className="h-4 w-4 text-orange-600" />;
      case "rejected": return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const canValidate = () => {
    if (userRole === "ra" && statutActuel === "en_attente_ra") return true;
    if (userRole === "dg" && statutActuel === "en_attente_dg") return true;
    return false;
  };

  const handleValidation = (approuver: boolean) => {
    if (userRole === "ra") {
      onValidation(approuver ? "en_attente_dg" : "refusee", commentaire);
    } else if (userRole === "dg") {
      onValidation(approuver ? "validee" : "refusee", commentaire);
    }
    setCommentaire("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-blue-500" />
          Workflow de Validation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {getWorkflowSteps().map((step, index) => {
            const StepIcon = step.icon;
            return (
              <div key={step.id} className="flex items-center gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2 bg-accent/30 rounded-full">
                    <StepIcon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{step.nom}</div>
                    <div className="text-sm text-muted-foreground">{step.role}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatutIcon(step.statut)}
                    <Badge className={getStatutColor(step.statut)}>
                      {step.statut === "approved" ? "Validé" :
                       step.statut === "pending" ? "En attente" :
                       step.statut === "rejected" ? "Refusé" : "En attente"}
                    </Badge>
                  </div>
                </div>
                {index < getWorkflowSteps().length - 1 && (
                  <div className="w-px h-8 bg-border ml-6" />
                )}
              </div>
            );
          })}
        </div>

        {canValidate() && (
          <div className="space-y-4 pt-4 border-t">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Commentaire de validation
              </label>
              <Textarea
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
                placeholder="Ajoutez un commentaire..."
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleValidation(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                Approuver
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleValidation(false)}
              >
                Refuser
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CampagneWorkflow;
