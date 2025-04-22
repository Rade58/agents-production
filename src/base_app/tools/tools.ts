import { dadJokeTool, dadJokeToolDeffinition } from './dadJoke';
import { generateImage, generateImageToolDeffinition } from './generateImage';
import { redditTool, redditToolDeffinition } from './reddit';
//
import {
  movieSearchToolDefinition,
  movieSearch,
} from '../new_tools/movieSearch';
//
export const tools = {
  dadJokeTool,
  generateImage,
  redditTool,

  movieSearch,
};

export const toolsDEffinitionsList = [
  dadJokeToolDeffinition,
  generateImageToolDeffinition,
  redditToolDeffinition,

  movieSearchToolDefinition,
];

export const toolDefinitions = {
  dadJokeToolDeffinition,
  generateImageToolDeffinition,
  redditToolDeffinition,

  movieSearchToolDefinition,
};
