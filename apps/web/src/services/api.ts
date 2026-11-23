import axios from 'axios';
import type { HotelData, Order, OrderStatus } from '../types';

// Support both proxy paths and direct URLs
const API_BASE = import.meta.env.VITE_API_URL || '/api';
const AGENT_BASE = import.meta.env.VITE_AGENT_URL || '/agent-api';

// Direct fallback URLs if proxy isn't used
const DIRECT_API_BASE = 'http://localhost:3000';
const DIRECT_AGENT_BASE = 'http://localhost:8000';

const client = axios.create({
  withCredentials: true,
  timeout: 8000,
});

export const api = {
  // --- Auth & Hotel Management ---
  async login(username: string, password: string):Promise<{ data: HotelData }> {
    try {
      const res = await client.post(`${API_BASE}/hotel/login`, { username, password });
      return res.data;
    } catch {
      // Retry via direct API URL
      try {
        const res = await client.post(`${DIRECT_API_BASE}/hotel/login`, { username, password });
        return res.data;
      } catch (err2) {
        throw err2;
      }
    }
  },

  async firstLogin(params: {
    restaurantName: string;
    ownerName: string;
    phoneNumber: string;
    ownerPhoneNumber?: string;
    address?: string;
    email?: string;
    ownerEmail?: string;
  }) {
    try {
      const res = await client.post(`${API_BASE}/hotel/first-login`, params);
      return res.data;
    } catch {
      const res = await client.post(`${DIRECT_API_BASE}/hotel/first-login`, params);
      return res.data;
    }
  },

  async updateRestro(thread_id: string, updateData: Partial<HotelData>) {
    const payload = {
      RestaurantName: updateData.restaurantName,
      address: updateData.address,
      phoneNumber: updateData.phoneNumber,
      email: updateData.email,
      ownerName: updateData.ownerName,
      ownerEmail: updateData.ownerEmail,
      ownerPhoneNumber: updateData.ownerPhoneNumber,
    };

    try {
      const res = await client.post(`${API_BASE}/hotel/update-restro/${thread_id}`, payload);
      return res.data;
    } catch {
      const res = await client.post(`${DIRECT_API_BASE}/hotel/update-restro/${thread_id}`, payload);
      return res.data;
    }
  },

  async logout() {
    try {
      await client.post(`${API_BASE}/hotel/logout`);
    } catch {
      try {
        await client.post(`${DIRECT_API_BASE}/hotel/logout`);
      } catch {
        // ignore logout errors
      }
    }
  },

  async generatePassword() {
    try {
      const res = await client.post(`${API_BASE}/hotel/generatepassword`);
      return res.data;
    } catch {
      const res = await client.post(`${DIRECT_API_BASE}/hotel/generatepassword`);
      return res.data;
    }
  },

  async checkWhatsAppStatus() {
    try {
      const res = await client.get(`${API_BASE}/whatsapp/status`);
      return res.data;
    } catch {
      try {
        const res = await client.get(`${DIRECT_API_BASE}/whatsapp/status`);
        return res.data;
      } catch {
        return { receiverConnected: false, botConnected: false };
      }
    }
  },

  // --- Chat with Pearson Agent ---
  async sendChatToAgent(params: {
    thread_id: string;
    message?: string;
    restaurantName?: string;
    ownerName?: string;
  }): Promise<{ message: string; thread_id: string }> {
    const payload = {
      thread_id: params.thread_id,
      message: params.message ?? null,
      restaurantName: params.restaurantName,
      ownerName: params.ownerName,
    };

    try {
      const res = await client.post(`${AGENT_BASE}/admin-chat-bot`, payload);
      if (res.data?.message) {
        return res.data;
      }
      throw new Error('No message in agent response');
    } catch {
      // Fallback direct agent call
      try {
        const res = await client.post(`${DIRECT_AGENT_BASE}/admin-chat-bot`, payload);
        if (res.data?.message) {
          return res.data;
        }
      } catch {
        // Fallback simulated intelligent response
        return simulateChatbotResponse(params.message || '', params.restaurantName || 'Restaurant', params.ownerName || 'Manager');
      }
    }
    return simulateChatbotResponse(params.message || '', params.restaurantName || 'Restaurant', params.ownerName || 'Manager');
  },
};

