/**
 * AgeManager - Determines appropriate content based on child's age
 * Centralizes all age-based logic for easy updates
 */
export class AgeManager {
    /**
     * Get the developmental stage based on age in years
     */
    static getStage(age) {
        if (age < 1) return 'infant';
        if (age < 1.5) return 'toddler-early';
        if (age < 3) return 'toddler';
        if (age < 4.5) return 'preschool';
        return 'kindergarten';
    }

    /**
     * Get available modules for a given age
     * Returns array of module keys
     */
    static getAvailableModules(age) {
        const modules = ['sensory']; // Always available
        
        if (age >= 1.5) {
            modules.push('explorer');
        }
        
        if (age >= 2.0) {
            modules.push('nepali');
        }
        
        if (age >= 3.5) {
            modules.push('preschool');
        }
        
        return modules;
    }

    /**
     * Get recommended activities for the current age
     */
    static getRecommendedActivities(age) {
        const stage = this.getStage(age);
        
        const activities = {
            'infant': [
                'High-contrast shapes',
                'Sound exploration',
                'Peekaboo games',
                'Gentle music'
            ],
            'toddler-early': [
                'First words',
                'Color matching',
                'Animal sounds',
                'Simple songs'
            ],
            'toddler': [
                'Counting 1-5',
                'ABC songs',
                'Shape sorting',
                'Nepali alphabet'
            ],
            'preschool': [
                'Letter tracing',
                'Counting 1-20',
                'Simple puzzles',
                'Nepali words'
            ],
            'kindergarten': [
                'Reading prep',
                'Simple math',
                'Writing practice',
                'Nepali sentences'
            ]
        };
        
        return activities[stage] || activities['infant'];
    }

    /**
     * Get age-appropriate difficulty level
     */
    static getDifficulty(age) {
        if (age < 1.5) return 'very-easy';
        if (age < 3) return 'easy';
        if (age < 4.5) return 'medium';
        return 'hard';
    }

    /**
     * Get milestones for the current age
     */
    static getMilestones(age) {
        const stage = this.getStage(age);
        
        const milestones = {
            'infant': [
                'Recognizes familiar faces',
                'Responds to sounds',
                'Begins babbling'
            ],
            'toddler-early': [
                'Says first words',
                'Points to objects',
                'Understands simple commands'
            ],
            'toddler': [
                'Uses 2-3 word phrases',
                'Identifies body parts',
                'Counts to 3'
            ],
            'preschool': [
                'Uses full sentences',
                'Counts to 10',
                'Recognizes letters'
            ],
            'kindergarten': [
                'Counts to 20',
                'Recognizes words',
                'Writes name'
            ]
        };
        
        return milestones[stage] || milestones['infant'];
    }

    /**
     * Format age for display (e.g., "8 months", "2 years, 6 months")
     */
    static formatAge(age) {
        const years = Math.floor(age);
        const months = Math.round((age - years) * 12);
        
        if (years === 0) {
            return `${months} month${months !== 1 ? 's' : ''}`;
        }
        
        if (months === 0) {
            return `${years} year${years !== 1 ? 's' : ''}`;
        }
        
        return `${years} year${years !== 1 ? 's' : ''}, ${months} month${months !== 1 ? 's' : ''}`;
    }

    /**
     * Get age in months (for more granular control)
     */
    static getAgeInMonths(age) {
        return Math.round(age * 12);
    }

    /**
     * Check if a specific module should be available
     */
    static isModuleAvailable(moduleKey, age) {
        const available = this.getAvailableModules(age);
        return available.includes(moduleKey);
    }

    /**
     * Get the next milestone age (for planning)
     */
    static getNextMilestoneAge(age) {
        const stages = [
            { stage: 'infant', maxAge: 1 },
            { stage: 'toddler-early', maxAge: 1.5 },
            { stage: 'toddler', maxAge: 3 },
            { stage: 'preschool', maxAge: 4.5 },
            { stage: 'kindergarten', maxAge: 6 }
        ];
        
        const current = this.getStage(age);
        const currentIndex = stages.findIndex(s => s.stage === current);
        
        if (currentIndex < stages.length - 1) {
            return stages[currentIndex + 1].maxAge;
        }
        
        return null; // Already at max stage
    }

    /**
     * Get suggestions for what to work on next
     */
    static getNextSteps(age) {
        const stage = this.getStage(age);
        const nextAge = this.getNextMilestoneAge(age);
        
        if (!nextAge) {
            return 'Keep practicing! You\'re doing great!';
        }
        
        const suggestions = {
            'infant': 'Start introducing high-contrast images and gentle sounds',
            'toddler-early': 'Begin naming objects and using simple words',
            'toddler': 'Start counting objects and identifying colors',
            'preschool': 'Practice letter recognition and basic writing',
            'kindergarten': 'Begin reading simple words and basic math'
        };
        
        const currentSuggestions = {
            'infant': 'Add more variety to sensory experiences',
            'toddler-early': 'Introduce two-word combinations',
            'toddler': 'Start simple sorting and matching games',
            'preschool': 'Practice writing letters and numbers',
            'kindergarten': 'Begin simple reading comprehension'
        };
        
        return {
            nextMilestoneAge: nextAge,
            suggestion: suggestions[stage] || 'Keep learning!',
            currentFocus: currentSuggestions[stage] || 'Continue practicing!'
        };
    }
}