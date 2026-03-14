import Image from 'next/image';
import type { Lookalike, SpeciesPhoto, DangerLevel } from '@/types';
import { getFirstINatPhoto } from '@/lib/inaturalist';
import styles from './LookalikeComparison.module.css';

interface Props {
  speciesName: string;
  speciesPhoto: SpeciesPhoto | null;
  lookalikes: Lookalike[];
}

const dangerColors: Record<DangerLevel, string> = {
  Deadly:   'tag-deadly',
  Toxic:    'tag-caution',
  Inedible: 'tag-inedible',
  Caution:  'tag-season',
};

async function resolveLookalikePhoto(lookalike: Lookalike): Promise<SpeciesPhoto | null> {
  // Hero Image Override takes priority
  if (lookalike.heroImageOverride) {
    return {
      url:         lookalike.heroImageOverride.url,
      thumbUrl:    lookalike.heroImageOverride.thumbnails?.large?.url ?? lookalike.heroImageOverride.url,
      attribution: lookalike.heroImageOverride.filename,
      license:     'CC-BY',
      source:      'airtable',
    };
  }

  // Fall back to iNaturalist
  if (lookalike.iNaturalistTaxonId) {
    return await getFirstINatPhoto(lookalike.iNaturalistTaxonId);
  }

  return null;
}

export default async function LookalikeComparison({ speciesName, speciesPhoto, lookalikes }: Props) {
  if (lookalikes.length === 0) return null;

  // Resolve photos for all lookalikes
  const lookalikesWithPhotos = await Promise.all(
    lookalikes.map(async (l) => ({
      ...l,
      photo: await resolveLookalikePhoto(l),
    }))
  );

  return (
    <section className={styles.section}>
      <h2 className={styles.head}>Visual comparison</h2>
      <p className={styles.intro}>
        Compare {speciesName} with its dangerous lookalikes. Study these differences carefully before foraging.
      </p>

      <div className={styles.comparisons}>
        {lookalikesWithPhotos.map((lookalike) => (
          <div key={lookalike.id} className={styles.comparison}>
            <div className={styles.photos}>
              <div className={styles.photoCard}>
                <div className={styles.photoWrap}>
                  {speciesPhoto ? (
                    <Image
                      src={speciesPhoto.url}
                      alt={speciesName}
                      fill
                      sizes="(max-width: 640px) 50vw, 280px"
                      className={styles.photo}
                    />
                  ) : (
                    <div className={styles.placeholder} />
                  )}
                </div>
                <p className={styles.photoLabel}>
                  <span className={styles.safe}>Safe</span>
                  {speciesName}
                </p>
              </div>

              <div className={styles.vs}>vs</div>

              <div className={styles.photoCard}>
                <div className={styles.photoWrap}>
                  {lookalike.photo ? (
                    <Image
                      src={lookalike.photo.url}
                      alt={lookalike.name}
                      fill
                      sizes="(max-width: 640px) 50vw, 280px"
                      className={styles.photo}
                    />
                  ) : (
                    <div className={styles.placeholder} />
                  )}
                </div>
                <p className={styles.photoLabel}>
                  <span className={`${styles.danger} ${styles[lookalike.dangerLevel.toLowerCase()]}`}>
                    {lookalike.dangerLevel}
                  </span>
                  {lookalike.name}
                </p>
              </div>
            </div>

            <div className={styles.details}>
              <div className={styles.nameRow}>
                <h3 className={styles.name}>{lookalike.name}</h3>
                <span className={`tag ${dangerColors[lookalike.dangerLevel]}`}>
                  {lookalike.dangerLevel}
                </span>
              </div>
              <p className={styles.latin}>{lookalike.latinName}</p>
              {lookalike.howToTellApart && (
                <div className={styles.tellApart}>
                  <h4 className={styles.tellApartHead}>How to tell apart:</h4>
                  <p className={styles.tellApartText}>{lookalike.howToTellApart}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
