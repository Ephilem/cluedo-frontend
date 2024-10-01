// websocketStore.ts
import {get, writable} from 'svelte/store';
import io, { Socket } from 'socket.io-client';
import {handleSocketMessage} from "$lib/services/gameCoordinator";

interface SocketState {
    socket: Socket | null;
    status: 'connected' | 'disconnected' | 'error';
    lastMessage: any | null;
}

function createSocketStore() {
    const { subscribe, set, update } = writable<SocketState>({
        socket: null,
        status: 'disconnected',
        lastMessage: null
    });

    let socket: Socket | null = null;

    return {
        subscribe,
        connect: (url: string, query: Record<string, string>) => {

            if (get({ subscribe }).status === 'connected') {
                console.warn("tried to reconnected bruh")
                return;
            }

            socket = io(url, { query });

            socket.on('connect', () => {
                console.log('Connected to the server');
                update(store => ({ ...store, status: 'connected', socket }));
            });

            socket.on('disconnect', () => {
                console.log('Disconnected from the server');
                update(store => ({ ...store, status: 'disconnected' }));
            });

            socket.on('error', (error: Error) => {
                console.error('Socket error:', error);
                update(store => ({ ...store, status: 'error' }));
            });

            socket.onAny((eventName: string, ...args: any[]) => {
                // update(store => ({ ...store, lastMessage: { event: eventName, data: args[0] } }));
                handleSocketMessage(eventName, args[0])
            });
        },
        disconnect: () => {
            if (socket) {
                socket.disconnect();
            }
        },
        emit: (event: string, data: any) => {
            if (socket && socket.connected) {
                socket.emit(event, data);
            } else {
                console.error('Socket is not connected');
            }
        }
    };
}

export const socketStore = createSocketStore();