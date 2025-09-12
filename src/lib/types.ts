export type LineItem = {
  id: string;
  description: string;
  quantity: number;
  price: number;
  tax: number;
};

export type Invoice = {
  senderName: string;
  senderAddress: string;
  senderEmail: string;
  senderWebsite: string;
  recipientName: string;
  recipientAddress: string;
  recipientEmail: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  currency: string;
  items: LineItem[];
  notes: string;
  taxRate: number;
  discount: number;
};
