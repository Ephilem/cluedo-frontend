<script lang="ts">
    import Icon from "@iconify/svelte";
    import {scenarioStore} from "$lib/stores/scenarioStore";
    import {get} from "svelte/store";
    import {socketStore} from "$lib/stores/websocketStore";
    import {assumptionStore, currentAssumptionToDisprove} from "$lib/stores/hypothesisStore";
    import {playerMe} from "$lib/stores/playerStore";
    import {GameEvents} from "$lib/event-constants";

    export let card: {id: string, type: 'Room' | 'Weapon' | 'Suspect', name: string}

    // si c'est un suspect, récupérer la couleur
    $: suspect = card.type === 'Suspect' && $scenarioStore ? $scenarioStore.scenario.suspects.find(s => s.id === card.id) : null;

    $: canDisprove = $currentAssumptionToDisprove ?
        [
            $currentAssumptionToDisprove.weaponId,
            $currentAssumptionToDisprove.suspectId,
            $currentAssumptionToDisprove.roomId
        ].includes(card.id) :
        true;

    function handleClick() {
        if (!$currentAssumptionToDisprove || !canDisprove) return;

        socketStore.emit(GameEvents.DISPROVE_HYPOTHESIS, {
            card: card as any,
            assumptionId: $currentAssumptionToDisprove.id
        });

        assumptionStore.setAssumptionToDisprove(null);
    }
</script>

<div
        class="border-2 border-foreground w-32 h-48 bg-background grid grid-cols-1 grid-rows-[auto_1.5em_0.5em] hover:z-50 hover:-translate-y-10 transition-transform duration-200"
        class:opacity-50={$currentAssumptionToDisprove && !canDisprove}
        on:click={handleClick}
>
    <div class="flex flex-col items-center text-center px-2">
        {#if card.type === 'Suspect'}
            <Icon icon="mdi:user" color={suspect?.color} width="4em"/>
        {:else if card.type === 'Weapon'}
<!--            <Icon icon="@local:pixelated:sword" width="5em" class="pt-2"/>-->
            <Icon icon="mdi:pistol" inline={true} width="4em" />
        {:else if card.type === 'Room'}
            <Icon icon="mdi:door" inline={true} width="4em" />
        {/if}
        {card.name}
    </div>
    <div class="bg-foreground text-primary-foreground text-center">
        {card.type}
    </div>
</div>