// header.tsx
import Link from "next/link";
import DarkModeToggle from "./dark-mode";

export default function Header() {
  return (
    <header className="flex justify-between bg-[#5EAD43] p-4">
      <div className="text-xl font-bold">
        <Link href="/" className="text-white">
          <p>Yomogy</p>
        </Link>
      </div>
      <nav className="flex gap-4 items-center">
        <Link href="/igem/page/1" className="text-white">
          iGEM
        </Link>
        <Link href="/synbio/page/1" className="text-white">
          Synbio
        </Link>
        {/* <Link href="/app" className="text-white">
      App
    </Link> */}

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
    </header>
  );
}