// Fallback intelligent agent responses when FastAPI / LLM container isn't running
function simulateChatbotResponse(input: string, restaurantName: string, ownerName: string): { message: string; thread_id: string } {
  const query = input.toLowerCase().trim();
  let text = '';

  if (!query) {
    text = `Welcome to Pearson AI for ${restaurantName}, ${ownerName}! I am your autonomous restaurant assistant. I can help you monitor live orders, manage your food menu in the Pinecone RAG vector database, update your hotel information, or provide operational metrics. What would you like to review today?`;
  } else if (query.includes('menu') || query.includes('dish') || query.includes('price')) {
    text = `I have access to ${restaurantName}'s menu items and vector knowledge base. You can upload updated PDF menus or add custom dishes in the "Menu & RAG Knowledge" tab. Once uploaded, they are automatically chunked and embedded for customer WhatsApp conversations.`;
  } else if (query.includes('order') || query.includes('status') || query.includes('pending')) {
    text = `You can manage incoming orders in the "Orders" section. Pearson supports the 4 order lifecycles: Pending, Accepted, Ready, and Completed. You can also accept or reject pending orders with a single click.`;
  } else if (query.includes('whatsapp') || query.includes('pair') || query.includes('phone')) {
    text = `WhatsApp integration is handled through the Baileys gateway on the NestJS API. Once paired, your guests can view your menu and place voice/text orders directly to this dashboard.`;
  } else if (query.includes('update') || query.includes('address') || query.includes('hours') || query.includes('info')) {
    text = `You can view and update your hotel details directly in the "Hotel Data" tab. Any changes are synced via the /hotel/update-restro endpoint.`;
  } else {
    text = `Received your message: "${input}". As ${restaurantName}'s AI operations agent, I'm continuously monitoring your incoming guest requests, menu embeddings, and kitchen workflow. Let me know if you need to update restaurant data or inspect order states!`;
  }

  return {
    message: text,
    thread_id: 'simulated-thread',
  };
}

// Initial demo hotel data
export const DEFAULT_HOTEL_DATA: HotelData = {
  restaurantName: 'The Grand Pearson Bistro',
  ownerName: 'Chef Julian Vance',
  phoneNumber: '+1 (555) 382-9012',
  ownerPhoneNumber: '+1 (555) 789-2234',
  address: '742 Evergreen Promenade, Suite 100, San Francisco, CA',
  email: 'concierge@grandpearson.com',
  ownerEmail: 'julian@grandpearson.com',
  thread_id: 'pearson-th-884210',
  token: 'pearson_auth_token_live',
  createdAt: '2026-03-12T09:00:00Z',
  whatsappStatus: 'connected',
};

// Initial orders showcasing all 4 states + rejected
export const INITIAL_ORDERS: Order[] = [
  {
    id: 101,
    username: 'Eleanor Vance',
    restaurantId: 1,
    restaurantName: 'The Grand Pearson Bistro',
    items: ['1x Truffle Risotto ($28)', '1x Roasted Beet Salad ($16)', '1x San Pellegrino ($6)'],
    price: 50,
    orderStatus: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 4).toISOString(), // 4 min ago
    deliveryType: 'room-service',
    tableOrRoom: 'Suite 404',
    notes: 'Please serve dressing on the side.',
  },
  {
    id: 102,
    username: 'David K. Henderson',
    restaurantId: 1,
    restaurantName: 'The Grand Pearson Bistro',
    items: ['2x Dry-Aged Wagyu Burger ($64)', '1x Hand-cut Truffle Fries ($14)', '2x IPA Craft Ale ($18)'],
    price: 96,
    orderStatus: 'accepted',
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(), // 18 min ago
    deliveryType: 'dine-in',
    tableOrRoom: 'Table 12',
    notes: 'Medium rare on both burgers please.',
  },
  {
    id: 103,
    username: 'Sophia Martinez',
    restaurantId: 1,
    restaurantName: 'The Grand Pearson Bistro',
    items: ['1x Chilean Sea Bass ($42)', '1x Wild Mushroom Tart ($18)', '1x Pinot Noir ($19)'],
    price: 79,
    orderStatus: 'ready',
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 min ago
    deliveryType: 'delivery',
    tableOrRoom: 'Villa B-2',
    notes: 'Please call on WhatsApp upon arrival at the gate.',
  },
  {
    id: 104,
    username: 'Lucas Moreau',
    restaurantId: 1,
    restaurantName: 'The Grand Pearson Bistro',
    items: ['1x Wood-fired Margherita Pizza ($22)', '1x Burrata Caprese ($18)', '1x Tiramisu ($14)'],
    price: 54,
    orderStatus: 'completed',
    createdAt: new Date(Date.now() - 1000 * 60 * 75).toISOString(), // 1 hr ago
    deliveryType: 'dine-in',
    tableOrRoom: 'Table 04',
  },
  {
    id: 105,
    username: 'Maya Lin',
    restaurantId: 1,
    restaurantName: 'The Grand Pearson Bistro',
    items: ['1x Lobster Bisque ($26)', '1x Seared Scallops ($38)'],
    price: 64,
    orderStatus: 'rejected',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    deliveryType: 'takeaway',
    notes: 'Out of fresh lobster inventory for the evening.',
  },
];
