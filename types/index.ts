export type SpeciesType = 'Greens' | 'Fungi' | 'Berries' | 'Nuts' | 'Roots' | 'Coastal' | 'Flowers';
export type SpeciesDifficulty = 'Beginner' | 'Intermediate' | 'Expert Only';
export type SpeciesStatus = 'Draft' | 'In Review' | 'Live' | 'Hidden';
export type Month = 'January' | 'February' | 'March' | 'April' | 'May' | 'June' | 'July' | 'August' | 'September' | 'October' | 'November' | 'December';

export interface AirtableAttachment {
  id: string;
  url: string;
  filename: string;
  width?: number;
  height?: number;
  thumbnails?: {
    small?: { url: string; width: number; height: number };
    large?: { url: string; width: number; height: number };
    full?:  { url: string; width: number; height: number };
  };
}

export interface AirtableSpeciesFields {
  'Species Name':          string;
  'Latin Name':            string;
  'Slug':                  string;
  'Type':                  SpeciesType;
  'Difficulty':            SpeciesDifficulty;
  'Status':                SpeciesStatus;
  'Short Description':     string;
  'Full Description':      string;
  'Identification Notes':  string;
  'Lookalikes & Dangers':  string;
  'Habitat':               string;
  'Culinary Uses':         string;
  'Legal Notes':           string;
  'iNaturalist Taxon ID':  number;
  'Hero Image':            AirtableAttachment[];
  'Additional Images':     AirtableAttachment[];
  'Hide API Photos':       boolean;
  'Expert Reviewed':       boolean;
  'Reviewer Notes':        string;
  'SEO Title':             string;
  'SEO Description':       string;
  'Last Updated':          string;
  'Seasons':               Month[];
  'Habitats':              string[];
  'iNaturalist Hero URL':  string;
}

export interface FAQ {
  q: string;
  a: string;
}

export interface Species {
  id:                   string;
  name:                 string;
  latinName:            string;
  slug:                 string;
  type:                 SpeciesType;
  difficulty:           SpeciesDifficulty;
  status:               SpeciesStatus;
  shortDescription:     string;
  fullDescription:      string;
  identificationNotes:  string;
  lookalikesAndDangers: string;
  habitat:              string;
  culinaryUses:         string;
  legalNotes:           string;
  iNaturalistTaxonId:   number | null;
  iNaturalistHeroUrl:   string | null;
  heroImage:            AirtableAttachment | null;
  additionalImages:     AirtableAttachment[];
  hideApiPhotos:        boolean;
  expertReviewed:       boolean;
  reviewerNotes:        string;
  seoTitle:             string;
  seoDescription:       string;
  lastUpdated:          string;
  seasons:              Month[];
  photos:               SpeciesPhoto[];
  faqs:                 FAQ[];
}

export interface SpeciesPhoto {
  url:         string;
  thumbUrl:    string;
  attribution: string;
  license:     string;
  source:      'airtable' | 'inaturalist';
  width?:      number;
  height?:     number;
}

export interface INatPhoto {
  id:           number;
  url:          string;
  attribution:  string;
  license_code: string;
}

export interface INatObservation {
  id:            number;
  photos:        INatPhoto[];
  quality_grade: string;
  place_guess:   string;
}

export type DangerLevel = 'Deadly' | 'Toxic' | 'Inedible' | 'Caution';

export type RecipeDifficulty = 'Easy' | 'Medium' | 'Involved';
export type RecipeStatus = 'Draft' | 'Live';
export type RecipeCategory = 'Savoury' | 'Sweet' | 'Preserve' | 'Drink';

export interface Recipe {
  id:               string;
  name:             string;
  slug:             string;
  category:         RecipeCategory;
  season:           Month[];
  shortDescription: string;
  intro:            string;
  difficulty:       RecipeDifficulty;
  prepTime:         string;
  cookTime:         string;
  servings:         string;
  ingredients:      string;
  method:           string;
  notes:            string;
  image:            AirtableAttachment | null;
  status:           RecipeStatus;
  seoTitle:         string;
  seoDescription:   string;
  speciesIds:       string[];
}

export interface Lookalike {
  id:                  string;
  name:                string;
  latinName:           string;
  iNaturalistTaxonId:  number | null;
  dangerLevel:         DangerLevel;
  howToTellApart:      string;
  speciesIds:          string[];
  heroImageOverride:   AirtableAttachment | null;
  expertReviewed:      boolean;
  reviewerNotes:       string;
  photo:               SpeciesPhoto | null;
}

export type DangerCategory = 'Plants' | 'Fungi' | 'Berries';
export type DangerSpeciesStatus = 'Draft' | 'Live';

// Homepage Features
export type FeatureContentType = 'Species' | 'Recipe' | 'Journal' | 'Danger' | 'Custom';

// Journal
export type JournalCategory = 'In Season' | 'The Field' | 'The Land' | 'Wild Table';
export type JournalStatus = 'Draft' | 'Live';

export interface JournalEntry {
  id:               string;
  title:            string;
  slug:             string;
  category:         JournalCategory;
  publishDate:      string;
  excerpt:          string;
  body:             string;
  heroImage:        AirtableAttachment | null;
  status:           JournalStatus;
  seoTitle:         string;
  seoDescription:   string;
  speciesIds:       string[];
}
export type FeatureSection = 'Hero' | 'Latest' | 'Featured';

export interface HomepageFeature {
  id:          string;
  title:       string;
  contentType: FeatureContentType;
  slug:        string;
  section:     FeatureSection;
  order:       number;
  active:      boolean;
  image:       AirtableAttachment | null;
  description: string;
  customUrl:   string | null;
  badge:       string | null;
}

export interface DangerSpecies {
  id:                   string;
  name:                 string;
  latinName:            string;
  slug:                 string;
  dangerLevel:          DangerLevel;
  category:             DangerCategory;
  status:               DangerSpeciesStatus;
  shortDescription:     string;
  fullDescription:      string;
  identificationNotes:  string;
  confusedWith:         string;
  symptoms:             string;
  firstAid:             string;
  habitat:              string;
  iNaturalistTaxonId:   number | null;
  heroImage:            AirtableAttachment | null;
  additionalImages:     AirtableAttachment[];
  photos:               SpeciesPhoto[];
}
