'use client';

import { useState } from 'react';
import JSONEditor from './JSONEditor';

interface GrammarExample {
  french: string;
  japanese: string;
}

interface GrammarPoint {
  title: string;
  explanation: string;
  examples: GrammarExample[];
}

interface Props {
  data: GrammarPoint[];
  onChange: (value: GrammarPoint[]) => void;
}

export default function GrammarEditor({ data, onChange }: Props) {
  const [jsonMode, setJsonMode] = useState(false);

  // Add a new grammar point
  const handleAddGrammarPoint = () => {
    const newPoint: GrammarPoint = {
      title: '',
      explanation: '',
      examples: [],
    };
    onChange([...data, newPoint]);
  };

  // Delete a grammar point
  const handleDeleteGrammarPoint = (index: number) => {
    const updated = [...data];
    updated.splice(index, 1);
    onChange(updated);
  };

  // Add an example to a specific grammar point
  const handleAddExample = (index: number) => {
    const updated = [...data];
    updated[index].examples.push({ french: '', japanese: '' });
    onChange(updated);
  };

  // Delete an example from a specific grammar point
  const handleDeleteExample = (grammarIndex: number, exampleIndex: number) => {
    const updated = [...data];
    updated[grammarIndex].examples.splice(exampleIndex, 1);
    onChange(updated);
  };

  // Update grammar point or example
  const handleChange = (
    grammarIndex: number,
    field: keyof GrammarPoint,
    value: string
  ) => {
    const updated = [...data];
    updated[grammarIndex][field] = value;
    onChange(updated);
  };

  const handleExampleChange = (
    grammarIndex: number,
    exampleIndex: number,
    field: keyof GrammarExample,
    value: string
  ) => {
    const updated = [...data];
    updated[grammarIndex].examples[exampleIndex][field] = value;
    onChange(updated);
  };

  return (
    <div className="border p-4 rounded bg-white mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold">Grammar Points</h3>
        <button
          type="button"
          onClick={() => setJsonMode((prev) => !prev)}
          className="text-sm text-blue-500"
        >
          {jsonMode ? 'Switch to Form' : 'Edit as JSON'}
        </button>
      </div>

      {jsonMode ? (
        <JSONEditor
          label="Grammar Points JSON"
          value={data}
          onChange={onChange}
        />
      ) : (
        <div>
          {data.map((item, grammarIndex) => (
            <div
              key={grammarIndex}
              className="border-b pb-4 mb-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-semibold mb-2">Grammar Point {grammarIndex + 1}</h4>
                <button
                  type="button"
                  onClick={() => handleDeleteGrammarPoint(grammarIndex)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </div>

              <input
                value={item.title}
                onChange={(e) =>
                  handleChange(grammarIndex, 'title', e.target.value)
                }
                placeholder="Grammar Title"
                className="border px-2 py-1 w-full mb-2"
              />

              <textarea
                value={item.explanation}
                onChange={(e) =>
                  handleChange(grammarIndex, 'explanation', e.target.value)
                }
                placeholder="Explanation"
                className="border px-2 py-1 w-full mb-4"
              />

              <h5 className="font-medium mb-2">Examples</h5>

              {item.examples.map((example, exampleIndex) => (
                <div
                  key={exampleIndex}
                  className="flex items-center space-x-2 mb-2"
                >
                  <input
                    value={example.french}
                    onChange={(e) =>
                      handleExampleChange(
                        grammarIndex,
                        exampleIndex,
                        'french',
                        e.target.value
                      )
                    }
                    placeholder="French Example"
                    className="border px-2 py-1 flex-1"
                  />
                  <input
                    value={example.japanese}
                    onChange={(e) =>
                      handleExampleChange(
                        grammarIndex,
                        exampleIndex,
                        'japanese',
                        e.target.value
                      )
                    }
                    placeholder="Japanese Translation"
                    className="border px-2 py-1 flex-1"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteExample(grammarIndex, exampleIndex)
                    }
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => handleAddExample(grammarIndex)}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
              >
                + Add Example
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddGrammarPoint}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
          >
            + Add New Grammar Point
          </button>
        </div>
      )}
    </div>
  );
}
