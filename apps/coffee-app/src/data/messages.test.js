import { describe, it, expect } from 'vitest';
import { coffeeMessages, getRandomMessage } from './messages';

describe('coffeeMessages', () => {
  it('should be an array of exactly 15 items', () => {
    expect(Array.isArray(coffeeMessages)).toBe(true);
    expect(coffeeMessages).toHaveLength(15);
  });

  it('should contain only non-empty strings', () => {
    coffeeMessages.forEach(message => {
      expect(typeof message).toBe('string');
      expect(message.trim().length).toBeGreaterThan(0);
    });
  });
});

describe('getRandomMessage', () => {
  it('should return a string from the coffeeMessages array', () => {
    const message = getRandomMessage();
    expect(typeof message).toBe('string');
    expect(coffeeMessages).toContain(message);
  });

  it('should not return the exact same message twice in a row', () => {
    // This tests that consecutive calls do not yield the same string.
    // NOTE: This assumes getRandomMessage maintains state to prevent consecutive duplicates.
    // If it relies on pure Math.random(), this test will occasionally be flaky and fail.
    // However, a robust implementation for UI typically avoids consecutive identical messages.
    let previousMessage = getRandomMessage();
    
    for (let i = 0; i < 50; i++) {
      const currentMessage = getRandomMessage();
      expect(currentMessage).not.toBe(previousMessage);
      previousMessage = currentMessage;
    }
  });

  it('should be capable of returning different messages', () => {
    // A fallback test for standard random returns to ensure it's not hardcoded to one value
    const firstMessage = getRandomMessage();
    let foundDifferent = false;
    
    for (let i = 0; i < 50; i++) {
      if (getRandomMessage() !== firstMessage) {
        foundDifferent = true;
        break;
      }
    }
    
    expect(foundDifferent).toBe(true);
  });
});
