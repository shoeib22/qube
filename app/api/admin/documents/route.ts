import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth-middleware';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const ALLOWED_CATEGORIES = ['manual', 'installGuide', 'specSheet', 'software'] as const;
type DocCategory = typeof ALLOWED_CATEGORIES[number];

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  const productId = request.nextUrl.searchParams.get('productId');
  if (!productId) return Response.json({ error: 'productId required' }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from('product_documents')
    .select('id, product_id, category, title, storage_path, file_type, file_size, products(name)')
    .eq('product_id', productId);

  if (error) return Response.json({ error: error.message }, { status: 500 });

  const documents = (data ?? []).map((d) => ({
    id: d.id,
    productId: d.product_id,
    productName: (d.products as unknown as { name: string } | null)?.name ?? '',
    category: d.category,
    title: d.title,
    storagePath: d.storage_path,
    fileType: d.file_type,
    fileSize: d.file_size,
  }));

  return Response.json({ documents });
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  const formData = await request.formData();
  const file = formData.get('file');
  const productId = formData.get('productId');
  const category = formData.get('category');
  const title = formData.get('title');

  if (!(file instanceof File)) return Response.json({ error: 'file required' }, { status: 400 });
  if (typeof productId !== 'string' || !productId) return Response.json({ error: 'productId required' }, { status: 400 });
  if (typeof category !== 'string' || !ALLOWED_CATEGORIES.includes(category as DocCategory)) {
    return Response.json({ error: `category must be one of ${ALLOWED_CATEGORIES.join(', ')}` }, { status: 400 });
  }
  if (typeof title !== 'string' || !title) return Response.json({ error: 'title required' }, { status: 400 });

  const fileType = (file.name.split('.').pop() || 'bin').toLowerCase();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `${productId}/${Date.now()}_${safeName}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await supabaseAdmin.storage
    .from('product-documents')
    .upload(storagePath, buffer, { contentType: file.type || 'application/octet-stream' });
  if (uploadError) return Response.json({ error: uploadError.message }, { status: 500 });

  const { data: doc, error } = await supabaseAdmin
    .from('product_documents')
    .insert({
      product_id: productId,
      category,
      title,
      storage_path: storagePath,
      file_type: fileType,
      file_size: buffer.length,
    })
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json({
    document: {
      id: doc.id,
      productId: doc.product_id,
      category: doc.category,
      title: doc.title,
      storagePath: doc.storage_path,
      fileType: doc.file_type,
      fileSize: doc.file_size,
    },
  }, { status: 201 });
}
