import Link from 'next/link';
import Image from 'next/image';
import type { HomepageFeature, Species } from '@/types';
import styles from './HeroFeature.module.css';

interface HeroFeatureProps {
  feature: HomepageFeature;
  species?: Species | null;
}

function getUrl(feature: HomepageFeature): string {
  if (feature.customUrl) return feature.customUrl;

  switch (feature.contentType) {
    case 'Species':
      return `/species/${feature.slug}`;
    case 'Recipe':
      return `/recipes/${feature.slug}`;
    case 'Danger':
      return `/dangers/${feature.slug}`;
    case 'Journal':
      return `/journal/${feature.slug}`;
    default:
      return '#';
  }
}

export default function HeroFeature({ feature, species }: HeroFeatureProps) {
  const url = getUrl(feature);

  // Determine image URL
  let imageUrl: string | null = null;
  if (feature.image) {
    imageUrl = feature.image.url;
  } else if (species?.photos?.[0]) {
    imageUrl = species.photos[0].url;
  }

  const description = feature.description || species?.shortDescription || '';

  return (
    <Link href={url} className={styles.hero}>
      <div className={styles.imageWrap}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={feature.title}
            fill
            priority
            sizes="100vw"
            className={styles.image}
          />
        ) : (
          <div className={styles.placeholder} />
        )}
        <div className={styles.overlay} />
      </div>
      <div className={styles.content}>
        {feature.badge && (
          <span className={styles.badge}>{feature.badge}</span>
        )}
        <span className={styles.type}>{feature.contentType}</span>
        <h2 className={styles.title}>{feature.title}</h2>
        {description && (
          <p className={styles.desc}>{description}</p>
        )}
        <span className={styles.cta}>Explore →</span>
      </div>
    </Link>
  );
}
