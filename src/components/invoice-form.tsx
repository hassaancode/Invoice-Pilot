'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { useInvoiceStore } from '@/store/invoice-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Sparkles, Trash2, Loader2, Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export function InvoiceForm() {
  const { invoice, updateField, addItem, updateItem, removeItem, enhanceDescriptions, initializeDates } = useInvoiceStore();
  const [isPending, startTransition] = useTransition();
  const [isEnhancing, setIsEnhancing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    initializeDates();
  }, [initializeDates]);

  const handleDateChange = (field: 'invoiceDate' | 'dueDate', date?: Date) => {
    if (date) {
      updateField(field, format(date, 'yyyy-MM-dd'));
    }
  };
  
  const handleEnhance = () => {
    startTransition(async () => {
      setIsEnhancing(true);
      const success = await enhanceDescriptions();
      if (success) {
        toast({
          title: 'Descriptions Enhanced',
          description: 'Line item descriptions have been improved by AI.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not enhance descriptions.',
        });
      }
      setIsEnhancing(false);
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>From</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="senderName">Name</Label>
              <Input id="senderName" value={invoice.senderName} onChange={(e) => updateField('senderName', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senderAddress">Address</Label>
              <Textarea id="senderAddress" value={invoice.senderAddress} onChange={(e) => updateField('senderAddress', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senderEmail">Email</Label>
              <Input id="senderEmail" type="email" value={invoice.senderEmail} onChange={(e) => updateField('senderEmail', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senderWebsite">Website</Label>
              <Input id="senderWebsite" value={invoice.senderWebsite} onChange={(e) => updateField('senderWebsite', e.target.value)} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>To</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipientName">Name</Label>
              <Input id="recipientName" value={invoice.recipientName} onChange={(e) => updateField('recipientName', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipientAddress">Address</Label>
              <Textarea id="recipientAddress" value={invoice.recipientAddress} onChange={(e) => updateField('recipientAddress', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipientEmail">Email</Label>
              <Input id="recipientEmail" type="email" value={invoice.recipientEmail} onChange={(e) => updateField('recipientEmail', e.target.value)} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="invoiceNumber">Invoice Number</Label>
            <Input id="invoiceNumber" value={invoice.invoiceNumber} onChange={(e) => updateField('invoiceNumber', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Invoice Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !invoice.invoiceDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {invoice.invoiceDate ? format(new Date(invoice.invoiceDate), "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={invoice.invoiceDate ? new Date(invoice.invoiceDate) : undefined} onSelect={(d) => handleDateChange('invoiceDate', d)} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label>Due Date</Label>
             <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !invoice.dueDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {invoice.dueDate ? format(new Date(invoice.dueDate), "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={invoice.dueDate ? new Date(invoice.dueDate) : undefined} onSelect={(d) => handleDateChange('dueDate', d)} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Line Items</CardTitle>
          <Button variant="outline" size="sm" onClick={handleEnhance} disabled={isPending || isEnhancing}>
             {isEnhancing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            <span className="ml-2">Enhance</span>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Description</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Tax (%)</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell><Input value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} /></TableCell>
                  <TableCell><Input type="number" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)} className="w-16" /></TableCell>
                  <TableCell><Input type="number" value={item.price} onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)} className="w-24" /></TableCell>
                  <TableCell><Input type="number" value={item.tax} onChange={(e) => updateItem(item.id, 'tax', parseFloat(e.target.value) || 0)} className="w-20" /></TableCell>
                  <TableCell className="text-right font-medium">{(item.quantity * item.price * (1 + item.tax/100)).toFixed(2)}</TableCell>
                  <TableCell><Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}><Trash2 className="h-4 w-4" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button onClick={addItem} variant="outline" className="mt-4">
            <Plus className="mr-2 h-4 w-4" /> Add Item
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input id="currency" value={invoice.currency} onChange={(e) => updateField('currency', e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="taxRate">Overall Tax (%)</Label>
                <Input id="taxRate" type="number" value={invoice.taxRate} onChange={(e) => updateField('taxRate', parseFloat(e.target.value) || 0)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="discount">Discount (%)</Label>
                <Input id="discount" type="number" value={invoice.discount} onChange={(e) => updateField('discount', parseFloat(e.target.value) || 0)} />
            </div>
            <div className="space-y-2 sm:col-span-3">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" value={invoice.notes} onChange={(e) => updateField('notes', e.target.value)} />
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
