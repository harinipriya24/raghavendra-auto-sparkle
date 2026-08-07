import { useCallback, useEffect, useState } from "react";

const KEY = "raf-compare";
const MAX = 3;
const EVENT = "raf-compare-change";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string").slice(0, MAX) : [];
  } catch {
    return [];
  }
}

function write(ids: string[]) {
  window.localStorage.setItem(KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event(EVENT));
}

export function useCompare() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setIds(read());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = useCallback((id: string) => {
    const current = read();
    if (current.includes(id)) write(current.filter((x) => x !== id));
    else if (current.length < MAX) write([...current, id]);
    return true;
  }, []);

  const remove = useCallback((id: string) => write(read().filter((x) => x !== id)), []);
  const clear = useCallback(() => write([]), []);

  return { ids, toggle, remove, clear, max: MAX, isFull: ids.length >= MAX };
}
