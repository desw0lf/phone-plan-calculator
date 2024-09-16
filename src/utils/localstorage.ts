export const loadStorage = <T = undefined>(name: string | null, defaultValue: T, joinObjectWithDefaultValue?: boolean): T => {
  if (!name) {
    return defaultValue;
  }
  try {
    const serializedState = localStorage.getItem(name);
    if (serializedState === null) {
      return defaultValue;
    }
    const parsed = JSON.parse(serializedState);
    if (joinObjectWithDefaultValue && typeof parsed === "object" && !Array.isArray(parsed)) {
      return { ...defaultValue, ...parsed };
    }
    return parsed;
  } catch (_err: unknown) {
    return defaultValue;
  }
};

export const saveStorage = (name: string, state: unknown): boolean => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(name, serializedState);
    return true;
  } catch {
    // ignore write errors
    return false;
  }
};

export const deleteStorage = (names: string[]): boolean => {
  try {
    for (let i = 0; i < names.length; i += 1) {
      localStorage.removeItem(names[i]);
    }
    return true;
  } catch {
    return false;
  }
};
