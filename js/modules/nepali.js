/**
 * Nepali Module - Enhanced with more lessons and activities
 * Includes alphabet, flashcards, quiz, lessons, games, and more
 */
import { StorageService } from '../services/storage.js';
import { LanguageService } from '../services/languageService.js';

// ===== ENHANCED DATA =====

// Expanded Alphabet with more detail
const NEPALI_ALPHABET = [
    // Vowels
    ["अ", "a", "ah"], ["आ", "aa", "aaa"], ["इ", "i", "ih"], ["ई", "ee", "eee"],
    ["उ", "u", "uh"], ["ऊ", "uu", "uuu"], ["ए", "e", "eh"], ["ऐ", "ai", "eye"],
    ["ओ", "o", "oh"], ["औ", "au", "ow"],
    // Consonants - Ka series
    ["क", "ka", "kuh"], ["ख", "kha", "khuh"], ["ग", "ga", "guh"], ["घ", "gha", "ghuh"], ["ङ", "nga", "nguh"],
    // Cha series
    ["च", "cha", "chuh"], ["छ", "chha", "chhuh"], ["ज", "ja", "juh"], ["झ", "jha", "jhuh"], ["ञ", "nya", "nyuh"],
    // Ta series (retroflex)
    ["ट", "ta", "tuh"], ["ठ", "tha", "thuh"], ["ड", "da", "duh"], ["ढ", "dha", "dhuh"], ["ण", "na", "nuh"],
    // Ta series (dental)
    ["त", "ta", "tuh"], ["थ", "tha", "thuh"], ["द", "da", "duh"], ["ध", "dha", "dhuh"], ["न", "na", "nuh"],
    // Pa series
    ["प", "pa", "puh"], ["फ", "pha", "phuh"], ["ब", "ba", "buh"], ["भ", "bha", "bhuh"], ["म", "ma", "muh"],
    // Semi-vowels and sibilants
    ["य", "ya", "yuh"], ["र", "ra", "ruh"], ["ला", "la", "luh"], ["व", "wa", "wuh"],
    ["श", "sha", "shuh"], ["ष", "sha", "shuh"], ["स", "sa", "suh"], ["ह", "ha", "huh"],
    // Conjuncts
    ["क्ष", "ksha", "kshuh"], ["त्र", "tra", "truh"], ["ज्ञ", "gya", "gyuh"]
];

// Expanded Vocabulary (more words organized by category)
const VOCABULARY = {
    greetings: [
        ["नमस्ते", "namaste", "Hello"],
        ["धन्यवाद", "dhanyabad", "Thank you"],
        ["तिमीलाई कस्तो छ?", "timilai kasto chha?", "How are you"],
        ["मलाई ठिक छ", "malai thik chha", "I am fine"],
        ["कृपया", "kripaya", "Please"],
        ["माफ गर्नुहोस्", "maaf garnuhos", "Sorry"],
        ["फेरी भन्नुहोस्", "feri bhannuhos", "Please say again"],
    ],
    numbers: [
        ["एक", "ek", "one", "1"], ["दुई", "dui", "two", "2"],
        ["तीन", "tin", "three", "3"], ["चार", "chaar", "four", "4"],
        ["पाँच", "paanch", "five", "5"], ["छ", "chha", "six", "6"],
        ["सात", "saat", "seven", "7"], ["आठ", "aath", "eight", "8"],
        ["नौ", "nau", "nine", "9"], ["दश", "dash", "ten", "10"],
        ["एघार", "eghar", "eleven", "11"], ["बाह्र", "bahra", "twelve", "12"],
        ["तेह्र", "tehra", "thirteen", "13"], ["चौध", "chaudh", "fourteen", "14"],
        ["पन्ध्र", "pandhra", "fifteen", "15"], ["सोह्र", "sohra", "sixteen", "16"],
        ["सत्र", "satr", "seventeen", "17"], ["अठार", "athar", "eighteen", "18"],
        ["उन्नाइस", "unnais", "nineteen", "19"], ["बीस", "bis", "twenty", "20"],
    ],
    family: [
        ["बुबा", "buba", "father"], ["आमा", "aama", "mother"],
        ["दाइ", "dai", "older brother"], ["भाइ", "bhai", "younger brother"],
        ["दिदी", "didi", "older sister"], ["बहिनी", "bahini", "younger sister"],
        ["हजुरबुबा", "hajurbuba", "grandfather"], ["हजुरआमा", "hajuraama", "grandmother"],
        ["काका", "kaka", "uncle"], ["काकी", "kaki", "aunty"],
        ["छोरा", "chhora", "son"], ["छोरी", "chhori", "daughter"],
    ],
    colors: [
        ["रातो", "raato", "red"], ["निलो", "nilo", "blue"],
        ["हरियो", "hariyo", "green"], ["पहेंलो", "pahelo", "yellow"],
        ["सेतो", "seto", "white"], ["कालो", "kalo", "black"],
        ["सुन्तला", "suntala", "orange"], ["बैजनी", "baijani", "purple"],
        ["खैरो", "khairo", "brown"], ["गुलाबी", "gulabi", "pink"],
    ],
    days: [
        ["आइतबार", "aitabar", "sunday"], ["सोमबार", "sombar", "monday"],
        ["मंगलबार", "manglabar", "tuesday"], ["बुधबार", "budhbar", "wednesday"],
        ["बिहिबार", "bihibar", "thursday"], ["शुक्रबार", "shukrabar", "friday"],
        ["शनिबार", "shanibar", "saturday"],
    ],
    food: [
        ["पानी", "pani", "water"], ["दूध", "dudh", "milk"],
        ["चिया", "chiya", "tea"], ["कफी", "kaphi", "coffee"],
        ["भात", "bhat", "rice"], ["दाल", "daal", "lentils"],
        ["रोटी", "roti", "bread"], ["मासु", "masu", "meat"],
        ["अण्डा", "andaa", "eggs"], ["तरकारी", "tarkari", "vegetables"],
        ["फलफूल", "phalphool", "fruits"], ["चिनी", "chini", "sugar"],
    ],
    animals: [
        ["कुकुर", "kukur", "dog"], ["बिरालो", "biralo", "cat"],
        ["गाई", "gai", "cow"], ["हात्ती", "hatti", "elephant"],
        ["सिंह", "singh", "lion"], ["बाघ", "bagh", "tiger"],
        ["घोडा", "ghoda", "horse"], ["खरायो", "kharayo", "rabbit"],
        ["चरा", "chara", "bird"], ["माछा", "macha", "fish"],
    ],
    body: [
        ["टाउको", "tauko", "head"], ["कपाल", "kapal", "hair"],
        ["आँखा", "aankha", "eyes"], ["नाक", "naak", "nose"],
        ["मुख", "mukh", "mouth"], ["कान", "kaan", "ears"],
        ["हात", "haat", "arms"], ["खुट्टा", "khutta", "legs"],
        ["औंला", "aunla", "fingers"], ["नङ", "nang", "nails"],
    ],
    places: [
        ["घर", "ghar", "house"], ["विद्यालय", "bidyalaya", "school"],
        ["अस्पताल", "aspataal", "hospital"], ["पसल", "pasal", "shop"],
        ["बजार", "bajar", "market"], ["मन्दिर", "mandir", "temple"],
        ["पार्क", "park", "park"], ["सहर", "sahar", "city"],
        ["गाउँ", "gaun", "village"], ["पहाड", "pahaad", "mountain"],
    ],
    actions: [
        ["खानु", "khanu", "to eat"], ["पिउनु", "piunu", "to drink"],
        ["जानु", "jaanu", "to go"], ["आउनु", "aaunu", "to come"],
        ["बोल्नु", "bolnu", "to speak"], ["हेर्नु", "hernu", "to see"],
        ["सुन्नु", "sunnu", "to hear"], ["नाच्नु", "nachnu", "to dance"],
        ["गाउनु", "gaunu", "to sing"], ["पढ्नु", "padhnu", "to read"],
    ],
    feelings: [
        ["खुसी", "khusi", "happy"], ["दुखी", "dukhi", "sad"],
        ["रिसाएको", "risaeko", "angry"], ["डराएको", "daraeko", "scared"],
        ["थकित", "thakit", "tired"], ["भोको", "bhoko", "hungry"],
        ["तिर्खाएको", "tirkhaeko", "thirsty"], ["सन्तुष्ट", "santusht", "satisfied"],
    ],
    weather: [
        ["मौसम", "mausam", "weather"], ["घाम", "gham", "sun"],
        ["पानी", "pani", "rain"], ["हावा", "hawa", "wind"],
        ["हिउँ", "hiu", "snow"], ["चिसो", "chiso", "cold"],
        ["तातो", "tato", "hot"], ["बादल", "badal", "cloud"],
    ]
};

