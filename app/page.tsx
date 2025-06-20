import Image from "next/image";
import { ThemeToggle } from "@/features/theme/theme-toggle";
import type { PageParams } from "@/types/next";

export default async function RoutePage(_: PageParams) {
  return (
    <div className="bg-primary">
      Hello world
      <Image alt="Chronos Logo" height={100} src="./logo.svg" width={100} />
      <ThemeToggle />
    </div>
  );
}
