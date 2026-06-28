/**
 * StorageService - Abstraction over localStorage
 * All keys are prefixed to avoid collisions
 */
const PREFIX = 'littleExplorer_';

export class StorageService {
    static get(key, defaultValue = null) {
        try {
            const value = localStorage.getItem(`${PREFIX}${key}`);
            return value !== null ? JSON.parse(value) : defaultValue;
        } catch (error) {
            console.warn(`[Storage] Read error for "${key}":`, error);
            return defaultValue;
        }
    }

    static set(key, value) {
        try {
            localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
            return true;
        } catch (error) {
            console.warn(`[Storage] Write error for "${key}":`, error);
            return false;
        }
    }

    static remove(key) {
        localStorage.removeItem(`${PREFIX}${key}`);
    }

    static clear() {
        Object.keys(localStorage)
            .filter(key => key.startsWith(PREFIX))
            .forEach(key => localStorage.removeItem(key));
    }

    // ===== Convenience Methods =====
    static getSessionCount() {
        return this.get('sessionCount', 0);
    }

    static incrementSession() {
        const count = this.getSessionCount() + 1;
        this.set('sessionCount', count);
        return count;
    }

    static getUserAge() {
        return this.get('userAge', null);
    }

    static setUserAge(age) {
        this.set('userAge', age);
    }

    static getLanguage() {
        return this.get('language', 'en');
    }

    static setLanguage(lang) {
        this.set('language', lang);
    }

    static getNepaliProgress() {
        return this.get('nepaliProgress', []);
    }

    static setNepaliProgress(progress) {
        this.set('nepaliProgress', progress);
    }

    static getStars() {
        return this.get('stars', 0);
    }

    static addStar() {
        const stars = this.getStars() + 1;
        this.set('stars', stars);
        return stars;
    }

    static getSensoryTaps() {
        return this.get('sensoryTaps', 0);
    }

    static setSensoryTaps(count) {
        this.set('sensoryTaps', count);
    }
}