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
        Drag and drop to reorder images. The first image will be the main image.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((imageUrl, index) => (
          <div
            key={`${imageUrl}-${index}`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={`relative group cursor-move rounded-lg overflow-hidden border-2 transition-all ${
              draggedIndex === index
                ? 'opacity-50 border-[var(--color-gold)] scale-95'
                : dragOverIndex === index
                ? 'border-[var(--color-gold)] scale-105'
                : 'border-[var(--color-border)] hover:border-[var(--color-gold)]'
            }`}
          >
            {/* Image Preview */}
            <div className="relative aspect-[4/3] bg-[var(--color-bg)]">
              <Image
                src={imageUrl}
                alt={`Car image ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>

            {/* Order Badge */}
            <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs font-bold px-2 py-1 rounded">
              {index + 1}
              {index === 0 && <span className="ml-1">⭐</span>}
            </div>

            {/* Controls Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              {/* Move Up */}
              {index > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveImage(index, 'up');
                  }}
                  className="p-2 bg-[var(--color-gold)] text-black rounded-full hover:bg-[var(--color-gold-hover)] transition-colors"
                  title="Move up"
                  type="button"
                >
                  ↑
                </button>
              )}

              {/* Move Down */}
              {index < images.length - 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveImage(index, 'down');
                  }}
                  className="p-2 bg-[var(--color-gold)] text-black rounded-full hover:bg-[var(--color-gold-hover)] transition-colors"
                  title="Move down"
                  type="button"
                >
                  ↓
                </button>
              )}

              {/* Remove */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(index);
                }}
                className="p-2 bg-[var(--color-danger)] text-white rounded-full hover:opacity-80 transition-opacity"
                title="Remove image"
                type="button"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-[var(--color-gold)] opacity-60 mt-4">
        💡 Tip: You can also use the ↑ ↓ buttons to reorder images
      </p>
    </div>
  );
}
