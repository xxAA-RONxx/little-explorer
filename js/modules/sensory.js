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
        
        // ===== SOFT PASTEL COLOR PALETTE =====
        // Inspired by Bluey's gentle, warm color scheme
        this.colors = [
            '#FFB5C2', // Soft pink
            '#FFD6A5', // Peach
            '#FDFFB6', // Creamy yellow
            '#CAFFBF', // Mint
            '#A0C4FF', // Soft blue
            '#BDB2FF', // Lavender
            '#FFC6FF', // Soft purple-pink
            '#FFDAC1', // Warm peach
            '#E2F0CB', // Sage
            '#B5EAD7', // Seafoam
            '#C7CEEA', // Periwinkle
            '#F5C6D0', // Ballet pink
        ];
        
        // Gentle emojis for babies
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
        this.tapDisplay = null;
        this.starDisplay = null;
        this.boundHandleTap = null;
        this.animationFrame = null;
        this.stars = [];
        this._cleanupColorActivity = null;
    }

    // ===== RENDER =====
    render() {
        this.container.innerHTML = `
            <div class="sensory-container">
                <!-- Activity Navigation -->
                <div class="sensory-nav">
                    <button class="sensory-nav-btn active" data-activity="tap">👆 Tap</button>
                    <button class="sensory-nav-btn" data-activity="colors">🎨 Colors</button>
                    <button class="sensory-nav-btn" data-activity="peekaboo">👶 Peekaboo</button>
                    <button class="sensory-nav-btn" data-activity="animals">🐾 Animals</button>
                    <button class="sensory-nav-btn" data-activity="stars">⭐ Stars</button>
                </div>

                <!-- Activity Content -->
                <div id="sensoryActivity" class="sensory-activity">
                    ${this.renderTapActivity()}
                </div>

                <!-- Stats -->
                <div class="sensory-stats">
                    <span>🎯 Taps: <strong id="tapCount">${StorageService.get('sensoryTaps', 0)}</strong></span>
                    <span>⭐ Stars: <strong id="starCount">${StorageService.getStars()}</strong></span>
                </div>
            </div>
        `;

        // Load saved tap count
        this.tapCount = StorageService.get('sensoryTaps', 0);
        this.updateDisplay();

        // Bind navigation events
        var navBtns = document.querySelectorAll('.sensory-nav-btn');
        var self = this;
        navBtns.forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                document.querySelectorAll('.sensory-nav-btn').forEach(function(b) {
                    b.classList.remove('active');
                });
                e.target.classList.add('active');
                self.switchActivity(e.target.dataset.activity);
            });
        });

        // Start with tap activity
        this.switchActivity('tap');
    }

    // ===== SWITCH ACTIVITY =====
    switchActivity(activity) {
        this.currentActivity = activity;
        var container = document.getElementById('sensoryActivity');
        if (!container) return;

        // Clean up any running animations
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }

        switch(activity) {
            case 'tap':
                container.innerHTML = this.renderTapActivity();
                this.setupTapActivity();
                break;
            case 'colors':
                container.innerHTML = this.renderColorActivity();
                this.setupColorActivity();
                break;
            case 'peekaboo':
                container.innerHTML = this.renderPeekabooActivity();
                this.setupPeekabooActivity();
                break;
            case 'animals':
                container.innerHTML = this.renderAnimalActivity();
                this.setupAnimalActivity();
                break;
            case 'stars':
                container.innerHTML = this.renderStarActivity();
                this.setupStarActivity();
                break;
        }

        // Update stats
        this.updateDisplay();
    }

    // ============================================
    // ACTIVITY 1: TAP & DISCOVER (Softer Colors)
    // ============================================
    renderTapActivity() {
        return `
            <div class="tap-activity">
                <div class="tap-area" id="tapArea">
                    <button class="tap-button" id="sensoryButton" aria-label="Tap for fun colors and shapes">
                        <span class="tap-emoji">🌈</span>
                        <span class="tap-label">Tap Me!</span>
                    </button>
                </div>
                <p class="activity-hint">👆 Tap the circle for gentle colors and surprises!</p>
            </div>
        `;
    }

    setupTapActivity() {
        this.button = document.getElementById('sensoryButton');
        this.boundHandleTap = this.handleTap.bind(this);
        var self = this;
        
        if (this.button) {
            this.button.addEventListener('click', this.boundHandleTap);
            this.button.addEventListener('touchstart', function(e) {
                e.preventDefault();
                self.handleTap();
            });
            
            // Keyboard support
            this.button.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    self.handleTap();
                }
            });
        }
    }

    handleTap() {
        var self = this;
        
        // 1. Visual feedback - soft pastel color
        var randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
        document.body.style.background = randomColor;
        document.body.style.transition = 'background 0.6s ease';
        
        // Also change the button border color
        if (this.button) {
            this.button.style.borderColor = randomColor;
        }
        
        setTimeout(function() {
            document.body.style.background = '';
            if (self.button) {
                self.button.style.borderColor = '';
            }
        }, 600);

        // 2. Button animation - gentle bounce
        if (this.button) {
            this.button.style.transform = 'scale(0.9)';
            this.button.style.transition = 'transform 0.15s ease';
            setTimeout(function() {
                if (self.button) self.button.style.transform = 'scale(1)';
            }, 150);
        }

        // 3. Change emoji to something gentle
        var newEmoji = this.emojis[Math.floor(Math.random() * this.emojis.length)];
        var emojiEl = document.querySelector('.tap-emoji');
        if (emojiEl) {
            emojiEl.textContent = newEmoji;
            emojiEl.style.transition = 'transform 0.3s ease';
            emojiEl.style.transform = 'scale(1.3)';
            setTimeout(function() {
                emojiEl.style.transform = 'scale(1)';
            }, 300);
        }

        // 4. Update counter
        this.tapCount += 1;
        StorageService.set('sensoryTaps', this.tapCount);
        this.updateDisplay();

        // 5. Every 10 taps, add a star with gentle celebration
        if (this.tapCount % 10 === 0) {
            StorageService.addStar();
            this.updateDisplay();
            
            // Gentle star flash
            var starDisplay = document.getElementById('starCount');
            if (starDisplay) {
                starDisplay.style.animation = 'pulse 0.6s ease';
                setTimeout(function() {
                    starDisplay.style.animation = '';
                }, 600);
            }
            
            // Gentle celebration message
            var hint = document.querySelector('.activity-hint');
            if (hint) {
                hint.textContent = '🌟 ' + (navigator.language.startsWith('ne') ? 'राम्रो!' : 'Great!');
                hint.style.transition = 'opacity 0.3s ease';
                setTimeout(function() {
                    hint.textContent = '👆 Tap the circle for gentle colors and surprises!';
                }, 1500);
            }
            
            // Gentle sound celebration
            this.playGentleTone(523, 0.15);
            var self2 = this;
            setTimeout(function() {
                self2.playGentleTone(659, 0.15);
            }, 150);
        }

        // Play a gentle sound on every tap
        this.playGentleTone(440 + Math.random() * 200, 0.1);
        
        console.log('[Sensory] Tap #' + this.tapCount);
    }

    // ============================================
    // ACTIVITY 2: COLOR FLASH (Pastel Colors)
    // ============================================
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

        // Gentle color names with soft descriptions
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
            
            self.playGentleTone(500 + Math.random() * 300, 0.2);
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

        this._cleanupColorActivity = stopFlashing;
    }

    // ============================================
    // ACTIVITY 3: PEEKABOO
    // ============================================
    renderPeekabooActivity() {
        return `
            <div class="peekaboo-activity">
                <div class="peekaboo-area" id="peekabooArea">
                    <div class="peekaboo-container">
                        <div class="peekaboo-face" id="peekabooFace">😊</div>
                        <div class="peekaboo-hands" id="peekabooHands">🙌</div>
                    </div>
                </div>
                <div class="peekaboo-controls">
                    <button class="btn btn-primary" id="peekabooBtn">👋 Peekaboo!</button>
                </div>
                <p class="activity-hint">👶 Tap the face or button for peekaboo fun!</p>
            </div>
        `;
    }

    setupPeekabooActivity() {
        var face = document.getElementById('peekabooFace');
        var hands = document.getElementById('peekabooHands');
        var btn = document.getElementById('peekabooBtn');
        var isHidden = false;
        var faceIndex = 0;
        var self = this;

        var peekaboo = function() {
            isHidden = !isHidden;
            if (isHidden) {
                face.style.transform = 'scale(0)';
                face.style.transition = 'transform 0.4s ease';
                hands.style.transform = 'scale(1)';
                hands.style.transition = 'transform 0.4s ease';
                hands.textContent = '🙈';
                btn.textContent = '👀 Show!';
                self.playGentleTone(600, 0.1);
            } else {
                faceIndex = (faceIndex + 1) % self.faces.length;
                face.textContent = self.faces[faceIndex];
                face.style.transform = 'scale(1.2)';
                setTimeout(function() {
                    face.style.transform = 'scale(1)';
                }, 300);
                hands.style.transform = 'scale(0)';
                hands.textContent = '🙌';
                btn.textContent = '👋 Peekaboo!';
                self.playGentleTone(800, 0.15);
                
                if (Math.random() < 0.25) {
                    StorageService.addStar();
                    self.updateDisplay();
                    var hint = document.querySelector('.activity-hint');
                    if (hint) {
                        hint.textContent = '🌟 ' + (navigator.language.startsWith('ne') ? 'राम्रो!' : 'Great!');
                        setTimeout(function() {
                            hint.textContent = '👶 Tap the face or button for peekaboo fun!';
                        }, 1000);
                    }
                }
            }
        };

        btn.addEventListener('click', peekaboo);
        face.addEventListener('click', peekaboo);
        hands.addEventListener('click', peekaboo);
    }

    // ============================================
    // ACTIVITY 4: ANIMAL PARADE
    // ============================================
    renderAnimalActivity() {
        return `
            <div class="animal-activity">
                <div class="animal-display-area" id="animalDisplayArea">
                    <div class="animal-show" id="animalShow">
                        <span class="animal-big-emoji" id="animalBigEmoji">🐕</span>
                        <span class="animal-sound-text" id="animalSoundText">woof!</span>
                        <span class="animal-name-text" id="animalNameText">Dog</span>
                    </div>
                </div>
                <div class="animal-controls">
                    <button class="btn btn-primary" id="animalNextBtn">🐾 Next Animal</button>
                    <button class="btn btn-secondary" id="animalSoundBtn">🔊 Play Sound</button>
                </div>
                <p class="activity-hint">🐾 Meet friendly animals! Tap to see and hear them.</p>
            </div>
        `;
    }

    setupAnimalActivity() {
        var currentIndex = 0;
        var emojiEl = document.getElementById('animalBigEmoji');
        var soundEl = document.getElementById('animalSoundText');
        var nameEl = document.getElementById('animalNameText');
        var nextBtn = document.getElementById('animalNextBtn');
        var soundBtn = document.getElementById('animalSoundBtn');
        var self = this;

        var showAnimal = function() {
            var animal = self.animals[currentIndex];
            if (emojiEl) {
                emojiEl.textContent = animal.emoji;
                emojiEl.style.transform = 'scale(0)';
                setTimeout(function() {
                    emojiEl.style.transform = 'scale(1.2)';
                    setTimeout(function() {
                        emojiEl.style.transform = 'scale(1)';
                    }, 200);
                }, 50);
            }
            if (soundEl) {
                soundEl.textContent = animal.sound;
            }
            if (nameEl) {
                nameEl.textContent = animal.name;
            }
            self.playGentleAnimalSound(animal.sound);
        };

        var nextAnimal = function() {
            currentIndex = (currentIndex + 1) % self.animals.length;
            showAnimal();
            if (currentIndex % 3 === 0) {
                StorageService.addStar();
                self.updateDisplay();
                self.playGentleTone(523, 0.1);
                setTimeout(function() {
                    self.playGentleTone(659, 0.1);
                }, 150);
            }
        };

        var playSound = function() {
            var animal = self.animals[currentIndex];
            self.playGentleAnimalSound(animal.sound);
            if (soundEl) {
                soundEl.style.transform = 'scale(1.2)';
                setTimeout(function() {
                    soundEl.style.transform = 'scale(1)';
                }, 200);
            }
        };

        nextBtn.addEventListener('click', nextAnimal);
        soundBtn.addEventListener('click', playSound);
        
        if (emojiEl) {
            emojiEl.addEventListener('click', playSound);
            emojiEl.style.cursor = 'pointer';
        }

        showAnimal();
    }

    // ============================================
    // ACTIVITY 5: TWINKLE STARS
    // ============================================
    renderStarActivity() {
        return `
            <div class="star-activity">
                <div class="star-sky" id="starSky">
                    <!-- Stars rendered by JS -->
                </div>
                <div class="star-controls">
                    <button class="btn btn-primary" id="starBurstBtn">✨ Gentle Stars</button>
                    <button class="btn btn-secondary" id="starClearBtn">🌙 Clear</button>
                </div>
                <p class="activity-hint">⭐ Tap the sky to make gentle stars appear!</p>
            </div>
        `;
    }

    setupStarActivity() {
        var sky = document.getElementById('starSky');
        var burstBtn = document.getElementById('starBurstBtn');
        var clearBtn = document.getElementById('starClearBtn');
        var starCount = 0;
        var self = this;

        // Pastel star colors
        var starColors = ['#FFB5C2', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#A0C4FF', '#BDB2FF', '#FFC6FF'];

        var createStar = function(x, y, size) {
            var star = document.createElement('div');
            star.className = 'star';
            star.textContent = '⭐';
            star.style.position = 'absolute';
            star.style.left = x + 'px';
            star.style.top = y + 'px';
            star.style.fontSize = (size || Math.random() * 30 + 20) + 'px';
            star.style.opacity = '0';
            star.style.transition = 'all 1s ease';
            star.style.transform = 'scale(0) rotate(0deg)';
            star.style.pointerEvents = 'none';
            
            var color = starColors[Math.floor(Math.random() * starColors.length)];
            star.style.filter = 'drop-shadow(0 0 15px ' + color + ')';
            
            sky.appendChild(star);
            
            setTimeout(function() {
                star.style.opacity = '1';
                star.style.transform = 'scale(1) rotate(20deg)';
            }, 50);

            setInterval(function() {
                if (Math.random() < 0.2) {
                    star.style.opacity = '0.4';
                    setTimeout(function() {
                        star.style.opacity = '1';
                    }, 400);
                }
            }, Math.random() * 3000 + 2000);

            return star;
        };

        var addStars = function(count) {
            var rect = sky.getBoundingClientRect();
            for (var i = 0; i < count; i++) {
                var x = Math.random() * (rect.width - 50);
                var y = Math.random() * (rect.height - 50);
                var size = Math.random() * 25 + 15;
                createStar(x, y, size);
                starCount++;
            }
            if (starCount > 5 && starCount % 5 === 0) {
                StorageService.addStar();
                self.updateDisplay();
                self.playGentleTone(523, 0.1);
                setTimeout(function() {
                    self.playGentleTone(659, 0.1);
                }, 150);
            }
        };

        var clearStars = function() {
            var stars = sky.querySelectorAll('.star');
            stars.forEach(function(star, index) {
                setTimeout(function() {
                    star.style.opacity = '0';
                    star.style.transform = 'scale(0)';
                    setTimeout(function() {
                        star.remove();
                    }, 500);
                }, index * 50);
            });
            starCount = 0;
        };

        sky.addEventListener('click', function(e) {
            var rect = sky.getBoundingClientRect();
            var x = e.clientX - rect.left - 25;
            var y = e.clientY - rect.top - 25;
            createStar(x, y, Math.random() * 25 + 15);
            starCount++;
            self.playGentleTone(500 + Math.random() * 200, 0.08);
        });

        burstBtn.addEventListener('click', function() {
            addStars(15);
            self.playGentleTone(523, 0.1);
            setTimeout(function() {
                self.playGentleTone(659, 0.1);
            }, 150);
            setTimeout(function() {
                self.playGentleTone(784, 0.1);
            }, 300);
        });

        clearBtn.addEventListener('click', clearStars);

        setTimeout(function() {
            addStars(6);
        }, 300);
    }

    // ============================================
    // GENTLE AUDIO HELPERS
    // ============================================
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
        } catch(e) {
            // Silently fail
        }
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
        } catch(e) {
            // Silently fail
        }
    }

    // ============================================
    // UPDATE DISPLAY
    // ============================================
    updateDisplay() {
        var tapDisplay = document.getElementById('tapCount');
        var starDisplay = document.getElementById('starCount');
        if (tapDisplay) tapDisplay.textContent = this.tapCount;
        if (starDisplay) starDisplay.textContent = StorageService.getStars();
    }

    // ============================================
    // DESTROY
    // ============================================
    destroy() {
        if (this.button && this.boundHandleTap) {
            this.button.removeEventListener('click', this.boundHandleTap);
        }
        
        if (this._cleanupColorActivity) {
            this._cleanupColorActivity();
        }
        
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        
        document.body.style.background = '';
        console.log('[Sensory] Module destroyed');
    }
}