// js/theme-system.js - Enhanced theme system with random soft colors

class ThemeSystem {
    constructor() {
        this.html = document.documentElement;
        this.toggleButton = null;
        
        // Soft color palettes
        this.colorPalettes = {
            light: [
                {
                    name: 'ocean',
                    primary: '#e0f2fe',
                    secondary: '#b3e5fc',
                    accent: '#4fc3f7',
                    text: '#0d47a1',
                    background: '#f8fdff'
                },
                {
                    name: 'sunset',
                    primary: '#fff3e0',
                    secondary: '#ffe0b2',
                    accent: '#ffb74d',
                    text: '#e65100',
                    background: '#fffcf8'
                },
                {
                    name: 'forest',
                    primary: '#e8f5e8',
                    secondary: '#c8e6c9',
                    accent: '#81c784',
                    text: '#2e7d32',
                    background: '#f9fff9'
                },
                {
                    name: 'lavender',
                    primary: '#f3e5f5',
                    secondary: '#e1bee7',
                    accent: '#ba68c8',
                    text: '#6a1b9a',
                    background: '#fdfaff'
                },
                {
                    name: 'rose',
                    primary: '#fce4ec',
                    secondary: '#f8bbd9',
                    accent: '#f06292',
                    text: '#c2185b',
                    background: '#fffafc'
                }
            ],
            dark: [
                {
                    name: 'midnight',
                    primary: '#1a2332',
                    secondary: '#2a3441',
                    accent: '#4a90e2',
                    text: '#e3f2fd',
                    background: '#0f1419'
                },
                {
                    name: 'ember',
                    primary: '#2d1b1a',
                    secondary: '#3d2b2a',
                    accent: '#ff7043',
                    text: '#fff3e0',
                    background: '#1a0e0d'
                },
                {
                    name: 'deep-forest',
                    primary: '#1b2a1b',
                    secondary: '#2b3a2b',
                    accent: '#66bb6a',
                    text: '#e8f5e8',
                    background: '#0d1a0d'
                },
                {
                    name: 'amethyst',
                    primary: '#2a1b2d',
                    secondary: '#3a2b3d',
                    accent: '#ab47bc',
                    text: '#f3e5f5',
                    background: '#1a0d1a'
                },
                {
                    name: 'crimson',
                    primary: '#2d1a1f',
                    secondary: '#3d2a2f',
                    accent: '#e91e63',
                    text: '#fce4ec',
                    background: '#1a0d12'
                }
            ]
        };
        
        this.currentTheme = 'dark'; // Default to dark mode
        this.currentPalette = null;
        
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupTheme());
        } else {
            this.setupTheme();
        }
    }
    
    setupTheme() {
        // Get saved theme preference or default to dark
        const savedTheme = localStorage.getItem('vocab-vault-theme') || 'dark';
        const savedPalette = localStorage.getItem('vocab-vault-palette');
        
        this.currentTheme = savedTheme;
        
        // Set up random palette if none saved, or use saved one
        if (savedPalette) {
            try {
                this.currentPalette = JSON.parse(savedPalette);
            } catch (e) {
                this.setRandomPalette();
            }
        } else {
            this.setRandomPalette();
        }
        
        this.applyTheme();
        this.bindToggleButton();
    }
    
    setRandomPalette() {
        const palettes = this.colorPalettes[this.currentTheme];
        const randomIndex = Math.floor(Math.random() * palettes.length);
        this.currentPalette = palettes[randomIndex];
        localStorage.setItem('vocab-vault-palette', JSON.stringify(this.currentPalette));
    }
    
    applyTheme() {
        // Apply dark/light class
        if (this.currentTheme === 'dark') {
            this.html.classList.add('dark');
        } else {
            this.html.classList.remove('dark');
        }
        
        // Apply color palette as CSS custom properties
        const root = document.documentElement;
        root.style.setProperty('--theme-primary', this.currentPalette.primary);
        root.style.setProperty('--theme-secondary', this.currentPalette.secondary);
        root.style.setProperty('--theme-accent', this.currentPalette.accent);
        root.style.setProperty('--theme-text', this.currentPalette.text);
        root.style.setProperty('--theme-background', this.currentPalette.background);
        
        // Update toggle button
        this.updateToggleButton();
        
        // Save theme preference
        localStorage.setItem('vocab-vault-theme', this.currentTheme);
        
        // Update theme indicator
        this.showThemeIndicator();
        
        console.log(`Applied ${this.currentTheme} theme with ${this.currentPalette.name} palette`);
    }
    
    updateToggleButton() {
        this.toggleButton = document.getElementById('dark-mode-toggle');
        if (this.toggleButton) {
            const icon = this.currentTheme === 'dark' ? 'sun' : 'moon';
            const tooltip = this.currentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
            
            this.toggleButton.innerHTML = `<i data-lucide="${icon}" class="w-6 h-6"></i>`;
            this.toggleButton.setAttribute('title', tooltip);
            
            // Recreate icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }
    
    bindToggleButton() {
        // Use event delegation since button might not exist yet
        document.addEventListener('click', (e) => {
            if (e.target.closest('#dark-mode-toggle')) {
                this.toggleTheme();
            }
        });
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setRandomPalette(); // Get a new random palette for the new theme
        this.applyTheme();
        
        // Trigger a custom event for other components to respond
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: {
                theme: this.currentTheme,
                palette: this.currentPalette
            }
        }));
    }
    
    // Method to manually change palette while keeping same theme
    changePalette() {
        this.setRandomPalette();
        this.applyTheme();
    }
    
    getCurrentTheme() {
        return {
            theme: this.currentTheme,
            palette: this.currentPalette
        };
    }
    
    showThemeIndicator() {
        const indicator = document.getElementById('theme-indicator');
        if (!indicator) return;
        
        const themeName = this.currentTheme.charAt(0).toUpperCase() + this.currentTheme.slice(1);
        const paletteName = this.currentPalette.name.replace('-', ' ');
        
        indicator.textContent = `${themeName} - ${paletteName.charAt(0).toUpperCase() + paletteName.slice(1)}`;
        indicator.classList.add('show');
        
        // Hide after 2 seconds
        setTimeout(() => {
            indicator.classList.remove('show');
        }, 2000);
    }
}

// Initialize theme system
const themeSystem = new ThemeSystem();

// Make it globally available
window.themeSystem = themeSystem;

// Additional initialization for Lucide icons
document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});
