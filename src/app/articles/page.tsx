// src/app/articles/page.tsx
"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { listAllDrafts, removeDraft } from '@/lib/localDrafts';

export default function ArticlesListPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // For local drafts
  const [localDrafts, setLocalDrafts] = useState<{ key: string; data: any }[]>(
    []
  );

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch('/api/articles');
        if (!res.ok) {
          throw new Error(`Error: ${res.statusText}`);
        }
        const data = await res.json();
        setArticles(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();

    // Also load local drafts
    const drafts = listAllDrafts();
    setLocalDrafts(drafts);
  }, []);

  const togglePublish = async (id: string, currentPublished: boolean) => {
    try {
      const res = await fetch(`/api/articles/${id}/publish`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ published: !currentPublished }),
      });
      if (res.ok) {
        const updatedArticle = await res.json();
        setArticles((prev) =>
          prev.map((article) =>
            article._id === updatedArticle._id ? updatedArticle : article
          )
        );
      } else {
        throw new Error('Failed to update publish state');
      }
    } catch (err) {
      console.error(err);
      alert((err as Error).message);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Articles</h1>
      <Link
        href="/articles/new"
        className="inline-block mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        + Add New Article
      </Link>

      {articles.length === 0 ? (
        <div>No articles found.</div>
      ) : (
        <table className="min-w-full bg-white border border-gray-200 mb-8">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Title</th>
              <th className="py-2 px-4 border-b">Publish Date</th>
              <th className="py-2 px-4 border-b">Published</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article._id}>
                <td className="py-2 px-4 border-b">{article._id}</td>
                <td className="py-2 px-4 border-b">{article.title}</td>
                <td className="py-2 px-4 border-b">
                  {article.publishDate
                    ? new Date(article.publishDate).toLocaleDateString()
                    : ''}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {article.published ? '✅' : '❌'}
                </td>
                <td className="py-2 px-4 border-b space-x-2">
                  <Link
                    href={`/articles/${article._id}/edit`}
                    className="px-2 py-1 bg-green-500 text-white rounded"
                  >
                    Edit
                  </Link>
                  <button
                    className="px-2 py-1 bg-blue-500 text-white rounded"
                    onClick={() => togglePublish(article._id, article.published)}
                  >
                    {article.published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded"
                    onClick={async () => {
                      if (!confirm('Are you sure you want to delete this?')) {
                        return;
                      }
                      try {
                        const res = await fetch(`/api/articles/${article._id}`, {
                          method: 'DELETE',
                        });
                        if (res.ok) {
                          setArticles((prev) =>
                            prev.filter((item) => item._id !== article._id)
                          );
                        }
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/** SECTION FOR LOCAL DRAFTS */}
      <h2 className="text-xl font-bold mb-4">Local Drafts</h2>
      {localDrafts.length === 0 ? (
        <div>No local drafts.</div>
      ) : (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-4 border-b">Draft ID</th>
              <th className="py-2 px-4 border-b">Title (from draft)</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {localDrafts.map(({ key, data }) => {
              // If the key starts with "new-", it's a brand new article draft
              const isNew = key.startsWith('new-');
              // We'll read the title from data.title or "Untitled"
              const title = data.title || 'Untitled Draft';
              return (
                <tr key={key}>
                  <td className="py-2 px-4 border-b">{key}</td>
                  <td className="py-2 px-4 border-b">{title}</td>
                  <td className="py-2 px-4 border-b space-x-2">
                    {isNew ? (
                      <Link
                        href={`/articles/new?draftId=${key}`}
                        className="px-2 py-1 bg-green-500 text-white rounded"
                      >
                        Resume
                      </Link>
                    ) : (
                      <Link
                        href={`/articles/${key}/edit`}
                        className="px-2 py-1 bg-green-500 text-white rounded"
                      >
                        Resume Edit
                      </Link>
                    )}
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded"
                      onClick={() => {
                        if (!confirm('Delete this local draft?')) return;
                        removeDraft(key);
                        setLocalDrafts((prev) => prev.filter((d) => d.key !== key));
                      }}
                    >
                      Delete Draft
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </main>
  );
}