// Flatten vocabulary for flashcards
const WORDS = Object.values(VOCABULARY).flat();

// ===== EXPANDED LESSONS (20 lessons for 2-4 years) =====
const LESSONS = [
    // Beginner Lessons (2-2.5 years)
    {
        id: 'greetings',
        title: "Lesson 1: Greetings & Polite Words",
        emoji: "👋",
        difficulty: "beginner",
        items: [
            ["नमस्ते", "namaste", "hello"],
            ["धन्यवाद", "dhanyabad", "thank you"],
            ["कृपया", "kripaya", "please"],
            ["माफ गर्नुहोस्", "maaf garnuhos", "sorry"],
            ["मलाई ठिक छ", "malai thik chha", "i am fine"],
        ]
    },
    {
        id: 'numbers-1-10',
        title: "Lesson 2: Numbers 1-10",
        emoji: "🔢",
        difficulty: "beginner",
        items: [
            ["एक", "ek", "one", "1"], ["दुई", "dui", "two", "2"],
            ["तीन", "tin", "three", "3"], ["चार", "chaar", "four", "4"],
            ["पाँच", "paanch", "five", "5"], ["छ", "chha", "six", "6"],
            ["सात", "saat", "seven", "7"], ["आठ", "aath", "eight", "8"],
            ["नौ", "nau", "nine", "9"], ["दश", "dash", "ten", "10"],
        ]
    },
    {
        id: 'family',
        title: "Lesson 3: My Family",
        emoji: "👨‍👩‍👧‍👦",
        difficulty: "beginner",
        items: [
            ["बुबा", "buba", "father"], ["आमा", "aama", "mother"],
            ["दाइ", "dai", "older brother"], ["भाइ", "bhai", "younger brother"],
            ["दिदी", "didi", "older sister"], ["बहिनी", "bahini", "younger sister"],
        ]
    },
    {
        id: 'colors',
        title: "Lesson 4: Colors",
        emoji: "🎨",
        difficulty: "beginner",
        items: [
            ["रातो", "raato", "red"], ["निलो", "nilo", "blue"],
            ["हरियो", "hariyo", "green"], ["पहेंलो", "pahelo", "yellow"],
            ["सेतो", "seto", "white"], ["कालो", "kalo", "black"],
        ]
    },
    
    // Intermediate Lessons (2.5-3 years)
    {
        id: 'numbers-11-20',
        title: "Lesson 5: Numbers 11-20",
        emoji: "🔢",
        difficulty: "intermediate",
        items: [
            ["एघार", "eghar", "eleven", "11"], ["बाह्र", "bahra", "twelve", "12"],
            ["तेह्र", "tehra", "thirteen", "13"], ["चौध", "chaudh", "fourteen", "14"],
            ["पन्ध्र", "pandhra", "fifteen", "15"], ["सोह्र", "sohra", "sixteen", "16"],
            ["सत्र", "satr", "seventeen", "17"], ["अठार", "athar", "eighteen", "18"],
            ["उन्नाइस", "unnais", "nineteen", "19"], ["बीस", "bis", "twenty", "20"],
        ]
    },
    {
        id: 'food',
        title: "Lesson 6: Food & Drink",
        emoji: "🍽️",
        difficulty: "intermediate",
        items: [
            ["पानी", "pani", "water"], ["दूध", "dudh", "milk"],
            ["चिया", "chiya", "tea"], ["कफी", "kaphi", "coffee"],
            ["भात", "bhat", "rice"], ["दाल", "daal", "lentils"],
            ["रोटी", "roti", "bread"], ["मासु", "masu", "meat"],
        ]
    },
    {
        id: 'animals',
        title: "Lesson 7: Animals",
        emoji: "🐾",
        difficulty: "intermediate",
        items: [
            ["कुकुर", "kukur", "dog"], ["बिरालो", "biralo", "cat"],
            ["गाई", "gai", "cow"], ["हात्ती", "hatti", "elephant"],
            ["सिंह", "singh", "lion"], ["बाघ", "bagh", "tiger"],
            ["घोडा", "ghoda", "horse"], ["चरा", "chara", "bird"],
        ]
    },
    {
        id: 'body',
        title: "Lesson 8: Body Parts",
        emoji: "🧍",
        difficulty: "intermediate",
        items: [
            ["टाउको", "tauko", "head"], ["आँखा", "aankha", "eyes"],
            ["नाक", "naak", "nose"], ["मुख", "mukh", "mouth"],
            ["कान", "kaan", "ears"], ["हात", "haat", "arms"],
            ["खुट्टा", "khutta", "legs"], ["औंला", "aunla", "fingers"],
        ]
    },
    
    // Advanced Lessons (3-4 years)
    {
        id: 'days',
        title: "Lesson 9: Days of the Week",
        emoji: "📅",
        difficulty: "advanced",
        items: [
            ["आइतबार", "aitabar", "sunday"], ["सोमबार", "sombar", "monday"],
            ["मंगलबार", "manglabar", "tuesday"], ["बुधबार", "budhbar", "wednesday"],
            ["बिहिबार", "bihibar", "thursday"], ["शुक्रबार", "shukrabar", "friday"],
            ["शनिबार", "shanibar", "saturday"],
        ]
    },
    {
        id: 'places',
        title: "Lesson 10: Places & Directions",
        emoji: "📍",
        difficulty: "advanced",
        items: [
            ["घर", "ghar", "house"], ["विद्यालय", "bidyalaya", "school"],
            ["अस्पताल", "aspataal", "hospital"], ["पसल", "pasal", "shop"],
            ["बजार", "bajar", "market"], ["मन्दिर", "mandir", "temple"],
            ["दायाँ", "daya", "right"], ["बायाँ", "baya", "left"],
        ]
    },
    {
        id: 'actions',
        title: "Lesson 11: Common Actions",
        emoji: "🏃",
        difficulty: "advanced",
        items: [
            ["खानु", "khanu", "to eat"], ["पिउनु", "piunu", "to drink"],
            ["जानु", "jaanu", "to go"], ["आउनु", "aaunu", "to come"],
            ["बोल्नु", "bolnu", "to speak"], ["हेर्नु", "hernu", "to see"],
            ["नाच्नु", "nachnu", "to dance"], ["गाउनु", "gaunu", "to sing"],
        ]
    },
    {
        id: 'feelings',
        title: "Lesson 12: Feelings & Emotions",
        emoji: "😊",
        difficulty: "advanced",
        items: [
            ["खुसी", "khusi", "happy"], ["दुखी", "dukhi", "sad"],
            ["रिसाएको", "risaeko", "angry"], ["डराएको", "daraeko", "scared"],
            ["थकित", "thakit", "tired"], ["भोको", "bhoko", "hungry"],
            ["तिर्खाएको", "tirkhaeko", "thirsty"], ["सन्तुष्ट", "santusht", "satisfied"],
        ]
    },
    {
        id: 'weather',
        title: "Lesson 13: Weather & Seasons",
        emoji: "🌤️",
        difficulty: "advanced",
        items: [
            ["मौसम", "mausam", "weather"], ["घाम", "gham", "sun"],
            ["पानी", "pani", "rain"], ["हावा", "hawa", "wind"],
            ["हिउँ", "hiu", "snow"], ["चिसो", "chiso", "cold"],
            ["तातो", "tato", "hot"], ["बादल", "badal", "cloud"],
        ]
    },
    {
        id: 'sentences-1',
        title: "Lesson 14: Simple Sentences",
        emoji: "📝",
        difficulty: "advanced",
        items: [
            ["म नेपाली सिक्दैछु", "ma nepali sikdaichu", "i am learning nepali"],
            ["म काठमाडौँ जान्छु", "ma kathmandu janchhu", "i am going to kathmandu"],
            ["मलाई चिया मन पर्छ", "malai chiya man parcha", "i like tea"],
            ["तिमी कस्तो छौ?", "timi kasto chhau?", "how are you?"],
            ["म ठिक छु", "ma thik chu", "i am fine"],
        ]
    },
    {
        id: 'sentences-2',
        title: "Lesson 15: More Sentences",
        emoji: "📝",
        difficulty: "advanced",
        items: [
            ["यो किताब हो", "yo kitab ho", "this is a book"],
            ["त्यो कलम हो", "tyo kalam ho", "that is a pen"],
            ["म स्कूल जान्छु", "ma school janchhu", "i go to school"],
            ["उनी खान्छन्", "uni khanchan", "they eat"],
            ["हामी खेल्छौं", "hami khelchhaun", "we play"],
        ]
    },
    {
        id: 'shopping',
        title: "Lesson 16: Shopping Phrases",
        emoji: "🛍️",
        difficulty: "advanced",
        items: [
            ["यसको मूल्य कति हो?", "yesko mulya kati ho?", "how much is this"],
            ["सस्तो गर्न सकिन्छ?", "sasto garna sakincha?", "can it be cheaper"],
            ["यो लिन्छु", "yo linchu", "i'll take this"],
            ["मलाई यो चाहियो", "malai yo chahiyo", "i need this"],
            ["कृपया मलाई देखाउनुहोस्", "kripaya malai dekhaunuhos", "please show me"],
        ]
    },
    {
        id: 'health',
        title: "Lesson 17: Health Basics",
        emoji: "🏥",
        difficulty: "advanced",
        items: [
            ["डाक्टर", "daktar", "doctor"], ["औषधि", "aushadhi", "medicine"],
            ["म बिरामी छु", "ma birami chhu", "i am sick"],
            ["मलाई दुख्छ", "malai dukcha", "it hurts"],
            ["अस्पताल", "aspataal", "hospital"],
        ]
    },
    {
        id: 'transport',
        title: "Lesson 18: Transport",
        emoji: "🚗",
        difficulty: "advanced",
        items: [
            ["गाडी", "gaadi", "car"], ["बस", "bas", "bus"],
            ["हवाई जहाज", "hawai jahaj", "airplane"],
            ["रेल", "rel", "train"], ["मोटरसाइकल", "motorsaikal", "motorcycle"],
            ["साइकल", "saikal", "bicycle"], ["डुङ्गा", "dunga", "boat"],
        ]
    },
    {
        id: 'classroom',
        title: "Lesson 19: Classroom Words",
        emoji: "📚",
        difficulty: "advanced",
        items: [
            ["किताब", "kitab", "book"], ["कलम", "kalam", "pen"],
            ["कापी", "kapi", "notebook"], ["रबर", "rabar", "eraser"],
            ["सार्पनर", "sarpanar", "sharpener"], ["झोला", "jhola", "bag"],
            ["कुर्सी", "kursi", "chair"], ["टेबल", "tebal", "table"],
        ]
    },
    {
        id: 'review',
        title: "Lesson 20: Review & Practice",
        emoji: "⭐",
        difficulty: "advanced",
        items: [
            ["नमस्ते", "namaste", "hello"],
            ["धन्यवाद", "dhanyabad", "thank you"],
            ["पानी", "pani", "water"],
            ["खुसी", "khusi", "happy"],
            ["घर", "ghar", "house"],
            ["कुकुर", "kukur", "dog"],
            ["रातो", "raato", "red"],
            ["एक", "ek", "one", "1"],
        ]
    },
];

