import React, { useState, useEffect } from 'react';
import { Image, Video, QrCode, Music, FileText, ExternalLink, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { SimpleMediaUpload } from './SimpleMediaUpload';
import { useToast } from '@/hooks/use-toast';

interface MediaDisplayProps {
  mediaUrl?: string;
  mediaType: 'image' | 'video' | 'audio' | 'document';
  fileName?: string;
  className?: string;
  file?: File;
}

export const MediaDisplay: React.FC<MediaDisplayProps> = ({
  mediaUrl,
  mediaType,
  fileName,
  className = "",
  file
}) => {
  const [imageError, setImageError] = useState(false);
  const [providedUrl, setProvidedUrl] = useState<string | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [fileBlob, setFileBlob] = useState<Blob | null>(null);
  const { toast } = useToast();

  // Récupérer le blob du fichier si disponible
  useEffect(() => {
    const getFileBlob = async () => {
      if (mediaUrl && mediaUrl.startsWith('blob:')) {
        try {
          const response = await fetch(mediaUrl);
          const blob = await response.blob();
          setFileBlob(blob);
        } catch (error) {
          console.error('Erreur lors de la récupération du blob:', error);
        }
      }
    };

    getFileBlob();
  }, [mediaUrl]);

  const handleUrlProvided = (url: string) => {
    setProvidedUrl(url);
    setShowUploadDialog(false);
    
    toast({
      title: "✅ Fichier accessible !",
      description: "Votre média est maintenant hébergé sur GitHub",
    });
  };

  // Générer QR code avec l'URL fournie par l'utilisateur ou les infos du fichier
  const generateMediaQR = () => {
    const finalUrl = providedUrl || mediaUrl;
    
    if (finalUrl && !finalUrl.startsWith('blob:')) {
      // URL réelle - redirection directe
      return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(finalUrl)}&format=png&ecc=M`;
    } else {
      // Pas d'URL réelle - infos du fichier
      const mediaInfo = {
        nom: fileName || 'Fichier média',
        type: mediaType === 'image' ? 'Photo' : 
              mediaType === 'video' ? 'Vidéo' : 
              mediaType === 'audio' ? 'Audio' : 'Document',
        date: new Date().toLocaleDateString('fr-FR'),
        source: 'Conversation WhatsApp'
      };
      
      const qrText = `📱 Média WhatsApp
📁 ${mediaInfo.nom}
🎯 ${mediaInfo.type}
📅 ${mediaInfo.date}
💬 ${mediaInfo.source}

Pour rendre ce fichier accessible par QR code, utilisez le bouton "Rendre accessible" ci-dessous.`;

      return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrText)}&format=png&ecc=M`;
    }
  };

  console.log('🖼️ Affichage média:', { 
    mediaType, 
    fileName, 
    mediaUrl: mediaUrl ? 'disponible' : 'manquant',
    providedUrl: providedUrl ? 'fourni' : 'non fourni'
  });

  const renderMedia = () => {
    switch (mediaType) {
      case 'image':
        if (mediaUrl && !imageError) {
          return (
            <div className={`inline-block mr-1 mb-1 ${className}`}>
              <img 
                src={providedUrl || mediaUrl}
                alt={fileName || 'Image'}
                className="w-20 h-20 object-cover rounded-lg shadow-sm border border-gray-100"
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
            <div className={`inline-block bg-gray-100 rounded-lg p-2 border mr-1 mb-1 ${className}`}>
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
            
            {/* Bouton pour rendre accessible */}
            {!providedUrl && (
              <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                <DialogTrigger asChild>
                  <Button 
                    size="sm"
                    className="w-full mb-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <Upload className="w-3 h-3 mr-1" />
                    Héberger sur GitHub
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Héberger votre vidéo sur GitHub</DialogTitle>
                  </DialogHeader>
                  <SimpleMediaUpload 
                    onUrlProvided={handleUrlProvided}
                    fileName={fileName}
                    fileBlob={fileBlob}
                  />
                </DialogContent>
              </Dialog>
            )}
            
            {providedUrl && (
              <div className="mb-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800">
                ✅ Vidéo hébergée sur GitHub Pages
                <br />
                <a href={providedUrl} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">
                  Voir sur GitHub →
                </a>
              </div>
            )}
            
            <div className="flex items-center gap-2 bg-white p-2 rounded">
              <img 
                src={generateMediaQR()} 
                alt="QR Code vidéo"
                className="w-16 h-16 border border-gray-200 rounded"
              />
              <div className="flex-1">
                <p className="text-xs font-medium flex items-center gap-1">
                  <QrCode className="w-3 h-3" />
                  {providedUrl ? 'Lien GitHub' : 'Info vidéo'}
                </p>
                <p className="text-xs text-gray-600">
                  {providedUrl ? 'Scanner pour voir' : 'Détails du fichier'}
                </p>
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
                <source src={providedUrl || mediaUrl} />
                Audio non supporté
              </audio>

              {!providedUrl && (
                <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm"
                      className="w-full mb-2 bg-blue-600 hover:bg-blue-700"
                    >
                      <Upload className="w-3 h-3 mr-1" />
                      Héberger sur GitHub
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Héberger votre audio sur GitHub</DialogTitle>
                    </DialogHeader>
                    <SimpleMediaUpload 
                      onUrlProvided={handleUrlProvided}
                      fileName={fileName}
                      fileBlob={fileBlob}
                    />
                  </DialogContent>
                </Dialog>
              )}
              
              {providedUrl && (
                <div className="mb-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800">
                  ✅ Audio hébergé sur GitHub Pages
                  <br />
                  <a href={providedUrl} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">
                    Voir sur GitHub →
                  </a>
                </div>
              )}
              
              <div className="flex items-center gap-2 bg-white p-2 rounded">
                <img 
                  src={generateMediaQR()} 
                  alt="QR Code audio"
                  className="w-12 h-12 border border-gray-200 rounded"
                />
                <div className="flex-1">
                  <p className="text-xs font-medium">
                    {providedUrl ? 'Lien GitHub' : 'Info audio'}
                  </p>
                  <p className="text-xs text-gray-600">
                    {providedUrl ? 'Scanner pour écouter' : 'Détails du fichier'}
                  </p>
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

            {!providedUrl && (
              <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                <DialogTrigger asChild>
                  <Button 
                    size="sm"
                    className="w-full mb-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <Upload className="w-3 h-3 mr-1" />
                    Héberger sur GitHub
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Héberger votre document sur GitHub</DialogTitle>
                  </DialogHeader>
                  <SimpleMediaUpload 
                    onUrlProvided={handleUrlProvided}
                    fileName={fileName}
                    fileBlob={fileBlob}
                  />
                </DialogContent>
              </Dialog>
            )}
            
            {providedUrl && (
              <div className="mb-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800">
                ✅ Document hébergé sur GitHub Pages
                <br />
                <a href={providedUrl} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">
                  Voir sur GitHub →
                </a>
              </div>
            )}
            
            <div className="flex items-center gap-2 bg-white p-2 rounded">
              <img 
                src={generateMediaQR()} 
                alt="QR Code document"
                className="w-12 h-12 border border-gray-200 rounded"
              />
              <div className="flex-1">
                <p className="text-xs font-medium">
                  {providedUrl ? 'Lien GitHub' : 'Info document'}
                </p>
                <p className="text-xs text-gray-600">
                  {providedUrl ? 'Scanner pour ouvrir' : 'Détails du fichier'}
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  return renderMedia();
};
