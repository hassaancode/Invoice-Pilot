'use server';
/**
 * @fileOverview Enhances line item descriptions in an invoice to be more understandable.
 *
 * - enhanceLineItemDescriptions - A function that enhances the line item descriptions.
 * - EnhanceLineItemDescriptionsInput - The input type for the enhanceLineItemDescriptions function.
 * - EnhanceLineItemDescriptionsOutput - The return type for the enhanceLineItemDescriptions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceLineItemDescriptionsInputSchema = z.array(
  z.object({
    description: z.string().describe('The original line item description.'),
  })
).describe('An array of line item descriptions to potentially enhance.');

export type EnhanceLineItemDescriptionsInput = z.infer<
  typeof EnhanceLineItemDescriptionsInputSchema
>;

const EnhanceLineItemDescriptionsOutputSchema = z.array(
  z.object({
    enhancedDescription: z
      .string()
      .describe('The enhanced line item description, if needed.  If not needed, it is the same as the original description.'),
  })
).describe('An array of enhanced line item descriptions.');

export type EnhanceLineItemDescriptionsOutput = z.infer<
  typeof EnhanceLineItemDescriptionsOutputSchema
>;

export async function enhanceLineItemDescriptions(
  input: EnhanceLineItemDescriptionsInput
): Promise<EnhanceLineItemDescriptionsOutput> {
  return enhanceLineItemDescriptionsFlow(input);
}

const enhanceLineItemDescriptionsPrompt = ai.definePrompt({
  name: 'enhanceLineItemDescriptionsPrompt',
  input: {schema: EnhanceLineItemDescriptionsInputSchema},
  output: {schema: EnhanceLineItemDescriptionsOutputSchema},
  prompt: `You are an AI assistant helping to enhance invoice line item descriptions.

  You will receive a list of line item descriptions. For each description, assess if it is too terse or unclear for a recipient to understand easily.

  If a description is already clear and sufficiently detailed, return it as is in the enhancedDescription field.

  If a description is too short, vague, or uses internal jargon, rewrite it to be more descriptive and understandable to someone unfamiliar with the product or service. Strive for clarity and professionalism.

  Here are the line item descriptions:
  {{#each this}}
  - Original description: {{{description}}}
  {{/each}}
  
  Return the original descriptions unchanged if they are already clear and understandable. Only modify them if they would benefit from added clarity.
  
  Output a JSON array with an object for each original description, containing the enhancedDescription.
  
  Format:
  [
    {
      "enhancedDescription": "The enhanced or original description"
    },
  ]
  `,
});

const enhanceLineItemDescriptionsFlow = ai.defineFlow(
  {
    name: 'enhanceLineItemDescriptionsFlow',
    inputSchema: EnhanceLineItemDescriptionsInputSchema,
    outputSchema: EnhanceLineItemDescriptionsOutputSchema,
  },
  async input => {
    const {output} = await enhanceLineItemDescriptionsPrompt(input);
    return output!;
  }
);
