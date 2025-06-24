
export interface WhatsAppMessage {
  id: string;
  timestamp: Date;
  sender: string;
  content: string;
  type: 'text' | 'media' | 'system';
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio' | 'document';
  fileName?: string;
}

export interface BookSettings {
  title: string;
  subtitle?: string;
  coverColor: string;
  fontFamily: string;
  showTimestamps: boolean;
  showDates: boolean;
  preface?: string;
  dedication?: string;
  authorName?: string;
}

export interface BookPage {
  id: string;
  type: 'cover' | 'preface' | 'dedication' | 'content' | 'back';
  content?: any;
  pageNumber?: number;
}
