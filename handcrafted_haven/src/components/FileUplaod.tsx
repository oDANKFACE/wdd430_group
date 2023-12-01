import { ChangeEvent, useEffect, useRef, useState } from 'react';

interface FileUploadProps {
  onFileChange: (base64String: string | null) => void;
  onClearFile: () => void;
  clear: boolean;
}

const FileUpload = ({ onFileChange, onClearFile, clear }: FileUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      const selected = files[0];
      setSelectedFile(selected);

      const base64 = await convertToBase64(selected);

      onFileChange(base64);
    } else {
      setSelectedFile(null);
      onFileChange(null);
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
    setSelectedFile(null);
    onFileChange(null);

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
    <div className="mt-4">
      <label className="block text-gray-700">Choose a file</label>
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg, .jpeg, .png"
        className="mt-1 block w-full border border-gray-300 py-2 px-3 rounded-md focus:outline-none focus:ring focus:border-blue-300"
        onChange={handleFileChange}
      />
      {selectedFile && (
        <p className="mt-2 text-green-500">{`Selected file: ${selectedFile.name}`}</p>
      )}
    </div>
  );
};

export default FileUpload;
