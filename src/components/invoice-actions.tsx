'use client';

import React, { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useInvoiceStore } from '@/store/invoice-store';
import { FileText, Printer, Sparkles, Loader2 } from 'lucide-react';

export function InvoiceActions() {
  const [isPending, startTransition] = useTransition();
  const [isFormatting, setIsFormatting] = useState(false);
  const { toast } = useToast();
  const reformatInvoice = useInvoiceStore(state => state.reformatInvoice);

  const handlePrint = () => {
    window.print();
  };

  const handleAiFormat = () => {
    startTransition(async () => {
      setIsFormatting(true);
      const success = await reformatInvoice();
      if (success) {
        toast({
          title: 'Invoice Reformatted',
          description: 'The AI has updated the invoice data.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not reformat invoice.',
        });
      }
      setIsFormatting(false);
    });
  };

  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground font-headline">
            InvoicePilot
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleAiFormat}
            disabled={isPending || isFormatting}
          >
            {isFormatting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Sparkles />
            )}
            <span className="ml-2 hidden sm:inline">AI Format</span>
          </Button>
          <Button onClick={handlePrint}>
            <Printer />
            <span className="ml-2 hidden sm:inline">Print / Download</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
