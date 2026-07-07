import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth-middleware';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ docId: string }> }
) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  const { docId } = await params;

  const { data: doc, error: fetchError } = await supabaseAdmin
    .from('product_documents')
    .select('storage_path')
    .eq('id', docId)
    .single();

  if (fetchError || !doc) return Response.json({ error: 'Document not found' }, { status: 404 });

  const { error: storageError } = await supabaseAdmin.storage
    .from('product-documents')
    .remove([doc.storage_path]);

  if (storageError) {
    console.error('Failed to delete storage file, continuing to remove document row:', storageError);
  }

  const { error } = await supabaseAdmin.from('product_documents').delete().eq('id', docId);
  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json({ ok: true });
}
