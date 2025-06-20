import Link from "next/link";
import { ThemeToggle } from "@/features/theme/theme-toggle";
import { Logo } from "./logo";

export const Navbar = () => {
  return (
    <header className="top-0 sticky bg-card supports-[backdrop-filter]:bg-card/60 shadow-sm backdrop-blur w-full">
      <nav
        aria-label="Main navigation"
        className="flex justify-between items-center mx-auto px-5 py-3 max-w-screen-xl"
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
