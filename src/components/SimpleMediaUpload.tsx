
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, ExternalLink, Github, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SimpleMediaUploadProps {
  onUrlProvided: (url: string) => void;
  fileName?: string;
  fileBlob?: Blob;
}

export const SimpleMediaUpload: React.FC<SimpleMediaUploadProps> = ({ 
  onUrlProvided, 
  fileName,
  fileBlob 
}) => {
  const [manualUrl, setManualUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [githubToken, setGithubToken] = useState('');
  const [repoName, setRepoName] = useState('whatsapp-media-storage');
  const { toast } = useToast();
  
  const githubUsername = localStorage.getItem('githubUsername') || 'votre-username';

  const uploadToGitHub = async () => {
    if (!githubToken.trim()) {
      toast({
        title: "Token GitHub requis",
        description: "Veuillez entrer votre token GitHub personnel",
        variant: "destructive",
      });
      return;
    }

    if (!fileBlob || !fileName) {
      toast({
        title: "Erreur",
        description: "Aucun fichier à uploader",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Convertir le blob en base64
      const base64Content = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.readAsDataURL(fileBlob);
      });

      // Vérifier si le repo existe, sinon le créer
      const repoExists = await checkRepoExists(githubUsername, repoName, githubToken);
      if (!repoExists) {
        await createRepo(repoName, githubToken);
        toast({
          title: "Repository créé",
          description: `Repository ${repoName} créé avec succès`,
        });
      }

      // Upload du fichier
      const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `media/${Date.now()}_${cleanFileName}`;
      
      const uploadResponse = await fetch(`https://api.github.com/repos/${githubUsername}/${repoName}/contents/${filePath}`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Upload ${fileName} from WhatsApp chat`,
          content: base64Content,
        }),
      });

      if (!uploadResponse.ok) {
        throw new Error(`Erreur upload: ${uploadResponse.statusText}`);
      }

      // Activer GitHub Pages si ce n'est pas déjà fait
      await enableGitHubPages(githubUsername, repoName, githubToken);

      // Générer l'URL GitHub Pages (peut prendre quelques minutes pour être active)
      const githubPagesUrl = `https://${githubUsername}.github.io/${repoName}/${filePath}`;
      
      onUrlProvided(githubPagesUrl);
      
      // Sauvegarder le token pour usage ultérieur (optionnel)
      localStorage.setItem('githubToken', githubToken);
      
      toast({
        title: "✅ Upload réussi !",
        description: `Votre fichier est maintenant accessible via GitHub Pages`,
      });

    } catch (error) {
      console.error('Erreur upload GitHub:', error);
      toast({
        title: "Erreur d'upload",
        description: error instanceof Error ? error.message : "Erreur inconnue",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const checkRepoExists = async (username: string, repo: string, token: string): Promise<boolean> => {
    try {
      const response = await fetch(`https://api.github.com/repos/${username}/${repo}`, {
        headers: {
          'Authorization': `token ${token}`,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  };

  const createRepo = async (repo: string, token: string) => {
    const response = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: repo,
        description: 'Repository automatique pour héberger les médias WhatsApp',
        public: true,
        auto_init: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Impossible de créer le repository: ${response.statusText}`);
    }
  };

  const enableGitHubPages = async (username: string, repo: string, token: string) => {
    try {
      await fetch(`https://api.github.com/repos/${username}/${repo}/pages`, {
        method: 'POST',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: {
            branch: 'main',
            path: '/',
          },
        }),
      });
    } catch (error) {
      // GitHub Pages peut déjà être activé, on ignore l'erreur
      console.log('GitHub Pages déjà configuré ou erreur mineure:', error);
    }
  };

  const handleManualUrl = () => {
    if (!manualUrl.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une URL valide",
        variant: "destructive",
      });
      return;
    }

    onUrlProvided(manualUrl);
    toast({
      title: "URL ajoutée",
      description: "Votre média est maintenant accessible via QR code",
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Héberger votre média sur GitHub</h3>
        <p className="text-gray-600 text-sm">
          Uploadez automatiquement vers votre repository GitHub pour un accès permanent
        </p>
      </div>

      {/* Configuration GitHub */}
      <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3 mb-3">
          <div className="bg-blue-500 p-2 rounded">
            <Github className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-blue-900">Configuration GitHub</h4>
            <p className="text-sm text-blue-700 mt-1">
              Token personnel pour {githubUsername}
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <Label htmlFor="github-token" className="text-sm">Token GitHub Personnel</Label>
            <Input
              id="github-token"
              type="password"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              className="bg-white mt-1"
            />
            <p className="text-xs text-blue-600 mt-1">
              💡 <a href="https://github.com/settings/tokens" target="_blank" className="underline">
                Créer un token sur GitHub
              </a> avec les permissions "repo" et "pages"
            </p>
          </div>
          
          <div>
            <Label htmlFor="repo-name" className="text-sm">Nom du repository</Label>
            <Input
              id="repo-name"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              className="bg-white mt-1"
            />
          </div>
        </div>
        
        <Button 
          onClick={uploadToGitHub}
          disabled={isUploading || !githubToken.trim()}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
        >
          {isUploading ? (
            <>
              <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
              Upload vers GitHub...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Uploader sur GitHub
            </>
          )}
        </Button>
        
        {fileName && (
          <p className="text-xs text-blue-600 mt-2">
            📁 Fichier à uploader: {fileName}
          </p>
        )}
      </div>

      {/* Séparateur */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Ou</span>
        </div>
      </div>

      {/* Option manuelle */}
      <div className="border rounded-lg p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="bg-gray-500 p-2 rounded">
            <ExternalLink className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">URL personnalisée</h4>
            <p className="text-sm text-gray-600 mt-1">
              Si vous avez déjà hébergé votre fichier ailleurs
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <Label htmlFor="manual-url" className="text-sm">URL de votre fichier</Label>
            <Input
              id="manual-url"
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              placeholder="https://example.com/mon-fichier.mp4"
              className="mt-1"
            />
          </div>
          
          <Button onClick={handleManualUrl} variant="outline" className="w-full">
            <CheckCircle className="w-4 h-4 mr-2" />
            Utiliser cette URL
          </Button>
        </div>
      </div>

      <div className="text-xs text-gray-500 text-center space-y-1">
        <p>💡 Une fois uploadé, votre fichier sera accessible via GitHub Pages</p>
        <p>⚠️ Il peut y avoir un délai de quelques minutes avant que GitHub Pages soit actif</p>
      </div>
    </div>
  );
};
