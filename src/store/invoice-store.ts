'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Invoice, LineItem } from '@/lib/types';

interface InvoiceState {
  invoice: Invoice;
  setInvoice: (invoice: Invoice) => void;
  updateField: (field: keyof Invoice, value: any) => void;
  addItem: () => void;
  updateItem: (id: string, field: keyof LineItem, value: any) => void;
  removeItem: (id: string) => void;
  getSubtotal: () => number;
  getTotalTax: () => number;
  getTotal: () => number;
  initializeDates: () => void;
}

const initialInvoice: Invoice = {
  senderName: 'Your Company',
  senderAddress: '123 Main St, Anytown, USA 12345',
  senderEmail: 'your@email.com',
  senderWebsite: 'your-website.com',
  recipientName: 'Client Inc.',
  recipientAddress: '456 Oak Ave, Otherville, USA 54321',
  recipientEmail: 'client@email.com',
  invoiceNumber: 'INV-001',
  invoiceDate: '', // Set to empty string initially
  dueDate: '', // Set to empty string initially
  currency: 'USD',
  items: [
    { id: '1', description: 'Web design services', quantity: 10, price: 100, tax: 0 },
    { id: '2', description: 'Hosting (1 year)', quantity: 1, price: 300, tax: 0 },
  ],
  notes: 'Thank you for your business.',
  taxRate: 8,
  discount: 5,
};

export const useInvoiceStore = create<InvoiceState>()(
  persist(
    (set, get) => ({
      invoice: initialInvoice,
      setInvoice: (invoice) => set({ invoice }),
      updateField: (field, value) => set(state => ({ invoice: { ...state.invoice, [field]: value } })),
      addItem: () => set(state => ({
        invoice: {
          ...state.invoice,
          items: [
            ...state.invoice.items,
            { id: Date.now().toString(), description: '', quantity: 1, price: 0, tax: 0 },
          ],
        },
      })),
      updateItem: (id, field, value) => set(state => ({
        invoice: {
          ...state.invoice,
          items: state.invoice.items.map(item =>
            item.id === id ? { ...item, [field]: value } : item
          ),
        },
      })),
      removeItem: (id) => set(state => ({
        invoice: {
          ...state.invoice,
          items: state.invoice.items.filter(item => item.id !== id),
        },
      })),
      getSubtotal: () => {
        const { invoice } = get();
        return invoice.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
      },
      getTotalTax: () => {
        const { invoice } = get();
        const subtotal = get().getSubtotal();
        const itemTaxes = invoice.items.reduce((acc, item) => acc + (item.quantity * item.price * (item.tax / 100)), 0);
        const overallTax = subtotal * (invoice.taxRate / 100);
        return itemTaxes + overallTax;
      },
      getTotal: () => {
        const { invoice } = get();
        const subtotal = get().getSubtotal();
        const totalTax = get().getTotalTax();
        const discountAmount = subtotal * (invoice.discount / 100);
        return subtotal + totalTax - discountAmount;
      },
      initializeDates: () => {
        const { invoice } = get();
        if (!invoice.invoiceDate && !invoice.dueDate) {
          set({
            invoice: {
              ...invoice,
              invoiceDate: new Date().toISOString().split('T')[0],
              dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            }
          });
        }
      },
    }),
    {
      name: 'invoice-pilot-session',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
