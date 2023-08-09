import { serialize } from "next-mdx-remote/serialize";
import {
  getPostsPaths,
  getData,
  getListData,
  getAuthorDetails,
} from "../../api/get-posts-category";
import { Category, PostID, BlogPostProps } from "../../utils/posts-type";

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

  const mdxSource = blogPostProps.content
    ? await serialize(blogPostProps.content, {
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

// export async function getStaticProps({
//   params,
// }: {
//   params: Category & PostID;
// }) {
//   const blogPostProps = await getData(params);
//   if ("notFound" in blogPostProps && blogPostProps.notFound) {
//     return { notFound: true };
//   }

//   // Check if blogPostProps.data exists before referencing it
//   const authorDetails = blogPostProps.data
//     ? getAuthorDetails(blogPostProps.data.author)
//     : null;

//   const listDataResult = blogPostProps.data
//     ? await getListData(params.category, blogPostProps.data.tag[0])
//     : await getListData(params.category);

//   const relatedPosts = "posts" in listDataResult ? listDataResult.posts : [];

//   // Check if data.id is undefined, and if so, replace it with null
//   if (blogPostProps.data && blogPostProps.data.id === undefined) {
//     blogPostProps.data.id = null;
//   }

//   // Serialize the MDX content if it is not undefined
//   const mdxSource = blogPostProps.content
//     ? await serialize(blogPostProps.content)
//     : null;

//   return {
//     props: {
//       ...blogPostProps,
//       content: mdxSource,
//       relatedPosts,
//       author: authorDetails,
//     },
//   };
// }

const BlogPostPage: React.FC<BlogPostProps> = ({
  content,
  data,
  relatedPosts,
  author,
}) => {
  return (
    <div>
      <BlogPost content={content} data={data} author={author} />
      <Sidebar relatedPosts={relatedPosts} />
    </div>
  );
};

export default BlogPostPage;
