import { writable } from 'svelte/store';
import { persisted } from 'svelte-persisted-store';

// First param `preferences` is the local storage key.
// Second param is the initial value.
export const preferences = persisted('preferences', {
	theme: 'modern'
});

export const hideAppRail = writable(false);
