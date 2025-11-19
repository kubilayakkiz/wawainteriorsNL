-- Add new columns to quotes table for better quote management
-- Run this in Supabase SQL Editor

-- Add proposal document URL (for PDF/Word documents)
ALTER TABLE quotes 
ADD COLUMN IF NOT EXISTS proposal_document_url TEXT;

-- Add quote amount (the actual quote/price you're offering)
ALTER TABLE quotes 
ADD COLUMN IF NOT EXISTS quote_amount DECIMAL(12,2);

-- Add attachments array (for multiple files like images, documents, etc.)
ALTER TABLE quotes 
ADD COLUMN IF NOT EXISTS attachment_urls TEXT[] DEFAULT '{}';

-- Add customer visible notes (notes that customer can see in their panel)
ALTER TABLE quotes 
ADD COLUMN IF NOT EXISTS customer_visible_notes TEXT;

-- Add proposal description (detailed proposal text)
ALTER TABLE quotes 
ADD COLUMN IF NOT EXISTS proposal_description TEXT;

-- Add proposed timeline (when you expect to complete the project)
ALTER TABLE quotes 
ADD COLUMN IF NOT EXISTS proposed_timeline TEXT;

-- Comments: 
-- - proposal_document_url: Link to uploaded proposal document (PDF, Word, etc.)
-- - quote_amount: The price you're quoting (e.g., 50000.00 for €50,000)
-- - attachment_urls: Array of URLs for attachments (images, documents, etc.)
-- - customer_visible_notes: Notes visible to customer in their panel
-- - proposal_description: Detailed proposal text
-- - proposed_timeline: Expected timeline for project completion

