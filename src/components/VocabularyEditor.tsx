"use client";

import { useState } from "react";
import JSONEditor from "./JSONEditor";

/**
 * Example of the shape you now have in your MongoDB schema and in your React state:
 *
 * interface IVocabulary {
 *   words: string[];
 *   category: string[];
 *   translations: {
 *     [language: string]: string[];
 *   };
 * }
 */
interface VocabularyData {
  words: string[];
  category: string[];
  translations: {
    [language: string]: string[];
  };
}

interface Props {
  data: VocabularyData;            // The entire vocabulary object
  onChange: (value: VocabularyData) => void; // Callback to update parent form state
}

export default function VocabularyEditor({ data, onChange }: Props) {
  const [jsonMode, setJsonMode] = useState(false);

  /**
   * A local state to keep track of the new language name
   * typed by the user (e.g. "spanish", "german", etc.)
   */
  const [newLanguageName, setNewLanguageName] = useState("");

  // Determine which languages are currently present
  const languages = Object.keys(data.translations);

  // Utility to force an update in the parent
  const triggerOnChange = (updated: VocabularyData) => {
    onChange({ ...updated });
  };

  // ----- ADD A ROW -----
  const handleAddRow = () => {
    data.words.push("");
    data.category.push("");
    languages.forEach((lang) => {
      data.translations[lang].push("");
    });
    triggerOnChange(data);
  };

  // ----- DELETE A ROW -----
  const handleDeleteRow = (index: number) => {
    data.words.splice(index, 1);
    data.category.splice(index, 1);
    languages.forEach((lang) => {
      data.translations[lang].splice(index, 1);
    });
    triggerOnChange(data);
  };

  // ----- UPDATE A WORD -----
  const handleWordChange = (index: number, newValue: string) => {
    data.words[index] = newValue;
    triggerOnChange(data);
  };

  // ----- UPDATE A CATEGORY -----
  const handleCategoryChange = (index: number, newValue: string) => {
    data.category[index] = newValue;
    triggerOnChange(data);
  };

  // ----- UPDATE A TRANSLATION FOR A PARTICULAR LANGUAGE -----
  const handleTranslationChange = (
    lang: string,
    index: number,
    newValue: string
  ) => {
    data.translations[lang][index] = newValue;
    triggerOnChange(data);
  };

  // ----- ADD A NEW LANGUAGE -----
  const handleAddLanguage = () => {
    const lang = newLanguageName.trim();
    // If empty or already exists, do nothing
    if (!lang) return;
    if (languages.includes(lang)) {
      alert(`Language "${lang}" already exists!`);
      return;
    }

    // Create an array of empty strings for each existing row
    // so it lines up with `data.words.length`
    data.translations[lang] = data.words.map(() => "");

    // Clear the input and trigger the state update
    setNewLanguageName("");
    triggerOnChange(data);
  };

  return (
    <div className="border p-4 rounded bg-white mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Vocabulary</h3>
        <button
          type="button"
          onClick={() => setJsonMode((prev) => !prev)}
          className="text-sm text-blue-500"
        >
          {jsonMode ? "Switch to Form" : "Edit as JSON"}
        </button>
      </div>

      {/* If in JSON mode, show entire JSON structure in CodeMirror */}
      {jsonMode ? (
        <JSONEditor
          label="Vocabulary JSON"
          value={data}
          onChange={(val) => onChange(val)}
        />
      ) : (
        <div>
          {/* Display row-based form */}
          <div className="font-semibold grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 mb-2">
            <div>Word</div>
            <div>Category</div>
            {/* Translations are shown below each row */}
          </div>

          {data.words.map((wordValue, rowIndex) => (
            <div
              key={rowIndex}
              className="border-b py-2 mb-2"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                {/* Word input */}
                <input
                  className="border px-2 py-1"
                  value={wordValue}
                  onChange={(e) => handleWordChange(rowIndex, e.target.value)}
                  placeholder="Word"
                />
                {/* Category input */}
                <input
                  className="border px-2 py-1"
                  value={data.category[rowIndex]}
                  onChange={(e) =>
                    handleCategoryChange(rowIndex, e.target.value)
                  }
                  placeholder="Category"
                />
              </div>

              {/* Show translations for each language */}
              <div className="mt-2 ml-0 md:ml-4">
                {languages.map((lang) => (
                  <div
                    key={lang}
                    className="flex items-center space-x-2 mb-2"
                  >
                    <label className="w-20 font-medium capitalize">
                      {lang}:
                    </label>
                    <input
                      className="border px-2 py-1 flex-1"
                      value={data.translations[lang][rowIndex]}
                      onChange={(e) =>
                        handleTranslationChange(lang, rowIndex, e.target.value)
                      }
                      placeholder={`Translation in ${lang}`}
                    />
                  </div>
                ))}
              </div>

              {/* Delete row button */}
              <button
                type="button"
                onClick={() => handleDeleteRow(rowIndex)}
                className="px-3 py-1 bg-red-500 text-white rounded mt-1"
              >
                Delete Row
              </button>
            </div>
          ))}

          {/* ADD NEW ROW */}
          <button
            type="button"
            onClick={handleAddRow}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
          >
            + Add New Vocabulary Row
          </button>

          {/* ADD A NEW LANGUAGE */}
          <div className="mt-8 p-4 border border-gray-200 rounded">
            <h4 className="font-semibold mb-2">Add a New Language</h4>
            <div className="flex items-center gap-2">
              <input
                className="border px-2 py-1 flex-1"
                placeholder="e.g. spanish"
                value={newLanguageName}
                onChange={(e) => setNewLanguageName(e.target.value)}
              />
              <button
                type="button"
                onClick={handleAddLanguage}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Add Language
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Type a language key (like "spanish", "german") and click “Add Language”.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
