
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Convention } from "@/types/leasing";
import { RotateCcw, XCircle, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ConventionActionsProps {
  convention: Convention;
  onReconduct: (convention: Convention, startDate: Date, motif: string) => void;
  onResiliate: (convention: Convention, motif: string) => void;
  onCancel: (convention: Convention, motif: string) => void;
}

const ConventionActions = ({ convention, onReconduct, onResiliate, onCancel }: ConventionActionsProps) => {
  const [isReconductDialogOpen, setIsReconductDialogOpen] = useState(false);
  const [reconductForm, setReconductForm] = useState({
    dateDebut: new Date().toISOString().split('T')[0],
    motif: ""
  });
  const [motifResilier, setMotifResilier] = useState("");
  const [motifAnnuler, setMotifAnnuler] = useState("");

  const isExpired = convention.dateFin && convention.dateFin < new Date();
  const isExpiringsSoon = convention.dateFin && 
    convention.dateFin > new Date() && 
    convention.dateFin <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 jours

  const handleReconduct = () => {
    if (reconductForm.motif.trim()) {
      onReconduct(convention, new Date(reconductForm.dateDebut), reconductForm.motif);
      setIsReconductDialogOpen(false);
      setReconductForm({
        dateDebut: new Date().toISOString().split('T')[0],
        motif: ""
      });
    }
  };

  const handleResiliate = () => {
    if (motifResilier.trim()) {
      onResiliate(convention, motifResilier);
      setMotifResilier("");
    }
  };

  const handleCancel = () => {
    if (motifAnnuler.trim()) {
      onCancel(convention, motifAnnuler);
      setMotifAnnuler("");
    }
  };

  return (
    <div className="flex gap-2">
      {/* Reconduction */}
      <Dialog open={isReconductDialogOpen} onOpenChange={setIsReconductDialogOpen}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="text-green-600 hover:text-green-700"
            disabled={convention.statut !== "active"}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reconduire la Convention</DialogTitle>
            <DialogDescription>
              {isExpired 
                ? "Cette convention est échue. Définissez la nouvelle date de début."
                : isExpiringsSoon
                ? "Cette convention expire bientôt. Définissez la nouvelle date de début."
                : "Reconduire cette convention active."
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="dateDebutReconduction">Date de début</Label>
              <Input
                id="dateDebutReconduction"
                type="date"
                value={reconductForm.dateDebut}
                onChange={(e) => setReconductForm(prev => ({ ...prev, dateDebut: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="motifReconduction">Motif de reconduction *</Label>
              <Textarea
                id="motifReconduction"
                value={reconductForm.motif}
                onChange={(e) => setReconductForm(prev => ({ ...prev, motif: e.target.value }))}
                placeholder="Expliquez la raison de la reconduction..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReconductDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleReconduct} disabled={!reconductForm.motif.trim()}>
              Reconduire
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Résiliation */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="text-orange-600 hover:text-orange-700"
            disabled={convention.statut !== "active"}
          >
            <AlertTriangle className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Résilier la Convention</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La convention sera résiliée et ne pourra plus être utilisée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="motifResilier">Motif de résiliation *</Label>
              <Textarea
                id="motifResilier"
                value={motifResilier}
                onChange={(e) => setMotifResilier(e.target.value)}
                placeholder="Expliquez la raison de la résiliation..."
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setMotifResilier("")}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleResiliate}
              disabled={!motifResilier.trim()}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Résilier
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Annulation */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="text-red-600 hover:text-red-700"
            disabled={convention.statut !== "active"}
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Annuler la Convention</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La convention sera annulée et remplacée par une nouvelle version.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="motifAnnuler">Motif d'annulation *</Label>
              <Textarea
                id="motifAnnuler"
                value={motifAnnuler}
                onChange={(e) => setMotifAnnuler(e.target.value)}
                placeholder="Expliquez la raison de l'annulation..."
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setMotifAnnuler("")}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCancel}
              disabled={!motifAnnuler.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              Annuler la convention
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ConventionActions;
