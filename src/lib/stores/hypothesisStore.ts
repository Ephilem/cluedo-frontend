import {writable} from "svelte/store";

export interface DisproveStatus {
    playerId: string, // maker
    weaponId: string,
    roomId: string,
    suspectId: string,
    assuptionId: string,
}

function createDisproveStore() {
    const { subscribe, set, update } = writable<DisproveStatus | null>(null);

    return {
        subscribe,
        set,
        update,
    }
}

export const disproveStatus = createDisproveStore();
