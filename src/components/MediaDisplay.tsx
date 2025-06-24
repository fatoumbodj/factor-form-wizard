
import React, { useState } from 'react';
import { Image, Video, QrCode, ExternalLink, Music, FileText } from 'lucide-react';
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

  // Générer QR code
  const generateQRCodeUrl = (url: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}&bgcolor=ffffff&color=000000`;
  };

  console.log('Affichage média:', { mediaType, fileName, mediaUrl });

  const renderMedia = () => {
    switch (mediaType) {
<<<<<<< HEAD
  case 'image':
  return (
    <div className={`relative max-w-sm ${className}`}>
      <img 
        src={mediaUrl}
        alt={fileName || 'Image'}
        className="w-full h-auto max-h-64 object-cover rounded-lg shadow-md border border-gray-200"
        onError={() => {
          console.warn('Impossible de charger l’image.');
          setImageError(true);
        }}
        loading="lazy"
      />
      <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
        📷 {fileName ? fileName.substring(0, 15) + '...' : 'Photo'}
      </div>
    </div>
  );

        //       <Dialog>
        //         <DialogTrigger asChild>
        //           <Button
        //             variant="outline"
        //             size="sm"
        //             className="absolute top-2 right-2 bg-white bg-opacity-90 hover:bg-opacity-100"
        //           >
        //             <QrCode className="w-4 h-4" />
        //           </Button>
        //         </DialogTrigger>
        //         <DialogContent>
        //           <DialogHeader>
        //             <DialogTitle>QR Code - Accès à l'image</DialogTitle>
        //           </DialogHeader>
        //           <div className="flex flex-col items-center gap-4">
        //             <img 
        //               src={generateQRCodeUrl(mediaUrl)} 
        //               alt="QR Code"
        //               className="w-48 h-48 border border-gray-200 rounded"
        //             />
        //             <p className="text-sm text-gray-600 text-center">
        //               Scannez pour accéder à l'image originale
        //             </p>
        //           </div>
        //         </DialogContent>
        //       </Dialog>
        //     </div>
        //   </div>
        // );
=======
      case 'image':
        if (mediaUrl && !imageError) {
          return (
            <div className={`relative max-w-sm ${className}`}>
              <div className="relative">
                <img 
                  src={mediaUrl}
                  alt={fileName || 'Image'}
                  className="w-full h-auto max-h-64 object-cover rounded-lg shadow-md border border-gray-200"
                  onError={() => {
                    console.log('Erreur de chargement image:', mediaUrl);
                    setImageError(true);
                  }}
                  onLoad={() => console.log('Image chargée avec succès:', mediaUrl)}
                  loading="lazy"
                />
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                  📷 {fileName ? fileName.substring(0, 15) + '...' : 'Photo'}
                </div>
                
                {mediaUrl && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2 bg-white bg-opacity-90 hover:bg-opacity-100"
                      >
                        <QrCode className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>QR Code - Accès à l'image</DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-col items-center gap-4">
                        <img 
                          src={generateQRCodeUrl(mediaUrl)} 
                          alt="QR Code"
                          className="w-48 h-48 border border-gray-200 rounded"
                        />
                        <p className="text-sm text-gray-600 text-center">
                          Scannez pour accéder à l'image originale
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          );
        } else {
          // Affichage pour image sans URL ou en erreur
          return (
            <div className={`bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200 max-w-sm ${className}`}>
              <div className="flex items-start gap-3">
                <div className="bg-blue-500 p-2 rounded-lg">
                  <Image className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-blue-900">📷 Photo</p>
                  <p className="text-sm text-blue-700 break-all">{fileName || 'image.jpg'}</p>
                  <p className="text-xs text-blue-600 mt-1">Image non disponible dans l'export</p>
                </div>
              </div>
            </div>
          );
        }
>>>>>>> 9f8f4a767cd577167b3efb7f9fa93d76ddd62eb9
      
      case 'video':
        if (mediaUrl) {
          return (
            <div className={`bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200 max-w-sm ${className}`}>
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-purple-500 p-2 rounded-lg">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-purple-900">🎥 Vidéo</p>
                  <p className="text-sm text-purple-700 break-all">{fileName || 'video.mp4'}</p>
                </div>
              </div>
              
              <video 
                controls 
                className="w-full rounded-lg"
                style={{ maxHeight: '200px' }}
              >
                <source src={mediaUrl} type="video/mp4" />
                Votre navigateur ne supporte pas les vidéos.
              </video>
            </div>
          );
        } else {
          return (
            <div className={`bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200 max-w-sm ${className}`}>
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-purple-500 p-2 rounded-lg">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-purple-900">🎥 Vidéo</p>
                  <p className="text-sm text-purple-700 break-all">{fileName || 'video.mp4'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-white p-3 rounded-lg">
                <img 
                  src={generateQRCodeUrl('https://example.com/video')} 
                  alt="QR Code vidéo"
                  className="w-16 h-16 border border-gray-200 rounded"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">Vidéo non disponible</p>
                  <p className="text-xs text-gray-600">Fichier non extrait</p>
                </div>
              </div>
            </div>
          );
        }
      
      case 'audio':
        if (mediaUrl) {
          return (
            <div className={`bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200 max-w-sm ${className}`}>
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-green-500 p-2 rounded-lg">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-green-900">🎵 Audio</p>
                  <p className="text-sm text-green-700 break-all">{fileName || 'audio.mp3'}</p>
                </div>
              </div>
              
              <audio 
                controls 
                className="w-full"
              >
                <source src={mediaUrl} />
                Votre navigateur ne supporte pas l'audio.
              </audio>
            </div>
          );
        } else {
          return (
            <div className={`bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200 max-w-sm ${className}`}>
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-green-500 p-2 rounded-lg">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-green-900">🎵 Audio</p>
                  <p className="text-sm text-green-700 break-all">{fileName || 'audio.mp3'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-white p-3 rounded-lg">
                <img 
                  src={generateQRCodeUrl('https://example.com/audio')} 
                  alt="QR Code audio"
                  className="w-16 h-16 border border-gray-200 rounded"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">Audio non disponible</p>
                  <p className="text-xs text-gray-600">Fichier non extrait</p>
                </div>
              </div>
            </div>
          );
        }
      
      default:
        return (
          <div className={`bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200 max-w-sm ${className}`}>
            <div className="flex items-start gap-3 mb-3">
              <div className="bg-gray-500 p-2 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">📄 Document</p>
                <p className="text-sm text-gray-700 break-all">{fileName || 'document'}</p>
              </div>
            </div>
            
            {mediaUrl ? (
              <a 
                href={mediaUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ExternalLink className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Ouvrir le document</p>
                  <p className="text-xs text-gray-600">Cliquez pour télécharger</p>
                </div>
              </a>
            ) : (
              <div className="flex items-center gap-3 bg-white p-3 rounded-lg">
                <img 
                  src={generateQRCodeUrl('https://example.com/document')} 
                  alt="QR Code document"
                  className="w-16 h-16 border border-gray-200 rounded"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">Document non disponible</p>
                  <p className="text-xs text-gray-600">Fichier non extrait</p>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="my-2">
      {renderMedia()}
    </div>
  );
};
