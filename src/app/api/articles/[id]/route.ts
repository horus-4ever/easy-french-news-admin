// src/app/api/articles/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Article from '@/models/Article';
import { dbConnect } from '@/lib/dbConnect';

type tParams = Promise<{ id: string }>;

export async function GET(request: NextRequest, { params }: { params: tParams }) {
  try {
    await dbConnect();
    const id = (await params).id;
    const article = await Article.findById(id);
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    return NextResponse.json(article, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: tParams }) {
  try {
    await dbConnect();
    const id = (await params).id;
    const body = await request.json();
    const updatedArticle = await Article.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (!updatedArticle) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    return NextResponse.json(updatedArticle, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: tParams }) {
  try {
    await dbConnect();
    const id = (await params).id;
    const deletedArticle = await Article.findByIdAndDelete(id);
    if (!deletedArticle) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    return NextResponse.json(deletedArticle, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
