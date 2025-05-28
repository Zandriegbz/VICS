/**
 * VICS Theme Helpers - Utility functions for the theme
 */

// Function to check if an element exists
const _$ = function(el) {
  return document.querySelector(el);
};

// Function to check if an element exists as a collection
const _$$ = function(el) {
  return document.querySelectorAll(el);
};

// Function to toggle class on element
const toggleClass = function(el, className) {
  if (el) {
    el.classList.toggle(className);
  }
};

// Add class to element
const addClass = function(el, className) {
  if (el) {
    el.classList.add(className);
  }
};

// Remove class from element
const removeClass = function(el, className) {
  if (el) {
    el.classList.remove(className);
  }
};

// Check if element has a class
const hasClass = function(el, className) {
  if (el) {
    return el.classList.contains(className);
  }
  return false;
};

// Debounce function to limit function calls
const debounce = function(func, wait, immediate) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}; 