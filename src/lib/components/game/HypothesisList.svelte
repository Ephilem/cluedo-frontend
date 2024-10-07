<script lang="ts">
    import { onMount } from 'svelte';
    import { socketStore } from "$lib/stores/websocketStore";
    import { GameEvents } from "$lib/event-constants";
    import { scenarioStore } from "$lib/stores/scenarioStore";
    import { playerStore } from "$lib/stores/playerStore";
    import Icon from "@iconify/svelte";
    import type {AssumptionInfo} from "$lib/types";
    import PlayerUsername from "$lib/components/PlayerUsername.svelte";

    export let gameRoomId: string;
    export let playerId: string;

    let hypotheses: AssumptionInfo[] = [];

    onMount(() => {
        socketStore.emit(GameEvents.GET_ASSUMPTIONS_LIST, { gameRoomId, playerId });
        socketStore.on(GameEvents.ASSUMPTIONS_LIST, handleAssumptionsList);

        return () => {
            socketStore.off(GameEvents.ASSUMPTIONS_LIST, handleAssumptionsList);
        };
    });

    function handleAssumptionsList({ assumptions }: { assumptions: AssumptionInfo[] }) {
        hypotheses = assumptions;
    }

    function getEntityName(id: string, type: 'suspect' | 'weapon' | 'room'): string {
        const scenario = $scenarioStore.scenario;
        if (!scenario) return '';

        switch (type) {
            case 'suspect':
                return scenario.suspects.find(s => s.id === id)?.name || '';
            case 'weapon':
                return scenario.weapons.find(w => w.id === id)?.name || '';
            case 'room':
                return scenario.rooms.find(r => r.id === id)?.name || '';
        }
    }

    function getPlayerName(id: string): string {
        return $playerStore.players.find(p => p.id === id)?.username || '';
    }
</script>

<div class="hypothesis-list">
    <h2 class="text-xl font-bold">Vos hypotheses</h2>
    {#if hypotheses.length === 0}
        <p class="text-center text-sm ">Aucune hypothèse n'a été faite pour le moment.</p>
    {:else}
        {#each hypotheses as hypothesis}
            <div class="hypothesis-item mb-4 p-3 border-b-foreground border-b-2">
                <div class="flex items-center justify-between">
                    <span class:line-through={hypothesis.disproved && hypothesis.disproveCardId === hypothesis.suspectId} class="flex items-center gap-x-1">
                        <Icon icon="mdi:user" inline={true} /> {getEntityName(hypothesis.suspectId, 'suspect')}
                    </span>
                    <span class:line-through={hypothesis.disproved && hypothesis.disproveCardId === hypothesis.weaponId} class="flex items-center gap-x-1">
                        <Icon icon="mdi:pistol" inline={true} class="ml-2" /> {getEntityName(hypothesis.weaponId, 'weapon')}
                    </span>
                    <span class:line-through={hypothesis.disproved && hypothesis.disproveCardId === hypothesis.roomId} class="flex items-center gap-x-1">
                        <Icon icon="mdi:door" inline={true} class="ml-2" /> {getEntityName(hypothesis.roomId, 'room')}
                    </span>
                </div>
                {#if hypothesis.disproved}
                    <p class="text-red-500 flex items-center">
                        Réfuté par <PlayerUsername userId={hypothesis.disproverPlayerId} />
                    </p>
                {:else}
                    <p class="text-green-500">Non réfuté</p>
                {/if}
            </div>
        {/each}
    {/if}
</div>

<style>
    .hypothesis-list {
        max-height: 400px;
        overflow-y: auto;
    }

    .line-through {
        text-decoration: line-through;
        opacity: 0.5;
    }
</style>