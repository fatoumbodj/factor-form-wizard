
import { WhatsAppMessage } from '../types/Message';

export const parseWhatsAppChat = (chatText: string, mediaFiles?: Map<string, string>): { messages: WhatsAppMessage[], participants: string[], mediaFiles: Map<string, string> } => {
  const lines = chatText.split('\n');
  const messages: WhatsAppMessage[] = [];
  const participantSet = new Set<string>();
  const extractedMediaFiles = mediaFiles || new Map<string, string>();
  
  console.log('Parser - Médias disponibles:', Array.from(extractedMediaFiles.keys()));
  
  // Patterns étendus pour différents formats de WhatsApp
  const patterns = [
    // Format: [15/06/2023, 14:30:25] Nom: Message
    /^\[(\d{1,2}\/\d{1,2}\/\d{4}),?\s*(\d{1,2}:\d{2}(?::\d{2})?)\]\s*([^:]+):\s*(.*)$/,
    // Format: 15/06/2023, 14:30 - Nom: Message
    /^(\d{1,2}\/\d{1,2}\/\d{4}),?\s*(\d{1,2}:\d{2}(?::\d{2})?)\s*-\s*([^:]+):\s*(.*)$/,
    // Format: 15/06/2023 14:30 - Nom: Message
    /^(\d{1,2}\/\d{1,2}\/\d{4})\s+(\d{1,2}:\d{2}(?::\d{2})?)\s*-\s*([^:]+):\s*(.*)$/,
    // Format: DD/MM/YYYY, HH:MM - Nom: Message
    /^(\d{1,2}\/\d{1,2}\/\d{2,4}),\s*(\d{1,2}:\d{2})\s*-\s*([^:]+):\s*(.*)$/,
  ];

  // Fonction améliorée pour trouver un fichier média correspondant
  const findMediaFile = (content: string): { found: boolean; mediaUrl?: string; mediaType?: string; fileName?: string } => {
    if (!content || content.trim() === '' || content.trim() === '‎') {
      return { found: false };
    }

    console.log('Recherche de média pour:', content);
    
    // Recherche directe par nom de fichier
    for (const [fileName, url] of extractedMediaFiles.entries()) {
      const baseFileName = fileName.split('/').pop() || fileName;
      const contentLower = content.toLowerCase();
      const fileNameLower = baseFileName.toLowerCase();
      
      // Vérification par nom exact ou partiel
      if (contentLower.includes(fileNameLower) || 
          fileNameLower.includes(contentLower) ||
          content.includes(baseFileName) || 
          content.includes(fileName)) {
        
        console.log('✅ Média trouvé par nom:', fileName, url);
        
        // Déterminer le type de média
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

    // Recherche par extension de fichier mentionnée
    const extensionRegex = /\.(jpg|jpeg|png|gif|webp|bmp|mp4|avi|mov|mp3|wav|opus|pdf|doc|docx)/gi;
    const extensionMatch = content.match(extensionRegex);
    
    if (extensionMatch) {
      const extension = extensionMatch[0].toLowerCase();
      
      // Chercher un fichier avec cette extension
      for (const [fileName, url] of extractedMediaFiles.entries()) {
        if (fileName.toLowerCase().endsWith(extension)) {
          console.log('✅ Média trouvé par extension:', fileName, url);
          
          let mediaType = 'document';
          if (extension.match(/\.(jpg|jpeg|png|gif|webp|bmp)$/)) {
            mediaType = 'image';
          } else if (extension.match(/\.(mp4|avi|mov)$/)) {
            mediaType = 'video';
          } else if (extension.match(/\.(mp3|wav|opus)$/)) {
            mediaType = 'audio';
          }
          
          return {
            found: true,
            mediaUrl: url,
            mediaType,
            fileName: fileName.split('/').pop() || fileName
          };
        }
      }
    }

    // Détection par mots-clés uniquement si aucun média spécifique n'a été trouvé
    const lowerContent = content.toLowerCase().trim();
    
<<<<<<< HEAD
    // Détection d'images
    if (lowerContent.includes('img-') || /\.(jpg|jpeg|png|gif)$/i.test(content)) {
  // extraire le nom du fichier
  const fileNameMatch = content.match(/(IMG-\d+-WA\d+\.(jpg|jpeg|png|gif))/i);
  const fileName = fileNameMatch ? fileNameMatch[1] : 'image.jpg';

  return {
    isMedia: true,
    mediaInfo: {
      type: 'media',
      mediaType: 'image',
      mediaUrl: `/media/${fileName}`, // ou une URL vers ton dossier média
      fileName,
    },
    cleanContent: '📷 Photo',
  };
}

=======
    // Messages indiquant des médias manqués
    if (lowerContent.includes('image omitted') || 
        lowerContent.includes('photo omitted') ||
        lowerContent.includes('image omise') ||
        lowerContent.includes('photo omise') ||
        (lowerContent.includes('image') && lowerContent.length < 20)) {
      
      // Essayer de trouver une image quelconque
      for (const [fileName, url] of extractedMediaFiles.entries()) {
        if (fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          console.log('✅ Image de remplacement trouvée:', fileName);
          return {
            found: true,
            mediaUrl: url,
            mediaType: 'image',
            fileName: fileName.split('/').pop() || fileName
          };
        }
      }
    }
>>>>>>> 9f8f4a767cd577167b3efb7f9fa93d76ddd62eb9
    
    return { found: false };
  };

  let currentMessage: WhatsAppMessage | null = null;

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
        
        // Parse la date
        const dateParts = dateStr.split('/').map(Number);
        let [day, month, year] = dateParts;
        
        // Gérer les années à 2 chiffres
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
          // Message avec média
          currentMessage = {
            id: `msg_${i}_${Date.now()}_${Math.random()}`,
            timestamp,
            sender: cleanSender,
            content: content.trim() || `📎 ${mediaInfo.fileName}`,
            type: 'media',
            mediaUrl: mediaInfo.mediaUrl,
            mediaType: mediaInfo.mediaType as 'image' | 'video' | 'audio' | 'document',
            fileName: mediaInfo.fileName
          };
          console.log('✅ Message média créé:', currentMessage.fileName, currentMessage.mediaUrl);
        } else if (content.trim()) {
          // Message texte normal
          currentMessage = {
            id: `msg_${i}_${Date.now()}_${Math.random()}`,
            timestamp,
            sender: cleanSender,
            content: content.trim(),
            type: 'text'
          };
        } else {
          // Ne pas créer de message vide
          currentMessage = null;
        }

        matched = true;
        break;
      }
    }

    // Si la ligne ne correspond à aucun pattern, c'est la suite du message précédent
    if (!matched && currentMessage && line !== '‎') {
      const mediaInfo = findMediaFile(line);
      
      if (mediaInfo.found && currentMessage.type !== 'media') {
        // Mettre à jour le message avec les infos du média
        currentMessage.type = 'media';
        currentMessage.mediaUrl = mediaInfo.mediaUrl;
        currentMessage.mediaType = mediaInfo.mediaType as 'image' | 'video' | 'audio' | 'document';
        currentMessage.fileName = mediaInfo.fileName;
        console.log('✅ Message texte converti en média:', currentMessage.fileName);
      }
      
      if (line.trim()) {
        currentMessage.content += '\n' + line.trim();
      }
    }
  }

  // Ajouter le dernier message
  if (currentMessage && currentMessage.content.trim()) {
    messages.push(currentMessage);
  }

  const mediaMessages = messages.filter(m => m.type === 'media');
  console.log('🎯 Résultats du parsing:');
  console.log('- Total messages:', messages.length);
  console.log('- Messages avec médias:', mediaMessages.length);
  console.log('- Médias avec URL:', mediaMessages.filter(m => m.mediaUrl).length);
  
  mediaMessages.forEach((msg, index) => {
    console.log(`📸 Média ${index + 1}:`, {
      fileName: msg.fileName,
      hasUrl: !!msg.mediaUrl,
      type: msg.mediaType,
      content: msg.content.substring(0, 50) + '...'
    });
  });

  return {
    messages: messages.filter(msg => msg.content && msg.content.trim() !== ''),
    participants: Array.from(participantSet),
    mediaFiles: extractedMediaFiles
  };
};
