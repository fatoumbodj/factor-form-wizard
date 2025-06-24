
import React from 'react';
import { BookSettings } from '../types/Message';

interface BookCoverProps {
  settings: BookSettings;
  participants: string[];
  messageCount: number;
  dateRange: string;
}

export const BookCover: React.FC<BookCoverProps> = ({
  settings,
  participants,
  messageCount,
  dateRange
}) => {
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

  return (
    <div 
      className="h-screen flex flex-col justify-center items-center text-white p-8 relative overflow-hidden"
      style={{ 
        background: `linear-gradient(135deg, ${settings.coverColor}, ${adjustBrightness(settings.coverColor, -20)})`,
        fontFamily: settings.fontFamily 
      }}
    >
      {/* Motif décoratif */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border-2 border-white rounded-full"></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 border-2 border-white rounded-full"></div>
      </div>

      <div className="text-center z-10 max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
          {settings.title}
        </h1>
        
        {settings.subtitle && (
          <p className="text-xl md:text-2xl mb-8 opacity-90 font-light">
            {settings.subtitle}
          </p>
        )}
        
        <div className="space-y-3 text-lg opacity-80">
          <p>
            Conversation entre <span className="font-semibold">{participants.join(' et ')}</span>
          </p>
          <p>{messageCount} messages</p>
          <p>{dateRange}</p>
        </div>

        {settings.authorName && (
          <div className="mt-12">
            <p className="text-sm opacity-70 mb-1">Créé par</p>
            <p className="text-xl font-medium">{settings.authorName}</p>
          </div>
        )}
      </div>

      {/* Logo WhatsApp stylisé */}
      <div className="absolute bottom-8 right-8 opacity-20">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
          <span className="text-green-500 text-2xl font-bold">W</span>
        </div>
      </div>
    </div>
  );
};
