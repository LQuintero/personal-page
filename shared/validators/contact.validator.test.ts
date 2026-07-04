import { describe, expect, it } from 'vitest';
import { validateContactForm } from './contact.validator';

const validInput = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  message: 'Hello, I would like to get in touch!',
};

describe('validateContactForm', () => {
  it('accepts a fully valid submission', () => {
    const result = validateContactForm(validInput);
    expect(result.success).toBe(true);
  });

  it('rejects an empty name', () => {
    const result = validateContactForm({ ...validInput, name: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['name']);
    }
  });

  it('rejects a name over 100 characters', () => {
    const result = validateContactForm({ ...validInput, name: 'a'.repeat(101) });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid email address', () => {
    const result = validateContactForm({ ...validInput, email: 'not-an-email' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['email']);
    }
  });

  it('rejects an email over 254 characters', () => {
    const longEmail = `${'a'.repeat(250)}@a.co`;
    const result = validateContactForm({ ...validInput, email: longEmail });
    expect(result.success).toBe(false);
  });

  it('rejects a message shorter than 10 characters', () => {
    const result = validateContactForm({ ...validInput, message: 'too short' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['message']);
    }
  });

  it('rejects a message over 1000 characters', () => {
    const result = validateContactForm({ ...validInput, message: 'a'.repeat(1001) });
    expect(result.success).toBe(false);
  });

  it('trims whitespace from name and message', () => {
    const result = validateContactForm({
      ...validInput,
      name: '  Ada Lovelace  ',
      message: '  Hello, I would like to get in touch!  ',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('Ada Lovelace');
      expect(result.data.message).toBe('Hello, I would like to get in touch!');
    }
  });
});
