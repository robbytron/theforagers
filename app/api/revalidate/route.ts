import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  const slug   = request.nextUrl.searchParams.get('slug');
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }
  if (slug) { revalidatePath(`/species/${slug}`); return NextResponse.json({ revalidated: true, slug }); }
  revalidatePath('/'); revalidatePath('/species'); revalidatePath('/calendar');
  return NextResponse.json({ revalidated: true, all: true });
}
