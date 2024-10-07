import {get, writable} from "svelte/store";
import {
    type AssumptionsListPayload,
    type CurrentTurnPayload,
    GameEvents,
    type GameSummupPayload,
    type JoinedSuccessfullyPayload, type NeedToDisproveAssumptionPayload
} from "$lib/event-constants";
import {socketStore} from "$lib/stores/websocketStore";
import {gameRoomTokenStore} from "$lib/stores/gameRoomToken";
import {cardStore} from "$lib/stores/cardStore";
import {boardStore} from "$lib/stores/boardStore";
import {assumptionStore, hypotheses} from "$lib/stores/hypothesisStore";

function createGameStore() {
    const { subscribe, set, update } = writable({
        currentPhase: 'waiting', // 'ongoing', 'finished'
        currentPlayerTurnId: null,
        gameRoomId: null,
        playingAs: null,
        hasHypothesed: false,
        playerOrder: [],
    },
        () => {
            console.log('Game store started');

            socketStore.on(GameEvents.JOINED_SUCCESSFULLY, handleSuccessfullyJoined);
            socketStore.on(GameEvents.GAME_SUMMUP, handleSummupData);
            socketStore.on(GameEvents.CURRENT_TURN, handleCurrentTurn);
            socketStore.on(GameEvents.ASSUMPTIONS_LIST, handleAssumptionList);

            socketStore.on(GameEvents.NEED_TO_DISPROVE_ASSUMPTION, handleNeedToDisprove);

            return () => {
                socketStore.off(GameEvents.JOINED_SUCCESSFULLY, handleSuccessfullyJoined);
                socketStore.off(GameEvents.GAME_SUMMUP, handleSummupData);
                socketStore.off(GameEvents.CURRENT_TURN, handleCurrentTurn);
                socketStore.off(GameEvents.ASSUMPTIONS_LIST, handleAssumptionList);

                socketStore.off(GameEvents.NEED_TO_DISPROVE_ASSUMPTION, handleNeedToDisprove);

                console.log('Game store unsubscribed');
            };
        });

    function handleCurrentTurn(data: CurrentTurnPayload) {
        console.log('handleCurrentTurn', data);
        update(state => ({ ...state, currentPlayerTurnId: data.currentTurn.id}));
    }

    function handleSuccessfullyJoined(data: JoinedSuccessfullyPayload) {
        socketStore.emit(GameEvents.LIST_PLAYERS, {});
        socketStore.emit(GameEvents.GET_SCENARIO, {});
        const gameInfo = get(gameStore);

        if (data?.token && gameInfo && gameInfo.gameRoomId && gameInfo.playingAs) {
            gameRoomTokenStore.setToken(gameInfo.gameRoomId, gameInfo.playingAs, data.token);
        }

    }

    function handleSummupData(data: GameSummupPayload) {
        console.log('handleSummupData', data);
        update(state => ({ ...state, currentPhase: 'ongoing', playerOrder: data.playerOrder, currentPlayerTurnId: data.playerCurrentTurn }));
        cardStore.setCards(data.yourCards);
        boardStore.updateMultipleSuspectPositions(data.suspectsPosition);
        if (data.assumptionToDisprove) {
            assumptionStore.setAssumptionToDisprove(data.assumptionToDisprove);
        }
    }

    function handleNeedToDisprove(data: NeedToDisproveAssumptionPayload) {
        // update(store => ({
        //     ...store,
        //     assumptionToDisprove: data.assumption
        // }));
        console.log('handleNeedToDisprove', data);
        assumptionStore.setAssumptionToDisprove(data.assumption);
    }

    function handleAssumptionList(data: AssumptionsListPayload) {
        console.log('handleAssumptionList', data);
        assumptionStore.setAssumptions(data.assumptions);
    }



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
