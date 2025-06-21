import Link from "next/link";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Logo } from "./logo";

export const Navbar = () => {
  return (
    <header className="sticky top-0 w-full bg-card shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-screen-xl items-center justify-between px-5 py-3"
      >
        <Link className="flex items-center gap-3" href="/">
          <Logo />
          <span className="font-semibold text-lg">Chronos</span>
        </Link>
        <div>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};
