import { fetch, setup } from '@nuxt/test-utils/e2e';
import { describe, expect, it } from 'vitest';

describe('smoke', async () => {
  await setup();

  it('should render index page', async () => {
    const { status } = await fetch('/');

    expect(status).toBe(200);
  });

  it('should render login page', async () => {
    const { status } = await fetch('/login');

    expect(status).toBe(200);
  });

  it('should render register page', async () => {
    const { status } = await fetch('/register');

    expect(status).toBe(200);
  });

  it('should render workspace page', async () => {
    // TODO: add user cookies ?
    const { status } = await fetch('/@user');

    expect(status).not.toBe(500);
  });
});
