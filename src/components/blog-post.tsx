import Link from "next/link";
import { MDXRemote } from "next-mdx-remote";
import { format } from "date-fns";
import { BlogPostOnlyProps } from "../utils/posts-type";
import { AuthorDetails } from "./author";
import ShareButtons from "../components/share-buttons";
import AdComponent from "../components/ad";
import tocbot from "tocbot";
import React, { useEffect } from "react";
import Router from "next/router"; // これを追加

const BlogPost: React.FC<BlogPostOnlyProps> = ({ content, data, author }) => {
  useEffect(() => {
    const initTocbot = () => {
      tocbot.init({
        tocSelector: ".toc",
        contentSelector: ".mdx-content",
        headingSelector: "h1, h2, h3",
      });
    };

    initTocbot();

    const handleCustomEvent = () => {
      tocbot.destroy();
      initTocbot();
      console.log("tocbot init");
    };

    window.addEventListener("customNavigationEvent", handleCustomEvent);

    // この部分を追加
    const handleRouteChange = () => {
      const event = new Event("customNavigationEvent");
      window.dispatchEvent(event);
    };

    Router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      tocbot.destroy();
      window.removeEventListener("customNavigationEvent", handleCustomEvent);
      Router.events.off("routeChangeComplete", handleRouteChange); // イベントリスナーの解除
    };
  }, []);

  return (
    <div className="blog_main bg-white dark:bg-gray-900 p-8 max-w-6xl mx-auto">
      <div className="flex items-center space-x-2">
        <p className="text-gray-800 dark:text-gray-200">{"Home > "}</p>
        <Link
          href={`/${data.category}/page/1`}
          className="text-blue-500 hover:underline"
        >
          {data.category}
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        {data.title}
      </h1>
      <div className="flex items-center mb-4 space-x-4">
        <span className="text-blue-500 hover:underline dark:text-blue-400">
          <Link href={`/author/${data.author}/1`}>{data.author}</Link>
        </span>
        <p className="text-gray-600 dark:text-gray-400">{data.updatedAt}</p>
      </div>

      {/* <time
        dateTime={format(new Date(data.updatedAt), "yyyy-MM-dd")}
        itemProp="dateModified"
        className="block text-gray-600 mb-2"
      >
        最終更新日: {format(new Date(data.updatedAt), "yyyy年MM月dd日")}
      </time> */}
      {/* <time
        dateTime={format(new Date(data.publishedAt), "yyyy-MM-dd")}
        itemProp="datePublished"
        className="block text-gray-600 mb-4"
      ></time> */}

      <div className="my-4">
        {data.tag.map((name, index) => (
          <span key={index} className="mr-2 mb-2 inline-block">
            <Link
              href={`/${data.category}/tag/${name}/1`}
              className="text-blue-500 hover:underline dark:text-blue-400 bg-blue-100 dark:bg-blue-800 px-3 py-1 rounded-full"
            >
              # {name}
            </Link>
          </span>
        ))}
      </div>

      <div className="text-gray-800 dark:text-gray-300 mb-4">
        {data.description}
      </div>
      <p className="font-bold text-xl mb-2 text-gray-800 dark:text-gray-200">
        目次
      </p>
      <div className="toc bg-white dark:bg-gray-700 p-4 rounded shadow-md mb-4 divide-y divide-gray-300 dark:divide-gray-600"></div>
      <div className="mdx-content mb-4">
        <MDXRemote {...content} />
      </div>
      <ShareButtons
        url="https://yourwebsite.com/page-to-share"
        title="Check this out!"
        summary="A great page on my site."
      />

      <AuthorDetails author={author} />
    </div>
  );
};

export default BlogPost;
