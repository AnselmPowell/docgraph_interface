// src/app/components/research/DocumentManagement/UploadConfirmationModal.client.jsx
'use client';

import { X } from 'lucide-react';

export function UploadConfirmationModal({
  isOpen,
  onClose,
  filesToUpload,
  duplicateFiles,
  onConfirmUpload,
  onRemoveFile
}) {
  if (!isOpen) return null;

  const hasDuplicates = duplicateFiles.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 ">
      <div className="bg-white rounded-lg shadow-xl w-full border-gray-200 border-2  max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 ">
          <h3 className="text-lg font-medium text-primary">Confirm Document Upload</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-tertiary hover:text-primary hover:bg-tertiary/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
          {filesToUpload.length === 0 ? (
            <p className="text-center text-tertiary py-4">No files selected for upload</p>
          ) : (
            <>
              {hasDuplicates && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <p className="text-sm text-amber-800">
                    Duplicate files detected. Please remove them before proceeding with the upload.
                  </p>
                </div>
              )}
              
              <div className=" rounded-md">
                <table className="w-full text-sm">
                  <thead className="">
                    <tr>
                      <th className="px-4 py-2 text-left text-s font-medium text-gray-500 uppercase tracking-wider">File Name</th>
                      <th className="px-4 py-2 text-left text-s font-medium text-gray-500 uppercase tracking-wider">Size</th>
                      <th className="px-4 py-2 text-left text-s font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {filesToUpload.map((file) => {
                      const isDuplicate = duplicateFiles.includes(file.name);
                      
                      return (
                        <tr 
                          key={file.name + file.size} 
                          className={isDuplicate ? 'bg-amber-50' : ''}
                        >
                          <td className="px-4 py-3 text-sm text-gray-900 font-medium">{file.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {isDuplicate ? (
                              <span className="text-amber-700">Already exists</span>
                            ) : (
                              <span className="text-green-600">Ready to upload</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => onRemoveFile(file)}
                              className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                              title="Remove from upload"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
        
        <div className="flex justify-end gap-3 p-4 border-t border-tertiary/10">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-tertiary hover:text-primary rounded-md transition-colors"
          >
            Cancel
          </button>
          
          <button
            onClick={onConfirmUpload}
            disabled={filesToUpload.length === 0 || hasDuplicates}
            className="px-6 py-2.5 text-sm font-medium
                          bg-gradient-to-b from-gray-50 to-gray-100
                          text-gray-900 rounded-lg
                          border border-gray-200
                          shadow-sm 
                          hover:bg-gray-100 hover:border-gray-300 hover:translate-y-[1px]
                          active:bg-gray-200 active:translate-y-[2px]
                          disabled:opacity-50 disabled:cursor-not-allowed 
                          disabled:hover:translate-y-0
                          transition-all duration-150 ease-in-out
                          flex items-center gap-2 overflow-hidden "
                    >

            Upload {filesToUpload.length > 0 ? `(${filesToUpload.length})` : ''}
          </button>
        </div>
      </div>
    </div>
  );
}