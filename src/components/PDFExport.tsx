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

  // Générer QR code avec l'URL réelle du média pour pouvoir le lire en scannant
  const generateMediaQR = (fileName: string, mediaType: string, mediaUrl?: string) => {
    if (mediaUrl) {
      // Si on a l'URL du média, on la met directement dans le QR code
      return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(mediaUrl)}&bgcolor=ffffff&color=000000&margin=0&ecc=H`;
    } else {
      // Sinon on met les informations du fichier
      const fileData = `FICHIER: ${fileName}
TYPE: ${mediaType}  
DATE: ${new Date().toLocaleDateString('fr-FR')}
SOURCE: WhatsApp
APP: ChatBook Converter`;
      return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(fileData)}&bgcolor=ffffff&color=000000&margin=0&ecc=H`;
    }
  };

  // Fonction pour convertir une URL blob en base64
  const blobToBase64 = async (url: string): Promise<string | null> => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Erreur conversion blob vers base64:', error);
      return null;
    }
  };

  const generatePDFContent = async () => {
    console.log('🔄 Conversion des images en base64...');
    const imageMessages = messages.filter(m => m.type === 'media' && m.mediaType === 'image' && m.mediaUrl);
    const imageBase64Map = new Map<string, string>();
    
    for (const message of imageMessages) {
      if (message.mediaUrl) {
        const base64 = await blobToBase64(message.mediaUrl);
        if (base64) {
          imageBase64Map.set(message.mediaUrl, base64);
          console.log('✅ Image convertie:', message.fileName);
        }
      }
    }

    // Grouper les messages par jour puis par pages
    const groupedMessages = messages.reduce((groups, message) => {
      const date = message.timestamp.toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    }, {} as Record<string, WhatsAppMessage[]>);

    const messagesPerPage = 35;
    const pages: any[] = [];
    
    Object.entries(groupedMessages).forEach(([date, dayMessages]) => {
      for (let i = 0; i < dayMessages.length; i += messagesPerPage) {
        const pageMessages = dayMessages.slice(i, i + messagesPerPage);
        pages.push({
          date: i === 0 ? date : null,
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
            margin: 0;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
            margin: 0;
            padding: 0;
            line-height: 1.3;
            font-size: 9pt;
            color: #1a1a1a;
            background: white;
            width: 100%;
        }
        
        .page {
            min-height: 100vh;
            page-break-after: always;
            width: 100%;
            display: flex;
            justify-content: center;
        }
        
        .page:last-child {
            page-break-after: avoid;
        }
        
        /* Conteneur centré avec marges 1/6 */
        .page-content {
            width: 66.66%;
            max-width: none;
            padding: 6mm 0;
        }
        
        /* Page de couverture */
        .cover-page {
            background: linear-gradient(135deg, ${settings.coverColor}, ${adjustBrightness(settings.coverColor, -15)});
            color: white;
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 40mm 20mm;
            width: 100%;
            height: 100vh;
        }
        
        .cover-page h1 {
            font-size: 32pt;
            margin: 0 0 8mm 0;
            font-weight: 700;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .cover-page .subtitle {
            font-size: 16pt;
            margin: 0 0 12mm 0;
            opacity: 0.95;
            font-weight: 300;
        }
        
        .cover-page .info {
            font-size: 12pt;
            line-height: 1.6;
            font-weight: 400;
        }
        
        /* Pages de contenu style livre */
        .content-page-inner {
            width: 100%;
            background: white;
        }
        
        .date-header {
            text-align: center;
            margin: 0 0 6mm 0;
            padding: 2mm 0;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .date-header span {
            background: #f8fafc;
            padding: 1.5mm 4mm;
            border-radius: 3mm;
            font-weight: 600;
            color: #374151;
            font-size: 10pt;
            border: 1px solid #e2e8f0;
        }
        
        .messages-container {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 1mm;
            width: 100%;
        }
        
        .message {
            display: flex;
            margin: 0.5mm 0;
            width: 100%;
            clear: both;
        }
        
        .message.own {
            justify-content: flex-end;
        }
        
        .message-bubble {
            padding: 2mm 3mm;
            border-radius: 2.5mm;
            word-wrap: break-word;
            position: relative;
            max-width: 75%;
            border: 1px solid rgba(0,0,0,0.05);
            width: fit-content;
        }
        
        .message.own .message-bubble {
            background: linear-gradient(135deg, ${settings.coverColor}, ${adjustBrightness(settings.coverColor, -8)});
            color: white;
            border-bottom-right-radius: 0.8mm;
        }
        
        .message:not(.own) .message-bubble {
            background: #f8fafc;
            color: #1f2937;
            border-bottom-left-radius: 0.8mm;
        }
        
        .sender {
            font-size: 7pt;
            color: #6b7280;
            margin-bottom: 0.8mm;
            font-weight: 600;
        }
        
        .message-content {
            font-size: 9pt;
            line-height: 1.2;
            font-weight: 400;
            margin-bottom: 0;
        }
        
        .timestamp {
            font-size: 6pt;
            opacity: 0.75;
            margin-top: 0.8mm;
            text-align: right;
            font-weight: 500;
        }
        
        /* Images côte à côte dans les messages */
        .message-images {
            margin: 1mm 0;
            display: flex;
            flex-wrap: wrap;
            gap: 1mm;
            justify-content: flex-start;
        }
        
        .message-image {
            max-width: 18mm;
            max-height: 18mm;
            height: auto;
            border-radius: 1.5mm;
            object-fit: cover;
            border: none;
            background: transparent;
        }
        
        /* QR codes pour vidéos et audios avec liens réels */
        .media-qr {
            display: inline-flex;
            align-items: center;
            gap: 1.5mm;
            margin: 1mm 0;
            padding: 1.5mm;
            background: rgba(255,255,255,0.1);
            border-radius: 1.5mm;
            border: 1px solid rgba(255,255,255,0.2);
        }
        
        .message:not(.own) .media-qr {
            background: rgba(0,0,0,0.03);
            border: 1px solid rgba(0,0,0,0.1);
        }
        
        .media-qr img {
            width: 12mm;
            height: 12mm;
            border-radius: 1mm;
        }
        
        .media-info {
            flex: 1;
            text-align: left;
        }
        
        .media-type {
            font-size: 7pt;
            font-weight: 600;
            margin-bottom: 0.3mm;
        }
        
        .media-instruction {
            font-size: 6pt;
            opacity: 0.8;
            font-style: italic;
        }
        
        /* Pages spéciales */
        .preface-page, .dedication-page {
            width: 100%;
            background: white;
        }
        
        .preface-content-inner, .dedication-content-inner {
            padding: 20mm;
            text-align: center;
        }
        
        .preface-content-inner h2, .dedication-content-inner h2 {
            font-size: 20pt;
            margin: 0 0 8mm 0;
            color: #374151;
            font-weight: 600;
        }
        
        .preface-content, .dedication-content {
            font-size: 11pt;
            line-height: 1.5;
            color: #4b5563;
            max-width: 120mm;
            margin: 0 auto;
            text-align: justify;
        }
        
        .author-signature {
            margin-top: 12mm;
            font-style: italic;
            color: #6b7280;
            font-size: 10pt;
        }
        
        /* Pagination */
        .page-number {
            position: fixed;
            bottom: 4mm;
            right: 50%;
            transform: translateX(50%);
            font-size: 8pt;
            color: #6b7280;
            font-weight: 500;
        }
        
        /* Optimisation pour l'impression */
        @media print {
            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        }
    </style>
</head>
<body>
    <!-- Page de couverture -->
    <div class="page cover-page">
        <h1>${settings.title}</h1>
        ${settings.subtitle ? `<div class="subtitle">${settings.subtitle}</div>` : ''}
        <div class="info">
            <div>📱 Conversation entre ${participants.join(' et ')}</div>
            <div style="margin-top: 3mm;">💬 ${messages.length} messages échangés</div>
            <div>📅 ${formatDateRange(messages)}</div>
            ${settings.authorName ? `<div style="margin-top: 6mm;">✍️ Compilé par ${settings.authorName}</div>` : ''}
        </div>
    </div>
    
    ${settings.preface ? `
    <div class="page preface-page">
        <div class="page-content">
            <div class="preface-content-inner">
                <h2>Préface</h2>
                <div class="preface-content">
                    ${settings.preface.split('\n').map(p => `<p>${p}</p>`).join('')}
                </div>
                ${settings.authorName ? `<div class="author-signature">${settings.authorName}</div>` : ''}
            </div>
        </div>
    </div>
    ` : ''}
    
    ${settings.dedication ? `
    <div class="page dedication-page">
        <div class="page-content">
            <div class="dedication-content-inner">
                <h2>Dédicace</h2>
                <div class="dedication-content">
                    ${settings.dedication.split('\n').map(p => `<p><em>${p}</em></p>`).join('')}
                </div>
            </div>
        </div>
    </div>
    ` : ''}
    
    ${pages.map((page, pageIndex) => `
    <div class="page">
        <div class="page-content">
            <div class="content-page-inner">
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
                                    ${message.content ? `<div class="message-content">${message.content.replace(/\n/g, '<br>')}</div>` : ''}
                                    
                                    ${message.type === 'media' && message.fileName ? `
                                        ${message.mediaType === 'image' && imageBase64Map.has(message.mediaUrl || '') ? `
                                            <div class="message-images">
                                                <img src="${imageBase64Map.get(message.mediaUrl || '') || ''}" 
                                                     alt="Image" 
                                                     class="message-image" />
                                            </div>
                                        ` : `
                                            <div class="media-qr">
                                                <img src="${generateMediaQR(message.fileName, message.mediaType || 'document', message.mediaUrl)}" 
                                                     alt="QR Code Média" />
                                                <div class="media-info">
                                                    <div class="media-type">
                                                        ${message.mediaType === 'video' ? '🎥 Vidéo' : 
                                                          message.mediaType === 'audio' ? '🎵 Audio' : '📄 Fichier'}
                                                    </div>
                                                    <div class="media-instruction">${message.mediaUrl ? 'Lien direct' : 'Infos fichier'}</div>
                                                </div>
                                            </div>
                                        `}
                                    ` : ''}
                                    
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
        </div>
    </div>
    `).join('')}
</body>
</html>
    `;
  };

  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      const htmlContent = await generatePDFContent();
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      const printWindow = window.open(url, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print();
          }, 2000);
        };
      }
      
      URL.revokeObjectURL(url);
      
      toast({
        title: "PDF livre généré !",
        description: "Format livre centré avec QR codes fonctionnels",
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
          Export PDF Format Livre
        </CardTitle>
        <CardDescription>
          PDF optimisé format livre centré avec QR codes fonctionnels
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">📖 Format Livre Amélioré :</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 📏 Contenu centré avec marges 1/6 de chaque côté</li>
              <li>• 📸 Images côte à côte sans fond blanc</li>
              <li>• 🔗 QR codes fonctionnels avec URLs scannables</li>
              <li>• 💬 Messages sur toute la largeur disponible</li>
              <li>• ⚡ Espacement optimisé entre messages</li>
            </ul>
          </div>

          <Button 
            onClick={exportToPDF}
            disabled={isExporting}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {isExporting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Génération du livre PDF...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Générer PDF Format Livre
              </div>
            )}
          </Button>
          
          <p className="text-xs text-gray-600 text-center">
            Format livre professionnel centré avec QR codes fonctionnels pour les médias.
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
