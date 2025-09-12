'use server';
/**
 * @fileOverview This file defines a Genkit flow to reformat a suboptimal invoice for printing.
 *
 * The flow takes an invoice as input and attempts to reformat it to ensure a professional-looking printed output.
 * It exports:
 * - `reformatInvoiceForPrint` - A function that reformats the invoice.
 * - `ReformatInvoiceForPrintInput` - The input type for the `reformatInvoiceForPrint` function.
 * - `ReformatInvoiceForPrintOutput` - The return type for the `reformatInvoiceForPrint` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReformatInvoiceForPrintInputSchema = z.object({
  invoiceData: z.string().describe('The invoice data as a JSON string.'),
});

export type ReformatInvoiceForPrintInput = z.infer<typeof ReformatInvoiceForPrintInputSchema>;

const ReformatInvoiceForPrintOutputSchema = z.object({
  reformattedInvoiceData: z
    .string()
    .describe('The reformatted invoice data as a JSON string.'),
});

export type ReformatInvoiceForPrintOutput = z.infer<typeof ReformatInvoiceForPrintOutputSchema>;

export async function reformatInvoiceForPrint(input: ReformatInvoiceForPrintInput): Promise<ReformatInvoiceForPrintOutput> {
  return reformatInvoiceForPrintFlow(input);
}

const reformatInvoiceForPrintPrompt = ai.definePrompt({
  name: 'reformatInvoiceForPrintPrompt',
  input: {schema: ReformatInvoiceForPrintInputSchema},
  output: {schema: ReformatInvoiceForPrintOutputSchema},
  prompt: `You are an AI assistant that specializes in reformatting invoice data for optimal printing.

  Your goal is to take potentially poorly formatted invoice data and reformat it into a clean,
  professional-looking structure suitable for generating a PDF.

  Here are some guidelines for reformatting:
  - Ensure consistent spacing and alignment of all data fields.
  - Standardize date formats (e.g., YYYY-MM-DD).
  - Use clear and concise labels for all fields (e.g., "Invoice Number" instead of "Inv#").
  - Verify that numerical values are properly formatted with appropriate decimal places and currency symbols.
  - Confirm that address details are structured correctly with line breaks for street, city, and postal code.
  - Reformat line items to have consistent spacing and alignment for description, quantity, unit price, and total amount.

  Take the following invoice data:
  {{{invoiceData}}}

  Return the reformatted invoice data as a JSON string.
  `,
});

const reformatInvoiceForPrintFlow = ai.defineFlow(
  {
    name: 'reformatInvoiceForPrintFlow',
    inputSchema: ReformatInvoiceForPrintInputSchema,
    outputSchema: ReformatInvoiceForPrintOutputSchema,
  },
  async input => {
    const {output} = await reformatInvoiceForPrintPrompt(input);
    return output!;
  }
);
