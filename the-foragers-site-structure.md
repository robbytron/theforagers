# The Foragers: Full Site Structure
*Version 1.0, March 2026*

---

## Site Map

```
theforagers.co.uk/
│
├── /species                          Species Guide
│   ├── /species/[slug]               Individual species pages (180+)
│   └── /species/type/[type]          Filtered by type (Greens / Fungi / Berries etc)
│
├── /recipes                          Recipes
│   ├── /recipes/[slug]               Individual recipe pages (100 at launch)
│   ├── /recipes/preserves            Category page — preserve recipes (SEO)
│   ├── /recipes/drinks               Category page — drinks and cordials (SEO)
│   └── /recipes?filter=[...]         UI filters: season / type / species / difficulty
│
├── /calendar                         Forager's Calendar
│   └── /calendar/[month]             Individual month pages (Jan–Dec)
│
├── /guides                           Foraging How-to Guides
│   └── /guides/[slug]                Individual guides (evergreen, keyword-led)
│
├── /prepare-and-preserve             Prepare & Preserve
│   └── /prepare-and-preserve/[slug]  Individual preparation and preservation guides
│
├── /dangers                          Dangers
│   ├── /dangers/poisonous-plants     Poisonous plants of Britain
│   ├── /dangers/toxic-fungi          Toxic fungi of Britain
│   ├── /dangers/dangerous-berries    Toxic berries and fruits
│   └── /dangers/[slug]              Individual danger species pages
│
├── /where-to-forage                  Where to Forage
│   ├── /where-to-forage/[habitat]    By habitat (woodland / coastal / hedgerow etc)
│   └── /where-to-forage/[region]     By region (future phase)
│
├── /legal                            Legal Guide
│   ├── /legal/foraging-law-uk        The law explained
│   ├── /legal/land-access            Where you can and cannot forage
│   ├── /legal/protected-species      What you cannot pick
│   └── /legal/commercial-foraging    Rules for selling foraged food
│
├── /foragers-code                    The Forager's Code (standalone page)
│
├── /safety                           Safety
│   ├── /safety/identification        How to identify safely
│   ├── /safety/lookalikes            The most dangerous lookalikes in Britain
│   └── /safety/first-aid            What to do if something goes wrong
│
├── /coastal                          Coastal Foraging Hub
│   ├── /coastal/shellfish            Shellfish guide
│   ├── /coastal/seaweed              Seaweed guide
│   └── /coastal/water-quality        Water quality and safety
│
├── /beginners                        Beginners Start Here
│   ├── /beginners/first-10-species   The first ten species to learn
│   ├── /beginners/kit                What kit you need (affiliate)
│   └── /beginners/field-guides       Recommended field guides (affiliate)
│
├── /field-guides-and-kit             Field Guides & Kit (affiliate hub)
│
├── /journal                          Journal (editorial / blog)
│   ├── /journal/in-season            Category index + /journal/in-season/[slug]
│   ├── /journal/the-field            Category index + /journal/the-field/[slug]
│   ├── /journal/the-land             Category index + /journal/the-land/[slug]
│   └── /journal/wild-table           Category index + /journal/wild-table/[slug]
│
├── /about                            About
│   ├── /about/the-site               About The Foragers
│   ├── /about/our-approach           Editorial approach and safety standards
│   └── /about/expert-reviewer        About the expert reviewer
│
└── /newsletter                       Newsletter signup
```

---

## Section Briefs

---

### /species — Species Guide
**Status:** Built and working.
**Phase:** Live at launch.
**Notes:** 180 species in Airtable. iNaturalist photos loading. Lookalikes table being built by CC.

---

### /recipes — Recipes
**Status:** Template brief written. CC building.
**Phase:** Live at launch with 20 seed recipes, expand to 100.
**SEO targets:** Species-specific recipe terms. Tier 1 (winnable) first.

---

### /calendar — Forager's Calendar
**Status:** Built and working.
**Phase:** Live at launch.
**To do:** Individual month pages at /calendar/[month] for SEO. Currently one page. 12 individual pages target "what to forage in [month]" terms.

---

### /guides — Foraging How-to Guides
**Status:** Not built. Not briefed.
**Phase:** Launch.
**What it is:** Evergreen, keyword-led guides answering specific questions about foraging technique and practice. Written to rank for a target term. Every guide maps to a keyword before writing starts. Updated occasionally but never expires.

Examples: "how to identify mushrooms safely", "how to use a field guide", "how to forage responsibly", "how to forage with children", "how to tell edible from poisonous plants", "foraging and the law explained", "how to read a habitat".

