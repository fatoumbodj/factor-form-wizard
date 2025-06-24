
import React from 'react';
import { WhatsAppMessage } from '../types/Message';
import { Check, CheckCheck } from 'lucide-react';
import { MediaDisplay } from './MediaDisplay';

interface MessageBubbleProps {
  message: WhatsAppMessage;
  isOwn: boolean;
  showTimestamp: boolean;
  previousMessage?: WhatsAppMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  showTimestamp,
  previousMessage
}) => {
  const showSender = !previousMessage || previousMessage.sender !== message.sender;
  const timeDiff = previousMessage 
    ? message.timestamp.getTime() - previousMessage.timestamp.getTime()
    : 0;
  const showTimeGap = timeDiff > 300000; // 5 minutes

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} ${showTimeGap ? 'mt-6' : ''}`}>
      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
        {/* Nom de l'expéditeur */}
        {!isOwn && showSender && (
          <div className="text-xs text-gray-600 mb-1 ml-2 font-medium">
            {message.sender}
          </div>
        )}
        
        {/* Bulle de message */}
        <div
          className={`
            relative px-4 py-2 rounded-2xl shadow-sm
            ${isOwn 
              ? 'bg-green-500 text-white rounded-br-md' 
              : 'bg-white text-gray-800 rounded-bl-md border border-gray-200'
            }
            ${showSender ? '' : isOwn ? 'rounded-tr-2xl' : 'rounded-tl-2xl'}
          `}
        >
          {/* Contenu du message */}
          {message.type === 'media' && message.mediaUrl ? (
            <div className="space-y-2">
              <MediaDisplay 
                mediaUrl={message.mediaUrl}
                mediaType={message.mediaType || 'image'}
                fileName={message.fileName}
              />
              {message.content && (
                <div className="whitespace-pre-wrap break-words">
                  {message.content}
                </div>
              )}
            </div>
          ) : (
            <div className="whitespace-pre-wrap break-words">
              {message.content}
            </div>
          )}
          
          {/* Timestamp et statut */}
          <div className={`flex items-center justify-end gap-1 mt-1 text-xs ${
            isOwn ? 'text-green-100' : 'text-gray-500'
          }`}>
            {showTimestamp && (
              <span>
                {message.timestamp.toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            )}
            
            {/* Indicateur de message envoyé (pour les messages "own") */}
            {isOwn && (
              <CheckCheck className="w-3 h-3 text-green-100" />
            )}
          </div>
          
          {/* Queue de la bulle */}
          <div
            className={`
              absolute top-0 w-3 h-3
              ${isOwn 
                ? 'right-0 -mr-1 bg-green-500 rounded-bl-full' 
                : 'left-0 -ml-1 bg-white border-l border-b border-gray-200 rounded-br-full'
              }
              ${showSender ? 'block' : 'hidden'}
            `}
          />
        </div>
      </div>
    </div>
  );
};
