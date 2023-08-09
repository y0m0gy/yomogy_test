// header.tsx
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex justify-between bg-green-300 p-4">
      <div className="text-xl font-bold">
        <Link href="/">
          <p>My Logo</p>
        </Link>
      </div>
      <nav className="flex gap-4">
        <Link href="/igem/page/1">iGEM</Link>
        <Link href="/synbio/page/1">Synbio</Link>

        {/* <Link href="/category3">
          <a>Category 3</a>
        </Link> */}
      </nav>
    </header>
  );
}
