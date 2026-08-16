import { writable } from 'svelte/store';

export interface User {
	id: string;
	name: string;
	email: string;
	role?: string;
}

function createAuthStore() {
	const { subscribe, set, update } = writable<User | null>(null);

	// Initialize from localStorage on module load
	if (typeof localStorage !== 'undefined') {
		const saved = localStorage.getItem('user');
		if (saved) {
			try {
				set(JSON.parse(saved));
			} catch {
				// ignore parse errors
			}
		}
	}

	return {
		subscribe,
		setUser: (user: User) => {
			if (typeof localStorage !== 'undefined') {
				localStorage.setItem('user', JSON.stringify(user));
			}
			set(user);
		},
		clearUser: () => {
			if (typeof localStorage !== 'undefined') {
				localStorage.removeItem('user');
			}
			set(null);
		},
	};
}

export const currentUser = createAuthStore();
