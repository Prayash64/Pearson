export type OrderStatus = 'pending' | 'accepted' | 'ready' | 'completed' | 'rejected';

export interface Order {
  id: string | number;
  username: string;
  restaurantId: number | string;
  restaurantName: string;
  items: string[];
  price: number;
  orderStatus: OrderStatus;
  createdAt: string;
  notes?: string;
  deliveryType?: 'dine-in' | 'takeaway' | 'delivery' | 'room-service';
  tableOrRoom?: string;
}

export interface HotelData {
  id?: number;
  restaurantName: string;
  ownerName: string;
  phoneNumber?: string;
  ownerPhoneNumber?: string;
  address?: string;
  email?: string;
  ownerEmail?: string;
  thread_id: string;
  token?: string;
  createdAt?: string;
  whatsappStatus?: 'connected' | 'disconnected' | 'pairing';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  isStreaming?: boolean;
}

export interface MenuItem {
  id: string | number;
  restaurantId?: number | string;
  itemName: string;
  category: string;
  price: number;
  description: string;
  available: boolean;
  dietary?: string[];
}

export interface RagDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  status: 'processing' | 'indexed' | 'ready' | 'failed';
  chunkCount: number;
  contentSnippet?: string;
  chunks?: RagChunk[];
}

export interface RagChunk {
  id: string;
  chunkIndex: number;
  text: string;
  tokenCount: number;
  score?: number;
}
