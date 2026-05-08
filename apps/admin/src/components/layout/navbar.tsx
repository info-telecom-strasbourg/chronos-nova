import { Separator } from "@chronos/ui/components/separator";
import { LayoutDashboard, ListChecks } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const NAV_LINKS = [
  { href: "/", label: "Stages", icon: LayoutDashboard },
  { href: "/pending", label: "En attente", icon: ListChecks },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <nav className="mx-auto flex max-w-screen-xl items-center gap-5 px-5 py-3">
        <Link className="flex items-center gap-3" href="/">
          <Image
            src="/images/chronos.svg"
            alt="Chronos"
            width={32}
            height={32}
            className="rounded"
          />
          <span className="font-semibold text-lg">Chronos Admin</span>
        </Link>
        <Separator orientation="vertical" className="h-5" />
        <div className="flex items-center gap-1">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-foreground"
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </div>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
