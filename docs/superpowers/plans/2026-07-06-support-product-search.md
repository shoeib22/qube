# Support Product Document Search Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the support page around a search box (product name or device serial number) that surfaces a specific product's manuals/install guides/spec sheets/software, with a new admin page to upload and manage those documents.

**Architecture:** Two new Firestore-backed API layers (public read, admin write) mirroring the existing `products` API conventions in this codebase, a new admin dashboard page for uploading documents, and a rebuilt public support page that replaces the old hardcoded 5-category browsing UI with search.

**Tech Stack:** Next.js 16 App Router route handlers, Firebase Admin SDK (Firestore + Storage), Firebase Client SDK (auth token for admin calls), Tailwind CSS. No new dependencies.

## Global Constraints

- Firebase project `cube-8c773`, Firestore named-database `qube-tech`, Storage bucket `cube-8c773.firebasestorage.app` — use these exact values, matching `lib/firebaseAdmin.ts`.
- All admin-only API routes must call `requireAdmin(request)` from `lib/auth-middleware.ts` as the first line, matching `app/api/products/[id]/route.ts` and `app/api/admin/devices/route.ts`.
- Use Next.js 16's Promise-based route params — `{ params }: { params: Promise<{ id: string }> }`, then `const { id } = await params;` — matching `app/api/products/[id]/route.ts` (not the older non-Promise pattern in `app/api/admin/devices/[deviceId]/route.ts`).
- **No test framework exists in this project** (no jest/vitest in `package.json`, no `*.test.*` files anywhere). Per this project's established convention, verification is via `curl` for API request/response checks and manual browser testing via `npm run dev` — not unit tests. Each task's verification steps reflect this.
- New Firestore collection `productDocuments` needs a `firestore.rules` entry: public read, admin write — matching the existing `products` collection rule.
- Dark admin theme: `bg-black`/`bg-white/5` surfaces, white text, `#f2994a` accent (matches `app/dashboard/admin/devices/page.tsx`). Public support page theme: white background, `#155cfc` blue accent (matches current `app/support/page.tsx`).
- JSX text containing an apostrophe must be wrapped as a string expression (e.g. `{"We'll help"}`), not raw JSX text — matches existing convention in `app/support/page.tsx` and avoids the `react/no-unescaped-entities` ESLint rule already enforced in this project (see recent commit "fix all eslint and typescript problems across the project").

---

### Task 1: Public product index API

**Files:**
- Create: `app/api/support/products/route.ts`

**Interfaces:**
- Produces: `GET /api/support/products` → `{ success: true, products: { id: string, name: string, category: string, serialPrefix: string | null, imageUrl: string | null }[] }`. Consumed by Task 5 and Task 6.

- [ ] **Step 1: Write the route**

```typescript
// app/api/support/products/route.ts
import { db, storage } from '@/lib/firebaseAdmin';

export async function GET() {
  if (!db) {
    return Response.json({ success: false, error: 'Firebase not initialized.' }, { status: 500 });
  }

  const snapshot = await db.collection('products').where('isActive', '==', true).get();

  const products = await Promise.all(snapshot.docs.map(async (doc) => {
    const data = doc.data();
    let imageUrl: string | null = data.imageUrl || null;

    if (data.image && !imageUrl && storage) {
      try {
        const bucket = storage.bucket();
        const file = bucket.file(data.image);
        const [url] = await file.getSignedUrl({
          version: 'v4',
          action: 'read',
          expires: Date.now() + 60 * 60 * 1000,
        });
        imageUrl = url;
      } catch {
        imageUrl = null;
      }
    }

    return {
      id: doc.id,
      name: (data.name as string) || 'Unnamed Product',
      category: (data.category as string) || 'General',
      serialPrefix: (data.serialPrefix as string) || null,
      imageUrl,
    };
  }));

  return Response.json({ success: true, products });
}
```

- [ ] **Step 2: Start the dev server**

Run: `npm run dev`
Expected: server starts on `http://localhost:3000` with no errors in the terminal.

