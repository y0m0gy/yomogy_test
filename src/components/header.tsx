// header.tsx
import { useState } from "react";
import Link from "next/link";
import DarkModeToggle from "./dark-mode";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="flex justify-between bg-[#5EAD43] p-4">
      <div className="text-xl font-bold">
        <Link href="/" className="text-white">
          <p>Yomogy</p>
        </Link>
      </div>

      {/* デスクトップ向けのナビゲーション */}
      <nav className="hidden md:flex gap-4 items-center">
        <Link href="/igem/page/1" className="text-white">
          iGEM
        </Link>
        <Link href="/synbio/page/1" className="text-white">
          Synbio
        </Link>
        .{/*(デスクトップのみ) */}
        <DarkModeToggle />
        {/* 検索窓 */}
        <div className="bg-gray-200 rounded-full h-8 pr-1 flex items-center">
          <form
            action="/search"
            method="get"
            className="flex items-center flex-grow"
          >
            <button
              type="submit"
              className="h-5 ml-2 mr-1 p-0 border-none bg-transparent"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 512 512"
                fill="rgb(151, 151, 151)"
              >
                <path d="M495.272,423.558c0,0-68.542-59.952-84.937-76.328c-24.063-23.938-33.69-35.466-25.195-54.931   c37.155-75.78,24.303-169.854-38.72-232.858c-79.235-79.254-207.739-79.254-286.984,0c-79.245,79.264-79.245,207.729,0,287.003   c62.985,62.985,157.088,75.837,232.839,38.691c19.466-8.485,31.022,1.142,54.951,25.215c16.384,16.385,76.308,84.937,76.308,84.937   c31.089,31.071,55.009,11.95,69.368-2.39C507.232,478.547,526.362,454.638,495.272,423.558z M286.017,286.012   c-45.9,45.871-120.288,45.871-166.169,0c-45.88-45.871-45.88-120.278,0-166.149c45.881-45.871,120.269-45.871,166.169,0   C331.898,165.734,331.898,240.141,286.017,286.012z" />
              </svg>
            </button>
            <input
              className="w-32 h-6 border-none outline-none bg-gray-200 py-1 flex-grow"
              type="search"
              name="q"
              placeholder="サイトを検索"
              style={{ color: "black", caretColor: "black" }}
            />
          </form>
        </div>
      </nav>

      {/* モバイル向けのハンバーガーアイコン */}
      <button
        className="md:hidden flex items-center"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {/* ハンバーガーアイコン (SVG) */}
        <svg
          width="24"
          height="24"
          fill="currentColor"
          className="h-6 w-6"
          viewBox="0 0 24 24"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4 5C4 4.44772 4.44772 4 5 4H19C19.5523 4 20 4.44772 20 5C20 5.55228 19.5523 6 19 6H5C4.44772 6 4 5.55228 4 5ZM4 12C4 11.4477 4.44772 11 5 11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H5C4.44772 13 4 12.5523 4 12ZM5 18C4.44772 18 4 18.4477 4 19C4 19.5523 4.44772 20 5 20H19C19.5523 20 20 19.5523 20 19C20 18.4477 19.5523 18 19 18H5Z"
          />
        </svg>
      </button>

      {/* モバイル向けのドロップダウンメニュー */}
      {menuOpen && (
        <nav className="absolute top-full left-0 w-full bg-[#5EAD43] mt-4 md:hidden flex flex-col gap-4 p-4">
          <Link href="/igem/page/1" className="text-white">
            iGEM
          </Link>
          <Link href="/synbio/page/1" className="text-white">
            Synbio
          </Link>
          {/* <Link href="/app" className="text-white">
            App
          </Link> */}
        </nav>
      )}
    </header>
  );
}
