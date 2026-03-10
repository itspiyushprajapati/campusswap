'use client';

import { useState, useRef, useCallback } from 'react';

interface ImageUploadProps {
  maxImages?: number;
  onImagesChange: (files: File[]) => void;
}

interface ImagePreview {
  file: File;
  id: string;
  url: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export function ImageUpload({
  maxImages = 5,
  onImagesChange,
}: ImageUploadProps) {
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `File "${file.name}" is not a valid image type (JPG, PNG, WebP, GIF only)`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File "${file.name}" is too large (max 5MB)`;
    }
    return null;
  };

  const processFiles = useCallback(
    (files: FileList | null) => {
      setError(null);

      if (!files || files.length === 0) return;

      const newFiles: File[] = [];
      const errors: string[] = [];

      // Check total would exceed limit
      const remainingSlots = maxImages - images.length;
      if (remainingSlots <= 0) {
        setError(`Maximum ${maxImages} images allowed`);
        return;
      }

      // Process each file
      Array.from(files).forEach((file, index) => {
        if (index >= remainingSlots) return;

        const validationError = validateFile(file);
        if (validationError) {
          errors.push(validationError);
          return;
        }

        // Check for duplicates
        const isDuplicate = images.some(
          (img) =>
            img.file.name === file.name &&
            img.file.size === file.size &&
            img.file.lastModified === file.lastModified
        );

        if (isDuplicate) {
          errors.push(`File "${file.name}" is already added`);
          return;
        }

        newFiles.push(file);
      });

      if (errors.length > 0) {
        setError(errors[0]); // Show first error
      }

      if (newFiles.length > 0) {
        const newPreviews: ImagePreview[] = newFiles.map((file) => ({
          file,
          id: `${file.name}-${file.lastModified}-${Math.random().toString(36).substr(2, 9)}`,
          url: URL.createObjectURL(file),
        }));

        const updatedImages = [...images, ...newPreviews];
        setImages(updatedImages);
        onImagesChange(updatedImages.map((img) => img.file));
      }
    },
    [images, maxImages, onImagesChange]
  );

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set isDragging to false if leaving the container, not entering a child
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const removeImage = (id: string) => {
    setError(null);
    setImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      const updated = prev.filter((img) => img.id !== id);
      onImagesChange(updated.map((img) => img.file));
      return updated;
    });
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  // Cleanup object URLs on unmount
  const cleanup = useCallback(() => {
    images.forEach((img) => URL.revokeObjectURL(img.url));
  }, [images]);

  return (
    <div className="space-y-4">
      {/* Drag & Drop Zone */}
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${
            isDragging
              ? 'border-maroon bg-primary-50'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
          ${images.length >= maxImages ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={handleFileSelect}
          disabled={images.length >= maxImages}
          className="hidden"
        />

        <div className="flex flex-col items-center space-y-2">
          <svg
            className={`w-12 h-12 ${isDragging ? 'text-maroon' : 'text-gray-400'}`}
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

          <div className="text-sm">
            <span className="text-maroon font-medium">
              Click to upload
            </span>{' '}
            <span className="text-gray-500">or drag and drop</span>
          </div>

          <p className="text-xs text-gray-400">
            JPEG, PNG, WebP, GIF up to 5MB each
          </p>

          <p className="text-xs text-gray-500">
            {images.length} / {maxImages} images
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group"
            >
              <img
                src={image.url}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeImage(image.id)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1
                         opacity-0 group-hover:opacity-100 transition-opacity
                         hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Remove image"
              >
                <svg
                  className="w-4 h-4"
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

              {/* First Image Badge */}
              {index === 0 && (
                <div className="absolute bottom-2 left-2 bg-maroon text-white text-xs px-2 py-1 rounded">
                  Main
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
