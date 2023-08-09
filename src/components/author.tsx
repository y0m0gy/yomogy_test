import { AuthorData } from "../utils/posts-type";

type AuthorDetailsProps = {
  author: AuthorData;
};

export const AuthorDetails: React.FC<AuthorDetailsProps> = ({ author }) => {
  return (
    <div>
      <h2>{author.name}</h2>
      <p>{author.description}</p>
      <img src={author.image} alt={author.name} />
      <p>
        <a href={author.twitter}>Twitter</a>
      </p>
    </div>
  );
};
