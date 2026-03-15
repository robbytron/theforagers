import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import { getRecipeBySlug, getAllRecipeSlugs } from '@/lib/airtable';
import styles from './page.module.css';

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllRecipeSlugs();
  return slugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);
  if (!recipe) return {};
  return { title: recipe.name, description: recipe.shortDescription };
}

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);
  if (!recipe) notFound();

  const difficultyClass = recipe.difficulty === 'Easy' ? 'tag-beginner'
    : recipe.difficulty === 'Involved' ? 'tag-caution' : 'tag-season';

  return (
    <>
      <Nav />
      <div className={styles.hero}>
        {recipe.image ? (
          <Image src={recipe.image.url} alt={recipe.name} fill priority sizes="100vw" className={styles.heroImg} />
        ) : <div className={styles.heroPlaceholder} />}
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <Link href="/recipes" className={styles.breadcrumb}>← All recipes</Link>
          <div className={styles.heroTags}>
            <span className={`tag ${difficultyClass}`}>{recipe.difficulty}</span>
            {recipe.category && <span className="tag tag-season">{recipe.category}</span>}
          </div>
          <h1 className={styles.heroTitle}>{recipe.name}</h1>
          <p className={styles.heroDesc}>{recipe.shortDescription}</p>
        </div>
      </div>

      <div className={styles.layout}>
        <article className={styles.article}>
          {recipe.intro && (
            <section className={styles.section}>
              <p className={styles.intro}>{recipe.intro}</p>
            </section>
          )}

          <section className={styles.section}>
            <h2 className={styles.sectionHead}>Ingredients</h2>
            <div className={styles.ingredientsList}>
              {recipe.ingredients.split('\n').filter(Boolean).map((line, i) => (
                <p key={i} className={styles.ingredient}>{line}</p>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionHead}>Method</h2>
            <div className={styles.methodList}>
              {recipe.method.split('\n').filter(Boolean).map((step, i) => (
                <p key={i} className={styles.step}>{step}</p>
              ))}
            </div>
          </section>

          {recipe.notes && (
            <section className={styles.section}>
              <h2 className={styles.sectionHead}>Notes</h2>
              <p className={styles.notes}>{recipe.notes}</p>
            </section>
          )}
        </article>

        <aside className={styles.sidebar}>
          <div className={styles.factCard}>
            <h3 className={styles.factHead}>At a glance</h3>
            <dl className={styles.factList}>
              <div className={styles.factRow}><dt>Difficulty</dt><dd>{recipe.difficulty}</dd></div>
              {recipe.prepTime && <div className={styles.factRow}><dt>Prep time</dt><dd>{recipe.prepTime}</dd></div>}
              {recipe.cookTime && <div className={styles.factRow}><dt>Cook time</dt><dd>{recipe.cookTime}</dd></div>}
              {recipe.servings && <div className={styles.factRow}><dt>Servings</dt><dd>{recipe.servings}</dd></div>}
              {recipe.season && recipe.season.length > 0 && <div className={styles.factRow}><dt>Season</dt><dd>{recipe.season.join(', ')}</dd></div>}
            </dl>
          </div>
        </aside>
      </div>
    </>
  );
}
