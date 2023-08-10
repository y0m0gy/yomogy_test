// header.tsx
import Link from "next/link";
import DarkModeToggle from "./dark-mode";

export default function Header() {
  return (
    <header className="flex justify-between bg-[#5EAD43] dark:bg-[#5EAD43] p-4">
      <div className="text-xl font-bold">
        <Link href="/">
          <p>My Logo</p>
        </Link>
      </div>
      <nav className="flex gap-4">
        <Link href="/igem/page/1" className="text-white">
          iGEM
        </Link>
        <Link href="/synbio/page/1" className="text-white">
          Synbio
        </Link>

        <DarkModeToggle />
      </nav>
    </header>
  );
}
