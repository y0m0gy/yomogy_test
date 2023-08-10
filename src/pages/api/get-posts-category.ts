import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {
  Post,
  ListCount,
  PostData,
  Category,
  PostID,
  PostLists,
  AuthorData,
} from "../../utils/posts-type";

import { createImage } from "./make-fig";

// 全記事を探索して、post/all-blog.json (全部生成) と、post/all-author.json (一部更新) を更新します。最初に実行
export async function createJsonForAuthorsAndPosts() {
  const postsDirectory = path.join(process.cwd(), "posts", "blog");
  const categories = fs.readdirSync(postsDirectory);

  let allPostsData: Record<string, Post> = {};
  let allAuthors = [];
  let allCategories: Record<string, number> = {};
  let allAuthorsCount: Record<string, number> = {};
  let categoryTagCount: Record<string, Record<string, number>> = {};

  for (const category of categories) {
    const categoryDirectory = path.join(postsDirectory, category);
    const filenames = fs.readdirSync(categoryDirectory);

    allCategories[category] = filenames.length;

    for (const filename of filenames) {
      const id = filename.replace(/\.mdx$/, "");

      const fullPath = path.join(categoryDirectory, filename);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      const matterResult = matter(fileContents);
      const author = matterResult.data.author;
      const tags = matterResult.data.tag as [];

      allAuthors.push(author);

      // もし記事の画像がなければ、画像を生成する

      allPostsData[id] = {
        id: id,
        title: matterResult.data.title,
        publishedAt: matterResult.data.publishedAt,
        updatedAt: matterResult.data.updatedAt,
        category: category,
        author: author,
        description: matterResult.data.description,
        tag: tags,
        coverImage: `/images/blog/${category}/${id}_cover.png`,
        rePost: matterResult.data.rePost,
      };

      if (allAuthorsCount[author]) {
        allAuthorsCount[author]++;
      } else {
        allAuthorsCount[author] = 1;
      }

      if (!categoryTagCount[category]) {
        categoryTagCount[category] = {};
      }

      for (const tag of tags) {
        if (categoryTagCount[category][tag]) {
          categoryTagCount[category][tag]++;
        } else {
          categoryTagCount[category][tag] = 1;
        }
      }
    }
  }

  const allListCount = {
    categories: allCategories,
    authors: allAuthorsCount,
    categoryTags: categoryTagCount,
  };

  const listsJsonPath = path.join(
    process.cwd(),
    "posts",
    "all-list-count.json"
  );
  fs.writeFileSync(listsJsonPath, JSON.stringify(allListCount, null, 2));

  // Remove duplicates
  allAuthors = Array.from(new Set(allAuthors));

  // Create or update authors JSON
  const authorsJsonPath = path.join(process.cwd(), "posts", "all-author.json");
  let authorsJson;

  try {
    const jsonString = fs.readFileSync(authorsJsonPath, "utf8");
    authorsJson = JSON.parse(jsonString);
  } catch (err) {
    authorsJson = {};
  }

  for (const author of allAuthors) {
    if (!authorsJson[author]) {
      authorsJson[author] = {
        name: author,
        description: "新規ユーザーです。プロフィールを更新してください。",
        twitter: "https://twitter.com/y0m0gy",
        image: "/images/authors/y0m0gy.png",
      };
    }
  }

  fs.writeFileSync(authorsJsonPath, JSON.stringify(authorsJson, null, 2));

  for (const [id, postData] of Object.entries(allPostsData)) {
    const { coverImage, title, category, author } = postData;

    if (!fs.existsSync("public" + coverImage)) {
      console.log("Creating image for", id);
      // If path is undefined, null, empty string, or any other falsy value
      await createImage(coverImage, title, author, authorsJson[author].image);
    }
  }

  // Create or update posts JSON
  const postsJsonPath = path.join(process.cwd(), "posts", "all-blog.json");
  fs.writeFileSync(postsJsonPath, JSON.stringify(allPostsData, null, 2));
}

// Common function to get all posts
export async function getAllPosts(): Promise<PostData[]> {
  const jsonPath = path.join(process.cwd(), "posts", "all-blog.json");

  // Read the JSON file
  const jsonString = fs.readFileSync(jsonPath, "utf8");
  const allPostsData: Record<string, PostData> = JSON.parse(jsonString);

  // Convert the object to an array
  const allPostsArray: PostData[] = Object.values(allPostsData);

  return allPostsArray;
}

// Path用
// Category Path
export async function getCategoriesPaths() {
  const postsDirectory = path.join(process.cwd(), "posts", "blog");
  const paths = await fs.promises.readdir(postsDirectory);
  return { postsDirectory, paths };
}

export async function getCategoriesPagePaths() {
  const jsonPath = path.join(process.cwd(), "posts", "all-list-count.json");

  // Read the JSON file
  const jsonString = fs.readFileSync(jsonPath, "utf8");
  const allListCount: ListCount = JSON.parse(jsonString);

  // Get all categories
  const allCategories = Object.keys(allListCount.categories);

  const paths = [];

  for (const category of allCategories) {
    const postCount = allListCount.categories[category];
    const pageCount = Math.ceil(postCount / 10); // 10 posts per page

    for (let i = 1; i <= pageCount; i++) {
      paths.push({
        params: {
          category: category,
          number: i.toString(),
        },
      });
    }
  }

  return paths;
}

