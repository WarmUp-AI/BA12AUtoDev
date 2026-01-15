'use client';

import { useState, useRef, DragEvent, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { compressImage, formatFileSize, isValidImageFile } from '@/lib/utils/imageCompression';

interface UploadItem {
  id: string;
  file: File;
  originalFile: File;
  preview: string;
  status: 'queued' | 'compressing' | 'uploading' | 'done' | 'error';
  progress: number;
  url?: string;
  error?: string;
  originalSize?: number;
  compressedSize?: number;
}

interface ImageUploaderProps {
  onImagesChange: (urls: string[]) => void;
  existingImages?: string[];
}

const MAX_CONCURRENT = 5; // Increased for better bulk upload performance

export function ImageUploader({ onImagesChange, existingImages = [] }: ImageUploaderProps) {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>(existingImages);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadQueueRef = useRef<UploadItem[]>([]);
  const activeUploadsRef = useRef<number>(0);

  // Cleanup all preview URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      items.forEach((item) => {
        if (item.preview) {
          URL.revokeObjectURL(item.preview);
        }
      });
    };
  }, [items]);

  // Create a small preview thumbnail to reduce memory usage
  const createPreviewThumbnail = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(URL.createObjectURL(file));
            return;
          }

          // Create small thumbnail (max 100x100)
          const maxSize = 100;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(URL.createObjectURL(blob));
              } else {
                resolve(URL.createObjectURL(file));
              }
            },
            'image/jpeg',
            0.7
          );
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    const filesArray = Array.from(files).filter(isValidImageFile);

    if (filesArray.length === 0) {
      console.warn('No valid image files selected');
      return;
    }

    // Create items for all files first with preview thumbnails
    const newItems: UploadItem[] = await Promise.all(
      filesArray.map(async (file) => ({
        id: `${Date.now()}-${Math.random()}`,
        file, // Will be replaced with compressed version
        originalFile: file,
        preview: await createPreviewThumbnail(file),
        status: 'compressing' as const,
        progress: 0,
        originalSize: file.size,
      }))
    );

    // Add all items to state at once
    setItems((prev) => [...prev, ...newItems]);

    // Compress images sequentially to avoid overwhelming the browser
    for (const item of newItems) {
      try {
        const compressedFile = await compressImage(item.originalFile);

        // Update item with compressed file
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  file: compressedFile,
                  status: 'queued',
                  compressedSize: compressedFile.size,
                }
              : i
          )
        );

        // Add to upload queue
        uploadQueueRef.current.push({ ...item, file: compressedFile, status: 'queued', compressedSize: compressedFile.size });
        processQueue();
      } catch (error) {
        console.error('Compression failed for:', item.originalFile.name, error);
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? { ...i, status: 'error', error: 'Compression failed' }
              : i
          )
        );
      }
    }
  };

  const processQueue = () => {
    while (
      activeUploadsRef.current < MAX_CONCURRENT &&
      uploadQueueRef.current.length > 0
    ) {
      const item = uploadQueueRef.current.shift();
      if (item) {
        uploadFile(item);
      }
    }
  };

  const uploadFile = async (item: UploadItem) => {
    activeUploadsRef.current += 1;

    // Update status to uploading
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: 'uploading' } : i))
    );

    try {
      const formData = new FormData();
      formData.append('file', item.file);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100;
          setItems((prev) =>
            prev.map((i) =>
              i.id === item.id ? { ...i, progress: Math.round(progress) } : i
            )
          );
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);

          // Revoke the preview URL to free memory
          if (item.preview) {
            URL.revokeObjectURL(item.preview);
          }

          setItems((prev) =>
            prev.map((i) =>
              i.id === item.id
                ? { ...i, status: 'done', progress: 100, url: response.url, preview: '' }
                : i
            )
          );

          // Add to uploaded URLs
          setUploadedUrls((prev) => {
            const newUrls = [...prev, response.url];
            onImagesChange(newUrls);
            return newUrls;
          });
        } else {
          throw new Error('Upload failed');
        }

        activeUploadsRef.current -= 1;
        processQueue();
      });

      xhr.addEventListener('error', () => {
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? { ...i, status: 'error', error: 'Upload failed' }
              : i
          )
        );
        activeUploadsRef.current -= 1;
        processQueue();
      });

      xhr.open('POST', '/api/upload');
      xhr.send(formData);
    } catch (error) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? { ...i, status: 'error', error: 'Upload failed' }
            : i
        )
      );
      activeUploadsRef.current -= 1;
      processQueue();
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleRemoveItem = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item?.preview) {
      URL.revokeObjectURL(item.preview);
    }

    setItems((prev) => prev.filter((i) => i.id !== id));
    uploadQueueRef.current = uploadQueueRef.current.filter((i) => i.id !== id);

    if (item?.url) {
      setUploadedUrls((prev) => {
        const newUrls = prev.filter((url) => url !== item.url);
        onImagesChange(newUrls);
        return newUrls;
      });
    }
  };

  const handleRetry = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, status: 'queued', progress: 0, error: undefined } : i
      )
    );

    uploadQueueRef.current.push(item);
    processQueue();
  };

  const isAllDone = items.length > 0 && items.every((i) => i.status === 'done');
  const hasErrors = items.some((i) => i.status === 'error');
  const totalProgress = items.length > 0
    ? items.reduce((sum, item) => sum + item.progress, 0) / items.length
    : 0;

  return (
    <div>
      <label className="block mb-2 text-[var(--color-gold)] font-semibold">
        Images
      </label>

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-[var(--color-gold)] bg-[var(--color-gold)] bg-opacity-10'
            : 'border-[var(--color-border)] hover:border-[var(--color-gold)]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
        <div className="text-[var(--color-gold)] opacity-80">
          <div className="text-4xl mb-2">📸</div>
          <p className="text-lg mb-1">Drag & drop images here</p>
          <p className="text-sm opacity-60">or click to browse</p>
          <p className="text-xs opacity-60 mt-2">
            Images will be auto-compressed before upload
          </p>
          <p className="text-xs opacity-60">
            Max {MAX_CONCURRENT} concurrent uploads
          </p>
        </div>
      </div>

      {/* Global Progress */}
      {items.length > 0 && !isAllDone && (
        <div className="mt-4">
          <div className="flex justify-between text-sm text-[var(--color-gold)] mb-2">
            <span>Overall Progress</span>
            <span>{Math.round(totalProgress)}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${totalProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Upload Items */}
      {items.length > 0 && (
        <div className="mt-6 space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-3 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-lg"
            >
              {/* Preview */}
              <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden bg-[var(--color-bg)]">
                <Image
                  src={item.url || item.preview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="text-[var(--color-gold)] text-sm truncate mb-1">
                  {item.file.name}
                </div>
                <div className="text-xs text-[var(--color-gold)] opacity-60 mb-2">
                  {item.originalSize && item.compressedSize ? (
                    <>
                      {formatFileSize(item.originalSize)} → {formatFileSize(item.compressedSize)}
                      <span className="text-[var(--color-gold)] ml-1">
                        ({Math.round(((item.originalSize - item.compressedSize) / item.originalSize) * 100)}% smaller)
                      </span>
                    </>
                  ) : (
                    formatFileSize(item.file.size)
                  )}
                </div>

                {/* Progress Bar */}
                {item.status === 'uploading' && (
                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                )}

                {/* Error */}
                {item.status === 'error' && (
                  <div className="text-[var(--color-danger)] text-xs">
                    {item.error}
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                {item.status === 'compressing' && (
                  <span className="text-[var(--color-gold)] opacity-60 text-sm">
                    Compressing...
                  </span>
                )}
                {item.status === 'queued' && (
                  <span className="text-[var(--color-gold)] opacity-60 text-sm">
                    Queued...
                  </span>
                )}
                {item.status === 'uploading' && (
                  <span className="text-[var(--color-gold)] text-sm">
                    {item.progress}%
                  </span>
                )}
                {item.status === 'done' && (
                  <span className="text-[var(--color-gold)] text-xl">✓</span>
                )}
                {item.status === 'error' && (
                  <button
                    onClick={() => handleRetry(item.id)}
                    className="text-[var(--color-gold)] hover:text-[var(--color-gold-hover)] text-sm underline"
                  >
                    Retry
                  </button>
                )}
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-[var(--color-danger)] hover:opacity-80 text-xl"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Status Messages */}
      {isAllDone && (
        <div className="mt-4 p-3 bg-[var(--color-gold)] border border-[var(--color-gold)] rounded-lg text-center">
          <p className="text-black font-semibold">
            All images uploaded successfully! ({uploadedUrls.length} total)
          </p>
        </div>
      )}

      {hasErrors && (
        <div className="mt-4 p-3 bg-[var(--color-danger)] border border-[var(--color-danger)] rounded-lg text-center">
          <p className="text-white font-semibold">
            Some uploads failed. Click retry to try again.
          </p>
        </div>
      )}
    </div>
  );
}
