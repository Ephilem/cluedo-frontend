import {writable} from "svelte/store";

function createGameStore() {
    const { subscribe, set, update } = writable({
        currentPhase: 'waiting', // 'ongoing', 'finished'
        currentPlayerTurnId: null,
        gameRoomId: null,
        playingAs: null,
        hasHypothesed: false,
        playerOrder: [],
    });

    return {
        subscribe,
        setGameRoomId: (gmId: string ) => update(s => ({ ...s, gameRoomId: gmId })),
        setUsername: (username: string ) => update(s => ({ ...s, playingAs: username })),
        startGame: (currentPlayerTurnId: string, playerOrder: string[]) => update(s => {
            console.log("currentPlayerTurnId", currentPlayerTurnId)
            console.log("playerOrder", playerOrder)
            return { ...s, currentPhase: 'ongoing', currentPlayerTurnId, playerOrder }
        }),
        nextTurn: () => update(s => {
            if (s.currentPhase !== 'ongoing') {
                return s; // Ne rien faire si le jeu n'est pas en cours
            }

            const currentIndex = s.playerOrder.indexOf(s.currentPlayerTurnId);
            if (currentIndex === -1) {
                console.error("Current player not found in player order");
                return s;
            }

            const nextIndex = (currentIndex + 1) % s.playerOrder.length;
            const nextPlayerTurnId = s.playerOrder[nextIndex];

            updaterNextTurn.update(i => i+1);

            return { ...s, currentPlayerTurnId: nextPlayerTurnId, hasHypothesed: false };
        }),
        setHasHypothesed: (value: boolean) => {
            update(state => (
                {...state, hasHypothesed: value }
            ))
        }
    };
}

export const gameStore = createGameStore();

export const updaterNextTurn = writable(0);