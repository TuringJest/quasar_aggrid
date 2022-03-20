/** Return all focusable HTML elements */
export const getAllFocusableDomElements = (element)=> {
  if (!element instanceof HTMLElement) return

  return [...element.querySelectorAll(
    'input, textarea, select, details, [contenteditable], [tabindex]:not([tabindex="-1"]), button' // ,a[href]
  )]
    .filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'))
}

// /** Return first Input Element */
// export const getFirstElementInput = (el: HTMLElement): HTMLElement | null => {
//   return el.querySelector('input')
// }
