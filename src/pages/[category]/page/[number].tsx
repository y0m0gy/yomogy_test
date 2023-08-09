import {
  getCategoriesPagePaths,
  getListData,
} from "../../../api/get-posts-category";
import PageList from "../../../components/page-list";
import { PostLists, PageNationProps } from "../../../utils/posts-type";
import Link from "next/link";

// Fetch data and generate static pages with getStaticProps
export async function getStaticProps(context: {
  params: { category: string; number: string };
}): Promise<{ props: PageNationProps } | { notFound: true }> {
  const category = context.params?.category;
  const page = context.params?.number ? parseInt(context.params?.number) : null;

  if (!category || !page) return { notFound: true };

  const allPosts: PostLists = (await getListData(category)) as PostLists;
  const itemsPerPage = 10;
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  const posts = allPosts.posts.slice(start, end);

  return {
    props: {
      posts: posts,
      title: category,
      page: page,
      totalPages: Math.ceil(allPosts.posts.length / itemsPerPage),
    },
  };
}

// Fetch data and generate static paths with getStaticPaths
export async function getStaticPaths() {
  const paths = await getCategoriesPagePaths();

  return { paths, fallback: false };
}

// Render the CategoryPage component
export default function CategoryPage({
  posts,
  title,
  page,
  totalPages,
}: PageNationProps) {
  return (
    <div>
      <PageList title={title} posts={posts} />

      <div>
        {page > 1 && (
          <Link href={`/${title}/page/${page - 1}`}>
            <span>Previous</span>
          </Link>
        )}

        {/* Generate page numbers */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
          (pageNumber) => (
            <Link href={`/${title}/page/${pageNumber}`} key={pageNumber}>
              <span>{pageNumber}</span>
            </Link>
          )
        )}

        {page < totalPages && (
          <Link href={`/${title}/page/${page + 1}`}>
            <span>Next</span>
          </Link>
        )}
      </div>
    </div>
  );
}
