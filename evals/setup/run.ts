import 'dotenv/config';

import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readdir } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const main = async () => {
  const evalName = process.argv[2];
  const experimentDir = join(__dirname, 'experiments');

  try {
    if (evalName) {
      const evalPath = join(experimentDir, `${evalName}.eval.ts`);
      await import(evalPath);
    } else {
      const files = await readdir(experimentDir);
      const evalFiles = files.filter((file) => file.endsWith('.eval.ts'));

      for (const eFile of evalFiles) {
        const ePath = join(experimentDir, eFile);
        await import(ePath);
      }
    }
  } catch (err) {
    console.error(
      `Failed to run eval${evalName ? ` '${evalName}'` : 's'}:`,
      err
    );
    process.exit(1);
  }
};

main();