// ===== TRANSLATIONS =====
const TRANSLATIONS = {
    'nepaliAlphabet': { en: 'Nepali Alphabet', ne: 'नेपाली वर्णमाला' },
    'clickLetter': { en: 'Click a letter to see its pronunciation', ne: 'उच्चारण हेर्न अक्षरमा क्लिक गर्नुहोस्' },
    'practiceFlashcards': { en: 'Practice Flashcards', ne: 'फ्लैशकार्ड अभ्यास गर्नुहोस्' },
    'flipCard': { en: 'Flip Card', ne: 'पल्टाउनुहोस्' },
    'nextCard': { en: 'Next Card', ne: 'अर्को कार्ड' },
    'testYourKnowledge': { en: 'Test Your Knowledge!', ne: 'तपाईंको ज्ञान परीक्षण गर्नुहोस्!' },
    'nextQuestion': { en: 'Next Question', ne: 'अर्को प्रश्न' },
    'lessons': { en: 'Lessons', ne: 'पाठहरू' },
    'selectLesson': { en: 'Select a lesson', ne: 'पाठ चयन गर्नुहोस्' },
    'markLessonComplete': { en: 'Mark Lesson Complete', ne: 'पाठ पूरा गर्नुहोस्' },
    'resetLessons': { en: 'Reset Lessons', ne: 'पाठहरू रिसेट गर्नुहोस्' },
    'correct': { en: 'Correct!', ne: 'सही!' },
    'tryAgain': { en: 'Try again!', ne: 'फेरि प्रयास गर्नुहोस्!' },
    'incorrect': { en: 'Incorrect. The correct answer was:', ne: 'गलत। सही उत्तर थियो:' },
    'whatIsSound': { en: 'What is the sound of', ne: 'को ध्वनि के हो' },
    'whatDoes': { en: 'What does', ne: 'को अर्थ के हो' },
    'mean': { en: 'mean?', ne: '?' },
    'typeEnglishHere': { en: 'Type English here', ne: 'यहाँ अङ्ग्रेजी टाइप गर्नुहोस्' },
    'check': { en: 'Check', ne: 'जाँच गर्नुहोस्' },
    'pronunciation': { en: 'Pronunciation', ne: 'उच्चारण' },
    'beginner': { en: 'Beginner', ne: 'सुरुवात' },
    'intermediate': { en: 'Intermediate', ne: 'मध्यम' },
    'advanced': { en: 'Advanced', ne: 'उन्नत' },
    'lessonProgress': { en: 'Lesson Progress', ne: 'पाठ प्रगति' },
    'completed': { en: 'Completed', ne: 'पूरा भयो' },
};

// ===== NEPALI MODULE CLASS =====
export class NepaliModule {
    constructor(container) {
        this.container = container;
        this.language = LanguageService.getCurrentLanguage();
        
        // State
        this.currentFlashcardIndex = 0;
        this.flashcardFlipped = false;
        this.lessonsProgress = new Set(StorageService.getNepaliProgress());
        this.currentLessonItems = [];
        this.quizLocked = false;
        this.currentTab = 'alphabet';
        this.isRendered = false;
        this.currentCategory = 'all';
    }

    // ===== TRANSLATION HELPER =====
    t(key) {
        const lang = this.language === 'ne' ? 'ne' : 'en';
        const translation = TRANSLATIONS[key];
        if (!translation) return key;
        return translation[lang] || translation.en || key;
    }

