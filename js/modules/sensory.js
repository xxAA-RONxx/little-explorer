/**
 * Sensory Module - For babies 0-18 months
 * Multiple activities: Tap, Color Flash, Peekaboo, Animal Parade, Twinkle Stars
 * Soft, pastel color palette inspired by Bluey theme
 */
import { StorageService } from '../services/storage.js';

export class SensoryModule {
    constructor(container) {
        this.container = container;
        this.tapCount = 0;
        this.currentActivity = 'tap';
        
        this.colors = [
            '#FFB5C2', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#A0C4FF', '#BDB2FF',
            '#FFC6FF', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA', '#F5C6D0'
        ];
        
        this.emojis = ['⭐', '🌈', '🌸', '🦋', '🌺', '🐱', '🐼', '🦄', '🌼', '🎈', '☁️', '🐨'];
        
        this.animals = [
            { emoji: '🐕', sound: 'woof!', name: 'Dog' },
            { emoji: '🐈', sound: 'meow!', name: 'Cat' },
            { emoji: '🐄', sound: 'moo!', name: 'Cow' },
            { emoji: '🐘', sound: 'trumpet!', name: 'Elephant' },
            { emoji: '🦁', sound: 'roar!', name: 'Lion' },
            { emoji: '🐴', sound: 'neigh!', name: 'Horse' },
            { emoji: '🐦', sound: 'chirp!', name: 'Bird' },
            { emoji: '🐰', sound: 'hop!', name: 'Rabbit' },
        ];
        
        this.faces = ['😊', '😄', '😍', '🤗', '🥰', '😁'];
        this.button = null;
        this.boundHandleTap = null;
        this.animationFrame = null;
        this._cleanupColorActivity = null;
        this._audioContext = null;
    }

    // ... (keep the render, switchActivity, renderTapActivity, setupTapActivity, handleTap methods as before)

    // ===== ACTIVITY 2: COLOR FLASH (Fixed Audio) =====
    renderColorActivity() {
        return `
            <div class="color-activity">
                <div class="color-flash-area" id="colorFlashArea">
                    <div class="color-display-box" id="colorDisplayBox">
                        <span class="color-emoji">🎨</span>
                        <span class="color-name" id="colorName">Tap to start!</span>
                    </div>
                </div>
                <div class="color-controls">
                    <button class="btn btn-primary" id="colorFlashBtn">🌈 Gentle Colors</button>
                    <button class="btn btn-secondary" id="colorStopBtn">⏹ Stop</button>
                </div>
                <p class="activity-hint">🌈 Watch the gentle colors flow! Tap to start.</p>
            </div>
        `;
    }

    setupColorActivity() {
        var flashBtn = document.getElementById('colorFlashBtn');
        var stopBtn = document.getElementById('colorStopBtn');
        var displayBox = document.getElementById('colorDisplayBox');
        var colorNameEl = document.getElementById('colorName');
        var isFlashing = false;
        var flashInterval = null;
        var transitionSpeed = 1200;
        var self = this;

        var colorInfo = {
            '#FFB5C2': { name: 'Soft Pink', nepali: 'गुलाबी', emoji: '🌸' },
            '#FFD6A5': { name: 'Peach', nepali: 'सुन्तला', emoji: '🍑' },
            '#FDFFB6': { name: 'Cream', nepali: 'पहेंलो', emoji: '🌼' },
            '#CAFFBF': { name: 'Mint', nepali: 'हरियो', emoji: '🌿' },
            '#A0C4FF': { name: 'Sky Blue', nepali: 'निलो', emoji: '☁️' },
            '#BDB2FF': { name: 'Lavender', nepali: 'बैजनी', emoji: '💜' },
            '#FFC6FF': { name: 'Rose', nepali: 'गुलाबी', emoji: '🌹' },
            '#FFDAC1': { name: 'Warm Peach', nepali: 'सुन्तला', emoji: '🧡' },
            '#E2F0CB': { name: 'Sage', nepali: 'हरियो', emoji: '🍃' },
            '#B5EAD7': { name: 'Seafoam', nepali: 'हरियो', emoji: '🌊' },
            '#C7CEEA': { name: 'Periwinkle', nepali: 'निलो', emoji: '💙' },
            '#F5C6D0': { name: 'Ballet Pink', nepali: 'गुलाबी', emoji: '🩰' },
        };

        var playGentleTone = function(frequency, duration) {
            try {
                var ctx = new (window.AudioContext || window.webkitAudioContext)();
                var oscillator = ctx.createOscillator();
                var gainNode = ctx.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(ctx.destination);
                oscillator.type = 'sine';
                oscillator.frequency.value = frequency;
                gainNode.gain.value = 0.1;
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + duration);
                
                setTimeout(function() {
                    try { ctx.close(); } catch(e) {}
                }, duration * 1000 + 200);
            } catch(e) {}
        };

