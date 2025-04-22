import { z } from 'zod';
import type { ToolFn } from '../../../types';

import { queryMovies } from '../../rag/query';

export const movieSearchToolDefinition = {
  name: 'movieSearch',
  parameters: z.object({
    query: z.string().describe('Query used to vector search on movies'),
    filters: z.object({}),

    //
    genre: z.string().describe('Filter movies by genre'),
    director: z.string().describe('Filter movies by director'),
  }),
  description:
    'Use this tool to find movies or answer questions about movies and their metadata like score, actors, director, etc.',
};

type Args = z.infer<typeof movieSearchToolDefinition.parameters>;

export const movieSearch: ToolFn<Args> = async ({ toolArgs, userMessage }) => {
  /* const { genre, director, query } = toolArgs;

  const filters = {
    ...(genre && { genre }),
    ...(director && { director }),
  }; */

  let results;

  try {
    /* results = await queryMovies({
      query,
      filters,
    }); */
    results = await queryMovies({
      query: toolArgs.query,
      filters: toolArgs.filters,
    });
  } catch (err) {
    console.error(err);
    return 'Error: Could not query the db to get movies.';
  }

  const formattedResults = results.map((result) => {
    const { metadata, data } = result;

    return { ...metadata, description: data };
  });

  return JSON.stringify(formattedResults, null, 2);
};
