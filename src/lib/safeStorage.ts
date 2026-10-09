// In-memory memory fallback store when storage is inaccessible (e.g. Safari Private Browsing)
const memoryStore: Record<string, string> = {};
const sessionMemoryStore: Record<string, string> = {};

export const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window) {
        const val = window.localStorage.getItem(key);
        if (val !== null) return val;
      }
    } catch {
      // Storage restricted or Private Browsing
    }
    return memoryStore[key] ?? null;
  },

  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window) {
        window.localStorage.setItem(key, value);
        return;
      }
    } catch {
      // Storage restricted, quota exceeded, or Safari Private Browsing
    }
    memoryStore[key] = value;
  },

  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window) {
        window.localStorage.removeItem(key);
      }
    } catch {
      // Ignore
    }
    delete memoryStore[key];
  },
};

export const safeSession = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && 'sessionStorage' in window) {
        const val = window.sessionStorage.getItem(key);
        if (val !== null) return val;
      }
    } catch {
      // Storage restricted or Private Browsing
    }
    return sessionMemoryStore[key] ?? null;
  },

  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && 'sessionStorage' in window) {
        window.sessionStorage.setItem(key, value);
        return;
      }
    } catch {
      // Storage restricted or Private Browsing
    }
    sessionMemoryStore[key] = value;
  },

  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && 'sessionStorage' in window) {
        window.sessionStorage.removeItem(key);
      }
    } catch {
      // Ignore
    }
    delete sessionMemoryStore[key];
  },

  clear: (): void => {
    try {
      if (typeof window !== 'undefined' && 'sessionStorage' in window) {
        window.sessionStorage.clear();
      }
    } catch {
      // Ignore
    }
    for (const k of Object.keys(sessionMemoryStore)) {
      delete sessionMemoryStore[k];
    }
  },
};
