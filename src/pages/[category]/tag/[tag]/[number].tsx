import Link from "next/link";
import {
  getAllCategoryTagsPath,
  getListData,
} from "../../../../api/get-posts-category";
import PageList from "../../../../components/page-list";
import {
  PostLists,
  Category,
  Tag,
  PageNationProps,
} from "../../../../utils/posts-type";

export async function getStaticPaths() {
  const paths = await getAllCategoryTagsPath();
  return {
    paths: paths,
    fallback: false,
  };
}

export async function getStaticProps({
  params,
}: {
  params: Category & Tag & { number: string };
}) {
  if (!params.category || !params.tag) return { notFound: true };
  const allPosts: PostLists = (await getListData(
    params.category,
    params.tag
  )) as PostLists;

  const page = params.number ? parseInt(params.number) : 1;
  const itemsPerPage = 10;
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  const posts = allPosts.posts.slice(start, end);

  return {
    props: {
      title: params.tag,
      posts: posts,
      page: page,
      totalPages: Math.ceil(allPosts.posts.length / itemsPerPage),
    },
  };
}

export default function TagPage({
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
          <Link href={`/${posts[0].category}/tag/${title}/${page - 1}`}>
            <span>Previous</span>
          </Link>
        )}

        {/* Generate page numbers */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
          (pageNumber) => (
            <Link
              href={`/${posts[0].category}/tag/${title}/${pageNumber}`}
              key={pageNumber}
            >
              <span>{pageNumber}</span>
            </Link>
          )
        )}

        {page < totalPages && (
          <Link href={`/${posts[0].category}/tag/${title}/${page + 1}`}>
            <span>Next</span>
          </Link>
        )}
      </div>
    </div>
  );
}
