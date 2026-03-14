import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import SpeciesCard from '@/components/species/SpeciesCard';
import RecipeCard from '@/components/recipes/RecipeCard';
import { getAllSpecies, getAllRecipes } from '@/lib/airtable';
import type { Month } from '@/types';
import styles from './page.module.css';

export const revalidate = 3600;

const MONTHS: Month[] = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const MONTH_DATA: Record<Month, { season: string; intro: string; tips: string[] }> = {
  January: {
    season: 'Deep Winter',
    intro: 'The foraging year is at its quietest, but there are still treasures to be found. Winter fungi, evergreen herbs, and stored preserves from autumn keep the kitchen supplied.',
    tips: ['Check elder branches for Jelly Ear mushrooms after rain', 'Harvest chickweed from sheltered spots', 'Sea beet remains available on mild coastlines', 'A good month for planning the year ahead'],
  },
  February: {
    season: 'Late Winter',
    intro: 'The first stirrings of spring appear. Early shoots push through, and the lengthening days bring new growth to sheltered spots.',
    tips: ['Wild garlic leaves begin to emerge in woodlands', 'Look for early nettles in sunny corners', 'Cleavers appear along hedgerows', 'Birch sap can be tapped late in the month'],
  },
  March: {
    season: 'Early Spring',
    intro: 'Spring arrives in earnest. Woodlands fill with wild garlic, and hedgerows burst into life. This is the start of the forager\'s busiest season.',
    tips: ['Wild garlic is at its peak — harvest leaves before flowering', 'Young nettle tops are perfect for soup', 'Hawthorn leaf buds open (bread and cheese)', 'Three-cornered leek flowers appear'],
  },
  April: {
    season: 'Spring',
    intro: 'The abundance continues. Woodland floors carpet with wild garlic, spring greens are everywhere, and the first edible flowers appear.',
    tips: ['Wild garlic flowers add punch to salads', 'Wood sorrel thrives in shady spots', 'Dandelion leaves are at their least bitter', 'Alexanders go to seed — harvest stalks now'],
  },
  May: {
    season: 'Late Spring',
    intro: 'Peak spring foraging. Elderflowers scent the hedgerows, wild garlic fades, and the first summer species begin to appear.',
    tips: ['Elderflower season begins mid-month', 'Jack-by-the-hedge flowers are edible', 'Hawthorn blossom can be gathered', 'Pignut season — look for feathery leaves'],
  },
  June: {
    season: 'Early Summer',
    intro: 'Summer arrives with elderflowers in full bloom. Coastal foraging improves, and the first soft fruits appear in sunny hedgerows.',
    tips: ['Elderflower cordial time — pick on dry, sunny days', 'Wild strawberries ripen in woodland edges', 'Samphire season begins on the coast', 'Meadowsweet flowers for syrups and drinks'],
  },
  July: {
    season: 'High Summer',
    intro: 'The hedgerows are heavy with fruit. Early blackberries appear, bilberries ripen on moorland, and coastal foraging is at its peak.',
    tips: ['First blackberries ripen in warm spots', 'Bilberries are ready on upland moors', 'Chanterelles appear after summer rain', 'Sea purslane is succulent and salty'],
  },
  August: {
    season: 'Late Summer',
    intro: 'The main harvest begins. Blackberries are everywhere, mushrooms emerge in force, and the hedgerows drip with fruit.',
    tips: ['Blackberry season peaks — pick daily', 'Crab apples begin to colour', 'Giant puffballs appear in grassland', 'Elderberries start to ripen'],
  },
  September: {
    season: 'Early Autumn',
    intro: 'The most abundant month. Hedgerow fruits, nuts, and mushrooms offer a daily harvest. This is the forager\'s great reward.',
    tips: ['Sloes are ready after the first frost (or freeze them)', 'Hazelnut season — beat the squirrels', 'Mushroom season in full swing', 'Rosehips and hawthorn berries ripen'],
  },
  October: {
    season: 'Autumn',
    intro: 'The harvest continues. Sweet chestnuts fall, late mushrooms fruit, and the last of the berries cling to bare hedgerows.',
    tips: ['Sweet chestnuts drop in woodland', 'Wood blewits appear in leaf litter', 'Medlars are ready to blet', 'Quince ripens in old gardens'],
  },
  November: {
    season: 'Late Autumn',
    intro: 'The year slows. Late mushrooms, winter greens, and the last nuts of the year. Time to preserve and prepare for winter.',
    tips: ['Velvet shank mushrooms fruit into winter', 'Sloes continue to sweeten', 'Sea buckthorn berries at their best', 'Horseradish roots are pungent now'],
  },
  December: {
    season: 'Early Winter',
    intro: 'The quiet months begin. Evergreen herbs, winter mushrooms, and coastal greens sustain the forager through the dark days.',
    tips: ['Jelly Ear on elder branches', 'Winter chanterelles in conifer woods', 'Chickweed in sheltered spots', 'Plan next year\'s foraging calendar'],
  },
};