    // ===== RENDER =====
    render() {
        this.container.innerHTML = `
            <div class="nepali-module" data-language="${this.language}">
                <!-- Header -->
                <div class="nepali-header">
                    <div class="language-badge">
                        <span class="flag">🇳🇵</span>
                        <span class="lang-name">${this.language === 'ne' ? 'नेपाली' : 'Nepali'}</span>
                        ${this.language === 'bilingual' ? '<span class="bilingual-tag">🌏 दुवै / Both</span>' : ''}
                    </div>
                    <div class="header-stats">
                        <span class="stat-badge">⭐ ${StorageService.getStars()} stars</span>
                        <span class="stat-badge">📚 ${this.lessonsProgress.size}/${LESSONS.length} lessons</span>
                    </div>
                    <button class="reset-btn" id="resetProgressBtn" title="${this.t('resetLessons')}">
                        🔄
                    </button>
                </div>

                <!-- Progress Bar -->
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${(this.lessonsProgress.size / LESSONS.length) * 100}%"></div>
                    <span class="progress-text">${Math.round((this.lessonsProgress.size / LESSONS.length) * 100)}%</span>
                </div>

                <!-- Tabs -->
                <div class="tab-navigation">
                    <button class="tab-btn active" data-tab="alphabet">${this.language === 'ne' ? 'वर्णमाला' : 'Alphabet'}</button>
                    <button class="tab-btn" data-tab="flashcards">${this.language === 'ne' ? 'फ्लैशकार्ड' : 'Flashcards'}</button>
                    <button class="tab-btn" data-tab="quiz">${this.language === 'ne' ? 'प्रश्नोत्तरी' : 'Quiz'}</button>
                    <button class="tab-btn" data-tab="lessons">${this.language === 'ne' ? 'पाठहरू' : 'Lessons'}</button>
                    <button class="tab-btn" data-tab="games">${this.language === 'ne' ? 'खेलहरू' : 'Games'}</button>
                </div>

                <!-- Content -->
                <div class="tab-content">
                    <!-- Alphabet Tab -->
                    <div id="alphabetTab" class="tab-pane active">
                        <div class="alphabet-section">
                            <h3 class="section-title">${this.t('nepaliAlphabet')}</h3>
                            <p class="section-hint">${this.t('clickLetter')}</p>
                            <div class="alphabet-grid" id="alphabetGrid"></div>
                            <div class="alphabet-display" id="alphabetDisplay">
                                <span class="letter-display"></span>
                                <span class="pronunciation-display"></span>
                            </div>
                        </div>
                    </div>

                    <!-- Flashcards Tab -->
                    <div id="flashcardsTab" class="tab-pane hidden">
                        <div class="flashcards-section">
                            <h3 class="section-title">${this.t('practiceFlashcards')}</h3>
                            <div class="category-filter">
                                <button class="filter-btn active" data-category="all">All</button>
                                ${Object.keys(VOCABULARY).map(cat => 
                                    `<button class="filter-btn" data-category="${cat}">${cat}</button>`
                                ).join('')}
                            </div>
                            <div class="flashcard-container">
                                <div class="flashcard" id="flashcard">
                                    <div class="card-front">
                                        <span class="nepali-word" id="flashcardNepali"></span>
                                        <span class="phonetic" id="flashcardPhonetic"></span>
                                    </div>
                                    <div class="card-back">
                                        <span class="meaning" id="flashcardMeaning"></span>
                                    </div>
                                </div>
                            </div>
                            <div class="flashcard-controls">
                                <button class="btn btn-primary" id="flashcardFlipBtn">${this.t('flipCard')}</button>
                                <button class="btn btn-success" id="flashcardNextBtn">${this.t('nextCard')}</button>
                            </div>
                        </div>
                    </div>

                    <!-- Quiz Tab -->
                    <div id="quizTab" class="tab-pane hidden">
                        <div class="quiz-section">
                            <h3 class="section-title">${this.t('testYourKnowledge')}</h3>
                            <div class="quiz-question" id="quizQuestion"></div>
                            <div class="quiz-choices" id="quizChoices"></div>
                            <div class="quiz-feedback" id="quizFeedback"></div>
                            <div class="quiz-score" id="quizScore">Score: 0/0</div>
                            <div class="flex-center mt-2">
                                <button class="btn btn-purple" id="quizNextBtn" disabled>${this.t('nextQuestion')}</button>
                            </div>
                        </div>
                    </div>

                    <!-- Lessons Tab -->
                    <div id="lessonsTab" class="tab-pane hidden">
                        <div class="lessons-layout">
                            <div class="lesson-sidebar" id="lessonButtonsContainer">
                                <h4 class="sidebar-title">${this.t('lessons')}</h4>
                                <div class="lesson-filters">
                                    <button class="filter-btn active" data-filter="all">All</button>
                                    <button class="filter-btn" data-filter="beginner">🌟 ${this.t('beginner')}</button>
                                    <button class="filter-btn" data-filter="intermediate">⭐ ${this.t('intermediate')}</button>
                                    <button class="filter-btn" data-filter="advanced">🚀 ${this.t('advanced')}</button>
                                </div>
                            </div>
                            <div class="lesson-content">
                                <h4 class="lesson-title" id="lessonTitle">${this.t('selectLesson')}</h4>
                                <div class="lesson-items" id="lessonItemsContainer"></div>
                                <div class="lesson-actions">
                                    <button class="btn btn-success" id="lessonCompleteBtn" disabled>
                                        ${this.t('markLessonComplete')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Games Tab -->
                    <div id="gamesTab" class="tab-pane hidden">
                        <div class="games-section">
                            <h3 class="section-title">🎮 ${this.language === 'ne' ? 'खेलहरू' : 'Games'}</h3>
                            <div class="games-grid">
                                <div class="game-card" data-game="match">
                                    <div class="game-icon">🃏</div>
                                    <h4>${this.language === 'ne' ? 'मिलाउने खेल' : 'Matching Game'}</h4>
                                    <p>${this.language === 'ne' ? 'नेपाली र अङ्ग्रेजी मिलाउनुहोस्' : 'Match Nepali to English'}</p>
                                    <button class="btn btn-primary btn-sm play-game-btn">Play</button>
                                </div>
                                <div class="game-card" data-game="memory">
                                    <div class="game-icon">🧠</div>
                                    <h4>${this.language === 'ne' ? 'मेमोरी खेल' : 'Memory Game'}</h4>
                                    <p>${this.language === 'ne' ? 'जोडी मिलाउनुहोस्' : 'Find the pairs'}</p>
                                    <button class="btn btn-primary btn-sm play-game-btn">Play</button>
                                </div>
                                <div class="game-card" data-game="spelling">
                                    <div class="game-icon">✏️</div>
                                    <h4>${this.language === 'ne' ? 'हिज्जे खेल' : 'Spelling Game'}</h4>
                                    <p>${this.language === 'ne' ? 'शब्दको हिज्जे मिलाउनुहोस्' : 'Spell the word'}</p>
                                    <button class="btn btn-primary btn-sm play-game-btn">Play</button>
                                </div>
                                <div class="game-card" data-game="bingo">
                                    <div class="game-icon">🎯</div>
                                    <h4>${this.language === 'ne' ? 'बिङ्गो' : 'Bingo'}</h4>
                                    <p>${this.language === 'ne' ? 'शब्द पहिचान गर्नुहोस्' : 'Identify the word'}</p>
                                    <button class="btn btn-primary btn-sm play-game-btn">Play</button>
                                </div>
                            </div>
                            <div id="gameContent" class="game-content">
                                <p class="text-center text-muted">${this.language === 'ne' ? 'खेल चयन गर्नुहोस्' : 'Select a game to play'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.isRendered = true;
        
        // Bind events and initialize
        this.bindEvents();
        this.renderAlphabetGrid();
        this.loadFlashcard();
        this.renderLessonButtons();
        this.loadQuizQuestion();
        this.setupGameListeners();
    }

    // ===== BIND EVENTS =====
    bindEvents() {
        // Tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleTabClick(e);
            });
        });

        // Flashcards
        const flipBtn = document.getElementById('flashcardFlipBtn');
        const nextBtn = document.getElementById('flashcardNextBtn');
        const card = document.getElementById('flashcard');
        
        if (flipBtn) flipBtn.addEventListener('click', () => this.handleFlashcardFlip());
        if (nextBtn) nextBtn.addEventListener('click', () => this.handleFlashcardNext());
        if (card) card.addEventListener('click', () => this.handleFlashcardFlip());

        // Flashcard category filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentCategory = e.target.dataset.category;
                this.loadFlashcard();
            });
        });

        // Quiz
        const quizNext = document.getElementById('quizNextBtn');
        if (quizNext) quizNext.addEventListener('click', () => this.handleQuizNext());

        // Lessons
        const completeBtn = document.getElementById('lessonCompleteBtn');
        const resetBtn = document.getElementById('resetProgressBtn');
        
        if (completeBtn) completeBtn.addEventListener('click', () => this.handleLessonComplete());
        if (resetBtn) resetBtn.addEventListener('click', () => this.handleResetProgress());

        // Lesson filters
        document.querySelectorAll('.lesson-filters .filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.lesson-filters .filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.renderLessonButtons(e.target.dataset.filter);
            });
        });
    }

    // ===== TAB HANDLING =====
    handleTabClick(e) {
        const tab = e.target.dataset.tab;
        if (!tab) return;
        
        this.currentTab = tab;
        
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });
        
        // Show/hide tab panes
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.add('hidden');
        });
        const targetPane = document.getElementById(`${tab}Tab`);
        if (targetPane) targetPane.classList.remove('hidden');
        
        // Initialize content if needed
        if (tab === 'alphabet') this.renderAlphabetGrid();
        if (tab === 'flashcards') this.loadFlashcard();
        if (tab === 'quiz') this.loadQuizQuestion();
        if (tab === 'lessons') this.renderLessonButtons();
    }

    // ===== ALPHABET =====
    renderAlphabetGrid() {
        const grid = document.getElementById('alphabetGrid');
        if (!grid) return;
        grid.innerHTML = '';
        
        NEPALI_ALPHABET.forEach(([letter, sound, phonetic]) => {
            const button = document.createElement('button');
            button.textContent = letter;
            button.className = 'alphabet-btn';
            button.setAttribute('aria-label', `${letter} - ${sound} (${phonetic})`);
            button.addEventListener('click', () => {
                this.displayAlphabetInfo(letter, sound, phonetic);
            });
            grid.appendChild(button);
        });
    }

    displayAlphabetInfo(letter, sound, phonetic) {
        const display = document.getElementById('alphabetDisplay');
        if (!display) return;
        
        const letterDisplay = display.querySelector('.letter-display');
        const pronunciationDisplay = display.querySelector('.pronunciation-display');
        
        if (letterDisplay) letterDisplay.textContent = letter;
        if (pronunciationDisplay) {
            pronunciationDisplay.textContent = `${this.t('pronunciation')}: ${sound} (${phonetic})`;
        }
        
        // Visual feedback
        display.style.transition = 'background 0.2s';
        display.style.background = '#DBEAFE';
        setTimeout(() => {
            display.style.background = '';
        }, 300);
    }

    // ===== FLASHCARDS =====
    loadFlashcard() {
        let words = WORDS;
        
        // Filter by category if selected
        if (this.currentCategory !== 'all' && VOCABULARY[this.currentCategory]) {
            words = VOCABULARY[this.currentCategory];
        }
        
        if (words.length === 0) return;
        
        const randomIndex = Math.floor(Math.random() * words.length);
        this.currentFlashcardIndex = randomIndex;
        const word = words[randomIndex];
        const [nepali, phonetic, english] = word;

        const card = document.getElementById('flashcard');
        if (!card) return;
        
        const nepaliEl = card.querySelector('#flashcardNepali');
        const phoneticEl = card.querySelector('#flashcardPhonetic');
        const meaningEl = card.querySelector('#flashcardMeaning');
        
        if (nepaliEl) nepaliEl.textContent = nepali;
        if (phoneticEl) phoneticEl.textContent = phonetic;
        if (meaningEl) meaningEl.textContent = english;
        
        card.classList.remove('flipped');
        this.flashcardFlipped = false;
    }

    handleFlashcardFlip() {
        const card = document.getElementById('flashcard');
        if (!card) return;
        card.classList.toggle('flipped');
        this.flashcardFlipped = !this.flashcardFlipped;
    }

    handleFlashcardNext() {
        this.loadFlashcard();
    }

    // ===== QUIZ =====
    loadQuizQuestion() {
        if (this.quizLocked) return;
        
        const questionEl = document.getElementById('quizQuestion');
        const choicesEl = document.getElementById('quizChoices');
        const feedbackEl = document.getElementById('quizFeedback');
        const nextBtn = document.getElementById('quizNextBtn');
        const scoreEl = document.getElementById('quizScore');
        
        if (!questionEl || !choicesEl) return;
        
        if (feedbackEl) {
            feedbackEl.textContent = '';
            feedbackEl.className = 'quiz-feedback';
        }
        if (nextBtn) {
            nextBtn.disabled = true;
        }
        choicesEl.innerHTML = '';

        let questionText, correctAnswer, options = [];

        // Get a random word from the full vocabulary
        const allWords = WORDS;
        const randomWord = allWords[Math.floor(Math.random() * allWords.length)];
        const [nepali, phonetic, english] = randomWord;
        
        // 50% alphabet, 50% vocabulary
        if (Math.random() < 0.3) {
            // Alphabet question
            const [letter, sound] = NEPALI_ALPHABET[Math.floor(Math.random() * NEPALI_ALPHABET.length)];
            questionText = `${this.t('whatIsSound')} '${letter}'?`;
            correctAnswer = sound.toLowerCase();
            options.push(correctAnswer);
            while (options.length < 4) {
                const randomSound = NEPALI_ALPHABET[Math.floor(Math.random() * NEPALI_ALPHABET.length)][1].toLowerCase();
                if (!options.includes(randomSound)) options.push(randomSound);
            }
        } else {
            // Vocabulary question
            questionText = `${this.t('whatDoes')} '${nepali}' ${this.t('mean')}`;
            correctAnswer = english.toLowerCase();
            options.push(correctAnswer);
            while (options.length < 4) {
                const randomMeaning = allWords[Math.floor(Math.random() * allWords.length)][2].toLowerCase();
                if (!options.includes(randomMeaning)) options.push(randomMeaning);
            }
        }

        questionEl.textContent = questionText;
        options.sort(() => Math.random() - 0.5);

        options.forEach((optionText) => {
            const button = document.createElement('button');
            button.textContent = optionText;
            button.className = 'quiz-choice';
            button.addEventListener('click', () => {
                this.checkQuizAnswer(button, optionText, correctAnswer);
            });
            choicesEl.appendChild(button);
        });
    }

    checkQuizAnswer(clickedButton, selectedAnswer, correctAnswer) {
        this.quizLocked = true;
        
        // Track quiz stats
        if (!this.quizCorrect) this.quizCorrect = 0;
        if (!this.quizTotal) this.quizTotal = 0;
        this.quizTotal++;
        
        document.querySelectorAll('.quiz-choice').forEach(btn => {
            btn.disabled = true;
            if (btn.textContent.toLowerCase() === correctAnswer) {
                btn.classList.add('correct');
            } else if (btn === clickedButton) {
                btn.classList.add('wrong');
            }
        });

        const feedback = document.getElementById('quizFeedback');
        if (feedback) {
            if (selectedAnswer.toLowerCase() === correctAnswer) {
                this.quizCorrect++;
                feedback.textContent = this.t('correct') + ' 🎉';
                feedback.className = 'quiz-feedback correct';
            } else {
                feedback.textContent = `${this.t('incorrect')} "${correctAnswer}".`;
                feedback.className = 'quiz-feedback wrong';
            }
        }

        // Update score
        const scoreEl = document.getElementById('quizScore');
        if (scoreEl) {
            scoreEl.textContent = `Score: ${this.quizCorrect}/${this.quizTotal}`;
        }

        const nextBtn = document.getElementById('quizNextBtn');
        if (nextBtn) {
            nextBtn.disabled = false;
        }
    }

    handleQuizNext() {
        this.quizLocked = false;
        this.loadQuizQuestion();
    }

    // ===== LESSONS =====
    renderLessonButtons(filter = 'all') {
        const container = document.getElementById('lessonButtonsContainer');
        if (!container) return;
        
        // Keep the title
        const title = container.querySelector('.sidebar-title');
        const filters = container.querySelector('.lesson-filters');
        container.innerHTML = '';
        if (title) container.appendChild(title);
        if (filters) container.appendChild(filters);
        
        const filteredLessons = filter === 'all' 
            ? LESSONS 
            : LESSONS.filter(l => l.difficulty === filter);
        
        filteredLessons.forEach((lesson, index) => {
            const originalIndex = LESSONS.indexOf(lesson);
            const button = document.createElement('button');
            const isCompleted = this.lessonsProgress.has(originalIndex);
            const isUnlocked = (originalIndex === 0) || this.lessonsProgress.has(originalIndex - 1);

            const emoji = lesson.emoji || '📚';
            button.textContent = isCompleted ? `✅ ${emoji} ${lesson.title}` : `${emoji} ${lesson.title}`;
            button.className = `lesson-btn ${isCompleted ? 'completed' : isUnlocked ? 'unlocked' : 'locked'}`;
            button.disabled = !isUnlocked;
            button.dataset.index = originalIndex;
            button.addEventListener('click', () => this.loadLessonContent(originalIndex));
            container.appendChild(button);
        });

        // Clear content
        const titleEl = document.getElementById('lessonTitle');
        const itemsContainer = document.getElementById('lessonItemsContainer');
        const completeBtn = document.getElementById('lessonCompleteBtn');
        
        if (titleEl) titleEl.textContent = this.t('selectLesson');
        if (itemsContainer) itemsContainer.innerHTML = '';
        if (completeBtn) completeBtn.disabled = true;
    }

    loadLessonContent(lessonIndex) {
        const lesson = LESSONS[lessonIndex];
        const container = document.getElementById('lessonItemsContainer');
        const titleEl = document.getElementById('lessonTitle');
        
        if (!container || !titleEl) return;
        
        const emoji = lesson.emoji || '📚';
        titleEl.textContent = `${emoji} ${lesson.title} (${this.t(lesson.difficulty)})`;
        container.innerHTML = '';
        this.currentLessonItems = [];

        lesson.items.forEach((item, itemIndex) => {
            const nepali = item[0];
            const phonetic = item[1];
            const english = item[2];
            const numberAlias = item[3] || null;

            const row = document.createElement('div');
            row.className = 'lesson-item';

            const nepaliLabel = document.createElement('span');
            nepaliLabel.textContent = nepali;
            nepaliLabel.className = 'lesson-nepali';

            const phoneticLabel = document.createElement('span');
            phoneticLabel.textContent = `(${phonetic})`;
            phoneticLabel.className = 'lesson-phonetic';

            const inputField = document.createElement('input');
            inputField.type = 'text';
            inputField.placeholder = this.t('typeEnglishHere');
            inputField.className = 'lesson-input';
            inputField.dataset.index = itemIndex;
            
            const checkBtn = document.createElement('button');
            checkBtn.textContent = this.t('check');
            checkBtn.className = 'lesson-check-btn';
            
            const feedbackLabel = document.createElement('span');
            feedbackLabel.className = 'lesson-feedback';

            const possibleAnswers = this.getPossibleAnswers(english, numberAlias);

            checkBtn.addEventListener('click', () => {
                this.checkLessonTranslation(inputField, possibleAnswers, feedbackLabel, itemIndex);
            });

            inputField.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    checkBtn.click();
                }
            });

            row.appendChild(nepaliLabel);
            row.appendChild(phoneticLabel);
            row.appendChild(inputField);
            row.appendChild(checkBtn);
            row.appendChild(feedbackLabel);
            container.appendChild(row);

            this.currentLessonItems.push({
                entry: inputField,
                possibleAnswers: possibleAnswers,
                feedbackLabel: feedbackLabel,
                isCorrect: false,
                rowElement: row
            });
        });

        this.checkLessonCompletionStatus();
    }

    getPossibleAnswers(english, numberAlias = null) {
        const answers = [];
        if (english) answers.push(english.toLowerCase());
        if (numberAlias) answers.push(numberAlias.toLowerCase());
        
        const variations = {
            'one': ['1'], 'two': ['2'], 'three': ['3'], 'four': ['4'],
            'five': ['5'], 'six': ['6'], 'seven': ['7'], 'eight': ['8'],
            'nine': ['9'], 'ten': ['10'], 'eleven': ['11'], 'twelve': ['12'],
            'thirteen': ['13'], 'fourteen': ['14'], 'fifteen': ['15'],
            'sixteen': ['16'], 'seventeen': ['17'], 'eighteen': ['18'],
            'nineteen': ['19'], 'twenty': ['20'],
            'hello': ['hi', 'hey', 'namaste'],
            'thank you': ['thanks', 'thanku', 'dhanyabad'],
            'how are you': ['how r u', 'howru'],
            'i am fine': ['im fine', 'fine'],
            'water': ['pani'], 'milk': ['dudh'], 'tea': ['chiya'],
            'coffee': ['kaphi'], 'rice': ['bhat'], 'lentils': ['daal'],
            'red': ['raato'], 'blue': ['nilo'], 'green': ['hariyo'],
            'yellow': ['pahelo'], 'white': ['seto'], 'black': ['kalo'],
            'sunday': ['sun', 'aitabar'], 'monday': ['mon', 'sombar'],
            'tuesday': ['tue', 'manglabar'], 'wednesday': ['wed', 'budhbar'],
            'thursday': ['thu', 'bihibar'], 'friday': ['fri', 'shukrabar'],
            'saturday': ['sat', 'shanibar'],
            'father': ['dad', 'buba'], 'mother': ['mum', 'mom', 'aama'],
            'older brother': ['brother', 'dai'], 'younger brother': ['bhai'],
            'older sister': ['sister', 'didi'], 'younger sister': ['bahini'],
        };
        
        const lowerEnglish = english ? english.toLowerCase() : '';
        if (variations[lowerEnglish]) {
            answers.push(...variations[lowerEnglish]);
        }
        
        return [...new Set(answers)];
    }

    checkLessonTranslation(inputField, possibleAnswers, feedbackLabel, itemIndex) {
    const userAnswer = inputField.value.trim().toLowerCase();

    feedbackLabel.className = 'lesson-feedback';
    inputField.className = 'lesson-input';

    // Check if answer is in possible answers
    let isCorrect = false;
    for (let i = 0; i < possibleAnswers.length; i++) {
        if (userAnswer === possibleAnswers[i]) {
            isCorrect = true;
            break;
        }
    }

    if (isCorrect) {
        feedbackLabel.textContent = '✅ ' + this.t('correct');
        feedbackLabel.className = 'lesson-feedback correct';
        inputField.disabled = true;
        inputField.className = 'lesson-input correct';
        this.currentLessonItems[itemIndex].isCorrect = true;
    } else {
        let accepted = '';
        for (let i = 0; i < Math.min(4, possibleAnswers.length); i++) {
            if (i > 0) accepted += ', ';
            accepted += possibleAnswers[i];
        }
        feedbackLabel.textContent = '❌ ' + this.t('tryAgain') + ' (' + accepted + ')';
        feedbackLabel.className = 'lesson-feedback wrong';
        inputField.className = 'lesson-input wrong';
        this.currentLessonItems[itemIndex].isCorrect = false;
    }
    this.checkLessonCompletionStatus();
}

    // ===== CHECK LESSON COMPLETION STATUS =====
// ===== CHECK LESSON COMPLETION STATUS =====
checkLessonCompletionStatus() {
    const completeBtn = document.getElementById('lessonCompleteBtn');
    if (!completeBtn) return;
    
    // Check if all items are correct
    let allCorrect = this.currentLessonItems.length > 0;
    for (let i = 0; i < this.currentLessonItems.length; i++) {
        if (!this.currentLessonItems[i].isCorrect) {
            allCorrect = false;
            break;
        }
    }
    
    if (allCorrect) {
        completeBtn.disabled = false;
        completeBtn.classList.add('ready');
        completeBtn.textContent = '✅ ' + this.t('markLessonComplete');
    } else {
        completeBtn.disabled = true;
        completeBtn.classList.remove('ready');
        let completed = 0;
        for (let j = 0; j < this.currentLessonItems.length; j++) {
            if (this.currentLessonItems[j].isCorrect) completed++;
        }
        completeBtn.textContent = '📝 ' + completed + '/' + this.currentLessonItems.length + ' ' + this.t('markLessonComplete');
    }
}

// ===== COMPLETE CURRENT LESSON =====
handleLessonComplete() {
    const titleEl = document.getElementById('lessonTitle');
    if (!titleEl) return;
    
    // Extract the lesson title (remove emojis and extra text)
    let lessonTitle = titleEl.textContent;
    // Remove emojis and parentheses content
    lessonTitle = lessonTitle.replace(/[📚⭐🌟🚀✅]|\(.*\)/g, '').trim();
    
    // Find the lesson index
    let foundIndex = -1;
    for (let i = 0; i < LESSONS.length; i++) {
        if (LESSONS[i].title === lessonTitle) {
            foundIndex = i;
            break;
        }
    }
    
    // If not found, try partial match
    if (foundIndex === -1) {
        for (let j = 0; j < LESSONS.length; j++) {
            if (lessonTitle.includes(LESSONS[j].title) || LESSONS[j].title.includes(lessonTitle)) {
                foundIndex = j;
                break;
            }
        }
    }

    if (foundIndex !== -1 && !this.lessonsProgress.has(foundIndex)) {
        this.lessonsProgress.add(foundIndex);
        StorageService.set('nepaliProgress', Array.from(this.lessonsProgress));
        
        // Award stars for completing lessons
        StorageService.addStar();
        
        // Visual feedback - mark all as completed
        for (let k = 0; k < this.currentLessonItems.length; k++) {
            const item = this.currentLessonItems[k];
            item.rowElement.classList.add('completed');
            item.entry.className = 'lesson-input completed';
            item.entry.disabled = true;
            if (item.feedbackLabel) {
                item.feedbackLabel.textContent = '✅';
                item.feedbackLabel.className = 'lesson-feedback completed';
            }
        }

        const emoji = LESSONS[foundIndex].emoji || '📚';
        titleEl.textContent = '✅ ' + emoji + ' ' + LESSONS[foundIndex].title + ' - ' + this.t('correct') + ' ⭐';
        
        // Update progress bar
        const progressBar = document.querySelector('.progress-bar');
        const progressText = document.querySelector('.progress-text');
        if (progressBar) {
            const percent = (this.lessonsProgress.size / LESSONS.length) * 100;
            progressBar.style.width = percent + '%';
            if (progressText) progressText.textContent = Math.round(percent) + '%';
        }
        
        // Update stats
        const statBadge = document.querySelector('.stat-badge:last-child');
        if (statBadge) {
            statBadge.textContent = '📚 ' + this.lessonsProgress.size + '/' + LESSONS.length + ' lessons';
        }
        
        // Re-render lesson buttons
        this.renderLessonButtons();
        
        // Show success message
        const container = document.getElementById('lessonItemsContainer');
        if (container) {
            // Remove existing feedback
            const existingFeedback = document.getElementById('lessonFeedback');
            if (existingFeedback) existingFeedback.remove();
            
            const fb = document.createElement('div');
            fb.id = 'lessonFeedback';
            fb.className = 'game-feedback correct';
            fb.textContent = '🎉 ' + (this.language === 'ne' ? 'पाठ पूरा भयो! राम्रो!' : 'Lesson complete! Great job!');
            container.parentNode.insertBefore(fb, container.nextSibling);
            
            // Auto-remove after 3 seconds
            const self = this;
            setTimeout(function() {
                const fbEl = document.getElementById('lessonFeedback');
                if (fbEl) {
                    fbEl.style.opacity = '0';
                    setTimeout(function() {
                        const fbToRemove = document.getElementById('lessonFeedback');
                        if (fbToRemove) fbToRemove.remove();
                    }, 500);
                }
            }, 3000);
        }
    } else if (foundIndex !== -1 && this.lessonsProgress.has(foundIndex)) {
        // Lesson already completed
        const container = document.getElementById('lessonItemsContainer');
        if (container) {
            // Remove existing feedback
            const existingFeedback = document.getElementById('lessonFeedback');
            if (existingFeedback) existingFeedback.remove();
            
            const fb = document.createElement('div');
            fb.id = 'lessonFeedback';
            fb.className = 'game-feedback';
            fb.textContent = '✅ ' + (this.language === 'ne' ? 'यो पाठ पहिले नै पूरा भइसकेको छ!' : 'This lesson is already completed!');
            container.parentNode.insertBefore(fb, container.nextSibling);
            
            setTimeout(function() {
                const fbEl = document.getElementById('lessonFeedback');
                if (fbEl) {
                    fbEl.style.opacity = '0';
                    setTimeout(function() {
                        const fbToRemove = document.getElementById('lessonFeedback');
                        if (fbToRemove) fbToRemove.remove();
                    }, 500);
                }
            }, 2000);
        }
    }
}

    handleResetProgress() {
        if (confirm('Are you sure you want to reset all lesson progress?')) {
            this.lessonsProgress.clear();
            StorageService.setNepaliProgress([]);
            this.renderLessonButtons();
            
            const titleEl = document.getElementById('lessonTitle');
            const itemsContainer = document.getElementById('lessonItemsContainer');
            const completeBtn = document.getElementById('lessonCompleteBtn');
            
            if (titleEl) titleEl.textContent = this.t('selectLesson');
            if (itemsContainer) itemsContainer.innerHTML = '';
            if (completeBtn) completeBtn.disabled = true;
            
            // Reset progress bar
            const progressBar = document.querySelector('.progress-bar');
            const progressText = document.querySelector('.progress-text');
            if (progressBar) {
                progressBar.style.width = '0%';
                if (progressText) progressText.textContent = '0%';
            }
            
            alert('All lessons have been reset!');
        }
    }

    // ===== GAMES =====
    setupGameListeners() {
        document.querySelectorAll('.play-game-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const gameCard = e.target.closest('.game-card');
                if (gameCard) {
                    this.loadGame(gameCard.dataset.game);
                }
            });
        });
    }

    loadGame(gameType) {
        const container = document.getElementById('gameContent');
        if (!container) return;

        switch(gameType) {
            case 'match':
                this.loadMatchingGame(container);
                break;
            case 'memory':
                this.loadMemoryGame(container);
                break;
            case 'spelling':
                this.loadSpellingGame(container);
                break;
            case 'bingo':
                this.loadBingoGame(container);
                break;
            default:
                container.innerHTML = '<p class="text-center text-muted">Game coming soon!</p>';
        }
    }

    loadMatchingGame(container) {
        // Get 6 random words for matching
        const shuffled = [...WORDS].sort(() => Math.random() - 0.5).slice(0, 6);
        const items = [];
        shuffled.forEach(([nepali, phonetic, english]) => {
            items.push({ nepali, english });
        });
        
        // Create two columns: Nepali and English
        const nepaliItems = [...items].sort(() => Math.random() - 0.5);
        const englishItems = [...items].sort(() => Math.random() - 0.5);
        
        container.innerHTML = `
            <div class="matching-game">
                <h4>${this.language === 'ne' ? 'नेपाली र अङ्ग्रेजी मिलाउनुहोस्' : 'Match Nepali to English'}</h4>
                <div class="match-grid">
                    <div class="match-column">
                        <h5>🇳🇵 Nepali</h5>
                        ${nepaliItems.map((item, idx) => `
                            <div class="match-item" data-nepali="${item.nepali}" data-idx="${idx}">
                                ${item.nepali}
                            </div>
                        `).join('')}
                    </div>
                    <div class="match-column">
                        <h5>🇬🇧 English</h5>
                        ${englishItems.map((item, idx) => `
                            <div class="match-item" data-english="${item.english}" data-idx="${idx}">
                                ${item.english}
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div id="matchFeedback" class="match-feedback"></div>
                <button class="btn btn-primary" id="matchResetBtn">🔄 ${this.language === 'ne' ? 'फेरि खेल्नुहोस्' : 'Play Again'}</button>
            </div>
        `;

        // Simple matching logic
        let selectedNepali = null;
        let selectedEnglish = null;
        let matchedPairs = 0;
        const totalPairs = items.length;

        document.querySelectorAll('.match-item').forEach(el => {
            el.addEventListener('click', function() {
                const isNepali = this.dataset.nepali !== undefined;
                const isEnglish = this.dataset.english !== undefined;
                
                if (this.classList.contains('matched')) return;
                
                if (isNepali) {
                    if (selectedNepali) {
                        selectedNepali.classList.remove('selected');
                    }
                    selectedNepali = this;
                    this.classList.add('selected');
                } else if (isEnglish) {
                    if (selectedEnglish) {
                        selectedEnglish.classList.remove('selected');
                    }
                    selectedEnglish = this;
                    this.classList.add('selected');
                }
                
                if (selectedNepali && selectedEnglish) {
                    const nepaliWord = selectedNepali.dataset.nepali;
                    const englishWord = selectedEnglish.dataset.english;
                    
                    // Check if they match (find the pair in items)
                    const match = items.find(i => i.nepali === nepaliWord && i.english === englishWord);
                    
                    const feedback = document.getElementById('matchFeedback');
                    if (match) {
                        selectedNepali.classList.add('matched');
                        selectedNepali.classList.remove('selected');
                        selectedEnglish.classList.add('matched');
                        selectedEnglish.classList.remove('selected');
                        matchedPairs++;
                        feedback.textContent = '✅ ' + (this.language === 'ne' ? 'सही!' : 'Correct!');
                        feedback.className = 'match-feedback correct';
                        
                        if (matchedPairs === totalPairs) {
                            feedback.textContent = '🎉 ' + (this.language === 'ne' ? 'सबै मिल्यो! राम्रो!' : 'All matched! Great job!');
                            StorageService.addStar();
                        }
                    } else {
                        feedback.textContent = '❌ ' + (this.language === 'ne' ? 'फेरि प्रयास गर्नुहोस्' : 'Try again');
                        feedback.className = 'match-feedback wrong';
                        setTimeout(() => {
                            selectedNepali.classList.remove('selected');
                            selectedEnglish.classList.remove('selected');
                            selectedNepali = null;
                            selectedEnglish = null;
                            feedback.textContent = '';
                            feedback.className = 'match-feedback';
                        }, 800);
                    }
                }
            });
        });

        document.getElementById('matchResetBtn').addEventListener('click', () => {
            this.loadMatchingGame(container);
        });
    }

    loadMemoryGame(container) {
        // Get 8 words for memory game (4 pairs)
        const shuffled = [...WORDS].sort(() => Math.random() - 0.5).slice(0, 4);
        const cards = [];
        shuffled.forEach(([nepali, phonetic, english]) => {
            cards.push({ id: `${nepali}-nepali`, text: nepali, pair: nepali });
            cards.push({ id: `${english}-english`, text: english, pair: nepali });
        });
        
        // Shuffle cards
        const shuffledCards = cards.sort(() => Math.random() - 0.5);
        
        container.innerHTML = `
            <div class="memory-game">
                <h4>🧠 ${this.language === 'ne' ? 'मेमोरी खेल' : 'Memory Game'}</h4>
                <p class="text-muted">${this.language === 'ne' ? 'जोडी मिलाउनुहोस्' : 'Find the pairs'}</p>
                <div class="memory-grid">
                    ${shuffledCards.map((card, idx) => `
                        <div class="memory-card" data-pair="${card.pair}" data-idx="${idx}">
                            <span class="card-content">${card.text}</span>
                        </div>
                    `).join('')}
                </div>
                <div id="memoryFeedback" class="memory-feedback"></div>
                <button class="btn btn-primary" id="memoryResetBtn">🔄 ${this.language === 'ne' ? 'फेरि खेल्नुहोस्' : 'Play Again'}</button>
            </div>
        `;

        let flippedCards = [];
        let matchedPairs = 0;
        const totalPairs = shuffled.length;

        document.querySelectorAll('.memory-card').forEach(card => {
            card.addEventListener('click', function() {
                if (this.classList.contains('flipped') || this.classList.contains('matched')) return;
                if (flippedCards.length === 2) return;

                this.classList.add('flipped');
                flippedCards.push(this);

                if (flippedCards.length === 2) {
                    const pair1 = flippedCards[0].dataset.pair;
                    const pair2 = flippedCards[1].dataset.pair;
                    const feedback = document.getElementById('memoryFeedback');

                    if (pair1 === pair2) {
                        flippedCards.forEach(c => c.classList.add('matched'));
                        matchedPairs++;
                        feedback.textContent = '✅ ' + (this.language === 'ne' ? 'जोडी मिल्यो!' : 'Pair matched!');
                        feedback.className = 'memory-feedback correct';
                        flippedCards = [];

                        if (matchedPairs === totalPairs) {
                            feedback.textContent = '🎉 ' + (this.language === 'ne' ? 'सबै जोडी मिल्यो! राम्रो!' : 'All pairs matched! Great job!');
                            StorageService.addStar();
                        }
                    } else {
                        feedback.textContent = '❌ ' + (this.language === 'ne' ? 'फेरि प्रयास गर्नुहोस्' : 'Try again');
                        feedback.className = 'memory-feedback wrong';
                        setTimeout(() => {
                            flippedCards.forEach(c => c.classList.remove('flipped'));
                            flippedCards = [];
                            feedback.textContent = '';
                            feedback.className = 'memory-feedback';
                        }, 800);
                    }
                }
            });
        });

        document.getElementById('memoryResetBtn').addEventListener('click', () => {
            this.loadMemoryGame(container);
        });
    }

    loadSpellingGame(container) {
        // Get a random word for spelling
        const word = WORDS[Math.floor(Math.random() * WORDS.length)];
        const [nepali, phonetic, english] = word;
        
        // Create scrambled letters
        const scramble = (str) => {
            const arr = str.split('');
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr.join('');
        };

        const scrambled = scramble(english);
        
        container.innerHTML = `
            <div class="spelling-game">
                <h4>✏️ ${this.language === 'ne' ? 'हिज्जे खेल' : 'Spelling Game'}</h4>
                <p class="text-muted">${this.language === 'ne' ? 'शब्दको हिज्जे मिलाउनुहोस्' : 'Spell the word'}</p>
                <div class="spelling-word">
                    <span class="nepali-word-display">${nepali}</span>
                    <span class="phonetic-display">(${phonetic})</span>
                </div>
                <div class="spelling-input">
                    <input type="text" id="spellingInput" placeholder="${this.language === 'ne' ? 'अङ्ग्रेजी हिज्जे लेख्नुहोस्' : 'Type the English spelling'}">
                    <button class="btn btn-primary" id="spellingCheckBtn">${this.t('check')}</button>
                </div>
                <div class="spelling-hint" id="spellingHint">
                    💡 ${this.language === 'ne' ? 'सङ्केत' : 'Hint'}: ${scrambled}
                </div>
                <div id="spellingFeedback" class="spelling-feedback"></div>
                <button class="btn btn-success" id="spellingNextBtn">${this.t('nextCard')}</button>
            </div>
        `;

        const input = document.getElementById('spellingInput');
        const checkBtn = document.getElementById('spellingCheckBtn');
        const feedback = document.getElementById('spellingFeedback');
        const nextBtn = document.getElementById('spellingNextBtn');
        const hint = document.getElementById('spellingHint');

        const checkSpelling = () => {
            const userAnswer = input.value.trim().toLowerCase();
            const correct = english.toLowerCase();
            
            if (userAnswer === correct) {
                feedback.textContent = '✅ ' + (this.language === 'ne' ? 'सही! ⭐' : 'Correct! ⭐');
                feedback.className = 'spelling-feedback correct';
                input.disabled = true;
                checkBtn.disabled = true;
                StorageService.addStar();
                hint.textContent = '🎉 ' + (this.language === 'ne' ? 'राम्रो काम!' : 'Great job!');
            } else {
                feedback.textContent = '❌ ' + (this.language === 'ne' ? 'फेरि प्रयास गर्नुहोस्' : 'Try again');
                feedback.className = 'spelling-feedback wrong';
                input.value = '';
                input.focus();
            }
        };

        checkBtn.addEventListener('click', checkSpelling);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') checkSpelling();
        });

        nextBtn.addEventListener('click', () => {
            this.loadSpellingGame(container);
        });
    }

