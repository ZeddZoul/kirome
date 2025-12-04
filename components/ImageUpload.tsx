'use client';

import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';

interface ImageUploadProps {
  onImageSelect: (file: File | null) => void;
  currentImage: File | null;
  isOptional?: boolean;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export default function ImageUpload({ onImageSelect, currentImage, isOptional = false }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Please upload a valid image file (JPG, PNG, or WebP)');
      return false;
    }
    setError(null);
    return true;
  };

  const handleFile = (file: File) => {
    if (validateFile(file)) {
      onImageSelect(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
        data-testid="file-input"
      />
      
      {!preview ? (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-10 text-center cursor-pointer
            transition-all-smooth relative overflow-hidden
            ${isDragging 
              ? 'border-neon-violet bg-neon-violet/20 neon-glow' 
              : 'border-gray-600 hover:border-neon-violet/50 hover:bg-neon-violet/5'
            }
          `}
          data-testid="drop-zone"
        >
          <div className="flex flex-col items-center gap-4 relative z-10">
            <div className={`transition-all-smooth ${isDragging ? 'scale-110 text-neon-violet' : 'text-gray-400'}`}>
              <svg
                className="w-20 h-20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-lg text-gray-300 mb-2 font-medium">
                {isDragging ? 'Drop your photo here' : 'Drop your photo here or click to upload'}
              </p>
              <p className="text-sm text-gray-500 font-light">
                Supports JPG, PNG, and WebP
              </p>
            </div>
          </div>
          {isDragging && (
            <div className="absolute inset-0 bg-gradient-to-br from-neon-violet/10 to-transparent pointer-events-none" />
          )}
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden neon-border group" data-testid="preview-container">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover rounded-lg transition-all-smooth group-hover:scale-105"
            data-testid="preview-image"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all-smooth" />
          <button
            onClick={handleRemove}
            className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white rounded-full p-2.5 transition-all-smooth transform hover:scale-110 shadow-lg z-10"
            data-testid="remove-button"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
      
      {error && (
        <div className="mt-3 p-3 bg-red-900/30 border border-red-500 rounded-lg" data-testid="error-message">
          <p className="text-red-300 text-sm flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
        </div>
      )}
    </div>
  );
}
