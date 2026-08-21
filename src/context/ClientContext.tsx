'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Client {
  id: string;
  name: string;
  country: string;
  flag: string;
  category: string;
  avatar: string;
  color: string;
  whatsapp: string;
  approvalRate: number;
  monthlyGoal: number;
}

export const DEFAULT_CLIENTS: Client[] = [
  {
    id: 'teranga-gourmet',
    name: 'Teranga Gourmet',
    country: 'Sénégal',
    flag: '🇸🇳',
    category: 'Haute Gastronomie & Traiteur',
    avatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80',
    color: '#F94F06',
    whatsapp: '+221 77 842 19 02',
    approvalRate: 98,
    monthlyGoal: 24,
  },
  {
    id: 'sira-cosmetiques',
    name: 'Sira Cosmétiques Bio',
    country: 'Côte d\'Ivoire',
    flag: '🇨🇮',
    category: 'Skincare & Beauté Naturelle',
    avatar: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200&auto=format&fit=crop&q=80',
    color: '#0066FF',
    whatsapp: '+225 07 48 92 10 33',
    approvalRate: 94,
    monthlyGoal: 18,
  },
  {
    id: 'baobab-tech',
    name: 'Baobab Tech Hub',
    country: 'Sénégal',
    flag: '🇸🇳',
    category: 'Incubateur & SaaS FinTech',
    avatar: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200&auto=format&fit=crop&q=80',
    color: '#10B981',
    whatsapp: '+221 78 112 45 88',
    approvalRate: 100,
    monthlyGoal: 16,
  },
];

interface ClientContextType {
  clients: Client[];
  activeClient: Client;
  setActiveClient: (client: Client) => void;
  addClient: (client: Omit<Client, 'id' | 'approvalRate' | 'monthlyGoal'>) => void;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>(DEFAULT_CLIENTS);
  const [activeClient, setActiveClient] = useState<Client>(DEFAULT_CLIENTS[0]);

  const addClient = (newClientData: Omit<Client, 'id' | 'approvalRate' | 'monthlyGoal'>) => {
    const newClient: Client = {
      ...newClientData,
      id: `client-${Date.now()}`,
      approvalRate: 100,
      monthlyGoal: 20,
    };
    setClients((prev) => [...prev, newClient]);
    setActiveClient(newClient);
  };

  return (
    <ClientContext.Provider value={{ clients, activeClient, setActiveClient, addClient }}>
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClient must be used within a ClientProvider');
  }
  return context;
};
