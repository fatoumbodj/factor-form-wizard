
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Users, Clock, Target, FileText, Percent } from "lucide-react";

interface KPIData {
  nombreDossiers: number;
  objectifDossiers: number;
  tauxActivation: number;
  delaiMoyenSouscription: number;
  tauxTransformation: number;
  valeurGeneree: number;
  objectifValeur: number;
}

interface CampagneKPIProps {
  kpiData: KPIData;
  periode: { debut: Date; fin: Date };
}

const CampagneKPI = ({ kpiData, periode }: CampagneKPIProps) => {
  const progressionDossiers = (kpiData.nombreDossiers / kpiData.objectifDossiers) * 100;
  const progressionValeur = (kpiData.valeurGeneree / kpiData.objectifValeur) * 100;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 60) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Tableau de Bord KPI
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Période : {periode.debut.toLocaleDateString()} - {periode.fin.toLocaleDateString()}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Dossiers générés</span>
              </div>
              <div className="text-2xl font-bold">{kpiData.nombreDossiers}</div>
              <div className="text-sm text-muted-foreground">
                Objectif : {kpiData.objectifDossiers}
              </div>
              <Progress 
                value={progressionDossiers} 
                className="h-2"
              />
              <div className="text-xs text-muted-foreground">
                {progressionDossiers.toFixed(1)}% de l'objectif
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Taux d'activation</span>
              </div>
              <div className="text-2xl font-bold">{kpiData.tauxActivation}%</div>
              <Badge className={kpiData.tauxActivation >= 70 ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}>
                {kpiData.tauxActivation >= 70 ? "Excellent" : "À améliorer"}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">Délai moyen</span>
              </div>
              <div className="text-2xl font-bold">{kpiData.delaiMoyenSouscription}j</div>
              <div className="text-sm text-muted-foreground">
                Souscription moyenne
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Transformation</span>
              </div>
              <div className="text-2xl font-bold">{kpiData.tauxTransformation}%</div>
              <Badge className={kpiData.tauxTransformation >= 25 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                {kpiData.tauxTransformation >= 25 ? "Bon" : "Faible"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-500" />
            Objectifs Commerciaux
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Volume (Dossiers)</span>
                <span className="text-sm text-muted-foreground">
                  {kpiData.nombreDossiers} / {kpiData.objectifDossiers}
                </span>
              </div>
              <Progress 
                value={progressionDossiers} 
                className="h-3"
              />
              <div className="text-sm text-muted-foreground">
                Progression : {progressionDossiers.toFixed(1)}%
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Valeur</span>
                <span className="text-sm text-muted-foreground">
                  {formatCurrency(kpiData.valeurGeneree)} / {formatCurrency(kpiData.objectifValeur)}
                </span>
              </div>
              <Progress 
                value={progressionValeur} 
                className="h-3"
              />
              <div className="text-sm text-muted-foreground">
                Progression : {progressionValeur.toFixed(1)}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampagneKPI;
