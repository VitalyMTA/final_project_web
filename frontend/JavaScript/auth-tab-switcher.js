/**
 * UNIFIED AUTH TAB SWITCHER
 * Handles switching between Login and Register forms on the same page
 * 
 * @author Pokemon Community DB
 * @version 1.0
 */

(function() {
    'use strict';

    /**
     * Initialize auth tab functionality
     */
    function initAuthTabs() {
        const tabs = document.querySelectorAll('.auth-tab');
        const formWrappers = document.querySelectorAll('.auth-form-wrapper');

        if (!tabs.length || !formWrappers.length) {
            // No auth tabs found (user is logged in or not on auth page)
            return;
        }

        /**
         * Switch to a specific tab
         * @param {string} tabName - The tab name to switch to ('login' or 'register')
         */
        function switchTab(tabName) {
            // Update tab buttons
            tabs.forEach(tab => {
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

            // Clear any error messages when switching tabs
            const errorElements = document.querySelectorAll('[data-auth-error]');
            errorElements.forEach(el => {
                el.textContent = '';
            });

            // Focus on first input of active form
            const activeForm = document.querySelector(`.auth-form-wrapper.active form`);
            if (activeForm) {
                const firstInput = activeForm.querySelector('input[type="text"], input[type="email"]');
                if (firstInput) {
                    setTimeout(() => firstInput.focus(), 100);
                }
            }

            // Log for debugging
            console.log(`✅ Switched to ${tabName} tab`);
        }

        /**
         * Handle tab click
         * @param {Event} event
         */
        function handleTabClick(event) {
            const tabName = event.currentTarget.dataset.tab;
            switchTab(tabName);
        }

        // Attach click listeners to all tabs
        tabs.forEach(tab => {
            tab.addEventListener('click', handleTabClick);
        });

        // Check URL hash on page load (e.g., #register)
        const hash = window.location.hash.replace('#', '');
        if (hash === 'register' || hash === 'login') {
            switchTab(hash);
        }

        // Update hash when tab changes (optional, for bookmarking)
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.currentTarget.dataset.tab;
                history.replaceState(null, null, `#${tabName}`);
            });
        });

        // Handle keyboard navigation (Arrow keys)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                const activeTab = document.querySelector('.auth-tab.active');
                if (!activeTab) return;

                const currentIndex = Array.from(tabs).indexOf(activeTab);
                let newIndex;

                if (e.key === 'ArrowLeft') {
                    newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
                } else {
                    newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
                }

                const newTab = tabs[newIndex];
                if (newTab && document.activeElement.closest('.auth-tabs')) {
                    switchTab(newTab.dataset.tab);
                    newTab.focus();
                }
            }
        });

        console.log('✅ Auth tab switcher initialized');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAuthTabs);
    } else {
        initAuthTabs();
    }

})();
