// playerStore.ts
import {derived, get, writable} from 'svelte/store';
import { socketStore } from './websocketStore';
import {type GameEventMap, GameEvents, type PlayersListPayload} from '$lib/event-constants';
import type {PlayerInfo} from "$lib/types";
import {gameStore} from "$lib/stores/gameStore";


interface PlayerState {
    players: PlayerInfo[];
}

function createPlayerStore() {
    const { subscribe, update, set } = writable<PlayerState>(
        { players: [] },
        // Cette fonction est appelée lorsque le nombre d'abonnés passe de 0 à 1
        () => {
            // S'abonner aux événements
            // socketStore.on('playerJoined', handlePlayerJoined);
            // socketStore.on('playerLeft', handlePlayerLeft);
            // socketStore.on('playerSelectSuspect', handlePlayerSelectSuspect);
            // socketStore.on('playerSetReady', handlePlayerSetReady);
            socketStore.on(GameEvents.PLAYERS_LIST, handlePlayerList);
            // socketStore.on(GameEvents.PLAYER_JOINED, handlePlayerJoined);
            // socketStore.on(GameEvents.PLAYER_LEFT, handlePlayerLeft);

            // Fonction de nettoyage, appelée lorsque le nombre d'abonnés passe de 1 à 0
            return () => {
                socketStore.off(GameEvents.PLAYERS_LIST, handlePlayerList);
                // socketStore.off(GameEvents.PLAYER_JOINED, handlePlayerJoined);
                // socketStore.off(GameEvents.PLAYER_LEFT, handlePlayerLeft);
                // socketStore.off('playerJoined', handlePlayerJoined);
                // socketStore.off('playerLeft', handlePlayerLeft);
                // socketStore.off('playerSelectSuspect', handlePlayerSelectSuspect);
                // socketStore.off('playerSetReady', handlePlayerSetReady);
            };
        }
    );

    function setPlayers(players: PlayerInfo[]) {
        set({ players });
    }

    function handlePlayerJoined(data: GameEventMap['playerJoined']) {
        update(store => ({
            players: [...store.players, data.player]
        }));
    }

    function handlePlayerLeft(data: GameEventMap['playerLeft']) {
        update(store => ({
            players: store.players.filter(p => p.username !== data.username)
        }));
    }

    function handlePlayerList(data: PlayersListPayload) {
        console.log('handlePlayerList', data);
        update(store => ({
            players: data.players
        }));
    }

    // function handlePlayerSelectSuspect(data: GameEventMap['playerSelectSuspect']) {
    //     update(store => ({
    //         players: store.players.map(p =>
    //             p.id === data.playerId ? { ...p, playAs: data.suspect } : p
    //         )
    //     }));
    // }
    //
    // function handlePlayerSetReady(data: GameEventMap['playerSetReady']) {
    //     update(store => ({
    //         players: store.players.map(p =>
    //             p.id === data.playerId ? { ...p, ready: data.isReady } : p
    //         )
    //     }));
    // }

    function getPlayerMe() {
        const gameInfo = get(gameStore);
        if (!gameInfo) {
            return null;
        }

        return get({ subscribe }).players.find(p => p.username === gameInfo.playingAs);
    }

    return {
        subscribe,
        // ... autres méthodes du store
    };
}

export const playerStore = createPlayerStore();

export const playerMe = derived(playerStore, $playerStore => {
    return $playerStore.players.find(p => p.username === get(gameStore).playingAs);
})

export const playersNeedToDisprove = derived(playerStore, $playerStore => {
    return $playerStore.players.filter(p => p.needToDisprove);
})