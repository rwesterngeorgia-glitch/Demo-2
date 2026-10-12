import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { seed } from "./data";
import type { Demo } from "./data";
const KEY = "ember-olive-demo-v1";
type Store = {
  data: Demo;
  update: (fn: (d: Demo) => Demo, activity?: string) => void;
  reset: () => void;
  storageError: string;
};
const Context = createContext<Store | null>(null);
export function Provider({ children }: { children: ReactNode }) {
  const [storageError, setStorageError] = useState("");
  const [data, setData] = useState<Demo>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (
          [
            "dishes",
            "reservations",
            "staff",
            "shifts",
            "tasks",
            "slots",
            "activity",
            "messages",
          ].every((k) => Array.isArray(d[k])) &&
          typeof d.notes === "string"
        )
          return d;
      }
    } catch {
      /* Fall back to a fresh demo if storage is unavailable or corrupt. */
    }
    return seed();
  });
  function persist(next: Demo) {
    setData(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
      setStorageError("");
    } catch {
      setStorageError(
        "Browser storage is full or unavailable. Changes work for this session but may not survive a reload. Try a smaller image or reset the demo.",
      );
    }
  }
  function update(fn: (d: Demo) => Demo, activity?: string) {
    const next = fn(data);
    if (activity) next.activity = [activity, ...next.activity].slice(0, 30);
    persist(next);
  }
  function reset() {
    persist(seed());
  }
  return (
    <Context.Provider value={{ data, update, reset, storageError }}>
      {children}
    </Context.Provider>
  );
}
export function useDemo() {
  const context = useContext(Context);
  if (!context) throw new Error("Missing demo provider");
  return context;
}
