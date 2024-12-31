'use client';

import { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { githubLight } from '@uiw/codemirror-theme-github';

interface HtmlEditorProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

export default function HtmlEditor({ label, value, onChange }: HtmlEditorProps) {
  const [textValue, setTextValue] = useState(value);

  useEffect(() => {
    setTextValue(value);
  }, [value]);

  const handleChange = (newValue: string) => {
    setTextValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="mt-4">
      <label className="block font-semibold mb-2">{label}</label>
      <div className="border rounded">
        <CodeMirror
          value={textValue}
          height="300px"
          theme={githubLight}
          extensions={[html()]}
          onChange={(value) => handleChange(value)}
        />
      </div>
    </div>
  );
}
