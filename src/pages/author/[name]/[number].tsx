import Link from "next/link";
import {
  getAllAuthorPath,
  getPostsByAuthor,
} from "../../api/get-posts-category";
import PageList from "../../../components/page-list";
import { PageNationProps } from "../../../utils/posts-type";

// Fetch data and generate static pages with getStaticProps
export async function getStaticProps(context: {
  params: { name: string; number: string };
}): Promise<{ props: PageNationProps } | { notFound: true }> {
  const name = context.params?.name;
  const page = context.params?.number ? parseInt(context.params?.number) : null;

  if (!name || !page) return { notFound: true };

  const posts = await getPostsByAuthor(name);
  const itemsPerPage = 10;
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  const formattedPosts = posts.slice(start, end).map((post) => ({
    id: post.id,
    title: post.title,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    category: post.category,
    author: post.author,
    tag: post.tag,
  }));

  return {
    props: {
      posts: formattedPosts,
      title: name, // Pass the name as a prop
      page: page,
      totalPages: Math.ceil(posts.length / itemsPerPage),
    },
  };
}

// Fetch data and generate static paths with getStaticPaths
export async function getStaticPaths() {
  const paths = await getAllAuthorPath();

  return { paths, fallback: false };
}

// Render the AuthorPage component
export default function AuthorPage({
  posts,
  title,
  page,
  totalPages,
}: PageNationProps) {
  return (
    <div>
      {/* Display data */}
      <PageList title={title} posts={posts} />

      {/* Pagination controls */}
      <div>
        {page > 1 && (
          <Link href={`/author/${title}/${page - 1}`}>
            <span>Previous</span>
          </Link>
        )}

        {/* Generate page numbers */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
          (pageNumber) => (
            <Link href={`/author/${title}/${pageNumber}`} key={pageNumber}>
              <span>{pageNumber}</span>
            </Link>
          )
        )}

        {page < totalPages && (
          <Link href={`/author/${title}/${page + 1}`}>
            <span>Next</span>
          </Link>
        )}
      </div>
    </div>
  );
}
