'use client';

import { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { githubLight } from '@uiw/codemirror-theme-github';

interface JSONEditorProps {
  label: string;
  value: object;
  onChange: (val: any) => void;
}

export default function JSONEditor({ label, value, onChange }: JSONEditorProps) {
  const [textValue, setTextValue] = useState(JSON.stringify(value, null, 2));
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setTextValue(JSON.stringify(value, null, 2));
  }, [value]);

  const handleChange = (newValue: string) => {
    setTextValue(newValue);
    try {
      const parsed = JSON.parse(newValue);
      onChange(parsed);
      setIsValid(true);
    } catch {
      setIsValid(false);
    }
  };

  return (
    <div className="mt-4">
      <label className="block font-semibold mb-2">{label}</label>
      <div className="border rounded">
        <CodeMirror
          value={textValue}
          height="200px"
          theme={githubLight}
          extensions={[json()]}
          onChange={(value) => handleChange(value)}
        />
      </div>
      {!isValid && (
        <p className="text-red-500 mt-1">
          Invalid JSON. Please check your syntax.
        </p>
      )}
    </div>
  );
}
