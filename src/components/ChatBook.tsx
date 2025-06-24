import React, { useState, useMemo } from 'react';
import { MessageBubble } from './MessageBubble';
import { BookSettings } from './BookSettings';
import { PDFExport } from './PDFExport';
import { BookCover } from './BookCover';
import { BookPreface } from './BookPreface';
import { BookDedication } from './BookDedication';
import { BookPagination } from './BookPagination';
import { WhatsAppMessage, BookSettings as BookSettingsType, BookPage } from '../types/Message';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings, Download } from 'lucide-react';

interface ChatBookProps {
  messages: WhatsAppMessage[];
  title: string;
  participants: string[];
  onReset: () => void;
  settings: BookSettingsType;
  onSettingsChange: (settings: BookSettingsType) => void;
}

export const ChatBook: React.FC<ChatBookProps> = ({ 
  messages, 
  title, 
  participants, 
  onReset,
  settings,
  onSettingsChange
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const groupedMessages = groupMessagesByDate(messages);

  // Créer les pages du livre avec plus de messages par page
  const bookPages = useMemo((): BookPage[] => {
    const pages: BookPage[] = [];
    const messagesPerContentPage = 15; // Augmenté de 5-10 à 15
    
    // Page de couverture
    pages.push({
      id: 'cover',
      type: 'cover'
    });

    // Préface (si définie)
    if (settings.preface) {
      pages.push({
        id: 'preface',
        type: 'preface'
      });
    }

    // Dédicace (si définie)
    if (settings.dedication) {
      pages.push({
        id: 'dedication',
        type: 'dedication'
      });
    }

    // Pages de contenu (groupées par jour mais avec plus de messages par page)
    Object.entries(groupedMessages).forEach(([date, dayMessages]) => {
      for (let i = 0; i < dayMessages.length; i += messagesPerContentPage) {
        const pageMessages = dayMessages.slice(i, i + messagesPerContentPage);
        pages.push({
          id: `content-${date}-${i}`,
          type: 'content',
          content: { 
            date: i === 0 ? date : null, // Afficher la date seulement sur la première page du jour
            messages: pageMessages 
          },
          pageNumber: pages.filter(p => p.type === 'content').length + 1
        });
      }
    });

    return pages;
  }, [groupedMessages, settings.preface, settings.dedication]);

  const currentBookPage = bookPages[currentPage];
  
  const getPageTitle = (page: BookPage) => {
    switch (page.type) {
      case 'cover': return 'Couverture';
      case 'preface': return 'Préface';
      case 'dedication': return 'Dédicace';
      case 'content': return page.content?.date ? formatDate(new Date(page.content.date)) : 'Contenu';
      default: return '';
    }
  };

  const renderCurrentPage = () => {
    if (!currentBookPage) return null;

    switch (currentBookPage.type) {
      case 'cover':
        return (
          <BookCover
            settings={settings}
            participants={participants}
            messageCount={messages.length}
            dateRange={formatDateRange(messages)}
          />
        );
      
      case 'preface':
        return <BookPreface settings={settings} />;
      
      case 'dedication':
        return <BookDedication settings={settings} />;
      
      case 'content':
        const { date, messages: dayMessages } = currentBookPage.content;
        return (
          <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
              {date && settings.showDates && (
                <div className="text-center mb-8">
                  <span className="bg-white px-6 py-3 rounded-full text-lg font-medium text-gray-600 shadow-sm">
                    {formatDate(new Date(date))}
                  </span>
                </div>
              )}
              
              <div className="space-y-3"> {/* Réduit l'espacement entre les messages */}
                {dayMessages.map((message, index) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isOwn={isOwnMessage(message, participants)}
                    showTimestamp={settings.showTimestamps}
                    previousMessage={index > 0 ? dayMessages[index - 1] : undefined}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      {/* Barre d'outils (masquée en mode livre) */}
      {!showSettings && !showExport && (
        <div className="fixed top-4 left-4 right-4 z-40 flex justify-between items-center">
          <Button
            onClick={onReset}
            variant="outline"
            className="flex items-center gap-2 bg-white shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
          
          <div className="flex gap-2">
            <Button
              onClick={() => setShowSettings(!showSettings)}
              variant="outline"
              className="flex items-center gap-2 bg-white shadow-md"
            >
              <Settings className="w-4 h-4" />
              Paramètres
            </Button>
            <Button
              onClick={() => setShowExport(!showExport)}
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 shadow-md"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </Button>
          </div>
        </div>
      )}

      {/* Paramètres */}
      {showSettings && (
        <div className="fixed inset-0 bg-white z-50 overflow-auto">
          <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Paramètres du livre</h2>
              <Button onClick={() => setShowSettings(false)}>
                Fermer
              </Button>
            </div>
            <BookSettings 
              settings={settings}
              onSettingsChange={onSettingsChange}
            />
          </div>
        </div>
      )}

      {/* Options d'export */}
      {showExport && (
        <div className="fixed inset-0 bg-white z-50 overflow-auto">
          <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Exporter le livre</h2>
              <Button onClick={() => setShowExport(false)}>
                Fermer
              </Button>
            </div>
            <PDFExport 
              messages={messages}
              settings={settings}
              participants={participants}
            />
          </div>
        </div>
      )}

      {/* Contenu du livre */}
      {!showSettings && !showExport && (
        <>
          <div style={{ fontFamily: settings.fontFamily }}>
            {renderCurrentPage()}
          </div>
          
          {/* Pagination */}
          <BookPagination
            currentPage={currentPage}
            totalPages={bookPages.length}
            onPageChange={setCurrentPage}
            pageTitle={getPageTitle(currentBookPage)}
          />
        </>
      )}
    </div>
  );
};

// Fonction utilitaire pour grouper les messages par date
const groupMessagesByDate = (messages: WhatsAppMessage[]) => {
  return messages.reduce((groups, message) => {
    const date = message.timestamp.toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, WhatsAppMessage[]>);
};

// Fonction pour déterminer si c'est notre message (premier participant)
const isOwnMessage = (message: WhatsAppMessage, participants: string[]) => {
  return participants.length > 0 && message.sender === participants[0];
};

// Fonction pour ajuster la luminosité d'une couleur
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

// Fonction pour formater une date
const formatDate = (date: Date) => {
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Fonction pour formater la plage de dates
const formatDateRange = (messages: WhatsAppMessage[]) => {
  if (messages.length === 0) return '';
  
  const firstDate = messages[0].timestamp;
  const lastDate = messages[messages.length - 1].timestamp;
  
  if (firstDate.toDateString() === lastDate.toDateString()) {
    return formatDate(firstDate);
  }
  
  return `Du ${firstDate.toLocaleDateString('fr-FR')} au ${lastDate.toLocaleDateString('fr-FR')}`;
};
