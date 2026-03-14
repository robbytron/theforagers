/**
 * Setup Recipes table with additional fields and seed 20 recipes
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_PAT = process.env.AIRTABLE_PAT;
const AIRTABLE_API = 'https://api.airtable.com/v0';
const AIRTABLE_META_API = 'https://api.airtable.com/v0/meta/bases';

async function getTableId(tableName: string): Promise<string> {
  const res = await fetch(`${AIRTABLE_META_API}/${AIRTABLE_BASE_ID}/tables`, {
    headers: { Authorization: `Bearer ${AIRTABLE_PAT}` },
  });
  const data = await res.json();
  const table = data.tables.find((t: any) => t.name === tableName);
  if (!table) throw new Error(`${tableName} table not found`);
  return table.id;
}

async function addField(tableId: string, field: { name: string; type: string; options?: any }) {
  const res = await fetch(`${AIRTABLE_META_API}/${AIRTABLE_BASE_ID}/tables/${tableId}/fields`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${AIRTABLE_PAT}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(field),
  });

  if (!res.ok) {
    const error = await res.text();
    if (error.includes('DUPLICATE') || error.includes('duplicate')) {
      console.log(`  Field "${field.name}" already exists`);
      return;
    }
    throw new Error(`Failed to add field ${field.name}: ${error}`);
  }
  console.log(`  Added field: ${field.name}`);
}

async function createRecords(records: any[]): Promise<void> {
  const batches = [];
  for (let i = 0; i < records.length; i += 10) {
    batches.push(records.slice(i, i + 10));
  }

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(`Creating batch ${i + 1}/${batches.length}...`);

    const res = await fetch(`${AIRTABLE_API}/${AIRTABLE_BASE_ID}/Recipes`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AIRTABLE_PAT}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ records: batch }),
    });

    if (!res.ok) {
      throw new Error(`Failed to create records: ${await res.text()}`);
    }
    await new Promise(resolve => setTimeout(resolve, 250));
  }
}

const SEED_RECIPES = [
  {
    name: 'Wild Garlic Pesto',
    slug: 'wild-garlic-pesto',
    description: 'A vibrant spring pesto using foraged wild garlic leaves.',
    difficulty: 'Easy',
    prepTime: '10 mins',
    cookTime: '0 mins',
    servings: '4',
    ingredients: `100g wild garlic leaves, washed
50g pine nuts or walnuts
50g Parmesan, grated
150ml olive oil
Juice of half a lemon
Salt and pepper to taste`,
    method: `1. Roughly chop the wild garlic leaves.
2. Toast the nuts in a dry pan until lightly golden.
3. Add wild garlic, nuts, and Parmesan to a food processor.
4. Pulse while drizzling in olive oil until you reach desired consistency.
5. Add lemon juice, salt and pepper to taste.
6. Store in a jar topped with olive oil for up to 2 weeks in the fridge.`,
  },
  {
    name: 'Nettle Soup',
    slug: 'nettle-soup',
    description: 'A nourishing green soup from young nettle tops.',
    difficulty: 'Easy',
    prepTime: '15 mins',
    cookTime: '25 mins',
    servings: '4',
    ingredients: `200g young nettle tops (use gloves!)
1 onion, diced
2 potatoes, cubed
1 litre vegetable stock
2 tbsp butter
100ml cream (optional)
Salt and pepper`,
    method: `1. Wearing gloves, wash nettles thoroughly.
2. Sauté onion in butter until soft.
3. Add potatoes and stock, simmer for 15 minutes.
4. Add nettles and cook for 5 more minutes.
5. Blend until smooth, stir in cream if using.
6. Season to taste and serve with crusty bread.`,
  },
  {
    name: 'Elderflower Cordial',
    slug: 'elderflower-cordial',
    description: 'A classic British summer drink with floral notes.',
    difficulty: 'Easy',
    prepTime: '30 mins',
    cookTime: '5 mins',
    servings: '20',
    ingredients: `20 elderflower heads
1.5kg sugar
1.5 litres boiling water
2 lemons, sliced
50g citric acid`,
    method: `1. Shake elderflower heads to remove insects (don't wash).
2. Dissolve sugar in boiling water.
3. Add elderflowers, lemon slices, and citric acid.
4. Cover and leave for 24-48 hours, stirring occasionally.
5. Strain through muslin into sterilised bottles.
6. Dilute 1:4 with still or sparkling water to serve.`,
  },
  {
    name: 'Blackberry Crumble',
    slug: 'blackberry-crumble',
    description: 'An autumn classic using hedgerow blackberries.',
    difficulty: 'Easy',
    prepTime: '15 mins',
    cookTime: '35 mins',
    servings: '6',
    ingredients: `500g blackberries
100g caster sugar
200g plain flour
100g cold butter, cubed
75g demerara sugar
Pinch of cinnamon`,
    method: `1. Preheat oven to 180°C.
2. Toss blackberries with caster sugar and place in baking dish.
3. Rub flour and butter together until breadcrumb texture.
4. Stir in demerara sugar and cinnamon.
5. Scatter crumble over fruit.
6. Bake for 35 minutes until golden and bubbling.
7. Serve with custard or cream.`,
  },
  {
    name: 'Sloe Gin',
    slug: 'sloe-gin',
    description: 'A warming winter liqueur from autumn sloes.',
    difficulty: 'Easy',
    prepTime: '20 mins',
    cookTime: '0 mins',
    servings: '1 bottle',
    ingredients: `450g sloes (pricked or frozen)
225g caster sugar
750ml gin`,
    method: `1. Prick each sloe with a fork (or freeze overnight to split skins).
2. Place sloes in a large jar or bottle.
3. Add sugar and gin.
4. Seal and shake well.
5. Store in a cool, dark place for at least 3 months.
6. Shake weekly for the first month.
7. Strain and rebottle when ready.`,
  },
  {
    name: 'Chanterelle on Toast',
    slug: 'chanterelle-on-toast',
    description: 'Simple buttery mushrooms on sourdough.',
    difficulty: 'Easy',
    prepTime: '5 mins',
    cookTime: '10 mins',
    servings: '2',
    ingredients: `200g chanterelles, cleaned
50g butter
2 cloves garlic, minced
2 slices sourdough bread
Fresh thyme
Salt and pepper
Parsley to garnish`,
    method: `1. Tear large chanterelles into pieces.
2. Melt butter in a pan over medium heat.
3. Add chanterelles and cook for 5 minutes.
4. Add garlic and thyme, cook 2 more minutes.
5. Toast the sourdough.
6. Season mushrooms and pile onto toast.
7. Garnish with parsley and serve immediately.`,
  },
  {
    name: 'Wood Sorrel Salad',
    slug: 'wood-sorrel-salad',
    description: 'A refreshing lemony salad with foraged greens.',
    difficulty: 'Easy',
    prepTime: '10 mins',
    cookTime: '0 mins',
    servings: '2',
    ingredients: `Large handful wood sorrel leaves
Mixed salad leaves
1 avocado, sliced
Cherry tomatoes, halved
2 tbsp olive oil
1 tbsp white wine vinegar
Salt and pepper`,
    method: `1. Wash wood sorrel gently and pat dry.
2. Arrange salad leaves on plates.
3. Top with avocado and tomatoes.
4. Scatter wood sorrel over the top.
5. Whisk oil and vinegar with seasoning.
6. Drizzle dressing over salad just before serving.`,
  },
  {
    name: 'Hawthorn Berry Ketchup',
    slug: 'hawthorn-berry-ketchup',
    description: 'A tangy condiment from autumn hedgerows.',
    difficulty: 'Medium',
    prepTime: '20 mins',
    cookTime: '45 mins',
    servings: '2 jars',
    ingredients: `500g hawthorn berries
250ml cider vinegar
150g brown sugar
1 onion, chopped
1 tsp mixed spice
1 tsp salt`,
    method: `1. Simmer berries in water until soft (20 mins).
2. Push through a sieve to remove stones.
3. Add pulp to pan with remaining ingredients.
4. Simmer for 25 minutes until thickened.
5. Pour into sterilised jars.
6. Keeps for 6 months unopened.`,
  },
  {
    name: 'Pignut Crisps',
    slug: 'pignut-crisps',
    description: 'Crispy fried slices of this nutty wild root.',
    difficulty: 'Medium',
    prepTime: '15 mins',
    cookTime: '10 mins',
    servings: '2',
    ingredients: `100g pignuts, cleaned
Vegetable oil for frying
Sea salt
Fresh rosemary (optional)`,
    method: `1. Scrub pignuts clean and slice very thinly.
2. Soak in cold water for 10 minutes, then pat dry.
3. Heat oil to 180°C.
4. Fry slices in batches until golden (2-3 mins).
5. Drain on kitchen paper.
6. Season immediately with salt and rosemary.`,
  },
  {
    name: 'Sea Purslane Tempura',
    slug: 'sea-purslane-tempura',
    description: 'Light, crispy coastal greens.',
    difficulty: 'Medium',
    prepTime: '10 mins',
    cookTime: '10 mins',
    servings: '4',
    ingredients: `200g sea purslane
100g plain flour
100ml ice-cold sparkling water
Vegetable oil for frying
Soy sauce for dipping`,
    method: `1. Wash sea purslane and pat completely dry.
2. Whisk flour and sparkling water briefly (lumps are fine).
3. Heat oil to 180°C.
4. Dip purslane in batter and fry for 2 minutes.
5. Drain on kitchen paper.
6. Serve immediately with soy sauce.`,
  },
  {
    name: 'Wild Garlic Butter',
    slug: 'wild-garlic-butter',
    description: 'A versatile compound butter for spring cooking.',
    difficulty: 'Easy',
    prepTime: '10 mins',
    cookTime: '0 mins',
    servings: '8',
    ingredients: `250g salted butter, softened
50g wild garlic leaves
Zest of 1 lemon
Black pepper`,
    method: `1. Finely chop wild garlic leaves.
2. Beat butter until soft and fluffy.
3. Mix in wild garlic, lemon zest, and pepper.
4. Roll into a log using cling film.
5. Refrigerate until firm.
6. Slice and use on steak, fish, or vegetables.`,
  },
  {
    name: 'Rosehip Syrup',
    slug: 'rosehip-syrup',
    description: 'Vitamin C-rich syrup from autumn rosehips.',
    difficulty: 'Medium',
    prepTime: '30 mins',
    cookTime: '30 mins',
    servings: '2 bottles',
    ingredients: `1kg rosehips
500g sugar
1.5 litres water`,
    method: `1. Roughly chop rosehips in a food processor.
2. Add to 1 litre boiling water, return to boil.
3. Remove from heat and steep 15 minutes.
4. Strain through muslin twice to remove hairs.
5. Simmer liquid with sugar until syrupy.
6. Pour into sterilised bottles.
7. Use within 4 months, refrigerate after opening.`,
  },
  {
    name: 'Dandelion Salad',
    slug: 'dandelion-salad',
    description: 'A bitter spring salad with warm bacon dressing.',
    difficulty: 'Easy',
    prepTime: '15 mins',
    cookTime: '10 mins',
    servings: '2',
    ingredients: `Large handful young dandelion leaves
100g bacon lardons
2 tbsp red wine vinegar
1 tbsp olive oil
1 shallot, finely sliced
Poached egg (optional)`,
    method: `1. Wash dandelion leaves and place in bowl.
2. Fry bacon until crispy, remove from pan.
3. Add shallot to bacon fat, cook until soft.
4. Add vinegar and oil, warm through.
5. Pour warm dressing over leaves.
6. Top with bacon and poached egg if using.`,
  },
  {
    name: 'Elderberry Syrup',
    slug: 'elderberry-syrup',
    description: 'An immune-boosting syrup for autumn and winter.',
    difficulty: 'Easy',
    prepTime: '15 mins',
    cookTime: '45 mins',
    servings: '1 bottle',
    ingredients: `500g elderberries
250g honey
500ml water
1 cinnamon stick
4 cloves
1 inch fresh ginger`,
    method: `1. Strip berries from stems using a fork.
2. Add berries, water, and spices to a pan.
3. Simmer for 45 minutes until reduced by half.
4. Strain and press through a sieve.
5. Cool slightly, then stir in honey.
6. Bottle and refrigerate.
7. Take 1 tbsp daily during cold season.`,
  },
  {
    name: 'Hazelnut Praline',
    slug: 'hazelnut-praline',
    description: 'Crunchy caramelised wild hazelnuts.',
    difficulty: 'Medium',
    prepTime: '5 mins',
    cookTime: '15 mins',
    servings: '10',
    ingredients: `200g hazelnuts
200g caster sugar
50ml water`,
    method: `1. Toast hazelnuts in a dry pan until golden.
2. Dissolve sugar in water over low heat.
3. Increase heat and cook until amber caramel.
4. Quickly stir in hazelnuts.
5. Pour onto greased baking tray.
6. Cool completely, then break into shards.
7. Crush for ice cream topping or eat as is.`,
  },
  {
    name: 'Samphire with Lemon Butter',
    slug: 'samphire-lemon-butter',
    description: 'Simple coastal greens with citrus butter.',
    difficulty: 'Easy',
    prepTime: '5 mins',
    cookTime: '5 mins',
    servings: '4',
    ingredients: `300g samphire
50g butter
Juice of 1 lemon
Black pepper
No salt needed - samphire is naturally salty`,
    method: `1. Wash samphire and trim woody ends.
2. Blanch in boiling water for 2 minutes.
3. Drain well.
4. Melt butter in pan, add lemon juice.
5. Toss samphire in lemon butter.
6. Season with pepper only.
7. Serve immediately as a side dish.`,
  },
  {
    name: 'Wild Mushroom Risotto',
    slug: 'wild-mushroom-risotto',
    description: 'Creamy risotto with mixed foraged mushrooms.',
    difficulty: 'Medium',
    prepTime: '15 mins',
    cookTime: '30 mins',
    servings: '4',
    ingredients: `300g mixed wild mushrooms
300g arborio rice
1 litre hot vegetable stock
1 onion, finely diced
2 cloves garlic
150ml white wine
50g butter
50g Parmesan, grated
Fresh thyme`,
    method: `1. Sauté mushrooms in butter, set aside.
2. Cook onion until soft, add garlic.
3. Add rice, stir to coat in butter.
4. Add wine, stir until absorbed.
5. Add stock a ladle at a time, stirring constantly.
6. After 18 minutes, stir in mushrooms.
7. Finish with butter, Parmesan, and thyme.`,
  },
  {
    name: 'Blackberry Vinegar',
    slug: 'blackberry-vinegar',
    description: 'A fruity vinegar for dressings and marinades.',
    difficulty: 'Easy',
    prepTime: '10 mins',
    cookTime: '0 mins',
    servings: '1 bottle',
    ingredients: `500g blackberries
500ml white wine vinegar
100g sugar (optional)`,
    method: `1. Place blackberries in a large jar.
2. Pour over vinegar and seal.
3. Leave in a cool, dark place for 2 weeks.
4. Shake daily.
5. Strain through muslin.
6. Add sugar if desired, warming to dissolve.
7. Bottle and use within 1 year.`,
  },
  {
    name: 'Chickweed Pesto',
    slug: 'chickweed-pesto',
    description: 'A mild, nutritious pesto from common chickweed.',
    difficulty: 'Easy',
    prepTime: '10 mins',
    cookTime: '0 mins',
    servings: '4',
    ingredients: `100g chickweed
50g sunflower seeds
30g Parmesan
1 clove garlic
100ml olive oil
Lemon juice to taste`,
    method: `1. Wash chickweed thoroughly.
2. Toast sunflower seeds lightly.
3. Blend all ingredients except oil.
4. Drizzle in oil while blending.
5. Season with lemon juice and salt.
6. Use on pasta, toast, or as a dip.`,
  },
  {
    name: 'Sweet Chestnut Stuffing',
    slug: 'sweet-chestnut-stuffing',
    description: 'A rich stuffing for roast dinners.',
    difficulty: 'Medium',
    prepTime: '30 mins',
    cookTime: '30 mins',
    servings: '8',
    ingredients: `300g sweet chestnuts, peeled
200g sausage meat
1 onion, finely diced
100g breadcrumbs
Fresh sage and thyme
1 egg
Salt and pepper`,
    method: `1. Score and roast chestnuts until shells split.
2. Peel and roughly chop.
3. Sauté onion until soft.
4. Mix all ingredients in a bowl.
5. Press into a greased baking dish.
6. Bake at 180°C for 30 minutes.
7. Serve with roast poultry.`,
  },
];

async function main() {
  console.log('Setting up Recipes table...\n');

  const tableId = await getTableId('Recipes');
  console.log('Adding missing fields:');

  await addField(tableId, { name: 'Slug', type: 'singleLineText' });
  await addField(tableId, { name: 'Short Description', type: 'singleLineText' });
  await addField(tableId, { name: 'Prep Time', type: 'singleLineText' });
  await addField(tableId, { name: 'Cook Time', type: 'singleLineText' });
  await addField(tableId, { name: 'Servings', type: 'singleLineText' });

  console.log('\nSeeding 20 recipes...');

  const records = SEED_RECIPES.map(r => ({
    fields: {
      'Recipe Name': r.name,
      'Slug': r.slug,
      'Short Description': r.description,
      'Difficulty': r.difficulty,
      'Prep Time': r.prepTime,
      'Cook Time': r.cookTime,
      'Servings': r.servings,
      'Ingredients': r.ingredients,
      'Method': r.method,
      'Status': 'Live',
    },
  }));

  await createRecords(records);
  console.log('\n✅ Done! 20 recipes seeded.');
}

main().catch(console.error);
