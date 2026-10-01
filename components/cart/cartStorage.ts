// Cart persistence backed by localStorage, exposed as an external store
// for useSyncExternalStore. Only product IDs and quantities are saved;
// product details always come from the catalog so prices stay current.

export type StoredCartLine = { productId: string; quantity: number };

const STORAGE_KEY = "parskala-cart";
const EMPTY: StoredCartLine[] = [];

const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedLines: StoredCartLine[] = EMPTY;
let storageFailed = false;

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function parse(raw: string | null): StoredCartLine[] {
  if (!raw) return EMPTY;

  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return EMPTY;

    return data.filter(
      (line): line is StoredCartLine =>
        typeof line?.productId === "string" &&
        Number.isInteger(line?.quantity) &&
        line.quantity > 0,
    );
  } catch {
    return EMPTY;
  }
}

export function getSnapshot(): StoredCartLine[] {
  if (storageFailed) return cachedLines;

  const raw = readRaw();

  // useSyncExternalStore needs the same reference while nothing changed.
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedLines = parse(raw);
  }

  return cachedLines;
}

export function getServerSnapshot(): StoredCartLine[] {
  return EMPTY;
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);

  // Keep other open tabs in sync.
  function handleStorage(event: StorageEvent) {
    if (event.key === STORAGE_KEY) listener();
  }
  window.addEventListener("storage", handleStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

export function writeCart(lines: StoredCartLine[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    // Storage can be full or blocked (e.g. private mode); keep going in memory.
    storageFailed = true;
    cachedLines = lines;
  }

  listeners.forEach((listener) => listener());
}
