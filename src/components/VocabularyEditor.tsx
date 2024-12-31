'use client';

import { useState } from 'react';
import JSONEditor from './JSONEditor';

interface VocabularyItem {
  word: string;
  translation: string;
  category: string;
}

interface Props {
  data: VocabularyItem[];
  onChange: (value: VocabularyItem[]) => void;
}

export default function VocabularyEditor({ data, onChange }: Props) {
  const [jsonMode, setJsonMode] = useState(false);

  const handleAdd = () => {
    const newEntry: VocabularyItem = {
      word: '',
      translation: '',
      category: '',
    };
    onChange([...data, newEntry]);
  };

  const handleDelete = (index: number) => {
    const updated = [...data];
    updated.splice(index, 1);
    onChange(updated);
  };

  const handleChange = (index: number, field: keyof VocabularyItem, value: string) => {
    const updated = [...data];
    updated[index][field] = value;
    onChange(updated);
  };

  return (
    <div className="border p-4 rounded bg-white mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold">Vocabulary</h3>
        <button
          type="button"
          onClick={() => setJsonMode((prev) => !prev)}
          className="text-sm text-blue-500"
        >
          {jsonMode ? 'Switch to Form' : 'Edit as JSON'}
        </button>
      </div>

      {jsonMode ? (
        <JSONEditor label="Vocabulary JSON" value={data} onChange={onChange} />
      ) : (
        <div>
          {data.map((item, index) => (
            <div
              key={index}
              className="flex items-center mb-2 space-x-2 border-b pb-2"
            >
              <input
                value={item.word}
                onChange={(e) => handleChange(index, 'word', e.target.value)}
                placeholder="Word"
                className="border px-2 py-1 flex-1"
              />
              <input
                value={item.translation}
                onChange={(e) =>
                  handleChange(index, 'translation', e.target.value)
                }
                placeholder="Translation"
                className="border px-2 py-1 flex-1"
              />
              <select
                value={item.category}
                onChange={(e) => handleChange(index, 'category', e.target.value)}
                className="border px-2 py-1"
              >
                <option value="">Select Category</option>
                <option value="noun">Noun</option>
                <option value="verb1">Verb1</option>
                <option value="verb2">Verb2</option>
                <option value="adjective">Adjective</option>
                <option value="expression">Expression</option>
              </select>
              <button
                type="button"
                onClick={() => handleDelete(index)}
                className="px-2 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAdd}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
          >
            + Add New Vocabulary
          </button>
        </div>
      )}
    </div>
  );
}
