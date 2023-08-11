import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

import {
  getCategoriesPagePaths,
  getListData,
  getBasicContent,
} from "./api/get-posts-category";
import { FrameTemplate } from "../components/frame-template";
import PageList from "../components/page-list";
import { PostLists, PageNationProps } from "../utils/posts-type";
import Pagination from "../components/pagination"; // 実際のパスはあなたのプロジェクト構成に基づいて調整してください
import Sidebar from "../components/sidebar";

// Fetch data and generate static pages with getStaticProps
export async function getStaticProps() {
  const category = "igem";
  const page = "1" ? parseInt("1") : null;
  if (!category || !page) return { notFound: true };
  {
    const allPosts: PostLists = (await getListData(category)) as PostLists;
    const itemsPerPage = 10;
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    const posts = allPosts.posts.slice(start, end);

    const basicContent = await getBasicContent();
    const { newPosts, recommendPosts } = basicContent.props;

    return {
      props: {
        posts: posts,
        title: category,
        page: page,
        totalPages: Math.ceil(allPosts.posts.length / itemsPerPage),
        newPosts,
        recommendPosts,
      },
    };
  }
}

export default function Home({
  posts,
  title,
  page,
  totalPages,
  newPosts,
  recommendPosts,
}: PageNationProps & { newPosts: PostLists; recommendPosts: PostLists }) {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between ${inter.className}`}
    >
      <FrameTemplate
        leftComponent={
          <div>
            <PageList title={title} posts={posts} />
            <Pagination
              link={`${title}/page`}
              page={page}
              totalPages={totalPages}
            />
          </div>
        }
        rightComponent={
          <>
            <Sidebar title={newPosts.title} relatedPosts={newPosts.posts} />
            <Sidebar
              title={recommendPosts.title}
              relatedPosts={recommendPosts.posts}
            />
          </>
        }
      />
    </main>
  );
}
