import 'dotenv/config';
import { Index as UpstashIndex } from '@upstash/vector';
import { parse } from 'csv-parse/sync';
import fs from 'node:fs';
import path from 'node:path';
import ora from 'ora';

const index = new UpstashIndex();

const indexMovieData = async () => {
  const spinner = ora('Rading movie data...').start();

  const moviesPath = path.join(process.cwd(), 'src/rag/imdb_movie_dataset.csv');

  const csvData = fs.readFileSync(moviesPath, 'utf-8');

  const records = parse(csvData, {
    columns: true,
    skip_empty_lines: true,
  });

  spinner.text = 'Starting movie indexing...';

  for (const record of records) {
    spinner.text = `Indexing movie${record.Title}...`;

    const text = `${record.Title}. ${record.Genre}. ${record.Description}`;

    try {
      await index.upsert({
        id: record.Title, // using Rank as a unique ID
        data: text, // Text will be automatically embedded
        metadata: {
          title: record.Title,
          genre: record.Genre,
          actors: record.Actors,
          director: record.Director,
          year: Number(record.Year),
          rating: Number(record.Rating),
          votes: Number(record.Votes),
          revenue: Number(record.Revenue),
          metascore: Number(record.Metascore),
        },
      });
    } catch (err) {
      //
      spinner.fail(`Error indexing movie ${record.Title}`);
      console.error(err);
    }
  }

  spinner.succeed('All movies indexed');
};

indexMovieData();
