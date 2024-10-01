import {get, writable} from 'svelte/store';
import type {Scenario} from "$lib";

interface ScenarioState {
    scenario: Scenario | null;
    isLoading: boolean;
    error: string | null;
}

function createScenarioStore() {
    const { subscribe, set, update } = writable<ScenarioState>({
        scenario: null,
        isLoading: false,
        error: null,
    });


    return {
        subscribe,
        setScenario: (scenario: Scenario) => {
            console.log(scenario)
            update(state => ({ ...state, scenario, isLoading: false, error: null }))
        },
        clearScenario: () => update(state => ({ ...state, scenario: null })),
        setLoading: (isLoading: boolean) => update(state => ({ ...state, isLoading })),
        setError: (error: string) => update(state => ({ ...state, error, isLoading: false })),
        reset: () => set({ scenario: null, isLoading: false, error: null }),
        getSuspect: (suspectId: string) => {
            const state = get({subscribe})
            return state.scenario.suspects.find(s => s.id === suspectId);
        }
    };
}

export const scenarioStore = createScenarioStore();