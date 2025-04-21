import 'dotenv/config';

import type { Score, Scorer } from 'autoevals';
import chalk from 'chalk';

import { JSONFilePreset } from 'lowdb/node';

type Run = {
  input: any;
  output: any;
  expected: any;
  scores: {
    name: Score['name']; // string
    score: Score['score']; // number | null
  }[];
  createdAt?: string;
};

type Set = {
  runs: Run[];
  score: number;
  createdAt: string;
};

type Experiment = {
  name: string;
  sets: Set[];
};

type Data = {
  experiments: Experiment[];
};

const defaultData: Data = {
  experiments: [],
};

const getDb = async () => {
  const db = await JSONFilePreset<Data>('results.json', defaultData);
  return db;
};

const calculateAvgScore = (runs: Run[]) => {
  const totalScores = runs.reduce((acc_sum, run) => {
    const runAvg =
      run.scores.reduce((acc_su, score) => {
        return acc_su + (score.score !== null ? score.score : 0);
      }, 0) / run.scores.length;

    return acc_sum + runAvg;
  }, 0);

  return totalScores / runs.length;
};

export const loadExperiment = async (
  experimentName: string
): Promise<Experiment | undefined> => {
  const db = await getDb();

  return db.data.experiments.find((exper) => exper.name === experimentName);
};

export const saveSet = async (
  experimentName: string,
  runs: Omit<Run, 'createdAt'>[]
) => {
  const db = await getDb();

  const runsWithTimeStamp = runs.map((run) => ({
    ...run,
    createdAt: new Date().toISOString(),
  }));

  const newSet = {
    runs: runsWithTimeStamp,
    score: calculateAvgScore(runsWithTimeStamp),
    createdAt: new Date().toISOString(),
  };

  const existingExperiment = db.data.experiments.find(
    (exper) => exper.name === experimentName
  );

  if (existingExperiment) {
    existingExperiment.sets.push(newSet);
  } else {
    db.data.experiments.push({
      name: experimentName,
      sets: [newSet],
    });
  }

  await db.write();
};

export const runEval = async <T = any>(
  experimentName: string,
  {
    data,
    task,
    scorers,
  }: {
    task: (input: any) => Promise<T>;
    data: { input: any; expected?: T; reference?: string | string[] }[];
    scorers: Scorer<T, any>[];
  }
) => {
  const results = await Promise.all(
    data.map(async ({ input, expected, reference }) => {
      const rslts = await task(input);

      let context: string | string[];
      let output: string;

      // @ts-expect-error rslts
      if (rslts.context) {
        // @ts-expect-error rslts
        context = rslts.context;
        // @ts-expect-error rslts
        output = rslts.response;
      } else {
        // @ts-expect-error rslts
        output = rslts;
      }

      const scores = await Promise.all(
        scorers.map(async (scorer) => {
          const score = await scorer({
            input,
            output: rslts,
            expected,
            reference,
            context,
          });

          return {
            name: scorer.name,
            score: score.score,
          };
        })
      );

      const result = {
        input,
        output,
        expected,
        scores,
      };

      return result;
    })
  );

  const previousExperiment = await loadExperiment(experimentName);

  const previousScore =
    previousExperiment?.sets[previousExperiment.sets.length - 1]?.score || 0;

  const currentScore = calculateAvgScore(results);

  const scoreDiff = currentScore - previousScore;

  const color = previousExperiment
    ? scoreDiff > 0
      ? chalk.green
      : scoreDiff < 0
      ? chalk.red
      : chalk.blue
    : chalk.blue;

  console.log(`Experiment: ${experimentName}`);
  console.log(`Previous score: ${color(previousScore.toFixed(2))}`);
  console.log(`Current score: ${color(currentScore.toFixed(2))}`);
  console.log(
    `Difference: ${scoreDiff > 0 ? '+' : ''}${color(scoreDiff.toFixed(2))}`
  );

  await saveSet(experimentName, results);

  return results;
};
