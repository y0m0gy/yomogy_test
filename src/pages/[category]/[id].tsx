import { serialize } from "next-mdx-remote/serialize";
import {
  getPostsPaths,
  getData,
  getListData,
  getAuthorDetails,
} from "../api/get-posts-category";
import { Category, PostID, BlogPostProps } from "../../utils/posts-type";

import { FrameTemplate } from "../../components/frame-template";
import BlogPost from "../../components/blog-post";
import Sidebar from "../../components/sidebar";

import remarkPrism from "remark-prism";
import rehypePrism from "rehype-prism";

export async function getStaticPaths() {
  const paths = await getPostsPaths();
  return {
    paths: paths,
    fallback: false,
  };
}

export async function getStaticProps({
  params,
}: {
  params: Category & PostID;
}) {
  const blogPostProps = await getData(params);
  if ("notFound" in blogPostProps && blogPostProps.notFound) {
    return { notFound: true };
  }

  // Check if blogPostProps.data exists before referencing it
  const authorDetails = blogPostProps.data
    ? getAuthorDetails(blogPostProps.data.author)
    : null;

  const listDataResult = blogPostProps.data
    ? await getListData(params.category, blogPostProps.data.tag[0])
    : await getListData(params.category);

  const relatedPosts = "posts" in listDataResult ? listDataResult.posts : [];

  // Check if data.id is undefined, and if so, replace it with null
  if (blogPostProps.data && blogPostProps.data.id === undefined) {
    blogPostProps.data.id = null;
  }

  // "h1", "h2", "h3"を見つけたら、idを付与する。コードブロックの中も除外できないので注意
  function addUniqueIdsToHeadings(content: string): string {
    const headings = ["h1", "h2", "h3"];
    let idCounter = 0;

    headings.forEach((tag) => {
      const regex = new RegExp(`<${tag}>((.|\\n)*?)<\/${tag}>`, "g");
      content = content.replace(regex, (match, innerText) => {
        const id =
          innerText.toLowerCase().replace(/\s+/g, "-") + "-" + idCounter++;
        return `<${tag} id="${id}">${innerText}</${tag}>`;
      });
    });

    return content;
  }

  // console.log(blogPostProps.content);
  const processedContent = addUniqueIdsToHeadings(blogPostProps.content ?? "");
  const mdxSource = processedContent
    ? await serialize(processedContent, {
        mdxOptions: {
          remarkPlugins: [remarkPrism],
          rehypePlugins: [rehypePrism],
        },
      })
    : null;

  return {
    props: {
      ...blogPostProps,
      content: mdxSource,
      relatedPosts,
      author: authorDetails,
    },
  };
}

const BlogPostPage: React.FC<BlogPostProps> = ({
  content,
  data,
  relatedPosts,
  author,
}) => {
  return (
    <FrameTemplate
      leftComponent={<BlogPost content={content} data={data} author={author} />}
      rightComponent={
        <Sidebar title={"Related Posts"} relatedPosts={relatedPosts} />
      }
    />
  );
};

export default BlogPostPage;
