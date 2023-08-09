import Link from "next/link";
import { MDXRemote } from "next-mdx-remote";
import { format } from "date-fns";
import { BlogPostOnlyProps } from "../utils/posts-type";
import { AuthorDetails } from "./author";
import ShareButtons from "../components/share-buttons";
import AdComponent from "../components/ad";
import tocbot from "tocbot";

import React, { useEffect } from "react";

const BlogPost: React.FC<BlogPostOnlyProps> = ({ content, data, author }) => {
  useEffect(() => {
    tocbot.init({
      tocSelector: ".toc",
      contentSelector: ".mdx-content",
      headingSelector: "h1, h2, h3",
    });
    return () => tocbot.destroy();
  }, []);

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

      <div>{data.description}</div>

      <p>目次</p>
      <div className="toc"></div>
      <p>目次</p>
      {/* カバー画像をsvgで表示したかったらこれ     */}
      {/* <div dangerouslySetInnerHTML={{ __html: data.coverImage }} /> */}
      <div className="mdx-content">
        <MDXRemote {...content} />
        {/* {{content}} */}
      </div>

      {/* <MDXRemote rehypePlugins={[rehypeRaw]}>{content}</MDXRemote> */}

      <ShareButtons
        url="https://yourwebsite.com/page-to-share"
        title="Check this out!"
        summary="A great page on my site."
      />

      {/* <AdComponent /> */}
    </div>
  );
};

export default BlogPost;
