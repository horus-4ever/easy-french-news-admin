// src/app/articles/[id]/edit/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ArticleForm, { ArticleFormData } from '@/components/ArticleForm';

export default function EditArticlePage() {
  const [article, setArticle] = useState<ArticleFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams(); // { id: '....' }

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`/api/articles/${params.id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch article');
        }
        const data = await res.json();
        setArticle(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [params.id]);

  const handleSubmit = async (formData: ArticleFormData) => {
    try {
      const res = await fetch(`/api/articles/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        throw new Error('Failed to update article');
      }
      router.push('/articles');
    } catch (err) {
      console.error(err);
      alert((err as Error).message);
    }
  };

  if (loading) return <div className="p-4">Loading article...</div>;
  if (!article) return <div className="p-4">Article not found.</div>;

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Article</h1>
      <ArticleForm onSubmit={handleSubmit} initialData={article} />
    </main>
  );
}
