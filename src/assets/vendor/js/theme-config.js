/**
 * VICS Theme Configuration
 * This file contains theme-specific configuration
 */

// Main theme configuration object
const themeConfig = {
  // Default color scheme
  colorScheme: 'light',
  
  // Theme settings
  settings: {
    sidebarCollapsed: false,
    fixedHeader: true,
    fixedFooter: false,
    enableAnimations: true
  },
  
  // Initialize theme
  init: function() {
    // Set body theme class based on settings
    if (this.colorScheme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.add('light-theme');
    }
    
    // Apply fixed header if enabled
    if (this.settings.fixedHeader) {
      document.body.classList.add('fixed-header');
    }
    
    // Apply fixed footer if enabled
    if (this.settings.fixedFooter) {
      document.body.classList.add('fixed-footer');
    }
    
    // Set sidebar state
    if (this.settings.sidebarCollapsed) {
      document.body.classList.add('sidebar-collapsed');
    }
    
    // Enable animations if configured
    if (this.settings.enableAnimations) {
      document.body.classList.add('animations-enabled');
    }
    
    // Initialize any other theme features
    this.initEventHandlers();
  },
  
  // Setup event handlers for theme features
  initEventHandlers: function() {
    // Example: Theme toggle button
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', function() {
        themeConfig.toggleTheme();
      });
    }
  },
  
  // Toggle between light and dark theme
  toggleTheme: function() {
    if (this.colorScheme === 'light') {
      this.colorScheme = 'dark';
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
    } else {
      this.colorScheme = 'light';
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
    }
    
    // Save user preference (could use localStorage)
    this.saveUserPreferences();
  },
  
  // Save user theme preferences
  saveUserPreferences: function() {
    // Use localStorage to save user preferences
    localStorage.setItem('vics-theme-settings', JSON.stringify({
      colorScheme: this.colorScheme,
      settings: this.settings
    }));
  },
  
  // Load user preferences if they exist
  loadUserPreferences: function() {
    const savedSettings = localStorage.getItem('vics-theme-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        this.colorScheme = parsed.colorScheme || this.colorScheme;
        this.settings = {...this.settings, ...parsed.settings};
      } catch (e) {
        console.error('Failed to parse saved theme settings');
      }
    }
  }
};

// Load user preferences and initialize theme on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
  themeConfig.loadUserPreferences();
  themeConfig.init();
}); 