    loadBingoGame(container) {
        // Bingo: Show a word, user selects correct translation from options
        const word = WORDS[Math.floor(Math.random() * WORDS.length)];
        const [nepali, phonetic, english] = word;
        
        // Generate wrong options
        const wrongOptions = WORDS
            .filter(w => w[2] !== english)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(w => w[2]);
        
        const options = [english, ...wrongOptions].sort(() => Math.random() - 0.5);
        
        container.innerHTML = `
            <div class="bingo-game">
                <h4>🎯 ${this.language === 'ne' ? 'बिङ्गो' : 'Bingo'}</h4>
                <p class="text-muted">${this.language === 'ne' ? 'सही शब्द छान्नुहोस्' : 'Select the correct translation'}</p>
                <div class="bingo-word">
                    <span class="nepali-word-display">${nepali}</span>
                    <span class="phonetic-display">(${phonetic})</span>
                </div>
                <div class="bingo-options">
                    ${options.map(opt => `
                        <button class="bingo-option" data-answer="${opt}">${opt}</button>
                    `).join('')}
                </div>
                <div id="bingoFeedback" class="bingo-feedback"></div>
                <button class="btn btn-success" id="bingoNextBtn">${this.t('nextCard')}</button>
            </div>
        `;

        const feedback = document.getElementById('bingoFeedback');
        const nextBtn = document.getElementById('bingoNextBtn');
        let answered = false;

        document.querySelectorAll('.bingo-option').forEach(btn => {
            btn.addEventListener('click', function() {
                if (answered) return;
                answered = true;
                
                if (this.dataset.answer === english) {
                    this.classList.add('correct');
                    feedback.textContent = '✅ ' + (container.language === 'ne' ? 'सही! ⭐' : 'Correct! ⭐');
                    feedback.className = 'bingo-feedback correct';
                    StorageService.addStar();
                } else {
                    this.classList.add('wrong');
                    feedback.textContent = '❌ ' + (container.language === 'ne' ? `सही उत्तर: "${english}"` : `Correct answer: "${english}"`);
                    feedback.className = 'bingo-feedback wrong';
                    // Highlight correct answer
                    document.querySelectorAll('.bingo-option').forEach(b => {
                        if (b.dataset.answer === english) b.classList.add('correct');
                    });
                }
                document.querySelectorAll('.bingo-option').forEach(b => b.disabled = true);
            });
        });

        nextBtn.addEventListener('click', () => {
            this.loadBingoGame(container);
        });
    }

    // ===== DESTROY =====
    destroy() {
        this.isRendered = false;
        console.log('[Nepali] Module destroyed');
    }
}