**SEO approach:** Each guide targets one specific how-to question. High-intent, evergreen traffic. The foraging qualifier on most terms means limited competition from generalist sites.
**Airtable:** New table — Guides. Fields: Title, Slug, Category (Identification / Safety / Legal / Technique / Habitat), Short Description, Content, Hero Image, SEO Title, SEO Description, Status.

---

### /prepare-and-preserve — Prepare & Preserve
**Status:** Not built. Not briefed.
**Phase:** Launch.
**What it is:** Evergreen, keyword-led guides answering specific questions about preparing and preserving foraged food. Task-oriented rather than recipe-oriented. Written to rank for a target term.

Examples: "how to dry mushrooms", "how to freeze wild garlic", "how to make a tincture", "how to clean winkles", "how to process acorns", "how to salt seaweed", "how to store foraged herbs", "how to make infused oil".

Distinct from recipes — these are techniques and methods, not finished dishes. A recipe uses a preservation method. This section explains the method itself.

**SEO approach:** Same as /guides. Each page targets one specific how-to question. Good long-tail SEO value. Very low competition on most terms.
**Airtable:** New table — Preservation Guides. Fields: Title, Slug, Method Type (Drying / Freezing / Fermenting / Salting / Infusing / Bottling / Pickling / Juicing), Species (linked), Season, Short Description, Content, SEO Title, SEO Description, Status.

---

### /dangers — Dangers
**Status:** Not built. Not briefed.
**Phase:** Launch. Safety-critical — high priority.
**What it is:** A dedicated section for dangerous and toxic species. Not the same as Lookalikes sections on species pages — this is the reverse approach. Starting from the danger, not the edible. Three main pages plus individual danger species pages.

**Three hub pages:**
- Poisonous plants of Britain — covers the most dangerous plants a forager might encounter or confuse with edibles. Hemlock, Giant Hogweed, Foxglove, Deadly Nightshade, Lords and Ladies, Monkshood, Lily of the Valley.
- Toxic fungi of Britain — Death Cap, Destroying Angel, Funeral Bell, Webcaps, Yellow Stainer, False Chanterelle. The ones that kill or hospitalise people.
- Dangerous berries and fruits — Yew, Deadly Nightshade, Woody Nightshade, Cuckoo Pint, Guelder Rose (raw), Elderberry (raw), Mezereon.

**Individual danger species pages** follow the same template as species pages but inverted — identification first (so you can recognise and avoid it), then danger level, then what happens if ingested, then what to do.

**SEO targets:** "poisonous plants uk", "toxic mushrooms uk", "dangerous berries uk", "deadly mushrooms uk identification", "hemlock identification uk", "death cap mushroom uk", "poisonous berries uk"

**Important:** These pages are safety-critical. Expert review required on every single one before anything goes Live. No exceptions.

---

### /where-to-forage — Where to Forage
**Status:** Not built. Not briefed.
**Phase:** Launch (basic version). Expand by region in Phase 2.
**What it is:** Habitat-based guides to where things grow. Woodland. Hedgerow. Coastal. Upland. Urban. Each habitat page covers what grows there, what season to visit, what to look for.
**SEO targets:** "where to forage uk", "foraging in woodland uk", "coastal foraging uk", "urban foraging uk", "hedgerow foraging uk"
**Phase 2:** Regional pages — "foraging in [county]", "foraging spots [region]".

---

### /legal — Legal Guide
**Status:** Not built. Not briefed.
**Phase:** Launch.
**What it is:** The definitive plain-English guide to foraging law in Britain. Four pages.

- **The law explained** — Wildlife and Countryside Act 1981, the right to pick, what "personal use" means, the difference between picking and uprooting.
- **Land access** — Public land, private land, National Parks, SSSIs, Crown land, MOD land. What you can do where.
- **Protected species** — Schedule 8 plants. Species you cannot pick under any circumstances.
- **Commercial foraging** — Selling foraged food, food hygiene regulations, what changes when foraging is commercial rather than personal.

**SEO targets:** "is foraging legal uk" (70 searches, KD 6), "foraging laws uk", "can you forage in national parks uk", "foraging on private land uk", "selling foraged food uk"

**Note:** "Is foraging legal uk" has KD 6 — very winnable. This page should rank quickly.

---

### /foragers-code — The Forager's Code
**Status:** Not built. Not briefed.
**Phase:** Launch. Referenced from every section of the site.
**What it is:** A single standalone page. The Foragers' own version of the foraging code — not a copy of existing codes, written in our voice.

