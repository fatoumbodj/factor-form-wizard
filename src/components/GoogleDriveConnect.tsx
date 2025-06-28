
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Link, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GoogleDriveConnectProps {
  onApiKeySet: (apiKey: string) => void;
  isConnected: boolean;
}

export const GoogleDriveConnect: React.FC<GoogleDriveConnectProps> = ({
  onApiKeySet,
  isConnected
}) => {
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();

  const handleConnect = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer votre clé API Google Drive",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem('googleDriveApiKey', apiKey);
    onApiKeySet(apiKey);
    
    toast({
      title: "Connexion réussie",
      description: "Google Drive est maintenant connecté pour héberger vos médias",
    });
  };

  if (isConnected) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">Google Drive connecté</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            Vos médias seront automatiquement hébergés et accessibles via QR codes
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Connecter Google Drive
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Connectez votre Google Drive pour héberger automatiquement vos vidéos et générer des QR codes fonctionnels.
        </p>
        
        <div className="space-y-2">
          <Label htmlFor="apiKey">Clé API Google Drive</Label>
          <Input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Entrez votre clé API Google..."
          />
          <p className="text-xs text-gray-500">
            <a 
              href="https://console.developers.google.com/apis/credentials" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Obtenez votre clé API ici
            </a>
          </p>
        </div>

        <Button onClick={handleConnect} className="w-full">
          <Link className="w-4 h-4 mr-2" />
          Connecter Google Drive
        </Button>
      </CardContent>
    </Card>
  );
};
