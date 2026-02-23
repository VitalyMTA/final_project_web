/**
 * CONTENT FORM TAB SWITCHER
 * Handles switching between Pokemon, Anime, and Game forms on the Add Content page
 */

(() => {
  'use strict';

  function initContentTabs() {
    const tabs = document.querySelectorAll('.auth-tab[data-tab]');
    const formWrappers = document.querySelectorAll('.auth-form-wrapper');

    // Filter only content tabs (pokemon, anime, game)
    const contentTabs = Array.from(tabs).filter(tab => 
      ['pokemon', 'anime', 'game'].includes(tab.dataset.tab)
    );

    if (!contentTabs.length || !formWrappers.length) {
      // No content tabs found (user is not logged in)
      return;
    }

    /**
     * Switch to a specific tab
     * @param {string} tabName - The tab name to switch to ('pokemon', 'anime', or 'game')
     */
    function switchTab(tabName) {
      // Update tab buttons
      contentTabs.forEach(tab => {
        if (tab.dataset.tab === tabName) {
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      });

      // Update form visibility
      formWrappers.forEach(wrapper => {
        if (wrapper.id === `${tabName}-form`) {
          wrapper.classList.add('active');
        } else {
          wrapper.classList.remove('active');
        }
      });

      // Focus on first input of active form
      const activeForm = document.querySelector(`.auth-form-wrapper.active form`);
      if (activeForm) {
        const firstInput = activeForm.querySelector('input[type="text"], input[type="date"]');
        if (firstInput) {
          setTimeout(() => firstInput.focus(), 100);
        }
      }
    }

    // Attach click listeners to all content tabs
    contentTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        // Prevent switching to disabled tabs
        if (tab.classList.contains('disabled') || tab.hasAttribute('disabled')) {
          e.preventDefault();
          return;
        }
        switchTab(tab.dataset.tab);
      });
    });

    // Pokemon type validation (prevent duplicate types)
    const pokemonType1 = document.getElementById("pokemonType1");
    const pokemonType2 = document.getElementById("pokemonType2");
    if (pokemonType1 && pokemonType2) {
      const syncTypes = () => {
        if (pokemonType2.value && pokemonType2.value === pokemonType1.value) {
          pokemonType2.value = "";
        }
      };
      pokemonType1.addEventListener("change", syncTypes);
      pokemonType2.addEventListener("change", syncTypes);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContentTabs);
  } else {
    initContentTabs();
  }
})();
