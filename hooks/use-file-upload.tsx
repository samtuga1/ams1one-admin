import { Button } from "@heroui/react";
import { useRef, useState, ChangeEvent, useCallback } from "react";

interface UseFileUploadOptions {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  maxFiles?: number; // maximum number of files allowed
  onFilesSelected?: (files: File[]) => void;
  onMaxFileSizeDetected?: (files: File) => void;
}

interface UseFileUploadReturn {
  files: File[];
  onClick: () => void;
  removeFile: (index: number) => void;
  clearFiles: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
  InputComponent: React.FC<{
    showFileList?: boolean;
  }>;
}

export const useFileUpload = ({
  accept = "image/*,.pdf,.doc,.docx",
  multiple = true,
  maxSize,
  maxFiles,
  onFilesSelected,
  onMaxFileSizeDetected,
}: UseFileUploadOptions = {}): UseFileUploadReturn => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);

  const onClick = useCallback((): void => {
    inputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => {
      const selectedFiles = e.target.files;
      if (selectedFiles) {
        let fileArray = Array.from(selectedFiles);

        // Filter by file size if maxSize is specified
        if (maxSize) {
          for (const file of fileArray) {
            if (file.size > maxSize) return onMaxFileSizeDetected?.(file);
          }
          fileArray = fileArray.filter((file) => file.size <= maxSize);
        }

        // Limit number of files if maxFiles is specified
        if (maxFiles && fileArray.length > maxFiles) {
          fileArray = fileArray.slice(0, maxFiles);
        }

        setFiles(fileArray);
        onFilesSelected?.(fileArray);
      }
    },
    [maxSize, maxFiles, onFilesSelected, onMaxFileSizeDetected],
  );

  const removeFile = useCallback((index: number): void => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearFiles = useCallback((): void => {
    setFiles([]);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, []);

  const InputComponent: React.FC<{
    showFileList?: boolean;
  }> = ({ showFileList = false }) => (
    <>
      <input
        ref={inputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
        multiple={multiple}
        accept={accept}
      />
      {showFileList && files.length > 0 && (
        <div className="space-y-2 w-full">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium">
              Selected files ({files.length}):
            </p>
            <Button
              size="sm"
              // variant="light"
              // color="danger"
              onPress={clearFiles}
              className="text-xs bg-red-500"
            >
              Clear All
            </Button>
          </div>
          <div className="space-y-2">
            {files.map((file: File, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-100 p-3 rounded-lg"
              >
                <div className="flex flex-col">
                  <span className="text-xs font-medium">{file.name}</span>
                  {formatFileSize && (
                    <span className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </span>
                  )}
                </div>
                <Button
                  size="sm"
                  // variant="light"
                  // color="danger"
                  onPress={() => removeFile(index)}
                  className="text-xs bg-red-500"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );

  return {
    files,
    onClick,
    removeFile,
    clearFiles,
    inputRef: inputRef as React.RefObject<HTMLInputElement>,
    InputComponent,
  };
};
