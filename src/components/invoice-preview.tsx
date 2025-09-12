'use client';

import { useInvoiceStore } from '@/store/invoice-store';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';

export function InvoicePreview() {
  const { invoice, getSubtotal, getTotalTax, getTotal } = useInvoiceStore();
  const subtotal = getSubtotal();
  const totalTax = getTotalTax();
  const total = getTotal();
  const discountAmount = subtotal * (invoice.discount / 100);

  const parseDate = (dateString: string) => {
    if (!dateString) return undefined;
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  const formatDate = (dateString: string) => {
    try {
      const date = parseDate(dateString);
      if (date) {
        return format(date, 'PPP');
      }
      return 'Invalid Date';
    } catch {
      return 'Invalid Date';
    }
  }

  return (
    <Card className="shadow-lg lg:sticky lg:top-24 print-shadow-none print-border-none">
      <CardContent className="p-8 md:p-12 print-p-4">
        <header className="flex justify-between items-start mb-12 print-header-mb">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2 font-headline">{invoice.senderName}</h1>
            <p className="text-muted-foreground whitespace-pre-wrap">{invoice.senderAddress}</p>
            <p className="text-muted-foreground">{invoice.senderEmail}</p>
            <p className="text-muted-foreground">{invoice.senderWebsite}</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-semibold text-gray-700">INVOICE</h2>
            <p className="text-muted-foreground">{invoice.invoiceNumber}</p>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-4 mb-12 print-section-mb">
          <div>
            <h3 className="font-semibold text-gray-500 mb-2">BILL TO</h3>
            <p className="font-bold">{invoice.recipientName}</p>
            <p className="text-muted-foreground whitespace-pre-wrap">{invoice.recipientAddress}</p>
            <p className="text-muted-foreground">{invoice.recipientEmail}</p>
          </div>
          <div className="text-right">
            <div className="grid grid-cols-2">
                <span className="font-semibold">Invoice Date:</span>
                <span>{formatDate(invoice.invoiceDate)}</span>
            </div>
            <div className="grid grid-cols-2">
                <span className="font-semibold">Due Date:</span>
                <span>{formatDate(invoice.dueDate)}</span>
            </div>
          </div>
        </section>

        <section>
          <Table>
            <TableHeader>
              <TableRow className='bg-muted-foreground/10'>
                <TableHead className="w-[50%] print-table-cell-p">Item Description</TableHead>
                <TableHead className="text-center print-table-cell-p">Qty</TableHead>
                <TableHead className="text-right print-table-cell-p">Unit Price</TableHead>
                <TableHead className="text-right print-table-cell-p">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.items.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium print-table-cell-p">{item.description}</TableCell>
                  <TableCell className="text-center print-table-cell-p">{item.quantity}</TableCell>
                  <TableCell className="text-right print-table-cell-p">{formatCurrency(item.price, invoice.currency)}</TableCell>
                  <TableCell className="text-right print-table-cell-p">{formatCurrency(item.quantity * item.price, invoice.currency)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
                <TableRow className='border-none'>
                    <TableCell colSpan={2} />
                    <TableCell className='text-right font-medium print-table-cell-p'>Subtotal</TableCell>
                    <TableCell className="text-right print-table-cell-p">{formatCurrency(subtotal, invoice.currency)}</TableCell>
                </TableRow>
                 <TableRow className='border-none'>
                    <TableCell colSpan={2} />
                    <TableCell className='text-right font-medium print-table-cell-p'>Discount ({invoice.discount}%)</TableCell>
                    <TableCell className="text-right text-destructive print-table-cell-p">- {formatCurrency(discountAmount, invoice.currency)}</TableCell>
                </TableRow>
                <TableRow className='border-none'>
                    <TableCell colSpan={2} />
                    <TableCell className='text-right font-medium print-table-cell-p'>Tax</TableCell>
                    <TableCell className="text-right print-table-cell-p">{formatCurrency(totalTax, invoice.currency)}</TableCell>
                </TableRow>
                <TableRow className='border-t-2 border-primary bg-primary/10'>
                    <TableCell colSpan={2} />
                    <TableCell className='text-right text-lg font-bold print-table-cell-p'>Total</TableCell>
                    <TableCell className="text-right text-lg font-bold print-table-cell-p">{formatCurrency(total, invoice.currency)}</TableCell>
                </TableRow>
            </TableFooter>
          </Table>
        </section>

        <Separator className="my-8 print-my-4" />

        <footer className="space-y-4 print-footer-mt">
            <div>
                <h3 className="font-semibold text-gray-500 mb-2">Notes</h3>
                <p className="text-muted-foreground text-sm whitespace-pre-wrap">{invoice.notes}</p>
            </div>
        </footer>
      </CardContent>
    </Card>
  );
}
