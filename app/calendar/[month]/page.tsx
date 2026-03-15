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

interface SpeciesFeature {
  name: string;
  slug: string;
  description: string;
}

interface MonthContent {
  season: string;
  intro: string;
  highlights: string[];
  featured: SpeciesFeature[];
  arrivingFinishing: string;
  seoTitle: string;
  seoDescription: string;
}

const MONTH_DATA: Record<Month, MonthContent> = {
  January: {
    season: 'Deep Winter',
    intro: 'January strips things back. The woodland floor is bare, the hedgerows emptied. The coast opens up, and the winter fungi are fruiting on dead wood and fallen branches across the country. This is a month for knowing where to look rather than having many places to look.',
    highlights: [
      'Velvet Shank fruits through frost and snow on dead elm and beech',
      'Oyster Mushroom flushes on dead beech in wet, mild spells',
      'Mussels, winkles, and cockles are in peak condition',
      'Jelly Ear is prominent now the leaves are down',
      'Scarlet Elf Cup begins appearing in late January',
      'Seaweeds are available and at their cleanest in winter',
    ],
    featured: [
      { name: 'Velvet Shank', slug: 'velvet-shank', description: 'Velvet Shank (Flammulina velutipes) is the fungi to look for in January. It grows in tight clusters on dead and dying deciduous wood, most commonly elm and beech, and fruits through the coldest months when almost everything else has stopped. The cap is orange-brown and glossy, 2–8cm across. The stem is distinctly velvety toward the base. It withstands frost: find a cluster frozen solid on a cold morning and it will look exactly the same after it thaws.' },
      { name: 'Oyster Mushroom', slug: 'oyster-mushroom', description: 'Oyster Mushroom (Pleurotus ostreatus) grows in overlapping shelves on dead or dying broadleaf trees, most often beech. The caps are grey to grey-brown, fan-shaped, 5–25cm across, with crowded white gills that run down a short off-centre stem. January\'s wet, mild spells bring flushes on fallen logs and standing deadwood. This is a good species for complete beginners: large, distinctive, and easy to identify.' },
      { name: 'Mussel', slug: 'mussel', description: 'Common Mussel (Mytilus edulis) is at its best through winter. Cold water keeps them firm and in peak condition and January is as good a month as any to be on the coast. Mussels cling to rocks, pier legs, and rope in dense colonies on exposed and semi-exposed coastline. Always check the water quality classification of any site before picking.' },
    ],
    arrivingFinishing: 'Three-cornered Leek shoots are findable in mild areas of the south and west from January onward. Scarlet Elf Cup is just beginning in sheltered southern woodland. January is the floor of the foraging year. Things are arriving, not leaving.',
    seoTitle: 'What to Forage in January | The Foragers',
    seoDescription: 'January foraging in the UK: velvet shank, oyster mushroom, coastal shellfish and winter seaweeds. What\'s out there and where to find it.',
  },
  February: {
    season: 'Late Winter',
    intro: 'February is the month of false starts. A warm week mid-month can bring the first wild garlic shoots and the earliest violets, then cold snaps everything shut again. The coast is your most productive ground this month. Alexanders is already thick on clifftops and south-facing banks, and there is more happening out there than February gets credit for.',
    highlights: [
      'Alexanders is thick and ready on coastal banks and hedgerows',
      'Scarlet Elf Cup peaks through February on rotting wood',
      'Cleavers shoots are young and at their most edible now',
      'Sweet Violet is flowering with edible flowers',
      'Three-cornered Leek is up in the south and west',
      'Oyster Mushroom and Velvet Shank continue through mild spells',
    ],
    featured: [
      { name: 'Alexanders', slug: 'alexanders', description: 'Alexanders (Smyrnium olusatrum) is the find of the late winter coast. It grows in thick stands on sea cliffs, coastal hedgerows, and roadsides within a few miles of the sea. In February the stems are thick, bright green, and at their best. The flavour is celery-like but more aromatic, with a slight bitterness that cooking softens. Pick the young stems and leaves. It is a substantial wild vegetable available at a time when almost nothing else is.' },
      { name: 'Scarlet Elf Cup', slug: 'scarlet-elf-cup', description: 'Scarlet Elf Cup (Sarcoscypha austriaca) is a visually striking find. The cups are vivid scarlet inside, cream to white on the outside, 2–6cm across, growing in clusters on fallen branches half-buried under leaf litter in damp woodland. February is when they are most abundant and at their freshest. Check rotten wood and half-buried branches in wet, shaded woodland near streams.' },
      { name: 'Miners Lettuce', slug: 'miners-lettuce', description: 'Miner\'s Lettuce (Claytonia perfoliata) is a North American introduction now naturalised across Britain. The round leaves appear to have the stem growing through their centre — that is the unmistakable feature. They are mild, succulent, and very good raw in a winter salad. February and March are the prime months. A good beginner species: straightforward to identify, no preparation needed.' },
    ],
    arrivingFinishing: 'Wild Garlic shoots are visible in the last week of February in sheltered southern woodland. Primrose is flowering from mid-month. Scarlet Elf Cup begins to thin toward the end of February as temperatures rise. Velvet Shank is on its way out by late February in most years.',
    seoTitle: 'What to Forage in February | The Foragers',
    seoDescription: 'February foraging UK: Alexanders, Scarlet Elf Cup, Miner\'s Lettuce and the first coastal greens. What\'s worth finding before spring arrives.',
  },
  March: {
    season: 'Early Spring',
    intro: 'March announces itself before you arrive. Walk into the right woodland on a warm morning and the smell of wild garlic hits you 20 metres before you see the plants. This is the first month of genuine abundance. The month that turns people who have been meaning to start for years into people who are actually out there.',
    highlights: [
      'Wild Garlic peaks in damp deciduous woodland',
      'Young nettles are best this month, before they toughen',
      'Hawthorn buds are opening on sheltered hedgerows',
      'Wood Sorrel carpets damp woodland floors',
      'Ground Elder, Sweet Cicely, and Hogweed are shooting',
      'Morel is in season from late March',
    ],
    featured: [
      { name: 'Wild Garlic', slug: 'wild-garlic', description: 'Wild Garlic (Allium ursinum) is the defining find of British spring and March is its month. The broad, lance-shaped leaves carpet ancient woodland floors. Pick leaves before the white star-shaped flowers open in April. Use the leaves like basil: raw in a spring pesto, wilted briefly into butter, blended into soups. The flavour is soft garlic without the heat. Before you pick anything, read the species page. There are plants on the same woodland floor that matter.' },
      { name: 'Common Nettle', slug: 'common-nettle', description: 'Young Nettle (Urtica dioica) tops in March are as good as the plant gets. Pick the top four leaves only from plants under 20cm. Wear gloves. The sting is completely neutralised by heat. The flavour is deep green and mineral, and nettle does things in the kitchen that spinach cannot quite match. March tops have more character than any other month. By June the plant is too coarse to bother with.' },
      { name: 'Wood Sorrel', slug: 'wood-sorrel', description: 'Wood Sorrel (Oxalis acetosella) grows low across the forest floor in the same damp deciduous woodland as wild garlic. The leaves are three-lobed, heart-shaped, bright green, and fold downward in strong light. The flavour is clean, precise, citrusy acidity. Sharper than Common Sorrel and more delicate. It is best raw, in small quantities. A handful through a spring salad does something that nothing else quite replicates.' },
    ],
    arrivingFinishing: 'Sorrel, Jack-by-the-Hedge, and Scurvygrass are all emerging through March. Hawthorn blossom opens on sheltered south-facing branches at the very end of the month. Scarlet Elf Cup finishes in the first two weeks. Alexanders peaks in early March and starts to flower and toughen toward the end. Pick it now if you want the best of it.',
    seoTitle: 'What to Forage in March | The Foragers',
    seoDescription: 'March foraging UK: wild garlic, young nettles, wood sorrel and hawthorn buds. The foraging year starts properly. What to find and when.',
  },
  April: {
    season: 'Spring',
    intro: 'April is when the hedgerows catch up with the woodland. Wild garlic is still going, the hedgerow mustards and sorrels are at their peak, and the blossom season begins properly. The light is better. The ground is warm enough to kneel on. This is the month most people discover they have been walking past food for years.',
    highlights: [
      'Hawthorn blossom opens from mid-month',
      'Wild garlic is flowering with edible flowers',
      'Sorrel is at its most tender this month',
      'Sea Kale is shooting on shingle beaches',
      'Sweet Woodruff and Lady\'s Smock are flowering',
      'St George\'s Mushroom is in season from late April',
    ],
    featured: [
      { name: 'Hawthorn', slug: 'hawthorn', description: 'Hawthorn blossom (Crataegus monogyna) covers every hedgerow in Britain through April and May and almost nobody picks it. The petals have a faint almond quality and a floral character that holds up well in a cold-infused cordial or vinegar. The young leaves, which appear just before the blossom, are mild and good eaten straight from the branch. Pick blossom from branches well away from busy roads and use within a day.' },
      { name: 'Sorrel', slug: 'sorrel', description: 'Common Sorrel (Rumex acetosa) is at its most tender and flavourful in April, before the stems elongate and the leaves toughen toward summer. The flavour is clean, bright acidity. A lemon without the sweetness. Raw it lifts a green salad. Cooked, the acidity mellows considerably and it becomes a sauce or a soup base worth making. Pick the young leaves from the centre of the plant.' },
      { name: 'Sea Kale', slug: 'sea-kale', description: 'Sea Kale (Crambe maritima) shoots on shingle beaches in southern and western Britain from April through June. The young blanched shoots, those still pale beneath the shingle, are the prize. They emerge as thick, fleshy spears with crinkled blue-green leaves just beginning to unfurl. The plant is not common and should be picked sparingly from large colonies only.' },
    ],
    arrivingFinishing: 'Elderflower opens in sheltered spots in the south toward the end of April in warm years. Chicken of the Woods begins appearing on oak and sweet chestnut from mid-month. Wild garlic is coming to the end of its leaf season. The flowers are still good and the green seed heads forming now are excellent pickled. Morel season is closing by mid-April.',
    seoTitle: 'What to Forage in April | The Foragers',
    seoDescription: 'April foraging UK: hawthorn blossom, sorrel, sea kale and wild garlic flowers. Full spring in the hedgerows. What to find and how.',
  },
  May: {
    season: 'Late Spring',
    intro: 'May is two months at once. The spring greens are still good in the first two weeks, then the elderflower opening in the second week changes everything. From that point you are split between finishing what spring started and chasing what summer has just begun. There is almost too much to do in May, which is the right kind of problem.',
    highlights: [
      'Elderflower opens from mid-May in the south',
      'Chicken of the Woods fruits on oak and sweet chestnut',
      'Wild garlic seed heads are excellent pickled',
      'Marsh Samphire is beginning to shoot in estuaries',
      'Bistort is up in northern meadows',
      'Crow Garlic, Sow Thistle, and Brooklime are in season',
    ],
    featured: [
      { name: 'Elderflower', slug: 'elderflower', description: 'Elderflower (Sambucus nigra) needs precise timing. The flowers are at their best for a short window: fully open, fragrant, and before the tiny petals begin to fall. Pick on a dry morning, away from busy roads. The heads should smell floral and distinctly musky. Elderflower cordial is the obvious use and a genuinely good one, but the flowers work equally well in cold-infused vinegars and syrups.' },
      { name: 'Chicken of the Woods', slug: 'chicken-of-the-woods', description: 'Chicken of the Woods (Laetiporus sulphureus) is a hard-to-miss find: overlapping shelves of vivid orange and yellow on the trunks of oak, sweet chestnut, and other species. Pick young brackets only. The outer edge, soft and pale yellow, giving slightly under pressure, is what you want. Older growth is dry, chalky, and not worth taking. It flushes several times on the same tree through the season.' },
      { name: 'Wild Garlic', slug: 'wild-garlic', description: 'The green seed heads that form on Wild Garlic (Allium ursinum) in May are among the most overlooked picks of the spring. Once the white flowers fade, round green seed capsules develop on the flower stems. Pick them while still firm and green, before they dry and split. Preserved in brine or cider vinegar they keep for months and deliver a sharper, more pungent flavour than the fresh leaves.' },
    ],
    arrivingFinishing: 'Wild Strawberry is flowering in woodland edges and clearings. Dog Rose is in bud. Dulse and Sea Lettuce are available on the coast from May onward. Wild Garlic leaves are finished by the third week. Morel season is over for another year.',
    seoTitle: 'What to Forage in May | The Foragers',
    seoDescription: 'May foraging UK: elderflower, Chicken of the Woods, wild garlic seed heads and the last spring greens. What to pick before spring turns to summer.',
  },
  June: {
    season: 'Early Summer',
    intro: 'June rewards those who know where to go. The spring rush is over and the autumn abundance is some way off. What June offers is precise: a specific run of flowers and coastal plants with short windows, unmissable if you know about them and easy to miss if you do not. The coast in June is worth a dedicated trip.',
    highlights: [
      'Marsh Samphire is at its most tender now',
      'Dog Rose petals are open on every hedgerow',
      'Meadowsweet is flowering in damp meadows',
      'Lime Blossom makes the finest flower tea',
      'Elderflower is finishing in the south',
      'Fat Hen and Good King Henry are up',
    ],
    featured: [
      { name: 'Marsh Samphire', slug: 'marsh-samphire', description: 'Marsh Samphire (Salicornia europaea) grows in dense bright green carpets across the mudflats and saltmarshes of English estuaries. In June the plants are young, slender, and at their most tender. Pick stems from the upper saltmarsh where they are cleanest, rinse thoroughly, and blanch briefly in unsalted water. It needs nothing more than butter. The flavour is bright and saline and distinctly its own.' },
      { name: 'Meadowsweet', slug: 'meadowsweet', description: 'Meadowsweet (Filipendula ulmaria) grows in damp meadows, along riverbanks, and in wet ditches through June and July. The flowers are creamy-white, held in dense frothy heads, and smell of almonds with something harder to name. Cold infusion in cream or milk is the method that serves the flavour best: place fresh flower heads in cold liquid and refrigerate overnight.' },
      { name: 'Dog Rose', slug: 'dog-rose', description: 'Dog Rose (Rosa canina) covers British hedgerows and the pale pink five-petalled flowers are at their brief peak in June. They drop quickly after opening and are best picked in the morning on a dry day. The flavour is mild and floral. Use fresh petals in cold-infused vinegars or syrups and use them the same day. The hips that follow in September are a completely different prospect.' },
    ],
    arrivingFinishing: 'Wild Strawberry is fruiting in the second half of June. Chanterelle appears in the best years in sheltered mossy woodland from late June after sustained rain. Wild Cherry and Bilberry are beginning. Elderflower is finished in the south by mid-June. Do not leave it.',
    seoTitle: 'What to Forage in June | The Foragers',
    seoDescription: 'June foraging UK: marsh samphire, meadowsweet, dog rose and the last elderflower. The coastal and flower month. What to pick and when.',
  },
  July: {
    season: 'High Summer',
    intro: 'July is when two threads of the foraging year first run together: summer fruit and the start of the fungi season. Bilberry and raspberry are ready on moorland and in clearings. Chanterelle is fruiting in damp mossy woodland after rain. Go out early in July and go out after rain.',
    highlights: [
      'Chanterelle peaks in damp mossy broadleaf woodland',
      'Bilberry is ripening on moorland and heathland',
      'Wild Cherry is ready with a brief window',
      'Bay Bolete is fruiting under pine, larch, and spruce',
      'Marsh Samphire is at its full best',
      'Raspberry is in woodland clearings and scrub',
    ],
    featured: [
      { name: 'Chanterelle', slug: 'chanterelle', description: 'Chanterelle (Cantharellus cibarius) is the find that defines the summer forager. It grows in damp, mossy broadleaf woodland, most often under beech and oak. The cap is golden-yellow to egg-yolk orange, wavy-edged and irregular. The underside has forking ridges rather than true gills. The whole fungus smells faintly of apricots. They grow in the same spots year on year. Find your location once and you have it for as long as the woodland stands.' },
      { name: 'Bilberry', slug: 'bilberry', description: 'Bilberry (Vaccinium myrtillus) grows on acid moorland, heathland, and open woodland across Britain. The berries are smaller and darker than cultivated blueberries and the flavour is considerably more concentrated. Tart, deeply fruited, with none of the watery sweetness of the shop version. They stain everything they touch a deep purple. Pick in quantity because it takes time to collect enough for anything useful.' },
      { name: 'Marsh Samphire', slug: 'marsh-samphire', description: 'July is the peak month for Marsh Samphire (Salicornia europaea) and the plants are now at their full size and best. The stems are bright green, firm, and intensely saline. Pick from the upper saltmarsh on a low tide, rinse well, and use quickly. It deteriorates within a day or two of picking. This is a wild vegetable that has made a genuine mark on restaurant cooking.' },
    ],
    arrivingFinishing: 'Blackberry starts fruiting in sheltered spots from late July in the south. Cep begins appearing under pine and spruce in the Scottish uplands in good years. Lime Blossom is finished by mid-July. Wild Gooseberry is ready in hedgerows and scrub through July.',
    seoTitle: 'What to Forage in July | The Foragers',
    seoDescription: 'July foraging UK: chanterelle, bilberry, bay bolete and marsh samphire at its best. Summer fungi and fruit. What to find and where.',
  },
  August: {
    season: 'Late Summer',
    intro: 'August is when autumn arrives in the fungi before it arrives anywhere else. The Cep is up under pine and spruce. Blackberries are ripening on every hedgerow. Elderberries are nearly there. Everything is happening at once and the month rewards going out often rather than saving it for one long day.',
    highlights: [
      'Cep is fruiting under pine, spruce, and beech',
      'Blackberries ripen from early August in the south',
      'Elderberry clusters are darkening through August',
      'Chanterelle continues strongly through August',
      'Hedgehog Mushroom begins appearing from late August',
      'Giant Puffball appears in old pasture',
    ],
    featured: [
      { name: 'Cep', slug: 'cep', description: 'Cep (Boletus edulis) is the most sought-after fungus in Britain. The cap is brown and smooth, 8–25cm across, the colour of a baked bread crust. The pores beneath are white, turning yellow-green with age. The stem is pale, club-shaped, with a fine raised network of white lines. Find Cep in a location once and return every August. Cep dries better than almost any other fungus. Sliced thinly and dried low and slow, the flavour concentrates and deepens.' },
      { name: 'Blackberry', slug: 'blackberry', description: 'Blackberry (Rubus fruticosus) needs no introduction. The bramble covers every hedgerow, field margin, and scrubby edge in Britain. The best blackberries are in full sun on south-facing banks, away from paths where picking pressure is highest. Fruit in deep shade tends to be smaller and more acid. Pick fully ripe: black all over, yielding slightly to pressure, coming away cleanly from the plug.' },
      { name: 'Elderberry', slug: 'elderberry', description: 'Elderberry (Sambucus nigra) clusters hang heavy and dark purple through August, ripening to near-black by month\'s end. Pick them fully dark. Underripe berries are not worth taking. Elderberry cordial, jelly, and wine are the classic uses and there are good reasons they are classic. The species page covers the full detail on elder, including which parts of the plant are not the berries.' },
    ],
    arrivingFinishing: 'Sloe berries are forming on blackthorn but not yet ready. Rosehip is colouring on dog rose. Hazelnut is in the shell but not fully ripe. The green cases begin to split in late August. Bilberry is finishing on higher ground by mid-August. Marsh Samphire is toughening and starting to redden. The picking window is closing.',
    seoTitle: 'What to Forage in August | The Foragers',
    seoDescription: 'August foraging UK: cep, blackberry, elderberry and the peak of the chanterelle season. Summer and autumn overlapping. What\'s at its best right now.',
  },
  September: {
    season: 'Early Autumn',
    intro: 'September is the month. No other month comes close for sheer variety and quality. The woodland floor is alive with fungi. Hedgerows are loaded with sloe, rosehip, and the last blackberries. The nut season begins. If you go out once in the foraging year, September is when to go.',
    highlights: [
      'Cep peaks in broadleaf and mixed woodland',
      'Hedgehog Mushroom starts fruiting with no dangerous lookalikes',
      'Hazelnut drops from the shells in late September',
      'Sweet Chestnut falls from mid-September',
      'Rosehip is at full colour and flavour',
      'Coastal shellfish season restarts properly',
    ],
    featured: [
      { name: 'Hedgehog Mushroom', slug: 'hedgehog-mushroom', description: 'Hedgehog Mushroom (Hydnum repandum) is a safe and beginner-friendly edible fungi in Britain. Instead of gills or pores, the underside of the cap bears cream-coloured spines or teeth. The cap is cream to pale tan, wavy and irregular. There is nothing in Britain that looks like it and is dangerous. A slight bitterness in the flesh fades with cooking. Find a productive woodland in September and check it every few weeks.' },
      { name: 'Hazelnut', slug: 'hazelnut', description: 'Hazelnut (Corylus avellana) ripens from September in hedgerows, coppice woodland, and scrub across Britain. The nuts are ripe when the green case begins to yellow and the nut separates cleanly. The competition is serious: squirrels, dormice, and woodpeckers all know exactly when the nuts are ready. Get out in the first two weeks of September. The flavour of a fresh hazel from the shell is far removed from dried nuts sold commercially.' },
      { name: 'Sweet Chestnut', slug: 'sweet-chestnut', description: 'Sweet Chestnut (Castanea sativa) begins falling in September in southern England and peaks through October. The spiny cases split on the tree or on impact with the ground. Collect from the ground under productive trees: large, mature specimens in parks, estate woodlands, and southern hedgerows. The nuts do not store long raw. Use them within a week or freeze them cooked and peeled.' },
    ],
    arrivingFinishing: 'Winter Chanterelle starts appearing in wet conifer woodland from September. Wood Blewit begins fruiting at woodland edges in the second half of the month. Blackberry quality declines quickly toward month\'s end. The coastal shellfish season restarts. Mussels, winkles, and cockles are good again after the summer.',
    seoTitle: 'What to Forage in September | The Foragers',
    seoDescription: 'September foraging UK: cep, hedgehog mushroom, hazelnut, sloe and sweet chestnut. The richest month in the British foraging calendar.',
  },
  October: {
    season: 'Autumn',
    intro: 'October is the month of transitions. The summer boletes are on their way out. The winter fungi — Oyster Mushroom, Velvet Shank, Winter Chanterelle — are arriving. Sloe after the first frost is a ritual for a reason. The woodland floor smells of decay in the best possible sense: fungi, wet leaves, turned earth. Go out in the mornings.',
    highlights: [
      'Wood Blewit is at its best with distinctive blue-lilac colouring',
      'Hedgehog Mushroom peaks through October',
      'Sweet Chestnut is often better now than September',
      'Sloe is at its best after the first frost',
      'Oyster Mushroom arrives in the second half of the month',
      'Winter Chanterelle is appearing in mossy conifer woodland',
    ],
    featured: [
      { name: 'Wood Blewit', slug: 'wood-blewit', description: 'Wood Blewit (Lepista nuda) is a visually striking autumn fungi: the cap, gills, and stem are all suffused with a distinctive blue-lilac colour, fading to tan as the mushroom ages. It grows in deciduous woodland, hedgerows, and gardens in deep leaf litter and compost-rich soil. The smell is strong and floral, almost perfumed. Find it in the same spots year on year. Worth learning properly before picking.' },
      { name: 'Sloe', slug: 'sloe', description: 'Sloe (Prunus spinosa) is ready when it is ready, not when the calendar says. Most foragers wait for the first frost, which softens the skins and reduces the mouth-puckering tannins. In mild autumns, pricking each berry before using achieves the same result. The berries are deep blue-black and covered in a fine bloom. Sloe gin is the classic use and needs no improvement. They also make a good jelly with crab apple.' },
      { name: 'Hedgehog Mushroom', slug: 'hedgehog-mushroom', description: 'October is the peak month for Hedgehog Mushroom and the best time to find large, clean specimens in quantity. They fruit in loose groups in broadleaf and mixed woodland, often in the same spots as Chanterelle. The identifying feature — cream-white spines or teeth on the underside of the cap — is immediately visible and unmistakable. Worth picking in volume in October. They dry well.' },
    ],
    arrivingFinishing: 'Velvet Shank is appearing on dead elm and beech from late October. The Cep season is effectively over in most areas by mid-month. Giant Puffball is finished. Chanterelle tapers off through the month, replaced by Winter Chanterelle in wet conifer sites.',
    seoTitle: 'What to Forage in October | The Foragers',
    seoDescription: 'October foraging UK: wood blewit, hedgehog mushroom, sloe after first frost and sweet chestnut. Deep autumn in the British countryside.',
  },
  November: {
    season: 'Late Autumn',
    intro: 'November looks like the end of the foraging year. It is not. Most people stop going out this month, which means quieter woodland and less competition for those who do not. The winter fungi are at their best. The coast is fully productive. There are fewer species than October, but the ones that are here are genuinely worth going out for.',
    highlights: [
      'Velvet Shank is fully into its season until March',
      'Winter Chanterelle peaks in mossy wet conifer woodland',
      'Oyster Mushroom continues on beech deadwood',
      'Coastal shellfish are in prime condition',
      'Rosehip holds well on the branches',
      'Burdock root can be dug from first-year plants',
    ],
    featured: [
      { name: 'Winter Chanterelle', slug: 'winter-chanterelle', description: 'Winter Chanterelle (Craterellus tubaeformis), also called Yellowleg, is an underappreciated fungi in the British calendar. It grows in dense groups in wet, mossy conifer woodland, particularly under spruce and pine. The cap is small, brown and funnel-shaped with a wavy margin. The stem is distinctly yellow to orange-yellow and hollow. The flavour is earthy and direct and it dries exceptionally well.' },
      { name: 'Velvet Shank', slug: 'velvet-shank', description: 'November marks the beginning of Velvet Shank\'s proper season. The clusters that appear on dead elm, beech, and ash from now through March are at their freshest. The glossy orange-brown cap and distinctly velvety lower stem are the identifying features. This fungus survives frost: it freezes solid and revives without damage when temperatures rise. A hard November frost does not end the season.' },
      { name: 'Mussel', slug: 'mussel', description: 'November through March is the best window for wild mussels and the quality now is at its peak. Cold water keeps them firm and in excellent condition. Pick only from fast-moving, clean tidal water and always check the water quality classification of any site. Wild mussels collected at this time of year are a different thing from what you buy.' },
    ],
    arrivingFinishing: 'The coastal foraging season is deepening into winter. Burdock root comes into its best in November and December as the above-ground growth dies back. Jelly Ear is findable on elder through the year and prominent now the leaves are down. The autumn berry and nut season is effectively over by the end of the month.',
    seoTitle: 'What to Forage in November | The Foragers',
    seoDescription: 'November foraging UK: velvet shank, winter chanterelle, oyster mushroom and coastal shellfish. The winter fungi season begins properly.',
  },
  December: {
    season: 'Early Winter',
    intro: 'December is a coastal month. Inland, the options narrow to what grows on dead wood and what persists in the ground. The coast gives you the best shellfish of the year and seaweeds available on every low tide. If you have been putting off coastal foraging all year, stop putting it off.',
    highlights: [
      'Mussels, winkles, and cockles are in peak condition',
      'Oyster Mushroom flushes after mild, wet spells',
      'Velvet Shank continues through winter',
      'Wood Blewit is still going in mild conditions',
      'Burdock root is worth digging from first-year plants',
      'Seaweeds are available and at their cleanest',
    ],
    featured: [
      { name: 'Oyster Mushroom', slug: 'oyster-mushroom', description: 'December is as reliable a month for Oyster Mushroom (Pleurotus ostreatus) as any in the calendar. A week of wet, mild weather following colder conditions is the trigger. Inspect beech deadwood, fallen logs, and standing stumps in deciduous woodland after rain. The overlapping grey-brown fans with crowded white gills are hard to miss. Specimens in December tend to be firmer and cleaner than summer finds.' },
      { name: 'Burdock', slug: 'burdock', description: 'Burdock root (Arctium minus) is available through autumn and winter and December is a good month to dig it before the ground freezes. Find first-year plants: identifiable by very large, round leaves up to 50cm across, which have died back but left visible dead stalks. The root can reach 30–60cm in good soil. Scrub it, peel it, and roast or braise it. The flavour is earthy and lightly sweet, somewhere between parsnip and artichoke.' },
      { name: 'Laver', slug: 'laver', description: 'Laver (Porphyra umbilicalis) is available year-round on rocky coastlines but December\'s low tides and clean winter water make it a particularly good month. The fronds are thin, translucent red-purple sheets attached to rocks in the mid-to-lower intertidal zone. Collect from clean, wave-washed rock and rinse thoroughly. Slow-cooked into laverbread, dried and crumbled as a seaweed seasoning, or used in sauces.' },
    ],
    arrivingFinishing: 'Nothing of note is arriving in December. The foraging year is at its quietest point, but it is not finished. Three-cornered Leek shoots appear in mild spots from January. Scarlet Elf Cup begins in sheltered southern woodland toward the end of January. The year is already turning.',
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
          style={{ objectFit: 'cover', objectPosition: 'center center' }}
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

        {/* What's worth finding this month */}
        <section className={styles.featuredSection}>
          <h2 className={styles.sectionTitle}>What&apos;s worth finding this month</h2>
          <div className={styles.featuredList}>
            {data.featured.map((item, i) => (
              <div key={i} className={styles.featuredItem}>
                <h3 className={styles.featuredName}>
                  <Link href={`/species/${item.slug}`}>{item.name}</Link>
                </h3>
                <p className={styles.featuredDesc}>{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Arriving and finishing */}
        <section className={styles.transitionsSection}>
          <h3 className={styles.transitionsTitle}>Arriving and finishing</h3>
          <p className={styles.transitionsText}>{data.arrivingFinishing}</p>
        </section>

        {/* Species cards */}
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