function getMonthIndex(month: Month): number {
  return MONTHS.indexOf(month);
}

function getPrevMonth(month: Month): Month {
  const idx = getMonthIndex(month);
  return MONTHS[(idx - 1 + 12) % 12];
}

function getNextMonth(month: Month): Month {
  const idx = getMonthIndex(month);
  return MONTHS[(idx + 1) % 12];
}

export function generateStaticParams() {
  return MONTHS.map(month => ({ month: month.toLowerCase() }));
}

export async function generateMetadata({ params }: { params: Promise<{ month: string }> }): Promise<Metadata> {
  const { month } = await params;
  const monthName = MONTHS.find(m => m.toLowerCase() === month.toLowerCase());
  if (!monthName) return {};
  return {
    title: `${monthName} Foraging Guide — What to Find`,
    description: `What to forage in ${monthName} in Britain. ${MONTH_DATA[monthName].intro.slice(0, 120)}...`,
  };
}

export default async function MonthPage({ params }: { params: Promise<{ month: string }> }) {
  const { month } = await params;
  const monthName = MONTHS.find(m => m.toLowerCase() === month.toLowerCase());
  if (!monthName) notFound();

  const [allSpecies, allRecipes] = await Promise.all([
    getAllSpecies(),
    getAllRecipes(),
  ]);

  const species = allSpecies.filter(s => s.seasons.includes(monthName));
  const data = MONTH_DATA[monthName];
  const now = new Date();
  const isCurrentMonth = MONTHS[now.getMonth()] === monthName;

  // Get recipes that use species in season this month
  const speciesNames = species.map(s => s.name.toLowerCase());
  const seasonalRecipes = allRecipes.filter(r => {
    const ingredients = r.ingredients.toLowerCase();
    return speciesNames.some(name => ingredients.includes(name));
  }).slice(0, 6);

  return (
    <>
      <Nav />
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.heroLabel}>{data.season}</p>
          <h1 className={styles.heroTitle}>{monthName}</h1>
          {isCurrentMonth && <span className={styles.nowBadge}>You are here</span>}
        </div>
      </div>

      <div className={styles.monthNav}>
        <Link href={`/calendar/${getPrevMonth(monthName).toLowerCase()}`} className={styles.navArrow}>
          ← {getPrevMonth(monthName).slice(0, 3)}
        </Link>
        <Link href="/calendar" className={styles.navAll}>All months</Link>
        <Link href={`/calendar/${getNextMonth(monthName).toLowerCase()}`} className={styles.navArrow}>
          {getNextMonth(monthName).slice(0, 3)} →
        </Link>
      </div>

      <div className={styles.layout}>
        <section className={styles.introSection}>
          <p className={styles.intro}>{data.intro}</p>
          <div className={styles.tipsBox}>
            <h3 className={styles.tipsHead}>What to look for</h3>
            <ul className={styles.tipsList}>
              {data.tips.map((tip, i) => (
                <li key={i} className={styles.tip}>{tip}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles.speciesSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>In season</h2>
            <p className={styles.sectionMeta}>{species.length} species</p>
          </div>
          {species.length > 0 ? (
            <div className={styles.speciesGrid}>
              {species.map(s => <SpeciesCard key={s.id} species={s} />)}
            </div>
          ) : (
            <p className={styles.empty}>Species data coming soon.</p>
          )}
        </section>

        {seasonalRecipes.length > 0 && (
          <section className={styles.recipesSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Seasonal recipes</h2>
              <Link href="/recipes" className={styles.seeAll}>All recipes →</Link>
            </div>
            <div className={styles.recipesGrid}>
              {seasonalRecipes.map(r => <RecipeCard key={r.id} recipe={r} />)}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
