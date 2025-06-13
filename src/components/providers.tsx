import type { PropsWithChildren } from "react";

export type ProviderProps = PropsWithChildren<{}>;

export const Providers = ({ children }: ProviderProps) => {
  return (
    <>
      <>{children}</>
    </>
  );
};