**Standard principles to cover:**
- Take only what you need
- Never uproot without permission
- Leave enough for wildlife
- Never strip a patch bare
- Know what you're picking before you pick it
- Stay on paths where asked
- Get permission on private land
- Wash everything before eating

**The opportunity:** Write it well and it becomes a citable resource. Other sites link to it. It builds authority and backlinks organically.

**SEO targets:** "forager's code uk", "foraging code of conduct uk", "responsible foraging uk"

---

### /safety — Safety
**Status:** Partially exists (Beginners guide has some safety content).
**Phase:** Launch. Separate from /avoid — this is about safe practice, not dangerous species.
**What it is:** Three pages on how to forage safely.

- **Identification** — How to be certain before you eat anything. Using field guides. Cross-referencing. The rule of three (three independent identification features). When not to pick.
- **The most dangerous lookalikes** — A curated list of the most commonly confused pairs in Britain. Links out to both the edible species page and the relevant /avoid page.
- **First aid** — What to do if you think you've eaten something toxic. Symptoms to watch for. When to call 999. Poison Control details.

**Important:** First aid page must be reviewed by a medical professional as well as the expert forager, before going Live.

---

### /coastal — Coastal Foraging Hub
**Status:** Coastal species exist in the species guide but no hub page.
**Phase:** Launch (hub page). Expand in Phase 2.
**What it is:** Coastal foraging is distinct enough — different legal framework, biotoxin risks, tidal awareness, water quality — to warrant its own hub. Not a replacement for species pages but a gateway and safety primer for coastal foragers.

**Three pages:**
- **Shellfish** — How to forage shellfish safely. Water quality checks. Biotoxin risks. Which shellfish and when. Links to winkle, mussel, cockle species pages.
- **Seaweed** — Introduction to foraging seaweed. Identification basics. Links to dulse, laver, sea lettuce, bladderwrack pages.
- **Water quality** — The single most important safety issue in coastal foraging. How to check water quality classifications. What to avoid after heavy rain. Official sources to check before picking.

**SEO targets:** "coastal foraging uk", "foraging shellfish uk", "seaweed foraging uk", "is it safe to eat foraged mussels uk"

---

### /beginners — Beginners Start Here
**Status:** Built and working.
**Phase:** Live at launch. Expand to include Kit and Field Guides sub-pages.
**To do:** Add /beginners/kit and /beginners/field-guides as affiliate pages.

---

### /field-guides-and-kit — Field Guides & Kit
**Status:** Not built.
**Phase:** Launch (basic version).
**What it is:** Curated affiliate page. Not a generic Amazon link dump — a proper editorial recommendation page. The field guides we actually trust. The kit worth buying.

**Categories:**
- Field guides — plants, fungi, seaweeds, coastal. Best UK-specific titles.
- Kit — bags, knives, containers, gloves, hand lens
- Cookbooks — wild food cookbooks worth owning

**Affiliate approach:** Amazon Associates. Links clearly marked as affiliate. No undisclosed commercial relationships.

---

### /journal — Journal
**Status:** Not built. Not briefed.
**Phase:** Launch with a handful of pieces. Ongoing indefinitely.
**What it is:** Editorial content. Brand-building, not keyword-targeting. Written to be good first, optimised lightly second.

This is explicitly different from /guides and /preserve. Those sections answer questions people are actively searching for. The journal creates interest rather than satisfying existing demand. The SEO benefit comes indirectly — through links, shares, time-on-site, and brand recognition — not from ranking for a specific term.

**Four categories:**

**In Season** (`/journal/in-season/[slug]`)
Monthly dispatches tied to what is happening right now. The state of the hedgerows. The first wild garlic of the year. What October looks like in the woods. Semi-evergreen — updated each year rather than discarded. One piece per month as a minimum.

**The Field** (`/journal/the-field/[slug]`)
Field notes, walks, specific places and habitats. Personal and particular — a two-hour walk in the Cairngorms, a favourite woodland in March, what a specific stretch of coastline yields in September. The experience of being out rather than the technique of foraging.

**The Land** (`/journal/the-land/[slug]`)
Wider nature and outdoors writing. Less foraging-specific. The broader world the site exists in — seasons, habitats, wildlife, landscape. The kind of piece that belongs here whether or not it mentions something edible.

**Wild Table** (`/journal/wild-table/[slug]`)
Editorial food writing. The culture and pleasure of eating wild food. Seasonality on the plate. What a glut of blackberries means. Why chanterelles on toast is the best thing about autumn. Ingredient stories and food moments. Never a recipe — the method lives in /recipes. This is the story around it.

