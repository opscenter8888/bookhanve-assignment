"use client";

import { useSyncExternalStore } from "react";

export function useHasMounted(): boolean {
  return useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );
}
