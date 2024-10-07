import { writable, get } from "svelte/store";
import {GameEvents, type SuspectPosition, type SuspectsPositionPayload} from "$lib/event-constants";
import {socketStore} from "$lib/stores/websocketStore";

interface BoardState {
    suspectPositions: { [suspectId: string]: SuspectPosition };
}

function createBoardStore() {
    const { subscribe, set, update } = writable<BoardState>({
        suspectPositions: {}
    }, () => {
        socketStore.on(GameEvents.SUSPECTS_POSITION, handleReceivedSuspectsPositions);
        return () => {
            socketStore.off(GameEvents.SUSPECTS_POSITION, handleReceivedSuspectsPositions);
            console.log('Board store unsubscribed');
        };
    });

    function handleReceivedSuspectsPositions({ suspects }: SuspectsPositionPayload) {
        update(state => ({
            ...state,
            suspectPositions: {
                ...state.suspectPositions,
                ...suspects
            }
        }));
    }

    return {
        subscribe,

        // Mettre à jour la position d'un suspect
        updateSuspectPosition: (suspectId: string, position: SuspectPosition) => {
            update(state => ({
                ...state,
                suspectPositions: {
                    ...state.suspectPositions,
                    [suspectId]: position
                }
            }));
        },

        // Mettre à jour plusieurs positions de suspects à la fois
        updateMultipleSuspectPositions: (positions: { [suspectId: string]: SuspectPosition }) => {
            update(state => ({
                ...state,
                suspectPositions: {
                    ...state.suspectPositions,
                    ...positions
                }
            }));
        },

        // Obtenir la position d'un suspect spécifique
        getSuspectPosition: (suspectId: string): SuspectPosition | undefined => {
            const state = get({ subscribe });
            return state.suspectPositions[suspectId];
        },

        // Obtenir toutes les positions des suspects
        getAllSuspectPositions: () => {
            const state = get({ subscribe });
            return state.suspectPositions;
        },

        // Réinitialiser toutes les positions
        resetPositions: () => {
            set({ suspectPositions: {} });
        },

        // Supprimer un suspect du plateau
        removeSuspect: (suspectId: string) => {
            update(state => {
                const { [suspectId]: _, ...rest } = state.suspectPositions;
                return { ...state, suspectPositions: rest };
            });
        }
    };
}

export const boardStore = createBoardStore();