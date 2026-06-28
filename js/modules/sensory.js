/**
 * Sensory Module - For babies 0-18 months
 * High-contrast visuals, simple interactions, cause-and-effect learning
 */
import { StorageService } from '../services/storage.js';

export class SensoryModule {
    constructor(container) {
        this.container = container;
        this.tapCount = 0;
        this.colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A8E6CF', '#FF8A5C', '#74B9FF', '#A29BFE'];
        this.emojis = ['👶', '🌟', '🐶', '🌈', '⭐', '🎈', '🌸', '🦋', '🐱', '🐼'];
        this.button = null;
        this.tapDisplay = null;
        this.boundHandleTap = null;
    }

    render() {
        this.container.innerHTML = `
            <div class="sensory-container">
                <button 
                    id="sensoryButton" 
                    class="sensory-button"
                    aria-label="Tap for fun colors and shapes"
                    title="Tap me!"
                >
                    👶
                </button>
                <p class="sensory-hint">👆 Tap the circle for fun!</p>
                <div class="sensory-stats">
                    <span>🎯 Taps: <strong id="tapCount">0</strong></span>
                    <span style="margin-left: 1rem;">⭐ Stars: <strong id="starCount">${StorageService.getStars()}</strong></span>
                </div>
            </div>
        `;

        this.button = document.getElementById('sensoryButton');
        this.tapDisplay = document.getElementById('tapCount');
        this.starDisplay = document.getElementById('starCount');

        // Load saved tap count
        this.tapCount = StorageService.get('sensoryTaps', 0);
        this.updateDisplay();

        // Bind events
        this.boundHandleTap = this.handleTap.bind(this);
        this.button.addEventListener('click', this.boundHandleTap);
        this.button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.handleTap();
            }
        });

        // Touch support for mobile
        this.button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleTap();
        });
    }

    handleTap() {
        // 1. Visual feedback - random color
        const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
        document.body.style.background = randomColor;
        document.body.style.transition = 'background 0.3s ease';
        
        setTimeout(() => {
            document.body.style.background = '';
        }, 400);

        // 2. Button animation
        this.button.style.transform = 'scale(0.75)';
        this.button.style.transition = 'transform 0.1s ease';
        setTimeout(() => {
            this.button.style.transform = 'scale(1)';
        }, 150);

        // 3. Change emoji
        const newEmoji = this.emojis[Math.floor(Math.random() * this.emojis.length)];
        this.button.textContent = newEmoji;

        // 4. Update counter
        this.tapCount += 1;
        StorageService.set('sensoryTaps', this.tapCount);
        this.updateDisplay();

        // 5. Every 10 taps, add a star
        if (this.tapCount % 10 === 0) {
            const newStarCount = StorageService.addStar();
            if (this.starDisplay) {
                this.starDisplay.textContent = newStarCount;
                this.starDisplay.style.animation = 'pulse 0.5s ease';
                setTimeout(() => {
                    this.starDisplay.style.animation = '';
                }, 500);
            }
        }

        // 6. Log for analytics (optional)
        console.log(`[Sensory] Tap #${this.tapCount}`);
    }

    updateDisplay() {
        if (this.tapDisplay) {
            this.tapDisplay.textContent = this.tapCount;
        }
        if (this.starDisplay) {
            this.starDisplay.textContent = StorageService.getStars();
        }
    }

    destroy() {
        if (this.button && this.boundHandleTap) {
            this.button.removeEventListener('click', this.boundHandleTap);
        }
        document.body.style.background = '';
    }
}