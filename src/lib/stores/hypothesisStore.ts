// assumptionStore.ts
import { writable, derived, get } from 'svelte/store';
import { socketStore } from './websocketStore';
import {GameEvents, type MakeAssumptionPayload, type NeedToDisproveAssumptionPayload} from '$lib/event-constants';
import type {AssumptionInfo, Card} from "$lib/types";


interface AssumptionState {
    assumptions: AssumptionInfo[];
    assumptionToDisprove: AssumptionInfo | null;
}

function createAssumptionStore() {
    const { subscribe, update, set } = writable<AssumptionState>({
        assumptions: [],
        assumptionToDisprove: null
    }, () => {
        console.log('Assumption store started');
    });

    subscribe(store => {
        console.log('Assumption store updated', store);
    })


    return {
        subscribe,
        addAssumption: (assumption: AssumptionInfo) => update(store => ({
            ...store,
            assumptions: [...store.assumptions, assumption]
        })),
        setAssumptionToDisprove: (assumption: AssumptionInfo | null) => update(store => ({
            ...store,
            assumptionToDisprove: assumption || null
        })),
        reset: () => set({ assumptions: [], assumptionToDisprove: null }),
        getAssumptionById: (assumptionId: string): AssumptionInfo | undefined => {
            const store = get({ subscribe });
            return store.assumptions.find(a => a.id === assumptionId);
        },
        setAssumptions: (assumptions: AssumptionInfo[]) => update(store => ({
            ...store,
            assumptions
        }))
    };
}

export const assumptionStore = createAssumptionStore();

// Derived stores
export const hypotheses = derived(assumptionStore, $assumptionStore =>
    $assumptionStore.assumptions.filter(a => a.type === 'hypothesis')
);

export const accusations = derived(assumptionStore, $assumptionStore =>
    $assumptionStore.assumptions.filter(a => a.type === 'accusation')
);

export const currentAssumptionToDisprove = derived(assumptionStore, $assumptionStore =>
    $assumptionStore.assumptionToDisprove
);