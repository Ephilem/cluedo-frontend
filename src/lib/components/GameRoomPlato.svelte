<script lang="ts">
    import Logo from "$lib/components/Logo.svelte";
    import TurnVisualizer from "$lib/components/game/TurnVisualizer.svelte";
    import CardsDeck from "$lib/components/game/CardsDeck.svelte";
    import Board from "$lib/components/game/Board.svelte";
    import {Button} from "$lib/components/ui/button";
    import {getContext, setContext} from "svelte";
    import {writable} from "svelte/store";
    import {gameStore, updaterNextTurn} from "$lib/stores/gameStore";
    import {playerMe, playersNeedToDisprove, playerStore} from "$lib/stores/playerStore";
    import {socketStore} from "$lib/stores/websocketStore";
    import MakeHypothesis from "$lib/components/game/MakeHypothesis.svelte";
    import {findRoomNameById} from "$lib/utils";
    import {scenarioStore} from "$lib/stores/scenarioStore";
    import DisproveStatus from "$lib/components/game/DisproveStatus.svelte";
    import Icon from "@iconify/svelte";
    import {GameEvents} from "$lib/event-constants";
    import {boardStore} from "$lib/stores/boardStore";
    import {currentAssumptionToDisprove} from "$lib/stores/hypothesisStore";
    import PlayerUsername from "$lib/components/PlayerUsername.svelte";
    import HypothesisList from "$lib/components/game/HypothesisList.svelte";

    export let gameRoomId: string;
    export let username: string;

    let playerSuspetRoomId = null;

    $: playerUserId = $playerStore.players.find(p => p.username).id;
    $: playerSuspect = $scenarioStore.scenario ? $scenarioStore.scenario.suspects.find(s => s.name === $playerStore.players.find(p => p.username === username)?.playAs?.name) : null
    $: playerSuspectPosition = playerSuspect ? $boardStore.suspectPositions[playerSuspect.id] : null

    // $: playerSuspetRoomId = $dynamicBoardStore.suspects.find(s => s.id === $playerStore.players.find(p => p.username === username)?.playAs?.id)?.roomId
    // $: playerSuspetRoomName = findRoomNameById($scenarioStore.scenario.rooms, playerSuspetRoomId)

    const { diceResult, canHypothesis } = setContext('turnContext', {
        diceResult: writable(-1),
        canHypothesis: writable(playerSuspetRoomId === null),
        username,
        gameRoomId
    })

    function rollDice() {
        // const die1 = Math.floor(Math.random() * 6) + 1;
        // const die2 = Math.floor(Math.random() * 6) + 1;
        // const total = die1 + die2;
        //
        // diceResult.set(total);
        //
        // console.log(total)

        socketStore.emit(GameEvents.THROW_DICES, {gameRoomId})
    }

    $:console.log("sdfsdfoksdfoeihu ewrghusduifh", playerSuspetRoomId, $canHypothesis);

    $: yourTurn = $gameStore.currentPlayerTurnId === $playerStore.players.find(p => p.username == username)?.id

    function nextTurn() {
        socketStore.emit('endTurn', {})
    }

</script>

<div class="w-full h-full grid grid-rows-[1fr_6fr_3fr] grid-cols-[auto_8fr_4fr] main-grid" >
    <!-- logo -->
    <div class="border-b-4 flex items-center">
        <Logo small />
    </div>

    <div class="col-span-2 border-b-4 flex items-center justify-center">
        <TurnVisualizer displayCount={2} />
    </div>

    <div class="col-span-2 border-b-4 relative">
        <div class="absolute top-0 right-0 m-2 font-silkscreen font-bold text-right">
            {#if $playerMe.numberOfMoveLeft > 0}
                <p>Il vous reste <br />{$playerMe.numberOfMoveLeft} mouvements</p>
            {/if}
        </div>
        <Board/>
    </div>

    <div class="row-span-2 border-l-4 p-2 grid grid-rows-[1fr_auto]">
        <div>
            {#if yourTurn}
                {#if playerSuspectPosition && !Array.isArray(playerSuspectPosition) && $playersNeedToDisprove.length === 0 && !$gameStore.hasHypothesed}
                    <MakeHypothesis roomId={playerSuspetRoomId} roomName={playerSuspectPosition} />
                {/if}
            {/if}

            {#if $playersNeedToDisprove.length > 0}
                <div class="arrg mb-3">
                    <h2 class="">Les joueurs suivants reflechissent a une refutation :</h2>
                    <div class="flex items-center flex-col flex-wrap">
                        {#each $playersNeedToDisprove as player}
                            <PlayerUsername userId={player.id} />
                        {/each}
                    </div>
                </div>
            {/if}

            {#if $currentAssumptionToDisprove && $playerMe.needToDisprove}
                <DisproveStatus disproveData={$currentAssumptionToDisprove} />
            {/if}

            <HypothesisList {gameRoomId} playerId={$playerMe.id} />
        </div>
        <div class="flex justify-between gap-x-2">
            <Button class="text-xl h-16 w-1/2 font-silkscreen font-bold" disabled={$playerMe.numberOfMoveLeft !== -1 || !yourTurn || $gameStore.hasHypothesed} onclick={rollDice}>
                <div class="flex items-center gap-x-2">
                    <Icon icon="mdi:dice" class="inline" width="2.5em" />
                    Lance les <br/>des
                </div>
            </Button>

            <Button class="text-xl h-16 w-1/2 font-silkscreen font-bold" disabled={($playerMe.numberOfMoveLeft === 0 && !$canHypothesis) || !yourTurn || $playersNeedToDisprove.length > 0} onclick={nextTurn}>
                Finir le tour
            </Button>
        </div>
    </div>

    <div class="col-span-2">
        <CardsDeck />
    </div>

</div>

<style>
    .main-grid > div {
        @apply border-foreground;
    }

    .arrg{
        padding: 1rem;
        border: 1px solid #ccc;
    }
</style>