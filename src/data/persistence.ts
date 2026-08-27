export interface StorageBackend {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<unknown>;
}

/** Serializes writes per key and retains the latest value if disk storage fails. */
export function createPersistence(backend: StorageBackend) {
  const memory = new Map<string, string>();
  const dirty = new Set<string>();
  const pending = new Map<string, Promise<unknown>>();

  async function rawRead(key: string): Promise<unknown> {
    let value = memory.get(key) ?? null;
    if (!dirty.has(key)) {
      try { value = await backend.getItem(key); if (value !== null) memory.set(key, value); }
      catch { /* Keep the in-memory value. */ }
    }
    if (value === null) return undefined;
    try { return JSON.parse(value); } catch { return value; } // Legacy plain-string keys.
  }

  async function rawWrite(key: string, value: unknown) {
    const encoded = JSON.stringify(value);
    memory.set(key, encoded);
    dirty.add(key);
    try { await backend.setItem(key, encoded); dirty.delete(key); }
    catch { /* Reads continue using the latest in-memory value. */ }
  }

  function enqueue<T>(key: string, operation: () => Promise<T>): Promise<T> {
    const result = (pending.get(key) ?? Promise.resolve()).catch(() => {}).then(operation);
    pending.set(key, result);
    const cleanup = () => { if (pending.get(key) === result) pending.delete(key); };
    result.then(cleanup, cleanup);
    return result;
  }

  return {
    async read<T>(key: string, normalize: (value: unknown) => T): Promise<T> {
      await pending.get(key);
      return normalize(await rawRead(key));
    },
    write(key: string, value: unknown): Promise<void> {
      return enqueue(key, () => rawWrite(key, value));
    },
    update<T>(key: string, normalize: (value: unknown) => T, change: (value: T) => T): Promise<T> {
      return enqueue(key, async () => {
        const next = normalize(change(normalize(await rawRead(key))));
        await rawWrite(key, next);
        return next;
      });
    },
  };
}