- [ ] **Step 3: Verify the endpoint**

Run: `curl -s http://localhost:3000/api/support/products`
Expected: JSON with `"success":true` and a `products` array of ~69 items (the current active catalog), each with `"serialPrefix":null` (none set yet — that's expected, Task 5 adds a way to set it).

- [ ] **Step 4: Commit**

```bash
git add app/api/support/products/route.ts
git commit -m "Add public product index API for support search"
```

---

### Task 2: Admin documents list/create API + Firestore rule

**Files:**
- Modify: `firestore.rules`
- Create: `app/api/admin/documents/route.ts`

**Interfaces:**
- Consumes: `requireAdmin` from `lib/auth-middleware.ts`; `db` from `lib/firebaseAdmin.ts`; `adminApp` (default export) from `lib/firebaseAdmin.ts`.
- Produces: `GET /api/admin/documents?productId=X` → `{ documents: { id, productId, productName, category, title, storagePath, fileType, fileSize }[] }`. `POST /api/admin/documents` (multipart form: `file`, `productId`, `productName`, `category`, `title`) → `201 { document: {...} }`. Consumed by Task 5 (admin UI).

- [ ] **Step 1: Add the Firestore rule**

In `firestore.rules`, add this block inside `match /databases/{database}/documents { ... }`, right after the existing `match /products/{productId} { ... }` block:

```
    // Product documents (manuals/guides/specs/software): public read, admin write
    match /productDocuments/{docId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.role == 'admin';
    }
```

- [ ] **Step 2: Write the admin documents API route**

```typescript
// app/api/admin/documents/route.ts
import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth-middleware';
import { db } from '@/lib/firebaseAdmin';
import adminApp from '@/lib/firebaseAdmin';
import { getStorage } from 'firebase-admin/storage';
import { FieldValue } from 'firebase-admin/firestore';

const ALLOWED_CATEGORIES = ['manual', 'installGuide', 'specSheet', 'software'] as const;
type DocCategory = typeof ALLOWED_CATEGORIES[number];

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  if (!db) return Response.json({ error: 'Database unavailable' }, { status: 503 });

  const productId = request.nextUrl.searchParams.get('productId');
  if (!productId) return Response.json({ error: 'productId required' }, { status: 400 });

  const snapshot = await db.collection('productDocuments')
    .where('productId', '==', productId)
    .get();

  const documents = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return Response.json({ documents });
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  if (!db) return Response.json({ error: 'Database unavailable' }, { status: 503 });

  const formData = await request.formData();
  const file = formData.get('file');
  const productId = formData.get('productId');
  const productName = formData.get('productName');
  const category = formData.get('category');
  const title = formData.get('title');

  if (!(file instanceof File)) return Response.json({ error: 'file required' }, { status: 400 });
  if (typeof productId !== 'string' || !productId) return Response.json({ error: 'productId required' }, { status: 400 });
  if (typeof productName !== 'string' || !productName) return Response.json({ error: 'productName required' }, { status: 400 });
  if (typeof category !== 'string' || !ALLOWED_CATEGORIES.includes(category as DocCategory)) {
    return Response.json({ error: `category must be one of ${ALLOWED_CATEGORIES.join(', ')}` }, { status: 400 });
  }
  if (typeof title !== 'string' || !title) return Response.json({ error: 'title required' }, { status: 400 });

  const fileType = (file.name.split('.').pop() || 'bin').toLowerCase();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `support-docs/${productId}/${Date.now()}_${safeName}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const bucket = getStorage(adminApp).bucket('cube-8c773.firebasestorage.app');
  await bucket.file(storagePath).save(buffer, {
    contentType: file.type || 'application/octet-stream',
  });

  const ref = db.collection('productDocuments').doc();
  const docData = {
    id: ref.id,
    productId,
    productName,
    category,
    title,
    storagePath,
    fileType,
    fileSize: buffer.length,
    uploadedAt: FieldValue.serverTimestamp(),
  };
  await ref.set(docData);

  return Response.json({ document: docData }, { status: 201 });
}
```

- [ ] **Step 3: Verify auth is enforced**

Run: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/admin/documents?productId=cabinet-lock`
Expected: `401`

