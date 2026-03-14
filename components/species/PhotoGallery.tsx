'use client';

import { useState } from 'react';
import Image from 'next/image';
import Lightbox from '@/components/ui/Lightbox';
import styles from './PhotoGallery.module.css';

interface Photo {
  url: string;
  thumbUrl: string;
  attribution?: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
  speciesName: string;
}

export default function PhotoGallery({ photos, speciesName }: PhotoGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (photos.length === 0) return null;

  return (
    <>
      <div className={styles.gallery}>
        {photos.map((photo, i) => (
          <button
            key={i}
            className={styles.galleryItem}
            onClick={() => setLightboxIndex(i)}
            aria-label={`View ${speciesName} photo ${i + 1}`}
          >
            <Image
              src={photo.thumbUrl}
              alt={`${speciesName} ${i + 1}`}
              fill
              sizes="200px"
              className={styles.galleryImg}
            />
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
