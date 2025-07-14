
import { useState } from "react";
import Header from "@/components/Layout/Header";
import { AppSidebar } from "@/components/Layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider } from "@/components/ui/sidebar";
import { 
  FolderOpen, 
  Plus, 
  Search, 
  Filter, 
  User, 
  Building, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock,
  Eye
} from "lucide-react";
import { Input } from "@/components/ui/input";

const DossierCredit = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Données d'exemple pour les dossiers de crédit
  const dossiers = [
    {
      id: "DC001",
      client: "SARL Technologies Plus",
      type: "Entreprise",
      montant: "125 000 €",
      statut: "validation",
      dateCreation: "2024-01-15",
      echeance: "2024-02-15",
      documents: 8,
      responsable: "Marie Dubois"
    },
    {
      id: "DC002", 
      client: "Martin Dupont",
      type: "Particulier",
      montant: "45 000 €",
      statut: "approuve",
      dateCreation: "2024-01-12",
      echeance: "2024-01-30",
      documents: 12,
      responsable: "Jean Martin"
    },
    {
      id: "DC003",
      client: "Équipements Industriels SA",
      type: "Entreprise", 
      montant: "250 000 €",
      statut: "rejete",
      dateCreation: "2024-01-10",
      echeance: "2024-01-25",
      documents: 6,
      responsable: "Sophie Laurent"
    }
  ];

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

  const filteredDossiers = dossiers.filter(dossier =>
    dossier.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dossier.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1">
          <Header />
          
          <main className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Dossier de Crédit</h1>
                <p className="text-muted-foreground mt-2">
                  Gestion des dossiers de crédit après validation de proposition
                </p>
              </div>
              
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Nouveau dossier</span>
              </Button>
            </div>

            {/* Barre de recherche et filtres */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un dossier ou client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </Button>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Dossiers</CardTitle>
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">156</div>
                  <p className="text-xs text-muted-foreground">+12% ce mois</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">En validation</CardTitle>
                  <Clock className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">23</div>
                  <p className="text-xs text-muted-foreground">En attente</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Approuvés</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">108</div>
                  <p className="text-xs text-muted-foreground">69% du total</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Montant total</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2.4M€</div>
                  <p className="text-xs text-muted-foreground">Dossiers actifs</p>
                </CardContent>
              </Card>
            </div>

            {/* Liste des dossiers */}
            <Card>
              <CardHeader>
                <CardTitle>Dossiers récents</CardTitle>
                <CardDescription>
                  Liste des dossiers de crédit en cours de traitement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredDossiers.map((dossier) => (
                    <div key={dossier.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          {dossier.type === "Entreprise" ? (
                            <Building className="h-5 w-5 text-primary" />
                          ) : (
                            <User className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-foreground">{dossier.client}</h3>
                            <Badge variant="secondary" className="text-xs">{dossier.id}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {dossier.type} • {dossier.documents} documents • {dossier.responsable}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-semibold text-foreground">{dossier.montant}</p>
                          <p className="text-xs text-muted-foreground">
                            Créé le {new Date(dossier.dateCreation).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        
                        {getStatutBadge(dossier.statut)}
                        
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DossierCredit;
