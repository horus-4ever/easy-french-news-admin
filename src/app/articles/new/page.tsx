// src/app/articles/new/page.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import ArticleForm, { ArticleFormData } from '@/components/ArticleForm';
import { v4 as uuidv4 } from 'uuid'; // install uuid if needed: `npm i uuid`

export default function NewArticlePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Generate a unique ID for this new-article draft:
  const draftId = searchParams.get('draftId') || `new-${uuidv4()}`;

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

      // If successful, remove the local draft from localStorage (optional).
      // You can do it if you want to clear the local draft after saving to DB.
      // import { removeDraft } from '@/lib/localDrafts';
      // removeDraft(draftId);

      router.push('/articles');
    } catch (err) {
      console.error(err);
      alert((err as Error).message);
    }
  };

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Article</h1>
      <ArticleForm onSubmit={handleSubmit} draftId={draftId} />
    </main>
  );
}
