import { StorageService } from './services/storage.js';
import { AgeManager } from './services/ageManager.js';
import { LanguageService } from './services/languageService.js';
import { SensoryModule } from './modules/sensory.js';
import { ExplorerModule } from './modules/explorer.js';
import { NepaliModule } from './modules/nepali.js';
import { GamesModule } from './modules/games.js';

// ===== MODULE REGISTRY =====
const MODULES = {
    sensory: {
        key: 'sensory',
        name: 'Sensory Baby',
        icon: '👶',
        minAge: 0,
        maxAge: 1.5,
        component: SensoryModule,
        description: 'High-contrast visuals and sounds for infants'
    },
    explorer: {
        key: 'explorer',
        name: 'Toddler Explorer',
        icon: '🔍',
        minAge: 1.5,
        maxAge: 3.5,
        component: ExplorerModule,
        description: 'Colors, animals, and numbers for toddlers'
    },
    nepali: {
        key: 'nepali',
        name: 'Nepali Learning',
        icon: '🇳🇵',
        minAge: 2.0,
        maxAge: 6.0,
        component: NepaliModule,
        description: 'Learn Nepali alphabet, words, and phrases'
    },
    games: {
        key: 'games',
        name: 'Learning Games',
        icon: '🎮',
        minAge: 1.5,
        maxAge: 6.0,
        component: GamesModule,
        description: 'Fun educational games for all ages'
    }
};

// ===== APPLICATION STATE =====
const state = {
    currentAge: parseFloat(document.getElementById('app').dataset.age) || 0.8,
    sessionCount: StorageService.getSessionCount(),
    activeModuleKey: null,
    activeModuleInstance: null,
    language: LanguageService.getCurrentLanguage(),
    isInitialized: false
};

// ===== DOM REFERENCES =====
const elements = {
    mainContent: document.getElementById('main-content'),
    ageSlider: document.getElementById('ageSlider'),
    ageDisplay: document.getElementById('ageDisplay'),
    sessionCount: document.getElementById('sessionCount'),
    moduleIndicator: document.getElementById('moduleIndicator'),
    languageToggle: document.getElementById('languageToggle')
};

// ===== CORE FUNCTIONS =====

/**
 * Get modules available for the current age
 */
function getAvailableModules() {
    return Object.values(MODULES)
        .filter(module => 
            state.currentAge >= module.minAge && state.currentAge <= module.maxAge
        )
        .map(module => module.key);
}

/**
 * Get module metadata by key
 */
function getModuleMetadata(key) {
    return MODULES[key] || null;
}

/**
 * Render the module selection menu and active module
 */
function renderModuleMenu() {
    const availableKeys = getAvailableModules();
    
    if (availableKeys.length === 0) {
        elements.mainContent.innerHTML = `
            <div class="placeholder fade-in">
                <h2>🌱 Coming soon...</h2>
                <p>New activities will appear as your little one grows!</p>
                <p class="text-muted mt-2">Current age: ${AgeManager.formatAge(state.currentAge)}</p>
            </div>
        `;
        elements.moduleIndicator.textContent = 'No modules available';
        return;
    }

    // Build the module menu
    let menuHTML = `<div class="module-menu">`;
    
    availableKeys.forEach(key => {
        const module = getModuleMetadata(key);
        if (!module) return;
        
        const isActive = state.activeModuleKey === key;
        menuHTML += `
            <button class="module-btn ${isActive ? 'active' : ''}" data-module="${key}">
                <span class="module-icon">${module.icon}</span>
                ${LanguageService.translate(`module.${key}`)}
            </button>
        `;
    });
    
    menuHTML += `</div>`;
    menuHTML += `<div id="moduleContent" class="module-content fade-in"></div>`;
    
    elements.mainContent.innerHTML = menuHTML;

    // If no active module or active module not available, select the first one
    if (!state.activeModuleKey || !availableKeys.includes(state.activeModuleKey)) {
        state.activeModuleKey = availableKeys[0];
    }

    // Bind module selection events
    document.querySelectorAll('.module-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.dataset.module;
            if (key && key !== state.activeModuleKey) {
                loadModule(key);
            }
        });
    });

    // Load the active module
    loadModule(state.activeModuleKey);
}

/**
 * Load and render a specific module
 */
function loadModule(moduleKey) {
    const module = getModuleMetadata(moduleKey);
    if (!module) {
        console.error(`[App] Module "${moduleKey}" not found`);
        return;
    }

    // Clean up previous module
    if (state.activeModuleInstance && typeof state.activeModuleInstance.destroy === 'function') {
        state.activeModuleInstance.destroy();
    }

    // Update state
    state.activeModuleKey = moduleKey;
    state.activeModuleInstance = null;

    // Update UI
    document.querySelectorAll('.module-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.module === moduleKey);
    });
    
    elements.moduleIndicator.textContent = `${module.icon} ${module.name}`;

    // Get the content container
    const content = document.getElementById('moduleContent');
    if (!content) return;

    // Instantiate and render the module
    try {
        const instance = new module.component(content);
        instance.render();
        state.activeModuleInstance = instance;
        
        // Log for analytics
        console.log(`[App] Loaded module: ${moduleKey} (${module.name})`);
    } catch (error) {
        console.error(`[App] Error loading module "${moduleKey}":`, error);
        content.innerHTML = `
            <div class="placeholder">
                <h2>⚠️ Something went wrong</h2>
                <p>Could not load this module. Please try again.</p>
                <p class="text-muted" style="font-size: 0.8rem;">${error.message}</p>
            </div>
        `;
    }
}

/**
 * Update age and re-render
 */
