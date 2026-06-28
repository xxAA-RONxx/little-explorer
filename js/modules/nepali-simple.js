/**
 * Simplified Nepali Module - For toddlers 2-4 years
 * Big buttons, simple words, visual learning
 */
import { StorageService } from '../services/storage.js';
import { LanguageService } from '../services/languageService.js';

// ===== SIMPLE WORDS (with pictures/emojis) =====
const SIMPLE_WORDS = [
    // Greetings
    { nepali: 'नमस्ते', english: 'Hello', emoji: '🙏', phonetic: 'namaste' },
    { nepali: 'धन्यवाद', english: 'Thank you', emoji: '🙏', phonetic: 'dhanyabad' },
    // Family
    { nepali: 'बुबा', english: 'Father', emoji: '👨', phonetic: 'buba' },
    { nepali: 'आमा', english: 'Mother', emoji: '👩', phonetic: 'aama' },
    { nepali: 'दाइ', english: 'Brother', emoji: '👦', phonetic: 'dai' },
    { nepali: 'बहिनी', english: 'Sister', emoji: '👧', phonetic: 'bahini' },
    // Animals
    { nepali: 'कुकुर', english: 'Dog', emoji: '🐕', phonetic: 'kukur' },
    { nepali: 'बिरालो', english: 'Cat', emoji: '🐈', phonetic: 'biralo' },
    { nepali: 'गाई', english: 'Cow', emoji: '🐄', phonetic: 'gai' },
    { nepali: 'हात्ती', english: 'Elephant', emoji: '🐘', phonetic: 'hatti' },
    // Food
    { nepali: 'पानी', english: 'Water', emoji: '💧', phonetic: 'pani' },
    { nepali: 'दूध', english: 'Milk', emoji: '🥛', phonetic: 'dudh' },
    { nepali: 'भात', english: 'Rice', emoji: '🍚', phonetic: 'bhat' },
    // Colors
    { nepali: 'रातो', english: 'Red', emoji: '🔴', phonetic: 'raato' },
    { nepali: 'निलो', english: 'Blue', emoji: '🔵', phonetic: 'nilo' },
    { nepali: 'हरियो', english: 'Green', emoji: '🟢', phonetic: 'hariyo' },
    { nepali: 'पहेंलो', english: 'Yellow', emoji: '🟡', phonetic: 'pahelo' },
];

// ===== SIMPLE LESSONS =====
const SIMPLE_LESSONS = [
    {
        id: 'greetings',
        title: 'Greetings',
        emoji: '👋',
        words: ['नमस्ते', 'धन्यवाद']
    },
    {
        id: 'family',
        title: 'Family',
        emoji: '👨‍👩‍👧‍👦',
        words: ['बुबा', 'आमा', 'दाइ', 'बहिनी']
    },
    {
        id: 'animals',
        title: 'Animals',
        emoji: '🐾',
        words: ['कुकुर', 'बिरालो', 'गाई', 'हात्ती']
    },
    {
        id: 'food',
        title: 'Food',
        emoji: '🍽️',
        words: ['पानी', 'दूध', 'भात']
    },
    {
        id: 'colors',
        title: 'Colors',
        emoji: '🎨',
        words: ['रातो', 'निलो', 'हरियो', 'पहेंलो']
    }
];

export class NepaliSimpleModule {
    constructor(container) {
        this.container = container;
        this.language = LanguageService.getCurrentLanguage();
        this.currentLesson = 0;
        this.currentWordIndex = 0;
        this.score = 0;
        this.progress = StorageService.get('simpleNepaliProgress', {});
    }

    // ===== TRANSLATION =====
    t(key) {
        const translations = {
            'learnNepali': { en: 'Learn Nepali', ne: 'नेपाली सिकौं' },
            'tapWord': { en: 'Tap the word!', ne: 'शब्द थिच्नुहोस्!' },
            'correct': { en: 'Correct! 🎉', ne: 'सही! 🎉' },
            'tryAgain': { en: 'Try again!', ne: 'फेरि प्रयास गर्नुहोस्!' },
            'next': { en: 'Next ➜', ne: 'अर्को ➜' },
            'lessonComplete': { en: '🎉 Lesson Complete!', ne: '🎉 पाठ पूरा भयो!' },
            'tapToHear': { en: '👆 Tap to hear', ne: '👆 सुन्न थिच्नुहोस्' },
        };
        const lang = this.language === 'ne' ? 'ne' : 'en';
        return translations[key]?.[lang] || key;
    }

