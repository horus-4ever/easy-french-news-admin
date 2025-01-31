import { NextRequest, NextResponse } from 'next/server';
import { Article } from '@/models/Article';
import { dbConnect } from '@/lib/dbConnect';

type tParams = Promise<{ id: string }>;

export async function PUT(request: NextRequest, { params }: { params: tParams }) {
  try {
    await dbConnect();
    const id = (await params).id;
    const { published } = await request.json();

    const article = await Article.findById(id);

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Set publish state from request
    article.published = published;
    await article.save();

    return NextResponse.json(article, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
