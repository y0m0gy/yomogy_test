import React from "react";

interface Metadata {
  url: string;
  title: string | null;
  description: string | null;
  image: string | null;
}

interface LinkCardProps {
  metadata: Metadata;
}

const LinkCard: React.FC<LinkCardProps> = ({ metadata }) => {
  // metadataが未定義の場合、何も表示しない
  if (!metadata || !metadata.url) {
    console.log("metadara", metadata);
    return null;
  }
  return (
    <div className="bg-white dark:bg-gray-800 p-4 mt-8 mb-8 rounded shadow-md">
      <a className="block" href={metadata.url} target="_blank" rel="noreferrer">
        {metadata.image && metadata.title && (
          <img
            className="w-full rounded-t"
            src={metadata.image}
            alt={metadata.title}
          />
        )}
        <div className="p-2">
          <div className="text-xl font-bold">{metadata.title}</div>
          <p className="text-gray-600 dark:text-gray-400">
            {metadata.description}
          </p>
          <span>{new URL(metadata.url).hostname}</span>
        </div>
      </a>
    </div>
  );
};

export default LinkCard;
