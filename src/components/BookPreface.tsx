
import React from 'react';
import { BookSettings } from '../types/Message';

interface BookPrefaceProps {
  settings: BookSettings;
}

export const BookPreface: React.FC<BookPrefaceProps> = ({ settings }) => {
  if (!settings.preface) return null;

  return (
    <div 
      className="h-screen flex flex-col justify-center p-12 bg-white"
      style={{ fontFamily: settings.fontFamily }}
    >
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Préface
        </h2>
        
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
          {settings.preface.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-6">
              {paragraph}
            </p>
          ))}
        </div>

        {settings.authorName && (
          <div className="mt-12 text-right">
            <p className="text-gray-600 italic">
              {settings.authorName}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
