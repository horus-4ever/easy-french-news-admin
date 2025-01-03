'use client';

import { useState } from 'react';
import VocabularyEditor from './VocabularyEditor';
import GrammarEditor from './GrammarEditor';
import QuestionsEditor from './QuestionsEditor';
import TagsInput from './TagsInput';
import HtmlEditor from './HtmlEditor';

export interface ArticleVersionData {
  content: string;
  audioUrl: string;
  vocabulary: any[];
  grammarPoints: any[];
  questions: any[];
}

export interface ArticleFormData {
  _id?: string;
  title: string;
  sourceUrl?: string;
  imageUrl?: string;
  publishDate?: string;
  published: boolean;
  labels: string[];
  easyVersion: ArticleVersionData;
  mediumVersion: ArticleVersionData;
}

interface Props {
  onSubmit: (data: ArticleFormData) => void;
  initialData?: ArticleFormData;
}

export default function ArticleForm({ onSubmit, initialData }: Props) {
  const [formData, setFormData] = useState<ArticleFormData>(
    initialData || {
      title: '',
      sourceUrl: '',
      imageUrl: '',
      publishDate: '',
      published: false,
      labels: [],
      easyVersion: {
        content: '',
        audioUrl: '',
        vocabulary: [],
        grammarPoints: [],
        questions: [],
      },
      mediumVersion: {
        content: '',
        audioUrl: '',
        vocabulary: [],
        grammarPoints: [],
        questions: [],
      },
    }
  );

  const handleChange = (field: keyof ArticleFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleVersionChange = (
    versionKey: 'easyVersion' | 'mediumVersion',
    field: keyof ArticleVersionData,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [versionKey]: { ...prev[versionKey], [field]: value },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      publishDate: formData.publishDate
        ? new Date(formData.publishDate).toISOString()
        : new Date().toISOString(),
    };
    onSubmit(finalData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      {/* TITLE */}
      <div>
        <label className="block font-semibold mb-1">Title</label>
        <input
          className="border w-full px-2 py-1"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          required
        />
      </div>

      {/* SOURCE URL */}
      <div>
        <label className="block font-semibold mb-1">Source URL</label>
        <input
          className="border w-full px-2 py-1"
          value={formData.sourceUrl ?? ''}
          onChange={(e) => handleChange('sourceUrl', e.target.value)}
        />
      </div>

      {/* IMAGE URL */}
      <div>
        <label className="block font-semibold mb-1">Image URL</label>
        <input
          className="border w-full px-2 py-1"
          value={formData.imageUrl ?? ''}
          onChange={(e) => handleChange('imageUrl', e.target.value)}
        />
      </div>

      {/* TAGS / LABELS */}
      <TagsInput
        tags={formData.labels}
        onChange={(newTags) => handleChange('labels', newTags)}
      />

      {/* EASY AND MEDIUM VERSIONS SIDE BY SIDE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* EASY VERSION */}
        <div className="border p-4 rounded bg-gray-50">
          <h2 className="font-bold mb-4">Easy Version</h2>
          <HtmlEditor
            label="Article Content (HTML)"
            value={formData.easyVersion.content}
            onChange={(newData) =>
              handleVersionChange('easyVersion', 'content', newData)
            }
          />
          <div className="mt-4">
            <label className="block font-semibold mb-1">Audio URL</label>
            <input
              className="border w-full px-2 py-1"
              value={formData.easyVersion.audioUrl}
              onChange={(e) =>
                handleVersionChange('easyVersion', 'audioUrl', e.target.value)
              }
            />
          </div>
          <VocabularyEditor
            data={formData.easyVersion.vocabulary}
            onChange={(newData) =>
              handleVersionChange('easyVersion', 'vocabulary', newData)
            }
          />
          <GrammarEditor
            data={formData.easyVersion.grammarPoints}
            onChange={(newData) =>
              handleVersionChange('easyVersion', 'grammarPoints', newData)
            }
          />
          <QuestionsEditor
            data={formData.easyVersion.questions}
            onChange={(newData) =>
              handleVersionChange('easyVersion', 'questions', newData)
            }
          />
        </div>

        {/* MEDIUM VERSION */}
        <div className="border p-4 rounded bg-gray-50">
          <h2 className="font-bold mb-4">Medium Version</h2>
          <HtmlEditor
            label="Article Content (HTML)"
            value={formData.mediumVersion.content}
            onChange={(newData) =>
              handleVersionChange('mediumVersion', 'content', newData)
            }
          />
          <div className="mt-4">
            <label className="block font-semibold mb-1">Audio URL</label>
            <input
              className="border w-full px-2 py-1"
              value={formData.mediumVersion.audioUrl}
              onChange={(e) =>
                handleVersionChange('mediumVersion', 'audioUrl', e.target.value)
              }
            />
          </div>
          <VocabularyEditor
            data={formData.mediumVersion.vocabulary}
            onChange={(newData) =>
              handleVersionChange('mediumVersion', 'vocabulary', newData)
            }
          />
          <GrammarEditor
            data={formData.mediumVersion.grammarPoints}
            onChange={(newData) =>
              handleVersionChange('mediumVersion', 'grammarPoints', newData)
            }
          />
          <QuestionsEditor
            data={formData.mediumVersion.questions}
            onChange={(newData) =>
              handleVersionChange('mediumVersion', 'questions', newData)
            }
          />
        </div>
      </div>

      {/* SAVE BUTTON */}
      <button
        type="submit"
        className="px-4 py-2 bg-green-500 text-white font-semibold rounded"
      >
        Save
      </button>
    </form>
  );
}
