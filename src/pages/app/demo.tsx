import React, { useEffect, useState } from "react";
import { Octokit } from "@octokit/rest";

export default function Demo() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [content, setContent] = useState<string[]>([]);
  const octokit = new Octokit();

  useEffect(() => {
    const token = sessionStorage.getItem("github_access_token");
    if (!token) {
      // アクセストークンが存在しない場合、ログインページにリダイレクト
      window.location.href = "/app/login";
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    async function fetchDirectoryContent() {
      try {
        const { data } = await octokit.repos.getContent({
          owner: "yomogyhub",
          repo: "yomogy_test",
          path: "posts/blog/yama",
        });

        if (Array.isArray(data)) {
          const fileNames = data.map((file) => file.name);
          setContent(fileNames);
          sessionStorage.setItem(
            "github_directory_content",
            JSON.stringify(fileNames)
          );
        }
      } catch (error) {
        console.error("Error fetching directory content:", error);
      }
    }

    fetchDirectoryContent();
  }, []);

  return (
    <div>
      <div>
        {isAuthenticated === null ? (
          <div>認証状態を確認中...</div>
        ) : isAuthenticated ? (
          <div>認証が完了しました！</div>
        ) : (
          <div>認証が失敗しました。</div>
        )}
      </div>
      <div>
        <h1>Directory Content</h1>
        <ul>
          {content.map((fileName, index) => (
            <li key={index}>{fileName}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
