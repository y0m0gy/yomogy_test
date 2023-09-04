// https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app
import { useState } from "react";

export default function LoginPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const handleSignIn = async () => {
    // GitHub OAuthアプリのクライアントID
    const clientID = process.env.GITHUB_APP_CLIENT_ID;

    // GitHubのOAuth認証ページにリダイレクトするURLを構築
    const redirectURI = "http://localhost:3000/app/auth";
    const state = Math.random().toString(36).substring(7); // 乱数を生成してstateパラメータとして使用
    const url = `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${encodeURIComponent(
      redirectURI
    )}&state=${state}`;

    // ユーザーをGitHubの認証ページにリダイレクト
    window.location.href = url;
  };

  return (
    <div>
      {!isAuthenticated ? (
        <button onClick={handleSignIn}>
          <div className="flex items-center px-4 py-2 bg-transparent border border-gray-300 shadow-md rounded-lg hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800">
            <span className="mr-2">
              <svg
                x="0px"
                y="0px"
                viewBox="0 0 27 27"
                xmlSpace="preserve"
                height="20"
                width="20"
              >
                <path
                  fill="currentColor"
                  d="M13.4,1.2C7,1,1.8,6,1.7,12.4c0,0.1,0,0.4,0,0.5c0,5.1,3.2,9.8,8.2,11.5c0.6,0.1,0.7-0.2,0.7-0.6s0-1.8,0-2.9 c0,0-3.3,0.6-4-1.5c0,0-0.6-1.3-1.3-1.8c0,0-1.1-0.7,0.1-0.7c0.7,0.1,1.5,0.6,1.8,1.2c0.6,1.2,2.2,1.7,3.4,1h0.1 c0.1-0.6,0.4-1.2,0.7-1.6C8.7,17.1,6,16.9,6,12.3c0-1.1,0.5-2.1,1.2-2.8c0-1.1,0-2.2,0.3-3.2c1-0.4,3.3,1.3,3.3,1.3c2-0.6,4-0.6,6,0 c0,0,2.2-1.6,3.2-1.2c0.5,1,0.5,2.2,0.1,3.2c0.7,0.7,1.2,1.8,1.2,2.8c0,4.5-2.8,5-5.5,5.2c0.6,0.6,0.9,1.3,0.7,2.2c0,1.7,0,3.5,0,4 s0.2,0.6,0.7,0.6c4.9-1.7,8.2-6.2,8-11.5c0.1-6.4-5.1-11.6-11.6-11.6C13.5,1.2,13.4,1.2,13.4,1.2z"
                ></path>
              </svg>
            </span>
            GitHub アカウントでログイン
          </div>
        </button>
      ) : (
        // 認証後のUIや動作をここに追加
        <div>Authenticated!</div>
      )}
    </div>
  );
}
