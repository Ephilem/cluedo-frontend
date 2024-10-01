<script lang="ts">
    import {playerStore} from "$lib/stores/playerStore";
    import {gameStore} from "$lib/stores/gameStore";
    import TurnCard from "$lib/components/game/TurnCard.svelte";
    import Icon from "@iconify/svelte";

    export let displayCount = 3; // Nombre de joueurs à afficher de chaque côté

    $: playerOrder = $gameStore.playerOrder;
    $: currentPlayerTurnId = $gameStore.currentPlayerTurnId;

    $: currentPlayerIndex = playerOrder.findIndex(id => id === currentPlayerTurnId);

    $: previousPlayers = Array.from({ length: displayCount }, (_, i) => {
        const index = (currentPlayerIndex - i - 1 + playerOrder.length) % playerOrder.length;
        return playerOrder[index];
    }).reverse();

    $: nextPlayers = Array.from({ length: displayCount }, (_, i) => {
        const index = (currentPlayerIndex + i + 1) % playerOrder.length;
        return playerOrder[index];
    });

    $: console.log("currentplayer", currentPlayerTurnId);
</script>

<div class="flex justify-center items-end gap-x-1">
    <div class="flex py-1">
        {#each previousPlayers as playerId}
            <TurnCard {playerId} />
            <div class="flex items-center">
                <Icon icon="mdi:chevron-right" width="24px"/>
            </div>
        {/each}
    </div>

    <div>
        <h2 class="font-bold">tour de </h2>
        <TurnCard playerId={currentPlayerTurnId} itsTurn />
    </div>

    <div class="flex py-1">
        {#each nextPlayers as playerId}
            <div class="flex items-center">
                <Icon icon="mdi:chevron-right" width="24px"/>
            </div>
            <TurnCard {playerId} />
        {/each}
    </div>
</div>

<style>
    .player-card {
        @apply border border-gray-300 rounded-md p-2 w-24 text-center text-sm flex flex-col;
    }
</style>