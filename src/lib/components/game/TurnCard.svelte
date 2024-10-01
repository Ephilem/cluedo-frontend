<script lang="ts">
    import {playerStore} from "$lib/stores/playerStore";
    import PlayerUsername from "$lib/components/PlayerUsername.svelte";

    export let playerId;
    export let itsTurn = false;

    $: player = $playerStore.players?.find(player => player.id === playerId);
</script>

{#if player}


<div class={`p-2 border-2 border-foreground w-32 ${itsTurn ? "text-2xl w-48 bg-foreground text-primary-foreground" : ""}`}>
    <PlayerUsername userId={playerId} />
</div>
{/if}