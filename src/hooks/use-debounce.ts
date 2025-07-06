import { useRef } from "react";

/**
 * A custom hook that returns a debounced function.
 * This code comes from:
 * https://github.com/Melvynx/ui.nowts.app/blob/main/registry/nowts/hooks/use-debounce-fn.ts
 */

export const useDebounce = <T extends unknown[]>(callback: (...args: T) => void, time = 300) => {
  const debounce = useRef<number>(0);

  const onDebounce = (...args: T) => {
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      callback(...args);
    }, time) as unknown as number;
  };

  return onDebounce;
};
