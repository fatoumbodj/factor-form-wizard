
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Cloud, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AWSConnectProps {
  onConnectionSet: () => void;
  isConnected: boolean;
}

export const AWSConnect: React.FC<AWSConnectProps> = ({
  onConnectionSet,
  isConnected
}) => {
  const [awsAccessKey, setAwsAccessKey] = useState('');
  const [awsSecretKey, setAwsSecretKey] = useState('');
  const [awsBucketName, setAwsBucketName] = useState('');
  const [awsRegion, setAwsRegion] = useState('eu-west-1');
  const { toast } = useToast();

  const handleConnect = () => {
    if (!awsAccessKey.trim() || !awsSecretKey.trim() || !awsBucketName.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs AWS S3",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem('awsAccessKey', awsAccessKey);
    localStorage.setItem('awsSecretKey', awsSecretKey);
    localStorage.setItem('awsBucketName', awsBucketName);
    localStorage.setItem('awsRegion', awsRegion);
    
    onConnectionSet();
    
    toast({
      title: "Connexion réussie",
      description: "AWS S3 est maintenant connecté pour héberger vos médias",
    });
  };

  if (isConnected) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">AWS S3 connecté</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            Vos médias seront automatiquement hébergés sur S3 et accessibles via QR codes
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="w-5 h-5" />
          Connecter AWS S3
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Connectez votre AWS S3 pour héberger automatiquement vos vidéos et générer des QR codes fonctionnels.
        </p>
        
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="accessKey">Clé d'accès AWS</Label>
            <Input
              id="accessKey"
              type="password"
              value={awsAccessKey}
              onChange={(e) => setAwsAccessKey(e.target.value)}
              placeholder="AKIA..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="secretKey">Clé secrète AWS</Label>
            <Input
              id="secretKey"
              type="password"
              value={awsSecretKey}
              onChange={(e) => setAwsSecretKey(e.target.value)}
              placeholder="Votre clé secrète AWS..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bucketName">Nom du bucket S3</Label>
            <Input
              id="bucketName"
              value={awsBucketName}
              onChange={(e) => setAwsBucketName(e.target.value)}
              placeholder="mon-bucket-videos"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="region">Région AWS</Label>
            <Input
              id="region"
              value={awsRegion}
              onChange={(e) => setAwsRegion(e.target.value)}
              placeholder="eu-west-1"
            />
          </div>

          <p className="text-xs text-gray-500">
            <a 
              href="https://console.aws.amazon.com/s3/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Gérez vos buckets S3 ici
            </a>
          </p>
        </div>

        <Button onClick={handleConnect} className="w-full">
          <Cloud className="w-4 h-4 mr-2" />
          Connecter AWS S3
        </Button>
      </CardContent>
    </Card>
  );
};
