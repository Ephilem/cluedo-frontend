// cardStore.ts
import { writable, derived, get } from 'svelte/store';
import type {Card} from "$lib/types";


interface CardState {
    cards: Card[];
}

function createCardStore() {
    const { subscribe, update, set } = writable<CardState>({
        cards: []
    });

    return {
        subscribe,
        addCard: (card: Card) => update(store => {
            const cards = [...store.cards, card];
            return { ...store, cards };
        }),
        removeCard: (cardId: string) => update(store => {
            const cards = store.cards.filter(c => c.id !== cardId);
            return { ...store, cards };
        }),
        setCards: (cards: Card[]) => set({ cards }),
        updateCard: (cardId: string, updates: Partial<Card>) => update(store => {
            const cards = store.cards.map(c =>
                c.id === cardId ? { ...c, ...updates } : c
            );
            return { ...store, cards };
        }),
        reset: () => set({ cards: [] }),
        getCardById: (cardId: string): Card | undefined => {
            const store = get({ subscribe });
            return store.cards.find(c => c.id === cardId);
        },
        getCardByName: (cardName: string): Card | undefined => {
            const store = get({ subscribe });
            return store.cards.find(c => c.name === cardName);
        }
    };
}

export const cardStore = createCardStore();

// Derived stores
export const suspectCards = derived(cardStore, $cardStore =>
    $cardStore.cards.filter(c => c.type === 'suspect')
);

export const weaponCards = derived(cardStore, $cardStore =>
    $cardStore.cards.filter(c => c.type === 'weapon')
);

export const roomCards = derived(cardStore, $cardStore =>
    $cardStore.cards.filter(c => c.type === 'room')
);