Run: `curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3000/api/admin/documents`
Expected: `401`

(Full upload round-trip is verified in Task 5 with a real admin session, since it needs a valid ID token.)

- [ ] **Step 4: Commit**

```bash
git add firestore.rules app/api/admin/documents/route.ts
git commit -m "Add admin API to list and upload product documents"
```

---

### Task 3: Admin document delete API

**Files:**
- Create: `app/api/admin/documents/[docId]/route.ts`

**Interfaces:**
- Consumes: same as Task 2.
- Produces: `DELETE /api/admin/documents/{docId}` → `{ ok: true }` or `404` if not found. Consumed by Task 5.

- [ ] **Step 1: Write the route**

```typescript
// app/api/admin/documents/[docId]/route.ts
import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth-middleware';
import { db } from '@/lib/firebaseAdmin';
import adminApp from '@/lib/firebaseAdmin';
import { getStorage } from 'firebase-admin/storage';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ docId: string }> }
) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  if (!db) return Response.json({ error: 'Database unavailable' }, { status: 503 });

  const { docId } = await params;
  const docRef = db.collection('productDocuments').doc(docId);
  const doc = await docRef.get();

  if (!doc.exists) return Response.json({ error: 'Document not found' }, { status: 404 });

  const { storagePath } = doc.data() as { storagePath: string };
  const bucket = getStorage(adminApp).bucket('cube-8c773.firebasestorage.app');

  try {
    await bucket.file(storagePath).delete();
  } catch (err) {
    console.error('Failed to delete storage file, continuing to remove Firestore doc:', err);
  }

  await docRef.delete();

  return Response.json({ ok: true });
}
```

- [ ] **Step 2: Verify auth is enforced**

Run: `curl -s -o /dev/null -w "%{http_code}" -X DELETE http://localhost:3000/api/admin/documents/fake-id`
Expected: `401`

- [ ] **Step 3: Commit**

```bash
git add app/api/admin/documents/[docId]/route.ts
git commit -m "Add admin API to delete product documents"
```

---

### Task 4: Public documents API

**Files:**
- Create: `app/api/support/documents/route.ts`

**Interfaces:**
- Consumes: `db` and default-exported `adminApp` from `lib/firebaseAdmin.ts`.
- Produces: `GET /api/support/documents?productId=X` → `{ documents: { id, category, title, fileType, fileSize, downloadUrl }[] }`. Consumed by Task 6.

- [ ] **Step 1: Write the route**

```typescript
// app/api/support/documents/route.ts
import { NextRequest } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import adminApp from '@/lib/firebaseAdmin';
import { getStorage } from 'firebase-admin/storage';

export async function GET(request: NextRequest) {
  if (!db) return Response.json({ error: 'Database unavailable' }, { status: 503 });

  const productId = request.nextUrl.searchParams.get('productId');
  if (!productId) return Response.json({ error: 'productId required' }, { status: 400 });

  const snapshot = await db.collection('productDocuments')
    .where('productId', '==', productId)
    .get();

  const bucket = getStorage(adminApp).bucket('cube-8c773.firebasestorage.app');

  const documents = await Promise.all(snapshot.docs.map(async (doc) => {
    const data = doc.data();
    let downloadUrl: string | null = null;
    try {
      const [url] = await bucket.file(data.storagePath).getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 60 * 60 * 1000,
      });
      downloadUrl = url;
    } catch (err) {
      console.error(`Signed URL failed for document ${doc.id}:`, err);
    }

    return {
      id: doc.id,
      category: data.category,
      title: data.title,
      fileType: data.fileType,
      fileSize: data.fileSize,
      downloadUrl,
    };
  }));

  return Response.json({ documents });
}
```

- [ ] **Step 2: Verify the endpoint**

