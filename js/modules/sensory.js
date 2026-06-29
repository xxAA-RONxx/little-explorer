/**
 * SENSORY MODULE - Full Version with All Activities
 * For babies 0-18 months
 * Activities: Tap, Colors, Peekaboo, Animals, Stars
 */
import { StorageService } from '../services/storage.js';

export class SensoryModule {
    constructor(container) {
        console.log('✅ SensoryModule constructor called');
        this.container = container;
        this.tapCount = StorageService.get('sensoryTaps', 0);
        this.currentActivity = 'tap';
        this.colors = ['#FFB5C2', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#A0C4FF', '#BDB2FF', '#FFC6FF', '#FFDAC1'];
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
        this._cleanupColorActivity = null;
    }

    render() {
        console.log('✅ SensoryModule.render() called');
        
        if (!this.container) {
            console.error('❌ No container provided');
            return;
        }

        this.container.innerHTML = `
            <div class="sensory-container">
                <!-- Navigation -->
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
                    <span>🎯 Taps: <strong id="tapCount">${this.tapCount}</strong></span>
                    <span>⭐ Stars: <strong id="starCount">${StorageService.getStars()}</strong></span>
                </div>
            </div>
        `;

        this.setupNavigation();
        this.switchActivity('tap');
        this.updateDisplay();
    }

    // ===== NAVIGATION =====
    setupNavigation() {
        var self = this;
        document.querySelectorAll('.sensory-nav-btn').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                document.querySelectorAll('.sensory-nav-btn').forEach(function(b) {
                    b.classList.remove('active');
                });
                e.target.classList.add('active');
                self.switchActivity(e.target.dataset.activity);
            });
        });
    }

    switchActivity(activity) {
        this.currentActivity = activity;
        var container = document.getElementById('sensoryActivity');
        if (!container) return;

        // Clean up color activity if switching away
        if (this._cleanupColorActivity) {
            this._cleanupColorActivity();
            this._cleanupColorActivity = null;
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

        this.updateDisplay();
    }

    // ============================================
    // ACTIVITY 1: TAP & DISCOVER
    // ============================================
    renderTapActivity() {
        return `
            <div class="tap-activity">
                <div class="tap-area">
                    <button class="tap-button" id="sensoryButton">
                        <span class="tap-emoji">🌈</span>
                        <span class="tap-label">Tap Me!</span>
                    </button>
                </div>
                <p class="activity-hint">👆 Tap the circle for gentle colors and surprises!</p>
            </div>
        `;
    }

    setupTapActivity() {
        var self = this;
        this.button = document.getElementById('sensoryButton');
        
        if (this.button) {
            this.button.addEventListener('click', function() {
                self.handleTap();
            });
        }
    }

    handleTap() {
        var self = this;
        var randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
        document.body.style.background = randomColor;
        document.body.style.transition = 'background 0.6s ease';
        
        if (this.button) {
            this.button.style.borderColor = randomColor;
        }
        
        setTimeout(function() {
            document.body.style.background = '';
            if (self.button) {
                self.button.style.borderColor = '';
            }
        }, 600);

        if (this.button) {
            this.button.style.transform = 'scale(0.9)';
            setTimeout(function() {
                if (self.button) self.button.style.transform = 'scale(1)';
            }, 150);
        }

        var newEmoji = this.emojis[Math.floor(Math.random() * this.emojis.length)];
        var emojiEl = document.querySelector('.tap-emoji');
        if (emojiEl) {
            emojiEl.textContent = newEmoji;
        }

        this.tapCount += 1;
        StorageService.set('sensoryTaps', this.tapCount);
        this.updateDisplay();

        if (this.tapCount % 10 === 0) {
            StorageService.addStar();
            this.updateDisplay();
        }
    }

    // ============================================
    // ACTIVITY 2: COLORS
    // ============================================
    renderColorActivity() {
        return `
            <div class="color-activity">
                <div class="color-flash-area">
                    <div class="color-display-box" id="colorDisplayBox">
                        <span class="color-emoji">🎨</span>
                        <span class="color-name" id="colorName">Tap to start!</span>
                    </div>
                </div>
                <div class="color-controls">
                    <button class="btn btn-primary" id="colorFlashBtn">🌈 Gentle Colors</button>
                    <button class="btn btn-secondary" id="colorStopBtn">⏹ Stop</button>
                </div>
                <p class="activity-hint">🌈 Watch the gentle colors flow!</p>
            </div>
        `;
    }

    setupColorActivity() {
        var self = this;
        var flashBtn = document.getElementById('colorFlashBtn');
        var stopBtn = document.getElementById('colorStopBtn');
        var displayBox = document.getElementById('colorDisplayBox');
        var colorNameEl = document.getElementById('colorName');
        var isFlashing = false;
        var flashInterval = null;

        var colorInfo = {
            '#FFB5C2': { name: 'Soft Pink', nepali: 'गुलाबी', emoji: '🌸' },
            '#FFD6A5': { name: 'Peach', nepali: 'सुन्तला', emoji: '🍑' },
            '#FDFFB6': { name: 'Cream', nepali: 'पहेंलो', emoji: '🌼' },
            '#CAFFBF': { name: 'Mint', nepali: 'हरियो', emoji: '🌿' },
            '#A0C4FF': { name: 'Sky Blue', nepali: 'निलो', emoji: '☁️' },
            '#BDB2FF': { name: 'Lavender', nepali: 'बैजनी', emoji: '💜' },
            '#FFC6FF': { name: 'Rose', nepali: 'गुलाबी', emoji: '🌹' },
            '#FFDAC1': { name: 'Warm Peach', nepali: 'सुन्तला', emoji: '🧡' },
        };

        var displayColor = function() {
            var randomColor = self.colors[Math.floor(Math.random() * self.colors.length)];
            var info = colorInfo[randomColor] || { name: 'Gentle', nepali: '', emoji: '🌈' };
            
            if (displayBox) {
                displayBox.style.background = randomColor;
            }
            if (colorNameEl) {
                colorNameEl.textContent = info.emoji + ' ' + info.name;
                if (info.nepali) {
                    colorNameEl.textContent += ' | ' + info.nepali;
                }
            }
        };

        var startFlashing = function() {
            if (isFlashing) return;
            isFlashing = true;
            flashBtn.textContent = '⏳ Gentle flow...';
            flashBtn.disabled = true;
            displayColor();
            flashInterval = setInterval(displayColor, 1200);
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
                <div class="peekaboo-area">
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
                
                if (Math.random() < 0.25) {
                    StorageService.addStar();
                    self.updateDisplay();
                }
            }
        };

        btn.addEventListener('click', peekaboo);
        face.addEventListener('click', peekaboo);
        hands.addEventListener('click', peekaboo);
    }

    // ============================================
    // ACTIVITY 4: ANIMALS
    // ============================================
    renderAnimalActivity() {
        return `
            <div class="animal-activity">
                <div class="animal-display-area">
                    <div class="animal-show">
                        <span class="animal-big-emoji" id="animalBigEmoji">🐕</span>
                        <span class="animal-sound-text" id="animalSoundText">woof!</span>
                        <span class="animal-name-text" id="animalNameText">Dog</span>
                    </div>
                </div>
                <div class="animal-controls">
                    <button class="btn btn-primary" id="animalNextBtn">🐾 Next Animal</button>
                    <button class="btn btn-secondary" id="animalSoundBtn">🔊 Play Sound</button>
                </div>
                <p class="activity-hint">🐾 Meet friendly animals!</p>
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
        };

        var nextAnimal = function() {
            currentIndex = (currentIndex + 1) % self.animals.length;
            showAnimal();
            if (currentIndex % 3 === 0) {
                StorageService.addStar();
                self.updateDisplay();
            }
        };

        var playSound = function() {
            var animal = self.animals[currentIndex];
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
    // ACTIVITY 5: STARS
    // ============================================
    renderStarActivity() {
        return `
            <div class="star-activity">
                <div class="star-sky" id="starSky"></div>
                <div class="star-controls">
                    <button class="btn btn-primary" id="starBurstBtn">✨ Gentle Stars</button>
                    <button class="btn btn-secondary" id="starClearBtn">🌙 Clear</button>
                </div>
                <p class="activity-hint">⭐ Tap the sky to make stars appear!</p>
            </div>
        `;
    }

    setupStarActivity() {
        var sky = document.getElementById('starSky');
        var burstBtn = document.getElementById('starBurstBtn');
        var clearBtn = document.getElementById('starClearBtn');
        var starCount = 0;
        var self = this;

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
            star.style.transform = 'scale(0)';
            star.style.pointerEvents = 'none';
            sky.appendChild(star);
            
            setTimeout(function() {
                star.style.opacity = '1';
                star.style.transform = 'scale(1)';
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
            }
        };

        var clearStars = function() {
            var stars = sky.querySelectorAll('.star');
            stars.forEach(function(star) {
                star.style.opacity = '0';
                star.style.transform = 'scale(0)';
                setTimeout(function() {
                    star.remove();
                }, 500);
            });
            starCount = 0;
        };

        sky.addEventListener('click', function(e) {
            var rect = sky.getBoundingClientRect();
            var x = e.clientX - rect.left - 25;
            var y = e.clientY - rect.top - 25;
            createStar(x, y, Math.random() * 25 + 15);
            starCount++;
        });

        burstBtn.addEventListener('click', function() {
            addStars(15);
        });

        clearBtn.addEventListener('click', clearStars);

        setTimeout(function() {
            addStars(6);
        }, 300);
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
        if (this._cleanupColorActivity) {
            this._cleanupColorActivity();
            this._cleanupColorActivity = null;
        }
        document.body.style.background = '';
        console.log('✅ SensoryModule destroyed');
    }
}

console.log('✅ sensory.js loaded successfully');