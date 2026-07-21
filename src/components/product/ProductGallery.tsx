"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import type { ProductImage } from "@/types/product";
import { cn } from "@/lib/utils";

export interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
  className?: string;
}

export function ProductGallery({ images, productName, className }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setLightboxOpen] = useState(false);
  const active = images[activeIndex];

  const goTo = (index: number) => {
    setActiveIndex(((index % images.length) + images.length) % images.length);
  };

  useEffect(() => {
    if (!isLightboxOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") goTo(activeIndex + 1);
      if (e.key === "ArrowLeft") goTo(activeIndex - 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLightboxOpen, activeIndex]);

  if (!active) return null;

  return (
    <div className={cn("flex flex-col-reverse gap-4 md:flex-row", className)}>
      {/* Thumbnails */}
      {images.length > 1 && (
        <div
          role="tablist"
          aria-label={`${productName} images`}
          className="flex gap-3 overflow-x-auto md:w-20 md:flex-col md:overflow-visible"
        >
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Show image ${index + 1} of ${images.length}`}
              onClick={() => goTo(index)}
              className={cn(
                "relative aspect-[4/5] w-16 shrink-0 overflow-hidden border transition-colors md:w-full",
                index === activeIndex ? "border-ink" : "border-stone-light hover:border-stone"
              )}
            >
              <Image src={image.url} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div className="relative flex-1">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          aria-label={`Enlarge image: ${active.alt}`}
          className="group relative block aspect-[4/5] w-full overflow-hidden bg-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <Image
            src={active.url}
            alt={active.alt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
            priority
          />
          <span className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center bg-bone/90 opacity-0 transition-opacity group-hover:opacity-100">
            <ZoomIn className="h-4 w-4 stroke-ink" />
          </span>
        </button>

        {images.length > 1 && (
          <div className="mt-2 flex justify-center gap-1.5 md:hidden">
            {images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                aria-label={`Show image ${index + 1} of ${images.length}`}
                onClick={() => goTo(index)}
                className={cn(
                  "h-1.5 w-1.5 rounded-full transition-colors",
                  index === activeIndex ? "bg-ink" : "bg-stone-light"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${productName} â€” enlarged image`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            aria-label="Close enlarged image"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center text-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bone"
          >
            <X className="h-6 w-6" />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(activeIndex - 1);
                }}
                className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bone sm:left-4"
              >
                <ChevronLeft className="h-7 w-7" />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(activeIndex + 1);
                }}
                className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bone sm:right-4"
              >
                <ChevronRight className="h-7 w-7" />
              </button>
            </>
          )}

          <div
            className="relative h-[85vh] w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image src={active.url} alt={active.alt} fill sizes="90vw" className="object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductGallery;