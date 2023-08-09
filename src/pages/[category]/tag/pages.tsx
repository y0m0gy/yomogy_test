import {
  getAllCategoryTagsPath,
  getListData,
} from "../../../api/get-posts-category";
import PageList from "../../../components/page-list";
import { PostLists, Category, Tag } from "../../../utils/posts-type";

export async function getStaticPaths() {
  const paths = await getAllCategoryTagsPath();
  return {
    paths: paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: Category & Tag }) {
  if (!params.category || !params.tag) return { notFound: true };
  const { posts }: PostLists = (await getListData(
    params.category,
    params.tag
  )) as PostLists;

  return {
    props: {
      title: params.tag,
      posts: posts,
    },
  };
}

const TagPage: React.FC<{ title: string; posts: any }> = ({ title, posts }) => {
  return (
    <div>
      <PageList title={title} posts={posts} />
    </div>
  );
};

export default TagPage;
