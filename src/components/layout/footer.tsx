import Link from "next/link";
import { FaGithub } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Separator } from "../ui/separator";
import { Logo } from "./logo";

export const Footer = () => {
  return (
    <footer className="bg-card border-t w-full">
      <div className="flex flex-col gap-3 mx-auto px-5 py-7 max-w-screen-xl">
        <div className="flex items-center gap-4">
          <Logo className="size-12" />
          <div className="flex flex-col">
            <span className="font-semibold text-lg">Chronos</span>
            <span className="text-muted-foreground">Annuaire des stages</span>
          </div>
        </div>
        <Separator />
        <div className="flex justify-between">
          <span className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} - Informatique Télécom Strasbourg
          </span>
          <div>
            <Button variant="ghost" size="icon" asChild>
              <Link href="https://github.com/info-telecom-strasbourg/chronos-nova">
                <FaGithub className="size-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};
