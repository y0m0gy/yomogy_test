// header.tsx
import Link from "next/link";
import DarkModeToggle from "./dark-mode";

export default function Header() {
  return (
    <header className="flex justify-between bg-[#5EAD43]  p-4">
      <div className="text-xl font-bold">
        <Link href="/" className="text-white">
          <p>Yomogy</p>
        </Link>
      </div>
      <nav className="flex gap-4">
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
      </nav>
    </header>
  );
}
