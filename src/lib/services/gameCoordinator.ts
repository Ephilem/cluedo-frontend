// gameCoordinator.ts
import { socketStore } from "$lib/stores/websocketStore";
import { gameStore } from "$lib/stores/gameStore";
import { env } from "$env/dynamic/public";
import { gameRoomTokenStore } from "$lib/stores/gameRoomToken";
import { get } from "svelte/store";
import {type GameEventMap, GameEvents, type JoinedSuccessfullyPayload} from '$lib/event-constants';

const API_URL = env.PUBLIC_API_URL;

export function initializeGameCoordinator(gameRoomId: string, username: string, token?: string): void {
    const serverUrl = API_URL;
    const query = {
        username,
        gameRoomId,
        ...(token && { token })
    };

    socketStore.connect(serverUrl, query);

    // socketStore.on(GameEvents.PLAYER_JOINED, () => {
    //     socketStore.emit(GameEvents.GET_SCENARIO, {});
    // });
    //
    // socketStore.on(GameEvents.PLAYER_LEFT, () => {
    //     socketStore.emit(GameEvents.GET_SCENARIO, {});
    // });
    //
    // socketStore.on(GameEvents.JOINED_SUCCESSFULLY, handleSuccessfullyJoined);
    // socketStore.on('scenarioData', scenarioStore.setScenario);
    // socketStore.on('playersList', playerStore.setPlayers);
    // socketStore.on('playerSelectSuspect', handlePlayerSelectSuspect);
    // socketStore.on('playerSetReady', handlePlayerSetReady);
    // socketStore.on('gameStarted', handleOnGameStart);
    // socketStore.on('summupData', handleResumeGame);
    // socketStore.on('yourCards', cardStore.setCards);
    // socketStore.on('staticBoardData', handleStaticBoardData);
    // socketStore.on('dynamicBoardData', handleDynamicBoardData);
    // socketStore.on('moveSuspect', handleMovingSuspect);
    // socketStore.on('nextTurn', handleNextTurn);
    // socketStore.on('newHypothesis', handleNewHypothesis);
    // socketStore.on('hypothesisDisproved', () => disproveStatus.set(null));


}


