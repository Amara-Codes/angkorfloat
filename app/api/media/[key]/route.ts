import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;

  try {
    const media = await prisma.media.findFirst({
      where: { key },
    });

    if (!media || !media.bytes) {
      return new NextResponse('Media not found', { status: 404 });
    }

    // Determine content type (default to image/png if unknown)
    // In a real app, you might want to store the mimetype in the Media table
    const contentType = 'image/png'; 

    return new NextResponse(media.bytes, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('[Media API] Error serving media:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
