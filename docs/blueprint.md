# **App Name**: InvoicePilot

## Core Features:

- Invoice Parameter Definition: Define invoice parameters such as sender/recipient information, invoice number, date, currency, and line items via an interactive form.
- Dynamic Line Item Management: Add, edit, and remove line items with descriptions, quantities, unit prices, and tax rates; calculations should occur dynamically and automatically. Also have the AI tool assess if descriptions are too terse, and automatically make them more understandable to a recipient, if appropriate.
- Tax and Discount Application: Apply taxes (VAT, GST, etc.) and discounts on individual line items or the entire invoice, with automatic recalculation of totals.
- Real-time Preview: Display a real-time preview of the invoice as the user inputs data, ensuring accurate layout and content.
- PDF Generation: Generate a high-quality, printable PDF version of the invoice with a professional layout. Let the AI tool attempt to reformat a suboptimal invoice before automatically generating a PDF of the result.
- Download and Print Options: Provide options to download the generated PDF invoice and print it directly from the application.
- State Management with Zustand: Utilize Zustand for managing the invoice state, ensuring smooth updates and data persistence across the application session.

## Style Guidelines:

- Primary color: Strong blue (#29ABE2), evoking professionalism and trust.
- Background color: Light gray (#F0F2F5), creating a clean and neutral backdrop.
- Accent color: Muted violet (#8E44AD), to provide subtle contrast, distinctiveness, and user focus without harshness.
- Body and headline font: 'Inter' (sans-serif) for a modern and readable interface.
- Use a consistent set of icons from a library like FontAwesome for invoice actions (download, print, edit, etc.).
- Maintain a clean and well-organized layout with clear sections for invoice details, line items, and totals. Focus on readability and visual hierarchy.
- Use subtle animations (e.g., transitions, loading spinners) to enhance user experience and provide feedback during invoice generation and parameter changes.