**What the journal is not:**
A how-to guide. A species entry. A recipe. A legal explainer. Those have their own homes. The journal is where the voice of the site lives most freely.

**SEO applied lightly:**
Good titles, sensible structure, natural use of relevant terms. No keyword mapping before writing. No target term per piece. Written from interest and instinct, not from a research brief. The In Season category is the partial exception — "what to forage in [month]" has real search volume and those pieces can be written with that in mind without compromising the editorial tone.

**Airtable:** New table — Journal. Fields: Title, Slug, Category (In Season / The Field / The Land / Wild Table), Short Description, Content, Hero Image, Published Date, SEO Title, SEO Description, Status.

**Publishing cadence:** Quality over frequency. One good piece a month is better than four thin ones. In Season provides the monthly anchor. Everything else follows when it's ready.

---

### /about — About
**Status:** Not built.
**Phase:** Launch. Important for EEAT (Google's Experience, Expertise, Authority, Trust signals).
**What it is:** Three pages.

- **About The Foragers** — What the site is, who it's for, why it exists. Written in brand voice. Not a founder story — a mission statement.
- **Our approach** — How content is written, how it's reviewed, the safety standard we hold everything to. This is the EEAT page. Specifically mentions the expert reviewer and the review process. Links to the Expert Reviewer page.
- **Expert Reviewer** — A page about your forager friend. Their credentials, experience, what they review and how. Named, photographed if possible. This matters for Google's quality signals on safety-critical content.

---

### /newsletter — Newsletter
**Status:** Not built.
**Phase:** Launch.
**What it is:** Signup page plus a signup component that appears in the footer and at the bottom of species pages, recipe pages, and calendar pages.
**Tool:** Mailchimp or similar. Weekly automated roundup of what's in season.

---

## Priority Order for Building

### Must be live at launch:
1. /dangers — safety-critical, high SEO value, expert review on everything
2. /foragers-code — referenced everywhere, short to build
3. /legal — winnable SEO term, relatively short content
4. /safety — safety-critical
5. /guides — evergreen how-to content, keyword-led
6. /prepare-and-preserve — evergreen preparation content, keyword-led
7. /coastal — hub page only, links to existing species pages
8. /calendar/[month] — 12 individual month pages for SEO
9. /about — EEAT signals, trust building on a safety-critical site

### Build early (Phase 2):
10. /journal — start with a handful of pieces, ongoing from there
11. /where-to-forage — habitat pages first, regional later
12. /field-guides-and-kit — affiliate revenue
13. /newsletter — email list building

### Phase 3:
14. /where-to-forage/[region] — regional pages
15. Community features (Finds feed, Submit a Find)

---

## New Airtable Tables Needed

| Table | For section | Priority |
|---|---|---|
| Danger Species | /avoid | Launch — safety critical |
| Guides | /guides | Launch |
| Prepare & Preserve Guides | /prepare-and-preserve | Launch |
| Journal | /journal | Launch |
| Kit & Guides | /field-guides-and-kit | Phase 2 |

---

## Filters and Categories

### Where category URLs exist (SEO value)
These sections have standalone category pages with their own URLs, indexable by search engines:

| Section | Category URLs |
|---|---|
| Recipes | /recipes/preserves, /recipes/drinks |
| Journal | /journal/in-season, /journal/the-field, /journal/the-land, /journal/wild-table |

### Where UI filters exist (no separate URLs)
These sections have filters in the interface only — no separate category pages:

| Section | Filter options |
|---|---|
| Recipes | Season (month), Type (preserve / drink / savoury / sweet), Species, Difficulty |
| Prepare & Preserve | Method (drying / freezing / fermenting / pickling / infusing), Species |
| Guides | Topic (identification / safety / legal / technique / habitat) |
| Field Guides & Kit | Type (field guides / equipment / cookbooks) |
| Species | Already has filters — season / habitat / difficulty / type |

### No filters needed
Dangers, Legal, Safety, Coastal, Foraging with Children, Where to Forage, About, Forager's Code — these are structured by their page hierarchy, not filters.

---

## Navigation Structure

**Primary nav (desktop):**
In Season — Species — Calendar — Recipes — Where to Forage — Beginners

**Secondary nav / footer:**
Safety — Things to Avoid — Legal — The Forager's Code — Preserve & Process — Coastal — Field Guides & Kit — Journal — About — Newsletter

**Mobile:** Hamburger menu with primary nav items only. Secondary nav in footer.

---

*Review this structure before building any new sections. URL decisions made now affect everything downstream.*
