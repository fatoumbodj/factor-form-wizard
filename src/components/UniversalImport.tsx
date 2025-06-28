
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import JSZip from 'jszip';
import { parseWhatsAppChat } from '../utils/whatsappParser';
import { WhatsAppMessage } from '../types/Message';
import { Upload, FileText, Archive, AlertCircle, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface UniversalImportProps {
  onMessagesImported: (messages: WhatsAppMessage[], participants: string[]) => void;
}

export const UniversalImport: React.FC<UniversalImportProps> = ({ onMessagesImported }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState('');
  const [githubUsername, setGithubUsername] = useState('fatou mbodj');

  const processZipFile = async (file: File): Promise<{ chatText: string; mediaFiles: Map<string, string> }> => {
    const zip = new JSZip();
    const zipContent = await zip.loadAsync(file);
    const mediaFiles = new Map<string, string>();
    let chatText = '';

    setProgress('Extraction des fichiers du ZIP...');
    console.log('📦 Contenu du ZIP:', Object.keys(zipContent.files));

    for (const [fileName, zipEntry] of Object.entries(zipContent.files)) {
      if (zipEntry.dir) continue;

      console.log('🔍 Traitement du fichier:', fileName);

      // Fichier de chat WhatsApp
      if (fileName.endsWith('.txt')) {
        console.log('💬 Fichier de chat potentiel trouvé:', fileName);
        const content = await zipEntry.async('text');
        if (content.trim()) {
          chatText = content;
          console.log('✅ Contenu de chat valide trouvé, longueur:', content.length);
        }
      }
      // Fichiers média - on stocke juste les noms pour créer des QR codes d'info
      else if (fileName.match(/\.(jpg|jpeg|png|gif|webp|bmp|tiff|svg|mp4|avi|mov|webm|mkv|mp3|wav|opus|ogg|aac|m4a|pdf|doc|docx)$/i)) {
        console.log('📸 Fichier média trouvé:', fileName);
        try {
          const blob = await zipEntry.async('blob');
          const mediaUrl = URL.createObjectURL(blob);
          
          const cleanFileName = fileName.replace(/^.*[\\\/]/, '');
          mediaFiles.set(cleanFileName, mediaUrl);
          mediaFiles.set(fileName, mediaUrl);
          
          console.log('✅ Média extrait:', cleanFileName, 'URL:', mediaUrl);
        } catch (error) {
          console.error('❌ Erreur lors de l\'extraction du média:', fileName, error);
        }
      }
    }

    console.log('🎯 Résultats extraction:');
    console.log('- Chat text length:', chatText.length);
    console.log('- Médias extraits:', mediaFiles.size);
    console.log('- Liste des médias:', Array.from(mediaFiles.keys()));

    return { chatText, mediaFiles };
  };

  const processFile = async (file: File) => {
    if (!githubUsername.trim()) {
      setProgress('Erreur: Veuillez entrer votre nom d\'utilisateur GitHub');
      return;
    }

    setIsProcessing(true);
    setProgress('Début du traitement...');

    try {
      let chatText = '';
      let mediaFiles = new Map<string, string>();

      if (file.name.endsWith('.zip')) {
        const result = await processZipFile(file);
        chatText = result.chatText;
        mediaFiles = result.mediaFiles;
      } else if (file.name.endsWith('.txt')) {
        chatText = await file.text();
      } else {
        throw new Error('Format de fichier non supporté. Utilisez un fichier .txt ou .zip');
      }

      if (!chatText.trim()) {
        throw new Error('Aucun contenu de chat trouvé dans le fichier');
      }

      setProgress('Analyse du chat...');
      console.log('🔄 Parsing avec', mediaFiles.size, 'médias disponibles');
      
      // Stocker le nom d'utilisateur GitHub pour utilisation ultérieure
      localStorage.setItem('githubUsername', githubUsername);
      
      const { messages, participants } = parseWhatsAppChat(chatText, mediaFiles);

      if (messages.length === 0) {
        throw new Error('Aucun message valide trouvé dans le chat');
      }

      console.log('✅ Traitement terminé:', messages.length, 'messages,', participants.length, 'participants');
      onMessagesImported(messages, participants);

    } catch (error) {
      console.error('❌ Erreur de traitement:', error);
      setProgress(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      processFile(acceptedFiles[0]);
    }
  }, [githubUsername]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/zip': ['.zip']
    },
    multiple: false
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Configuration GitHub simple */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Github className="w-5 h-5 text-blue-600" />
          <h3 className="font-medium text-blue-900">Configuration GitHub</h3>
        </div>
        <div className="space-y-2">
          <Label htmlFor="github-username" className="text-sm text-blue-800">
            Votre nom d'utilisateur GitHub (pour héberger les médias gratuitement)
          </Label>
          <Input
            id="github-username"
            value={githubUsername}
            onChange={(e) => setGithubUsername(e.target.value)}
            placeholder="Ex: fatou-mbodj"
            className="bg-white"
          />
          <p className="text-xs text-blue-600">
            💡 Vos vidéos seront automatiquement hébergées sur GitHub Pages
          </p>
        </div>
      </div>

      {/* Zone de drop */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${isProcessing ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          {isProcessing ? (
            <>
              <div className="animate-spin mx-auto w-12 h-12 text-blue-500">
                <Archive className="w-full h-full" />
              </div>
              <p className="text-lg font-medium text-blue-600">Traitement en cours...</p>
              <p className="text-sm text-gray-600">{progress}</p>
            </>
          ) : (
            <>
              <Upload className="mx-auto w-16 h-16 text-gray-400" />
              <div>
                <p className="text-xl font-semibold text-gray-700 mb-2">
                  Importez votre conversation WhatsApp
                </p>
                <p className="text-gray-500 mb-4">
                  Glissez-déposez un fichier .txt ou .zip ici, ou cliquez pour sélectionner
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <FileText className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="font-medium text-blue-700">Fichier texte (.txt)</p>
                  <p className="text-blue-600">Export simple du chat</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <Archive className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="font-medium text-green-700">Archive ZIP (.zip)</p>
                  <p className="text-green-600">Chat + médias (recommandé)</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {progress.startsWith('Erreur:') && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <p className="font-medium">Erreur de traitement</p>
          </div>
          <p className="text-red-700 mt-1">{progress}</p>
        </div>
      )}
    </div>
  );
};
