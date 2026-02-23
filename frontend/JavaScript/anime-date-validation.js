/**
 * ANIME DATE VALIDATION
 * Client-side validation for Anime form start/end dates
 */

(() => {
  'use strict';

  const startDateInput = document.getElementById('animeStartDate');
  const endDateInput = document.getElementById('animeEndDate');

  if (!startDateInput || !endDateInput) {
    return; // Not on the anime form page
  }

  /**
   * Update end date minimum when start date changes
   */
  startDateInput.addEventListener('change', () => {
    if (startDateInput.value) {
      endDateInput.min = startDateInput.value;
      
      // If end date is before new start date, clear it
      if (endDateInput.value && endDateInput.value < startDateInput.value) {
        endDateInput.value = '';
      }
    }
  });

  /**
   * Validate on form submission
   */
  const animeForm = document.querySelector('#animeForm form');
  if (animeForm) {
    animeForm.addEventListener('submit', (e) => {
      if (startDateInput.value && endDateInput.value) {
        if (new Date(endDateInput.value) < new Date(startDateInput.value)) {
          e.preventDefault();
          alert('End date cannot be earlier than start date');
        }
      }
    });
  }
})();
