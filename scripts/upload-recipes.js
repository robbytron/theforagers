const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
for (const line of envContent.split('\n')) {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
}

const BASE_ID = envVars.AIRTABLE_BASE_ID;
const PAT = envVars.AIRTABLE_PAT;
const AIRTABLE_API = 'https://api.airtable.com/v0';

const recipes = [
  {
    name: 'Wild Garlic Pesto',
    slug: 'wild-garlic-pesto',
    category: 'Savoury',
    season: 'March, April, May',
    difficulty: 'Easy',
    prepTime: '10 mins',
    cookTime: '5 mins',
    servings: '4',
    species: 'Wild Garlic',
    shortDescription: 'Wild garlic pesto is the easiest thing to make with a spring haul. Brighter and more pungent than basil pesto, it takes ten minutes and freezes well in ice cube trays for cooking through the rest of the year.',
    intro: 'Wild garlic appears in March and is gone by May. For those two months it is everywhere in damp woodland, and pesto is the best way to use a glut. The flavour is sharper and more herbal than basil, with a green heat that mellows when stirred into pasta. Make it in batches and freeze it. Come November, a cube melting into a pan of pasta tastes like spring.',
    ingredients: `100g wild garlic leaves, washed
50g pine nuts or walnuts
50g Parmesan, finely grated
150ml olive oil
Juice of half a lemon
Salt and pepper to taste`,
    method: `1. Toast the nuts in a dry pan over medium heat until lightly golden. Watch them — they catch quickly.
2. Roughly chop the wild garlic leaves.
3. Add the leaves, nuts, and Parmesan to a food processor.
4. Pulse while drizzling in the olive oil until the texture is to your liking.
5. Add lemon juice, season with salt and pepper, and pulse once more.
6. Taste and adjust — wild garlic varies in intensity, so the balance may shift batch to batch.`,
    notes: `Storage: Keeps for 2 weeks in the fridge in a sealed jar, topped with a thin layer of olive oil. Freezes well in ice cube trays.
Variations: Walnuts give a slightly more bitter, earthy result than pine nuts. Hard goat's cheese works in place of Parmesan.
No food processor: Use a pestle and mortar. Coarser texture, better flavour.`,
    seoTitle: 'Wild Garlic Pesto Recipe | The Foragers',
    seoDescription: 'Wild garlic pesto from freshly picked spring leaves. Takes ten minutes, freezes perfectly. The best thing to do with a spring glut. Ready in March.',
  },
  {
    name: 'Wild Garlic Butter',
    slug: 'wild-garlic-butter',
    category: 'Savoury',
    season: 'March, April, May',
    difficulty: 'Easy',
    prepTime: '10 mins',
    cookTime: '0 mins',
    servings: '8',
    species: 'Wild Garlic',
    shortDescription: 'A compound butter made with fresh wild garlic leaves, lemon zest, and black pepper. Keeps in the fridge for a week or freezes as a log. Good on steak, fish, jacket potatoes, or stirred through pasta.',
    intro: 'Compound butter is the most useful thing you can make with a handful of wild garlic. It takes ten minutes and has a dozen applications — melting over a steak, dissolving into a pan sauce, stuffed under the skin of a chicken. The garlic flavour is bright and direct when fresh, and mellows to something richer after a day or two in the fridge. Make a log, slice off discs as needed.',
    ingredients: `250g unsalted butter, at room temperature
75g wild garlic leaves, washed and thoroughly dried
Zest of 1 unwaxed lemon
Black pepper to taste`,
    method: `1. Dry the wild garlic leaves thoroughly after washing. Wet leaves will make the butter split.
2. Chop the leaves as finely as you can.
3. Beat the butter with a wooden spoon or electric mixer until soft and pale.
4. Fold in the wild garlic, lemon zest, and a few grinds of black pepper.
5. Taste. Wild garlic varies in strength — add more leaves or more pepper as needed.
6. Tip onto a sheet of baking paper and roll into a log roughly 4cm in diameter.
7. Twist the ends closed and refrigerate until firm.`,
    notes: `Storage: Keeps in the fridge for up to 1 week. Freezes for up to 3 months — slice into discs before freezing.
Uses: On steak or fish, stirred through pasta, on jacket potatoes, under the skin of a chicken before roasting.
Salt: Unsalted butter gives you control. If using salted butter, taste before adding more.`,
    seoTitle: 'Wild Garlic Butter Recipe | The Foragers',
    seoDescription: 'Compound butter with fresh wild garlic, lemon, and black pepper. Ten minutes to make. Keeps a week in the fridge or freezes as a log. Ready in March.',
  },
  {
    name: 'Wild Garlic Soup',
    slug: 'wild-garlic-soup',
    category: 'Savoury',
    season: 'March, April, May',
    difficulty: 'Easy',
    prepTime: '10 mins',
    cookTime: '25 mins',
    servings: '4',
    species: 'Wild Garlic',
    shortDescription: 'A vivid spring green soup made with wild garlic leaves, potato, and stock. Ready in under 30 minutes. The colour is striking; the flavour sits somewhere between leek soup and garlic soup, without the heaviness of either.',
    intro: 'Wild garlic soup is spring in a bowl. The leaves give it a colour that nothing else achieves — a deep, clear green that holds even after blending, provided you do not overcook it. The flavour is garlicky but not aggressive; the potato gives it body without weight. Pick the leaves young, before the flowers appear, when the flavour is at its brightest.',
    ingredients: `200g wild garlic leaves, washed
2 medium potatoes (about 350g), peeled and cubed
1 medium onion, roughly chopped
2 cloves garlic, sliced
1 litre vegetable or chicken stock
30g butter
Salt and pepper to taste`,
    method: `1. Melt the butter in a large saucepan over medium heat.
2. Add the onion and garlic, cook for 8 minutes until soft but not coloured.
3. Add the potatoes and stock. Bring to a boil, then reduce to a simmer.
4. Cook for 15 minutes until the potatoes are completely tender.
5. Add the wild garlic leaves and cook for exactly 2 minutes. No longer — the colour dulls fast.
6. Blend until smooth. Season with salt and pepper.
7. Serve immediately. The colour fades if it sits.`,
    notes: `Cream: A swirl of cream at the table is good but optional. The soup has enough body without it.
Colour: Overcooking the wild garlic turns it khaki. If reheating, do it gently and quickly.
Flavour: Wild garlic varies in intensity — a squeeze of lemon can lift the whole thing at the end.`,
    seoTitle: 'Wild Garlic Soup Recipe | The Foragers',
    seoDescription: 'Vivid spring green soup with wild garlic leaves, potato, and stock. Under 30 minutes. Pick the leaves before the flowers appear for the best colour and flavour.',
  },
  {
    name: 'Chanterelle on Toast',
    slug: 'chanterelle-on-toast',
    category: 'Savoury',
    season: 'July, August, September, October',
    difficulty: 'Easy',
    prepTime: '5 mins',
    cookTime: '10 mins',
    servings: '2',
    species: 'Chanterelle',
    shortDescription: 'Chanterelles cooked in butter with garlic and thyme, piled onto toasted sourdough. This is the recipe that justifies the hunt. Add complexity and you are wasting the ingredient.',
    intro: 'Chanterelles are the best mushroom available to a forager in Britain. Their flavour is delicate and specific — faintly apricot-scented, slightly peppery, with a texture that holds in the pan. They do not need much. Butter, heat, garlic, thyme, good bread. The whole thing is ready in ten minutes. This is not a recipe that benefits from complexity.',
    ingredients: `300g chanterelles, cleaned
40g butter
2 cloves garlic, finely sliced
4 sprigs fresh thyme
2 thick slices sourdough bread
Salt and pepper
Small handful flat-leaf parsley, roughly chopped`,
    method: `1. Clean the chanterelles with a dry brush or damp cloth. Do not wash under running water.
2. Tear or slice any large chanterelles. Leave small ones whole.
3. Toast the sourdough.
4. Melt the butter in a wide pan over medium-high heat until it begins to foam.
5. Add the chanterelles in a single layer. Leave for 2 minutes without stirring to let them colour.
6. Add the garlic and thyme. Cook for a further 2 minutes, stirring occasionally.
7. Season with salt and pepper. Pile onto the toast.
8. Scatter parsley over and serve immediately.`,
    notes: `Wet mushrooms: If chanterelles are wet from rain, they will steam rather than fry. Pat dry first.
Pan size: Use a wide pan. Crowded mushrooms steam rather than fry.`,
    seoTitle: 'Chanterelle Recipe | The Foragers',
    seoDescription: 'Chanterelles on toast — butter, garlic, thyme, sourdough. The best way to eat foraged chanterelles. Ready in fifteen minutes. Worth every minute finding them.',
  },
  {
    name: 'Chanterelle Risotto',
    slug: 'chanterelle-risotto',
    category: 'Savoury',
    season: 'July, August, September, October',
    difficulty: 'Medium',
    prepTime: '10 mins',
    cookTime: '30 mins',
    servings: '4',
    species: 'Chanterelle',
    shortDescription: 'A chanterelle risotto — creamy, golden from the mushrooms, finished with Parmesan and good butter. The kind of dish worth planning a foraging trip around.',
    intro: 'Chanterelle risotto takes the patience the mushrooms do not require and applies it to the rice instead. The result is a dish that tastes precisely of where the chanterelles came from — woodland, late summer, something slightly wild. Use good stock. Use good Parmesan. Do not rush the stirring. The chanterelles go in at the end, briefly sautéed, so their texture stays.',
    ingredients: `400g chanterelles, cleaned
300g arborio rice
1.2 litres hot chicken or vegetable stock
1 medium onion, finely diced
2 cloves garlic, finely sliced
150ml dry white wine
80g unsalted butter, divided
60g Parmesan, finely grated
Fresh thyme
Salt and pepper
1 tbsp olive oil`,
    method: `1. Sauté the chanterelles in 20g of the butter over high heat for 3 minutes until lightly coloured. Season and set aside.
2. Heat the olive oil with 20g butter in a wide, heavy pan over medium heat.
3. Add the onion and cook for 8 minutes until soft. Add the garlic and thyme and cook for 2 more minutes.
4. Add the rice and stir to coat in the butter. Cook for 2 minutes.
5. Add the wine and stir until absorbed.
6. Add the hot stock a ladleful at a time, stirring frequently and waiting until each addition is absorbed before adding the next.
7. After about 18 minutes, the rice should be just tender with a little bite remaining.
8. Fold in the chanterelles, remaining butter, and Parmesan.
9. Season, cover, and rest for 2 minutes. Serve immediately.`,
    notes: `Stock temperature: Keep the stock hot throughout. Cold stock stalls the cooking and affects the texture.
Wine: A dry white you would drink. Cheap cooking wine adds nothing good.`,
    seoTitle: 'Chanterelle Risotto Recipe | The Foragers',
    seoDescription: 'Chanterelle risotto with good stock, Parmesan, and butter. Mushrooms sautéed separately and folded in at the end. Worth the 20 minutes of stirring.',
  },
  {
    name: 'Laverbread',
    slug: 'laverbread',
    category: 'Savoury',
    season: 'January, February, March, April, May, June, July, August, September, October, November, December',
    difficulty: 'Medium',
    prepTime: '15 mins',
    cookTime: '4 to 5 hours',
    servings: '4',
    species: 'Laver',
    shortDescription: 'Traditional Welsh laverbread from foraged laver seaweed — cooked down to a dark, mineral paste and fried into cakes with oatmeal. One of Britain\'s oldest foraged foods and one of its best breakfasts.',
    intro: 'Laverbread is one of the oldest foraged foods in Wales and one of the most misunderstood. It is not bread. It is laver seaweed — Porphyra umbilicalis — cooked down into a dark paste with a flavour somewhere between the sea and strong spinach. It is eaten for breakfast in South Wales, fried into cakes with oatmeal, or served alongside bacon and cockles. The cooking is slow, but the process is simple.',
    ingredients: `500g fresh laver seaweed, washed
Fine oatmeal for coating (about 100g)
Butter or bacon fat for frying
Salt`,
    method: `1. Wash the laver thoroughly in several changes of cold water to remove all grit and sand.
2. Place in a large saucepan with no added water. Cover and cook over low heat for at least 4 hours, stirring occasionally, until it forms a dark, smooth paste.
3. Alternatively, cook in a slow cooker on low overnight.
4. Season with salt. The paste should be intensely savoury and dark green-black.
5. To make laverbread cakes: mix the paste with enough oatmeal to form a firm dough that holds its shape. Shape into flat rounds about 1cm thick.
6. Coat the outside of each cake in dry oatmeal.
7. Fry in butter or bacon fat over medium heat for 3 to 4 minutes per side until crisp on the outside.
8. Serve with grilled bacon, cockles, and eggs.`,
    notes: `Storage: The cooked paste keeps in the fridge for up to 5 days, or freeze in portions.
Other uses: Stir into butter, spread on toast, or add to fish stews in the final minutes.
Sourcing: Pick from clean, uncontaminated water only. Check water quality classifications before picking any seaweed or shellfish. After heavy rain, wait at least 48 hours.`,
    seoTitle: 'Laverbread Recipe | The Foragers',
    seoDescription: 'Traditional Welsh laverbread from foraged laver seaweed. Cooked down to a dark paste, fried in oatmeal cakes. Instructions for both the paste and the cakes.',
  },
  {
    name: 'Crab Apple Jelly',
    slug: 'crab-apple-jelly',
    category: 'Preserve',
    season: 'September, October',
    difficulty: 'Medium',
    prepTime: '15 mins',
    cookTime: '45 mins (plus overnight dripping)',
    servings: '3 jars',
    species: 'Crab Apple',
    shortDescription: 'A clear, ruby-red jelly from foraged crab apples. Sets reliably without added pectin — crab apples have more than enough of their own. Sharp and aromatic, good with pork, lamb, cheese, or on toast.',
    intro: 'Crab apples make the best jelly of any foraged fruit. They are high in pectin — higher than most cultivated apples — so the set is reliable and the colour, when you hold the jar to the light, is a deep, clear red. The flavour is sharp and aromatic, somewhere between apple and quince. It keeps for a year and goes with most things: pork, lamb, a cheese board, toast with good butter.',
    ingredients: `1kg crab apples
Water to cover (about 600ml)
Preserving sugar (see method for quantity)
Juice of 1 lemon`,
    method: `1. Wash the crab apples and cut out any seriously damaged spots. No need to peel, core, or remove the pips — everything goes in.
2. Place in a large saucepan, cover with water, and bring to a boil.
3. Simmer for 30 to 40 minutes until completely soft and collapsed.
4. Pour into a jelly bag over a large bowl and leave to drip overnight. Do not squeeze — it makes the jelly cloudy.
5. Measure the collected juice. For every 600ml, weigh out 450g preserving sugar.
6. Add juice, sugar, and lemon juice to a large pan. Stir over low heat until the sugar dissolves completely.
7. Bring to a rolling boil and boil hard for 10 minutes.
8. Test on a cold plate — push the surface; if it wrinkles, it has set.
9. Skim any foam and pour into warm, sterilised jars.`,
    notes: `Clarity: Do not squeeze the jelly bag. Cloudy jelly tastes the same but the clarity is worth preserving.
Set: If it does not set after 10 minutes, boil for another 5 and test again.
Variations: Add rosemary sprigs or a handful of elderberries to the initial cooking pan.`,
    seoTitle: 'Crab Apple Jelly Recipe | The Foragers',
    seoDescription: 'Clear, ruby-red jelly from foraged crab apples. Sets without added pectin. Sharp and aromatic — good with pork, lamb, or cheese. Pick in September and October.',
  },
  {
    name: 'Hawthorn Ketchup',
    slug: 'hawthorn-ketchup',
    category: 'Preserve',
    season: 'September, October, November',
    difficulty: 'Medium',
    prepTime: '20 mins',
    cookTime: '1 hour',
    servings: '2 jars',
    species: 'Hawthorn',
    shortDescription: 'A dark, deeply flavoured ketchup from foraged hawthorn berries. Spiced with cider vinegar and brown sugar. Good with game, strong cheese, sausages, and cold meats. Keeps for 6 months.',
    intro: 'Hawthorn berries are not eaten raw — they are mealy and astringent and the stones make them awkward. Cooked down with vinegar, sugar, and spice, they make one of the best condiments the hedgerow offers. The flavour is somewhere between a good brown sauce and tamarind: dark, slightly fruity, with a tannic backbone. Pair it with game, strong cheese, or a cold sausage sandwich.',
    ingredients: `600g hawthorn berries, stalks removed
300ml cider vinegar
150g dark brown sugar
1 medium onion, roughly chopped
2 cloves garlic, sliced
1 tsp mixed spice
Half tsp ground allspice
1 tsp salt
300ml water`,
    method: `1. Wash the hawthorn berries and place in a large saucepan with the onion, garlic, and water.
2. Bring to a boil, then simmer for 25 minutes until the berries are completely soft.
3. Push the mixture through a fine sieve or food mill to remove the stones and skins. Allow 15 to 20 minutes for this — there are a lot of stones.
4. Return the pulp to the pan and add the vinegar, sugar, spices, and salt.
5. Simmer over low heat for 30 minutes, stirring regularly, until the sauce thickens and coats the back of a spoon.
6. Taste and adjust — more vinegar for sharpness, more sugar for balance.
7. Pour into sterilised jars or bottles while hot.`,
    notes: `Storage: Keeps for 6 months unopened. Refrigerate after opening and use within 4 weeks.
Sieving: A food mill handles this better than a sieve. The stones are hard and numerous.`,
    seoTitle: 'Hawthorn Ketchup Recipe | The Foragers',
    seoDescription: 'Dark, spiced ketchup from foraged hawthorn berries. Cider vinegar, brown sugar, mixed spice. Good with game, cheese, or sausages. Keeps for 6 months.',
  },
  {
    name: 'Hawthorn Berry Jelly',
    slug: 'hawthorn-berry-jelly',
    category: 'Preserve',
    season: 'September, October, November',
    difficulty: 'Medium',
    prepTime: '15 mins',
    cookTime: '45 mins (plus overnight dripping)',
    servings: '2 to 3 jars',
    species: 'Hawthorn',
    shortDescription: 'A dark garnet jelly from foraged hawthorn berries. Mild and slightly floral, with good natural pectin. Good with lamb, game, or spread on toast in place of jam.',
    intro: 'Hawthorn berry jelly is less well known than it deserves to be. The berries are high in pectin and the jelly sets clearly and well. The flavour is mild — faintly apple-like, with a slight bitterness that makes it more interesting than most bought jellies. Pick the berries in late September or October, once they are fully red. The hedgerows will have more than you need.',
    ingredients: `1kg hawthorn berries, stalks removed
Water to cover (about 700ml)
Preserving sugar (see method for quantity)
Juice of 1 lemon`,
    method: `1. Wash the berries and place in a large saucepan. Cover with water.
2. Bring to a boil, then simmer for 30 minutes until completely soft.
3. Mash the berries lightly with a potato masher, then pour into a jelly bag over a large bowl.
4. Leave to drip for at least 4 hours, ideally overnight. Do not squeeze.
5. Measure the juice. For every 600ml, weigh 450g preserving sugar.
6. Combine juice, sugar, and lemon juice in a large pan. Stir over low heat until dissolved.
7. Bring to a rolling boil and boil hard for 10 minutes.
8. Test on a cold plate. Pour into warm, sterilised jars when set.`,
    notes: `Yield: 1kg of berries produces roughly 600 to 700ml of juice, giving 2 to 3 jars.
Colour: A deep garnet rather than the clear red of crab apple jelly. Equally good held to the light.`,
    seoTitle: 'Hawthorn Berry Jelly Recipe | The Foragers',
    seoDescription: 'Clear garnet jelly from foraged hawthorn berries. Sets reliably without added pectin. Good with lamb or game. Pick in late September and October.',
  },
  {
    name: 'Elderflower Fritters',
    slug: 'elderflower-fritters',
    category: 'Sweet',
    season: 'May, June',
    difficulty: 'Easy',
    prepTime: '10 mins',
    cookTime: '10 mins',
    servings: '4',
    species: 'Elderflower',
    shortDescription: 'Whole elderflower heads dipped in a light batter and fried until crisp. The flowers stay inside, the outside blisters and crisps in the oil. Eaten immediately, dusted with icing sugar, with lemon on the side.',
    intro: 'Elderflower fritters are one of the best things you can make during the two weeks when elderflower is at its peak. The whole head goes into the batter — flowers and stem — and the frying transforms them into something light and fragrant. The elderflower flavour comes through clean and floral, not sweet. Eat them within minutes of coming out of the oil, dusted with icing sugar. They do not keep.',
    ingredients: `10 to 12 elderflower heads, freshly picked
100g plain flour
1 large egg, separated
150ml cold sparkling water
Pinch of salt
Vegetable oil for deep frying
Icing sugar to serve
1 lemon, cut into wedges`,
    method: `1. Shake the elderflower heads gently to dislodge any insects. Do not wash them.
2. Mix the flour, egg yolk, and sparkling water into a smooth batter. Add a pinch of salt.
3. Whisk the egg white to soft peaks and fold gently into the batter.
4. Heat oil to 180C in a deep saucepan or fryer.
5. Holding the stem, dip each elderflower head into the batter, letting excess drip off.
6. Lower carefully into the hot oil and fry for 2 to 3 minutes until pale gold and crisp.
7. Drain on kitchen paper. Dust with icing sugar and serve immediately with lemon.`,
    notes: `Timing: Use the batter immediately after folding in the egg white.
Oil temperature: Too cool and the batter absorbs oil and goes heavy. A thermometer is useful.
Season: Pick heads that are fully open but before any flowers have dropped.`,
    seoTitle: 'Elderflower Fritters Recipe | The Foragers',
    seoDescription: 'Whole elderflower heads in a light batter, fried until crisp. Dusted with icing sugar. A two-week-a-year recipe worth making while you can.',
  },
  {
    name: 'Hedgehog Mushroom on Toast',
    slug: 'hedgehog-mushroom',
    category: 'Savoury',
    season: 'August, September, October, November',
    difficulty: 'Easy',
    prepTime: '5 mins',
    cookTime: '10 mins',
    servings: '2',
    species: 'Hedgehog Mushroom',
    shortDescription: 'Hedgehog mushrooms cooked simply in butter and thyme on sourdough toast. Sweet, nutty, and reliable — one of the best fungi for beginners, and the teeth on the underside make them almost impossible to confuse with anything harmful.',
    intro: 'Hedgehog mushrooms are the beginner\'s fungus — the teeth on the underside make them almost impossible to confuse with anything dangerous. The flavour rewards the confidence: sweet and nutty, firmer than a chanterelle, they hold their texture in the pan and take butter well. Keep it simple. They do not need much more than a hot pan and good bread.',
    ingredients: `300g hedgehog mushrooms, cleaned
40g butter
2 cloves garlic, finely sliced
4 sprigs thyme
2 slices sourdough bread, toasted
Salt and pepper
Flat-leaf parsley to finish`,
    method: `1. Brush the mushrooms clean with a dry brush. Confirm the pale, tooth-like spines on the underside — this is your positive ID.
2. Slice any large mushrooms. Leave small ones whole.
3. Melt the butter in a wide pan over medium-high heat until foaming.
4. Add the mushrooms in a single layer. Leave for 2 minutes without stirring.
5. Add the garlic and thyme. Cook for a further 3 minutes, stirring occasionally.
6. Season with salt and pepper.
7. Pile onto the toast. Scatter parsley over and serve immediately.`,
    notes: `Cleaning: A brush handles most dirt. A damp cloth for anything stubborn. Avoid washing under running water.
ID: The pale, downward-pointing teeth on the underside rather than gills are the key feature. Always confirm before cooking.`,
    seoTitle: 'Hedgehog Mushroom Recipe | The Foragers',
    seoDescription: 'Hedgehog mushrooms on toast with butter, garlic, and thyme. Sweet and nutty. Teeth on the underside make them almost unmistakeable. Great for beginners.',
  },
  {
    name: 'Giant Puffball Schnitzel',
    slug: 'giant-puffball',
    category: 'Savoury',
    season: 'August, September, October',
    difficulty: 'Medium',
    prepTime: '10 mins',
    cookTime: '15 mins',
    servings: '4',
    species: 'Giant Puffball',
    shortDescription: 'Giant puffball sliced thick, coated in egg and breadcrumbs, and fried like schnitzel. The inside must be pure white throughout before you cook it. When it is, the texture is close to tofu, the flavour mild and rich.',
    intro: 'A giant puffball is one of the most dramatic finds in foraging. A white sphere the size of a football, appearing in a meadow or field edge. When you cut it open, it must be pure white throughout — solid, uniform, no trace of another shape or colour inside. That internal check is the safety rule. Once it passes, slice it thick and treat it like schnitzel. The flavour is mild, the texture firm and satisfying.',
    ingredients: `1 giant puffball, confirmed pure white throughout
2 eggs, beaten
100g fine breadcrumbs
50g plain flour, seasoned with salt and pepper
Butter and a neutral oil for frying
Lemon to serve`,
    method: `1. Cut the puffball into slices about 2cm thick.
2. Check each slice: the flesh must be pure white and solid throughout. Discard any slice showing colour or soft spots.
3. Coat each slice in seasoned flour, then beaten egg, then breadcrumbs.
4. Heat a generous mix of butter and oil in a large frying pan over medium heat.
5. Fry each slice for 3 to 4 minutes per side until golden.
6. Drain on kitchen paper. Serve with lemon wedges.`,
    notes: `Safety check: The pure white interior is non-negotiable. Any yellow, purple, grey, or brown colouration means do not eat it.
Lookalike warning: Common earthballs (Scleroderma citrinum) are smaller, harder, and dark purple-black inside when cut. Do not confuse them. If in doubt, leave it out.
Leftovers: Cooked puffball does not keep well. Eat on the day.`,
    seoTitle: 'Giant Puffball Recipe | The Foragers',
    seoDescription: 'Giant puffball sliced thick and fried like schnitzel. Must be pure white throughout — the safety check before anything else. Best made fresh on the day.',
  },
  {
    name: 'Chicken of the Woods',
    slug: 'chicken-of-the-woods',
    category: 'Savoury',
    season: 'July, August, September, October',
    difficulty: 'Medium',
    prepTime: '10 mins',
    cookTime: '20 mins',
    servings: '4',
    species: 'Chicken of the Woods',
    shortDescription: 'Chicken of the Woods cooked in butter with garlic, white wine, and cream. The texture is genuinely similar to chicken — firm, layered, satisfying. One of the most impressive fungi the woods offer in summer and autumn.',
    intro: 'Chicken of the Woods earns its name. The texture is unlike any other mushroom — firm and layered in a way that pulls apart like cooked chicken. It grows on trees, most reliably on oak, in vivid orange and yellow brackets. Pick the outer, younger edges where the flesh is softest. Cook it through fully. It is one of the most satisfying things a forager brings back from the woods.',
    ingredients: `400g chicken of the woods, tender outer sections only
40g butter
3 cloves garlic, finely sliced
150ml dry white wine
100ml double cream
Fresh thyme
Salt and pepper
Flat-leaf parsley to finish`,
    method: `1. Slice the chicken of the woods into pieces about 1cm thick.
2. Melt the butter in a wide pan over medium-high heat.
3. Add the mushroom pieces in a single layer. Cook without moving for 3 minutes until golden on the underside.
4. Flip and cook for another 3 minutes.
5. Add the garlic and thyme. Cook for 2 minutes.
6. Pour in the white wine. Let it reduce by half.
7. Add the cream and simmer for 3 to 4 minutes until the sauce coats the mushrooms.
8. Season with salt and pepper. Scatter parsley over and serve.`,
    notes: `Which part to use: Pick only the tender outer edges. The inner flesh near the wood is tough and fibrous.
Important: Some people react to chicken of the woods, particularly from yew or locust trees. Start with a small amount the first time. Cook fully — never eat raw or undercooked.`,
    seoTitle: 'Chicken of the Woods Recipe | The Foragers',
    seoDescription: 'Chicken of the woods in butter, white wine, and cream. Firm, layered texture unlike any other mushroom. A summer and autumn find worth knowing how to cook.',
  },
  {
    name: 'Sea Buckthorn Curd',
    slug: 'sea-buckthorn-curd',
    category: 'Preserve',
    season: 'September, October',
    difficulty: 'Medium',
    prepTime: '15 mins',
    cookTime: '30 mins',
    servings: '2 jars',
    species: 'Sea Buckthorn',
    shortDescription: 'A vivid orange curd from sea buckthorn berries. Intensely sharp and tropical in flavour, balanced with butter, eggs, and sugar. Good on toast, with scones, or as a filling for tarts.',
    intro: 'Sea buckthorn berries are not subtle. They are intensely sour with a flavour that sits somewhere between passion fruit and citrus, and the juice stains everything it touches a deep orange. Cooked into a curd, that sharpness softens into something complex and deeply flavoured. Use it like lemon curd — on toast, with scones, spooned into a tart case, or stirred into yoghurt.',
    ingredients: `150ml sea buckthorn juice (pressed from approximately 300g fresh berries)
150g caster sugar
100g unsalted butter, cubed
3 large eggs, beaten`,
    method: `1. To make the juice: cook the berries with a splash of water over medium heat until they burst. Press through a fine sieve. Measure out 150ml.
2. Put the juice, sugar, and butter in a heatproof bowl set over a pan of barely simmering water.
3. Stir until the butter melts and the sugar dissolves.
4. Add the beaten eggs gradually, stirring constantly.
5. Continue stirring over gentle heat for 15 to 20 minutes until the curd thickens and coats the back of a spoon.
6. Pour into warm, sterilised jars and seal immediately.`,
    notes: `Storage: Keeps in the fridge for up to 4 weeks. Does not freeze well.
Picking: Wear gloves and use scissors. The juice stains clothing permanently.
Season: Pick in September for the best flavour before the berries soften.`,
    seoTitle: 'Sea Buckthorn Curd Recipe | The Foragers',
    seoDescription: 'Vivid orange curd from foraged sea buckthorn berries. Intensely sharp, tropical in flavour. Good on toast, in tarts, or with scones. Pick in September.',
  },
  {
    name: 'Elderberry Cordial',
    slug: 'elderberry-cordial',
    category: 'Drink',
    season: 'August, September, October',
    difficulty: 'Easy',
    prepTime: '10 mins',
    cookTime: '20 mins',
    servings: '1 litre',
    species: 'Elderberry',
    shortDescription: 'A concentrated elderberry cordial with cinnamon, cloves, and lemon. Dilute with hot water for a warming winter drink, or with cold sparkling water the rest of the year. Richer and darker than elderflower — a different drink entirely.',
    intro: 'Elderberry cordial is the autumn counterpart to elderflower. The flavour is darker and deeper — richly fruity, with the slight tannin that elderberries always carry. Made with cinnamon and cloves, it becomes the best hot drink of November. The berries must be fully ripe and cooked before consuming — raw elderberries cause nausea.',
    ingredients: `500g elderberries, stripped from stems
300g caster sugar
300ml water
Juice of 1 lemon
1 cinnamon stick
4 cloves
2 star anise`,
    method: `1. Strip the berries from their stems using a fork. Discard any unripe green berries.
2. Rinse thoroughly.
3. Place the berries in a saucepan with the water and spices.
4. Bring to a boil, then simmer for 15 minutes, pressing the berries occasionally.
5. Strain through a fine sieve or muslin. Do not skip this step.
6. Return the liquid to the pan. Add the sugar and lemon juice.
7. Heat gently until the sugar dissolves. Do not boil.
8. Pour into sterilised bottles while still warm.`,
    notes: `Safety: Raw elderberries cause nausea and vomiting. The berries must be fully cooked before consuming.
Storage: Keeps in the fridge for up to 6 weeks. Freezes well in 250ml portions.
Serving: Dilute 1 part cordial to 4 parts hot water. Add to sparkling water cold. Drizzle undiluted over ice cream or yoghurt.`,
    seoTitle: 'Elderberry Cordial Recipe | The Foragers',
    seoDescription: 'Concentrated elderberry cordial with cinnamon, cloves, and lemon. Dilute hot for a warming winter drink. Berries must be cooked — never eat them raw.',
  },
  {
    name: 'Rosehip Syrup',
    slug: 'rosehip-syrup',
    category: 'Preserve',
    season: 'September, October, November',
    difficulty: 'Medium',
    prepTime: '20 mins',
    cookTime: '40 mins',
    servings: '2 bottles',
    species: 'Rosehip',
    shortDescription: 'A concentrated syrup from foraged rosehips, double-strained to remove the irritating hairs inside the fruit. Good diluted in water, drizzled over yoghurt, or used in cocktails.',
    intro: 'Rosehip syrup was made in large quantities in Britain during the Second World War when citrus was scarce. The traditional recipe requires double straining through muslin — the fine hairs inside the fruit cause irritation and must be removed completely. Take time with this step. The result is a sweet, slightly floral syrup with a flavour that no commercial product matches.',
    ingredients: `1kg rosehips, stalks and blossom ends removed
1.2 litres water, divided
400g caster sugar`,
    method: `1. Roughly chop the rosehips in a food processor — break them up, not to a paste.
2. Bring 750ml water to a rolling boil in a large saucepan.
3. Add the rosehips and return to a boil. Simmer for 15 minutes.
4. Strain through a jelly bag or muslin-lined colander. Save the liquid.
5. Return the pulp to the pan with the remaining 450ml water. Bring to a boil and simmer for 10 more minutes.
6. Strain again through fresh muslin. Combine both strained liquids.
7. Pour the combined liquid into a clean pan. Add the sugar and stir over low heat until dissolved.
8. Bring to a boil and simmer for 5 minutes.
9. Pour into warm, sterilised bottles and seal.`,
    notes: `The double strain: Non-negotiable. The fine hairs inside rosehips cause irritation if not removed. Two passes through clean muslin is the standard method.
Picking: Pick in October after the first frosts. Dog rose (Rosa canina) is the most common and reliable species.
Storage: Keeps for 3 to 4 months sealed. Refrigerate after opening and use within 6 weeks.`,
    seoTitle: 'Rosehip Syrup Recipe | The Foragers',
    seoDescription: 'Traditional rosehip syrup, double-strained to remove the irritating hairs. Sweet and floral. Good diluted, over yoghurt, or in cocktails. Pick in October.',
  },
  {
    name: 'Sloe Berry Jam',
    slug: 'sloe-berry-jam',
    category: 'Preserve',
    season: 'September, October, November',
    difficulty: 'Medium',
    prepTime: '20 mins',
    cookTime: '40 mins',
    servings: '4 jars',
    species: 'Sloe',
    shortDescription: 'A dark, tangy jam from foraged sloe berries. Thicker and more complex than blackberry jam, with a deep tartness balanced by sugar. Good on toast and exceptional with game and strong cheese.',
    intro: 'Sloe jam is not as well known as sloe gin, but it earns its place in the larder. The berries make a jam that is darker and more interesting than most — deeply coloured, with the same tannin that makes sloes so dry and astringent raw. Cooking and sugar transform them completely. They set well: sloes have plenty of natural pectin.',
    ingredients: `1kg sloes, washed and pricked
800g jam sugar
Juice of 1 lemon
200ml water`,
    method: `1. Prick each sloe several times with a fork or freeze overnight to split the skins.
2. Place the sloes in a large, heavy pan with the water.
3. Bring to a simmer and cook for 20 minutes until the skins soften and the fruit is completely tender.
4. Add the jam sugar and lemon juice. Stir over low heat until the sugar dissolves completely.
5. Bring to a rolling boil and boil hard for 10 to 15 minutes.
6. Test on a cold plate — the surface should wrinkle when pushed.
7. Push through a sieve to remove stones if you want a smoother result. This step is optional.
8. Pour into warm, sterilised jars and seal immediately.`,
    notes: `Stones: Leave them in and eat around them, or sieve for a smoother result. The sieve method loses some jam.
Set: Sloes have good natural pectin. If it does not set after 15 minutes, boil for another 5 and test again.
Uses: On toast, with game pate, alongside strong cheese, or as a glaze for duck.`,
    seoTitle: 'Sloe Berry Jam Recipe | The Foragers',
    seoDescription: 'Dark, tangy jam from foraged sloe berries. Sets well from natural pectin. Rich and deeply flavoured — good on toast or alongside game and strong cheese.',
  },
  {
    name: 'Nettle Pesto',
    slug: 'nettle-pesto',
    category: 'Savoury',
    season: 'March, April, May',
    difficulty: 'Easy',
    prepTime: '10 mins',
    cookTime: '5 mins',
    servings: '4',
    species: 'Common Nettle',
    shortDescription: 'A deep green pesto from blanched young nettles. Earthier and more mineral than basil pesto, with the same versatility. Good on pasta, toast, grilled fish, or stirred into soup.',
    intro: 'Nettle pesto takes the same few ingredients as basil pesto and produces something completely different. The nettles bring an earthy, mineral quality that is less sweet and more complex. Blanching removes the sting in sixty seconds. Pick young tops in March and April — the first four to six leaves at the top of the plant — for the best flavour and colour.',
    ingredients: `150g young nettle tops, washed (handle with gloves)
50g pine nuts or walnuts
50g Parmesan, finely grated
150ml olive oil
1 clove garlic
Juice of half a lemon
Salt and pepper`,
    method: `1. Bring a large pan of salted water to a boil.
2. Blanch the nettles for 60 seconds. Drain and refresh immediately in cold water.
3. Squeeze out as much water as possible. The sting is completely gone.
4. Toast the nuts in a dry pan until lightly golden.
5. Add nettles, nuts, garlic, and Parmesan to a food processor.
6. Pulse while drizzling in the olive oil until you reach the texture you want.
7. Add lemon juice, salt, and pepper. Taste and adjust.`,
    notes: `Storage: Keeps in the fridge for up to 2 weeks in a sealed jar, topped with olive oil. Freezes well in ice cube trays.
Picking: Young tops only — the first four to six leaves. Older leaves are tougher and less flavourful.
Variations: Goat's cheese or pecorino in place of Parmesan. Sunflower seeds instead of pine nuts.`,
    seoTitle: 'Nettle Pesto Recipe | The Foragers',
    seoDescription: 'Deep green pesto from blanched young nettles. Earthier than basil pesto. Ready in fifteen minutes. Pick March nettles — the best of the year. Freezes perfectly.',
  },
  {
    name: 'Dandelion Coffee',
    slug: 'dandelion-coffee',
    category: 'Drink',
    season: 'September, October, November',
    difficulty: 'Medium',
    prepTime: '30 mins',
    cookTime: '30 mins (plus 2 to 3 days drying)',
    servings: '20 cups approximately',
    species: 'Dandelion',
    shortDescription: 'A caffeine-free hot drink from roasted dandelion root. The roots must be dried and roasted before grinding — most of the time is passive. The result is a deep, bitter, genuinely warming drink. Dig the roots in autumn when they are fattest.',
    intro: 'Dandelion root coffee is not a substitute for coffee in the way that chicory is not a substitute for coffee. It is its own thing: bitter, earthy, with depth that comes from the roasting. The process takes a few days from root to cup, but most of that is passive drying time. Dig the roots in autumn when the energy drawn down for winter makes them fattest. Wash, dry, roast, grind. The result keeps for months.',
    ingredients: `500g dandelion roots, freshly dug
Water for washing`,
    method: `1. Dig dandelion roots in autumn. Wash thoroughly, scrubbing off all soil.
2. Chop the roots into small pieces, roughly 1cm.
3. Spread on a baking tray and dry in a low oven (70C) for 2 hours, or air dry for 2 to 3 days until completely brittle.
4. Once dry, roast in an oven at 200C for 20 to 30 minutes until dark brown and fragrant. Watch them — they catch quickly in the final minutes.
5. Cool completely before grinding.
6. Grind in a coffee grinder or spice grinder to a coarse powder.
7. To brew: use 1 heaped teaspoon per cup, add boiling water, steep for 5 minutes, then strain.`,
    notes: `Storage: Roasted ground root keeps for up to 6 months in a sealed jar in a cool, dark place.
Brewing: A cafetiere works well — steep and press as you would ground coffee. Or brew in a small pan and strain.
Roast level: A shorter roast gives a milder, more earthy drink. A longer roast gives something closer to espresso in intensity.`,
    seoTitle: 'Dandelion Coffee Recipe | The Foragers',
    seoDescription: 'Roasted dandelion root coffee — caffeine-free, bitter, and warming. Dig the roots in autumn. Takes a few days to prepare, keeps for six months.',
  },
  {
    name: 'Blackberry Vinegar',
    slug: 'blackberry-vinegar',
    category: 'Preserve',
    season: 'August, September, October',
    difficulty: 'Easy',
    prepTime: '10 mins',
    cookTime: '0 mins (plus 2 weeks steeping)',
    servings: '1 bottle',
    species: 'Blackberry',
    shortDescription: 'A fruity, deeply coloured vinegar from foraged blackberries steeped in white wine vinegar. Good in salad dressings, drizzled over cheese, stirred into sauces, or diluted as a sharp drink. Keeps for a year.',
    intro: 'Blackberry vinegar is the most useful thing you can make with a glut of blackberries beyond jam. It keeps for a year and has a concentrated berry flavour that white wine vinegar alone cannot produce. The process is simple: berries, vinegar, two weeks. Strain and bottle. The colour is a deep, almost purple-black. The flavour is sharp and fruity and goes with more things than you might expect.',
    ingredients: `500g blackberries
500ml white wine vinegar
100g caster sugar (optional — adds sweetness, acts as preservative)`,
    method: `1. Rinse the blackberries and place in a large, sterilised glass jar.
2. Pour over the white wine vinegar and seal tightly.
3. Store in a cool, dark place for 2 weeks. Swirl the jar every couple of days.
4. Strain through muslin or a fine sieve, pressing lightly to extract all the liquid. Discard the spent berries.
5. If adding sugar: warm the strained vinegar gently in a pan, add the sugar, and stir until dissolved. Do not boil.
6. Pour into sterilised bottles and seal.`,
    notes: `Storage: Keeps for up to 1 year in a cool, dark cupboard. Refrigerate after opening.
Uses: In salad dressings, drizzled over goat's cheese, stirred into pan sauces with game or duck, or diluted in sparkling water as a sharp drink.
Sugar: Leaving it out gives a sharper, more acidic vinegar. Adding it produces something softer and more versatile as a drink base.`,
    seoTitle: 'Blackberry Vinegar Recipe | The Foragers',
    seoDescription: 'Fruity, deeply coloured vinegar from foraged blackberries. Two weeks steeping, one year keeping. Good in dressings, with cheese, in sauces, or as a drink.',
  },
];