Run: `curl -s "http://localhost:3000/api/support/documents?productId=cabinet-lock"`
Expected: `{"documents":[]}` (no documents uploaded yet — that's expected until Task 5's manual upload test).

- [ ] **Step 3: Commit**

```bash
git add app/api/support/documents/route.ts
git commit -m "Add public API to fetch a product's support documents"
```

---

### Task 5: Admin document management page

**Files:**
- Create: `app/dashboard/admin/documents/page.tsx`
- Modify: `app/dashboard/admin/layout.tsx:10-18` (add nav entry)

**Interfaces:**
- Consumes: `useAuth` from `@/context/AuthContext` (provides `user` with `.getIdToken()`); `GET /api/support/products`; `GET/POST /api/admin/documents`; `DELETE /api/admin/documents/{docId}`; `PUT /api/products/{id}` (existing route, accepts arbitrary body fields merged into the product doc — used here to persist `serialPrefix`).
- Produces: page at `/dashboard/admin/documents`.

- [ ] **Step 1: Add the nav entry**

In `app/dashboard/admin/layout.tsx`, the `menuItems` array currently reads:

```typescript
  const menuItems = [
    { name: 'Analytics', href: '/dashboard/admin', icon: '📊' },
    { name: 'Order Management', href: '/dashboard/admin/orders', icon: '📦' },
    { name: 'Product Catalog', href: '/dashboard/admin/products', icon: '🏷️' },
    { name: 'User Directory', href: '/dashboard/admin/users', icon: '👥' },
    { name: 'Devices', href: '/dashboard/admin/devices', icon: '🔌' },
    { name: 'Panel Configs', href: '/dashboard/admin/configs', icon: '🎨' },
    { name: 'System Settings', href: '/dashboard/admin/settings', icon: '⚙️' },
  ];
```

Add a `Support Documents` entry after `Panel Configs`:

```typescript
  const menuItems = [
    { name: 'Analytics', href: '/dashboard/admin', icon: '📊' },
    { name: 'Order Management', href: '/dashboard/admin/orders', icon: '📦' },
    { name: 'Product Catalog', href: '/dashboard/admin/products', icon: '🏷️' },
    { name: 'User Directory', href: '/dashboard/admin/users', icon: '👥' },
    { name: 'Devices', href: '/dashboard/admin/devices', icon: '🔌' },
    { name: 'Panel Configs', href: '/dashboard/admin/configs', icon: '🎨' },
    { name: 'Support Documents', href: '/dashboard/admin/documents', icon: '📄' },
    { name: 'System Settings', href: '/dashboard/admin/settings', icon: '⚙️' },
  ];
```

- [ ] **Step 2: Write the admin documents page**

