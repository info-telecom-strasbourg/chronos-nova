import { Separator } from "@chronos/ui/components/separator";
import { Logo } from "./logo";

export const Footer = () => {
  return (
    <footer className="w-full border-t bg-card">
      <div className="mx-auto flex max-w-screen-xl flex-col gap-3 px-5 py-7">
        <div className="flex items-center gap-4">
          <Logo className="size-12" />
          <div className="flex flex-col">
            <span className="font-semibold text-lg">Chronos</span>
            <span className="text-muted-foreground">Annuaire des stages</span>
          </div>
        </div>
        <Separator />
        <span className="text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} - Informatique Télécom Strasbourg
        </span>
      </div>
    </footer>
  );
};
