/**
 * NAVBAR PROFILE DROPDOWN - jQuery Implementation
 * Demonstrates functional jQuery with event handling, DOM manipulation, and effects
 * 
 * Features:
 * - Profile avatar click to toggle dropdown
 * - Smooth slide animations
 * - Dynamic styling with classes
 * - Event delegation
 * - User input capture
 */

$(document).ready(function() {
    'use strict';

    console.log('✅ jQuery Navbar Profile Script Loaded (v' + $.fn.jquery + ')');

    /**
     * FEATURE 1: jQuery Event Handling
     * Respond to click events on profile avatar
     */
    $(document).on('click', '.profile-avatar', function(e) {
        e.stopPropagation();
        
        // jQuery selector to find associated dropdown
        const $dropdown = $(this).siblings('.profile-dropdown');
        
        // jQuery - toggle show class for dropdown visibility
        $dropdown.toggleClass('show', 300);
        
        // FEATURE 3: Dynamic Styling - toggle active class
        $(this).toggleClass('avatar-active');
        
        console.log('🔓 Profile dropdown toggled');
    });

    /**
     * FEATURE 2: Write to DOM using jQuery
     * Set avatar initials from username
     */
    const setAvatarInitials = () => {
        $('.profile-avatar').each(function() {
            const $username = $(this).closest('.nav-profile-container')
                                     .find('.dropdown-username');
            
            if ($username.length) {
                const username = $username.text().trim();
                const initials = getInitials(username);
                
                // jQuery - write to DOM
                $(this).text(initials);
                
                console.log('👤 Avatar initialized with: ' + initials);
            }
        });
    };

    const getInitials = (username) => {
        if (!username) return 'U';
        
        const parts = username
            .split(/[\s_.-]+/)
            .map(p => p.trim())
            .filter(Boolean);

        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }

        return parts.length > 0 ? parts[0][0].toUpperCase() : 'U';
    };

    // Initialize on page load
    setAvatarInitials();

    /**
     * FEATURE 4: Capture User Input and Close Menu
     * Click outside dropdown to close
     */
    $(document).on('click', function(e) {
        // Check if click is outside profile container
        if (!$(e.target).closest('.nav-profile-container').length) {
            // jQuery - remove show class and hide dropdown
            $('.profile-dropdown').removeClass('show');
            $('.profile-avatar').removeClass('avatar-active');
        }
    });

    /**
     * FEATURE 5: Hover Effects on Dropdown Items
     * Dynamic styling of dropdown menu items
     */
    $(document).on('mouseenter', '.profile-dropdown li:not(.dropdown-greeting):not(:has(form))', function() {
        // jQuery - add inline CSS on hover
        $(this).css({
            'background-color': 'rgba(255, 255, 255, 0.1)',
            'border-left': '3px solid #667eea',
            'padding-left': '17px',
            'transition': 'all 0.2s ease'
        });
    }).on('mouseleave', '.profile-dropdown li:not(.dropdown-greeting):not(:has(form))', function() {
        // jQuery - remove inline CSS on leave
        $(this).css({
            'background-color': 'transparent',
            'border-left': 'none',
            'padding-left': '20px'
        });
    });

    /**
     * FEATURE 6: Logout Button Handling
     * Smooth animation before form submission
     */
    $(document).on('click', '.dropdown-logout', function(e) {
        e.preventDefault();

        // Remove show class on logout
        $('.profile-dropdown').removeClass('show');
        $('.profile-avatar').removeClass('avatar-active');

        const form = $(this).closest('form')[0];
        if (form) {
            form.submit();
        }
    });

    /**
     * FEATURE 7: Keyboard Accessibility
     * Handle keyboard navigation (Enter/Escape)
     */
    $(document).on('keydown', '.profile-avatar', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            // jQuery - trigger click
            $(this).click();
        }
        
        if (e.key === 'Escape') {
            // jQuery - hide dropdown
            $('.profile-dropdown').removeClass('show');
            $('.profile-avatar').removeClass('avatar-active');
        }
    });

    /**
     * FEATURE 8: AJAX - Check auth status and display user info
     * jQuery AJAX for real-time data
     */
    const checkAuthStatus = () => {
        $.ajax({
            url: '/auth/status',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                if (data.isLoggedIn && data.username) {
                    console.log('✅ User logged in: ' + data.username);
                    
                    // jQuery - update all usernames in dropdown
                    $('.dropdown-username').text(data.username);
                    
                    // jQuery - show profile avatar
                    $('.profile-avatar').fadeIn(300);
                } else {
                    console.log('❌ User not logged in');
                    $('.profile-avatar').fadeOut(300);
                }
            },
            error: function() {
                console.error('⚠️ Failed to check auth status');
            }
        });
    };

    // Check auth on page load
    checkAuthStatus();

    /**
     * FEATURE 9: Add Loading State to Logout
     * Visual feedback during logout
     */
    $(document).on('submit', 'form[action="/logout"]', function() {
        const $form = $(this);
        
        // jQuery - disable button and show loading state
        const $submitBtn = $form.find('button[type="submit"]');
        if ($submitBtn.length) {
            $submitBtn.prop('disabled', true)
                      .css('opacity', '0.6')
                      .text('Logging out...');
        }
        
        console.log('🔐 Logging out...');
    });

    /**
     * FEATURE 10: Highlight Current Page in Menu
     * Dynamic navigation highlighting
     */
    const highlightCurrentPage = () => {
        const currentPath = window.location.pathname;
        
        // jQuery - find and highlight current link
        $('.main-menu-item a').each(function() {
            const $link = $(this);
            if ($link.attr('href') === currentPath) {
                $link.addClass('current-page-link')
                     .closest('.main-menu-item')
                     .addClass('active-menu-item');
            }
        });
    };

    highlightCurrentPage();

    /**
     * FEATURE 11: Console Feedback - jQuery Version Info
     */
    console.log('📦 jQuery Configuration:');
    console.log('   Version: ' + jQuery.fn.jquery);
    console.log('   Namespace: jQuery');
    console.log('   Profile dropdown initialized: ' + $('.profile-avatar').length + ' avatars');
});
