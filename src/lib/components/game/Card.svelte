<script lang="ts">
    import Icon from "@iconify/svelte";
    import {scenarioStore} from "$lib/stores/scenarioStore";
    import {get} from "svelte/store";
    import {disproveStatus} from "$lib/stores/hypothesisStore";
    import {socketStore} from "$lib/stores/websocketStore";

    export let card: {id: string, type: 'Room' | 'Weapon' | 'Suspect', name: string}

    // si cést un suspet, récupérer la couleur
    $: suspect = card.type === 'Suspect' ? get(scenarioStore).scenario.suspects.find(s => s.id === card.id) : null;

    function handleClick() {
        if (!$disproveStatus) return;

        const {weaponId, suspectId, roomId} = $disproveStatus

        if ([weaponId, suspectId, roomId].includes(card.id)) {
            socketStore.emit('disproveHypothesis', {
                assumptionId: $disproveStatus.assuptionId,
                cardId: card.id
            })
        }
    }
</script>

<div class="border-2 border-foreground w-32 h-48 bg-background grid grid-cols-1 grid-rows-[auto_1.5em_0.5em] hover:z-50 hover:-translate-y-10" onclick={handleClick}>
    <div class="flex flex-col items-center text-center px-2">
        {#if card.type === 'Suspect'}
            <Icon icon="@local:pixelated:avatar" color={suspect.color} width="5em"/>
        {:else if card.type === 'Weapon'}
            <Icon icon="@local:pixelated:sword" width="5em" class="pt-2"/>
        {/if}
        {card.name}
    </div>
    <div class="bg-foreground text-primary-foreground text-center">
        {card.type}
    </div>
</div>