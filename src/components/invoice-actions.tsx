'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Printer } from 'lucide-react';

export function InvoiceActions() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground font-headline">
            InvoicePilot
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handlePrint}>
            <Printer />
            <span className="ml-2 hidden sm:inline">Print / Download</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
