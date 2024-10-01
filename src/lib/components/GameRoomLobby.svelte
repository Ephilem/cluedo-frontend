<script lang="ts">
    import { socketStore } from "$lib/stores/websocketStore";
    import { playerStore } from "$lib/stores/playerStore";
    import PlayerUsername from "$lib/components/PlayerUsername.svelte";
    import { gameStore } from "$lib/stores/gameStore";
    import { scenarioStore } from "$lib/stores/scenarioStore";
    import type { Suspect } from "$lib";
    import { derived } from "svelte/store";
    import { Button } from "$lib/components/ui/button";
    import Icon from "@iconify/svelte";

    export let gameRoomId: string;
    export let username: string;

    $: playerNumber = $playerStore.players.length;
    $: suspects = $scenarioStore.scenario?.suspects;
    $: takenSuspects = $playerStore.players.filter(p => p.playAs).map(p => p.playAs.id);

    $: currentPlayer = derived(
        [playerStore, gameStore],
        ([$playerStore, $gameStore]) => $playerStore.players.find(p => p.username === $gameStore.playingAs)
    );

    $: hasSelectedSuspect = $currentPlayer && $currentPlayer.playAs !== null;
    $: isHost = $currentPlayer && $currentPlayer.isHost;
    $: allPlayersReady = $playerStore.players.every(player => player.ready);

    $: emptySlots = Math.max(0, suspects ? suspects.length - playerNumber : 0);

    function selectSuspect(s: Suspect) {
        if (takenSuspects.includes(s.id)) return;
        socketStore.emit('selectSuspect', s.id);
    }

    function toggleReady() {
        socketStore.emit('setReady', !$currentPlayer.ready);
    }

    function startGame() {
        socketStore.emit('startGame', {});
    }
</script>

<div class="flex flex-col items-center gap-y-5">
    <h2 class="font-bold">joueurs connectes</h2>
    {#each $playerStore.players as player}
        <div class="grid border-b-2 border-foreground w-full grid-rows-1 grid-cols-2 items-center gap-y-1">
            <PlayerUsername userId={player.id} />
            <div class="place-self-end">
                {#if player.ready}
                    <div class="text-primary-foreground bg-foreground px-2">
                        READY
                    </div>
                {/if}
            </div>
        </div>
    {/each}

    {#each Array(emptySlots) as _, i}
        <div class="grid border-b-2 border-muted-foreground w-full grid-rows-1 grid-cols-2 items-center gap-y-1 opacity-50">
            <div class="text-foreground/50">Slot vide</div>
        </div>
    {/each}

    {#if suspects}
        <div class="flex gap-4 flex-wrap justify-center">
            {#each suspects as s}
                <div class={`border-2 w-28 text-center border-foreground p-2  ${takenSuspects.includes(s.id) ? "opacity-50 cursor-not-allowed" : "hover:bg-foreground hover:text-primary-foreground"}`}
                     role="button" on:click={() => selectSuspect(s)}
                     tabindex="-1" on:keydown={() => selectSuspect(s)}>
                    <Icon icon="@local:pixelated:avatar" class="mx-auto" width="3em" color={s.color}/>
                    {s.name}
                </div>
            {/each}
        </div>
    {/if}

    {#if $currentPlayer && $currentPlayer.playAs}
        <Button on:click={toggleReady} class={$currentPlayer.ready ? "bg-destructive hover:opacity-90" : "bg-success hover:opacity-90"}>
            {$currentPlayer.ready ? "Pas Prêt" : "Prêt"}
        </Button>
    {/if}

    {#if isHost}
        <Button on:click={startGame} class="bg-primary hover:bg-primary-hover" disabled={!allPlayersReady || playerNumber < 2}>
            Lancer le jeu
        </Button>
    {/if}
</div>