/**
 * Explorer Module - For toddlers 18-36 months
 * Simple words, colors, animals, and matching games
 */
export class ExplorerModule {
    constructor(container) {
        this.container = container;
        this.currentActivity = 0;
        this.score = 0;
    }

    render() {
        this.container.innerHTML = `
            <div class="explorer-module">
                <h2 class="text-center mb-3">🔍 Toddler Explorer</h2>
                <p class="text-center text-muted mb-3">Learning through discovery!</p>
                
                <div class="explorer-activities">
                    <div class="activity-grid grid-3">
                        <div class="card activity-card" data-activity="colors">
                            <div class="card-title">🎨 Colors</div>
                            <p>Learn basic colors</p>
                        </div>
                        <div class="card activity-card" data-activity="animals">
                            <div class="card-title">🐾 Animals</div>
                            <p>Meet the animals</p>
                        </div>
                        <div class="card activity-card" data-activity="numbers">
                            <div class="card-title">🔢 Numbers</div>
                            <p>Count 1 to 5</p>
                        </div>
                    </div>
                </div>
                
                <div id="explorerContent" class="mt-3">
                    <p class="text-center text-muted">👆 Select an activity above to begin!</p>
                </div>
            </div>
        `;

        // Bind activity cards
        this.container.querySelectorAll('.activity-card').forEach(card => {
            card.addEventListener('click', () => {
                this.loadActivity(card.dataset.activity);
            });
        });
    }

    loadActivity(activity) {
        const content = document.getElementById('explorerContent');
        if (!content) return;

        const activities = {
            colors: this.renderColors.bind(this),
            animals: this.renderAnimals.bind(this),
            numbers: this.renderNumbers.bind(this)
        };

        if (activities[activity]) {
            activities[activity](content);
        }
    }

    renderColors(container) {
        const colors = [
            { name: 'Red', color: '#FF0000', nepali: 'रातो' },
            { name: 'Blue', color: '#0000FF', nepali: 'निलो' },
            { name: 'Green', color: '#00CC00', nepali: 'हरियो' },
            { name: 'Yellow', color: '#FFD700', nepali: 'पहेंलो' }
        ];

        container.innerHTML = `
            <h3 class="text-center">🎨 Learn Colors</h3>
            <div class="grid-2 mt-2">
                ${colors.map(c => `
                    <div class="card text-center" style="border-left: 8px solid ${c.color}">
                        <div style="background: ${c.color}; height: 60px; border-radius: 0.5rem; margin-bottom: 0.5rem;"></div>
                        <strong>${c.name}</strong>
                        <div class="text-muted">${c.nepali}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderAnimals(container) {
        const animals = [
            { name: 'Dog', emoji: '🐕', nepali: 'कुकुर' },
            { name: 'Cat', emoji: '🐈', nepali: 'बिरालो' },
            { name: 'Cow', emoji: '🐄', nepali: 'गाई' },
            { name: 'Elephant', emoji: '🐘', nepali: 'हात्ती' }
        ];

        container.innerHTML = `
            <h3 class="text-center">🐾 Meet the Animals</h3>
            <div class="grid-2 mt-2">
                ${animals.map(a => `
                    <div class="card text-center">
                        <div style="font-size: 4rem;">${a.emoji}</div>
                        <strong>${a.name}</strong>
                        <div class="text-muted">${a.nepali}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderNumbers(container) {
        container.innerHTML = `
            <h3 class="text-center">🔢 Count 1 to 5</h3>
            <div class="grid-3 mt-2">
                ${[1, 2, 3, 4, 5].map(n => `
                    <div class="card text-center">
                        <div style="font-size: 4rem; font-weight: 700;">${n}</div>
                        <div class="text-muted">${'⭐'.repeat(n)}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    destroy() {
        // Cleanup if needed
    }
}