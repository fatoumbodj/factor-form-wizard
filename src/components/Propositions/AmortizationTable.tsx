
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calculator, Save, Send } from "lucide-react";

interface AmortizationRowProps {
  echeance: number;
  capitalDebPeriode: number;
  capitalRemb: number;
  interet: number;
  annuite: number;
  capitalRestantDu: number;
}

interface AmortizationTableProps {
  montant?: number;
  duree?: number;
  taux?: number;
  className?: string;
  onSaveDraft?: () => void;
  onSendForValidation?: () => void;
}

const AmortizationTable = ({ 
  montant = 50000000, 
  duree = 36,
  taux = 7.5,
  className,
  onSaveDraft,
  onSendForValidation
}: AmortizationTableProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('XOF', 'FCFA');
  };

  const calculateAmortization = (): AmortizationRowProps[] => {
    const monthlyRate = taux / 100 / 12;
    const monthlyPayment = (montant * monthlyRate * Math.pow(1 + monthlyRate, duree)) / 
                          (Math.pow(1 + monthlyRate, duree) - 1);
    
    const rows: AmortizationRowProps[] = [];
    let remainingCapital = montant;

    for (let i = 1; i <= duree; i++) {
      const interest = remainingCapital * monthlyRate;
      const principal = monthlyPayment - interest;
      const newRemainingCapital = remainingCapital - principal;

      rows.push({
        echeance: i,
        capitalDebPeriode: remainingCapital,
        capitalRemb: principal,
        interet: interest,
        annuite: monthlyPayment,
        capitalRestantDu: Math.max(0, newRemainingCapital)
      });

      remainingCapital = newRemainingCapital;
    }

    return rows;
  };

  const amortizationData = calculateAmortization();
  const totalInterets = amortizationData.reduce((sum, row) => sum + row.interet, 0);
  const totalAnnuites = amortizationData.reduce((sum, row) => sum + row.annuite, 0);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Tableau d'Amortissement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Résumé du financement */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-3">Résumé du financement</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="flex flex-col">
              <span className="text-gray-600">Montant financement :</span>
              <span className="font-medium">{formatCurrency(montant)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-600">Taux d'intérêt :</span>
              <span className="font-medium">{taux}%</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-600">Périodicité :</span>
              <span className="font-medium">Mensuelle</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-600">Durée :</span>
              <span className="font-medium">{duree} mois</span>
            </div>
          </div>
        </div>

        {/* Tableau d'amortissement */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-green-100">
                <TableHead className="text-center font-medium">Échéance</TableHead>
                <TableHead className="text-right font-medium">Capital deb période</TableHead>
                <TableHead className="text-right font-medium">Capital remb</TableHead>
                <TableHead className="text-right font-medium">Intérêt</TableHead>
                <TableHead className="text-right font-medium">Annuité</TableHead>
                <TableHead className="text-right font-medium">Capital restant du</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {amortizationData.slice(0, 4).map((row, index) => (
                <TableRow key={row.echeance} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                  <TableCell className="text-center font-medium">{row.echeance}</TableCell>
                  <TableCell className="text-right">{formatCurrency(row.capitalDebPeriode)}</TableCell>
                  <TableCell className="text-right text-green-600 font-medium">{formatCurrency(row.capitalRemb)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(row.interet)}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(row.annuite)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(row.capitalRestantDu)}</TableCell>
                </TableRow>
              ))}
              {/* Ligne des totaux */}
              <TableRow className="bg-blue-100 font-medium border-t-2">
                <TableCell className="text-center">Total</TableCell>
                <TableCell className="text-right">-</TableCell>
                <TableCell className="text-right">{formatCurrency(montant)}</TableCell>
                <TableCell className="text-right">{formatCurrency(totalInterets)}</TableCell>
                <TableCell className="text-right">{formatCurrency(totalAnnuites)}</TableCell>
                <TableCell className="text-right">-</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {duree > 4 && (
          <p className="text-sm text-muted-foreground text-center">
            Affichage des 4 premières échéances sur {duree} au total
          </p>
        )}

        {/* Boutons d'action */}
        <div className="flex gap-4 justify-center pt-4">
          <Button variant="outline" onClick={onSaveDraft} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Sauvegarder en brouillon
          </Button>
          <Button onClick={onSendForValidation} className="flex items-center gap-2 bg-dark">
            <Send className="h-4 w-4" />
            Envoyer pour validation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AmortizationTable;
