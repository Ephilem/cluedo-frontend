// websocketStore.ts
import {get, writable} from 'svelte/store';
import io, { Socket } from 'socket.io-client';
import {type GameEventMap, GameEvents} from '$lib/event-constants';
import {gameStore} from "$lib/stores/gameStore";
import {gameRoomTokenStore} from "$lib/stores/gameRoomToken";

interface SocketState {
    status: 'disconnected' | 'connecting' | 'connected' | 'error';
    socket: Socket | null;
}

function createSocketStore() {
    const { subscribe, set, update } = writable<SocketState>({
            status: 'disconnected',
            socket: null,
        },
        () => {
            return () => {
                console.log('Socket store unsubscribed');
                socketStore.disconnect();
            };
        });

    let socket: Socket | null = null;

    return {
        subscribe,
        connect: (url: string, query: Record<string, string>) => {
            const currentState = get(socketStore);

            if (currentState.status === 'connected') {
                console.warn('Socket is already connected');
                return;
            }

            socket = io(url, {
                query,
                transports: ['websocket'],
            });

            update(state => ({ ...state, status: 'connecting' }));

            socket.on('connect', () => {
                update(state => ({ ...state, status: 'connected', socket }));
                console.log("Connected to Socket.IO server");
            });

            socket.on('connect_error', (error) => {
                update(state => ({ ...state, status: 'error' }));
                console.error("Connection error:", error);
            });

            socket.on('disconnect', (reason) => {
                update(state => ({ ...state, status: 'disconnected', socket: null }));
                console.log("Disconnected:", reason);
            });

            // Gestionnaire générique pour tous les événements entrants
            // socket.on('gameEvent', ({ event, data }) => {
            //     if (Object.values(GameEvents).includes(event)) {
            //         update(state => {
            //             if (state.socket) {
            //                 // Émet l'événement via le store
            //                 state.socket.emit(event, data);
            //             }
            //             return state;
            //         });
            //     } else {
            //         console.warn(`Unknown event received: ${event}`);
            //     }
            // });
        },
        disconnect: () => {
            if (socket) {
                socket.disconnect();
            }
            update(state => ({ ...state, status: 'disconnected', socket: null }));
        },
        emit: <K extends keyof GameEventMap>(event: K, data: GameEventMap[K]) => {
            // console.log('Emitting event', event, data);
            if (socket && socket.connected) {
                socket.emit('gameEvent', { event, data });
            } else {
                console.warn('Cannot emit event: socket is not connected');
            }
        },
        on: <K extends keyof GameEventMap>(
            event: K,
            listener: (data: GameEventMap[K]) => void
        ) => {
            if (socket) {
                socket.on('gameEvent', (payload) => {
                    console.log('Received event', payload.event, payload.data === event);
                    if (payload.event === event) {
                        listener(payload.data);
                    }
                });
            } else {
                console.warn('Cannot add listener: socket is not initialized');
            }
        },
        off: <K extends keyof GameEventMap>(
            event: K,
            listener: (data: GameEventMap[K]) => void
        ) => {
            if (socket) {
                socket.off('gameEvent');
            } else {
                console.warn('Cannot remove listener: socket is not initialized');
            }
        },
    };
}

export const socketStore = createSocketStore();