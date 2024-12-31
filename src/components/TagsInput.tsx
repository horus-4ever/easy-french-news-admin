import { useState } from 'react';

export default function TagsInput({
  tags,
  onChange,
}: {
  tags: string[];
  onChange: (newTags: string[]) => void;
}) {
  const [inputValue, setInputValue] = useState('');

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === ' ' || e.key === 'Enter') && inputValue.trim() !== '') {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        onChange([...tags, inputValue.trim()]);
        setInputValue('');
      }
    }
    // Delete the last tag if input is empty and backspace is pressed
    if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      e.preventDefault();
      const updatedTags = tags.slice(0, -1);
      onChange(updatedTags);
    }
  };

  const handleRemoveTag = (index: number) => {
    const updatedTags = tags.filter((_, i) => i !== index);
    onChange(updatedTags);
  };

  return (
    <div>
      <label className="block font-semibold mb-1">Tags</label>
      <div className="border px-3 py-2 rounded w-full min-h-[42px] flex flex-wrap items-center gap-2">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center"
          >
            {tag}
            <button
              type="button"
              onClick={() => handleRemoveTag(index)}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        ))}
        <input
          type="text"
          className="flex-1 border-none outline-none"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleAddTag}
          placeholder="Add tags with Space or Enter"
        />
      </div>
    </div>
  );
}
