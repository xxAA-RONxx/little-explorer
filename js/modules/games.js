/**
 * Games Module - Age-appropriate educational games
 * Games automatically adapt based on the child's age
 */
import { StorageService } from '../services/storage.js';
import { LanguageService } from '../services/languageService.js';
import { AgeManager } from '../services/ageManager.js';

// ===== VOCABULARY DATA =====
const VOCABULARY = {
    animals: [
        ["कुकुर", "kukur", "dog", "🐕"],
        ["बिरालो", "biralo", "cat", "🐈"],
        ["गाई", "gai", "cow", "🐄"],
        ["हात्ती", "hatti", "elephant", "🐘"],
        ["सिंह", "singh", "lion", "🦁"],
        ["बाघ", "bagh", "tiger", "🐯"],
        ["घोडा", "ghoda", "horse", "🐴"],
        ["चरा", "chara", "bird", "🐦"],
        ["माछा", "macha", "fish", "🐟"],
        ["खरायो", "kharayo", "rabbit", "🐰"],
    ],
    colors: [
        ["रातो", "raato", "red", "🔴"],
        ["निलो", "nilo", "blue", "🔵"],
        ["हरियो", "hariyo", "green", "🟢"],
        ["पहेंलो", "pahelo", "yellow", "🟡"],
        ["सेतो", "seto", "white", "⚪"],
        ["कालो", "kalo", "black", "⚫"],
        ["सुन्तला", "suntala", "orange", "🟠"],
        ["बैजनी", "baijani", "purple", "🟣"],
    ],
    food: [
        ["पानी", "pani", "water", "💧"],
        ["दूध", "dudh", "milk", "🥛"],
        ["चिया", "chiya", "tea", "🍵"],
        ["कफी", "kaphi", "coffee", "☕"],
        ["भात", "bhat", "rice", "🍚"],
        ["रोटी", "roti", "bread", "🍞"],
        ["फलफूल", "phalphool", "fruits", "🍎"],
        ["तरकारी", "tarkari", "vegetables", "🥬"],
    ],
    body: [
        ["टाउको", "tauko", "head", "👤"],
        ["आँखा", "aankha", "eyes", "👀"],
        ["नाक", "naak", "nose", "👃"],
        ["मुख", "mukh", "mouth", "👄"],
        ["कान", "kaan", "ears", "👂"],
        ["हात", "haat", "arms", "💪"],
        ["खुट्टा", "khutta", "legs", "🦵"],
    ],
};

const ALL_WORDS = Object.values(VOCABULARY).flat();

// ===== TRANSLATIONS =====
const TRANSLATIONS = {
    'games': { en: '🎮 Learning Games', ne: '🎮 शिक्षण खेलहरू' },
    'selectGame': { en: 'Select a game to play!', ne: 'खेल्नको लागि खेल चयन गर्नुहोस्!' },
    'playAgain': { en: 'Play Again', ne: 'फेरि खेल्नुहोस्' },
    'correct': { en: 'Correct!', ne: 'सही!' },
    'tryAgain': { en: 'Try again!', ne: 'फेरि प्रयास गर्नुहोस्!' },
    'score': { en: 'Score', ne: 'स्कोर' },
    'level': { en: 'Level', ne: 'स्तर' },
    'tap': { en: 'Tap me!', ne: 'मलाई थिच्नुहोस्!' },
    'tapDiscover': { en: 'Tap & Discover', ne: 'थिच्नुहोस् र सिक्नुहोस्' },
    'peekaboo': { en: 'Peekaboo!', ne: 'पीकाबू!' },
    'colorBurst': { en: 'Color Burst', ne: 'रङ विस्फोट' },
    'animalSounds': { en: 'Animal Sounds', ne: 'जनावरको आवाज' },
    'findMatch': { en: 'Find & Match', ne: 'खोज्नुहोस् र मिलाउनुहोस्' },
    'memoryMatch': { en: 'Memory Match', ne: 'मेमोरी खेल' },
    'bingo': { en: 'Bingo', ne: 'बिङ्गो' },
    'spelling': { en: 'Spelling', ne: 'हिज्जे' },
    'storyTime': { en: 'Story Time', ne: 'कथा समय' },
};

export class GamesModule {
    constructor(container) {
        this.container = container;
        this.language = LanguageService.getCurrentLanguage();
        this.age = StorageService.getUserAge() || 0.8;
        this.currentGame = null;
        this.gameState = {};
        this.isRendered = false;
    }

    // ===== TRANSLATION HELPER =====
    t(key) {
        const lang = this.language === 'ne' ? 'ne' : 'en';
        return TRANSLATIONS[key]?.[lang] || key;
    }

    // ===== RENDER =====
    render() {
        const ageStage = AgeManager.getStage(this.age);
        const availableGames = this.getAvailableGames(ageStage);

        this.container.innerHTML = `
            <div class="games-module" data-language="${this.language}">
                <div class="games-header">
                    <div class="header-content">
                        <h2>${this.t('games')}</h2>
                        <p class="subtitle">${this.language === 'ne' ? 'उमेर अनुसारका खेलहरू' : 'Age-appropriate games'}</p>
                    </div>
                    <div class="age-indicator">
                        <span class="age-badge">${AgeManager.formatAge(this.age)}</span>
                        <span class="stage-badge">${ageStage}</span>
                    </div>
                </div>

                <div class="games-grid" id="gamesGrid">
                    ${availableGames.map(game => `
                        <div class="game-card" data-game="${game.id}">
                            <div class="game-icon">${game.icon}</div>
                            <h3>${game.title}</h3>
                            <p>${game.description}</p>
                            <div class="game-meta">
                                <span class="difficulty">${'⭐'.repeat(game.difficulty)}</span>
                                <span class="age-range">${game.ageRange}</span>
                            </div>
                            <button class="btn btn-primary play-btn" data-game="${game.id}">
                                ${this.language === 'ne' ? 'खेल्नुहोस्' : 'Play'}
                            </button>
                        </div>
                    `).join('')}
                </div>

                <div id="gameArea" class="game-area">
                    <p class="game-placeholder">${this.t('selectGame')}</p>
                </div>
            </div>
        `;

        this.isRendered = true;
        this.bindEvents();
    }