async function deleteAllRecipes() {
  console.log('Fetching existing recipes...');

  const res = await fetch(`${AIRTABLE_API}/${BASE_ID}/Recipes`, {
    headers: { Authorization: `Bearer ${PAT}` },
  });

  if (!res.ok) {
    console.log('No existing recipes table or empty');
    return;
  }

  const data = await res.json();
  const recordIds = data.records.map(r => r.id);

  if (recordIds.length === 0) {
    console.log('No existing recipes to delete');
    return;
  }

  console.log(`Deleting ${recordIds.length} existing recipes...`);

  // Delete in batches of 10
  for (let i = 0; i < recordIds.length; i += 10) {
    const batch = recordIds.slice(i, i + 10);
    const params = batch.map(id => `records[]=${id}`).join('&');

    await fetch(`${AIRTABLE_API}/${BASE_ID}/Recipes?${params}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${PAT}` },
    });

    console.log(`Deleted ${Math.min(i + 10, recordIds.length)}/${recordIds.length}`);
    await new Promise(r => setTimeout(r, 250));
  }
}

async function uploadRecipes() {
  console.log(`\nUploading ${recipes.length} new recipes...`);

  // Upload in batches of 10
  for (let i = 0; i < recipes.length; i += 10) {
    const batch = recipes.slice(i, i + 10);

    const records = batch.map(r => ({
      fields: {
        'Recipe Name': r.name,
        'Slug': r.slug,
        'Category': r.category,
        'Season': r.season.split(', ').map(s => s.trim()),
        'Difficulty': r.difficulty,
        'Prep Time': r.prepTime,
        'Cook Time': r.cookTime,
        'Servings': r.servings,
        // Species is a linked record field - needs to be linked manually in Airtable
        'Short Description': r.shortDescription,
        'Intro': r.intro,
        'Ingredients': r.ingredients,
        'Method': r.method,
        'Notes': r.notes,
        'SEO Title': r.seoTitle,
        'SEO Description': r.seoDescription,
        'Status': 'Live',
      }
    }));

    const res = await fetch(`${AIRTABLE_API}/${BASE_ID}/Recipes`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAT}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ records }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error(`Error uploading batch: ${error}`);
    } else {
      console.log(`Uploaded ${Math.min(i + 10, recipes.length)}/${recipes.length}`);
    }

    await new Promise(r => setTimeout(r, 250));
  }
}

async function main() {
  await deleteAllRecipes();
  await uploadRecipes();
  console.log('\nDone! All 20 recipes uploaded with Status = Draft');
}

main().catch(console.error);
