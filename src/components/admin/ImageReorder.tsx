'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageReorderProps {
  images: string[];
  onReorder: (newOrder: string[]) => void;
}

export function ImageReorder({ images, onReorder }: ImageReorderProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedIndex === null) return;

    const newImages = [...images];
    const [draggedImage] = newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, draggedImage);

    onReorder(newImages);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onReorder(newImages);
  };

  const moveImage = (fromIndex: number, direction: 'up' | 'down') => {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= images.length) return;

    const newImages = [...images];
    [newImages[fromIndex], newImages[toIndex]] = [newImages[toIndex], newImages[fromIndex]];
    onReorder(newImages);
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--color-gold)] opacity-60">
        No images uploaded yet
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-[var(--color-gold)] opacity-80 mb-4">
        <span className="hidden md:inline">Drag and drop to reorder images. </span>
        <span className="md:hidden">Use the arrow buttons to reorder. </span>
        The first image will be the main image.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((imageUrl, index) => (
          <div
            key={`${imageUrl}-${index}`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={`relative rounded-lg overflow-hidden border-2 transition-all ${
              draggedIndex === index
                ? 'opacity-50 border-[var(--color-gold)] scale-95'
                : dragOverIndex === index
                ? 'border-[var(--color-gold)] scale-105'
                : 'border-[var(--color-border)] hover:border-[var(--color-gold)]'
            }`}
          >
            {/* Image and Controls Container */}
            <div className="flex items-center gap-3 p-3 bg-[var(--color-card-bg)]">
              {/* Image Preview */}
              <div className="relative w-24 h-24 flex-shrink-0 rounded overflow-hidden bg-[var(--color-bg)]">
                <Image
                  src={imageUrl}
                  alt={`Car image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                {/* Order Badge */}
                <div className="absolute top-1 left-1 bg-black bg-opacity-75 text-white text-xs font-bold px-2 py-1 rounded">
                  {index + 1}
                  {index === 0 && <span className="ml-1">⭐</span>}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="text-[var(--color-gold)] text-sm font-semibold">
                  {index === 0 ? 'Main image' : `Image ${index + 1}`}
                </div>
                <div className="text-xs text-[var(--color-gold)] opacity-60">
                  {index === 0 ? 'Shown first in listings' : `Position ${index + 1}`}
                </div>
              </div>

              {/* Controls - Always visible */}
              <div className="flex flex-col gap-2">
                {/* Move Up */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveImage(index, 'up');
                  }}
                  disabled={index === 0}
                  className={`w-10 h-10 flex items-center justify-center rounded text-xl ${
                    index === 0
                      ? 'text-[var(--color-gold)] opacity-30 cursor-not-allowed'
                      : 'text-[var(--color-gold)] hover:bg-[var(--color-bg)] active:bg-[var(--color-gold)] active:text-black'
                  }`}
                  title="Move up"
                  type="button"
                >
                  ▲
                </button>

                {/* Move Down */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveImage(index, 'down');
                  }}
                  disabled={index === images.length - 1}
                  className={`w-10 h-10 flex items-center justify-center rounded text-xl ${
                    index === images.length - 1
                      ? 'text-[var(--color-gold)] opacity-30 cursor-not-allowed'
                      : 'text-[var(--color-gold)] hover:bg-[var(--color-bg)] active:bg-[var(--color-gold)] active:text-black'
                  }`}
                  title="Move down"
                  type="button"
                >
                  ▼
                </button>
              </div>

              {/* Remove Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(index);
                }}
                className="w-10 h-10 flex items-center justify-center rounded text-[var(--color-danger)] hover:bg-red-900 hover:bg-opacity-20 text-2xl"
                title="Remove image"
                type="button"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
