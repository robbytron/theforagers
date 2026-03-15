import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Nav from '@/components/ui/Nav';
import SpeciesCard from '@/components/species/SpeciesCard';
import RecipeCard from '@/components/recipes/RecipeCard';
import { getAllSpecies, getAllRecipes } from '@/lib/airtable';
import type { Month } from '@/types';
import styles from './page.module.css';

export const revalidate = 3600;

const MONTHS: Month[] = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const MONTH_DATA: Record<Month, { season: string; intro: string; highlights: string[]; seoTitle: string; seoDescription: string }> = {
  January: {
    season: 'Deep Winter',
    intro: 'January strips things back. The woodland floor is bare, the hedgerows emptied. The coast opens up, and the winter fungi are fruiting on dead wood and fallen branches across the country. This is a month for knowing where to look rather than having many places to look.',
    highlights: [
      'Velvet Shank fruits through frost and snow on dead elm and beech. One of the few fungi that genuinely prefers cold',
      'Oyster Mushroom flushes on dead beech in wet, mild spells. Check fallen logs after rain',
      'Mussels, winkles, and cockles are in peak condition. Cold water keeps them firm and clean',
      'Jelly Ear is findable year-round on elder but prominent now the leaves are down',
      'Scarlet Elf Cup begins appearing in late January on rotting wood in damp woodland',
      'Seaweeds — laver, carrageen, bladderwrack, kelp — are available all year and often at their cleanest in winter',
    ],
    seoTitle: 'What to Forage in January | The Foragers',
    seoDescription: 'January foraging in the UK: velvet shank, oyster mushroom, coastal shellfish and winter seaweeds. What\'s out there and where to find it.',
  },
  February: {
    season: 'Late Winter',
    intro: 'February is the month of false starts. A warm week mid-month can bring the first wild garlic shoots and the earliest violets, then cold snaps everything shut again. The coast is your most productive ground this month. Alexanders is already thick on clifftops and south-facing banks, and there is more happening out there than February gets credit for.',
    highlights: [
      'Alexanders is thick and ready on coastal banks and hedgerows. The earliest substantial wild vegetable of the year',
      'Scarlet Elf Cup peaks through February on rotting wood in wet woodland',
      'Cleavers shoots are young and at their most edible now, before they become too sticky and stringy',
      'Sweet Violet is flowering. The flowers are good raw in salads and hold their colour well',
      'Three-cornered Leek is already up and edible in the south and west',
      'Oyster Mushroom and Velvet Shank continue through mild spells',
    ],
    seoTitle: 'What to Forage in February | The Foragers',
    seoDescription: 'February foraging UK: Alexanders, Scarlet Elf Cup, Miner\'s Lettuce and the first coastal greens. What\'s worth finding before spring arrives.',
  },
  March: {
    season: 'Early Spring',
    intro: 'March announces itself before you arrive. Walk into the right woodland on a warm morning and the smell of wild garlic hits you 20 metres before you see the plants. This is the first month of genuine abundance. The month that turns people who have been meaning to start for years into people who are actually out there.',
    highlights: [
      'Wild Garlic peaks through March in damp deciduous woodland. Pick leaves before flowering for the best flavour',
      'Young nettles are best this month, before they toughen. Pick the top four leaves from plants under 20cm',
      'Hawthorn buds are opening on sheltered south-facing hedgerows and good eaten straight from the branch',
      'Wood Sorrel carpets damp woodland floors alongside wild garlic. Tart, bright, and good raw',
      'Ground Elder, Sweet Cicely, and Hogweed are all shooting. Identifiable and edible while young',
      'Morel is in season from late March. Find your spots, read the species page',
    ],
    seoTitle: 'What to Forage in March | The Foragers',
    seoDescription: 'March foraging UK: wild garlic, young nettles, wood sorrel and hawthorn buds. The foraging year starts properly. What to find and when.',
  },
  April: {
    season: 'Spring',
    intro: 'April is when the hedgerows catch up with the woodland. Wild garlic is still going, the hedgerow mustards and sorrels are at their peak, and the blossom season begins properly. The light is better. The ground is warm enough to kneel on. This is the month most people discover they have been walking past food for years.',
    highlights: [
      'Hawthorn blossom opens from mid-month. Petals and young leaves are both edible and worth picking',
      'Wild garlic is flowering. The flowers are edible and worth using before the plant collapses in May',
      'Sorrel is at its most tender this month. Sharp, bright, and excellent raw or cooked',
      'Sea Kale is shooting on shingle beaches in the south. A coastal vegetable of genuine quality',
      'Sweet Woodruff and Lady\'s Smock are both flowering. Sweet Woodruff is particularly good for cold infusions',
      'St George\'s Mushroom is in season on chalky grassland from late April',
    ],
    seoTitle: 'What to Forage in April | The Foragers',
    seoDescription: 'April foraging UK: hawthorn blossom, sorrel, sea kale and wild garlic flowers. Full spring in the hedgerows. What to find and how.',
  },
  May: {
    season: 'Late Spring',
    intro: 'May is two months at once. The spring greens are still good in the first two weeks, then the elderflower opening in the second week changes everything. From that point you are split between finishing what spring started and chasing what summer has just begun. There is almost too much to do in May, which is the right kind of problem.',
    highlights: [
      'Elderflower opens from mid-May in the south. Pick first thing in the morning on a dry day, fully open but before the tiny florets start to drop',
      'Chicken of the Woods fruits on oak and sweet chestnut. Young growth at the outer edge only',
      'Wild garlic leaves are finishing but the green seed heads forming now are excellent pickled',
      'Marsh Samphire is beginning to shoot in estuaries. Small and tender, the very start of its season',
      'Bistort is up in northern meadows. Worth finding if you are in the Pennines',
      'Crow Garlic, Sow Thistle, and Brooklime are all in season and worth knowing',
    ],
    seoTitle: 'What to Forage in May | The Foragers',
    seoDescription: 'May foraging UK: elderflower, Chicken of the Woods, wild garlic seed heads and the last spring greens. What to pick before spring turns to summer.',
  },
  June: {
    season: 'Early Summer',
    intro: 'June rewards those who know where to go. The spring rush is over and the autumn abundance is some way off. What June offers is precise: a specific run of flowers and coastal plants with short windows, unmissable if you know about them and easy to miss if you do not. The coast in June is worth a dedicated trip.',
    highlights: [
      'Marsh Samphire is shooting in English estuaries and at its most tender now. The finest wild vegetable the calendar offers',
      'Dog Rose petals are open on every hedgerow. Pick in the morning for cold-infused cordial or vinegar',
      'Meadowsweet is flowering in damp meadows and along riverbanks. Cold-infuse the heads in cream overnight',
      'Lime Blossom from Common and Small-leaved Lime makes the finest flower tea in Britain',
      'Elderflower is finishing in the south. Last call. Still going in the north through June',
      'Fat Hen and Good King Henry are up on disturbed ground. Straightforward cooked greens',
    ],
    seoTitle: 'What to Forage in June | The Foragers',
    seoDescription: 'June foraging UK: marsh samphire, meadowsweet, dog rose and the last elderflower. The coastal and flower month. What to pick and when.',
  },
  July: {
    season: 'High Summer',
    intro: 'July is when two threads of the foraging year first run together: summer fruit and the start of the fungi season. Bilberry and raspberry are ready on moorland and in clearings. Chanterelle is fruiting in damp mossy woodland after rain. Go out early in July and go out after rain.',
    highlights: [
      'Chanterelle peaks through July and August in damp mossy broadleaf woodland. Find them under beech and oak after rain',
      'Bilberry is ripening on moorland and heathland. Small, intensely flavoured, and worth picking in quantity',
      'Wild Cherry is ready in July in most years. A brief window. The birds move fast',
      'Bay Bolete is fruiting under pine, larch, and spruce. A reliable and genuinely good summer find',
      'Marsh Samphire is at its full best this month. The peak of the coastal green season',
      'Raspberry is in woodland clearings and scrub from July. Wilder and less sweet than the garden variety',
    ],
    seoTitle: 'What to Forage in July | The Foragers',
    seoDescription: 'July foraging UK: chanterelle, bilberry, bay bolete and marsh samphire at its best. Summer fungi and fruit. What to find and where.',
  },
  August: {
    season: 'Late Summer',
    intro: 'August is when autumn arrives in the fungi before it arrives anywhere else. The Cep is up under pine and spruce. Blackberries are ripening on every hedgerow. Elderberries are nearly there. Everything is happening at once and the month rewards going out often rather than saving it for one long day.',
    highlights: [
      'Cep is fruiting under pine, spruce, and beech from early August in a good year. Rain followed by warmth is the moment',
      'Blackberries ripen from early August in the south. The best fruit is in full sun on south-facing hedgerows',
      'Elderberry clusters are darkening through August and will be fully ready by month\'s end',
      'Chanterelle continues strongly through August. Often the best month for it',
      'Hedgehog Mushroom begins appearing in woodland from late August',
      'Giant Puffball appears in old pasture and meadow edges',
    ],
    seoTitle: 'What to Forage in August | The Foragers',
    seoDescription: 'August foraging UK: cep, blackberry, elderberry and the peak of the chanterelle season. Summer and autumn overlapping. What\'s at its best right now.',
  },
  September: {
    season: 'Early Autumn',
    intro: 'September is the month. No other month comes close for sheer variety and quality. The woodland floor is alive with fungi. Hedgerows are loaded with sloe, rosehip, and the last blackberries. The nut season begins. If you go out once in the foraging year, September is when to go.',
    highlights: [
      'Cep peaks through September in broadleaf and mixed woodland. A week of rain followed by warm days is the trigger',
      'Hedgehog Mushroom starts fruiting from September. A beginner-friendly edible with no dangerous lookalikes in Britain',
      'Hazelnut drops from the shells in late September. Get there before the squirrels',
      'Sweet Chestnut falls in southern England from mid-September. A proper food, not a novelty',
      'Rosehip is at full colour and full flavour on every hedgerow',
      'The coastal shellfish season restarts properly from September',
    ],
    seoTitle: 'What to Forage in September | The Foragers',
    seoDescription: 'September foraging UK: cep, hedgehog mushroom, hazelnut, sloe and sweet chestnut. The richest month in the British foraging calendar.',
  },
  October: {
    season: 'Autumn',
    intro: 'October is the month of transitions. The summer boletes are on their way out. The winter fungi — Oyster Mushroom, Velvet Shank, Winter Chanterelle — are arriving. Sloe after the first frost is a ritual for a reason. The woodland floor smells of decay in the best possible sense: fungi, wet leaves, turned earth. Go out in the mornings.',
    highlights: [
      'Wood Blewit is at its best in October in deciduous woodland and compost-rich gardens. The blue-lilac colouring is distinctive',
      'Hedgehog Mushroom peaks through October. Large, clean, and straightforward to identify',
      'Sweet Chestnut is still falling and often better now than in September',
      'Sloe is at its best after the first frost, which softens the skins and reduces bitterness',
      'Oyster Mushroom arrives on dead beech logs and stumps in the second half of the month',
      'Winter Chanterelle is appearing in mossy conifer woodland from October onward',
    ],
    seoTitle: 'What to Forage in October | The Foragers',
    seoDescription: 'October foraging UK: wood blewit, hedgehog mushroom, sloe after first frost and sweet chestnut. Deep autumn in the British countryside.',
  },
  November: {
    season: 'Late Autumn',
    intro: 'November looks like the end of the foraging year. It is not. Most people stop going out this month, which means quieter woodland and less competition for those who do not. The winter fungi are at their best. The coast is fully productive. There are fewer species than October, but the ones that are here are genuinely worth going out for.',
    highlights: [
      'Velvet Shank is fully into its season on dead wood and will continue through to March',
      'Winter Chanterelle peaks in November in mossy wet conifer woodland. Underrated and worth finding',
      'Oyster Mushroom continues on beech deadwood and stumps. Cold weather suits it',
      'Coastal shellfish — mussel, winkle, cockle — are in prime condition. Cold, clean winter water',
      'Rosehip holds well on the branches into November in cold, dry conditions',
      'Burdock root can be dug now from first-year plants. A substantial wild root vegetable',
    ],
    seoTitle: 'What to Forage in November | The Foragers',
    seoDescription: 'November foraging UK: velvet shank, winter chanterelle, oyster mushroom and coastal shellfish. The winter fungi season begins properly.',
  },
  December: {
    season: 'Early Winter',
    intro: 'December is a coastal month. Inland, the options narrow to what grows on dead wood and what persists in the ground. The coast gives you the best shellfish of the year and seaweeds available on every low tide. If you have been putting off coastal foraging all year, stop putting it off.',
    highlights: [
      'Mussels, winkles, and cockles are in peak condition. Cold, clean water and none of the water quality concerns of summer',
      'Oyster Mushroom flushes on beech deadwood and stumps after mild, wet spells',
      'Velvet Shank continues and will do so through January and February. Find it on elm, beech, and ash',
      'Wood Blewit is still going in mild conditions through the first half of the month',
      'Burdock root is worth digging from first-year plants. Starchy, earthy, and genuinely filling',
      'Seaweeds — laver, carrageen, bladderwrack, kelp — are available and at their cleanest',
    ],
    seoTitle: 'What to Forage in December | The Foragers',
    seoDescription: 'December foraging UK: oyster mushroom, velvet shank, coastal shellfish and laver. The coastal month. What\'s worth going out for in winter.',
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
  const data = MONTH_DATA[monthName];
  return {
    title: data.seoTitle,
    description: data.seoDescription,
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
      <div className={styles.heroImage}>
        <Image
          src={`/calendar/${monthName.toLowerCase()}.png`}
          alt={monthName}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover' }}
        />
      </div>

      <div className={styles.monthNav}>
        <Link href={`/calendar/${getPrevMonth(monthName).toLowerCase()}`} className={styles.navArrow}>
          ← {getPrevMonth(monthName)}
        </Link>
        <Link href="/calendar" className={styles.navAll}>All months</Link>
        <Link href={`/calendar/${getNextMonth(monthName).toLowerCase()}`} className={styles.navArrow}>
          {getNextMonth(monthName)} →
        </Link>
      </div>

      <div className={styles.layout}>
        <header className={styles.header}>
          <p className={styles.headerLabel}>{data.season}</p>
          <h1 className={styles.headerTitle}>{monthName}</h1>
          {isCurrentMonth && <span className={styles.nowBadge}>You are here</span>}
        </header>

        <section className={styles.introSection}>
          <p className={styles.intro}>{data.intro}</p>
          <div className={styles.tipsBox}>
            <h3 className={styles.tipsHead}>Highlights at a glance</h3>
            <ul className={styles.tipsList}>
              {data.highlights.map((tip, i) => (
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
