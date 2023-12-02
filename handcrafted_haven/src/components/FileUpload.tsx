import { ChangeEvent, useEffect, useRef, useState } from 'react';

interface FileUploadProps {
  onFileChange: (base64Strings: string[]) => void;
  onClearFile: () => void;
  clear: boolean;
  multiple?: boolean;
}

const FileUpload = ({
  onFileChange,
  onClearFile,
  clear,
  multiple = false,
}: FileUploadProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      const selected = Array.from(files);
      setSelectedFiles(selected);

      const base64Promises = selected.map((file) => convertToBase64(file));
      const base64Strings = await Promise.all(base64Promises);

      onFileChange(base64Strings);
    } else {
      setSelectedFiles([]);
      onFileChange([]);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result as string;
        const fileType = file.type.split('/')[1];
        const base64String = `data:image/${fileType};base64,${btoa(result)}`;
        resolve(base64String);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsBinaryString(file);
    });
  };

  const handleClearFile = () => {
    setSelectedFiles([]);
    onFileChange([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    onClearFile();
  };

  useEffect(() => {
    if (clear) {
      handleClearFile();
    }
  }, [clear]);

  return (
    <div className="my-4">
      <label className="block text-gray-600 text-sm font-bold mb-1">
        Choose file {multiple && '(s)'}
      </label>
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg, .jpeg, .png"
        className="mt-1 block w-full border border-gray-300 py-2 px-3 rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-white text-gray-800"
        onChange={handleFileChange}
        multiple={multiple}
      />
      {selectedFiles.length > 0 && (
        <div className="mt-2">
          <p className="text-green-600 font-semibold">
            Selected file{multiple && 's'}:
          </p>
          <ul>
            {selectedFiles.map((file) => (
              <li key={file.name} className="text-gray-800">
                {file.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
