import { Index as UpstashIndex } from '@upstash/vector';

const index = new UpstashIndex();

// index.namespace('<namespace>').query(..; // would do this in real world project

type MovieMetadata = {
  title?: string;
  genre?: string;
  actors?: string;
  director?: string;
  year?: number;
  rating?: number;
  votes?: number;
  revenue?: number;
  metascore?: number;
};

type Movie = {};

export const queryMovies = async ({
  query,
  filters,
  topK = 5,
}: {
  query: string;
  filters?: Partial<MovieMetadata>;
  topK?: number;
}) => {
  // build filter string if filters are provided

  // may not work with this
  /* let filterStr = '';

  if (filters) {
    const filterParts = Object.entries(filters)
      .filter(([key, value]) => value !== undefined)
      .map(([key, value]) => `${key}=${value}`);
    if (filterParts.length > 0) {
      filterStr = filterParts.join(' AND');
    }
  } */

  // query the vector store
  const results = await index.query({
    data: query,
    topK,
    includeMetadata: true,
    includeData: true,
    // filter: filterStr || undefined,
  });

  return results;
};
