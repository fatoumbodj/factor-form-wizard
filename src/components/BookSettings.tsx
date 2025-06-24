
import React from 'react';
import { BookSettings as BookSettingsType } from '../types/Message';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BookSettingsProps {
  settings: BookSettingsType;
  onSettingsChange: (settings: BookSettingsType) => void;
}

export const BookSettings: React.FC<BookSettingsProps> = ({
  settings,
  onSettingsChange
}) => {
  const updateSetting = <K extends keyof BookSettingsType>(
    key: K,
    value: BookSettingsType[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const colorOptions = [
    { value: '#10b981', label: 'Vert WhatsApp', color: '#10b981' },
    { value: '#3b82f6', label: 'Bleu', color: '#3b82f6' },
    { value: '#8b5cf6', label: 'Violet', color: '#8b5cf6' },
    { value: '#ef4444', label: 'Rouge', color: '#ef4444' },
    { value: '#f59e0b', label: 'Orange', color: '#f59e0b' },
    { value: '#06b6d4', label: 'Cyan', color: '#06b6d4' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres du livre</CardTitle>
        <CardDescription>
          Personnalisez l'apparence et le contenu de votre livre souvenir
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="content">Contenu</TabsTrigger>
            <TabsTrigger value="display">Affichage</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-6">
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
                    <SelectItem value="monospace">Monospace (technique)</SelectItem>
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
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            {/* Préface */}
            <div className="space-y-2">
              <Label htmlFor="preface">Préface (optionnelle)</Label>
              <Textarea
                id="preface"
                value={settings.preface || ''}
                onChange={(e) => updateSetting('preface', e.target.value)}
                placeholder="Écrivez une préface pour introduire votre livre de conversation..."
                rows={4}
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
                rows={3}
              />
            </div>
          </TabsContent>

          <TabsContent value="display" className="space-y-6">
            {/* Options d'affichage */}
            <div className="space-y-4">
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
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
