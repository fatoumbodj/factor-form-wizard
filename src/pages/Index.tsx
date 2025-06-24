
import React, { useState } from 'react';
import { BookPreSettings } from '../components/BookPreSettings';
import { UniversalImport } from '../components/UniversalImport';
import { ChatBook } from '../components/ChatBook';
import { BookHeader } from '../components/BookHeader';
import { WhatsAppMessage, BookSettings } from '../types/Message';

type AppStep = 'settings' | 'import' | 'book';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>('settings');
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [participants, setParticipants] = useState<string[]>([]);
  const [bookSettings, setBookSettings] = useState<BookSettings>({
    title: 'Notre Conversation',
    coverColor: '#10b981',
    fontFamily: 'Inter',
    showTimestamps: true,
    showDates: true
  });

  const handleMessagesImported = (importedMessages: WhatsAppMessage[], detectedParticipants: string[]) => {
    setMessages(importedMessages);
    setParticipants(detectedParticipants);
    setCurrentStep('book');
  };

  const handleReset = () => {
    setMessages([]);
    setParticipants([]);
    setCurrentStep('settings');
  };

  const handleContinueToImport = () => {
    setCurrentStep('import');
  };

  const handleBackToSettings = () => {
    setCurrentStep('settings');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'settings':
        return (
          <BookPreSettings
            settings={bookSettings}
            onSettingsChange={setBookSettings}
            onContinue={handleContinueToImport}
          />
        );
      
      case 'import':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <button 
                onClick={handleBackToSettings}
                className="text-blue-600 hover:text-blue-800 underline mb-4"
              >
                ← Retour aux paramètres
              </button>
            </div>
            <UniversalImport onMessagesImported={handleMessagesImported} />
          </div>
        );
      
      case 'book':
        return (
          <ChatBook 
            messages={messages} 
            title={bookSettings.title}
            participants={participants}
            onReset={handleReset}
            settings={bookSettings}
            onSettingsChange={setBookSettings}
          />
        );
      
      default:
        return null;
    }
  };

  const getStepClasses = (step: AppStep) => {
    return `flex items-center gap-2 px-4 py-2 rounded-full ${
      currentStep === step ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
    }`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header avec navigation */}
        {currentStep !== 'book' && (
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              📚 Créateur de Livre Souvenir
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Transformez vos conversations en magnifiques livres PDF
            </p>
            
            {/* Indicateur d'étapes */}
            <div className="flex justify-center items-center gap-4 mb-8">
              <div className={getStepClasses('settings')}>
                <span className="text-sm font-medium">1. Paramètres</span>
              </div>
              <div className="w-8 h-0.5 bg-gray-300"></div>
              <div className={getStepClasses('import')}>
                <span className="text-sm font-medium">2. Import</span>
              </div>
              <div className="w-8 h-0.5 bg-gray-300"></div>
              <div className={getStepClasses('book')}>
                <span className="text-sm font-medium">3. Livre</span>
              </div>
            </div>
          </div>
        )}

        {/* Contenu selon l'étape */}
        {renderCurrentStep()}
      </div>
    </div>
  );
};

export default Index;
