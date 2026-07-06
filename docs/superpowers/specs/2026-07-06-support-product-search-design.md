# Support Page Product Document Search

## Problem

The current support page (`app/support/page.tsx`) is a static page with 5 hardcoded product-line categories (Edge Series, Touch Panel, Color Series, Royal Edge, Accessories), each with a fake downloads list (buttons with no real file links, made-up file sizes), a generic specs table, and generic FAQs. None of it is tied to the real 69-product catalog in Firestore, and there is no way to find documents for a specific product.

We're rebuilding this into a search-first page: a customer types a product name or the serial number printed on their physical unit, and gets that exact product's manuals, install guides, spec sheets, and software/firmware downloads.

## Data model

**`products` collection** (existing) gains one new optional field:
- `serialPrefix: string` — e.g. `"XV-4TP"`. Identifies which product a physical unit's serial number belongs to. Set per-product by an admin. Not all products need one immediately.

**New Firestore collection: `productDocuments`**
```
{
  id: string                // Firestore doc id
  productId: string          // FK to products/{id}
  productName: string         // denormalized, for display without a join
  category: 'manual' | 'installGuide' | 'specSheet' | 'software'
  title: string               // e.g. "Installation Guide v2"
  storagePath: string          // e.g. "support-docs/4-touch-pro/install-guide.pdf"
  fileType: string             // extension, e.g. "pdf", "bin", "apk"
  fileSize: number             // bytes
  uploadedAt: Timestamp
}
```

**Storage**: new folder `support-docs/{productId}/{filename}` in the existing bucket (`cube-8c773.firebasestorage.app`), same bucket as product images.

## Serial number format

Serial numbers encode their product model via a prefix, e.g. `XV-4TP-000123` → prefix `XV-4TP` → product with `serialPrefix: "XV-4TP"`. No separate per-unit registry is needed; lookup is a direct field match against `products.serialPrefix`. The exact prefix values are assigned by whoever manages the catalog (via the new admin UI), not derived automatically — this design doesn't invent a numbering scheme, it just wires up the lookup.

## Public support page (`app/support/page.tsx`, rebuilt)

- Hero + single search input: "Search by product name or serial number"
- Fetches a lightweight product index once: `GET /api/support/products` → `{ id, name, category, serialPrefix, imageUrl }[]` (no price/stock — this is a leaner read than the shop's `/api/products`)
- Client-side match on every keystroke (debounced):
  - If the query matches a serial-like pattern (`PREFIX-XXXXXX`, alphanumeric with dashes), strip the trailing numeric segment and match the remainder against `serialPrefix` (case-insensitive exact match)
  - Otherwise, fuzzy substring match against `name` (case-insensitive, matches anywhere in the string)
- **Multiple matches** (typical for a name search): show a result list (image + name) to pick from
- **Single/exact match** (typical for a serial number): jump straight to that product's document view
- **No match**: show an empty state pointing at the ticket form below
- **Document view** for a selected product:
  - Product name + image header
  - Documents grouped under four headers: Manuals, Install Guides, Spec Sheets, Software. Empty groups are hidden entirely (a product with only a manual just shows a "Manuals" section).
  - Each document is a real download link: `GET /api/support/documents?productId=X` returns the doc list with a signed Storage URL per file (same signing pattern as `app/api/products/route.ts`), generated fresh on each request (short expiry, e.g. 1 hour, is fine since it's fetched live)
- **Dropped**: the old hardcoded Specifications table and FAQ accordion (both were generic per-category text, not tied to real per-product data, and out of scope for this change)
- **Kept as-is**: the support ticket form at the bottom (name/email/product/subject/message → `POST /api/support/ticket`). The product `<select>` in that form now lists the 69 real products instead of the 5 fake categories.

## Admin document management (new: `/dashboard/admin/documents`)

New page, added to the admin sidebar nav (`app/dashboard/admin/layout.tsx`) alongside Orders/Users/Devices/Configs.

- **Product picker**: search-as-you-type across the 69 products (reuses `/api/support/products` or a similar admin list). Selecting a product shows:
  - An inline editable `serialPrefix` field for that product (saved via existing `PUT /api/products/[id]`, which already accepts arbitrary body fields and already requires admin auth)
  - Its current document list, each row deletable
  - An upload form: file picker + category dropdown (Manual / Install Guide / Spec Sheet / Software) + title text input

**New API routes** (all admin-only via the existing `requireAdmin` middleware from `lib/auth-middleware.ts`):
- `POST /api/admin/documents` — multipart form upload. Saves file to `support-docs/{productId}/{filename}` in Storage, writes a `productDocuments` doc.
- `GET /api/admin/documents?productId=X` — list documents for a product (admin view; same shape as the public one but no signed-URL generation needed for the list-and-delete UI, storagePath is enough).
- `DELETE /api/admin/documents/[docId]` — deletes the Storage file and the Firestore doc.

**New public API route**:
- `GET /api/support/products` — public, lightweight product index for the search page (id/name/category/serialPrefix/imageUrl).
- `GET /api/support/documents?productId=X` — public, returns a product's documents with freshly-signed download URLs.

## Out of scope

- Auto-generating or validating serial number formats/checksums — admins type the prefix in free-form.
- A per-unit serial registry (e.g. tracking which specific serial numbers have shipped to which customers) — this design only maps a serial *prefix* to a product, not individual units to orders.
- Migrating/authoring actual document content — ships with zero documents; admin uploads them afterward through the new UI.
- Keeping the old category-based Specifications/FAQ content in any form.