// Tag Path。全Tagをカテゴリー別に取得し、Pathを生成するために使用する
export async function getAllCategoryTagsPath() {
  const allPostsArray: PostData[] = await getAllPosts();

  // Get all categories
  const categories = Array.from(
    new Set(allPostsArray.map((post) => post.category))
  );

  const paths = [];

  for (const category of categories) {
    // Get posts in the current category
    const postsInCategory = allPostsArray.filter(
      (post) => post.category === category
    );

    // Get unique tags in the current category
    const uniqueTags = Array.from(
      new Set(postsInCategory.flatMap((post) => post.tag))
    );

    for (const tag of uniqueTags) {
      // Get posts with the current tag
      const postsWithTag = postsInCategory.filter((post) =>
        post.tag.includes(tag)
      );

      const pageCount = Math.ceil(postsWithTag.length / 10); // 10 posts per page

      for (let i = 1; i <= pageCount; i++) {
        paths.push({
          params: {
            category: category,
            tag: tag,
            number: i.toString(),
          },
        });
      }
    }
  }

  return paths;
}

// Post Path
export async function getPostsPaths() {
  const { postsDirectory, paths: categories } = await getCategoriesPaths();
  const paths = [];

  for (const category of categories) {
    const categoryPath = path.join(postsDirectory, category);
    const filenames = await fs.promises.readdir(categoryPath);

    for (const filename of filenames) {
      const categoryId = filename.replace(/\.mdx$/, "");
      const params = {
        category: category,
        id: categoryId,
      };

      paths.push({ params: params });
    }
  }

  return paths;
}

// Author Path
// あとで、page natationの数を明文化させる
export async function getAllAuthorPath() {
  const jsonPath = path.join(process.cwd(), "posts", "all-list-count.json");

  // Read the JSON file
  const jsonString = fs.readFileSync(jsonPath, "utf8");
  const allListCount: ListCount = JSON.parse(jsonString);

  // Get all authors
  const allAuthors = Object.keys(allListCount.authors);

  const paths = [];

  for (const author of allAuthors) {
    const postCount = allListCount.authors[author];
    const pageCount = Math.ceil(postCount / 10); // 10 posts per page

    for (let i = 1; i <= pageCount; i++) {
      paths.push({
        params: {
          name: author,
          number: i.toString(),
        },
      });
    }
  }

  return paths;
}

export async function getPostsByCategory(
  category: string,
  tag?: string
): Promise<PostData[]> {
  // Get all posts
  const allPostsData = await getAllPosts();

  // Filter posts by category
  const filteredPosts = allPostsData.filter(
    (post) => post.category === category
  );

  // If a tag is provided, filter the posts by this tag
  if (tag) {
    return filteredPosts
      .filter((post) => post.tag.includes(tag))
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }

  // If no tag is provided, return all posts
  return filteredPosts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

// Category, Tagから記事データを取得する
export async function getListData(
  category: string,
  tag?: string
): Promise<PostLists | { notFound: boolean }> {
  if (!category) return { notFound: true };
  const posts = await getPostsByCategory(category, tag);
  const formattedPosts = posts.map((post) => ({
    id: post.id,
    title: post.title,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    category: post.category,
    author: post.author,
    description: post.description,
    tag: post.tag,
    coverImage: post.coverImage,
    rePost: post.rePost,
  }));
  return { title: category, posts: formattedPosts };
}

// authorごとの記事リストを取得する。この関数は、all-blog.jsonファイルを読み込み、その内容をJavaScriptオブジェクトに変換します。その後、このオブジェクトの値を取得して配列に変換し、指定された著者の投稿だけをフィルタリングします。最後に、投稿を日付順にソートして返します。
export async function getPostsByAuthor(author: string): Promise<PostData[]> {
  const jsonPath = path.join(process.cwd(), "posts", "all-blog.json");

  // Read the JSON file
  const jsonString = fs.readFileSync(jsonPath, "utf8");
  const allPostsData: Record<string, PostData> = JSON.parse(jsonString);

  // Convert the object to an array
  const allPostsArray: PostData[] = Object.values(allPostsData);

  // Filter the posts by author
  return allPostsArray
    .filter((post) => post.author === author)
    .sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    });
}

// ファイル名からデータを取得する
export async function getData(params: Category & PostID) {
  if (!params.category || !params.id) return { notFound: true };

  const filePath = path.join(
    process.cwd(),
    "posts",
    "blog",
    params.category,
    `${params.id}.mdx`
  );
  const fileContents = await fs.promises.readFile(filePath, "utf8");
  const { data, content } = matter(fileContents);

  // console.log("Data:", data); // データが正しく抽出されていることを確認

  if (!data || !data.title) {
    return {
      notFound: true,
    };
  }

  return {
    category: params.category,
    id: params.id,
    content: content,
    data: {
      id: data.id,
      title: data.title,
      publishedAt: data.publishedAt,
      updatedAt: data.updatedAt,
      category: data.category,
      author: data.author,
      description: data.description,
      tag: data.tag,
      coverImage: `/images/blog/${data.category}/${data.id}_cover.png`,
      rePost: data.rePost,
    },
  };
}

import { getPublicPath } from "../../utils/getImagePath";

export function getAuthorDetails(authorName: string): AuthorData {
  const jsonPath = path.join(process.cwd(), "posts", "all-author.json");

  // Read the JSON file
  const jsonString = fs.readFileSync(jsonPath, "utf8");
  const allAuthorsData: Record<string, AuthorData> = JSON.parse(jsonString);

  // Get the details of the specified author
  const authorDetails = allAuthorsData[authorName];

  // Rewrite the image path
  authorDetails.image = getPublicPath(authorDetails.image);

  return authorDetails;
}
