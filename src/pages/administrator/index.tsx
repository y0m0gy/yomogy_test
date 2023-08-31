import { FrameTemplate } from "../../components/frame-template";
import Sidebar from "../../components/sidebar";
import { getBasicContent } from "../api/get-posts-category";
import { PostLists } from "../../utils/posts-type";
import Link from "next/link";

export async function getStaticProps() {
  const basicContent = await getBasicContent();
  const { newPosts, recommendPosts } = basicContent.props;

  return {
    props: { newPosts, recommendPosts },
  };
}

export default function Administrator({
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
            <h1 className="text-2xl font-bold mb-4">運営者</h1>

            <h2 className="text-xl font-semibold mt-4">ご挨拶</h2>
            <p className="mt-2">
              はじめまして。 ご訪問頂きありがとうございます。
              <br />
              当サイトを運営しております、Yomogyです。
              <br />
            </p>

            <p className="mt-4">
              当サイトはSynthetic biology (Synbio, 合成生物学, 構成生物学)
              の普及・発展を目指して開設されました。
            </p>

            <p className="mt-4">
              記事に関するお問い合わせや、その他何かご要望や不明点などございましたら、メール等にてご連絡ください。
              <br />
            </p>

            <h2 className="text-xl font-semibold mt-4">お問い合わせ情報</h2>

            <h3 className="text-lg font-semibold mt-4">運営者</h3>
            <p className="mt-2">Yomogy (Supported by iGEM Japan)</p>

            <h3 className="mt-4">連絡先</h3>
            <p className="mt-2">
              Mail :&nbsp;
              <a
                href="mailto:yomogy.info@gmail.com"
                className="text-blue-500 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                yomogy.info [at] gmail.com
              </a>
            </p>
            <p className="mt-2">
              Github :&nbsp;
              <a
                href="https://github.com/yomogyhub"
                className="text-blue-500 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                yomogyhub
              </a>
            </p>
            <p className="mt-2">
              X (Twitter) :&nbsp;
              <a
                href="https://x.com/y0m0gy"
                className="text-blue-500 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                @y0m0gy
              </a>
            </p>

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
