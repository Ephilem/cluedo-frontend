import { get, writable } from 'svelte/store';
import type { InstanciatedScenario, MapCell, Position } from "$lib/types";
import { socketStore } from "$lib/stores/websocketStore";
import type { InstantiatedScenarioPayload } from "$lib/event-constants";

interface ScenarioState {
    scenario: InstanciatedScenario | null;
}

function createScenarioStore() {
    const { subscribe, set, update } = writable<ScenarioState>({
        scenario: null,
    }, () => {
        socketStore.on('instantiatedScenario', handleReceivedScenario);
        return () => {
            socketStore.off('instantiatedScenario', handleReceivedScenario);
            console.log('Scenario store unsubscribed');
        };
    });

    function handleReceivedScenario({ scenario }: InstantiatedScenarioPayload) {
        console.log('handleReceivedScenario', scenario);
        update(state => ({ ...state, scenario }));
    }

    function getAdjacentCells(position: Position): MapCell[] {
        const [x, y] = position;
        const { mapCells } = get({ subscribe }).scenario;

        const adjacentPositions = [
            [x - 1, y], // left
            [x, y - 1], // top
            [x + 1, y], // right
            [x, y + 1]  // bottom
        ];

        return adjacentPositions
            .filter(([adjX, adjY]) => adjX >= 0 && adjX < mapCells.length && adjY >= 0 && adjY < mapCells[0].length)
            .map(([adjX, adjY]) => mapCells[adjY][adjX]);
    }

    function getDiagonalAdjacentCells(position: Position): MapCell[] {
        const [x, y] = position;
        const state = get({ subscribe });
        const { mapCells } = state.scenario;

        const diagonalPositions = [
            [x - 1, y - 1], // top-left
            [x + 1, y - 1], // top-right
            [x - 1, y + 1], // bottom-left
            [x + 1, y + 1]  // bottom-right
        ];

        return diagonalPositions
            .filter(([x, y]) => x >= 0 && x < mapCells.length && y >= 0 && y < mapCells[0].length)
            .map(([x, y]) => mapCells[x][y]);
    }

    function getAllAdjacentCells(position: Position): MapCell[] {
        return [...getAdjacentCells(position), ...getDiagonalAdjacentCells(position)];
    }

    return {
        subscribe,
        clearScenario: () => update(state => ({ ...state, scenario: null })),
        setLoading: (isLoading: boolean) => update(state => ({ ...state, isLoading })),
        setError: (error: string) => update(state => ({ ...state, error, isLoading: false })),
        getSuspect: (suspectId: string) => {
            const state = get({ subscribe })
            return state.scenario.suspects.find(s => s.id === suspectId);
        },
        getAdjacentCells,
        getDiagonalAdjacentCells,
        getAllAdjacentCells,
    };
}

export const scenarioStore = createScenarioStore();