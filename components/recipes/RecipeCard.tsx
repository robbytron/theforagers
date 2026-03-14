import Link from 'next/link';
import Image from 'next/image';
import type { Recipe } from '@/types';
import styles from './RecipeCard.module.css';

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const difficultyClass = recipe.difficulty === 'Easy' ? 'tag-beginner'
    : recipe.difficulty === 'Involved' ? 'tag-caution' : 'tag-season';

  return (
    <Link href={`/recipes/${recipe.slug}`} className={styles.card}>
      <div className={styles.imgWrap}>
        {recipe.image ? (
          <Image src={recipe.image.url} alt={recipe.name} fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={styles.img} />
        ) : (
          <div className={styles.imgPlaceholder} />
        )}
      </div>
      <div className={styles.body}>
        <div className={styles.tags}>
          <span className={`tag ${difficultyClass}`}>{recipe.difficulty}</span>
          {recipe.prepTime && <span className={styles.time}>{recipe.prepTime}</span>}
        </div>
        <p className={styles.name}>{recipe.name}</p>
        <p className={styles.desc}>{recipe.shortDescription}</p>
      </div>
    </Link>
  );
}
