import { useState, useEffect } from 'react';

export function useAnimationFocus() {
  const [focusedElement, setFocusedElement] = useState<string | null>(null);

  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      const card = target.closest('[data-card-id]');
      if (card) {
        setFocusedElement(card.getAttribute('data-card-id'));
      }
    };

    const handleBlur = () => {
      setFocusedElement(null);
    };

    document.addEventListener('focus', handleFocus, true);
    document.addEventListener('blur', handleBlur, true);

    return () => {
      document.removeEventListener('focus', handleFocus, true);
      document.removeEventListener('blur', handleBlur, true);
    };
  }, []);

  return {
    focusedElement,
    isElementFocused: (id: string) => focusedElement === id,
  };
}
