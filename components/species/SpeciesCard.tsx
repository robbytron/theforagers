import Link from 'next/link';
import Image from 'next/image';
import type { Species } from '@/types';
import styles from './SpeciesCard.module.css';

export default function SpeciesCard({ species }: { species: Species }) {
  const photo = species.photos[0];
  const difficultyClass = species.difficulty === 'Beginner' ? 'tag-beginner'
    : species.difficulty === 'Expert Only' ? 'tag-caution' : 'tag-season';

  return (
    <Link href={`/species/${species.slug}`} className={styles.card}>
      <div className={styles.imgWrap}>
        {photo ? (
          <Image src={photo.url} alt={species.name} fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={styles.img} />
        ) : (
          <div className={styles.imgPlaceholder} />
        )}
      </div>
      <div className={styles.body}>
        <div className={styles.tags}>
          <span className="tag tag-season">{species.type}</span>
          <span className={`tag ${difficultyClass}`}>{species.difficulty}</span>
        </div>
        <p className={styles.name}>{species.name}</p>
        <p className={styles.latin}>{species.latinName}</p>
        <p className={styles.desc}>{species.shortDescription}</p>
        <div className={styles.footer}>
          <span className={styles.habitat}>{species.habitat}</span>
          <span className={styles.cta}>Full guide →</span>
        </div>
      </div>
    </Link>
  );
}