    // ===== RENDER =====
    render() {
        this.container.innerHTML = `
            <div class="nepali-simple-module">
                <!-- Header -->
                <div class="simple-header">
                    <h2>${this.t('learnNepali')}</h2>
                    <div class="simple-stats">
                        ⭐ <span id="simpleStars">${StorageService.getStars()}</span>
                    </div>
                </div>

                <!-- Progress -->
                <div class="simple-progress">
                    <div class="progress-bar" style="width: ${this.getProgressPercentage()}%"></div>
                </div>

                <!-- Word Display -->
                <div class="word-display" id="wordDisplay">
                    <div class="word-emoji" id="wordEmoji">🌟</div>
                    <div class="word-nepali" id="wordNepali">${this.t('tapWord')}</div>
                    <div class="word-phonetic" id="wordPhonetic"></div>
                    <div class="word-english" id="wordEnglish"></div>
                </div>

                <!-- Sound Button -->
                <button class="sound-btn" id="soundBtn">🔊 ${this.t('tapToHear')}</button>

                <!-- Options (4 choices) -->
                <div class="word-options" id="wordOptions">
                    ${this.generateOptions()}
                </div>

                <!-- Feedback -->
                <div id="simpleFeedback" class="simple-feedback"></div>

                <!-- Next Button -->
                <button class="next-btn" id="nextBtn" style="display:none;">${this.t('next')}</button>

                <!-- Lesson Progress -->
                <div class="lesson-progress">
                    Lesson <span id="currentLesson">${this.currentLesson + 1}</span>/${SIMPLE_LESSONS.length}
                </div>
            </div>
        `;

        this.bindEvents();
        this.loadWord();
    }

    // ===== GENERATE OPTIONS =====
    generateOptions() {
        // Get current lesson words
        const lesson = SIMPLE_LESSONS[this.currentLesson];
        const lessonWords = lesson.words.map(function(w) {
            return SIMPLE_WORDS.find(function(word) { return word.nepali === w; });
        }).filter(function(w) { return w; });

        // Get current word
        const currentWord = lessonWords[this.currentWordIndex];
        if (!currentWord) return '';

        // Get 3 random wrong answers
        const allWords = SIMPLE_WORDS.filter(function(w) { 
            return w.nepali !== currentWord.nepali; 
        });
        const shuffled = allWords.sort(function() { return Math.random() - 0.5; });
        const wrongAnswers = shuffled.slice(0, 3);

        // Combine and shuffle
        const options = [currentWord, ...wrongAnswers];
        const shuffledOptions = options.sort(function() { return Math.random() - 0.5; });

        return shuffledOptions.map(function(word) {
            return `<button class="word-option" data-nepali="${word.nepali}" data-english="${word.english}">
                <span class="option-emoji">${word.emoji}</span>
                <span class="option-text">${word.nepali}</span>
            </button>`;
        }).join('');
    }

    // ===== LOAD WORD =====
    loadWord() {
        const lesson = SIMPLE_LESSONS[this.currentLesson];
        const lessonWords = lesson.words.map(function(w) {
            return SIMPLE_WORDS.find(function(word) { return word.nepali === w; });
        }).filter(function(w) { return w; });

        if (this.currentWordIndex >= lessonWords.length) {
            this.completeLesson();
            return;
        }

        const word = lessonWords[this.currentWordIndex];
        if (!word) return;

        // Update display
        document.getElementById('wordEmoji').textContent = word.emoji;
        document.getElementById('wordNepali').textContent = word.nepali;
        document.getElementById('wordPhonetic').textContent = `(${word.phonetic})`;
        document.getElementById('wordEnglish').textContent = '';

        // Reset options
        const optionsContainer = document.getElementById('wordOptions');
        optionsContainer.innerHTML = this.generateOptions();
        optionsContainer.querySelectorAll('.word-option').forEach(function(btn) {
            btn.addEventListener('click', function() {
                this.checkAnswer(btn);
            }.bind(this));
        }.bind(this));

        // Reset feedback
        const feedback = document.getElementById('simpleFeedback');
        feedback.textContent = '';
        feedback.className = 'simple-feedback';

        // Hide next button
        document.getElementById('nextBtn').style.display = 'none';

        // Enable sound button
        document.getElementById('soundBtn').disabled = false;
    }

