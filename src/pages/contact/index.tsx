import { FrameTemplate } from "../../components/frame-template";
import Sidebar from "../../components/sidebar";
import { getBasicContent } from "../api/get-posts-category";
import { PostLists } from "../../utils/posts-type";

export async function getStaticProps() {
  const basicContent = await getBasicContent();
  const { newPosts, recommendPosts } = basicContent.props;

  return {
    props: { newPosts, recommendPosts },
  };
}

export default function Contact({
  newPosts,
  recommendPosts,
}: {
  newPosts: PostLists;
  recommendPosts: PostLists;
}) {
  return (
    <FrameTemplate
      leftComponent={
        <div className="blog_main bg-white dark:bg-gray-900 p-4 lg:p-8 max-w-6xl mx-auto w-full max-w-full">
          <>
            {/* 以下の部分のみ動的に変更すると静的ページテンプレとして使用できる */}

            {/* ここまで */}
          </>
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
  );
}
