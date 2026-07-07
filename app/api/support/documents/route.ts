import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(request: NextRequest) {
  const productId = request.nextUrl.searchParams.get('productId');
  if (!productId) return Response.json({ error: 'productId required' }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from('product_documents')
    .select('id, category, title, file_type, file_size, storage_path')
    .eq('product_id', productId);

  if (error) return Response.json({ error: error.message }, { status: 500 });

  const documents = await Promise.all((data ?? []).map(async (d) => {
    const { data: signed, error: signError } = await supabaseAdmin.storage
      .from('product-documents')
      .createSignedUrl(d.storage_path, 60 * 60);

    if (signError) console.error(`Signed URL failed for document ${d.id}:`, signError);

    return {
      id: d.id,
      category: d.category,
      title: d.title,
      fileType: d.file_type,
      fileSize: d.file_size,
      downloadUrl: signed?.signedUrl ?? null,
    };
  }));

  return Response.json({ documents });
}
