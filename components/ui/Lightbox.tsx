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
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>×</button>

        <div className={styles.imageContainer}>
          <Image
            src={photo.url}
            alt={`Photo ${currentIndex + 1}`}
            fill
            sizes="800px"
            className={styles.image}
            priority
          />
        </div>

        {photos.length > 1 && (
          <div className={styles.controls}>
            <button className={styles.prev} onClick={goPrev}>← Prev</button>
            <span className={styles.counter}>{currentIndex + 1} / {photos.length}</span>
            <button className={styles.next} onClick={goNext}>Next →</button>
          </div>
        )}

        {photo.attribution && (
          <div className={styles.attribution}>{photo.attribution}</div>
        )}
      </div>
    </div>
  );
}
