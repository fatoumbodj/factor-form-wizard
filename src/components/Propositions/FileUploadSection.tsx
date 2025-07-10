
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, CheckCircle, XCircle } from "lucide-react";

interface FileUploadSectionProps {
  title: string;
  onFileUpload: (file: File) => void;
  acceptedFormats: string;
  maxSize: number; // en MB
}

const FileUploadSection = ({ title, onFileUpload, acceptedFormats, maxSize }: FileUploadSectionProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Vérification de la taille
      if (file.size > maxSize * 1024 * 1024) {
        setErrorMessage(`Le fichier dépasse la taille maximale de ${maxSize}MB`);
        setUploadStatus("error");
        return;
      }

      // Vérification du format
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const allowedExtensions = acceptedFormats.split(',').map(ext => ext.trim().toLowerCase());
      
      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        setErrorMessage(`Format non autorisé. Formats acceptés: ${acceptedFormats}`);
        setUploadStatus("error");
        return;
      }

      setSelectedFile(file);
      setUploadStatus("idle");
      setErrorMessage("");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploadStatus("uploading");
    
    try {
      // Simulation d'upload - remplacer par vraie logique d'upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onFileUpload(selectedFile);
      setUploadStatus("success");
    } catch (error) {
      setUploadStatus("error");
      setErrorMessage("Erreur lors de l'upload du fichier");
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setUploadStatus("idle");
    setErrorMessage("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Sélectionner un fichier</Label>
          <Input
            type="file"
            onChange={handleFileSelect}
            accept={acceptedFormats.split(',').map(ext => `.${ext.trim()}`).join(',')}
            disabled={uploadStatus === "uploading"}
          />
          <p className="text-sm text-muted-foreground mt-1">
            Formats acceptés: {acceptedFormats} | Taille max: {maxSize}MB
          </p>
        </div>

        {selectedFile && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="text-sm font-medium">{selectedFile.name}</span>
              <span className="text-xs text-muted-foreground">
                ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
          </div>
        )}

        {uploadStatus === "error" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-red-600">
              <XCircle className="h-4 w-4" />
              <span className="text-sm">{errorMessage}</span>
            </div>
          </div>
        )}

        {uploadStatus === "success" && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Fichier uploadé avec succès</span>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button 
            onClick={handleUpload}
            disabled={!selectedFile || uploadStatus === "uploading" || uploadStatus === "success"}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {uploadStatus === "uploading" ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Upload en cours...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Uploader le fichier
              </>
            )}
          </Button>
          
          {selectedFile && (
            <Button variant="outline" onClick={resetUpload}>
              Annuler
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUploadSection;
