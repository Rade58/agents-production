import { z } from 'zod';
import got from 'got';

import type { ToolFn } from '../../../types';

export const redditToolDeffinition = {
  name: 'reddit',
  parameters: z.object({}),
  description: 'Get the latest posts from Reddit.',
};

type Args = z.infer<typeof redditToolDeffinition.parameters>;

export const redditTool: ToolFn<Args, string> = async (
  {
    // toolArgs,
    // userMessage,
  }
) => {
  // const data = await got.get('https://www.reddit.com/r/AskReddit/hot.json').json();
  const data = await got.get('https://www.reddit.com/r/nba/.json').json();

  const relevantInfo = (data as any).data.children.map((child: any) => {
    return {
      title: child.data.title,
      url: child.data.url,
      subreddit: child.data.subreddit_name_prefixed,
      author: child.data.author,
      upvotes: child.data.ups,
      // comments: child.data.num_comments,
      // created_at: child.data.created_utc,
      // thumbnail: child.data.thumbnail,
      // image: child.data.url_overridden_by_dest,
    };
  });

  return JSON.stringify(relevantInfo, null, 2);
};
