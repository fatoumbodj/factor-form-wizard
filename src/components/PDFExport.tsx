import React, { useState } from 'react';
import { WhatsAppMessage, BookSettings } from '../types/Message';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PDFExportProps {
  messages: WhatsAppMessage[];
  settings: BookSettings;
  participants: string[];
}

export const PDFExport: React.FC<PDFExportProps> = ({
  messages,
  settings,
  participants
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const generateQRCodeUrl = (url: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}`;
  };

  // Fonction pour générer une image de démonstration
  const getPlaceholderImage = (mediaType: string, fileName: string) => {
    const encodedText = encodeURIComponent(`${mediaType.toUpperCase()}\n${fileName}`);
    return `https://via.placeholder.com/200x150/f3f4f6/374151?text=${encodedText}`;
  };

  const generatePDFContent = () => {
    const groupedMessages = messages.reduce((groups, message) => {
      const date = message.timestamp.toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    }, {} as Record<string, WhatsAppMessage[]>);

    // Créer plus de messages par page (15-20 au lieu de 5-10)
    const messagesPerPage = 20;
    const pages: any[] = [];
    
    Object.entries(groupedMessages).forEach(([date, dayMessages]) => {
      for (let i = 0; i < dayMessages.length; i += messagesPerPage) {
        const pageMessages = dayMessages.slice(i, i + messagesPerPage);
        pages.push({
          date: i === 0 ? date : null, // Afficher la date seulement sur la première page du jour
          messages: pageMessages
        });
      }
    });

    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${settings.title}</title>
    <style>
        @page {
            size: A4;
            margin: 15mm;
        }
        
        body {
            font-family: ${settings.fontFamily}, sans-serif;
            margin: 0;
            padding: 0;
            line-height: 1.4;
            font-size: 10pt;
        }
        
        .page {
            min-height: calc(100vh - 30mm);
            page-break-after: always;
            display: flex;
            flex-direction: column;
        }
        
        .page:last-child {
            page-break-after: avoid;
        }
        
        /* Page de couverture */
        .cover-page {
            background: linear-gradient(135deg, ${settings.coverColor}, ${adjustBrightness(settings.coverColor, -20)});
            color: white;
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 40mm 20mm;
        }
        
        .cover-page h1 {
            font-size: 36pt;
            margin: 0 0 10mm 0;
            font-weight: bold;
        }
        
        .cover-page .subtitle {
            font-size: 18pt;
            margin: 0 0 15mm 0;
            opacity: 0.9;
        }
        
        .cover-page .info {
            font-size: 14pt;
            line-height: 1.6;
        }
        
        /* Pages de contenu */
        .content-page {
            padding: 10mm 0;
        }
        
        .date-header {
            text-align: center;
            margin: 0 0 8mm 0;
            padding: 3mm 0;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .date-header span {
            background: #f3f4f6;
            padding: 2mm 6mm;
            border-radius: 4mm;
            font-weight: 600;
            color: #374151;
            font-size: 11pt;
        }
        
        .messages-container {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 2mm;
        }
        
        .message {
            display: flex;
            margin: 1mm 0;
            max-width: 80%;
            clear: both;
        }
        
        .message.own {
            margin-left: auto;
            justify-content: flex-end;
        }
        
        .message-bubble {
            padding: 2mm 3mm;
            border-radius: 3mm;
            word-wrap: break-word;
            position: relative;
            max-width: 100%;
        }
        
        .message.own .message-bubble {
            background: ${settings.coverColor};
            color: white;
            border-bottom-right-radius: 1mm;
        }
        
        .message:not(.own) .message-bubble {
            background: #f3f4f6;
            color: #1f2937;
            border-bottom-left-radius: 1mm;
        }
        
        .sender {
            font-size: 8pt;
            color: #6b7280;
            margin-bottom: 1mm;
            font-weight: 600;
        }
        
        .message-content {
            font-size: 10pt;
            line-height: 1.3;
        }
        
        .timestamp {
            font-size: 7pt;
            opacity: 0.7;
            margin-top: 1mm;
            text-align: right;
        }
        
        /* Styles pour les médias */
        .media-container {
            margin: 2mm 0;
            padding: 3mm;
            background: #f9fafb;
            border-radius: 3mm;
            border: 1px solid #e5e7eb;
            text-align: center;
            max-width: 100%;
        }
        
        .media-image {
            max-width: 100%;
            max-height: 40mm;
            height: auto;
            border-radius: 2mm;
            margin-bottom: 2mm;
            box-shadow: 0 1mm 3mm rgba(0,0,0,0.1);
        }
        
        .media-qr-container {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 3mm;
            margin: 2mm 0;
        }
        
        .media-qr img {
            width: 20mm;
            height: 20mm;
            border-radius: 2mm;
        }
        
        .media-info {
            text-align: left;
            flex: 1;
        }
        
        .media-type {
            font-size: 9pt;
            font-weight: 600;
            color: #374151;
            margin-bottom: 1mm;
        }
        
        .media-filename {
            font-size: 8pt;
            color: #6b7280;
            word-break: break-all;
        }
        
        .media-instruction {
            font-size: 7pt;
            color: #9ca3af;
            font-style: italic;
            margin-top: 1mm;
        }
        
        /* Préface et dédicace */
        .preface-page, .dedication-page {
            padding: 20mm;
            text-align: center;
        }
        
        .preface-page h2, .dedication-page h2 {
            font-size: 24pt;
            margin: 0 0 10mm 0;
            color: #374151;
        }
        
        .preface-content, .dedication-content {
            font-size: 12pt;
            line-height: 1.6;
            color: #4b5563;
            max-width: 120mm;
            margin: 0 auto;
        }
        
        .author-signature {
            margin-top: 15mm;
            font-style: italic;
            color: #6b7280;
        }
        
        /* Pagination */
        .page-number {
            position: absolute;
            bottom: 5mm;
            right: 50%;
            transform: translateX(50%);
            font-size: 9pt;
            color: #6b7280;
        }
    </style>
</head>
<body>
    <!-- Page de couverture -->
    <div class="page cover-page">
        <h1>${settings.title}</h1>
        ${settings.subtitle ? `<div class="subtitle">${settings.subtitle}</div>` : ''}
        <div class="info">
            <div>Conversation entre ${participants.join(' et ')}</div>
            <div style="margin-top: 5mm;">${messages.length} messages</div>
            <div>${formatDateRange(messages)}</div>
            ${settings.authorName ? `<div style="margin-top: 10mm;">Par ${settings.authorName}</div>` : ''}
        </div>
    </div>
    
    ${settings.preface ? `
    <!-- Page de préface -->
    <div class="page preface-page">
        <h2>Préface</h2>
        <div class="preface-content">
            ${settings.preface.split('\n').map(p => `<p>${p}</p>`).join('')}
        </div>
        ${settings.authorName ? `<div class="author-signature">${settings.authorName}</div>` : ''}
    </div>
    ` : ''}
    
    ${settings.dedication ? `
    <!-- Page de dédicace -->
    <div class="page dedication-page">
        <h2>Dédicace</h2>
        <div class="dedication-content">
            ${settings.dedication.split('\n').map(p => `<p><em>${p}</em></p>`).join('')}
        </div>
    </div>
    ` : ''}
    
    ${pages.map((page, pageIndex) => `
    <!-- Page de contenu ${pageIndex + 1} -->
    <div class="page content-page">
        ${page.date && settings.showDates ? `
            <div class="date-header">
                <span>${new Date(page.date).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
            </div>
        ` : ''}
        
        <div class="messages-container">
            ${page.messages.map((message: WhatsAppMessage, index: number) => {
              const isOwn = participants.length > 0 && message.sender === participants[0];
              const previousMessage = index > 0 ? page.messages[index - 1] : null;
              const showSender = !isOwn && (!previousMessage || previousMessage.sender !== message.sender);
              
              return `
                <div class="message ${isOwn ? 'own' : ''}">
                    <div>
                        ${showSender ? `<div class="sender">${message.sender}</div>` : ''}
                        <div class="message-bubble">
                            ${message.type === 'media' && message.mediaUrl ? `
                                <div class="media-container">
                                    ${message.mediaType === 'image' ? `
                                        <!-- Afficher l'image directement -->
                                        <img src="${getPlaceholderImage('image', message.fileName || 'Image')}" 
                                             alt="${message.fileName || 'Image'}" 
                                             class="media-image" 
                                             onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
                                        <div style="display:none; padding: 10mm; background: #e5e7eb; border-radius: 2mm;">
                                            <div style="font-weight: bold;">📷 ${message.fileName || 'Image'}</div>
                                            <div style="font-size: 8pt; color: #6b7280; margin-top: 2mm;">Image non disponible</div>
                                        </div>
                                    ` : `
                                        <!-- QR Code pour vidéos et audios -->
                                        <div class="media-qr-container">
                                            <img src="${generateQRCodeUrl(message.mediaUrl)}" 
                                                 alt="QR Code" 
                                                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjZjNmNGY2Ii8+CjxyZWN0IHg9IjIiIHk9IjIiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMzNzQxNTEiLz4KPC9zdmc+'" />
                                            <div class="media-info">
                                                <div class="media-type">
                                                    ${message.mediaType === 'video' ? '🎥 Vidéo' : 
                                                      message.mediaType === 'audio' ? '🎵 Audio' : '📄 Fichier'}
                                                </div>
                                                ${message.fileName ? `<div class="media-filename">${message.fileName}</div>` : ''}
                                                <div class="media-instruction">QR code pour accéder au fichier</div>
                                            </div>
                                        </div>
                                    `}
                                </div>
                                ${message.content ? `<div class="message-content">${message.content.replace(/\n/g, '<br>')}</div>` : ''}
                            ` : `
                                <div class="message-content">${message.content.replace(/\n/g, '<br>')}</div>
                            `}
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
        </div>
        
        <div class="page-number">${pageIndex + (settings.preface ? 2 : 1) + (settings.dedication ? 1 : 0)}</div>
    </div>
    `).join('')}
</body>
</html>
    `;
  };

  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      const htmlContent = generatePDFContent();
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // Ouvrir dans une nouvelle fenêtre pour impression/sauvegarde PDF
      const printWindow = window.open(url, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print();
          }, 1000);
        };
      }
      
      URL.revokeObjectURL(url);
      
      toast({
        title: "PDF généré !",
        description: "Utilisez Ctrl+P pour sauvegarder en PDF dans la nouvelle fenêtre",
      });
    } catch (error) {
      toast({
        title: "Erreur d'export",
        description: "Impossible de générer le PDF",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Export PDF Professionnel
        </CardTitle>
        <CardDescription>
          Générez un PDF haute qualité avec images intégrées et QR codes pour les médias
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">✨ Améliorations des médias :</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 📷 Images placeholder avec noms de fichiers</li>
              <li>• 🎥 QR codes pour vidéos avec accès direct</li>
              <li>• 🎵 QR codes pour fichiers audio</li>
              <li>• Format A4 professionnel avec pagination</li>
              <li>• 20 messages par page pour un meilleur rendu</li>
              <li>• Détection automatique des fichiers attachés</li>
            </ul>
          </div>

          <Button 
            onClick={exportToPDF}
            disabled={isExporting}
            className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
          >
            {isExporting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Génération en cours...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Générer le PDF avec médias
              </div>
            )}
          </Button>
          
          <p className="text-xs text-gray-600 text-center">
            Le PDF s'ouvrira dans une nouvelle fenêtre. Utilisez Ctrl+P puis "Enregistrer en PDF" pour le sauvegarder.
          </p>
        </div>
      </CardContent>
    </Card>
  );
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

const formatDateRange = (messages: WhatsAppMessage[]) => {
  if (messages.length === 0) return '';
  
  const firstDate = messages[0].timestamp;
  const lastDate = messages[messages.length - 1].timestamp;
  
  if (firstDate.toDateString() === lastDate.toDateString()) {
    return firstDate.toLocaleDateString('fr-FR');
  }
  
  return `Du ${firstDate.toLocaleDateString('fr-FR')} au ${lastDate.toLocaleDateString('fr-FR')}`;
};