        var displayColor = function() {
            var randomColor = self.colors[Math.floor(Math.random() * self.colors.length)];
            var info = colorInfo[randomColor] || { name: 'Gentle', nepali: '', emoji: '🌈' };
            
            if (displayBox) {
                displayBox.style.background = randomColor;
                displayBox.style.transition = 'background ' + transitionSpeed + 'ms ease';
            }
            
            if (colorNameEl) {
                colorNameEl.textContent = info.emoji + ' ' + info.name;
                if (info.nepali) {
                    colorNameEl.textContent += ' | ' + info.nepali;
                }
            }
            
            playGentleTone(500 + Math.random() * 300, 0.2);
        };

        var startFlashing = function() {
            if (isFlashing) return;
            isFlashing = true;
            flashBtn.textContent = '⏳ Gentle flow...';
            flashBtn.disabled = true;
            displayColor();
            flashInterval = setInterval(displayColor, transitionSpeed);
            if (colorNameEl) colorNameEl.textContent = '🌈 Gentle colors...';
        };

        var stopFlashing = function() {
            if (flashInterval) {
                clearInterval(flashInterval);
                flashInterval = null;
            }
            isFlashing = false;
            flashBtn.textContent = '🌈 Gentle Colors';
            flashBtn.disabled = false;
            
            if (displayBox) {
                displayBox.style.background = '#F5F0EB';
            }
            if (colorNameEl) colorNameEl.textContent = '🌈 Tap to start!';
        };

        flashBtn.addEventListener('click', startFlashing);
        stopBtn.addEventListener('click', stopFlashing);

        if (displayBox) {
            displayBox.addEventListener('click', startFlashing);
            displayBox.style.cursor = 'pointer';
        }

        this._cleanupColorActivity = function() {
            stopFlashing();
        };
    }

    // ... (keep peekaboo, animal, star methods)

    // ===== GENTLE AUDIO HELPERS =====
    playGentleTone(frequency, duration) {
        try {
            var ctx = new (window.AudioContext || window.webkitAudioContext)();
            var oscillator = ctx.createOscillator();
            var gainNode = ctx.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);
            oscillator.type = 'sine';
            oscillator.frequency.value = frequency;
            gainNode.gain.value = 0.1;
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + duration);
            
            setTimeout(function() {
                try { ctx.close(); } catch(e) {}
            }, duration * 1000 + 200);
        } catch(e) {}
    }

    playGentleAnimalSound(soundText) {
        try {
            var ctx = new (window.AudioContext || window.webkitAudioContext)();
            var oscillator = ctx.createOscillator();
            var gainNode = ctx.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            var sounds = {
                'woof!': { freq: 300, type: 'sine', duration: 0.2 },
                'meow!': { freq: 600, type: 'sine', duration: 0.3 },
                'moo!': { freq: 150, type: 'sine', duration: 0.4 },
                'trumpet!': { freq: 200, type: 'sine', duration: 0.3 },
                'roar!': { freq: 100, type: 'sine', duration: 0.5 },
                'neigh!': { freq: 500, type: 'sine', duration: 0.25 },
                'chirp!': { freq: 1500, type: 'sine', duration: 0.08 },
                'hop!': { freq: 400, type: 'sine', duration: 0.1 },
            };
            
            var sound = sounds[soundText] || sounds['chirp!'];
            oscillator.type = sound.type;
            oscillator.frequency.value = sound.freq;
            gainNode.gain.value = 0.12;
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + sound.duration);
            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + sound.duration);
            
            setTimeout(function() {
                try { ctx.close(); } catch(e) {}
            }, sound.duration * 1000 + 200);
        } catch(e) {}
    }

    // ... (keep updateDisplay and destroy)
}