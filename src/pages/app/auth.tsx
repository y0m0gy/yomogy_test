import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

async function getUserInfo(accessToken: string) {
  const response = await fetch("https://api.github.com/user", {
    method: "GET",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${accessToken}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user info");
  }

  const data = await response.json();
  return data;
}

async function checkOrganizationMembership(
  accessToken: string,
  org: string,
  username: string
) {
  const response = await fetch(
    `https://api.github.com/orgs/${org}/members/${username}`,
    {
      method: "GET",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${accessToken}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  return response.status;
}

function logout() {
  // セッションのクリア
  sessionStorage.clear();

  // クッキーの削除
  document.cookie =
    "session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  // ローカルストレージのクリア
  localStorage.removeItem("token");

  // ログインページにリダイレクト
  window.open("https://github.com/logout", "_blank");
  window.location.href = "/app/login";
}

export default function Auth() {
  const router = useRouter();

  useEffect(() => {
    async function fetchTokenAndUserInfo() {
      const code = router.query.code;

      if (!code) return;

      try {
        const response = await fetch("/api/github-api", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        });

        const data = await response.json();
        const accessToken = data.access_token;

        // アクセストークンをセッションストレージに保存
        sessionStorage.setItem("github_access_token", accessToken);

        const userInfo = await getUserInfo(accessToken);
        console.log(userInfo);
        sessionStorage.setItem("github_user_name", userInfo.login);

        const org = "yomogyhub";
        const membershipStatus = await checkOrganizationMembership(
          accessToken,
          org,
          userInfo.login
        );

        if (membershipStatus === 204) {
          console.log(`${userInfo.login} is a member of ${org}`);
        } else if (membershipStatus === 404) {
          console.log(`${userInfo.login} is not a member of ${org}`);
        } else {
          console.log(
            `Cannot determine membership status for ${userInfo.login}`
          );
        }

        // 認証が完了した後、URLからクエリパラメータを削除
        const newURL =
          window.location.protocol +
          "//" +
          window.location.host +
          window.location.pathname;
        window.history.replaceState({}, document.title, newURL);
      } catch (error) {
        console.error(error);
        router.back();
      }
    }

    fetchTokenAndUserInfo();
  }, [router.query]);

  return (
    <div>
      {/* その他のコンポーネントや要素 */}
      <div>Authenticating...</div>

      <Link href="/app/demo">demoページに移動</Link>

      {/* ログアウトボタン */}
      <button onClick={logout}>ログアウト</button>
    </div>
  );
}
