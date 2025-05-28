/**
 * VICS Menu Handler
 * This file contains menu-specific functionality
 */

// Menu configuration and handling
const menuHandler = {
  // Initialize menu
  init: function() {
    this.setupMenuToggle();
    this.setupSubmenuToggle();
    this.setupActiveLinks();
    this.setupMobileMenu();
  },
  
  // Setup main menu toggle functionality
  setupMenuToggle: function() {
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
      menuToggle.addEventListener('click', function() {
        document.body.classList.toggle('sidebar-collapsed');
        
        // Save state to localStorage
        const isCollapsed = document.body.classList.contains('sidebar-collapsed');
        if (themeConfig && themeConfig.settings) {
          themeConfig.settings.sidebarCollapsed = isCollapsed;
          themeConfig.saveUserPreferences();
        }
      });
    }
  },
  
  // Setup submenu toggles
  setupSubmenuToggle: function() {
    const menuItems = document.querySelectorAll('.menu-item.has-submenu');
    
    menuItems.forEach(item => {
      const link = item.querySelector('.menu-link');
      
      if (link) {
        link.addEventListener('click', function(e) {
          // Only prevent default if it has submenu
          if (item.classList.contains('has-submenu')) {
            e.preventDefault();
            
            // Toggle submenu visibility
            item.classList.toggle('open');
            
            // Close other open submenus
            menuItems.forEach(otherItem => {
              if (otherItem !== item && otherItem.classList.contains('open')) {
                otherItem.classList.remove('open');
              }
            });
          }
        });
      }
    });
  },
  
  // Setup active link highlighting
  setupActiveLinks: function() {
    // Get current path
    const currentPath = window.location.pathname;
    
    // Find and activate the corresponding menu item
    const menuLinks = document.querySelectorAll('.menu-link');
    
    menuLinks.forEach(link => {
      const href = link.getAttribute('href');
      
      if (href && (href === currentPath || currentPath.startsWith(href))) {
        // Add active class to the link
        link.classList.add('active');
        
        // Add active class to parent menu item
        const menuItem = link.closest('.menu-item');
        if (menuItem) {
          menuItem.classList.add('active');
          
          // If it's a submenu item, open the parent menu
          const parentMenu = menuItem.closest('.submenu');
          if (parentMenu) {
            const parentMenuItem = parentMenu.closest('.menu-item');
            if (parentMenuItem) {
              parentMenuItem.classList.add('open', 'active');
            }
          }
        }
      }
    });
  },
  
  // Setup mobile menu functionality
  setupMobileMenu: function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (mobileMenuToggle) {
      mobileMenuToggle.addEventListener('click', function() {
        document.body.classList.toggle('mobile-menu-open');
      });
      
      // Close menu when clicking outside
      document.addEventListener('click', function(e) {
        if (document.body.classList.contains('mobile-menu-open') && 
            !e.target.closest('.sidebar') && 
            !e.target.closest('.mobile-menu-toggle')) {
          document.body.classList.remove('mobile-menu-open');
        }
      });
    }
  }
};

// Initialize menu on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
  menuHandler.init();
}); 