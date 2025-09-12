'use client';

import { InvoiceActions } from '@/components/invoice-actions';
import { InvoiceForm } from '@/components/invoice-form';
import { InvoicePreview } from '@/components/invoice-preview';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <div className="print-hidden">
        <InvoiceActions />
      </div>

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 sm:p-8">
        <div className="print-hidden">
          <InvoiceForm />
        </div>
        <div id="invoice-preview" className="w-full">
          <InvoicePreview />
        </div>
      </main>
    </div>
  );
}
