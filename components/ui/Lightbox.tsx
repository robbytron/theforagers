'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import styles from './Lightbox.module.css';

interface Photo {
  url: string;
  thumbUrl: string;
  attribution?: string;
}

interface LightboxProps {
  photos: Photo[];
  initialIndex: number;
  onClose: () => void;
}

export default function Lightbox({ photos, initialIndex, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % photos.length);
  }, [photos.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + photos.length) % photos.length);
  }, [photos.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, goNext, goPrev]);

  const photo = photos[currentIndex];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <button className={styles.close} onClick={onClose}>×</button>

      {photos.length > 1 && (
        <>
          <button className={styles.prev} onClick={(e) => { e.stopPropagation(); goPrev(); }}>‹</button>
          <button className={styles.next} onClick={(e) => { e.stopPropagation(); goNext(); }}>›</button>
        </>
      )}

      <div className={styles.imageContainer} onClick={(e) => e.stopPropagation()}>
        <Image
          src={photo.url}
          alt={`Photo ${currentIndex + 1}`}
          fill
          sizes="90vw"
          className={styles.image}
          priority
        />
      </div>

      {photos.length > 1 && (
        <div className={styles.counter}>
          {currentIndex + 1} / {photos.length}
        </div>
      )}

      {photo.attribution && (
        <div className={styles.attribution}>{photo.attribution}</div>
      )}
    </div>
  );
}
