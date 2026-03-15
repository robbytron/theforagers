import type { INatObservation, SpeciesPhoto, Species } from '@/types';

const INAT_API = 'https://api.inaturalist.org/v1';

function resizeINatUrl(url: string, size: 'small' | 'medium' | 'large'): string {
  return url.replace(/\/square\.|\/small\.|\/medium\.|\/large\.|\/original\./, `/${size}.`);
}

export async function getINatPhotos(taxonId: number, limit = 10): Promise<SpeciesPhoto[]> {
  // Filter by license in API call - cc0 only (public domain, no attribution required)
  const params = new URLSearchParams({
    taxon_id:      String(taxonId),
    quality_grade: 'research',
    per_page:      String(limit * 2),
    order:         'desc',
    order_by:      'votes',
    photos:        'true',
    photo_license: 'cc0',
  });

  const res = await fetch(`${INAT_API}/observations?${params}`, { next: { revalidate: 86400 } });
  if (!res.ok) return [];

  const data: { results: INatObservation[] } = await res.json();
  const photos: SpeciesPhoto[] = [];

  for (const obs of data.results) {
    for (const photo of obs.photos) {
      // Double-check license - only cc0 (public domain)
      if (photo.license_code !== 'cc0') continue;
      photos.push({
        url:         resizeINatUrl(photo.url, 'large'),
        thumbUrl:    resizeINatUrl(photo.url, 'small'),
        attribution: photo.attribution,
        license:     photo.license_code.toUpperCase(),
        source:      'inaturalist',
      });
      if (photos.length >= limit) break;
    }
    if (photos.length >= limit) break;
  }
  return photos;
}

export async function getFirstINatPhoto(taxonId: number): Promise<SpeciesPhoto | null> {
  const photos = await getINatPhotos(taxonId, 1);
  return photos[0] ?? null;
}

export async function resolveSpeciesPhotos(species: Species): Promise<SpeciesPhoto[]> {
  // Use cached iNaturalist hero URL if no Airtable hero image
  let heroPhoto: SpeciesPhoto | null = null;

  if (species.heroImage) {
    heroPhoto = {
      url:         species.heroImage.url,
      thumbUrl:    species.heroImage.thumbnails?.large?.url ?? species.heroImage.url,
      attribution: species.heroImage.filename,
      license:     'CC-BY',
      source:      'airtable' as const,
    };
  } else if (species.iNaturalistHeroUrl) {
    heroPhoto = {
      url:         species.iNaturalistHeroUrl,
      thumbUrl:    resizeINatUrl(species.iNaturalistHeroUrl, 'small'),
      attribution: 'iNaturalist',
      license:     'CC-BY',
      source:      'inaturalist' as const,
    };
  }

  const additionalPhotos: SpeciesPhoto[] = species.additionalImages.map(att => ({
    url:         att.url,
    thumbUrl:    att.thumbnails?.large?.url ?? att.url,
    attribution: att.filename,
    license:     'CC-BY',
    source:      'airtable' as const,
  }));

  const allPhotos = heroPhoto ? [heroPhoto, ...additionalPhotos] : additionalPhotos;

  if (species.hideApiPhotos || !species.iNaturalistTaxonId) return allPhotos;

  const needed = Math.max(0, 10 - allPhotos.length);
  const inatPhotos = needed > 0 ? await getINatPhotos(species.iNaturalistTaxonId, needed) : [];

  return [...allPhotos, ...inatPhotos];
}