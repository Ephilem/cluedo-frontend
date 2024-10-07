<script lang="ts">
    import {cardStore} from "$lib/stores/cardStore";
    import Card from "$lib/components/game/Card.svelte";
    import {scenarioStore} from "$lib/stores/scenarioStore";

    $: cards = $cardStore.cards

</script>

{#if $scenarioStore.scenario}
    <div class="flex max-w-full h-full justify-around items-center px-6">
        {#each cards as card}
            <Card {card} />
        {/each}
    </div>
{/if}