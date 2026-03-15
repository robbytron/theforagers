import Link from 'next/link';
import Image from 'next/image';
import type { Species } from '@/types';
import styles from './SpeciesCard.module.css';

// Map type to CSS class
function getTypeClass(type: string): string {
  const typeMap: Record<string, string> = {
    'Greens': 'tag-greens',
    'Fungi': 'tag-fungi',
    'Berries': 'tag-fruit',
    'Nuts': 'tag-nuts',
    'Roots': 'tag-roots',
    'Coastal': 'tag-coastal',
    'Flowers': 'tag-flowers',
  };
  return typeMap[type] || 'tag-greens';
}

// Display name for types
function getTypeDisplay(type: string): string {
  if (type === 'Berries') return 'Fruit/Berries';
  return type;
}

// Map difficulty to CSS class
function getDifficultyClass(difficulty: string): string {
  const diffMap: Record<string, string> = {
    'Beginner': 'tag-beginner',
    'Intermediate': 'tag-intermediate',
    'Expert Only': 'tag-expert',
  };
  return diffMap[difficulty] || 'tag-intermediate';
}


export default function SpeciesCard({ species }: { species: Species }) {
  const photo = species.photos[0];
  const typeClass = getTypeClass(species.type);
  const difficultyClass = getDifficultyClass(species.difficulty);

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
          <span className={`tag ${typeClass}`}>{getTypeDisplay(species.type)}</span>
          <span className={`tag ${difficultyClass}`}>{species.difficulty}</span>
        </div>
        <p className={styles.name}>{species.name}</p>
        <p className={styles.latin}>{species.latinName}</p>
        <p className={styles.desc}>{species.shortDescription}</p>
        <div className={styles.footer}>
          <span className={styles.cta}>Full guide →</span>
        </div>
      </div>
    </Link>
  );
}
