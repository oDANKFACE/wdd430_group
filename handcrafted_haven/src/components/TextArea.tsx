import React from 'react';

interface TextAreaProps {
  label?: string;
  value: string | null | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
  label,
  value,
  onChange,
  placeholder = '',
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-gray-600 text-sm font-bold mb-1">
          {label}
        </label>
      )}
      <textarea
        className="border rounded-md w-full p-2 min-h-full text-gray-800"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
};

export default TextArea;
