import Image from "next/image";
import { cn } from "@/lib/utils";

export type LogoProps = Omit<
  React.ComponentProps<typeof Image>,
  "src" | "alt" | "width" | "height"
>;

export const Logo = ({ className, ...props }: LogoProps) => {
  return (
    <Image
      src="/images/chronos.svg"
      alt="Chronos Logo"
      width={35}
      height={35}
      className={cn("rounded", className)}
      {...props}
    />
  );
};
