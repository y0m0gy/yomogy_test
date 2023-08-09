import Link from "next/link";
import { SidebarProps } from "../utils/posts-type";

const Sidebar: React.FC<SidebarProps> = ({ relatedPosts }) => {
  return (
    <div>
      <h3>Related Posts</h3>
      <ul>
        {relatedPosts.map((post) => (
          <li key={post.id}>
            <Link href={`/${post.category}/${post.id}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
