import { createSafeActionClient } from "next-safe-action";

/**
 * Initializes a safe action client instance for use with Next.js.
 *
 * This client is created using `createSafeActionClient` from the `next-safe-action` package,
 * providing a secure way to define and execute server actions with type safety and validation.
 *
 * @see https://next-safe-action.dev/docs/getting-started
 */
export const ActionClient = createSafeActionClient();
