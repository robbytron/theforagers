import Link from 'next/link';
import Image from 'next/image';
import type { HomepageFeature, Species, Recipe } from '@/types';
import styles from './FeaturedCard.module.css';

interface FeaturedCardProps {
  feature: HomepageFeature;
  species?: Species | null;
  recipe?: Recipe | null;
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

export default function FeaturedCard({ feature, species, recipe }: FeaturedCardProps) {
  const url = getUrl(feature);

  // Determine image URL
  let imageUrl: string | null = null;
  if (feature.image) {
    imageUrl = feature.image.url;
  } else if (species?.photos?.[0]) {
    imageUrl = species.photos[0].url;
  } else if (recipe?.image) {
    imageUrl = recipe.image.url;
  }

  // Determine description
  const description = feature.description || species?.shortDescription || recipe?.shortDescription || '';

  return (
    <Link href={url} className={styles.card}>
      <div className={styles.imageWrap}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={feature.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={styles.image}
          />
        ) : (
          <div className={styles.placeholder} />
        )}
        {feature.badge && (
          <span className={styles.badge}>{feature.badge}</span>
        )}
      </div>
      <div className={styles.content}>
        <span className={styles.type}>{feature.contentType}</span>
        <h3 className={styles.title}>{feature.title}</h3>
        {description && (
          <p className={styles.desc}>{description}</p>
        )}
        <span className={styles.cta}>Read more →</span>
      </div>
    </Link>
  );
}
