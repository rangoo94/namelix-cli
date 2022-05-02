import got from 'got';

export enum NameRandomness {
  low = 'low',
  medium = 'medium',
  high = 'high',
}

export enum NameStyle {
  brandable = 'brandable',
  nonEnglish = 'nonenglish',
  twoWords = 'multiword',
  alternateSpelling = 'spelling',
  compoundWords = 'compound',
  realWords = 'dictionary',
}

interface GetNamesPageOptions {
  style: NameStyle;
  randomness: NameRandomness;
  maxLength?: number;
}

export interface GetNamesOptions extends GetNamesPageOptions {
  limit?: number;
  onNext: (name: string) => void;
}

const noop = () => {};

async function loadPage(keywords: string[], page: number, seed: number, options?: Partial<GetNamesOptions>): Promise<string[]> {
  const { body } = await got.post('https://namelix.com/app/load4.php', {
    form: {
      // Configuration
      keywords: keywords.join(' '),
      max_length: options?.maxLength ?? 30,
      style: options?.style ?? NameStyle.brandable,
      random: options?.randomness ?? NameRandomness.medium,
      page,
      seed,

      // Static
      blacklist: '',
      extensions: [ 'com' ],
      require_domains: false,
      premium_index: 20,
      num: 10,
    },
  });
  if (body === 'error') {
    throw new Error('Something went wrong with this query. Please try to modify your criteria.');
  }
  return JSON.parse(body).map((x: any) => x.title.toLowerCase().replace(/\..+$/, ''));
}

export async function getNames(keywords: string[], options?: Partial<GetNamesOptions>): Promise<string[]> {
  // Configure
  const onNext = options?.onNext ?? noop;
  const limit = options?.limit ?? 5000;
  const seed = Math.round(Math.random() * 1e9);

  // Set-up state
  const results: string[] = [];
  let page = 0;

  while (results.length < limit) {
    // Load next page and filter unique names
    const next = (await loadPage(keywords, page++, seed, options))
      .filter((x) => !results.includes(x))
      .slice(0, limit - results.length);
    results.push(...next);

    // Stop if there is no new names - most likely nothing more will be found
    if (next.length === 0) {
      break;
    }

    // Emit immediate information about newly found names
    for (const name of next) {
      onNext(name);
    }
  }

  return results;
}
