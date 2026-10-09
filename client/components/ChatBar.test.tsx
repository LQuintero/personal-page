// @vitest-environment jsdom
import { createElement } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderMessageContent } from './ChatBar';

describe('renderMessageContent', () => {
  it('links only the exact contact page', () => {
    render(
      createElement(
        'div',
        null,
        renderMessageContent(
          'Ask [here](/contact). Not [this](//example.com) or [that](/contact/extra).',
          false
        )
      )
    );

    const link = screen.getByRole('link', { name: 'here' });
    expect(link.getAttribute('href')).toBe('/contact');
    expect(screen.queryByRole('link', { name: 'this' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'that' })).toBeNull();
    expect(screen.getByText(/\/\/example\.com/)).toBeTruthy();
    expect(screen.getByText(/\/contact\/extra/)).toBeTruthy();
  });
});
