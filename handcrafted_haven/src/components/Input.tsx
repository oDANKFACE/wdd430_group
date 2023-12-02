interface InputProps {
  type?: string;
  value: string | number | null | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

const Input = ({
  type = 'text',
  value,
  onChange,
  placeholder = '',
  label,
}: InputProps) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-gray-600 text-sm font-bold mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        className="border rounded-md w-full p-2 text-gray-800"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Input;
