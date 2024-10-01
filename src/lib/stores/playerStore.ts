// playerStore.ts
import {writable, derived, get} from 'svelte/store';

export interface Player {
    id: string;
    username: string;
    ready: boolean;
    playAs: {
        id: string,
        color: string,
        name: string,
    } | null;
    eliminated: boolean;
    isHost: boolean;
}

interface PlayerState {
    players: Player[];
}

function createPlayerStore() {
    const { subscribe, update, set } = writable<PlayerState>({
        players: []
    });

    return {
        subscribe,
        addPlayer: (player: Player) => update(store => {
            const players = [...store.players, player];
            return { ...store, players };
        }),
        removePlayer: (playerId: string) => update(store => {
            const players = store.players.filter(p => p.id !== playerId);
            return { ...store, players };
        }),
        setPlayers: (players: Player[]) => set({players}),
        updatePlayer: (playerId: string, updates: Partial<Player>) => update(store => {
            const players = store.players.map(p =>
                p.id === playerId ? { ...p, ...updates } : p
            );
            return { ...store, players };
        }),
        setReady: (playerId: string, isReady: boolean) => update(store => {
            const players = store.players.map(p =>
                p.id === playerId ? { ...p, ready: isReady } : p
            );
            return { ...store, players };
        }),
        setPlayAs: (playerId: string, suspect: { id: string, color: string, name: string } | null) => update(store => {
            const players = store.players.map(p =>
                p.id === playerId ? { ...p, playAs: suspect } : p
            );
            return { ...store, players };
        }),
        setEliminated: (playerId: string, isEliminated: boolean) => update(store => {
            const players = store.players.map(p =>
                p.id === playerId ? { ...p, isEliminated } : p
            );
            return { ...store, players };
        }),
        reset: () => update(() => ({ players: [] })),
        getPlayerBySuspectName: (suspectName: string): Player | undefined => {
            const store = get({ subscribe });
            return store.players.find(p => p.playAs?.name === suspectName);
        },
        getPlayerBySuspectId: (suspectId: string): Player | undefined => {
            const store = get({ subscribe });
            return store.players.find(p => p.playAs?.id === suspectId);
        }
    };
}

export const playerStore = createPlayerStore();

// Derived stores
export const activePlayers = derived(playerStore, $playerStore =>
    $playerStore.players.filter(p => p.playAs !== null && !p.eliminated)
);

export const spectators = derived(playerStore, $playerStore =>
    $playerStore.players.filter(p => p.playAs === null)
);

export const eliminatedPlayers = derived(playerStore, $playerStore =>
    $playerStore.players.filter(p => p.eliminated)
);