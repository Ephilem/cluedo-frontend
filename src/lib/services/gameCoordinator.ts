// gameCoordinator.ts
import { socketStore } from "$lib/stores/websocketStore";
import { type Player, playerStore } from "$lib/stores/playerStore";
import { gameStore } from "$lib/stores/gameStore";
import {env} from "$env/dynamic/public";
import {scenarioStore} from "$lib/stores/scenarioStore";
import {gameRoomTokenStore} from "$lib/stores/gameRoomToken";
import {get} from "svelte/store";
import {cardStore} from "$lib/stores/cardStore";
import {dynamicBoardStore, staticBoardStore} from "$lib/stores/boardStore";
import {disproveStatus} from "$lib/stores/hypothesisStore";

const API_URL = env.PUBLIC_API_URL;

export function initializeGameCoordinator(gameRoomId: string, username: string, token?: string): void {
    const serverUrl = API_URL;
    const query = {
        username,
        gameRoomId,
        ...(token && { token })
    };

    socketStore.connect(serverUrl, query);

    // Écouter les messages du serveur
    // socketStore.subscribe(({ status, lastMessage }) => {
    //     if (status === 'connected') {
    //         console.log('Connected to the server');
    //     } else if (status === 'disconnected') {
    //         console.log('Disconnected from the server');
    //     } else if (status === 'error') {
    //         console.error('WebSocket connection error');
    //     }
    //
    //     // if (lastMessage) {
    //     //     handleSocketMessage(lastMessage.event, lastMessage.data);
    //     // }
    // });
}

export function handleSocketMessage(event: string, data: any): void {
    console.log("event: ", event);
    switch (event) {
        case 'playerJoined':
            socketStore.emit('getPlayers', {});
            break;
        case 'playerLeft':
            socketStore.emit('getPlayers', {});
            break;
        case 'scenarioData':
            scenarioStore.setScenario(data)
            break;
        case 'playersList':
            console.log("recieved players", data)
            playerStore.setPlayers(data)
            break;
        case 'joinedSucessfully':
            handleSuccessfullyJoined(data)
            break;
        case 'playerSelectSuspect':
            handlePlayerSelectSuspect(data)
            break;
        case 'playerSetReady':
            handlePlayerSetReady(data)
            break;
        case 'gameStarted':
            handleOnGameStart(data)
            break;
        case 'summupData':
            handleResumeGame(data)
            break;
        case 'yourCards':
            cardStore.setCards(data)
            break;
        case 'staticBoardData':
            handleStaticBoardData(data)
            break;
        case 'dynamicBoardData':
            handleDynamicBoardData(data)
            break;
        case 'moveSuspect':
            handleMovingSuspect(data)
            break;
        case 'nextTurn':
            handleNextTurn(data)
            break;
        case 'newHypothesis':
            handleNewHypothesis(data)
            break;
        case 'hypothesisDisproved':
            disproveStatus.set(null)
            break;
        // Ajoutez d'autres cas pour gérer différents types d'événements
        default:
            console.warn('Unhandled event type:', event);
    }
}

function handleSuccessfullyJoined(data: any) {
    socketStore.emit('getScenario', {});
    //socketStore.emit('getPlayers', {}); // déclancher avec l'event playerjoined
    socketStore.emit('getSummup', {})
    socketStore.emit('getStaticBoardData', {})
    socketStore.emit('getDynamicBoardData', {})


    const gameInfo = get(gameStore);

    if (data?.token) {
        gameRoomTokenStore.setToken(gameInfo.gameRoomId, gameInfo.playingAs, data.token)
    }
}

function handlePlayerSelectSuspect(data) {
    const { playerId, suspectId } = data;

    const suspect = get(scenarioStore).scenario.suspects.find(s => s.id === suspectId);

    if (suspect) {
        playerStore.setPlayAs(playerId, suspect);
    }

}

function handlePlayerSetReady(data) {
    const { playerId, isReady } = data;
    playerStore.setReady(playerId, isReady);
}

function handleOnGameStart(data) {
    const { firstPlayer, playerOrdrer } = data;

    gameStore.startGame(firstPlayer, playerOrdrer)
}

function handleResumeGame(data) {
    const { playerCards, playerOrder, currentPlayer } = data;
    console.log("summup recieve")

    gameStore.startGame(currentPlayer, playerOrder);
    cardStore.setCards(playerCards)
}
// Ajoutez d'autres fonctions de gestion d'événements selon vos besoins

function handleStaticBoardData(data) {
    const { mapMatrix } = data
    staticBoardStore.setMapMatrix(mapMatrix);
}

function handleNewHypothesis(data) {
    disproveStatus.set({...data, assuptionId: data.assumptionId})
}

function handleDynamicBoardData(data) {
    const { rooms, suspects, weapons } = data;
    console.log('new update ', suspects, weapons, rooms)
    dynamicBoardStore.setAll(rooms, suspects, weapons)
}

function handleNextTurn(data) {
    gameStore.nextTurn()
}

function handleMovingSuspect(data) {
    const { position, suspectId } = data;

    dynamicBoardStore.moveSuspect(suspectId, position, null)
}