    // ===== GET AVAILABLE GAMES BY AGE =====
    getAvailableGames(stage) {
        const allGames = [
            {
                id: 'tap-baby',
                icon: '👆',
                title: this.t('tapDiscover'),
                description: this.language === 'ne' ? 'रङ र आवाज सिक्नुहोस्' : 'Learn colors and sounds',
                difficulty: 1,
                ageRange: '0-18 months',
                minAge: 0,
                maxAge: 1.5,
            },
            {
                id: 'peekaboo',
                icon: '👶',
                title: this.t('peekaboo'),
                description: this.language === 'ne' ? 'लुकाउने र देखाउने' : 'Hide and seek fun',
                difficulty: 1,
                ageRange: '0-18 months',
                minAge: 0,
                maxAge: 1.5,
            },
            {
                id: 'color-burst',
                icon: '🎨',
                title: this.t('colorBurst'),
                description: this.language === 'ne' ? 'रङ पहिचान गर्नुहोस्' : 'Identify colors',
                difficulty: 2,
                ageRange: '1-3 years',
                minAge: 1,
                maxAge: 3,
            },
            {
                id: 'animal-sounds',
                icon: '🐾',
                title: this.t('animalSounds'),
                description: this.language === 'ne' ? 'जनावर चिन्नुहोस्' : 'Learn animal names',
                difficulty: 2,
                ageRange: '1.5-3 years',
                minAge: 1.5,
                maxAge: 3.5,
            },
            {
                id: 'match-find',
                icon: '🔍',
                title: this.t('findMatch'),
                description: this.language === 'ne' ? 'जोडी मिलाउनुहोस्' : 'Match the pairs',
                difficulty: 2,
                ageRange: '2-4 years',
                minAge: 2,
                maxAge: 4,
            },
            {
                id: 'memory',
                icon: '🧠',
                title: this.t('memoryMatch'),
                description: this.language === 'ne' ? 'जोडी पत्ता लगाउनुहोस्' : 'Find the pairs',
                difficulty: 3,
                ageRange: '2.5-5 years',
                minAge: 2.5,
                maxAge: 5,
            },
            {
                id: 'bingo',
                icon: '🎯',
                title: this.t('bingo'),
                description: this.language === 'ne' ? 'सही शब्द छान्नुहोस्' : 'Choose the right word',
                difficulty: 3,
                ageRange: '3-6 years',
                minAge: 3,
                maxAge: 6,
            },
            {
                id: 'spelling',
                icon: '✏️',
                title: this.t('spelling'),
                description: this.language === 'ne' ? 'शब्दको हिज्जे मिलाउनुहोस्' : 'Spell the word',
                difficulty: 4,
                ageRange: '3.5-6 years',
                minAge: 3.5,
                maxAge: 6,
            },
            {
                id: 'story-time',
                icon: '📖',
                title: this.t('storyTime'),
                description: this.language === 'ne' ? 'नेपाली कथा पढ्नुहोस्' : 'Read Nepali stories',
                difficulty: 3,
                ageRange: '3-6 years',
                minAge: 3,
                maxAge: 6,
            }
        ];

        return allGames.filter(game => 
            this.age >= game.minAge && this.age <= game.maxAge
        );
    }

