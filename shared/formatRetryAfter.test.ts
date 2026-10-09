import { describe, expect, it } from 'vitest';
import {
  chatDailyLimitClientMessage,
  contactDailyLimitMessage,
  formatRetryDelay,
  retryWhen,
} from './formatRetryAfter';

describe('formatRetryDelay', () => {
  it('names the bucket delay instead of a calendar day', () => {
    expect(formatRetryDelay(1)).toBe('1 second');
    expect(formatRetryDelay(45)).toBe('45 seconds');
    expect(formatRetryDelay(60)).toBe('1 minute');
    expect(formatRetryDelay(90)).toBe('2 minutes');
    expect(formatRetryDelay(3600)).toBe('1 hour');
    expect(formatRetryDelay(6 * 3600)).toBe('6 hours');
    expect(formatRetryDelay(24 * 3600)).toBe('24 hours');
  });
});

describe('daily limit copy', () => {
  it('uses the server delay when one was sent', () => {
    expect(contactDailyLimitMessage(2 * 60 * 60)).toBe(
      'Too many requests today. Please try again in 2 hours.'
    );
    expect(chatDailyLimitClientMessage(6 * 3600)).toContain('in 6 hours');
    expect(chatDailyLimitClientMessage(6 * 3600)).not.toContain('tomorrow');
  });

  it('does not say tomorrow when the delay is missing', () => {
    expect(retryWhen(undefined)).toBe('later');
    expect(contactDailyLimitMessage(undefined)).not.toContain('tomorrow');
    expect(chatDailyLimitClientMessage('soon')).not.toContain('tomorrow');
  });
});
