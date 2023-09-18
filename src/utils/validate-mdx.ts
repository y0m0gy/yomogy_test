import fs from "fs";
import matter from "gray-matter";
import { PrePost, Post } from "./posts-type";

function validateMDX(filePath: string): void {
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");

    // Using gray-matter to parse front matter

    const frontMatterData = matter(fileContent).data as PrePost;

    // Extracting ID from the file name
    const id = filePath.split("/").pop()?.split(".mdx")[0];
    if (!id || !/^[a-zA-Z]+$/.test(id)) {
      throw new Error(
        "Invalid ID: ID must only contain alphabets and no spaces or underscores."
      );
    }

    // Create a Post object including the id and path
    const frontMatter: Post = {
      id: id,
      ...frontMatterData,
    };

    // Additional validations can go here...
    if (!Date.parse(frontMatter.publishedAt)) {
      throw new Error("Invalid publishedAt date.");
    }

    if (!Date.parse(frontMatter.updatedAt)) {
      throw new Error("Invalid updatedAt date.");
    }

    // ... (Other validations)

    console.log(`File ${filePath} is valid`);
  } catch (error) {
    console.error(
      `Validation failed for file ${filePath}:`,
      (error as Error).message
    );
    process.exit(1);
  }
}

const filePath = process.argv[2];
validateMDX(filePath);
