import { describe, expect, it } from 'vitest';
import { isNoAnswerResponse } from './chatLog.service';

describe('isNoAnswerResponse', () => {
  it('detects the canned fallback from the system prompt', () => {
    expect(
      isNoAnswerResponse("I'm not sure about that one, but you can ask Laura [here](/contact).")
    ).toBe(true);
  });

  it('detects the empty-reply fallback from the chat service', () => {
    expect(isNoAnswerResponse("I don't have an answer for that one.")).toBe(true);
  });

  it('detects the canned phrasing even with extra text around it', () => {
    expect(
      isNoAnswerResponse("Hmm, I'm not sure about that one — but her projects are fair game!")
    ).toBe(true);
  });

  it('treats substantive replies as answered', () => {
    expect(
      isNoAnswerResponse('At Reconstruct, she led the AWS/OCI migration.')
    ).toBe(false);
  });
});
