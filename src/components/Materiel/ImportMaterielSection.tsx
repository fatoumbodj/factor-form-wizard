
import { useState, useRef } from "react";
import { Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ImportMaterielSectionProps {
  onImport: (materiels: any[]) => void;
}

const ImportMaterielSection = ({ onImport }: ImportMaterielSectionProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      // Ici vous pourrez implémenter la logique d'import du fichier
      console.log("Uploading file:", selectedFile.name);
      // Simuler l'import
      onImport([]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="border-dashed border-2 border-gray-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Upload className="h-5 w-5 text-blue-600" />
              <h3 className="font-medium text-gray-900">Importer des matériels</h3>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-600 mb-3">Sélectionner un fichier</p>
              
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  onClick={triggerFileSelect}
                  className="text-sm"
                >
                  Choisir un fichier
                </Button>
                <span className="text-sm text-gray-500">
                  {selectedFile ? selectedFile.name : "Aucun fichier choisi"}
                </span>
              </div>
              
              <p className="text-xs text-gray-500">
                Formats acceptés: csv, xls, xlsx | Taille max 5MB
              </p>
              
              <Button 
                onClick={handleUpload}
                disabled={!selectedFile}
                className="bg-blue-600 hover:bg-blue-700"
                size="sm"
              >
                <Upload className="h-4 w-4 mr-2" />
                Uploader le fichier
              </Button>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-2">Saisie manuelle</p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <span className="text-lg mr-2">+</span>
              Ajouter un matériel
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImportMaterielSection;