    // ===== CHECK ANSWER =====
    checkAnswer(clickedButton) {
        const selected = clickedButton.dataset.nepali;
        const lesson = SIMPLE_LESSONS[this.currentLesson];
        const lessonWords = lesson.words.map(function(w) {
            return SIMPLE_WORDS.find(function(word) { return word.nepali === w; });
        }).filter(function(w) { return w; });
        const word = lessonWords[this.currentWordIndex];

        // Disable all options
        document.querySelectorAll('.word-option').forEach(function(btn) {
            btn.disabled = true;
        });

        const feedback = document.getElementById('simpleFeedback');

        if (selected === word.nepali) {
            // Correct!
            this.score++;
            feedback.textContent = this.t('correct');
            feedback.className = 'simple-feedback correct';
            clickedButton.classList.add('correct');
            
            // Show the English translation
            document.getElementById('wordEnglish').textContent = word.english;
            
            // Add star
            StorageService.addStar();
            document.getElementById('simpleStars').textContent = StorageService.getStars();

            // Show next button
            const nextBtn = document.getElementById('nextBtn');
            nextBtn.style.display = 'block';
            nextBtn.textContent = this.currentWordIndex < lessonWords.length - 1 ? 
                this.t('next') : '🎉 ' + this.t('lessonComplete');

        } else {
            // Wrong
            feedback.textContent = this.t('tryAgain');
            feedback.className = 'simple-feedback wrong';
            clickedButton.classList.add('wrong');
            
            // Highlight correct answer
            document.querySelectorAll('.word-option').forEach(function(btn) {
                if (btn.dataset.nepali === word.nepali) {
                    btn.classList.add('correct');
                }
            });

            // Re-enable options after delay
            setTimeout(function() {
                document.querySelectorAll('.word-option').forEach(function(btn) {
                    btn.disabled = false;
                    btn.classList.remove('wrong');
                });
                feedback.textContent = '';
                feedback.className = 'simple-feedback';
            }, 1000);
        }
    }

    // ===== NEXT WORD =====
    nextWord() {
        this.currentWordIndex++;
        this.loadWord();
    }

    // ===== COMPLETE LESSON =====
    completeLesson() {
        // Mark lesson as complete
        this.progress[this.currentLesson] = true;
        StorageService.set('simpleNepaliProgress', this.progress);

        const feedback = document.getElementById('simpleFeedback');
        feedback.textContent = '🎉 ' + this.t('lessonComplete');
        feedback.className = 'simple-feedback correct';

        // Show next lesson button
        const nextBtn = document.getElementById('nextBtn');
        if (this.currentLesson < SIMPLE_LESSONS.length - 1) {
            nextBtn.textContent = '📚 ' + (this.language === 'ne' ? 'अर्को पाठ' : 'Next Lesson');
            nextBtn.style.display = 'block';
            nextBtn.onclick = function() {
                this.currentLesson++;
                this.currentWordIndex = 0;
                this.loadWord();
                this.updateProgress();
            }.bind(this);
        } else {
            nextBtn.textContent = '🎉 ' + (this.language === 'ne' ? 'सबै पाठ पूरा भयो!' : 'All lessons complete!');
            nextBtn.style.display = 'block';
        }

        // Update progress
        this.updateProgress();
    }

    // ===== GET PROGRESS PERCENTAGE =====
    getProgressPercentage() {
        const totalWords = SIMPLE_LESSONS.reduce(function(total, lesson) {
            return total + lesson.words.length;
        }, 0);
        const completed = Object.keys(this.progress).length;
        return (completed / SIMPLE_LESSONS.length) * 100;
    }

    // ===== UPDATE PROGRESS =====
    updateProgress() {
        const progressBar = document.querySelector('.simple-progress .progress-bar');
        if (progressBar) {
            progressBar.style.width = this.getProgressPercentage() + '%';
        }
        document.getElementById('currentLesson').textContent = this.currentLesson + 1;
    }

    // ===== PLAY SOUND (Synthesized) =====
    playSound() {
        const wordEl = document.getElementById('wordNepali');
        const word = wordEl.textContent;
        const found = SIMPLE_WORDS.find(function(w) { return w.nepali === word; });
        
        if (found) {
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = ctx.createOscillator();
                const gainNode = ctx.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(ctx.destination);
                gainNode.gain.value = 0.3;
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(500, ctx.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.2);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.3);
            } catch(e) {
                console.log('Sound error:', e);
            }
        }
    }

    // ===== BIND EVENTS =====
    bindEvents() {
        document.getElementById('soundBtn').addEventListener('click', function() {
            this.playSound();
        }.bind(this));

        document.getElementById('nextBtn').addEventListener('click', function() {
            this.nextWord();
        }.bind(this));
    }

    // ===== DESTROY =====
    destroy() {
        console.log('[Nepali Simple] Module destroyed');
    }
}