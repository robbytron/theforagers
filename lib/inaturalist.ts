import type { INatObservation, SpeciesPhoto, Species } from '@/types';

const INAT_API = 'https://api.inaturalist.org/v1';

function resizeINatUrl(url: string, size: 'small' | 'medium' | 'large'): string {
  return url.replace(/\/square\.|\/small\.|\/medium\.|\/large\.|\/original\./, `/${size}.`);
}

export async function getINatPhotos(taxonId: number, limit = 8): Promise<SpeciesPhoto[]> {
  const params = new URLSearchParams({
    taxon_id:      String(taxonId),
    quality_grade: 'research',
    per_page:      String(limit * 3), // fetch extra to account for NC filtering
    order:         'desc',
    order_by:      'votes',
    photos:        'true',
  });

  const res = await fetch(`${INAT_API}/observations?${params}`, { next: { revalidate: 86400 } });
  if (!res.ok) return [];

  const data: { results: INatObservation[] } = await res.json();
  const photos: SpeciesPhoto[] = [];

  for (const obs of data.results) {
    for (const photo of obs.photos) {
      // Enforce CC-BY only — no NC licenses (affiliate links = commercial use)
      if (!photo.license_code) continue;
      if (photo.license_code.includes('nc')) continue;
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

export async function resolveSpeciesPhotos(species: Species): Promise<SpeciesPhoto[]> {
  const airtablePhotos: SpeciesPhoto[] = [
    ...(species.heroImage ? [{
      url:         species.heroImage.url,
      thumbUrl:    species.heroImage.thumbnails?.large?.url ?? species.heroImage.url,
      attribution: species.heroImage.filename,
      license:     'CC-BY',
      source:      'airtable' as const,
    }] : []),
    ...species.additionalImages.map(att => ({
      url:         att.url,
      thumbUrl:    att.thumbnails?.large?.url ?? att.url,
      attribution: att.filename,
      license:     'CC-BY',
      source:      'airtable' as const,
    })),
  ];

  if (species.hideApiPhotos || !species.iNaturalistTaxonId) return airtablePhotos;

  const needed     = Math.max(0, 6 - airtablePhotos.length);
  const inatPhotos = needed > 0 ? await getINatPhotos(species.iNaturalistTaxonId, needed + 2) : [];
  const hero       = airtablePhotos.slice(0, 1);
  const additional = airtablePhotos.slice(1);

  return [...hero, ...inatPhotos.slice(0, needed), ...additional];
}