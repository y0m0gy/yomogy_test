import React from "react";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote";
import { format } from "date-fns";
import { BlogPostOnlyProps } from "../utils/posts-type";
import { AuthorDetails } from "./author";

const BlogPost: React.FC<BlogPostOnlyProps> = ({ content, data, author }) => {
  return (
    <div>
      <h1>{data.title}</h1>
      <p>{data.updatedAt}</p>
      <div>
        <span>
          <Link href={`/author/${data.author}/1`}>{data.author}</Link>
        </span>
      </div>

      <time
        dateTime={format(new Date(data.updatedAt), "yyyy-MM-dd")}
        itemProp="dateModified"
      >
        最終更新日: {format(new Date(data.updatedAt), "yyyy年MM月dd日")}
      </time>

      <time
        dateTime={format(new Date(data.publishedAt), "yyyy-MM-dd")}
        itemProp="datePublished"
      >
        {/* 最終更新日: {format(new Date(data.date), "yyyy年MM月dd日")} */}
      </time>

      <AuthorDetails author={author}></AuthorDetails>

      <div>
        {data.tag.map((name, index) => (
          <span key={index}>
            <Link href={`/${data.category}/tag/${name}/1`}>{name}</Link>
          </span>
        ))}
      </div>

      <Link href={`/${data.category}/page/1`}>{data.category}</Link>

      {/* カバー画像をsvgで表示したかったらこれ    */}
      {/* <div dangerouslySetInnerHTML={{ __html: data.coverImage }} /> */}
      <MDXRemote {...content} />
      {/* <MDXRemote rehypePlugins={[rehypeRaw]}>{content}</MDXRemote> */}
    </div>
  );
};

export default BlogPost;
