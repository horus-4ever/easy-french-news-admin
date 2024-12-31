'use client';

import { useState } from 'react';
import JSONEditor from './JSONEditor';

interface Question {
  id: number;
  questionText: string;
  options: string[];
  correctAnswer: string;
}

interface Props {
  data: Question[];
  onChange: (value: Question[]) => void;
}

export default function QuestionsEditor({ data, onChange }: Props) {
  const [jsonMode, setJsonMode] = useState(false);

  // Add a new question with default 4 empty options
  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: Date.now(),
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: '',
    };
    onChange([...data, newQuestion]);
  };

  // Delete a question by index
  const handleDeleteQuestion = (index: number) => {
    const updated = [...data];
    updated.splice(index, 1);
    onChange(updated);
  };

  // Update question fields
  const handleChange = (
    index: number,
    field: keyof Question,
    value: string
  ) => {
    const updated = [...data];
    updated[index][field] = value;
    onChange(updated);
  };

  // Update specific option
  const handleOptionChange = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const updated = [...data];
    updated[questionIndex].options[optionIndex] = value;
    onChange(updated);
  };

  return (
    <div className="border p-4 rounded bg-white mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold">Quiz Questions</h3>
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
          label="Questions JSON"
          value={data}
          onChange={onChange}
        />
      ) : (
        <div>
          {data.map((item, index) => (
            <div key={index} className="mb-6 border-b pb-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold">
                  Question {index + 1}
                </h4>
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(index)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </div>

              <input
                value={item.questionText}
                onChange={(e) =>
                  handleChange(index, 'questionText', e.target.value)
                }
                placeholder="Question Text"
                className="border px-2 py-1 w-full mb-4"
              />

              <h5 className="font-medium mb-2">Options</h5>
              {item.options.map((option, optionIndex) => (
                <div
                  key={optionIndex}
                  className="flex items-center space-x-2 mb-2"
                >
                  <input
                    value={option}
                    onChange={(e) =>
                      handleOptionChange(index, optionIndex, e.target.value)
                    }
                    placeholder={`Option ${optionIndex + 1}`}
                    className="border px-2 py-1 flex-1"
                  />
                </div>
              ))}

              <div className="mt-2">
                <label className="block font-medium mb-1">
                  Correct Answer
                </label>
                <input
                  value={item.correctAnswer}
                  onChange={(e) =>
                    handleChange(index, 'correctAnswer', e.target.value)
                  }
                  placeholder="Correct Answer"
                  className="border px-2 py-1 w-full"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddQuestion}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
          >
            + Add New Question
          </button>
        </div>
      )}
    </div>
  );
}
