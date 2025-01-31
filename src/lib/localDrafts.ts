// src/lib/localDrafts.ts
'use client';

/**
 * Utility functions to handle local drafts in the browser's localStorage.
 */

import { ArticleFormData } from '@/components/ArticleForm';

// Local storage keys will look like: "draft-<articleId>" or "draft-new-<some unique ID>"
const PREFIX = 'draft-';

/**
 * Save a draft to localStorage.
 * @param draftId: The identifier for the draft (string). For existing articles, we can use the article _id. For new ones, something else.
 * @param data: The full object we want to store.
 */
export function saveDraft(draftId: string, data: ArticleFormData) {
  localStorage.setItem(PREFIX + draftId, JSON.stringify(data));
}

/**
 * Load a draft from localStorage by its ID.
 * @param draftId
 * @returns ArticleFormData | null
 */
export function loadDraft(draftId: string): ArticleFormData | null {
  const stored = localStorage.getItem(PREFIX + draftId);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as ArticleFormData;
  } catch (err) {
    console.error('Error parsing local draft:', err);
    return null;
  }
}

/**
 * Remove a draft from localStorage.
 * @param draftId
 */
export function removeDraft(draftId: string) {
  localStorage.removeItem(PREFIX + draftId);
}

/**
 * List all drafts from localStorage. Returns an array of objects with { key, data }.
 */
export function listAllDrafts(): { key: string; data: ArticleFormData }[] {
  const items: { key: string; data: ArticleFormData }[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const fullKey = localStorage.key(i);
    if (fullKey && fullKey.startsWith(PREFIX)) {
      const draftString = localStorage.getItem(fullKey);
      if (draftString) {
        try {
          const data = JSON.parse(draftString) as ArticleFormData;
          items.push({ key: fullKey.replace(PREFIX, ''), data });
        } catch (err) {
          console.error('Failed to parse draft JSON', err);
        }
      }
    }
  }
  return items;
}