/**
 * Copy to Clipboard Functionality for Code Blocks
 *
 * Adds copy buttons to all <pre> code blocks in blog posts.
 * Uses modern Clipboard API with fallback for older browsers.
 */

// SVG icons
const COPY_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;

const CHECK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

const ERROR_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;

interface CopyButtonState {
  button: HTMLButtonElement;
  timeoutId?: number;
}

/**
 * Creates a copy button element
 */
function createCopyButton(): HTMLButtonElement {
  const button = document.createElement('button');
  button.className = 'copy-code-button';
  button.setAttribute('aria-label', 'Copy code to clipboard');
  button.innerHTML = COPY_ICON;
  button.type = 'button';

  return button;
}

/**
 * Extracts text content from a code block, stripping line numbers if present
 */
function getCodeContent(pre: HTMLElement): string {
  const code = pre.querySelector('code');
  if (!code) return pre.textContent || '';

  // Use textContent to preserve formatting
  let text = code.textContent || '';

  // Strip line numbers if they exist (common pattern: line numbers in spans with class)
  const lineNumbers = code.querySelectorAll('.line-number');
  if (lineNumbers.length > 0) {
    // Clone the code element to avoid modifying the DOM
    const clone = code.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('.line-number').forEach((el) => el.remove());
    text = clone.textContent || '';
  }

  return text.trim();
}

/**
 * Copies text to clipboard using modern API with fallback
 */
async function copyToClipboard(text: string): Promise<boolean> {
  // Try modern Clipboard API first
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('Clipboard API failed, trying fallback', err);
    }
  }

  // Fallback for older browsers
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);

    return successful;
  } catch (err) {
    console.error('Fallback copy failed', err);
    return false;
  }
}

/**
 * Updates button state after copy attempt
 */
function updateButtonState(
  button: HTMLButtonElement,
  success: boolean,
  stateMap: Map<HTMLButtonElement, CopyButtonState>
): void {
  const state = stateMap.get(button);
  if (!state) return;

  // Clear existing timeout
  if (state.timeoutId) {
    window.clearTimeout(state.timeoutId);
  }

  if (success) {
    button.innerHTML = CHECK_ICON;
    button.setAttribute('aria-label', 'Code copied!');
    button.classList.add('copied');
  } else {
    button.innerHTML = ERROR_ICON;
    button.setAttribute('aria-label', 'Failed to copy');
    button.classList.add('error');
  }

  // Reset after 2 seconds
  state.timeoutId = window.setTimeout(() => {
    button.innerHTML = COPY_ICON;
    button.setAttribute('aria-label', 'Copy code to clipboard');
    button.classList.remove('copied', 'error');
    state.timeoutId = undefined;
  }, 2000);
}

/**
 * Handles copy button click
 */
async function handleCopyClick(
  event: Event,
  stateMap: Map<HTMLButtonElement, CopyButtonState>
): Promise<void> {
  const button = event.currentTarget as HTMLButtonElement;
  const pre = button.closest('pre');

  if (!pre) return;

  const code = getCodeContent(pre);
  const success = await copyToClipboard(code);

  updateButtonState(button, success, stateMap);

  // Announce to screen readers
  const announcement = success ? 'Code copied to clipboard' : 'Failed to copy code';
  announceToScreenReader(announcement);
}

/**
 * Announces message to screen readers
 */
function announceToScreenReader(message: string): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  window.setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Handles keyboard events for accessibility
 */
function handleKeydown(
  event: KeyboardEvent,
  stateMap: Map<HTMLButtonElement, CopyButtonState>
): void {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    handleCopyClick(event, stateMap);
  }
}

/**
 * Gets the markdown content from a markdown-document element
 */
function getMarkdownDocumentContent(container: HTMLElement): string {
  const content = container.querySelector('.markdown-document-content');
  if (!content) return '';

  // Get text content from the content area
  return content.textContent?.trim() || '';
}

/**
 * Handles copy document button click
 */
async function handleCopyDocumentClick(
  event: Event,
  stateMap: Map<HTMLButtonElement, CopyButtonState>
): Promise<void> {
  const button = event.currentTarget as HTMLButtonElement;
  const container = button.closest('.markdown-document');

  if (!container) return;

  const content = getMarkdownDocumentContent(container as HTMLElement);
  const success = await copyToClipboard(content);

  updateButtonState(button, success, stateMap);

  // Announce to screen readers
  const announcement = success ? 'Document copied to clipboard' : 'Failed to copy document';
  announceToScreenReader(announcement);
}

/**
 * Adds copy buttons to all code blocks
 */
function addCopyButtons(): void {
  // Use a Map to track button states
  const buttonStates = new Map<HTMLButtonElement, CopyButtonState>();

  // Find all <pre> elements within .prose (including those in .markdown-document)
  const codeBlocks = document.querySelectorAll('.prose pre');

  codeBlocks.forEach((pre) => {
    // Skip if button already exists
    if (pre.querySelector('.copy-code-button')) return;

    // Create and add button
    const button = createCopyButton();
    pre.appendChild(button);

    // Track state
    buttonStates.set(button, { button });

    // Add event listeners
    button.addEventListener('click', (e) => handleCopyClick(e, buttonStates));
    button.addEventListener('keydown', (e) => handleKeydown(e as KeyboardEvent, buttonStates));
  });

  // Add event listeners to copy-document buttons
  const copyDocumentButtons = document.querySelectorAll('.copy-document-button');

  copyDocumentButtons.forEach((button) => {
    const btn = button as HTMLButtonElement;

    // Track state
    buttonStates.set(btn, { button: btn });

    // Add event listeners
    btn.addEventListener('click', (e) => handleCopyDocumentClick(e, buttonStates));
    btn.addEventListener('keydown', (e) => {
      if ((e as KeyboardEvent).key === 'Enter' || (e as KeyboardEvent).key === ' ') {
        e.preventDefault();
        handleCopyDocumentClick(e, buttonStates);
      }
    });
  });
}

/**
 * Initialize on DOM ready
 */
function init(): void {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addCopyButtons);
  } else {
    addCopyButtons();
  }
}

// Run initialization
init();

// Re-run on Astro page transitions (if view transitions are enabled)
document.addEventListener('astro:page-load', addCopyButtons);
