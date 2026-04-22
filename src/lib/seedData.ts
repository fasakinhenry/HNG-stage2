import type { Invoice } from '../types/invoice'

export const seedInvoices: Invoice[] = [
  {
    id: 'XM9141',
    createdAt: '2024-09-01',
    paymentDue: '2024-09-08',
    description: 'Brand Identity Design',
    paymentTerms: 7,
    clientName: 'Ada Nwosu',
    clientEmail: 'ada@acme.com',
    status: 'pending',
    senderAddress: {
      street: '19 Union Terrace',
      city: 'Lagos',
      postCode: '100001',
      country: 'Nigeria',
    },
    clientAddress: {
      street: '84 Broad Street',
      city: 'London',
      postCode: 'E1 6AN',
      country: 'United Kingdom',
    },
    items: [
      { id: 'i1', name: 'Logo Concept', quantity: 2, price: 120, total: 240 },
      { id: 'i2', name: 'Brand Guidelines', quantity: 1, price: 316, total: 316 },
    ],
    total: 556,
  },
  {
    id: 'RT3080',
    createdAt: '2024-10-03',
    paymentDue: '2024-11-02',
    description: 'Website UI Refresh',
    paymentTerms: 30,
    clientName: 'Kemi Yusuf',
    clientEmail: 'kemi@fintrek.io',
    status: 'draft',
    senderAddress: {
      street: '15 Admiralty Way',
      city: 'Lekki',
      postCode: '106104',
      country: 'Nigeria',
    },
    clientAddress: {
      street: '72 New Kent Road',
      city: 'London',
      postCode: 'SE1 4YF',
      country: 'United Kingdom',
    },
    items: [
      { id: 'i3', name: 'Landing Page', quantity: 1, price: 420, total: 420 },
    ],
    total: 420,
  },
  {
    id: 'AA1204',
    createdAt: '2024-06-15',
    paymentDue: '2024-07-15',
    description: 'Mobile App Screens',
    paymentTerms: 30,
    clientName: 'Fisayo Bello',
    clientEmail: 'fisayo@digiwave.app',
    status: 'paid',
    senderAddress: {
      street: '7 Marina Crescent',
      city: 'Lagos',
      postCode: '101245',
      country: 'Nigeria',
    },
    clientAddress: {
      street: '2 Albert Embankment',
      city: 'London',
      postCode: 'SE1 7TP',
      country: 'United Kingdom',
    },
    items: [
      { id: 'i4', name: 'Dashboard Flow', quantity: 3, price: 160, total: 480 },
      { id: 'i5', name: 'Prototype', quantity: 1, price: 250, total: 250 },
    ],
    total: 730,
  },
]
