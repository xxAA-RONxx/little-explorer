/**
 * LanguageService - Manages multilingual support
 * Supports English, Nepali, and Bilingual modes
 */
import { StorageService } from './storage.js';

// ===== LANGUAGE SERVICE =====
export class LanguageService {
    static SUPPORTED_LANGUAGES = {
        en: { code: 'en', name: 'English', flag: '🇬🇧', direction: 'ltr' },
        ne: { code: 'ne', name: 'नेपाली', flag: '🇳🇵', direction: 'ltr' },
        bilingual: { code: 'bilingual', name: 'Both', flag: '🌏', direction: 'ltr' }
    };

    // ===== LANGUAGE MANAGEMENT =====
    
    static getCurrentLanguage() {
        return StorageService.get('language', 'en');
    }

    static setLanguage(lang) {
        if (!this.SUPPORTED_LANGUAGES[lang]) {
            console.warn('[Language] Unsupported:', lang);
            return false;
        }
        
        StorageService.set('language', lang);
        
        // Dispatch event for modules to react
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: lang }
        }));
        
        return true;
    }

    /**
     * Get language metadata
     */
    static getLanguageData(lang = null) {
        const key = lang || this.getCurrentLanguage();
        return this.SUPPORTED_LANGUAGES[key] || this.SUPPORTED_LANGUAGES.en;
    }

    /**
     * Check if a language is supported
     */
    static isSupported(lang) {
        return !!this.SUPPORTED_LANGUAGES[lang];
    }

    /**
     * Get all supported languages
     */
    static getSupportedLanguages() {
        return Object.keys(this.SUPPORTED_LANGUAGES);
    }

    /**
     * Get display name for a language
     */
    static getDisplayName(lang) {
        const data = this.getLanguageData(lang);
        return data ? data.name : lang;
    }

    // ===== LANGUAGE CHECKS =====

    /**
     * Check if in bilingual mode
     */
    static isBilingual() {
        return this.getCurrentLanguage() === 'bilingual';
    }

    /**
     * Check if in Nepali mode
     */
    static isNepali() {
        return this.getCurrentLanguage() === 'ne';
    }

    /**
     * Check if in English mode
     */
    static isEnglish() {
        return this.getCurrentLanguage() === 'en';
    }

    // ===== TRANSLATION =====

    /**
     * Get the appropriate translation based on current language
     */
    static translate(key, lang = null) {
        const currentLang = lang || this.getCurrentLanguage();
        
        // Translation map for UI elements
        const translations = {
            // Module names
            'module.sensory': { en: 'Sensory Baby', ne: 'संवेदनशील बच्चा', bilingual: '👶 Sensory' },
            'module.explorer': { en: 'Toddler Explorer', ne: 'टोडलर एक्सप्लोरर', bilingual: '🔍 Explorer' },
            'module.nepali': { en: 'Nepali Learning', ne: 'नेपाली सिकाई', bilingual: '🇳🇵 Nepali' },
            'module.nepaliSimple': { en: 'Nepali (Simple)', ne: 'सरल नेपाली', bilingual: '🇳🇵 Simple Nepali' },
            'module.games': { en: 'Learning Games', ne: 'शिक्षण खेलहरू', bilingual: '🎮 Games' },
            'module.preschool': { en: 'Preschool Pro', ne: 'प्रिस्कूल प्रो', bilingual: '🎓 Preschool' },
            
            // Common UI
            'ui.select': { en: 'Select', ne: 'चयन गर्नुहोस्', bilingual: 'Select / चयन' },
            'ui.back': { en: 'Back', ne: 'पछाडि', bilingual: 'Back / पछाडि' },
            'ui.next': { en: 'Next', ne: 'अर्को', bilingual: 'Next / अर्को' },
            'ui.done': { en: 'Done', ne: 'सकियो', bilingual: 'Done / सकियो' },
            'ui.reset': { en: 'Reset', ne: 'रिसेट', bilingual: 'Reset / रिसेट' },
            
            // Age
            'age.label': { en: 'Age:', ne: 'उमेर:', bilingual: 'Age / उमेर:' },
            'age.months': { en: 'months', ne: 'महिना', bilingual: 'months / महिना' },
            'age.year': { en: 'year', ne: 'वर्ष', bilingual: 'year / वर्ष' },
            'age.years': { en: 'years', ne: 'वर्ष', bilingual: 'years / वर्ष' },
            
            // Session
            'session.count': { en: 'Session', ne: 'सत्र', bilingual: 'Session / सत्र' }
        };
        
        const translation = translations[key];
        if (!translation) return key;
        
        if (currentLang === 'bilingual') {
            return translation.bilingual || translation.en + ' / ' + translation.ne;
        }
        
        return translation[currentLang] || translation.en || key;
    }

    // ===== UI HELPERS =====

    /**
     * Get language-specific CSS class
     */
    static getLanguageClass() {
        const lang = this.getCurrentLanguage();
        return 'lang-' + lang;
    }

    /**
     * Listen for language changes
     */
    static onLanguageChange(callback) {
        window.addEventListener('languageChanged', function(event) {
            callback(event.detail);
        });
    }

    /**
     * Get the appropriate font-family for the current language
     */
    static getFontFamily() {
        const lang = this.getCurrentLanguage();
        if (lang === 'ne' || lang === 'bilingual') {
            return "'Noto Sans Devanagari', 'Segoe UI', system-ui, sans-serif";
        }
        return "'Segoe UI', system-ui, -apple-system, sans-serif";
    }

    /**
     * Get text direction
     */
    static getTextDirection() {
        const data = this.getLanguageData();
        return data.direction || 'ltr';
    }
}