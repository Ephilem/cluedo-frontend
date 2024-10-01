import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface GameRoomTokens {
    [username: string]: string
}

function createGameRoomTokenStore() {
    const storageKey = 'gameRoomTokens';

    // Fonction pour charger les données depuis le localStorage
    const loadFromStorage = (): Record<string, GameRoomTokens> => {
        if (browser) {
            const storedData = localStorage.getItem(storageKey);
            return storedData ? JSON.parse(storedData) : {};
        }
        return {};
    };

    // Initialiser le store avec les données du localStorage
    const { subscribe, set, update } = writable<Record<string, GameRoomTokens>>(loadFromStorage());

    return {
        subscribe,
        setToken: (roomId: string, username: string, token: string) => {
            update(store => {
                if (!store[roomId]) {
                    store[roomId] = {};
                }
                store[roomId][username] = token;
                if (browser) {
                    localStorage.setItem(storageKey, JSON.stringify(store));
                }
                return store;
            });
        },
        getToken: (roomId: string, username: string): string | undefined => {
            const store = loadFromStorage();
            return store[roomId]?.[username];
        },
        removeToken: (roomId: string, username: string) => {
            update(store => {
                if (store[roomId] && store[roomId][username]) {
                    delete store[roomId][username];
                    if (Object.keys(store[roomId]).length === 0) {
                        delete store[roomId];
                    }
                    if (browser) {
                        localStorage.setItem(storageKey, JSON.stringify(store));
                    }
                }
                return store;
            });
        },
        clear: () => {
            set({});
            if (browser) {
                localStorage.removeItem(storageKey);
            }
        },
        cleanupTokens: (keepRoomIds: string[]) => {
            update(store => {
                const newStore = {};
                keepRoomIds.forEach(roomId => {
                    if (store[roomId]) {
                        newStore[roomId] = store[roomId];
                    }
                });
                if (browser) {
                    localStorage.setItem(storageKey, JSON.stringify(newStore));
                }
                return newStore;
            });
        },
    };
}

export const gameRoomTokenStore = createGameRoomTokenStore();