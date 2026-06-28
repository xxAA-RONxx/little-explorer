/**
 * SENSORY MODULE - Minimal Working Version
 * For babies 0-18 months
 */
import { StorageService } from '../services/storage.js';

export class SensoryModule {
    constructor(container) {
        console.log('✅ SensoryModule constructor called');
        this.container = container;
        this.tapCount = StorageService.get('sensoryTaps', 0);
        this.colors = ['#FFB5C2', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#A0C4FF', '#BDB2FF'];
        this.emojis = ['⭐', '🌈', '🌸', '🦋', '🌺', '🐱', '🐼', '🦄'];
    }

    render() {
        console.log('✅ SensoryModule.render() called');
        
        if (!this.container) {
            console.error('❌ No container provided to SensoryModule');
            return;
        }

        this.container.innerHTML = `
            <div class="sensory-container">
                <div style="text-align:center;padding:2rem;">
                    <h2 style="color:#4A90D9;">👶 Sensory Play</h2>
                    <button id="sensoryButton" style="
                        width:200px;
                        height:200px;
                        border-radius:50%;
                        font-size:4rem;
                        background:white;
                        border:4px solid #A0C4FF;
                        cursor:pointer;
                        box-shadow:0 8px 32px rgba(0,0,0,0.1);
                        transition:transform 0.15s ease;
                    ">
                        🌈
                    </button>
                    <p style="margin-top:1rem;color:#7F8C8D;">👆 Tap the circle!</p>
                    <div style="margin-top:1rem;display:flex;gap:2rem;justify-content:center;">
                        <span>🎯 Taps: <strong id="tapCount">${this.tapCount}</strong></span>
                        <span>⭐ Stars: <strong id="starCount">${StorageService.getStars()}</strong></span>
                    </div>
                </div>
            </div>
        `;

        this.setupEvents();
    }

    setupEvents() {
        const button = document.getElementById('sensoryButton');
        const tapDisplay = document.getElementById('tapCount');
        const starDisplay = document.getElementById('starCount');
        
        if (!button) {
            console.error('❌ Button not found!');
            return;
        }

        const self = this;

        button.addEventListener('click', function() {
            // Update tap count
            self.tapCount++;
            StorageService.set('sensoryTaps', self.tapCount);
            if (tapDisplay) tapDisplay.textContent = self.tapCount;

            // Change color
            const randomColor = self.colors[Math.floor(Math.random() * self.colors.length)];
            document.body.style.background = randomColor;
            setTimeout(function() {
                document.body.style.background = '';
            }, 500);

            // Change emoji
            const newEmoji = self.emojis[Math.floor(Math.random() * self.emojis.length)];
            button.textContent = newEmoji;

            // Button animation
            button.style.transform = 'scale(0.8)';
            setTimeout(function() {
                button.style.transform = 'scale(1)';
            }, 150);

            // Every 10 taps, add a star
            if (self.tapCount % 10 === 0) {
                const stars = StorageService.addStar();
                if (starDisplay) starDisplay.textContent = stars;
                
                // Flash star display
                if (starDisplay) {
                    starDisplay.style.animation = 'pulse 0.5s ease';
                    setTimeout(function() {
                        starDisplay.style.animation = '';
                    }, 500);
                }
            }

            console.log('[Sensory] Tap #' + self.tapCount);
        });

        console.log('✅ Sensory events setup complete');
    }

    destroy() {
        console.log('✅ SensoryModule destroyed');
        document.body.style.background = '';
    }
}

console.log('✅ sensory.js loaded successfully');