```tsx
// app/dashboard/admin/documents/page.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface SupportProduct {
  id: string;
  name: string;
  category: string;
  serialPrefix: string | null;
  imageUrl: string | null;
}

interface ProductDocument {
  id: string;
  productId: string;
  productName: string;
  category: "manual" | "installGuide" | "specSheet" | "software";
  title: string;
  storagePath: string;
  fileType: string;
  fileSize: number;
}

const CATEGORY_LABELS: Record<ProductDocument["category"], string> = {
  manual: "Manual",
  installGuide: "Install Guide",
  specSheet: "Spec Sheet",
  software: "Software",
};

export default function AdminDocumentsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<SupportProduct[]>([]);
  const [productQuery, setProductQuery] = useState("");
  const [selected, setSelected] = useState<SupportProduct | null>(null);
  const [serialPrefixInput, setSerialPrefixInput] = useState("");
  const [savingPrefix, setSavingPrefix] = useState(false);

  const [documents, setDocuments] = useState<ProductDocument[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);

  const [uploadCategory, setUploadCategory] = useState<ProductDocument["category"]>("manual");
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/support/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products ?? []));
  }, []);

  const fetchDocuments = useCallback(async (productId: string) => {
    if (!user) return;
    setLoadingDocs(true);
    const token = await user.getIdToken();
    const res = await fetch(`/api/admin/documents?productId=${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setDocuments(data.documents ?? []);
    setLoadingDocs(false);
  }, [user]);

  const selectProduct = (p: SupportProduct) => {
    setSelected(p);
    setSerialPrefixInput(p.serialPrefix ?? "");
    fetchDocuments(p.id);
  };

  const saveSerialPrefix = async () => {
    if (!user || !selected) return;
    setSavingPrefix(true);
    const token = await user.getIdToken();
    await fetch(`/api/products/${selected.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ serialPrefix: serialPrefixInput }),
    });
    setSelected({ ...selected, serialPrefix: serialPrefixInput });
    setSavingPrefix(false);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selected || !uploadFile) return;
    setUploading(true);
    setUploadError(null);

    const token = await user.getIdToken();
    const body = new FormData();
    body.append("file", uploadFile);
    body.append("productId", selected.id);
    body.append("productName", selected.name);
    body.append("category", uploadCategory);
    body.append("title", uploadTitle);

    const res = await fetch("/api/admin/documents", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body,
    });

    if (res.ok) {
      setUploadTitle("");
      setUploadFile(null);
      fetchDocuments(selected.id);
    } else {
      const data = await res.json();
      setUploadError(data.error ?? "Upload failed");
    }
    setUploading(false);
  };

  const deleteDocument = async (docId: string) => {
    if (!user || !selected) return;
    const token = await user.getIdToken();
    await fetch(`/api/admin/documents/${docId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchDocuments(selected.id);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productQuery.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tight text-white">Support Documents</h1>
        <p className="text-gray-500 text-sm mt-1">Upload manuals, install guides, spec sheets, and software for each product</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div>
          <input
            value={productQuery}
            onChange={(e) => setProductQuery(e.target.value)}
            placeholder="Search products…"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white mb-3 focus:outline-none focus:border-[#f2994a]"
          />
          <div className="space-y-1 max-h-[60vh] overflow-y-auto">
            {filteredProducts.map((p) => (
              <button
                key={p.id}
                onClick={() => selectProduct(p)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                  selected?.id === p.id ? "bg-[#f2994a] text-black" : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {p.name}
                {p.serialPrefix && <span className="block text-[10px] font-mono opacity-60">{p.serialPrefix}</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          {!selected ? (
            <div className="text-gray-600 text-sm py-20 text-center">Select a product to manage its documents</div>
          ) : (
            <div className="space-y-8">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Serial Prefix</label>
                <div className="flex gap-2">
                  <input
                    value={serialPrefixInput}
                    onChange={(e) => setSerialPrefixInput(e.target.value)}
                    placeholder="e.g. XV-4TP"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-[#f2994a]"
                  />
                  <button
                    onClick={saveSerialPrefix}
                    disabled={savingPrefix}
                    className="px-5 py-2.5 bg-[#f2994a] text-black font-bold rounded-xl text-sm disabled:opacity-60"
                  >
                    {savingPrefix ? "Saving…" : "Save"}
                  </button>
                </div>
              </div>

              <div>
                <h2 className="text-sm font-black text-white mb-3">Documents for {selected.name}</h2>
                {loadingDocs ? (
                  <div className="text-gray-600 text-sm">Loading…</div>
                ) : documents.length === 0 ? (
                  <div className="text-gray-600 text-sm">No documents uploaded yet</div>
                ) : (
                  <div className="space-y-2 mb-6">
                    {documents.map((d) => (
                      <div key={d.id} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                        <div>
                          <p className="text-sm font-bold text-white">{d.title}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">
                            {CATEGORY_LABELS[d.category]} · {d.fileType.toUpperCase()} · {(d.fileSize / 1024).toFixed(0)} KB
                          </p>
                        </div>
                        <button
                          onClick={() => deleteDocument(d.id)}
                          className="text-xs font-bold text-red-400 hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <form onSubmit={handleUpload} className="space-y-3 border-t border-white/10 pt-6">
                <h2 className="text-sm font-black text-white">Upload New Document</h2>
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value as ProductDocument["category"])}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#f2994a]"
                  >
                    <option value="manual">Manual</option>
                    <option value="installGuide">Install Guide</option>
                    <option value="specSheet">Spec Sheet</option>
                    <option value="software">Software</option>
                  </select>
                  <input
                    required
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="Title, e.g. Installation Guide v2"
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#f2994a]"
                  />
                </div>
                <input
                  required
                  type="file"
                  onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
                  className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-[#f2994a] file:text-black file:font-bold"
                />
                {uploadError && <p className="text-sm text-red-400">{uploadError}</p>}
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full py-3 bg-[#f2994a] text-black font-bold rounded-xl disabled:opacity-60"
                >
                  {uploading ? "Uploading…" : "Upload Document"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Ensure an admin account exists**

If you don't already have an admin user to test with:
Run: `npm run make-admin`
Follow its prompts (see `scripts/make-admin.js`) to promote an existing user's Firestore `role` to `admin`.

- [ ] **Step 4: Manual verification in the browser**

1. Run: `npm run dev`
2. Go to `http://localhost:3000/login` and log in as the admin account
3. Go to `http://localhost:3000/dashboard/admin/documents`
4. Expected: "Support Documents" appears in the sidebar nav; the page loads with a product search box and a list of products
5. Type "Cabinet Lock" in the product search, click it
6. Expected: right panel shows a "Serial Prefix" field (empty), "Documents for Cabinet Lock" (empty), and an upload form
7. Type `XV-TESTLOCK` into Serial Prefix, click Save
8. Expected: no error; the product's row in the left list now shows `XV-TESTLOCK` under its name
9. Create any small local PDF (or use any existing PDF file), fill in the upload form (Category: Manual, Title: "Test Manual"), select the file, submit
10. Expected: "Documents for Cabinet Lock" now lists "Test Manual · Manual · PDF · ...KB"
11. Click Delete on it
12. Expected: it disappears from the list
13. Run: `curl -s http://localhost:3000/api/support/products` and confirm the Cabinet Lock entry now has `"serialPrefix":"XV-TESTLOCK"`

- [ ] **Step 5: Commit**

```bash
git add app/dashboard/admin/documents/page.tsx app/dashboard/admin/layout.tsx
git commit -m "Add admin UI for managing per-product support documents"
```

---

### Task 6: Rebuild the public support page

**Files:**
- Modify: `app/support/page.tsx` (full rewrite, replacing the hardcoded `PRODUCTS` array and category-tab UI)

**Interfaces:**
- Consumes: `GET /api/support/products`, `GET /api/support/documents?productId=X` (Task 1 & Task 4), existing `POST /api/support/ticket` (unchanged).
- Produces: rebuilt `/support` page.

- [ ] **Step 1: Rewrite the page**

Replace the entire contents of `app/support/page.tsx` with:

```tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface SupportProduct {
  id: string;
  name: string;
  category: string;
  serialPrefix: string | null;
  imageUrl: string | null;
}

interface ProductDocument {
  id: string;
  category: "manual" | "installGuide" | "specSheet" | "software";
  title: string;
  fileType: string;
  fileSize: number;
  downloadUrl: string | null;
}

const CATEGORY_ORDER: ProductDocument["category"][] = ["manual", "installGuide", "specSheet", "software"];
const CATEGORY_LABELS: Record<ProductDocument["category"], string> = {
  manual: "Manuals",
  installGuide: "Install Guides",
  specSheet: "Spec Sheets",
  software: "Software",
};

// Matches serial numbers like "XV-4TP-000123": a prefix (letters/digits/dashes)
// followed by a dash and a trailing numeric unit number.
const SERIAL_PATTERN = /^([A-Za-z0-9-]+)-(\d+)$/;

function findMatches(query: string, products: SupportProduct[]): SupportProduct[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const serialMatch = trimmed.match(SERIAL_PATTERN);
  if (serialMatch) {
    const prefix = serialMatch[1].toLowerCase();
    const bySerial = products.filter((p) => p.serialPrefix?.toLowerCase() === prefix);
    if (bySerial.length > 0) return bySerial;
  }

  const lower = trimmed.toLowerCase();
  return products.filter((p) => p.name.toLowerCase().includes(lower));
}

export default function SupportPage() {
  const [products, setProducts] = useState<SupportProduct[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<SupportProduct | null>(null);
  const [documents, setDocuments] = useState<ProductDocument[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);

  const [form, setForm] = useState({ name: "", email: "", product: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/support/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products ?? []));
  }, []);

  const selectProduct = useCallback(async (p: SupportProduct) => {
    setSelected(p);
    setForm((f) => ({ ...f, product: p.id }));
    setLoadingDocs(true);
    const res = await fetch(`/api/support/documents?productId=${p.id}`);
    const data = await res.json();
    setDocuments(data.documents ?? []);
    setLoadingDocs(false);
  }, []);

  const clearSelection = () => {
    setSelected(null);
    setDocuments([]);
  };

  const matches = useMemo(() => findMatches(query, products), [query, products]);

  useEffect(() => {
    if (matches.length === 1 && matches[0].id !== selected?.id) {
      selectProduct(matches[0]);
    }
  }, [matches, selected, selectProduct]);

  const groupedDocs = CATEGORY_ORDER
    .map((category) => ({ category, docs: documents.filter((d) => d.category === category) }))
    .filter((g) => g.docs.length > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/support/ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
        setForm({ name: "", email: "", product: "", subject: "", message: "" });
      } else {
        const data = await res.json();
        setSubmitError(data.error ?? "Submission failed");
      }
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <section className="bg-[#155cfc] px-6 py-12 md:py-16 text-center">
          <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-3">Support Center</p>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3">How can we help?</h1>
          <p className="text-blue-100 max-w-lg mx-auto text-sm mb-6">Search by product name or the serial number on your device to find manuals, guides, and software.</p>
          <div className="max-w-md mx-auto">
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (selected) clearSelection();
              }}
              placeholder='e.g. "4 Touch-Pro" or "XV-4TP-000123"'
              className="w-full px-5 py-3.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-300"
            />
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          {!selected && query.trim() && matches.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500 text-sm">{`No products found for "${query}". Try a different name, or submit a request below.`}</p>
            </div>
          )}

          {!selected && matches.length > 1 && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{matches.length} products found</p>
              {matches.map((p) => (
                <button
                  key={p.id}
                  onClick={() => selectProduct(p)}
                  className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-[#155cfc] hover:shadow-sm transition-all text-left bg-white"
                >
                  {p.imageUrl && (
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <Image src={p.imageUrl} alt={p.name} fill className="object-contain" />
                    </div>
                  )}
                  <span className="font-bold text-gray-900 text-sm">{p.name}</span>
                </button>
              ))}
            </div>
          )}

          {selected && (
            <div>
              <button onClick={() => { clearSelection(); setQuery(""); }} className="text-xs font-bold text-[#155cfc] hover:underline mb-6">
                ← Search again
              </button>

              <div className="flex items-center gap-4 mb-8">
                {selected.imageUrl && (
                  <div className="relative w-16 h-16 flex-shrink-0 border border-gray-200 rounded-xl overflow-hidden">
                    <Image src={selected.imageUrl} alt={selected.name} fill className="object-contain" />
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-black text-gray-900">{selected.name}</h2>
                  <p className="text-sm text-gray-500">{selected.category}</p>
                </div>
              </div>

              {loadingDocs ? (
                <p className="text-sm text-gray-500">Loading documents…</p>
              ) : groupedDocs.length === 0 ? (
                <p className="text-sm text-gray-500">{"No documents available for this product yet. Submit a request below and we'll help directly."}</p>
              ) : (
                <div className="space-y-8">
                  {groupedDocs.map(({ category, docs }) => (
                    <section key={category}>
                      <h3 className="text-sm font-black text-gray-900 mb-3">{CATEGORY_LABELS[category]}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {docs.map((d) => (
                          <a
                            key={d.id}
                            href={d.downloadUrl ?? "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-[#155cfc] hover:shadow-sm transition-all bg-white"
                          >
                            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                              <span className="text-sm">📄</span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-gray-900 leading-tight truncate">{d.title}</p>
                              <p className="text-[10px] text-gray-400 mt-0.5">{d.fileType.toUpperCase()} · {(d.fileSize / 1024).toFixed(0)} KB</p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <section className="bg-gray-50 border-t border-gray-100 py-12 sm:py-16 px-4 sm:px-6">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">Still need help?</h2>
              <p className="text-gray-500 mt-2 text-sm">Submit a support request and our team will get back to you within 24 hours.</p>
            </div>

            {submitted ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
                <h3 className="font-black text-gray-900 text-lg">Ticket Submitted</h3>
                <p className="text-gray-500 text-sm mt-2">{"We'll reach out to you soon."}</p>
                <button onClick={() => setSubmitted(false)} className="mt-4 text-xs text-[#155cfc] font-bold hover:underline">Submit another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Name *</label>
                    <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Your name"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#155cfc] bg-white" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Email *</label>
                    <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="your@email.com"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#155cfc] bg-white" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Product</label>
                    <select value={form.product} onChange={e => setForm(f => ({ ...f, product: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#155cfc] bg-white">
                      <option value="">Select product</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      <option value="general">General / Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Subject *</label>
                    <input required value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      placeholder="Brief subject"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#155cfc] bg-white" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Message *</label>
                  <textarea required rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Describe your issue in detail..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#155cfc] bg-white resize-none" />
                </div>

                {submitError && <p className="text-sm text-red-500">{submitError}</p>}

                <button type="submit" disabled={submitting}
                  className="w-full py-3.5 bg-[#155cfc] text-white font-bold rounded-xl hover:bg-[#1249d4] transition-colors shadow-md shadow-blue-200 disabled:opacity-60">
                  {submitting ? "Submitting…" : "Submit Support Request"}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Run the project typecheck**

Run: `npx tsc --noEmit`
Expected: no errors (this catches any type mismatches introduced across Tasks 1–6, since this is the last file touched).

- [ ] **Step 3: Run lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 4: Manual verification in the browser**

Prerequisite: Task 5's manual verification left Cabinet Lock's serial prefix deleted (Step 11 deleted the test doc, but Step 7 saving `XV-TESTLOCK` as serial prefix was NOT undone — confirm it's still set via `curl http://localhost:3000/api/support/products`). If it was cleared, redo Task 5 steps 5–10 first so there's a real document to find.

1. Run: `npm run dev` (if not already running)
2. Go to `http://localhost:3000/support`
3. Type "Cabinet Lock" into the search box
4. Expected: since it's a unique name match, the page auto-jumps to the Cabinet Lock detail view showing its image, name, and a "Manuals" section with the uploaded test document as a working download link
5. Click "← Search again", type `XV-TESTLOCK-000001`
6. Expected: auto-jumps to the same Cabinet Lock detail view (serial prefix match)
7. Click "← Search again", type `zzzzznotaproduct`
8. Expected: "No products found for..." message appears
9. Clear the search box, scroll to the "Still need help?" ticket form, open the Product dropdown
10. Expected: it lists real product names (e.g. "Cabinet Lock", "4 Touch-Pro"), not the old "Edge Series"/"Touch Panel"/etc. categories

- [ ] **Step 5: Commit**

```bash
git add app/support/page.tsx
git commit -m "Rebuild support page with product name/serial number document search"
```

## Post-plan cleanup

Task 5's manual verification created a test document and set a test serial prefix (`XV-TESTLOCK`) on the real "Cabinet Lock" product. Once Task 6 verification confirms search works end-to-end, decide whether to keep that test data or clear it:
- To remove the test serial prefix: in `/dashboard/admin/documents`, select Cabinet Lock, clear the Serial Prefix field, click Save.
- Any leftover test document can be deleted the same way it was in Task 5 Step 11.
