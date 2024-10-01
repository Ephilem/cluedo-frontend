// boardStore.ts
import {writable, derived, get} from 'svelte/store';

export interface GridPosition {
    x: number;
    y: number;
}

export interface MapCell {
    x: number;
    y: number;
    color: string;
    cellType: 'empty' | 'room' | 'door' | 'wall';
    roomName: string | null;
    isDoor: boolean;
}

export interface BoardRoom {
    id: string;
    name: string;
    suspectIds: string[];
    weaponIds: string[];
}

export interface BoardSuspect {
    id: string;
    name: string;
    position: number[];
    roomId: string | null;
}

export interface BoardWeapon {
    id: string;
    name: string;
    roomId: string | null;
}

interface StaticBoardState {
    mapMatrix: MapCell[][];
}

interface DynamicBoardState {
    rooms: BoardRoom[];
    suspects: BoardSuspect[];
    weapons: BoardWeapon[];
}

function createStaticBoardStore() {
    const { subscribe, set, update } = writable<StaticBoardState>({
        mapMatrix: []
    });

    return {
        subscribe,
        setMapMatrix: (mapMatrix: MapCell[][]) => set({ mapMatrix }),
        reset: () => set({ mapMatrix: [] }),


        getAdjacentCells: (position: GridPosition) => {
            let adjacentCells: MapCell[] = [];

            const state = get({subscribe});

            const { x, y } = position;
            const directions = [
                { dx: -1, dy: 0 }, // Left
                { dx: 1, dy: 0 },  // Right
                { dx: 0, dy: -1 }, // Up
                { dx: 0, dy: 1 }   // Down
            ];

            for (const { dx, dy } of directions) {
                const newX = x + dx;
                const newY = y + dy;

                if (newX >= 0 && newX < state.mapMatrix.length &&
                    newY >= 0 && newY < state.mapMatrix[0].length) {
                    adjacentCells.push(state.mapMatrix[newX][newY]);
                }
            }

            return adjacentCells;
        },

        getDiagonalAdjacentCells: (position: GridPosition) => {
            let diagonalCells: MapCell[] = [];

            const state = get({subscribe});

            const { x, y } = position;
            const directions = [
                { dx: -1, dy: -1 }, // Top-left
                { dx: 1, dy: -1 },  // Top-right
                { dx: -1, dy: 1 },  // Bottom-left
                { dx: 1, dy: 1 }    // Bottom-right
            ];

            for (const { dx, dy } of directions) {
                const newX = x + dx;
                const newY = y + dy;

                if (newX >= 0 && newX < state.mapMatrix.length &&
                    newY >= 0 && newY < state.mapMatrix[0].length) {
                    diagonalCells.push(state.mapMatrix[newX][newY]);
                }
            }

            return diagonalCells;
        },

        getAllAdjacentCells: (position: GridPosition) => {
            const adjacentCells = createStaticBoardStore().getAdjacentCells(position);
            const diagonalCells = createStaticBoardStore().getDiagonalAdjacentCells(position);
            return [...adjacentCells, ...diagonalCells];
        },

        getRoomInfo: () => {
            let roomInfo: { [key: string]: { minX: number, maxX: number, minY: number, maxY: number } } = {};

            const state = get({subscribe})
            state.mapMatrix.forEach((row, y) => {
                row.forEach((cell, x) => {
                    if (cell.cellType === 'room' && cell.roomName) {
                        if (!roomInfo[cell.roomName]) {
                            roomInfo[cell.roomName] = { minX: x, maxX: x, minY: y, maxY: y };
                        } else {
                            roomInfo[cell.roomName].minX = Math.min(roomInfo[cell.roomName].minX, x);
                            roomInfo[cell.roomName].maxX = Math.max(roomInfo[cell.roomName].maxX, x);
                            roomInfo[cell.roomName].minY = Math.min(roomInfo[cell.roomName].minY, y);
                            roomInfo[cell.roomName].maxY = Math.max(roomInfo[cell.roomName].maxY, y);
                        }
                    }
                });
            });

            return roomInfo;
        }
    };
}

function createDynamicBoardStore() {
    const { subscribe, update, set } = writable<DynamicBoardState>({
        rooms: [],
        suspects: [],
        weapons: []
    });

    return {
        subscribe,
        setAll: (rooms: BoardRoom[], suspects: BoardSuspect[], weapons: BoardWeapon[]) => update(state => ({rooms, suspects, weapons })),
        setRooms: (rooms: BoardRoom[]) => update(state => ({ ...state, rooms })),
        setSuspects: (suspects: BoardSuspect[]) => update(state => ({ ...state, suspects })),
        setWeapons: (weapons: BoardWeapon[]) => update(state => ({ ...state, weapons })),
        updateRoom: (roomId: string, updates: Partial<BoardRoom>) => update(state => ({
            ...state,
            rooms: state.rooms.map(r => r.id === roomId ? { ...r, ...updates } : r)
        })),
        moveSuspect: (suspectId: string, newPosition: GridPosition, newRoomId: string | null) => update(state => ({
            ...state,
            suspects: state.suspects.map(s =>
                s.id === suspectId ? { ...s, position: [newPosition.x, newPosition.y], roomId: newRoomId } : s
            ),
            rooms: state.rooms.map(r => ({
                ...r,
                suspectIds: r.id === newRoomId
                    ? [...r.suspectIds, suspectId]
                    : r.suspectIds.filter(id => id !== suspectId)
            }))
        })),
        moveWeapon: (weaponId: string, newRoomId: string | null) => update(state => ({
            ...state,
            weapons: state.weapons.map(w =>
                w.id === weaponId ? { ...w, roomId: newRoomId } : w
            ),
            rooms: state.rooms.map(r => ({
                ...r,
                weaponIds: r.id === newRoomId
                    ? [...r.weaponIds, weaponId]
                    : r.weaponIds.filter(id => id !== weaponId)
            }))
        })),

        getSuspectAtPosition: (position: GridPosition) => {
            let suspect: BoardSuspect | null = null;
            const state = get({subscribe});
            suspect = state.suspects.find(s => {
                // console.log(s.position.x === 1 && s.position.y === 19);
                return s.position[0] === position.x && s.position[1] === position.y
            }
            ) || null;
            //console.log(suspect, position.x === 9 && position.y === 25)
            return suspect;
        },

        getSuspectsInRoom: (roomId: string) => {
            let suspects: BoardSuspect[];
            const state = get({subscribe});

            suspects = state.suspects.filter(s => s.roomId === roomId);
            return suspects;
        },

        reset: () => set({ rooms: [], suspects: [], weapons: [] })
    };
}

export const staticBoardStore = createStaticBoardStore();
export const dynamicBoardStore = createDynamicBoardStore();

// Derived stores
export const suspectPositions = derived(dynamicBoardStore, $store =>
    $store.suspects.reduce((acc, suspect) => {
        acc[suspect.id] = {x: suspect.position[0], y: suspect.position[1]};
        return acc;
    }, {} as Record<string, GridPosition>)
);

export const roomContents = derived(dynamicBoardStore, $store =>
    $store.rooms.reduce((acc, room) => {
        acc[room.id] = {
            suspectIds: room.suspectIds,
            weaponIds: room.weaponIds
        };
        return acc;
    }, {} as Record<string, { suspectIds: string[], weaponIds: string[] }>)
);