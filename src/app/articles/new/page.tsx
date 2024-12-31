// src/app/articles/new/page.tsx
'use client'; // We need client-side component for form handling

import { useRouter } from 'next/navigation';
import ArticleForm, { ArticleFormData } from '@/components/ArticleForm';

export default function NewArticlePage() {
  const router = useRouter();

  const handleSubmit = async (formData: ArticleFormData) => {
    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to create article');
      }

      const data = await res.json();
      // Navigate back to the articles list after creation
      router.push('/articles');
    } catch (err) {
      console.error(err);
      alert((err as Error).message);
    }
  };

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Article</h1>
      <ArticleForm onSubmit={handleSubmit} />
    </main>
  );
}
