import React, { useEffect, useState } from "react";
import { Octokit } from "@octokit/rest";

const ALLOWED_EXTENSIONS = ["mdx", "png", "jpg", "jpeg", "gif", "webp"];
const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

async function checkAndUpdateFiles(
  path: string,
  octokitWithAuth: any
): Promise<string[]> {
  const { data } = await octokitWithAuth.repos.getContent({
    owner: "yomogyhub",
    repo: "yomogy_test",
    path: path,
  });

  let errors: string[] = [];

  if (Array.isArray(data)) {
    for (const item of data) {
      if (item.type === "dir") {
        errors = errors.concat(
          await checkAndUpdateFiles(item.path, octokitWithAuth)
        );
      } else if (item.type === "file") {
        const fileExtension = item.name.split(".").pop()?.toLowerCase();

        if (
          !ALLOWED_EXTENSIONS.includes(fileExtension) ||
          item.size > MAX_FILE_SIZE
        ) {
          errors.push(`File ${item.path} is not allowed.`);
        } else {
          if ("sha" in item && "content" in item) {
            const fileSha = item.sha;
            const contentToUpdate = Buffer.from(
              item.content,
              "base64"
            ).toString("base64");

            try {
              await octokitWithAuth.repos.createOrUpdateFileContents({
                owner: "yomogyhub",
                repo: "yomogy_test",
                path: item.path,
                message: "update",
                content: contentToUpdate,
                sha: fileSha,
              });
            } catch (error) {
              console.error(`Error updating ${item.path}:`, error);
            }
          } else {
            console.error("Unexpected data type:", item);
          }
        }
      }
    }
  }

  return errors;
}

export default function Demo() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [content, setContent] = useState<string[]>([]);
  const [firstFileContent, setFirstFileContent] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);

  const octokit = new Octokit();

  useEffect(() => {
    const token = sessionStorage.getItem("github_access_token");
    if (!token) {
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
        }
      } catch (error) {
        console.error("Error fetching directory content:", error);
      }
    }

    fetchDirectoryContent();
  }, []);

  useEffect(() => {
    async function fetchFileContents() {
      for (const fileName of content) {
        try {
          const { data } = await octokit.repos.getContent({
            owner: "yomogyhub",
            repo: "yomogy_test",
            path: `posts/blog/yama/${fileName}`,
          });

          if (data && typeof data === "object" && "content" in data) {
            const fileContent = Buffer.from(data.content, "base64").toString(
              "utf-8"
            );

            // セッションストレージにファイルの内容を保存
            sessionStorage.setItem(`posts/blog/yama/${fileName}`, fileContent);
            sessionStorage.setItem(`sha_${fileName}`, data.sha);
          }
        } catch (error) {
          console.error(`Error fetching the content of ${fileName}:`, error);
        }
      }
    }

    if (content.length > 0) {
      fetchFileContents();
    }
  }, [content]);

  const handleFileClick = async (fileName: string) => {
    setSelectedFile(fileName);
  };

  useEffect(() => {
    if (selectedFile) {
      const fileContent = sessionStorage.getItem(
        `posts/blog/yama/${selectedFile}`
      );
      setFileContent(fileContent);
    } else {
      setFileContent(null); // selectedFileがnullの場合、fileContentもnullに設定します
    }
  }, [selectedFile]);

  // const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   setFileContent(e.target.value);
  // };

  const ALLOWED_EXTENSIONS = ["mdx", "png", "jpg", "jpeg", "gif", "webp"];
  const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

  const handleUpdate = async () => {
    if (!selectedFile || fileContent === null || fileContent === "") {
      console.error("No file selected or file content is empty");
      return;
    }

    const accessToken = sessionStorage.getItem("github_access_token");
    const octokitWithAuth = new Octokit({ auth: accessToken });

    const fileExtension = selectedFile.split(".").pop()?.toLowerCase();

    if (
      fileExtension &&
      ALLOWED_EXTENSIONS.includes(fileExtension) &&
      Buffer.from(fileContent).length <= MAX_FILE_SIZE
    ) {
      const contentToUpdate = Buffer.from(fileContent).toString("base64");
      const fileSha = sessionStorage.getItem(`sha_${selectedFile}`);
      const shaValue = fileSha !== null ? fileSha : undefined;

      try {
        await octokitWithAuth.repos.createOrUpdateFileContents({
          owner: "yomogyhub",
          repo: "yomogy_test",
          path: `posts/blog/yama/${selectedFile}`,
          message: "update",
          content: contentToUpdate,
          sha: shaValue,
        });
      } catch (error) {
        console.error("Error updating file:", error);
      }
    } else {
      console.error(`File ${selectedFile} is not allowed or too large.`);
    }
  };

  return (
    <div>
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

        <div>
          <h2>最初のファイルの内容</h2>
          {/* <pre>{firstFileContent}</pre> */}
        </div>

        <div>
          {errors.length > 0 ? (
            <div>
              <p>以下のエラーが発生しました：</p>
              <ul>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          ) : isUpdating ? (
            <p>問題ないです。更新します。</p>
          ) : (
            <button onClick={handleUpdate}>更新</button>
          )}
        </div>
      </div>

      <div>
        {" "}
        <div>
          <h1>Directory Content</h1>
          <ul>
            {content.map((fileName, index) => (
              <li key={index}>
                <button onClick={() => handleFileClick(fileName)}>
                  {fileName}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div>
            <h2>Selected File Content</h2>
            {fileContent !== null ? (
              <textarea
                style={{
                  width: "100%",
                  height: "200px",
                  whiteSpace: "pre-wrap",
                }}
                value={fileContent || ""}
                onChange={(e) => setFileContent(e.target.value)}
              />
            ) : (
              <p>No file selected</p>
            )}
          </div>

          <div>
            <button onClick={handleUpdate}>Update Selected File</button>
          </div>
        </div>
      </div>
    </div>
  );
}
