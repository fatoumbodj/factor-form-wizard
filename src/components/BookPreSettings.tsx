
import React from 'react';
import { BookSettings as BookSettingsType } from '../types/Message';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Settings, ArrowRight } from 'lucide-react';

interface BookPreSettingsProps {
  settings: BookSettingsType;
  onSettingsChange: (settings: BookSettingsType) => void;
  onContinue: () => void;
}

export const BookPreSettings: React.FC<BookPreSettingsProps> = ({
  settings,
  onSettingsChange,
  onContinue
}) => {
  const updateSetting = <K extends keyof BookSettingsType>(
    key: K,
    value: BookSettingsType[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const colorOptions = [
    { value: '#10b981', label: 'Vert', color: '#10b981' },
    { value: '#3b82f6', label: 'Bleu', color: '#3b82f6' },
    { value: '#8b5cf6', label: 'Violet', color: '#8b5cf6' },
    { value: '#ef4444', label: 'Rouge', color: '#ef4444' },
    { value: '#f59e0b', label: 'Orange', color: '#f59e0b' },
    { value: '#06b6d4', label: 'Cyan', color: '#06b6d4' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Settings className="w-16 h-16 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Paramètres de votre livre
          </CardTitle>
          <CardDescription className="text-lg">
            Configurez l'apparence et le contenu avant d'importer vos messages
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Titre */}
            <div className="space-y-2">
              <Label htmlFor="title">Titre du livre</Label>
              <Input
                id="title"
                value={settings.title}
                onChange={(e) => updateSetting('title', e.target.value)}
                placeholder="Notre Conversation"
              />
            </div>

            {/* Sous-titre */}
            <div className="space-y-2">
              <Label htmlFor="subtitle">Sous-titre (optionnel)</Label>
              <Input
                id="subtitle"
                value={settings.subtitle || ''}
                onChange={(e) => updateSetting('subtitle', e.target.value)}
                placeholder="Nos plus beaux souvenirs"
              />
            </div>

            {/* Auteur */}
            <div className="space-y-2">
              <Label htmlFor="authorName">Nom de l'auteur (optionnel)</Label>
              <Input
                id="authorName"
                value={settings.authorName || ''}
                onChange={(e) => updateSetting('authorName', e.target.value)}
                placeholder="Votre nom"
              />
            </div>

            {/* Police */}
            <div className="space-y-2">
              <Label>Police de caractères</Label>
              <Select 
                value={settings.fontFamily} 
                onValueChange={(value) => updateSetting('fontFamily', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inter">Inter (moderne)</SelectItem>
                  <SelectItem value="serif">Serif (classique)</SelectItem>
                  <SelectItem value="Georgia">Georgia (élégant)</SelectItem>
                  <SelectItem value="Times New Roman">Times New Roman (traditionnel)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Couleur de couverture */}
          <div className="space-y-2">
            <Label>Couleur de couverture</Label>
            <div className="grid grid-cols-3 gap-2">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateSetting('coverColor', option.value)}
                  className={`
                    p-3 rounded-lg border-2 transition-all flex items-center gap-2
                    ${settings.coverColor === option.value 
                      ? 'border-gray-800 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: option.color }}
                  />
                  <span className="text-sm">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Préface */}
          <div className="space-y-2">
            <Label htmlFor="preface">Préface (optionnelle)</Label>
            <Textarea
              id="preface"
              value={settings.preface || ''}
              onChange={(e) => updateSetting('preface', e.target.value)}
              placeholder="Écrivez une préface pour introduire votre livre..."
              rows={3}
            />
          </div>

          {/* Dédicace */}
          <div className="space-y-2">
            <Label htmlFor="dedication">Dédicace (optionnelle)</Label>
            <Textarea
              id="dedication"
              value={settings.dedication || ''}
              onChange={(e) => updateSetting('dedication', e.target.value)}
              placeholder="À qui dédiez-vous ce livre ?"
              rows={2}
            />
          </div>

          {/* Options d'affichage */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800">Options d'affichage</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Afficher les heures</Label>
                <p className="text-sm text-gray-500">
                  Affiche l'heure d'envoi de chaque message
                </p>
              </div>
              <Switch
                checked={settings.showTimestamps}
                onCheckedChange={(checked) => updateSetting('showTimestamps', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Afficher les dates</Label>
                <p className="text-sm text-gray-500">
                  Sépare les messages par jour avec la date
                </p>
              </div>
              <Switch
                checked={settings.showDates}
                onCheckedChange={(checked) => updateSetting('showDates', checked)}
              />
            </div>
          </div>

          <Button 
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 text-lg"
          >
            <div className="flex items-center gap-2">
              <ArrowRight className="w-5 h-5" />
              Continuer vers l'import
            </div>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
