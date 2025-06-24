
import React, { useState } from 'react';
import { Image, Video, QrCode, Music, FileText, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface MediaDisplayProps {
  mediaUrl?: string;
  mediaType: 'image' | 'video' | 'audio' | 'document';
  fileName?: string;
  className?: string;
}

export const MediaDisplay: React.FC<MediaDisplayProps> = ({
  mediaUrl,
  mediaType,
  fileName,
  className = ""
}) => {
  const [imageError, setImageError] = useState(false);

  // Générer QR code avec informations utiles et scannables
  const generateFileInfoQR = () => {
    const currentDate = new Date().toLocaleDateString('fr-FR');
    const fileInfo = `📱 Fichier WhatsApp
📄 Nom: ${fileName || 'fichier-media'}
🎯 Type: ${mediaType}
📅 Extrait le: ${currentDate}
💬 Source: Conversation WhatsApp
ℹ️ Fichier multimédia sauvegardé`;
    
    return `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(fileInfo)}&bgcolor=ffffff&color=000000&margin=1`;
  };

  console.log('🖼️ Affichage média:', { mediaType, fileName, mediaUrl: mediaUrl ? 'disponible' : 'manquant' });

  const renderMedia = () => {
    switch (mediaType) {
      case 'image':
        if (mediaUrl && !imageError) {
          return (
            <div className={`inline-block ${className}`}>
              <img 
                src={mediaUrl}
                alt={fileName || 'Image'}
                className="w-20 h-20 object-cover rounded-lg shadow-sm border border-gray-100 mr-2 mb-2"
                onError={() => {
                  console.log('❌ Erreur de chargement image:', mediaUrl);
                  setImageError(true);
                }}
                onLoad={() => console.log('✅ Image chargée avec succès:', fileName)}
                loading="lazy"
              />
            </div>
          );
        } else {
          return (
            <div className={`inline-block bg-gray-100 rounded-lg p-2 border mr-2 mb-2 ${className}`}>
              <div className="flex items-center gap-2">
                <Image className="w-4 h-4 text-gray-500" />
                <span className="text-xs text-gray-600">Image</span>
              </div>
            </div>
          );
        }
      
      case 'video':
        return (
          <div className={`inline-block bg-purple-50 rounded-lg p-3 border border-purple-200 mr-2 mb-2 max-w-xs ${className}`}>
            <div className="flex items-start gap-2 mb-2">
              <div className="bg-purple-500 p-1 rounded">
                <Video className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-purple-900">🎥 Vidéo</p>
                <p className="text-xs text-purple-700 break-all">{fileName || 'video.mp4'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-white p-2 rounded">
              <img 
                src={generateFileInfoQR()} 
                alt="QR Code vidéo"
                className="w-12 h-12 border border-gray-200 rounded"
              />
              <div className="flex-1">
                <p className="text-xs font-medium flex items-center gap-1">
                  <QrCode className="w-3 h-3" />
                  Info vidéo
                </p>
                <p className="text-xs text-gray-600">Scannable</p>
              </div>
            </div>
          </div>
        );
      
      case 'audio':
        if (mediaUrl) {
          return (
            <div className={`inline-block bg-green-50 rounded-lg p-3 border border-green-200 mr-2 mb-2 max-w-xs ${className}`}>
              <div className="flex items-start gap-2 mb-2">
                <div className="bg-green-500 p-1 rounded">
                  <Music className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900">🎵 Audio</p>
                  <p className="text-xs text-green-700 break-all">{fileName || 'audio.mp3'}</p>
                </div>
              </div>
              
              <audio 
                controls 
                className="w-full mb-2 h-8"
                style={{ height: '32px' }}
              >
                <source src={mediaUrl} />
                Audio non supporté
              </audio>
              
              <div className="flex items-center gap-2 bg-white p-2 rounded">
                <img 
                  src={generateFileInfoQR()} 
                  alt="QR Code audio"
                  className="w-10 h-10 border border-gray-200 rounded"
                />
                <div className="flex-1">
                  <p className="text-xs text-gray-600">Info audio scannable</p>
                </div>
              </div>
            </div>
          );
        } else {
          return (
            <div className={`inline-block bg-green-50 rounded-lg p-2 border border-green-200 mr-2 mb-2 ${className}`}>
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-green-500" />
                <span className="text-xs text-green-700">Audio</span>
              </div>
            </div>
          );
        }
      
      default:
        return (
          <div className={`inline-block bg-gray-50 rounded-lg p-3 border border-gray-200 mr-2 mb-2 max-w-xs ${className}`}>
            <div className="flex items-start gap-2 mb-2">
              <div className="bg-gray-500 p-1 rounded">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">📄 Document</p>
                <p className="text-xs text-gray-700 break-all">{fileName || 'document'}</p>
              </div>
            </div>
            
            {mediaUrl ? (
              <>
                <a 
                  href={mediaUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white p-2 rounded hover:bg-gray-50 transition-colors mb-2"
                >
                  <ExternalLink className="w-4 h-4 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-xs font-medium">Ouvrir</p>
                  </div>
                </a>
                
                <div className="flex items-center gap-2 bg-white p-2 rounded">
                  <img 
                    src={generateFileInfoQR()} 
                    alt="QR Code document"
                    className="w-10 h-10 border border-gray-200 rounded"
                  />
                  <div className="flex-1">
                    <p className="text-xs text-gray-600">Info document</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white p-2 rounded">
                <p className="text-xs text-gray-600">Non disponible</p>
              </div>
            )}
          </div>
        );
    }
  };

  return renderMedia();
};
