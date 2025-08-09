import express from 'express';
import { Feed } from 'feed';

const app = express();
const PORT = 3000;

app.get('/rss', (req, res) => {
  const feed = new Feed({
    title: 'My FeedReader Feed',
    description: 'This is a test RSS feed',
    id: 'http://localhost:3000/',
    link: 'http://localhost:3000/',
    language: 'en',
    favicon: 'http://localhost:3000/favicon.ico',
    updated: new Date(),
    author: {
      name: 'Feed Server',
      email: 'admin@example.com',
      link: 'http://localhost:3000',
    },
    copyright: "none"
  });

  // Add items to the feed
  feed.addItem({
    title: 'First Article',
    id: 'http://localhost:3000/posts/1',
    link: 'http://localhost:3000/posts/1',
    description: 'This is the first post',
    date: new Date(),
  });

  // Output the RSS feed
  res.set('Content-Type', 'application/rss+xml');
  res.send(feed.rss2());
});

app.listen(PORT, () => {
  console.log(`Feed server is running at http://localhost:${PORT}/rss`);
});
