import React, { useEffect, useRef } from 'react';

const FOCUSABLE_ELEMENTS = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input[type="text"]:not([disabled])',
  'input[type="radio"]:not([disabled])',
  'input[type="checkbox"]:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
];

export default function FocusTrap({ 
  children, 
  active = true, 
  initialFocusRef, 
  restoreFocus = true,
  className = ''
}) {
  const containerRef = useRef(null);
  const previouslyFocusedElement = useRef(null);

  useEffect(() => {
    if (!active) return;

    // Store the currently focused element
    previouslyFocusedElement.current = document.activeElement;

    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll(FOCUSABLE_ELEMENTS.join(','));
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    // Focus the initial element or the first focusable element
    const elementToFocus = initialFocusRef?.current || firstFocusableElement;
    if (elementToFocus) {
      elementToFocus.focus();
    }

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (focusableElements.length === 0) {
        e.preventDefault();
        return;
      }

      if (focusableElements.length === 1) {
        e.preventDefault();
        focusableElements[0].focus();
        return;
      }

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusableElement) {
          e.preventDefault();
          lastFocusableElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusableElement) {
          e.preventDefault();
          firstFocusableElement.focus();
        }
      }
    };

    // Add event listeners
    container.addEventListener('keydown', handleTabKey);

    // Cleanup function
    return () => {
      container.removeEventListener('keydown', handleTabKey);

      // Restore focus to the previously focused element
      if (restoreFocus && previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
      }
    };
  }, [active, initialFocusRef, restoreFocus]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}