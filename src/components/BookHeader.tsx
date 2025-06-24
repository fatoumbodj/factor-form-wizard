
import React from 'react';
import { MessageCircle, Users, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface BookHeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  participants: string[];
}

export const BookHeader: React.FC<BookHeaderProps> = ({ 
  title, 
  onTitleChange, 
  participants 
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [tempTitle, setTempTitle] = React.useState(title);

  const handleSave = () => {
    onTitleChange(tempTitle);
    setIsEditing(false);
  };

  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center mb-4">
        <MessageCircle className="w-12 h-12 text-green-600 mr-3" />
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          WhatsApp Memory Book
        </h1>
      </div>
      
      <div className="flex items-center justify-center gap-2 mb-4">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              className="text-xl font-semibold text-center"
              onKeyPress={(e) => e.key === 'Enter' && handleSave()}
            />
            <Button onClick={handleSave} size="sm">
              Sauvegarder
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit3 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {participants.length > 0 && (
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <Users className="w-4 h-4" />
          <span>Participants: {participants.join(', ')}</span>
        </div>
      )}
      
      <p className="text-gray-600 mt-2">
        Transformez vos conversations WhatsApp en un livre souvenir magnifique
      </p>
    </div>
  );
};
