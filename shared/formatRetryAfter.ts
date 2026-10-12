/**
 * Visitor-facing delay for a rate-limit `retryAfter` value, in seconds.
 * Upstash's sliding window sets that value to the end of the current fixed
 * bucket, and a denial does not increment the counter, so a slot can open
 * before the bucket ends. The phrase is an upper bound ("in up to 6 hours")
 * instead of promising the wait is exactly that long, or "tomorrow".
 */

export function formatRetryDelay(retryAfterSeconds: number): string {
  const seconds = Math.max(1, Math.ceil(retryAfterSeconds));
  if (seconds < 60) {
    return seconds === 1 ? '1 second' : `${seconds} seconds`;
  }
  const minutes = Math.ceil(seconds / 60);
  if (minutes < 60) {
    return minutes === 1 ? '1 minute' : `${minutes} minutes`;
  }
  const hours = Math.ceil(seconds / 3600);
  if (hours < 48) {
    return hours === 1 ? '1 hour' : `${hours} hours`;
  }
  const days = Math.ceil(hours / 24);
  return days === 1 ? '1 day' : `${days} days`;
}

/** "later", or "in up to 6 hours" when the server sent a finite delay. */
export function retryWhen(retryAfterSeconds: unknown): string {
  if (typeof retryAfterSeconds !== 'number' || !Number.isFinite(retryAfterSeconds)) {
    return 'later';
  }
  return `in up to ${formatRetryDelay(retryAfterSeconds)}`;
}

export function contactDailyLimitMessage(retryAfterSeconds: unknown): string {
  return `Too many requests today. Please try again ${retryWhen(retryAfterSeconds)}.`;
}

export function chatDailyLimitMessage(retryAfterSeconds: unknown): string {
  return `The assistant has reached its daily limit. Please try again ${retryWhen(retryAfterSeconds)}.`;
}

export function chatDailyLimitClientMessage(retryAfterSeconds: unknown): string {
  return `The assistant has hit its daily limit. Try again ${retryWhen(retryAfterSeconds)}, or reach me directly [here](/contact).`;
}
