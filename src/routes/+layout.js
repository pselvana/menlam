import posthog from 'posthog-js';
import { browser } from '$app/environment';
import { PUBLIC_POSTHOG_KEY, PUBLIC_POSTHOG_HOST } from '$env/static/public';

export const load = async () => {
  if (browser) {
    posthog.init(
      'phc_MwkmN7dYHi0YodLcetHHhNngvBWnKtjWSwYaz8kN1an',
      {
        api_host: 'https://us.i.posthog.com',
        defaults: '2025-11-30',
        person_profiles: 'always', // or 'always' to create profiles for anonymous users as well
      }
    )
  }

  return
};
