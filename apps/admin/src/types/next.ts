import type { ReactNode } from "react";

/**
 * Represents the parameters passed to a Next.js page component.
 *
 * @template T - The type of the route parameters, extending a record of string keys and string values. Defaults to an empty object.
 * @property params - A promise that resolves to the route parameters of type `T`.
 * @property searchParams - A promise that resolves to an object containing the search parameters, where each value can be a string, an array of strings, or undefined.
 */
export type PageParams<T extends Record<string, string> = Record<string, string>> = {
  params: Promise<T>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/**
 * Represents the parameters passed to a Next.js layout component.
 *
 * @template T - The type of the route parameters, extending a record of string keys and string values. Defaults to an empty object.
 * @property params - A promise that resolves to the route parameters of type `T`.
 * @property children - Optional ReactNode elements to be rendered within the layout.
 */
export type LayoutParams<T extends Record<string, string> = Record<string, string>> = {
  params: Promise<T>;
  children?: ReactNode | undefined;
};
