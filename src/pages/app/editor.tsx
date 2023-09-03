import React, { useState } from "react";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import yaml from "js-yaml";
import AceEditor from "react-ace";
import { MDXRemote } from "next-mdx-remote";
import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/theme-monokai";

import BlogPost from "../../components/blog-post";
import { AuthorData, Post, BlogPostProps } from "../../utils/posts-type";

const dummyAuthor: AuthorData = {
  name: "Yomogy (Demo)",
  description: "これはDemoです。ここに著者の情報が入ります。",
  twitter: "@y0m0gy",
  image: `${process.env.BASE_URL}/images/authors/y0m0gy.png`,
};

const EditorPage: React.FC = () => {
  const dummyMdxContent = `
---
title: "Githubからの投稿" # タイトル
category: "igem" # カテゴリー 現在は、igem or synbio
publishedAt: "2023-08-11" # 投稿日
updatedAt: "2023-08-11" # 更新日
author: "Yomogy" # 投稿者
description: "This is my first post." # 記事の説明
tag: ["java", "react", "information"] # タグ任意 1つ以上 3つ程度まで
rePost: false # 記事の転載の場合は"url"を記入。例 : "https//yomogy"
---

<h2>はじめての投稿h2</h2>

<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 394 80">
  <path
    fill="#000"
    d="M262 0h68.5v12.7h-27.2v66.6h-13.6V12.7H262V0ZM149 0v12.7H94v20.4h44.3v12.6H94v21h55v12.6H80.5V0h68.7zm34.3 0h-17.8l63.8 79.4h17.9l-32-39.7 32-39.6h-17.9l-23 28.6-23-28.6zm18.3 56.7-9-11-27.1 33.7h17.8l18.3-22.7z"
  />
  <path
    fill="white"
    d="M81 79.3 17 0H0v79.3h13.6V17l50.2 62.3H81Zm252.6-.4c-1 0-1.8-.4-2.5-1s-1.1-1.6-1.1-2.6.3-1.8 1-2.5 1.6-1 2.6-1 1.8.3 2.5 1a3.4 3.4 0 0 1 .6 4.3 3.7 3.7 0 0 1-3 1.8zm23.2-33.5h6v23.3c0 2.1-.4 4-1.3 5.5a9.1 9.1 0 0 1-3.8 3.5c-1.6.8-3.5 1.3-5.7 1.3-2 0-3.7-.4-5.3-1s-2.8-1.8-3.7-3.2c-.9-1.3-1.4-3-1.4-5h6c.1.8.3 1.6.7 2.2s1 1.2 1.6 1.5c.7.4 1.5.5 2.4.5 1 0 1.8-.2 2.4-.6a4 4 0 0 0 1.6-1.8c.3-.8.5-1.8.5-3V45.5zm30.9 9.1a4.4 4.4 0 0 0-2-3.3 7.5 7.5 0 0 0-4.3-1.1c-1.3 0-2.4.2-3.3.5-.9.4-1.6 1-2 1.6a3.5 3.5 0 0 0-.3 4c.3.5.7.9 1.3 1.2l1.8 1 2 .5 3.2.8c1.3.3 2.5.7 3.7 1.2a13 13 0 0 1 3.2 1.8 8.1 8.1 0 0 1 3 6.5c0 2-.5 3.7-1.5 5.1a10 10 0 0 1-4.4 3.5c-1.8.8-4.1 1.2-6.8 1.2-2.6 0-4.9-.4-6.8-1.2-2-.8-3.4-2-4.5-3.5a10 10 0 0 1-1.7-5.6h6a5 5 0 0 0 3.5 4.6c1 .4 2.2.6 3.4.6 1.3 0 2.5-.2 3.5-.6 1-.4 1.8-1 2.4-1.7a4 4 0 0 0 .8-2.4c0-.9-.2-1.6-.7-2.2a11 11 0 0 0-2.1-1.4l-3.2-1-3.8-1c-2.8-.7-5-1.7-6.6-3.2a7.2 7.2 0 0 1-2.4-5.7 8 8 0 0 1 1.7-5 10 10 0 0 1 4.3-3.5c2-.8 4-1.2 6.4-1.2 2.3 0 4.4.4 6.2 1.2 1.8.8 3.2 2 4.3 3.4 1 1.4 1.5 3 1.5 5h-5.8z"
  />
</svg>


<h3>JSXの埋め込みテストh3</h3>
<div style={{ padding: "20px", backgroundColor: "red" }}>
  <p>JSXの埋め込みテスト</p>
</div>
  `;

  const [mdxCode, setMdxCode] = useState<string>(dummyMdxContent);
  const [content, setContent] = useState<MDXRemoteSerializeResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [data, setData] = useState<Post | null>(null);

  async function convertMDXtoJSX(mdxContent: string): Promise<any> {
    const response = await fetch(`${process.env.API_BASE_URL}/convert-mdx`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mdx: mdxContent }),
    });
    if (!response.ok) {
      throw new Error("APIが停止しています。");
    }
    const data = await response.json();
    console.log(data.jsx);
    return data.jsx;
  }
  function extractFrontMatter(text: string): string | null {
    const matches = text.match(/---([\s\S]*?)---/);
    return matches && matches[1] ? matches[1].trim() : null;
  }

  function parseFrontMatter(fmText: string): Record<string, any> | null {
    try {
      return yaml.load(fmText) as Record<string, any>;
    } catch (e) {
      console.error("Error parsing YAML:", e);
      return null;
    }
  }

  const handleApplyChanges = async () => {
    const frontMatterText = extractFrontMatter(mdxCode);

    if (!frontMatterText) {
      setErrorMessage("frontMatterの部分が不足しています。");
      return;
    }

    const frontMatterObj = parseFrontMatter(frontMatterText);
    if (!frontMatterObj) {
      setData(null);
      setErrorMessage("frontMatterの解析中にエラーが発生しました。");
      return;
    }

    const requiredKeys = [
      "title",
      "category",
      "publishedAt",
      "updatedAt",
      "author",
      "description",
      "tag",
      "rePost",
      "status",
    ];

    const missingKeys = requiredKeys.filter(
      (key) => !frontMatterObj.hasOwnProperty(key)
    );
    if (missingKeys.length > 0) {
      setErrorMessage(`次のキーが不足しています：${missingKeys.join(", ")}`);
      setContent(null); // 通常のメッセージをクリア
      setData(null);

      return;
    } else {
      // キーが不足していない場合、エラーメッセージをクリアします。
      setErrorMessage(null);
    }

    const extractedData = {
      id: "sample-id",
      path: "sample-path",
      coverImage: "public/basic.png",
      title: frontMatterObj.title,
      category: frontMatterObj.category,
      publishedAt: frontMatterObj.publishedAt,
      updatedAt: frontMatterObj.updatedAt,
      author: frontMatterObj.author,
      description: frontMatterObj.description,
      tag: frontMatterObj.tag,
      rePost: frontMatterObj.rePost,
      status: frontMatterObj.status,
    };

    setData(extractedData); // ここで data を設定

    // frontMatter部分を取り除いて、それをAPIに送信
    const mainContent = mdxCode.replace(/---[\s\S]*?---/, "").trim();

    try {
      const jsxResult = await convertMDXtoJSX(mainContent);
      setContent(jsxResult);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message); // エラーメッセージを設定
      } else {
        setErrorMessage("未知のエラーが発生しました。");
      }
    }
  };

  const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
    <div style={{ color: "red", marginBottom: "20px" }}>
      <p>{message}</p>
      <pre>
        {message &&
          `---
# ---の中から、#の行を除いてください
title: "Githubからの投稿" # タイトル
category: "igem" # カテゴリー 現在は、igem or synbio
publishedAt: "2023-08-11" # 投稿日
updatedAt: "2023-08-11" # 更新日
author: "Yomogy" # 投稿者
description: "This is my first post." # 記事の説明
tag: ["java", "react", "information"] # タグ任意 1つ以上 3つ程度まで
rePost: false # 記事の転載の場合は"url"を記入。例 : "https//yomogy"
status: "published" # "published" or "draft"
---`}
      </pre>
    </div>
  );

  return (
    <div className="flex w-full flex-col h-screen p-4 md:flex-row">
      <div className="flex-1 flex md:pr-2 flex-col">
        <div className="flex justify-between h-4 md:h-8 items-center mb-4">
          <h1 className="text-xl font-bold">MDX Editor</h1>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            onClick={handleApplyChanges}
          >
            Apply Changes
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <AceEditor
            mode="markdown"
            theme="monokai"
            value={mdxCode}
            onChange={setMdxCode}
            name="mdx-editor"
            width="100%"
            height="100%"
          />
        </div>
      </div>

      <div className="flex-1 flex md:pl-2 flex-col">
        <div className="flex justify-between h-4 md:h-8 items-center mb-4">
          <h1 className="text-xl font-bold">Preview</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          {errorMessage && <ErrorMessage message={errorMessage} />}
          {data && content && (
            <BlogPost
              content={content}
              data={data}
              author={dummyAuthor}
              id={data.id}
              adjacentPosts={{
                beforeAdjacentPost: {
                  id: "/",
                  title: "前の記事名が入ります",
                  category: "igem",
                },
                afterAdjacentPost: {
                  id: "/",
                  title: "次の記事名が入ります",
                  category: "igem",
                },
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
