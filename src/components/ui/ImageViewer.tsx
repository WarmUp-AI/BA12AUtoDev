'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ImageViewerProps {
  images: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageViewer({ images, initialIndex = 0, isOpen, onClose }: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="text-white text-sm">
            {currentIndex + 1} / {images.length}
          </div>
          <button
            onClick={onClose}
            className="text-white text-3xl hover:text-[var(--color-gold)] transition-colors p-2"
            aria-label="Close viewer"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Main Image */}
      <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8">
        <div className="relative w-full h-full max-w-7xl max-h-[90vh]">
          <Image
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            fill
            className="object-contain"
            priority
            sizes="100vw"
          />
        </div>
      </div>

      {/* Navigation - Previous */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-4 rounded-full transition-all z-10 hover:scale-110"
            aria-label="Previous image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Navigation - Next */}
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-4 rounded-full transition-all z-10 hover:scale-110"
            aria-label="Next image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <div className="flex gap-2 overflow-x-auto max-w-full pb-2 scrollbar-thin scrollbar-thumb-[var(--color-gold)] scrollbar-track-gray-800">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded overflow-hidden border-2 transition-all ${
                  index === currentIndex
                    ? 'border-[var(--color-gold)] scale-110'
                    : 'border-transparent opacity-60 hover:opacity-100 hover:border-white'
                }`}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-white text-sm opacity-50 hidden md:block">
        Use arrow keys or click arrows to navigate • ESC to close
      </div>
    </div>
  );
}
