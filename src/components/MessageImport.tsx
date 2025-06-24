
import React, { useState } from 'react';
import { Upload, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { parseWhatsAppChat } from '../utils/whatsappParser';
import { WhatsAppMessage } from '../types/Message';
import { useToast } from '@/hooks/use-toast';

interface MessageImportProps {
  onMessagesImported: (messages: WhatsAppMessage[], participants: string[]) => void;
}

export const MessageImport: React.FC<MessageImportProps> = ({ onMessagesImported }) => {
  const [chatText, setChatText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleImport = async () => {
    if (!chatText.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez coller le texte de votre conversation WhatsApp",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { messages, participants } = parseWhatsAppChat(chatText);
      
      if (messages.length === 0) {
        toast({
          title: "Aucun message trouvé",
          description: "Le format de la conversation ne semble pas correct",
          variant: "destructive"
        });
        return;
      }

      onMessagesImported(messages, participants);
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
    } finally {
      setIsLoading(false);
    }
  };

  const exampleText = `[15/06/2023, 14:30:25] Alice: Salut ! Comment ça va ?
[15/06/2023, 14:31:12] Bob: Ça va bien merci ! Et toi ?
[15/06/2023, 14:32:45] Alice: Super ! On se voit toujours ce soir ?
[15/06/2023, 14:33:20] Bob: Oui, j'ai hâte ! 😊`;

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <FileText className="w-16 h-16 text-green-600" />
              <Sparkles className="w-6 h-6 text-yellow-500 absolute -top-2 -right-2" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Importez votre conversation WhatsApp
          </CardTitle>
          <CardDescription className="text-lg">
            Collez le texte exporté de WhatsApp pour créer votre livre souvenir
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Texte de la conversation WhatsApp
            </label>
            <Textarea
              placeholder={`Collez ici le texte exporté de WhatsApp...\n\nExemple:\n${exampleText}`}
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">
              💡 Comment exporter votre conversation WhatsApp :
            </h3>
            <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
              <li>Ouvrez la conversation dans WhatsApp</li>
              <li>Appuyez sur les 3 points (⋮) en haut à droite</li>
              <li>Sélectionnez "Plus" puis "Exporter la discussion"</li>
              <li>Choisissez "Sans fichiers multimédias"</li>
              <li>Copiez le contenu du fichier et collez-le ici</li>
            </ol>
          </div>

          <Button 
            onClick={handleImport}
            disabled={isLoading || !chatText.trim()}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 text-lg"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Traitement en cours...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Créer le livre souvenir
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
