import { useState, useEffect } from "react";
import Script from "next/script";
import { FrameTemplate } from "../../components/frame-template";

export default function SearchResults() {
  const [query, setQuery] = useState<string | null>(null);

  // クライアントサイドでURLのクエリを取得
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setQuery(urlParams.get("q"));
  }, []);

  const title = query ? `${query} の検索結果` : "検索結果";

  return (
    <FrameTemplate
      leftComponent={
        <div>
          <h1>{title}</h1>
          <Script
            async
            src="https://cse.google.com/cse.js?cx=0334e62c8db274d20"
          ></Script>
          <div className="gcse-searchresults-only"></div>
        </div>
      }
      rightComponent={
        <div>
          <h1>{title}</h1>
          <Script
            async
            src="https://cse.google.com/cse.js?cx=0334e62c8db274d20"
          ></Script>
          <div className="gcse-searchresults-only"></div>
        </div>
      }
    />
  );
}
