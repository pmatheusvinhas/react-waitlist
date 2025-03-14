/**
 * Dynamically load fonts from Google Fonts
 */
export function loadFonts(): void {
  // Skip if running on the server or if document is not available
  if (typeof document === 'undefined') return;

  // Check if fonts are already loaded
  if (document.getElementById('react-waitlist-fonts')) return;

  // Create link elements for Google Fonts
  const interLink = document.createElement('link');
  interLink.rel = 'stylesheet';
  interLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
  
  const robotoLink = document.createElement('link');
  robotoLink.rel = 'stylesheet';
  robotoLink.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap';
  
  // Create a container element to mark that fonts are loaded
  const container = document.createElement('div');
  container.id = 'react-waitlist-fonts';
  container.style.display = 'none';
  
  // Append elements to document head
  document.head.appendChild(interLink);
  document.head.appendChild(robotoLink);
  document.head.appendChild(container);
}

/**
 * Font families
 */
export const fontFamilies = {
  inter: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
  roboto: '"Roboto", "Helvetica", "Arial", sans-serif',
}; 