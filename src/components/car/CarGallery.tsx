'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageViewer } from '@/components/ui/ImageViewer';

interface CarGalleryProps {
  images: string[];
  title: string;
}

export function CarGallery({ images, title }: CarGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-[16/9] bg-[var(--color-card-bg)] rounded-lg flex items-center justify-center">
        <p className="text-[var(--color-gold)] opacity-60">No images available</p>
      </div>
    );
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative w-full aspect-[16/9] bg-[var(--color-card-bg)] rounded-lg overflow-hidden group cursor-pointer">
        <button
          onClick={() => setViewerOpen(true)}
          className="absolute inset-0 w-full h-full"
          aria-label="View fullscreen"
        >
          <Image
            src={images[currentIndex]}
            alt={`${title} - Image ${currentIndex + 1}`}
            fill
            className="object-contain transition-transform group-hover:scale-105"
            priority={currentIndex === 0}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
        </button>

        {/* Fullscreen Icon */}
        <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </div>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-[var(--color-gold)] w-12 h-12 rounded-full flex items-center justify-center transition-all z-10"
              aria-label="Previous image"
              type="button"
            >
              ‹
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-[var(--color-gold)] w-12 h-12 rounded-full flex items-center justify-center transition-all z-10"
              aria-label="Next image"
              type="button"
            >
              ›
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-70 text-[var(--color-gold)] px-4 py-2 rounded-full text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? 'border-[var(--color-gold)] scale-95'
                  : 'border-transparent hover:border-[var(--color-gold)] opacity-60 hover:opacity-100'
              }`}
            >
              <Image
                src={image}
                alt={`${title} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="150px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Image Viewer */}
      <ImageViewer
        images={images}
        initialIndex={currentIndex}
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
      />
    </div>
  );
}
