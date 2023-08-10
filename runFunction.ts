import { createJsonForAuthorsAndPosts } from "./src/pages/api/get-posts-category";
// import { createImage } from "./src/pages/api/make-fig";
import { createRssFeed } from "./src/pages/api/rss";
import { createSitemap } from "./src/pages/api/sitemap";

async function run() {
  await createJsonForAuthorsAndPosts();
  // await createImage();
  await createRssFeed();
  await createSitemap();
}

run();
