import React from "react";
import Link from "next/link";

const MainPage: React.FC = () => {
  // 例としてのダミーデータ
  const items = ["editor", "login"];

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Main Page</h1>
      <ul>
        {items.map((item, index) => (
          <li key={index} className="mb-2">
            <Link
              href={`/app/${item}`}
              className="text-blue-500 hover:underline"
            >
              {item}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MainPage;
