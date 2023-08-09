import { createJsonForAuthorsAndPosts } from "./src/api/get-posts-category";
import { createImage } from "./src/api/make-fig";

async function run() {
  // await createJsonForAuthorsAndPosts();
  await createImage();
}

run();
