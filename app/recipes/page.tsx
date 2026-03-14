import type { Metadata } from 'next';
import Nav from '@/components/ui/Nav';
import RecipeCard from '@/components/recipes/RecipeCard';
import { getAllRecipes } from '@/lib/airtable';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Wild Food Recipes',
  description: 'Recipes using foraged ingredients from British hedgerows, woodlands, and coastlines.',
};

export const revalidate = 3600;

export default async function RecipesIndexPage() {
  const recipes = await getAllRecipes();

  return (
    <>
      <Nav />
      <div className={styles.pageHero}>
        <p className={styles.heroLabel}>From field to table</p>
        <h1 className={styles.heroTitle}>Wild food<br /><em>recipes</em></h1>
        <p className={styles.heroSub}>{recipes.length} recipes using foraged ingredients — from simple preparations to weekend projects.</p>
      </div>
      <div className={styles.grid}>
        {recipes.length === 0 ? (
          <p className={styles.empty}>No recipes yet. Add some in Airtable and set Status to Live.</p>
        ) : (
          recipes.map(r => <RecipeCard key={r.id} recipe={r} />)
        )}
      </div>
    </>
  );
}
