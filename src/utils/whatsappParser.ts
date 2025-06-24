
import { WhatsAppMessage } from '../types/Message';

export const parseWhatsAppChat = (chatText: string, mediaFiles?: Map<string, string>): { messages: WhatsAppMessage[], participants: string[], mediaFiles: Map<string, string> } => {
  const lines = chatText.split('\n');
  const messages: WhatsAppMessage[] = [];
  const participantSet = new Set<string>();
  const extractedMediaFiles = mediaFiles || new Map<string, string>();
  
  console.log('🔍 Parser - Médias disponibles:', Array.from(extractedMediaFiles.keys()));
  
  // Patterns étendus pour différents formats de WhatsApp
  const patterns = [
    /^\[(\d{1,2}\/\d{1,2}\/\d{4}),?\s*(\d{1,2}:\d{2}(?::\d{2})?)\]\s*([^:]+):\s*(.*)$/,
    /^(\d{1,2}\/\d{1,2}\/\d{4}),?\s*(\d{1,2}:\d{2}(?::\d{2})?)\s*-\s*([^:]+):\s*(.*)$/,
    /^(\d{1,2}\/\d{1,2}\/\d{4})\s+(\d{1,2}:\d{2}(?::\d{2})?)\s*-\s*([^:]+):\s*(.*)$/,
    /^(\d{1,2}\/\d{1,2}\/\d{2,4}),\s*(\d{1,2}:\d{2})\s*-\s*([^:]+):\s*(.*)$/,
  ];

  // Messages système à ignorer
  const systemMessagePatterns = [
    /created group/i,
    /créé le groupe/i,
    /created this group/i,
    /créé ce groupe/i,
    /end-to-end encrypted/i,
    /chifré de bout en bout/i,
    /messages and calls are end-to-end encrypted/i,
    /les messages et appels sont chiffrés de bout en bout/i,
    /only people in this chat can read/i,
    /seules les personnes de cette discussion peuvent/i,
    /added/i,
    /ajouté/i,
    /left/i,
    /quitté/i,
    /joined using this group's invite link/i,
    /rejoint via le lien d'invitation/i,
    /changed the group description/i,
    /modifié la description du groupe/i,
    /changed this group's icon/i,
    /modifié l'icône de ce groupe/i,
    /security code changed/i,
    /code de sécurité modifié/i
  ];

  // Fonction pour vérifier si c'est un message système
  const isSystemMessage = (content: string, sender: string): boolean => {
    return systemMessagePatterns.some(pattern => 
      pattern.test(content) || pattern.test(sender)
    );
  };

  // Fonction pour trouver un fichier média correspondant
  const findMediaFile = (content: string): { found: boolean; mediaUrl?: string; mediaType?: string; fileName?: string } => {
    if (!content || content.trim() === '' || content.trim() === '‎') {
      return { found: false };
    }

    console.log('🔍 Recherche de média pour:', content);
    
    // Recherche directe par nom de fichier mentionné
    for (const [fileName, url] of extractedMediaFiles.entries()) {
      const baseFileName = fileName.split('/').pop() || fileName;
      const contentWords = content.toLowerCase().split(/\s+/);
      const fileNameLower = baseFileName.toLowerCase();
      
      // Vérification si le nom du fichier est mentionné dans le contenu
      if (contentWords.some(word => fileNameLower.includes(word) || word.includes(fileNameLower.split('.')[0]))) {
        console.log('✅ Média trouvé par nom:', fileName, url);
        
        let mediaType = 'document';
        if (fileName.match(/\.(jpg|jpeg|png|gif|webp|bmp|tiff|svg)$/i)) {
          mediaType = 'image';
        } else if (fileName.match(/\.(mp4|avi|mov|webm|mkv|flv|wmv)$/i)) {
          mediaType = 'video';
        } else if (fileName.match(/\.(mp3|wav|opus|ogg|aac|m4a|flac)$/i)) {
          mediaType = 'audio';
        }
        
        return {
          found: true,
          mediaUrl: url,
          mediaType,
          fileName: baseFileName
        };
      }
    }

    // Détection par mots-clés de médias
    const lowerContent = content.toLowerCase().trim();
    
    // Messages indiquant des images
    if (lowerContent.includes('image') || lowerContent.includes('photo') || 
        lowerContent.includes('pic') || lowerContent.includes('img') ||
        content.includes('📷') || content.includes('🖼️')) {
      
      // Chercher la première image disponible
      for (const [fileName, url] of extractedMediaFiles.entries()) {
        if (fileName.match(/\.(jpg|jpeg|png|gif|webp|bmp|tiff|svg)$/i)) {
          console.log('✅ Image trouvée pour message image:', fileName);
          return {
            found: true,
            mediaUrl: url,
            mediaType: 'image',
            fileName: fileName.split('/').pop() || fileName
          };
        }
      }
    }
    
    // Messages indiquant des vidéos
    if (lowerContent.includes('video') || lowerContent.includes('vidéo') || 
        lowerContent.includes('film') || content.includes('🎥') || content.includes('📹')) {
      
      // Chercher la première vidéo disponible
      for (const [fileName, url] of extractedMediaFiles.entries()) {
        if (fileName.match(/\.(mp4|avi|mov|webm|mkv)$/i)) {
          console.log('✅ Vidéo trouvée pour message vidéo:', fileName);
          return {
            found: true,
            mediaUrl: url,
            mediaType: 'video',
            fileName: fileName.split('/').pop() || fileName
          };
        }
      }
    }
    
    // Messages indiquant des audios
    if (lowerContent.includes('audio') || lowerContent.includes('voice') || 
        lowerContent.includes('voix') || content.includes('🎵') || content.includes('🔊')) {
      
      // Chercher le premier audio disponible
      for (const [fileName, url] of extractedMediaFiles.entries()) {
        if (fileName.match(/\.(mp3|wav|opus|ogg|aac|m4a)$/i)) {
          console.log('✅ Audio trouvé pour message audio:', fileName);
          return {
            found: true,
            mediaUrl: url,
            mediaType: 'audio',
            fileName: fileName.split('/').pop() || fileName
          };
        }
      }
    }
    
    return { found: false };
  };

  let currentMessage: WhatsAppMessage | null = null;
  let messageIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line === '‎') continue;

    let matched = false;

    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (match) {
        // Sauvegarder le message précédent s'il existe
        if (currentMessage && currentMessage.content.trim()) {
          messages.push(currentMessage);
        }

        const [, dateStr, timeStr, sender, content] = match;
        
        // Ignorer les messages système
        if (isSystemMessage(content, sender)) {
          console.log('🚫 Message système ignoré:', content);
          currentMessage = null;
          matched = true;
          break;
        }
        
        // Parse la date
        const dateParts = dateStr.split('/').map(Number);
        let [day, month, year] = dateParts;
        
        if (year < 100) {
          year += year < 50 ? 2000 : 1900;
        }
        
        const [hours, minutes, seconds = 0] = timeStr.split(':').map(Number);
        const timestamp = new Date(year, month - 1, day, hours, minutes, seconds);
        
        const cleanSender = sender.trim();
        participantSet.add(cleanSender);

        // Analyser le contenu pour les médias
        const mediaInfo = findMediaFile(content);
        
        if (mediaInfo.found) {
          currentMessage = {
            id: `msg_${messageIndex++}_${Date.now()}_${Math.random()}`,
            timestamp,
            sender: cleanSender,
            content: content.trim() || '',
            type: 'media',
            mediaUrl: mediaInfo.mediaUrl,
            mediaType: mediaInfo.mediaType as 'image' | 'video' | 'audio' | 'document',
            fileName: mediaInfo.fileName
          };
          console.log('✅ Message média créé:', currentMessage.fileName);
        } else if (content.trim()) {
          currentMessage = {
            id: `msg_${messageIndex++}_${Date.now()}_${Math.random()}`,
            timestamp,
            sender: cleanSender,
            content: content.trim(),
            type: 'text'
          };
        } else {
          currentMessage = null;
        }

        matched = true;
        break;
      }
    }

    // Si la ligne ne correspond à aucun pattern, c'est la suite du message précédent
    if (!matched && currentMessage && line !== '‎') {
      if (line.trim() && !systemMessagePatterns.some(pattern => pattern.test(line))) {
        currentMessage.content += '\n' + line.trim();
        
        // Re-vérifier pour les médias dans le contenu étendu
        const mediaInfo = findMediaFile(currentMessage.content);
        if (mediaInfo.found && currentMessage.type !== 'media') {
          currentMessage.type = 'media';
          currentMessage.mediaUrl = mediaInfo.mediaUrl;
          currentMessage.mediaType = mediaInfo.mediaType as 'image' | 'video' | 'audio' | 'document';
          currentMessage.fileName = mediaInfo.fileName;
          console.log('✅ Message texte converti en média:', currentMessage.fileName);
        }
      }
    }
  }

  // Ajouter le dernier message
  if (currentMessage && currentMessage.content.trim()) {
    messages.push(currentMessage);
  }

  // Si on a des médias mais pas de messages média, on essaie de créer des messages média
  if (extractedMediaFiles.size > 0 && messages.filter(m => m.type === 'media').length === 0) {
    console.log('🔄 Création de messages média pour les fichiers orphelins...');
    
    Array.from(extractedMediaFiles.entries()).forEach(([fileName, url], index) => {
      let mediaType = 'document';
      if (fileName.match(/\.(jpg|jpeg|png|gif|webp|bmp|tiff|svg)$/i)) {
        mediaType = 'image';
      } else if (fileName.match(/\.(mp4|avi|mov|webm|mkv)$/i)) {
        mediaType = 'video';
      } else if (fileName.match(/\.(mp3|wav|opus|ogg|aac|m4a)$/i)) {
        mediaType = 'audio';
      }
      
      const mediaMessage: WhatsAppMessage = {
        id: `media_${index}_${Date.now()}_${Math.random()}`,
        timestamp: new Date(),
        sender: 'Média',
        content: '',
        type: 'media',
        mediaUrl: url,
        mediaType: mediaType as 'image' | 'video' | 'audio' | 'document',
        fileName: fileName.split('/').pop() || fileName
      };
      
      messages.push(mediaMessage);
      console.log('✅ Message média créé pour fichier orphelin:', fileName);
    });
  }

  const validMessages = messages.filter(msg => 
    msg.content && msg.content.trim() !== '' || msg.type === 'media'
  );

  const mediaMessages = validMessages.filter(m => m.type === 'media');
  console.log('🎯 Résultats du parsing:');
  console.log('- Total messages:', validMessages.length);
  console.log('- Messages avec médias:', mediaMessages.length);
  console.log('- Médias avec URL:', mediaMessages.filter(m => m.mediaUrl).length);

  return {
    messages: validMessages,
    participants: Array.from(participantSet),
    mediaFiles: extractedMediaFiles
  };
};
