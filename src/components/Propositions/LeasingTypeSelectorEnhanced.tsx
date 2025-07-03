
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TypeProposition } from "@/types/leasing";
import { CheckCircle, FileText, Award, Megaphone, Settings } from "lucide-react";

interface LeasingTypeSelectorEnhancedProps {
  selectedType: TypeProposition | "classique" | null;
  onTypeSelect: (type: TypeProposition | "classique") => void;
  onContinue?: () => void;
}

const LeasingTypeSelectorEnhanced = ({ 
  selectedType, 
  onTypeSelect, 
  onContinue 
}: LeasingTypeSelectorEnhancedProps) => {
  const typeOptions = [
    {
      id: "classique" as const,
      title: "Proposition Classique",
      description: "Proposition standard avec choix libre du barème",
      icon: Settings,
      color: "bg-gray-50 border-gray-200 hover:border-gray-300",
      selectedColor: "bg-gray-100 border-gray-400"
    },
    {
      id: "standard" as const,
      title: "Proposition Standard",
      description: "Proposition avec barème standard de l'entreprise",
      icon: FileText,
      color: "bg-blue-50 border-blue-200 hover:border-blue-300",
      selectedColor: "bg-blue-100 border-blue-400"
    },
    {
      id: "convention" as const,
      title: "Proposition Convention",
      description: "Proposition liée à une convention spécifique avec fournisseur",
      icon: Award,
      color: "bg-green-50 border-green-200 hover:border-green-300",
      selectedColor: "bg-green-100 border-green-400"
    },
    {
      id: "campagne" as const,
      title: "Proposition Campagne",
      description: "Proposition dans le cadre d'une campagne promotionnelle",
      icon: Megaphone,
      color: "bg-orange-50 border-orange-200 hover:border-orange-300",
      selectedColor: "bg-orange-100 border-orange-400"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sélection du Type de Proposition</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {typeOptions.map(({ id, title, description, icon: Icon, color, selectedColor }) => (
            <div
              key={id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                selectedType === id ? selectedColor : color
              }`}
              onClick={() => onTypeSelect(id)}
            >
              <div className="flex items-start gap-3">
                <Icon className="h-6 w-6 mt-1 text-primary" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{title}</h3>
                    {selectedType === id && (
                      <CheckCircle className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {selectedType && onContinue && (
          <div className="mt-6 flex justify-end">
            <Button onClick={onContinue}>
              Continuer
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeasingTypeSelectorEnhanced;
