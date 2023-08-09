// src/app/[category]/pagelink.tsx
import Link from "next/link";
import { PostLists } from "../utils/posts-type";

const PageList: React.FC<PostLists> = ({ title, posts }) => (
  <div>
    <h1>{title.toUpperCase()}</h1>
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <Link href={`/${post.category}/${post.id}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  </div>
);

export default PageList;
