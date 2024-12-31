// src/app/api/articles/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Article from '@/models/Article';
import { dbConnect } from '@/lib/dbConnect';

export async function GET() {
  try {
    await dbConnect();
    const articles = await Article.find({}).select("_id title publishDate").sort({ publishDate: -1 });
    return NextResponse.json(articles, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const newArticle = await Article.create(body);
    return NextResponse.json(newArticle, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
