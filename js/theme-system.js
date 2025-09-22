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
                    accent: '#0288d1',
                    text: '#0d47a1',
                    background: '#f8fdff'
                },
                {
                    name: 'sunset',
                    primary: '#fff3e0',
                    secondary: '#ffe0b2',
                    accent: '#f57500',
                    text: '#e65100',
                    background: '#fffcf8'
                },
                {
                    name: 'forest',
                    primary: '#e8f5e8',
                    secondary: '#c8e6c9',
                    accent: '#388e3c',
                    text: '#2e7d32',
                    background: '#f9fff9'
                },
                {
                    name: 'lavender',
                    primary: '#f3e5f5',
                    secondary: '#e1bee7',
                    accent: '#8e24aa',
                    text: '#6a1b9a',
                    background: '#fdfaff'
                },
                {
                    name: 'rose',
                    primary: '#fce4ec',
                    secondary: '#f8bbd9',
                    accent: '#d81b60',
                    text: '#c2185b',
                    background: '#fffafc'
                },
                {
                    name: 'mint',
                    primary: '#e0f7f7',
                    secondary: '#b2dfdc',
                    accent: '#00695c',
                    text: '#004d40',
                    background: '#f0fffe'
                },
                {
                    name: 'peach',
                    primary: '#ffeee6',
                    secondary: '#ffccbc',
                    accent: '#d84315',
                    text: '#bf360c',
                    background: '#fff8f5'
                },
                {
                    name: 'sky',
                    primary: '#e3f2fd',
                    secondary: '#bbdefb',
                    accent: '#1976d2',
                    text: '#0d47a1',
                    background: '#f3f9ff'
                },
                {
                    name: 'coral',
                    primary: '#fef5f3',
                    secondary: '#ffcccb',
                    accent: '#e57373',
                    text: '#c62828',
                    background: '#fffafa'
                },
                {
                    name: 'sage',
                    primary: '#f1f8e9',
                    secondary: '#dcedc8',
                    accent: '#689f38',
                    text: '#33691e',
                    background: '#f9fbe7'
                },
                {
                    name: 'gold',
                    primary: '#fffde7',
                    secondary: '#fff9c4',
                    accent: '#f57f17',
                    text: '#f57f17',
                    background: '#fffef7'
                },
                {
                    name: 'violet',
                    primary: '#f8e8ff',
                    secondary: '#e1bee7',
                    accent: '#7b1fa2',
                    text: '#4a148c',
                    background: '#faf4ff'
                },
                {
                    name: 'teal',
                    primary: '#e0f2f1',
                    secondary: '#b2dfdb',
                    accent: '#00796b',
                    text: '#004d40',
                    background: '#f0fdfc'
                },
                {
                    name: 'amber',
                    primary: '#fff8e1',
                    secondary: '#ffecb3',
                    accent: '#ff8f00',
                    text: '#e65100',
                    background: '#fffdf7'
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
                },
                {
                    name: 'cosmic',
                    primary: '#1a1a2e',
                    secondary: '#2a2a4e',
                    accent: '#7209b7',
                    text: '#eeeeff',
                    background: '#0f0f1e'
                },
                {
                    name: 'volcanic',
                    primary: '#2b1c1c',
                    secondary: '#3d2c2c',
                    accent: '#ff6b35',
                    text: '#ffe4e1',
                    background: '#1a1111'
                },
                {
                    name: 'ocean-depth',
                    primary: '#1b2838',
                    secondary: '#2b3848',
                    accent: '#26c6da',
                    text: '#e0f4ff',
                    background: '#0d1821'
                },
                {
                    name: 'cherry-noir',
                    primary: '#2d1b23',
                    secondary: '#3d2b33',
                    accent: '#e91e63',
                    text: '#ffebf0',
                    background: '#1a0d15'
                },
                {
                    name: 'emerald-night',
                    primary: '#1a2d1a',
                    secondary: '#2a3d2a',
                    accent: '#4caf50',
                    text: '#e8f5e8',
                    background: '#0d1a0d'
                },
                {
                    name: 'golden-shadow',
                    primary: '#2d261a',
                    secondary: '#3d362a',
                    accent: '#ffc107',
                    text: '#fff8e1',
                    background: '#1a1711'
                },
                {
                    name: 'royal-purple',
                    primary: '#2a1a2a',
                    secondary: '#3a2a3a',
                    accent: '#9c27b0',
                    text: '#f3e5f5',
                    background: '#1a0f1a'
                },
                {
                    name: 'steel-blue',
                    primary: '#1e2832',
                    secondary: '#2e3842',
                    accent: '#607d8b',
                    text: '#eceff1',
                    background: '#0e1419'
                },
                {
                    name: 'copper-glow',
                    primary: '#2d231a',
                    secondary: '#3d332a',
                    accent: '#ff8f00',
                    text: '#fff3e0',
                    background: '#1a1511'
                },
                {
                    name: 'arctic-night',
                    primary: '#1a252d',
                    secondary: '#2a353d',
                    accent: '#00bcd4',
                    text: '#e0f2f1',
                    background: '#0d1619'
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
        
        // Also listen for components loaded event
        document.addEventListener('componentsLoaded', () => {
            this.bindToggleButton();
            this.updateToggleButton();
        });
    }
    
    setupTheme() {
        console.log('Setting up theme system...');
        
        // Get saved theme preference or default to dark
        const savedTheme = localStorage.getItem('vocab-vault-theme') || 'dark';
        const savedPalette = localStorage.getItem('vocab-vault-palette');
        
        this.currentTheme = savedTheme;
        
        // Set up random palette if none saved, or use saved one
        if (savedPalette) {
            try {
                this.currentPalette = JSON.parse(savedPalette);
                console.log('Loaded saved palette:', this.currentPalette.name);
            } catch (e) {
                console.log('Failed to parse saved palette, generating new one');
                this.setRandomPalette();
            }
        } else {
            console.log('No saved palette, generating new one');
            this.setRandomPalette();
        }
        
        this.applyTheme();
        this.bindToggleButton();
        
        console.log('Theme setup complete:', this.currentTheme, this.currentPalette.name);
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
        // Try multiple times to find the button (for async component loading)
        const tryUpdateButton = (attempts = 0) => {
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
            } else if (attempts < 5) {
                // Retry after a short delay if button not found
                setTimeout(() => tryUpdateButton(attempts + 1), 100);
            }
        };
        
        tryUpdateButton();
    }
    
    bindToggleButton() {
        // Use event delegation for better mobile compatibility
        document.addEventListener('click', (e) => {
            const toggleButton = e.target.closest('#dark-mode-toggle');
            const paletteButton = e.target.closest('#palette-toggle');
            
            if (toggleButton) {
                e.preventDefault();
                e.stopPropagation();
                this.toggleTheme();
            } else if (paletteButton) {
                e.preventDefault();
                e.stopPropagation();
                this.changePalette();
            }
        });
        
        // Add touch event support for mobile
        document.addEventListener('touchend', (e) => {
            const toggleButton = e.target.closest('#dark-mode-toggle');
            const paletteButton = e.target.closest('#palette-toggle');
            
            if (toggleButton) {
                e.preventDefault();
                this.toggleTheme();
            } else if (paletteButton) {
                e.preventDefault();
                this.changePalette();
            }
        }, { passive: false });
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
let themeSystem;

// Initialize with proper error handling
try {
    themeSystem = new ThemeSystem();
    // Make it globally available
    window.themeSystem = themeSystem;
    
    // Add some debug logging for mobile
    console.log('Theme system initialized successfully');
} catch (error) {
    console.error('Failed to initialize theme system:', error);
    // Fallback for basic functionality
    window.themeSystem = {
        toggleTheme: () => {
            document.documentElement.classList.toggle('dark');
        },
        changePalette: () => {
            console.log('Palette change not available in fallback mode');
        }
    };
}

// Additional initialization for Lucide icons
document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});