    // ===== BIND EVENTS =====
    bindEvents() {
        const self = this;
        document.querySelectorAll('.play-btn').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                const gameId = this.dataset.game || this.closest('.play-btn')?.dataset.game;
                if (gameId) {
                    self.loadGame(gameId);
                }
            });
        });
    }

    // ===== LOAD GAME =====
    loadGame(gameId) {
        const gameArea = document.getElementById('gameArea');
        if (!gameArea) return;

        const games = this.getAvailableGames(AgeManager.getStage(this.age));
        const game = games.find(g => g.id === gameId);
        
        if (game) {
            this.currentGame = gameId;
            const renderMethod = this.getGameRenderer(gameId);
            if (renderMethod) {
                renderMethod.call(this, gameArea);
                gameArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }

    // ===== GET GAME RENDERER =====
    getGameRenderer(gameId) {
        const renderers = {
            'tap-baby': this.renderTapGame,
            'peekaboo': this.renderPeekabooGame,
            'color-burst': this.renderColorBurstGame,
            'animal-sounds': this.renderAnimalGame,
            'match-find': this.renderMatchGame,
            'memory': this.renderMemoryGame,
            'bingo': this.renderBingoGame,
            'spelling': this.renderSpellingGame,
            'story-time': this.renderStoryGame,
        };
        return renderers[gameId] || null;
    }

    // ===== GAME 1: TAP BABY (0-18 months) =====
    renderTapGame(container) {
        const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A8E6CF', '#FF8A5C', '#74B9FF'];
        const emojis = ['🌟', '⭐', '🌈', '🎈', '🌸', '🦋'];
        const self = this;
        const lang = this.language;
        
        container.innerHTML = `
            <div class="game-container tap-game">
                <h3>👆 ${self.t('tapDiscover')}</h3>
                <div class="tap-area" id="tapArea">
                    <div class="tap-target" id="tapTarget">
                        <span class="tap-emoji">🌟</span>
                    </div>
                </div>
                <div class="game-stats">
                    <span>🎯 ${lang === 'ne' ? 'थिचाइहरू' : 'Taps'}: <strong id="tapCount">0</strong></span>
                    <span>⭐ ${lang === 'ne' ? 'स्टार' : 'Stars'}: <strong id="tapStars">${StorageService.getStars()}</strong></span>
                </div>
                <button class="btn btn-primary btn-sm" id="tapResetBtn">🔄 ${self.t('playAgain')}</button>
            </div>
        `;

        let tapCount = 0;
        const target = document.getElementById('tapTarget');
        const countDisplay = document.getElementById('tapCount');
        const starsDisplay = document.getElementById('tapStars');
        const tapArea = document.getElementById('tapArea');

        const handleTap = function() {
            tapCount++;
            countDisplay.textContent = tapCount;
            
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            tapArea.style.background = randomColor;
            setTimeout(function() { tapArea.style.background = ''; }, 300);
            
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            target.querySelector('.tap-emoji').textContent = randomEmoji;
            
            target.style.transform = 'scale(0.8)';
            setTimeout(function() { target.style.transform = 'scale(1)'; }, 150);
            
            if (tapCount % 5 === 0) {
                const stars = StorageService.addStar();
                starsDisplay.textContent = stars;
                starsDisplay.style.animation = 'pulse 0.5s ease';
                setTimeout(function() { starsDisplay.style.animation = ''; }, 500);
            }
        };

        target.addEventListener('click', handleTap);
        target.addEventListener('touchstart', function(e) {
            e.preventDefault();
            handleTap();
        });

        document.getElementById('tapResetBtn').addEventListener('click', function() {
            tapCount = 0;
            countDisplay.textContent = '0';
            target.querySelector('.tap-emoji').textContent = '🌟';
            tapArea.style.background = '';
        });
    }

    // ===== GAME 2: PEEKABOO (0-18 months) =====
    renderPeekabooGame(container) {
        const faces = ['😊', '😄', '😍', '🤗', '🥰', '😁'];
        const self = this;
        const lang = this.language;
        let currentFace = 0;

        container.innerHTML = `
            <div class="game-container peekaboo-game">
                <h3>👶 ${self.t('peekaboo')}</h3>
                <div class="peekaboo-area" id="peekabooArea">
                    <div class="peekaboo-container">
                        <div class="peekaboo-face" id="peekabooFace">😊</div>
                        <div class="peekaboo-hands" id="peekabooHands">
                            <span>🙌</span>
                        </div>
                    </div>
                </div>
                <div class="peekaboo-controls">
                    <button class="btn btn-primary" id="peekabooBtn">👋 ${lang === 'ne' ? 'देखाउनुहोस्' : 'Show'}</button>
                </div>
                <p class="game-hint">${lang === 'ne' ? 'बटन थिच्नुहोस् वा अनुहार थिच्नुहोस्' : 'Tap the button or the face'}</p>
                <div class="game-stats">
                    <span>⭐ ${lang === 'ne' ? 'स्टार' : 'Stars'}: <strong id="peekabooStars">${StorageService.getStars()}</strong></span>
                </div>
            </div>
        `;

        const face = document.getElementById('peekabooFace');
        const hands = document.getElementById('peekabooHands');
        const btn = document.getElementById('peekabooBtn');
        const starsDisplay = document.getElementById('peekabooStars');
        let isHidden = false;

        const togglePeekaboo = function() {
            isHidden = !isHidden;
            if (isHidden) {
                face.style.transform = 'scale(0)';
                hands.style.transform = 'scale(1)';
                btn.textContent = '🙈 ' + (lang === 'ne' ? 'लुकाउनुहोस्' : 'Hide');
                currentFace = (currentFace + 1) % faces.length;
            } else {
                face.style.transform = 'scale(1)';
                face.textContent = faces[currentFace];
                hands.style.transform = 'scale(0)';
                btn.textContent = '👋 ' + (lang === 'ne' ? 'देखाउनुहोस्' : 'Show');
                if (Math.random() < 0.3) {
                    const stars = StorageService.addStar();
                    starsDisplay.textContent = stars;
                }
            }
        };

        btn.addEventListener('click', togglePeekaboo);
        face.addEventListener('click', togglePeekaboo);
        hands.addEventListener('click', togglePeekaboo);
    }

    // ===== GAME 3: COLOR BURST (1-3 years) with Paint Explosion =====
renderColorBurstGame(container) {
    const colors = [
        { name: this.language === 'ne' ? 'रातो' : 'Red', hex: '#FF0000', nepali: 'रातो', rgb: [255, 0, 0] },
        { name: this.language === 'ne' ? 'निलो' : 'Blue', hex: '#0066FF', nepali: 'निलो', rgb: [0, 102, 255] },
        { name: this.language === 'ne' ? 'हरियो' : 'Green', hex: '#00CC00', nepali: 'हरियो', rgb: [0, 204, 0] },
        { name: this.language === 'ne' ? 'पहेंलो' : 'Yellow', hex: '#FFD700', nepali: 'पहेंलो', rgb: [255, 215, 0] },
        { name: this.language === 'ne' ? 'सेतो' : 'White', hex: '#FFFFFF', nepali: 'सेतो', rgb: [255, 255, 255] },
        { name: this.language === 'ne' ? 'कालो' : 'Black', hex: '#333333', nepali: 'कालो', rgb: [51, 51, 51] },
        { name: this.language === 'ne' ? 'सुन्तला' : 'Orange', hex: '#FF8C00', nepali: 'सुन्तला', rgb: [255, 140, 0] },
        { name: this.language === 'ne' ? 'बैजनी' : 'Purple', hex: '#8B00FF', nepali: 'बैजनी', rgb: [139, 0, 255] },
    ];

    const self = this;
    const lang = this.language;
    let currentColor = colors[Math.floor(Math.random() * colors.length)];
    let score = 0;
    let explosionCanvas = null;
    let explosionCtx = null;
    let particles = [];
    let animationFrame = null;

    container.innerHTML = `
        <div class="game-container color-burst-game">
            <h3>🎨 ${self.t('colorBurst')}</h3>
            <div class="color-display" id="colorDisplay" style="background: ${currentColor.hex};">
                <span class="color-name">${currentColor.name}</span>
                <span class="color-nepali">${currentColor.nepali}</span>
            </div>
            <div class="color-options" id="colorOptions">
                ${colors.map(function(c) {
                    const textColor = c.nepali === 'सेतो' ? '#333' : '#fff';
                    return `<button class="color-option" data-color="${c.nepali}" style="background: ${c.hex}; color: ${textColor};">
                        <span class="color-label">${c.name}</span>
                    </button>`;
                }).join('')}
            </div>
            <div class="game-stats">
                <span>🎯 ${lang === 'ne' ? 'स्कोर' : 'Score'}: <strong id="colorScore">0</strong></span>
                <span>⭐ ${lang === 'ne' ? 'स्टार' : 'Stars'}: <strong id="colorStars">${StorageService.getStars()}</strong></span>
            </div>
            <div id="colorFeedback" class="game-feedback"></div>
            <button class="btn btn-primary btn-sm" id="colorResetBtn">🔄 ${self.t('playAgain')}</button>
        </div>
        <div class="explosion-container" id="explosionContainer"></div>
    `;

    const display = document.getElementById('colorDisplay');
    const feedback = document.getElementById('colorFeedback');
    const scoreDisplay = document.getElementById('colorScore');
    const starsDisplay = document.getElementById('colorStars');
    const explosionContainer = document.getElementById('explosionContainer');

    // ===== PARTICLE SYSTEM =====
    class Particle {
        constructor(x, y, color, size) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.size = size || Math.random() * 20 + 5;
            this.speedX = (Math.random() - 0.5) * 25;
            this.speedY = (Math.random() - 0.5) * 25 - 5;
            this.gravity = 0.4;
            this.life = 1;
            this.decay = 0.005 + Math.random() * 0.015;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = (Math.random() - 0.5) * 10;
            this.shape = Math.random() > 0.5 ? 'circle' : 'splat';
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.speedY += this.gravity;
            this.speedX *= 0.99;
            this.speedY *= 0.99;
            this.life -= this.decay;
            this.rotation += this.rotationSpeed;
            return this.life > 0;
        }

        draw(ctx) {
            ctx.save();
            ctx.globalAlpha = this.life;
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            
            const size = this.size * this.life;
            
            if (this.shape === 'circle') {
                // Circular paint splat
                const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
                gradient.addColorStop(0, this.color);
                gradient.addColorStop(0.7, this.color);
                gradient.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(0, 0, size, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // Splat shape - irregular blob
                ctx.fillStyle = this.color;
                ctx.beginPath();
                const points = 8;
                for (let i = 0; i < points; i++) {
                    const angle = (i / points) * Math.PI * 2;
                    const radius = size * (0.6 + Math.random() * 0.4);
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.closePath();
                ctx.fill();
                
                // Add some splatter dots
                for (let i = 0; i < 5; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const dist = size * (0.5 + Math.random() * 0.8);
                    const dotSize = Math.random() * 4 + 2;
                    ctx.beginPath();
                    ctx.arc(
                        Math.cos(angle) * dist,
                        Math.sin(angle) * dist,
                        dotSize,
                        0,
                        Math.PI * 2
                    );
                    ctx.fill();
                }
            }
            
            ctx.restore();
        }
    }

    function createExplosion(x, y, color, count) {
        // Clear any existing explosion
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
        }
        particles = [];
        
        // Create explosion container and canvas
        explosionContainer.innerHTML = `
            <canvas id="explosionCanvas" class="explosion-canvas"></canvas>
        `;
        
        const canvas = document.getElementById('explosionCanvas');
        if (!canvas) return;
        
        // Position canvas over the display area
        const rect = display.getBoundingClientRect();
        const containerRect = explosionContainer.getBoundingClientRect();
        
        canvas.width = explosionContainer.clientWidth || 600;
        canvas.height = explosionContainer.clientHeight || 400;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        
        explosionCtx = canvas.getContext('2d');
        
        // Calculate center of the display
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Create particles
        const numParticles = count || 80;
        const colorHex = color.hex || color;
        const colorRgb = color.rgb || [255, 0, 0];
        
        // Create multiple colors from the same base
        const colors = [];
        for (let i = 0; i < 5; i++) {
            const brightness = 0.6 + Math.random() * 0.4;
            const r = Math.min(255, Math.round(colorRgb[0] * brightness + (1 - brightness) * 255));
            const g = Math.min(255, Math.round(colorRgb[1] * brightness + (1 - brightness) * 255));
            const b = Math.min(255, Math.round(colorRgb[2] * brightness + (1 - brightness) * 255));
            colors.push(`rgb(${r}, ${g}, ${b})`);
        }
        
        for (let i = 0; i < numParticles; i++) {
            const size = Math.random() * 25 + 5;
            const pColor = colors[Math.floor(Math.random() * colors.length)];
            const particle = new Particle(
                centerX + (Math.random() - 0.5) * 40,
                centerY + (Math.random() - 0.5) * 40,
                pColor,
                size
            );
            particle.speedX = (Math.random() - 0.5) * 30;
            particle.speedY = (Math.random() - 0.5) * 30 - 8;
            particles.push(particle);
        }
        
        // Add some small sparkle particles
        for (let i = 0; i < 30; i++) {
            const size = Math.random() * 4 + 1;
            const pColor = Math.random() > 0.5 ? '#FFFFFF' : colorHex;
            const particle = new Particle(
                centerX + (Math.random() - 0.5) * 20,
                centerY + (Math.random() - 0.5) * 20,
                pColor,
                size
            );
            particle.speedX = (Math.random() - 0.5) * 35;
            particle.speedY = (Math.random() - 0.5) * 35 - 10;
            particle.shape = 'circle';
            particle.decay = 0.01 + Math.random() * 0.02;
            particles.push(particle);
        }
        
        // Animate
        function animateExplosion() {
            if (!explosionCtx) return;
            
            // Clear with a slight trail effect for motion blur
            explosionCtx.fillStyle = 'rgba(0,0,0,0)';
            explosionCtx.clearRect(0, 0, canvas.width, canvas.height);
            
            let alive = false;
            particles.forEach(function(p) {
                const isAlive = p.update();
                if (isAlive) {
                    alive = true;
                    p.draw(explosionCtx);
                }
            });
            
            if (alive) {
                animationFrame = requestAnimationFrame(animateExplosion);
            } else {
                // Fade out the container
                explosionContainer.style.transition = 'opacity 0.5s ease';
                explosionContainer.style.opacity = '0';
                setTimeout(function() {
                    explosionContainer.innerHTML = '';
                    explosionContainer.style.opacity = '1';
                }, 500);
            }
        }
        
        animateExplosion();
    }

    // ===== GAME LOGIC =====
    const updateColor = function() {
        currentColor = colors[Math.floor(Math.random() * colors.length)];
        display.style.background = currentColor.hex;
        display.querySelector('.color-name').textContent = currentColor.name;
        display.querySelector('.color-nepali').textContent = currentColor.nepali;
        feedback.textContent = '';
        feedback.className = 'game-feedback';
        document.querySelectorAll('.color-option').forEach(function(btn) { btn.disabled = false; });
    };

    document.querySelectorAll('.color-option').forEach(function(btn) {
        btn.addEventListener('click', function() {
            if (this.disabled) return;
            const selected = this.dataset.color;
            const correct = currentColor.nepali;
            document.querySelectorAll('.color-option').forEach(function(b) { b.disabled = true; });
            
            if (selected === correct) {
                score++;
                scoreDisplay.textContent = score;
                feedback.textContent = '✅ ' + self.t('correct');
                feedback.className = 'game-feedback correct';
                
                // 🎨 CREATE THE EXPLOSION!
                createExplosion(
                    display.offsetLeft + display.offsetWidth / 2,
                    display.offsetTop + display.offsetHeight / 2,
                    currentColor,
                    100
                );
                
                if (score % 3 === 0) {
    const stars = StorageService.addStar();
    starsDisplay.textContent = stars;
                }
                
                setTimeout(updateColor, 1200);
            } else {
                feedback.textContent = '❌ ' + self.t('tryAgain');
                feedback.className = 'game-feedback wrong';
                this.style.opacity = '0.5';
                this.style.transform = 'scale(0.9)';
                setTimeout(function() {
                    this.style.opacity = '1';
                    this.style.transform = 'scale(1)';
                    this.disabled = false;
                    feedback.textContent = '';
                    feedback.className = 'game-feedback';
                }.bind(this), 800);
            }
        });
    });

    document.getElementById('colorResetBtn').addEventListener('click', function() {
        score = 0;
        scoreDisplay.textContent = '0';
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
        }
        explosionContainer.innerHTML = '';
        updateColor();
    });

    updateColor();
}

    // ===== GAME 4: ANIMAL SOUNDS (1.5-3 years) =====
    renderAnimalGame(container) {
        const animals = [
            { name: this.language === 'ne' ? 'कुकुर' : 'Dog', emoji: '🐕', nepali: 'कुकुर', sound: 'bark bark' },
            { name: this.language === 'ne' ? 'बिरालो' : 'Cat', emoji: '🐈', nepali: 'बिरालो', sound: 'meow meow' },
            { name: this.language === 'ne' ? 'गाई' : 'Cow', emoji: '🐄', nepali: 'गाई', sound: 'moo moo' },
            { name: this.language === 'ne' ? 'हात्ती' : 'Elephant', emoji: '🐘', nepali: 'हात्ती', sound: 'trumpet' },
            { name: this.language === 'ne' ? 'सिंह' : 'Lion', emoji: '🦁', nepali: 'सिंह', sound: 'roar' },
            { name: this.language === 'ne' ? 'घोडा' : 'Horse', emoji: '🐴', nepali: 'घोडा', sound: 'neigh' },
        ];

        const self = this;
        const lang = this.language;
        let currentAnimal = animals[Math.floor(Math.random() * animals.length)];
        let score = 0;

        container.innerHTML = `
            <div class="game-container animal-game">
                <h3>🐾 ${self.t('animalSounds')}</h3>
                <div class="animal-display" id="animalDisplay">
                    <span class="animal-emoji">${currentAnimal.emoji}</span>
                    <span class="animal-name">${currentAnimal.name}</span>
                    <span class="animal-sound">${currentAnimal.sound}</span>
                </div>
                <div class="animal-options" id="animalOptions">
                    ${animals.map(function(a) {
                        return `<button class="animal-option" data-animal="${a.nepali}">
                            <span class="animal-emoji">${a.emoji}</span>
                            <span class="animal-label">${a.name}</span>
                        </button>`;
                    }).join('')}
                </div>
                <div class="game-stats">
                    <span>🎯 ${lang === 'ne' ? 'स्कोर' : 'Score'}: <strong id="animalScore">0</strong></span>
                    <span>⭐ ${lang === 'ne' ? 'स्टार' : 'Stars'}: <strong id="animalStars">${StorageService.getStars()}</strong></span>
                </div>
                <div id="animalFeedback" class="game-feedback"></div>
                <button class="btn btn-primary btn-sm" id="animalResetBtn">🔄 ${self.t('playAgain')}</button>
            </div>
        `;

        const feedback = document.getElementById('animalFeedback');
        const scoreDisplay = document.getElementById('animalScore');
        const starsDisplay = document.getElementById('animalStars');

        const updateAnimal = function() {
            const remaining = animals.filter(function(a) { return a.nepali !== currentAnimal.nepali; });
            currentAnimal = remaining[Math.floor(Math.random() * remaining.length)] || animals[0];
            const display = document.getElementById('animalDisplay');
            display.querySelector('.animal-emoji').textContent = currentAnimal.emoji;
            display.querySelector('.animal-name').textContent = currentAnimal.name;
            display.querySelector('.animal-sound').textContent = currentAnimal.sound;
            feedback.textContent = '';
            feedback.className = 'game-feedback';
            document.querySelectorAll('.animal-option').forEach(function(btn) { btn.disabled = false; });
        };

        document.querySelectorAll('.animal-option').forEach(function(btn) {
            btn.addEventListener('click', function() {
                if (this.disabled) return;
                const selected = this.dataset.animal;
                const correct = currentAnimal.nepali;
                document.querySelectorAll('.animal-option').forEach(function(b) { b.disabled = true; });
                
                if (selected === correct) {
                    score++;
                    scoreDisplay.textContent = score;
                    feedback.textContent = '✅ ' + self.t('correct');
                    feedback.className = 'game-feedback correct';
                    if (score % 3 === 0) {
                        const stars = StorageService.addStar();
                        starsDisplay.textContent = stars;
                    }
                    setTimeout(updateAnimal, 800);
                } else {
                    feedback.textContent = '❌ ' + self.t('tryAgain');
                    feedback.className = 'game-feedback wrong';
                    this.style.opacity = '0.5';
                    setTimeout(function() {
                        this.style.opacity = '1';
                        this.disabled = false;
                        feedback.textContent = '';
                        feedback.className = 'game-feedback';
                    }.bind(this), 800);
                }
            });
        });

        document.getElementById('animalResetBtn').addEventListener('click', function() {
            score = 0;
            scoreDisplay.textContent = '0';
            updateAnimal();
        });
    }

    // ===== GAME 5: FIND & MATCH (2-4 years) =====
    renderMatchGame(container) {
        const words = [...ALL_WORDS].sort(function() { return Math.random() - 0.5; }).slice(0, 6);
        const items = words.map(function(w) { return { nepali: w[0], english: w[2] }; });
        const nepaliItems = [...items].sort(function() { return Math.random() - 0.5; });
        const englishItems = [...items].sort(function() { return Math.random() - 0.5; });
        const self = this;
        const lang = this.language;

        container.innerHTML = `
            <div class="game-container match-game">
                <h3>🔍 ${self.t('findMatch')}</h3>
                <p class="game-hint">${lang === 'ne' ? 'नेपाली र अङ्ग्रेजी मिलाउनुहोस्' : 'Match Nepali to English'}</p>
                <div class="match-grid">
                    <div class="match-column">
                        <h4>🇳🇵 ${lang === 'ne' ? 'नेपाली' : 'Nepali'}</h4>
                        ${nepaliItems.map(function(item, idx) {
                            return `<div class="match-item" data-nepali="${item.nepali}" data-idx="${idx}">${item.nepali}</div>`;
                        }).join('')}
                    </div>
                    <div class="match-column">
                        <h4>🇬🇧 ${lang === 'ne' ? 'अङ्ग्रेजी' : 'English'}</h4>
                        ${englishItems.map(function(item, idx) {
                            return `<div class="match-item" data-english="${item.english}" data-idx="${idx}">${item.english}</div>`;
                        }).join('')}
                    </div>
                </div>
                <div id="matchFeedback" class="game-feedback"></div>
                <div class="game-stats">
                    <span>✅ ${lang === 'ne' ? 'मिलाइयो' : 'Matched'}: <strong id="matchCount">0</strong>/${items.length}</span>
                    <span>⭐ ${lang === 'ne' ? 'स्टार' : 'Stars'}: <strong id="matchStars">${StorageService.getStars()}</strong></span>
                </div>
                <button class="btn btn-primary btn-sm" id="matchResetBtn">🔄 ${self.t('playAgain')}</button>
            </div>
        `;

        let selectedNepali = null;
        let selectedEnglish = null;
        let matchedPairs = 0;
        const totalPairs = items.length;
        const feedback = document.getElementById('matchFeedback');
        const matchCount = document.getElementById('matchCount');
        const starsDisplay = document.getElementById('matchStars');

        document.querySelectorAll('.match-item').forEach(function(el) {
            el.addEventListener('click', function() {
                const isNepali = this.dataset.nepali !== undefined;
                if (this.classList.contains('matched')) return;
                
                if (isNepali) {
                    if (selectedNepali) selectedNepali.classList.remove('selected');
                    selectedNepali = this;
                    this.classList.add('selected');
                } else {
                    if (selectedEnglish) selectedEnglish.classList.remove('selected');
                    selectedEnglish = this;
                    this.classList.add('selected');
                }
                
                if (selectedNepali && selectedEnglish) {
                    const nepaliWord = selectedNepali.dataset.nepali;
                    const englishWord = selectedEnglish.dataset.english;
                    const match = items.find(function(i) { return i.nepali === nepaliWord && i.english === englishWord; });
                    
                    if (match) {
                        selectedNepali.classList.add('matched');
                        selectedNepali.classList.remove('selected');
                        selectedEnglish.classList.add('matched');
                        selectedEnglish.classList.remove('selected');
                        matchedPairs++;
                        matchCount.textContent = matchedPairs;
                        feedback.textContent = '✅ ' + self.t('correct');
                        feedback.className = 'game-feedback correct';
                        if (matchedPairs === totalPairs) {
                            feedback.textContent = '🎉 ' + (lang === 'ne' ? 'सबै मिल्यो! ⭐' : 'All matched! ⭐');
                            const stars = StorageService.addStar();
                            starsDisplay.textContent = stars;
                        }
                        selectedNepali = null;
                        selectedEnglish = null;
                    } else {
                        feedback.textContent = '❌ ' + self.t('tryAgain');
                        feedback.className = 'game-feedback wrong';
                        setTimeout(function() {
                            selectedNepali.classList.remove('selected');
                            selectedEnglish.classList.remove('selected');
                            selectedNepali = null;
                            selectedEnglish = null;
                            feedback.textContent = '';
                            feedback.className = 'game-feedback';
                        }, 800);
                    }
                }
            });
        });

        document.getElementById('matchResetBtn').addEventListener('click', function() {
            self.renderMatchGame(container);
        });
    }

    // ===== GAME 6: MEMORY MATCH (2.5-5 years) =====
    renderMemoryGame(container) {
        const words = [...ALL_WORDS].sort(function() { return Math.random() - 0.5; }).slice(0, 6);
        const cards = [];
        words.forEach(function(w) {
            cards.push({ id: w[0] + '-nepali', text: w[0], pair: w[0] });
            cards.push({ id: w[2] + '-english', text: w[2], pair: w[0] });
        });
        const shuffledCards = cards.sort(function() { return Math.random() - 0.5; });
        const self = this;
        const lang = this.language;

        container.innerHTML = `
            <div class="game-container memory-game">
                <h3>🧠 ${self.t('memoryMatch')}</h3>
                <p class="game-hint">${lang === 'ne' ? 'जोडी मिलाउनुहोस्' : 'Find the matching pairs'}</p>
                <div class="memory-grid">
                    ${shuffledCards.map(function(card, idx) {
                        return `<div class="memory-card" data-pair="${card.pair}" data-idx="${idx}">
                            <span class="card-content">${card.text}</span>
                        </div>`;
                    }).join('')}
                </div>
                <div class="game-stats">
                    <span>✅ ${lang === 'ne' ? 'जोडी' : 'Pairs'}: <strong id="memoryPairs">0</strong>/${words.length}</span>
                    <span>⭐ ${lang === 'ne' ? 'स्टार' : 'Stars'}: <strong id="memoryStars">${StorageService.getStars()}</strong></span>
                </div>
                <div id="memoryFeedback" class="game-feedback"></div>
                <button class="btn btn-primary btn-sm" id="memoryResetBtn">🔄 ${self.t('playAgain')}</button>
            </div>
        `;

        let flippedCards = [];
        let matchedPairs = 0;
        const totalPairs = words.length;
        const feedback = document.getElementById('memoryFeedback');
        const pairsDisplay = document.getElementById('memoryPairs');
        const starsDisplay = document.getElementById('memoryStars');

        document.querySelectorAll('.memory-card').forEach(function(card) {
            card.addEventListener('click', function() {
                if (this.classList.contains('flipped') || this.classList.contains('matched')) return;
                if (flippedCards.length === 2) return;

                this.classList.add('flipped');
                flippedCards.push(this);

                if (flippedCards.length === 2) {
                    const pair1 = flippedCards[0].dataset.pair;
                    const pair2 = flippedCards[1].dataset.pair;

                    if (pair1 === pair2) {
                        flippedCards.forEach(function(c) { c.classList.add('matched'); });
                        matchedPairs++;
                        pairsDisplay.textContent = matchedPairs;
                        feedback.textContent = '✅ ' + self.t('correct');
                        feedback.className = 'game-feedback correct';
                        flippedCards = [];

                        if (matchedPairs === totalPairs) {
                            feedback.textContent = '🎉 ' + (lang === 'ne' ? 'सबै जोडी मिल्यो! ⭐' : 'All pairs matched! ⭐');
                            const stars = StorageService.addStar();
                            starsDisplay.textContent = stars;
                        }
                    } else {
                        feedback.textContent = '❌ ' + self.t('tryAgain');
                        feedback.className = 'game-feedback wrong';
                        setTimeout(function() {
                            flippedCards.forEach(function(c) { c.classList.remove('flipped'); });
                            flippedCards = [];
                            feedback.textContent = '';
                            feedback.className = 'game-feedback';
                        }, 800);
                    }
                }
            });
        });

        document.getElementById('memoryResetBtn').addEventListener('click', function() {
            self.renderMemoryGame(container);
        });
    }

    // ===== GAME 7: BINGO (3-6 years) =====
    renderBingoGame(container) {
        const word = ALL_WORDS[Math.floor(Math.random() * ALL_WORDS.length)];
        const [nepali, phonetic, english] = word;
        
        const wrongOptions = ALL_WORDS
            .filter(function(w) { return w[2] !== english; })
            .sort(function() { return Math.random() - 0.5; })
            .slice(0, 3)
            .map(function(w) { return w[2]; });
        
        const options = [english, ...wrongOptions].sort(function() { return Math.random() - 0.5; });
        const self = this;
        const lang = this.language;

        container.innerHTML = `
            <div class="game-container bingo-game">
                <h3>🎯 ${self.t('bingo')}</h3>
                <p class="game-hint">${lang === 'ne' ? 'सही अर्थ छान्नुहोस्' : 'Select the correct meaning'}</p>
                <div class="bingo-word">
                    <span class="nepali-display">${nepali}</span>
                    <span class="phonetic-display">(${phonetic})</span>
                </div>
                <div class="bingo-options">
                    ${options.map(function(opt) {
                        return `<button class="bingo-option" data-answer="${opt}">${opt}</button>`;
                    }).join('')}
                </div>
                <div class="game-stats">
                    <span>✅ ${lang === 'ne' ? 'सही' : 'Correct'}: <strong id="bingoCorrect">0</strong></span>
                    <span>⭐ ${lang === 'ne' ? 'स्टार' : 'Stars'}: <strong id="bingoStars">${StorageService.getStars()}</strong></span>
                </div>
                <div id="bingoFeedback" class="game-feedback"></div>
                <button class="btn btn-success btn-sm" id="bingoNextBtn">${lang === 'ne' ? 'अर्को' : 'Next'}</button>
            </div>
        `;

        let correctCount = 0;
        const feedback = document.getElementById('bingoFeedback');
        const correctDisplay = document.getElementById('bingoCorrect');
        const starsDisplay = document.getElementById('bingoStars');
        let answered = false;

        document.querySelectorAll('.bingo-option').forEach(function(btn) {
            btn.addEventListener('click', function() {
                if (answered) return;
                answered = true;
                
                if (this.dataset.answer === english) {
                    this.classList.add('correct');
                    correctCount++;
                    correctDisplay.textContent = correctCount;
                    feedback.textContent = '✅ ' + self.t('correct');
                    feedback.className = 'game-feedback correct';
                    if (correctCount % 3 === 0) {
                        const stars = StorageService.addStar();
                        starsDisplay.textContent = stars;
                    }
                } else {
                    this.classList.add('wrong');
                    feedback.textContent = '❌ ' + (lang === 'ne' ? 'सही: "' + english + '"' : 'Correct: "' + english + '"');
                    feedback.className = 'game-feedback wrong';
                    document.querySelectorAll('.bingo-option').forEach(function(b) {
                        if (b.dataset.answer === english) b.classList.add('correct');
                    });
                }
                document.querySelectorAll('.bingo-option').forEach(function(b) { b.disabled = true; });
            });
        });

        document.getElementById('bingoNextBtn').addEventListener('click', function() {
            self.renderBingoGame(container);
        });
    }

    // ===== GAME 8: SPELLING (3.5-6 years) =====
    renderSpellingGame(container) {
        const word = ALL_WORDS[Math.floor(Math.random() * ALL_WORDS.length)];
        const [nepali, phonetic, english] = word;
        
        const scramble = function(str) {
            const arr = str.split('');
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr.join('');
        };

        const scrambled = scramble(english);
        const self = this;
        const lang = this.language;

        container.innerHTML = `
            <div class="game-container spelling-game">
                <h3>✏️ ${self.t('spelling')}</h3>
                <div class="spelling-word">
                    <span class="nepali-display">${nepali}</span>
                    <span class="phonetic-display">(${phonetic})</span>
                </div>
                <div class="spelling-hint">
                    💡 ${lang === 'ne' ? 'सङ्केत' : 'Hint'}: ${scrambled}
                </div>
                <div class="spelling-input">
                    <input type="text" id="spellingInput" placeholder="${lang === 'ne' ? 'हिज्जे लेख्नुहोस्' : 'Type the spelling'}">
                    <button class="btn btn-primary" id="spellingCheckBtn">${self.t('check')}</button>
                </div>
                <div class="game-stats">
                    <span>✅ ${lang === 'ne' ? 'सही' : 'Correct'}: <strong id="spellingCorrect">0</strong></span>
                    <span>⭐ ${lang === 'ne' ? 'स्टार' : 'Stars'}: <strong id="spellingStars">${StorageService.getStars()}</strong></span>
                </div>
                <div id="spellingFeedback" class="game-feedback"></div>
                <button class="btn btn-success btn-sm" id="spellingNextBtn">${lang === 'ne' ? 'अर्को' : 'Next'}</button>
            </div>
        `;

        let correctCount = 0;
        const input = document.getElementById('spellingInput');
        const checkBtn = document.getElementById('spellingCheckBtn');
        const feedback = document.getElementById('spellingFeedback');
        const nextBtn = document.getElementById('spellingNextBtn');
        const correctDisplay = document.getElementById('spellingCorrect');
        const starsDisplay = document.getElementById('spellingStars');

        const checkSpelling = function() {
            const userAnswer = input.value.trim().toLowerCase();
            const correct = english.toLowerCase();
            
            if (userAnswer === correct) {
                correctCount++;
                correctDisplay.textContent = correctCount;
                feedback.textContent = '✅ ' + self.t('correct');
                feedback.className = 'game-feedback correct';
                input.disabled = true;
                checkBtn.disabled = true;
                if (correctCount % 2 === 0) {
                    const stars = StorageService.addStar();
                    starsDisplay.textContent = stars;
                }
            } else {
                feedback.textContent = '❌ ' + (lang === 'ne' ? 'सही: "' + english + '"' : 'Correct: "' + english + '"');
                feedback.className = 'game-feedback wrong';
                input.value = '';
                input.focus();
            }
        };

        checkBtn.addEventListener('click', checkSpelling);
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') checkSpelling();
        });

        nextBtn.addEventListener('click', function() {
            self.renderSpellingGame(container);
        });
    }

    // ===== GAME 9: STORY TIME (3-6 years) =====
    renderStoryGame(container) {
        const stories = [
            {
                title: this.language === 'ne' ? 'सानो खरायो' : 'Little Rabbit',
                nepali: 'एउटा सानो खरायो थियो। उसलाई गाजर खान मन पर्थ्यो। एक दिन ऊ बगैंचामा गयो र धेरै गाजर खायो। ऊ धेरै खुसी भयो।',
                english: 'There was a little rabbit. He loved to eat carrots. One day he went to the garden and ate many carrots. He was very happy.',
                emoji: '🐰'
            },
            {
                title: this.language === 'ne' ? 'मेरो परिवार' : 'My Family',
                nepali: 'मेरो परिवारमा चार जना छन्। बुबा, आमा, दिदी र म। हामी सँगै खान्छौं र सँगै खेल्छौं। म आफ्नो परिवारलाई माया गर्छु।',
                english: 'There are four people in my family. Father, mother, sister and me. We eat together and play together. I love my family.',
                emoji: '👨‍👩‍👧‍👦'
            },
            {
                title: this.language === 'ne' ? 'रङहरू' : 'Colors',
                nepali: 'आकाश निलो छ। घाँस हरियो छ। सूर्य पहेंलो छ। फूल रातो, निलो र पहेंलो छन्। संसार रङ्गीन छ।',
                english: 'The sky is blue. The grass is green. The sun is yellow. Flowers are red, blue and yellow. The world is colorful.',
                emoji: '🌈'
            },
            {
                title: this.language === 'ne' ? 'मेरो स्कूल' : 'My School',
                nepali: 'म स्कूल जान्छु। मेरो स्कूल ठुलो छ। त्यहाँ धेरै साथीहरू छन्। हामी पढ्छौं र खेल्छौं। मलाई स्कूल मन पर्छ।',
                english: 'I go to school. My school is big. There are many friends there. We study and play. I like school.',
                emoji: '🏫'
            }
        ];

        const story = stories[Math.floor(Math.random() * stories.length)];
        const showNepali = this.language === 'ne' || this.language === 'bilingual';
        const showEnglish = this.language === 'en' || this.language === 'bilingual';
        const self = this;
        const lang = this.language;

        container.innerHTML = `
            <div class="game-container story-game">
                <h3>📖 ${story.emoji} ${story.title}</h3>
                <div class="story-content">
                    ${showNepali ? `
                        <div class="story-text nepali">
                            <h4>🇳🇵 ${lang === 'ne' ? 'नेपाली' : 'Nepali'}</h4>
                            <p>${story.nepali}</p>
                        </div>
                    ` : ''}
                    ${showEnglish ? `
                        <div class="story-text english">
                            <h4>🇬🇧 ${lang === 'ne' ? 'अङ्ग्रेजी' : 'English'}</h4>
                            <p>${story.english}</p>
                        </div>
                    ` : ''}
                </div>
                <div class="story-words">
                    <h4>📝 ${lang === 'ne' ? 'महत्त्वपूर्ण शब्दहरू' : 'Key Words'}</h4>
                    <div class="word-tags">
                        ${story.english.split(' ').filter(function(w) { return w.length > 3; }).slice(0, 6).map(function(w) {
                            return `<span class="word-tag">${w}</span>`;
                        }).join('')}
                    </div>
                </div>
                <div class="game-stats">
                    <span>⭐ ${lang === 'ne' ? 'स्टार' : 'Stars'}: <strong>${StorageService.getStars()}</strong></span>
                </div>
                <button class="btn btn-success btn-sm" id="storyNextBtn">${lang === 'ne' ? 'अर्को कथा' : 'Next Story'}</button>
            </div>
        `;

        document.getElementById('storyNextBtn').addEventListener('click', function() {
            self.renderStoryGame(container);
        });

        setTimeout(function() {
            if (Math.random() < 0.5) {
                const stars = StorageService.addStar();
                const starDisplay = container.querySelector('.game-stats strong');
                if (starDisplay) starDisplay.textContent = stars;
            }
        }, 3000);
    }

    // ===== DESTROY =====
    destroy() {
        this.isRendered = false;
        console.log('[Games] Module destroyed');
    }
}