import React, { useState } from 'react';
import { Upload, FileText, MessageSquare, Camera, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { parseWhatsAppChat } from '../utils/whatsappParser';
import { WhatsAppMessage } from '../types/Message';
import { useToast } from '@/hooks/use-toast';
import JSZip from 'jszip';

interface UniversalImportProps {
  onMessagesImported: (messages: WhatsAppMessage[], participants: string[], mediaFiles: Map<string, string>) => void;
}

export const UniversalImport: React.FC<UniversalImportProps> = ({ onMessagesImported }) => {
  const [chatText, setChatText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<'whatsapp' | 'messenger' | 'instagram'>('whatsapp');
  const [extractedMediaFiles, setExtractedMediaFiles] = useState<Map<string, string>>(new Map());
  const { toast } = useToast();
const [mediaMap, setMediaMap] = useState<Record<string, string>>({});

  const handleZipFile = async (file: File): Promise<{ chatContent: string, mediaFiles: Map<string, string> }> => {
    const zip = new JSZip();
    const contents = await zip.loadAsync(file);
    const mediaFiles = new Map<string, string>();
    
    console.log('Contenu du ZIP:', Object.keys(contents.files));
    
    // Chercher des fichiers de chat dans l'archive
    const chatFiles = Object.keys(contents.files).filter(filename => 
      filename.endsWith('.txt') || 
      filename.endsWith('.json') ||
      filename.includes('chat') ||
      filename.includes('message')
    );
    
    console.log('Fichiers de chat trouvés:', chatFiles);
    
    if (chatFiles.length === 0) {
      throw new Error('Aucun fichier de conversation trouvé dans l\'archive ZIP');
    }
    
    // Extraire les fichiers média avec plus de types supportés
    const mediaExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff', '.svg',
                           '.mp4', '.avi', '.mov', '.webm', '.mkv', '.flv', '.wmv',
                           '.mp3', '.wav', '.opus', '.ogg', '.aac', '.m4a', '.flac',
                           '.pdf', '.doc', '.docx', '.txt', '.rtf', '.xls', '.xlsx', '.ppt', '.pptx'];
    
    for (const filename of Object.keys(contents.files)) {
      const file = contents.files[filename];
      if (!file.dir && mediaExtensions.some(ext => filename.toLowerCase().endsWith(ext))) {
        try {
          const blob = await file.async('blob');
          const url = URL.createObjectURL(blob);
          const cleanFileName = filename.split('/').pop() || filename;
          mediaFiles.set(cleanFileName, url);
          mediaFiles.set(filename, url); // Garder aussi le chemin complet
          console.log('Média extrait:', filename, '-> URL:', url);
        } catch (error) {
          console.error('Erreur lors de l\'extraction du média:', filename, error);
        }
      }
    }
    
    console.log('Total médias extraits:', mediaFiles.size);
    console.log('Liste des médias:', Array.from(mediaFiles.keys()));
    
    // Prendre le premier fichier de chat trouvé
    const chatFile = contents.files[chatFiles[0]];
    const content = await chatFile.async('string');
    
    toast({
      title: "Archive ZIP traitée",
      description: `Fichier: ${chatFiles[0]}, Médias: ${mediaFiles.size}`,
    });
    
    return { chatContent: content, mediaFiles };
  };

  const handleZipFile = async (file: File): Promise<{ chatText: string; mediaMap: Record<string, string> }> => {
  const zip = new JSZip();
  const contents = await zip.loadAsync(file);
  const mediaMap: Record<string, string> = {};

  // Trouver les fichiers de chat (txt ou json)
  const chatFiles = Object.keys(contents.files).filter(filename =>
    filename.endsWith('.txt') ||
    filename.endsWith('.json') ||
    filename.includes('chat') ||
    filename.includes('message')
  );

  if (chatFiles.length === 0) {
    throw new Error('Aucun fichier de conversation trouvé dans l\'archive ZIP');
  }

  // Extraire le contenu du premier fichier chat
  const chatFile = contents.files[chatFiles[0]];
  const chatText = await chatFile.async('string');

  // Extraire les fichiers médias (images, videos, etc.)
  for (const filename of Object.keys(contents.files)) {
    const fileEntry = contents.files[filename];
    if (!fileEntry.dir && /\.(jpg|jpeg|png|gif|mp4|mov|mp3|wav)$/i.test(filename)) {
      // Lire le fichier en base64
      const base64 = await fileEntry.async('base64');
      const ext = filename.split('.').pop()?.toLowerCase() || '';
      const mimeType = {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        gif: 'image/gif',
        mp4: 'video/mp4',
        mov: 'video/quicktime',
        mp3: 'audio/mpeg',
        wav: 'audio/wav'
      }[ext] || 'application/octet-stream';

      mediaMap[filename] = `data:${mimeType};base64,${base64}`;
    }
  }

  toast({
    title: "Archive ZIP traitée",
    description: `Fichier extrait: ${chatFiles[0]}, médias détectés: ${Object.keys(mediaMap).length}`,
  });

  return { chatText, mediaMap };
};

  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

    setIsLoading(true);
    try {
      let text: string;
      let mediaFiles = new Map<string, string>();
      
      if (file.name.toLowerCase().endsWith('.zip')) {
        const result = await handleZipFile(file);
        text = result.chatContent;
        mediaFiles = result.mediaFiles;
        setExtractedMediaFiles(mediaFiles);
      } else {
        text = await file.text();
        setExtractedMediaFiles(new Map());
      }
      
      setChatText(text);
      setMediaMap({}); // aucun média
    }

    toast({
      title: "Fichier chargé !",
      description: `Le fichier ${file.name} a été importé avec succès`,
    });
  } catch (error) {
    toast({
      title: "Erreur de lecture",
      description: error instanceof Error ? error.message : "Impossible de lire le fichier",
      variant: "destructive"
    });
  } finally {
    setIsLoading(false);
  }
};

  const handleImport = async () => {
if (!(chatText?.trim?.() ?? '')) {
      toast({
        title: "Erreur",
        description: "Veuillez coller le texte ou charger un fichier",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Import avec médias:', Array.from(extractedMediaFiles.keys()));
      
      // Passer les médias extraits au parser
      const { messages, participants, mediaFiles } = parseWhatsAppChat(chatText, extractedMediaFiles);
      
      if (messages.length === 0) {
        toast({
          title: "Aucun message trouvé",
          description: "Le format de la conversation ne semble pas correct",
          variant: "destructive"
        });
        return;
      }

      console.log('Messages avec médias traités:', messages.filter(m => m.type === 'media').length);
      
      onMessagesImported(messages, participants, mediaFiles || extractedMediaFiles);
      toast({
        title: "Succès !",
        description: `${messages.length} messages importés avec succès`,
      });
    } catch (error) {
      toast({
        title: "Erreur d'importation",
        description: "Impossible de parser la conversation. Vérifiez le format.",
        variant: "destructive"
      });
      console.error('Erreur d\'importation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const platformInfo = {
    whatsapp: {
      name: "WhatsApp",
      icon: MessageSquare,
      color: "text-green-600",
      instructions: [
        "Ouvrez la conversation dans WhatsApp",
        "Appuyez sur les 3 points (⋮) en haut à droite",
        "Sélectionnez 'Plus' puis 'Exporter la discussion'",
        "Choisissez 'Avec fichiers multimédias' ou 'Sans fichiers multimédias'",
        "Envoyez-vous le fichier par email ou sauvegardez-le"
      ]
    },
    messenger: {
      name: "Messenger",
      icon: MessageSquare,
      color: "text-blue-600",
      instructions: [
        "Allez sur facebook.com/dyi",
        "Cliquez sur 'Télécharger vos informations'",
        "Sélectionnez 'Messages' dans la liste",
        "Choisissez le format JSON",
        "Téléchargez vos données"
      ]
    },
    instagram: {
      name: "Instagram",
      icon: Camera,
      color: "text-pink-600",
      instructions: [
        "Allez dans Paramètres > Confidentialité et sécurité",
        "Cliquez sur 'Télécharger vos données'",
        "Sélectionnez 'Messages' dans la liste",
        "Choisissez le format JSON",
        "Téléchargez vos données"
      ]
    }
  };

  const currentPlatform = platformInfo[selectedPlatform];
  const Icon = currentPlatform.icon;

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <FileText className="w-16 h-16 text-blue-600" />
              <Sparkles className="w-6 h-6 text-yellow-500 absolute -top-2 -right-2" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Importez vos conversations
          </CardTitle>
          <CardDescription className="text-lg">
            Supporté : WhatsApp, Messenger, Instagram DM (TXT, JSON, ZIP)
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Sélection de plateforme */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {Object.entries(platformInfo).map(([key, platform]) => {
              const PlatformIcon = platform.icon;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedPlatform(key as any)}
                  className={`
                    p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2
                    ${selectedPlatform === key 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <PlatformIcon className={`w-8 h-8 ${platform.color}`} />
                  <span className="font-medium">{platform.name}</span>
                </button>
              );
            })}
          </div>

          {/* Méthodes d'import */}
          <Tabs defaultValue="file" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="file">📁 Fichier</TabsTrigger>
              <TabsTrigger value="text">📝 Texte</TabsTrigger>
            </TabsList>
            
            <TabsContent value="file" className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Glissez-déposez votre fichier ici
                </p>
                <p className="text-gray-500 mb-2">
                  ou cliquez pour sélectionner
                </p>
                <p className="text-sm text-blue-600 mb-4">
                  Formats supportés: TXT, JSON, ZIP
                </p>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".txt,.json,.zip"
                  className="hidden"
                  id="file-upload"
                />
                <Button asChild variant="outline">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    Choisir un fichier
                  </label>
                </Button>
              </div>
              
              {extractedMediaFiles.size > 0 && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-800 font-medium">
                    ✅ {extractedMediaFiles.size} fichiers média extraits du ZIP
                  </p>
                  <p className="text-green-600 text-sm mt-1">
                    Les images et autres médias seront affichés dans le livre
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="text" className="space-y-4">
              <Textarea
                placeholder="Collez ici le contenu de votre conversation..."
                value={chatText}
                onChange={(e) => setChatText(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
            </TabsContent>
          </Tabs>

          {/* Instructions spécifiques à la plateforme */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <Icon className={`w-5 h-5 ${currentPlatform.color}`} />
              Comment exporter depuis {currentPlatform.name} :
            </h3>
            <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
              {currentPlatform.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>

          <Button 
            onClick={handleImport}
            disabled={isLoading || !chatText.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 text-lg"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Traitement en cours...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Créer le livre souvenir
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
