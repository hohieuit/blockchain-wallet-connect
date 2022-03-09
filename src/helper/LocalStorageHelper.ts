class LocalStorateHelper {
    get<T>(key: string): T | null {
        const json = localStorage.getItem(key)
        return json ? JSON.parse(json) : null;
    }

    set<T>(key: string, t: T) {
        localStorage.setItem(key, JSON.stringify(t))
    }

    remove(key: string) {
        localStorage.removeItem(key)
    }
}

export const localStorageHelper = new LocalStorateHelper()