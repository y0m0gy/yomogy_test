import {
  getCategoriesPagePaths,
  getListData,
} from "../../api/get-posts-category";
import { FrameTemplate } from "../../../components/frame-template";
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

interface PaginationProps {
  title: string;
  page: number;
  totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({ title, page, totalPages }) => {
  return (
    <div className="flex justify-center items-center space-x-4 mt-6">
      {/* Previous Button */}
      {page > 1 && (
        <Link href={`/${title}/page/${page - 1}`}>
          <span className="text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-500 cursor-pointer">
            Previous
          </span>
        </Link>
      )}

      {/* Page Numbers */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
        <Link href={`/${title}/page/${pageNumber}`} key={pageNumber}>
          <span
            className={`px-2 py-1 border rounded-md ${
              page === pageNumber
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
            }`}
          >
            {pageNumber}
          </span>
        </Link>
      ))}

      {/* Next Button */}
      {page < totalPages && (
        <Link href={`/${title}/page/${page + 1}`}>
          <span className="text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-500 cursor-pointer">
            Next
          </span>
        </Link>
      )}
    </div>
  );
};

// Render the CategoryPage component
export default function CategoryPage({
  posts,
  title,
  page,
  totalPages,
}: PageNationProps) {
  return (
    <FrameTemplate
      leftComponent={
        <div>
          <PageList title={title} posts={posts} />
          <Pagination title={title} page={page} totalPages={totalPages} />
        </div>
      }
      rightComponent={<PageList title={title} posts={posts} />}
    />
  );
}
