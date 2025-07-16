
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { BaremeComplet } from "@/types/leasing";

interface BaremeAlertProps {
  baremeClient: BaremeComplet;
  baremeCampagne: BaremeComplet;
  onContinueWithCampagne: () => void;
  onUseClientBareme: () => void;
}

const BaremeAlert = ({ 
  baremeClient, 
  baremeCampagne, 
  onContinueWithCampagne, 
  onUseClientBareme 
}: BaremeAlertProps) => {
  const isClientBaremeBetter = baremeClient.taux < baremeCampagne.taux;

  if (!isClientBaremeBetter) {
    return null;
  }

  return (
    <Alert className="border-orange-200 bg-orange-50">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertTitle className="text-orange-800">
        Attention ! Conditions dérogatoires plus favorables
      </AlertTitle>
      <AlertDescription className="space-y-4">
        <div className="text-orange-700">
          Ce client bénéficie de conditions dérogatoires plus favorables :
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-white p-3 rounded border">
            <div className="font-semibold text-gray-700">Barème Client (Dérogatoire)</div>
            <div>Taux : {baremeClient.taux}%</div>
            <div>Marge : {baremeClient.marge}%</div>
            <div>VR : {baremeClient.valeurResiduelle}%</div>
          </div>
          <div className="bg-white p-3 rounded border">
            <div className="font-semibold text-gray-700">Barème Campagne</div>
            <div>Taux : {baremeCampagne.taux}%</div>
            <div>Marge : {baremeCampagne.marge}%</div>
            <div>VR : {baremeCampagne.valeurResiduelle}%</div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={onContinueWithCampagne}
            className="border-orange-300 text-orange-700 hover:bg-orange-100"
          >
            Continuer avec le barème campagne
          </Button>
          <Button 
            onClick={onUseClientBareme}
            className="bg-orange-600 hover:bg-orange-700"
          >
            Utiliser le barème dérogatoire du client
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default BaremeAlert;