function updateAge(newAge) {
    state.currentAge = Math.round(newAge * 10) / 10;
    
    // Update display
    elements.ageDisplay.textContent = AgeManager.formatAge(state.currentAge);
    elements.ageSlider.value = state.currentAge;
    
    // Save to storage
    StorageService.setUserAge(state.currentAge);
    
    // Re-render the module menu (which may change based on age)
    renderModuleMenu();
    
    // Update footer with next milestone
    const nextSteps = AgeManager.getNextSteps(state.currentAge);
    if (nextSteps && nextSteps.nextMilestoneAge) {
        const indicator = document.getElementById('moduleIndicator');
        if (indicator) {
            indicator.textContent = `${indicator.textContent.split('—')[0]} — Next: ${AgeManager.formatAge(nextSteps.nextMilestoneAge)}`;
        }
    }
}

/**
 * Update language and refresh current module
 */
function updateLanguage(lang) {
    state.language = lang;
    LanguageService.setLanguage(lang);
    
    // Update language toggle UI
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    // Reload current module to apply language changes
    if (state.activeModuleKey) {
        loadModule(state.activeModuleKey);
    }
    
    console.log(`[App] Language changed to: ${lang}`);
}

/**
 * Setup language toggle controls
 */
function setupLanguageToggle() {
    const container = document.getElementById('languageToggle');
    if (!container) return;
    
    const currentLang = state.language;
    
    container.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === currentLang);
        
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            if (lang && lang !== state.language) {
                updateLanguage(lang);
            }
        });
    });
}

/**
 * Setup age slider controls
 */
function setupAgeSlider() {
    const slider = elements.ageSlider;
    if (!slider) return;
    
    // Load saved age
    const savedAge = StorageService.getUserAge();
    if (savedAge !== null) {
        state.currentAge = savedAge;
        slider.value = savedAge;
        elements.ageDisplay.textContent = AgeManager.formatAge(savedAge);
    }
    
    slider.addEventListener('input', (e) => {
        const newAge = parseFloat(e.target.value);
        updateAge(newAge);
    });
}

/**
 * Update session counter
 */
function updateSessionCount() {
    const count = StorageService.incrementSession();
    if (elements.sessionCount) {
        elements.sessionCount.textContent = count;
    }
}

/**
 * Listen for language changes from other parts of the app
 */
function setupLanguageListener() {
    LanguageService.onLanguageChange((detail) => {
        // Update state
        state.language = detail.language;
        
        // Update UI
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === detail.language);
        });
        
        // Reload current module
        if (state.activeModuleKey) {
            loadModule(state.activeModuleKey);
        }
    });
}

/**
 * Handle window resize for responsive adjustments
 */
function handleResize() {
    // Optional: Add responsive adjustments here
}

/**
 * Keyboard shortcuts for accessibility
 */
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Alt+1-4 to switch modules
        if (e.altKey && e.key >= '1' && e.key <= '4') {
            const index = parseInt(e.key) - 1;
            const buttons = document.querySelectorAll('.module-btn');
            if (buttons[index]) {
                buttons[index].click();
                e.preventDefault();
            }
        }
        
        // Alt+L to focus language toggle
        if (e.altKey && e.key === 'l') {
            const firstLangBtn = document.querySelector('.lang-btn');
            if (firstLangBtn) {
                firstLangBtn.focus();
                e.preventDefault();
            }
        }
        
        // Alt+A to focus age slider
        if (e.altKey && e.key === 'a') {
            if (elements.ageSlider) {
                elements.ageSlider.focus();
                e.preventDefault();
            }
        }
    });
}

/**
 * Show keyboard shortcuts help
 */
function showHelp() {
    const help = `
Keyboard Shortcuts:
  Alt+1-4  - Switch between modules
  Alt+L    - Focus language toggle
  Alt+A    - Focus age slider
  Alt+H    - Show this help
    `;
    console.log(help);
    // Could show a modal here in the future
}

/**
 * Initialize the application
 */
function init() {
    if (state.isInitialized) {
        console.warn('[App] Already initialized');
        return;
    }
    
    console.log('[App] Initializing Little Explorer...');
    console.log(`[App] Age: ${AgeManager.formatAge(state.currentAge)}`);
    console.log(`[App] Language: ${state.language}`);
    
    // Setup age slider
    setupAgeSlider();
    
    // Setup language toggle
    setupLanguageToggle();
    
    // Setup language listener
    setupLanguageListener();
    
    // Update session count
    updateSessionCount();
    
    // Setup keyboard shortcuts
    setupKeyboardShortcuts();
    
    // Setup resize handler
    window.addEventListener('resize', handleResize);
    
    // Show help on Alt+H
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key === 'h') {
            showHelp();
            e.preventDefault();
        }
    });
    
    // Render the initial module menu
    renderModuleMenu();
    
    // Log next steps
    const nextSteps = AgeManager.getNextSteps(state.currentAge);
    if (nextSteps) {
        console.log('[App] Next steps:', nextSteps);
    }
    
    state.isInitialized = true;
    console.log('[App] Initialization complete!');
}

// ===== EXPOSE FOR DEBUGGING (optional) =====
if (import.meta.env?.MODE === 'development') {
    window.__APP = {
        state,
        modules: MODULES,
        actions: {
            loadModule,
            updateAge,
            updateLanguage,
            getAvailableModules
        }
    };
}

// ===== START THE APP =====
// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ===== EXPORT FOR TESTING =====
export {
    state,
    MODULES,
    getAvailableModules,
    loadModule,
    updateAge,
    updateLanguage,
    renderModuleMenu
};

console.log('✅ app.js loaded successfully!');
console.log('📦 Modules registered:', Object.keys(MODULES));
console.log('🔧 Services available:', {
    Storage: !!StorageService,
    AgeManager: !!AgeManager,
    LanguageService: !!LanguageService
});