
import React, { useState } from 'react';
import { WhatsAppMessage, BookSettings } from '../types/Message';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Image, Printer, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExportOptionsProps {
  messages: WhatsAppMessage[];
  settings: BookSettings;
  onClose: () => void;
}

export const ExportOptions: React.FC<ExportOptionsProps> = ({
  messages,
  settings,
  onClose
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      // Simulation d'export PDF
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Export réussi !",
        description: "Votre livre a été exporté en PDF",
      });
    } catch (error) {
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter le livre",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToHTML = () => {
    const htmlContent = generateHTMLContent(messages, settings);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${settings.title.replace(/[^a-z0-9]/gi, '_')}.html`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export réussi !",
      description: "Votre livre a été téléchargé en HTML",
    });
  };

  const printBook = () => {
    window.print();
    toast({
      title: "Impression lancée",
      description: "La fenêtre d'impression s'ouvre",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Exporter votre livre</CardTitle>
            <CardDescription>
              Choisissez le format d'export pour sauvegarder votre livre souvenir
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Export PDF */}
          <div className="text-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <FileText className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">PDF</h3>
            <p className="text-sm text-gray-600 mb-4">
              Format idéal pour impression et partage
            </p>
            <Button 
              onClick={exportToPDF}
              disabled={isExporting}
              className="w-full"
            >
              {isExporting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Export...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Exporter PDF
                </div>
              )}
            </Button>
          </div>

          {/* Export HTML */}
          <div className="text-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <Image className="w-12 h-12 text-blue-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">HTML</h3>
            <p className="text-sm text-gray-600 mb-4">
              Page web interactive avec style
            </p>
            <Button 
              onClick={exportToHTML}
              variant="outline"
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Télécharger HTML
            </Button>
          </div>

          {/* Impression */}
          <div className="text-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <Printer className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Imprimer</h3>
            <p className="text-sm text-gray-600 mb-4">
              Impression directe sur papier
            </p>
            <Button 
              onClick={printBook}
              variant="outline"
              className="w-full"
            >
              <Printer className="w-4 h-4 mr-2" />
              Imprimer
            </Button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">💡 Conseils d'impression :</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Utilisez du papier de qualité pour un meilleur rendu</li>
            <li>• Activez l'impression en couleur pour préserver le style</li>
            <li>• Considérez la reliure spirale pour un vrai livre</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

const generateHTMLContent = (messages: WhatsAppMessage[], settings: BookSettings): string => {
  const groupedMessages = messages.reduce((groups, message) => {
    const date = message.timestamp.toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, WhatsAppMessage[]>);

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${settings.title}</title>
    <style>
        body {
            font-family: ${settings.fontFamily}, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%);
            min-height: 100vh;
        }
        .book {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .cover {
            background: ${settings.coverColor};
            background: linear-gradient(135deg, ${settings.coverColor}, ${adjustBrightness(settings.coverColor, -20)});
            color: white;
            padding: 60px 40px;
            text-align: center;
        }
        .cover h1 {
            font-size: 2.5rem;
            margin: 0 0 16px 0;
            font-weight: bold;
        }
        .cover p {
            font-size: 1.2rem;
            opacity: 0.9;
            margin: 8px 0;
        }
        .content {
            padding: 40px;
            background: #f9fafb;
        }
        .date-separator {
            text-align: center;
            margin: 32px 0 24px 0;
        }
        .date-label {
            background: white;
            padding: 8px 20px;
            border-radius: 20px;
            font-weight: 500;
            color: #6b7280;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .message {
            margin: 12px 0;
            display: flex;
        }
        .message.own {
            justify-content: flex-end;
        }
        .message-bubble {
            max-width: 70%;
            padding: 12px 16px;
            border-radius: 18px;
            position: relative;
            word-wrap: break-word;
        }
        .message.own .message-bubble {
            background: #10b981;
            color: white;
            border-bottom-right-radius: 4px;
        }
        .message:not(.own) .message-bubble {
            background: white;
            color: #1f2937;
            border-bottom-left-radius: 4px;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        .sender {
            font-size: 0.75rem;
            color: #6b7280;
            margin-bottom: 4px;
            margin-left: 8px;
            font-weight: 500;
        }
        .timestamp {
            font-size: 0.7rem;
            opacity: 0.7;
            margin-top: 4px;
            text-align: right;
        }
        .message:not(.own) .timestamp {
            color: #6b7280;
        }
        @media print {
            body { background: white; }
            .book { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="book">
        <div class="cover">
            <h1>${settings.title}</h1>
            ${settings.subtitle ? `<p>${settings.subtitle}</p>` : ''}
            <p>Livre souvenir de conversation</p>
            <p style="font-size: 0.9rem; opacity: 0.8;">${messages.length} messages</p>
        </div>
        <div class="content">
            ${Object.entries(groupedMessages).map(([date, dayMessages]) => `
                ${settings.showDates ? `
                    <div class="date-separator">
                        <span class="date-label">${new Date(date).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                    </div>
                ` : ''}
                ${dayMessages.map((message, index) => {
                  const previousMessage = index > 0 ? dayMessages[index - 1] : undefined;
                  const showSender = !previousMessage || previousMessage.sender !== message.sender;
                  const isOwn = false; // Pour l'export, on considère tous les messages comme "autres"
                  
                  return `
                    <div class="message ${isOwn ? 'own' : ''}">
                        <div>
                            ${!isOwn && showSender ? `<div class="sender">${message.sender}</div>` : ''}
                            <div class="message-bubble">
                                ${message.content.replace(/\n/g, '<br>')}
                                ${settings.showTimestamps ? `
                                    <div class="timestamp">
                                        ${message.timestamp.toLocaleTimeString('fr-FR', {
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                  `;
                }).join('')}
            `).join('')}
        </div>
    </div>
</body>
</html>
  `;
};

const adjustBrightness = (color: string, percent: number) => {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
};
