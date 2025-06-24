
import React from 'react';
import { BookSettings } from '../types/Message';

interface BookDedicationProps {
  settings: BookSettings;
}

export const BookDedication: React.FC<BookDedicationProps> = ({ settings }) => {
  if (!settings.dedication) return null;

  return (
    <div 
      className="h-screen flex flex-col justify-center items-center p-12 bg-white"
      style={{ fontFamily: settings.fontFamily }}
    >
      <div className="max-w-xl text-center">
        <h2 className="text-2xl font-light text-gray-600 mb-8 italic">
          Dédicace
        </h2>
        
        <div className="text-xl text-gray-800 leading-relaxed font-light italic">
          {settings.dedication.split('\n').map((line, index) => (
            <p key={index} className="mb-4">
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
