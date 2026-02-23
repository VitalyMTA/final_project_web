/**
 * GLOBAL jQuery FEATURES
 * Comprehensive jQuery functionality for the entire site
 * 
 * Demonstrates:
 * 1. Event handling (click, hover, focus)
 * 2. DOM manipulation (html, text, attr, addClass/removeClass)
 * 3. Effects (fade, slide, animate)
 * 4. AJAX calls
 * 5. Form handling
 * 6. Keyboard shortcuts
 * 7. Data validation
 */

$(document).ready(function() {
    'use strict';

    console.log('✅ Global jQuery Features Loaded');
    console.log('jQuery v' + $.fn.jquery + ' - All animations initialized');

    // ========================================
    // 1. FADE IN ON PAGE LOAD
    // ========================================
    
    /**
     * Page body is immediately visible (animation removed)
     */
    // $('body').hide().fadeIn(800) - animation removed for faster navigation

    // ========================================
    // 2. IMAGE PROTECTION - RIGHT-CLICK DISABLED
    // ========================================
    
    /**
     * Prevent image context menu and show custom message
     */
    $(document).on('contextmenu', 'img', function(e) {
        e.preventDefault();
        
        // jQuery - create alert dynamically
        const $alert = $('<div>')
            .text('⚠️ Image protection enabled')
            .css({
                'position': 'fixed',
                'top': '20px',
                'right': '20px',
                'background': '#ff6b6b',
                'color': 'white',
                'padding': '12px 16px',
                'border-radius': '4px',
                'z-index': '9999',
                'font-weight': 'bold',
                'box-shadow': '0 4px 12px rgba(0, 0, 0, 0.3)'
            })
            .appendTo('body');

        // Auto-remove after 2 seconds
        setTimeout(() => {
            $alert.fadeOut(300, function() { 
                $(this).remove(); 
            });
        }, 2000);
    });

    // ========================================
    // 3. FORM SUBMISSION HANDLING
    // ========================================
    
    /**
     * Add loading state to all form submissions (except auth forms)
     * Auth forms have their own handler in auth-forms.js
     * Auto-reset button if page doesn't navigate (error case)
     */
    $(document).on('submit', 'form', function() {
        const $form = $(this);
        
        // Skip auth forms - they have their own handler
        if ($form.attr('action') === '/login' || $form.attr('action') === '/register') {
            return;
        }
        
        const $submitBtn = $form.find('input[type="submit"], button[type="submit"]');
        
        if ($submitBtn.length) {
            // Store original button text/value
            const originalText = $submitBtn.is('input') ? $submitBtn.val() : $submitBtn.text();
            $submitBtn.data('original-text', originalText);
            
            // jQuery - disable and update UI
            $submitBtn.prop('disabled', true)
                      .css('opacity', '0.6')
                      .css('cursor', 'not-allowed');
            
            // Show loading text if it's an input
            if ($submitBtn.is('input')) {
                $submitBtn.val('Processing...');
            } else {
                $submitBtn.text('Processing...');
            }
            
            console.log('📤 Form submission initiated');
            
            // Reset button after 2 seconds if still on page (error case)
            setTimeout(function() {
                // Check if page is still visible (not navigated away)
                if (document.visibilityState === 'visible' && $submitBtn.prop('disabled')) {
                    // Restore original button text
                    if ($submitBtn.is('input')) {
                        $submitBtn.val(originalText);
                    } else {
                        $submitBtn.text(originalText);
                    }
                    
                    // Re-enable button
                    $submitBtn.prop('disabled', false)
                              .css('opacity', '1')
                              .css('cursor', 'pointer');
                    
                    console.log('⚠️ Form submission reset (possible error)');
                }
            }, 2000);
        }
    });

    // ========================================
    // 4. CARD HOVER ANIMATIONS
    // ========================================
    
    /**
     * Smooth hover effects on game and anime cards using CSS transforms
     * Uses transform instead of margin to avoid layout shifts
     */
    $(document).on('mouseenter', '.game-card, .anime-card', function() {
        $(this).css({
            'box-shadow': '0 12px 24px rgba(0, 0, 0, 0.3)',
            'transform': 'translateY(-5px)',
            'transition': 'all 0.2s ease',
            'will-change': 'transform'
        });
    }).on('mouseleave', '.game-card, .anime-card', function() {
        $(this).css({
            'box-shadow': '0 6px 12px rgba(0, 0, 0, 0.12)',
            'transform': 'translateY(0)',
            'transition': 'all 0.2s ease'
        });
    });

    // ========================================
    // 5. PAGINATION ENHANCEMENTS
    // ========================================
    
    /**
     * Add hover effects to pagination buttons
     */
    $(document).on('mouseenter', '.games-pagination button, .anime-pagination button', function() {
        $(this).css({
            'transform': 'scale(1.05)',
            'transition': 'all 0.2s ease'
        });
    }).on('mouseleave', '.games-pagination button, .anime-pagination button', function() {
        $(this).css({
            'transform': 'scale(1)',
            'transition': 'all 0.2s ease'
        });
    });

    // ========================================
    // 6. EMAIL VALIDATION (NATIVE TOOLTIPS)
    // ========================================
    
    /**
     * Real-time email validation using native browser constraint validation
     * Accepts ANY valid TLD (.com, .co.il, .org, .net, etc.)
     */
    
    // Clear custom validity as user types
    $(document).on('input', 'input[type="email"]', function() {
        const $input = $(this);
        
        // Clear any previous custom validity
        this.setCustomValidity('');
        
        // Reset styling
        $input.css({
            'border-color': '',
            'background-color': ''
        });
    });
    
    // Validate on blur
    $(document).on('blur', 'input[type="email"]', function() {
        const $input = $(this);
        const email = $input.val().trim();
        
        // Updated regex: accepts ANY valid domain extension
        // Examples: test@example.com, user@domain.co.il, admin@site.org
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email && !emailRegex.test(email)) {
            // Set native browser validation message
            this.setCustomValidity('❌ Please enter a valid email address (e.g., user@example.com)');
            
            // Show native browser tooltip
            this.reportValidity();
            
            // Add error border styling
            $input.css({
                'border-color': '#ff6b6b',
                'background-color': '#ffe0e0'
            });
            
            console.log('⚠️ Email validation failed: ' + email);
        } else if (email) {
            // Valid email - clear any errors
            this.setCustomValidity('');
            
            // Success styling
            $input.css({
                'border-color': '#4CAF50',
                'background-color': '#f0fff0'
            });
            
            console.log('✅ Email validated: ' + email);
        } else {
            // Empty - reset
            this.setCustomValidity('');
            $input.css({
                'border-color': '',
                'background-color': ''
            });
        }
    });

    // ========================================
    // 7. PASSWORD STRENGTH VALIDATION (NATIVE TOOLTIPS)
    // ========================================
    
    /**
     * Real-time password strength validation using native browser tooltips
     * Requirements: 8+ chars, uppercase, lowercase, number
     * 
     * ⚠️ IMPORTANT: Only applies to REGISTRATION forms, NOT login forms
     */
    
    // Clear validation as user types (REGISTRATION ONLY)
    $(document).on('input', 'input[type="password"][name="password"]:not(.login-password)', function() {
        const $input = $(this);
        const password = $input.val();
        
        // Skip validation if this is a login form
        const $form = $input.closest('form');
        if ($form.attr('action') === '/login') {
            return;
        }
        
        // Clear any previous custom validity
        this.setCustomValidity('');
        
        if (password.length === 0) {
            $input.css({
                'border-color': '',
                'background-color': ''
            });
            return;
        }
        
        // Password strength checks
        const hasMinLength = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        
        let strength = 0;
        let validationMessage = '';
        
        if (hasMinLength) strength++;
        if (hasUpperCase) strength++;
        if (hasLowerCase) strength++;
        if (hasNumber) strength++;
        
        // Build validation message for weak/medium passwords
        if (strength < 4) {
            const missing = [];
            if (!hasMinLength) missing.push('at least 8 characters');
            if (!hasUpperCase) missing.push('one uppercase letter');
            if (!hasLowerCase) missing.push('one lowercase letter');
            if (!hasNumber) missing.push('one number');
            
            validationMessage = '⚠️ Password must contain: ' + missing.join(', ');
        }
        
        // Apply styling based on strength
        if (strength === 4) {
            // Strong password
            this.setCustomValidity('');
            $input.css({
                'border-color': '#4CAF50',
                'background-color': '#f0fff0'
            });
            console.log('✅ Strong password');
        } else if (strength >= 2) {
            // Medium password - show warning border but don't block
            this.setCustomValidity('');
            $input.css({
                'border-color': '#ff9800',
                'background-color': '#fff8e1'
            });
            console.log('⚠️ Medium password: ' + validationMessage);
        } else {
            // Weak password - set error
            this.setCustomValidity(validationMessage);
            $input.css({
                'border-color': '#ff6b6b',
                'background-color': '#ffe0e0'
            });
            console.log('❌ Weak password: ' + validationMessage);
        }
    });
    
    // Validate on blur for passwords (REGISTRATION ONLY)
    $(document).on('blur', 'input[type="password"][name="password"]:not(.login-password)', function() {
        const $input = $(this);
        const password = $input.val();
        
        // Skip validation if this is a login form
        const $form = $input.closest('form');
        if ($form.attr('action') === '/login') {
            return;
        }
        
        if (!password) {
            return; // Don't validate empty fields on blur
        }
        
        const hasMinLength = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        
        const strength = [hasMinLength, hasUpperCase, hasLowerCase, hasNumber].filter(Boolean).length;
        
        if (strength < 4) {
            const missing = [];
            if (!hasMinLength) missing.push('at least 8 characters');
            if (!hasUpperCase) missing.push('one uppercase letter');
            if (!hasLowerCase) missing.push('one lowercase letter');
            if (!hasNumber) missing.push('one number');
            
            const message = '⚠️ Password must contain: ' + missing.join(', ');
            this.setCustomValidity(message);
            
            // DO NOT call reportValidity() here - it traps focus
            // User can freely click away and will see validation on form submit
        } else {
            this.setCustomValidity('');
        }
    });

    // ========================================
    // 7b. PREVENT FOCUS TRAP ON LOGIN FORMS
    // ========================================
    
    /**
     * Ensure login forms don't trap focus or prevent navigation
     * Users should be able to freely click away from any field
     */
    
    // Remove focus trap on login password fields
    $(document).on('blur', 'input[type="password"].login-password', function() {
        // Clear any validation styling on login forms
        const $input = $(this);
        $input.css({
            'border-color': '',
            'background-color': ''
        });
        
        // Clear any custom validity
        this.setCustomValidity('');
    });

    // ========================================
    // 7c. SMART CONFIRM PASSWORD FIELD
    // ========================================
    
    /**
     * Disable "Confirm Password" field until user types in main Password field
     * Improves UX by preventing users from typing in wrong order
     */
    
    $(document).on('input', 'input#registerPassword', function() {
        const $passwordField = $(this);
        const $confirmField = $('#confirmPassword');
        
        if ($confirmField.length === 0) {
            return; // Confirm field doesn't exist on this page
        }
        
        const passwordValue = $passwordField.val();
        
        if (passwordValue.length > 0) {
            // Enable confirm password field
            $confirmField.prop('disabled', false)
                         .css({
                             'background-color': '#ffffff',
                             'cursor': 'text'
                         });
            
            console.log('✅ Confirm Password field enabled');
        } else {
            // Disable confirm password field and clear its value
            $confirmField.prop('disabled', true)
                         .val('')
                         .css({
                             'background-color': '#f5f5f5',
                             'cursor': 'not-allowed',
                             'border-color': '#ccc'
                         });
            
            // Clear any validation messages
            $confirmField[0].setCustomValidity('');
            
            console.log('⚠️ Confirm Password field disabled (main password empty)');
        }
    });
    
    // Optional: Add visual feedback when confirm password field is focused while disabled
    $(document).on('focus', 'input#confirmPassword:disabled', function() {
        const $this = $(this);
        
        // Show tooltip hint
        $this.attr('title', '⚠️ Please enter a password first');
        
        // Brief shake animation
        $this.css({
            'animation': 'shake 0.3s ease',
            'border-color': '#ff9800'
        });
        
        setTimeout(() => {
            $this.css({
                'animation': '',
                'border-color': ''
            });
        }, 300);
        
        console.log('⚠️ User tried to use Confirm Password before main Password');
    });
    
    // Add shake animation keyframes to page (once)
    if (!$('#shake-animation-style').length) {
        $('<style id="shake-animation-style">')
            .text('@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }')
            .appendTo('head');
    }

    // ========================================
    // 8. TAB NAVIGATION ENHANCEMENT
    // ========================================
    
    /**
     * Tab switching is handled by vanilla JavaScript (auth-tab-switcher.js)
     * This jQuery handler was removed to prevent conflicts with vanilla JS
     */
    // Note: auth-tab-switcher.js handles all tab switching functionality

    // ========================================
    // 9. KEYBOARD SHORTCUTS
    // ========================================
    
    /**
     * Global keyboard shortcuts
     */
    $(document).on('keydown', function(e) {
        // Ctrl+H = Go Home
        if (e.ctrlKey && e.key.toLowerCase() === 'h') {
            e.preventDefault();
            window.location.href = '/';
            console.log('⌨️ Keyboard shortcut: Ctrl+H - Home');
        }

        // ESC = Close menus/modals
        if (e.key === 'Escape') {
            $('.profile-dropdown').slideUp(200);
            $('.modal').fadeOut(200);
            console.log('⌨️ Keyboard shortcut: ESC - Close');
        }

        // Ctrl+? = Show help (can be expanded)
        if (e.ctrlKey && e.shiftKey && e.key === '?') {
            e.preventDefault();
            showKeyboardHelp();
        }
    });

    const showKeyboardHelp = () => {
        const helpText = `
            ⌨️ Keyboard Shortcuts:
            • Ctrl+H - Go to Home
            • Ctrl+? - Show this help
            • ESC - Close menus
        `;
        console.log(helpText);
        alert(helpText);
    };

    // ========================================
    // 10. SMOOTH SCROLL TO SECTIONS
    // ========================================
    
    /**
     * Smooth scrolling for anchor links
     */
    $(document).on('click', 'a[href^="#"]', function(e) {
        const href = $(this).attr('href');
        if (href === '#') return; // Skip empty anchors

        const $target = $(href);
        if ($target.length) {
            e.preventDefault();
            
            // jQuery - smooth scroll animation
            $('html, body').animate({
                scrollTop: $target.offset().top - 80
            }, 800, 'swing', function() {
                console.log('📍 Scrolled to: ' + href);
            });
        }
    });

    // ========================================
    // 11. TABLE ROW HIGHLIGHTING
    // ========================================
    
    /**
     * Highlight table rows on hover
     */
    $(document).on('mouseenter', '#pokedexTable tbody tr', function() {
        $(this).css({
            'background-color': '#f0f0f0',
            'box-shadow': 'inset 0 0 10px rgba(0, 0, 0, 0.1)',
            'transition': 'all 0.2s ease'
        });
    }).on('mouseleave', '#pokedexTable tbody tr', function() {
        $(this).css({
            'background-color': 'transparent',
            'box-shadow': 'none'
        });
    });

    // ========================================
    // 12. ACCESSIBILITY IMPROVEMENTS
    // ========================================
    
    /**
     * Add ARIA labels to images without alt text
     */
    $('img:not([alt])').attr('alt', 'Image');

    /**
     * Make divs with role="button" keyboard accessible
     */
    $(document).on('keydown', '[role="button"]', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            $(this).click();
        }
    });

    // ========================================
    // 13. LOADING SPINNER
    // ========================================
    
    /**
     * Show spinner while fetching data
     */
    window.showLoadingSpinner = (selector) => {
        const $container = $(selector);
        if ($container.length) {
            $container.html(
                '<div style="text-align: center; padding: 20px;">' +
                '<div style="border: 4px solid #f3f3f3; border-top: 4px solid #667eea; ' +
                'border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; ' +
                'margin: 0 auto;"></div><p>Loading...</p></div>'
            );
        }
    };

    // ========================================
    // 14. CONSOLE SUMMARY
    // ========================================
    
    console.log('');
    console.log('╔════════════════════════════════════════╗');
    console.log('║  jQuery Features Initialized           ║');
    console.log('╠════════════════════════════════════════╣');
    console.log('║ ✅ Event handling                      ║');
    console.log('║ ✅ DOM manipulation                    ║');
    console.log('║ ✅ Form validation                     ║');
    console.log('║ ✅ Animations & effects                ║');
    console.log('║ ✅ Keyboard shortcuts                  ║');
    console.log('║ ✅ Accessibility enhancements          ║');
    console.log('╚════════════════════════════════════════╝');
    console.log('');
});
