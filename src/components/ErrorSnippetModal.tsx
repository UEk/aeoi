import { X } from 'lucide-react';

interface ErrorSnippetModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorCode: string;
  fileName: string;
  snippet: string | null;
  lineNumber: number | null;
}

export function ErrorSnippetModal({
  isOpen,
  onClose,
  errorCode,
  fileName,
  snippet,
  lineNumber,
}: ErrorSnippetModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">
              Error {errorCode}
            </h2>
            <p className="text-sm text-gray-600 mt-1">{fileName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="px-6 py-4 overflow-auto">
          {snippet && lineNumber ? (
            <div className="bg-gray-50 rounded-md p-4 overflow-x-auto">
              <pre className="text-sm font-mono text-gray-800 whitespace-pre">
                {snippet}
              </pre>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Line number information not available for this error.</p>
              <p className="text-sm mt-2">
                The error was detected during validation but the exact location could not be determined.
              </p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
