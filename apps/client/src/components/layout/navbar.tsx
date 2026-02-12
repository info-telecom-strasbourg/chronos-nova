import Link from "next/link";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Logo } from "./logo";

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <nav className="mx-auto flex max-w-screen-xl items-center gap-5 px-5 py-3">
        <Link className="flex items-center gap-3" href="/">
          <Logo />
          <span className="font-semibold text-lg">Chronos</span>
        </Link>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};
