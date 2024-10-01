<script lang="ts">
    import Logo from "$lib/components/Logo.svelte";
    import TurnVisualizer from "$lib/components/game/TurnVisualizer.svelte";
    import CardsDeck from "$lib/components/game/CardsDeck.svelte";
    import Board from "$lib/components/game/Board.svelte";
    import {Button} from "$lib/components/ui/button";
    import {getContext, setContext} from "svelte";
    import {writable} from "svelte/store";
    import {gameStore, updaterNextTurn} from "$lib/stores/gameStore";
    import {playerStore} from "$lib/stores/playerStore";
    import {dynamicBoardStore} from "$lib/stores/boardStore";
    import {socketStore} from "$lib/stores/websocketStore";
    import MakeHypothesis from "$lib/components/game/MakeHypothesis.svelte";
    import {findRoomNameById} from "$lib/utils";
    import {scenarioStore} from "$lib/stores/scenarioStore";
    import {disproveStatus} from "$lib/stores/hypothesisStore";
    import DisproveStatus from "$lib/components/game/DisproveStatus.svelte";

    export let gameRoomId: string;
    export let username: string;

    let playerSuspetRoomId = null;

    $: playerUserId = $playerStore.players.find(p => p.username).id;

    $: playerSuspetRoomId = $dynamicBoardStore.suspects.find(s => s.id === $playerStore.players.find(p => p.username === username)?.playAs?.id)?.roomId
    $: playerSuspetRoomName = findRoomNameById($scenarioStore.scenario.rooms, playerSuspetRoomId)

    const { diceResult, canHypothesis } = setContext('turnContext', {
        diceResult: writable(-1),
        canHypothesis: writable(playerSuspetRoomId === null),
        username,
        gameRoomId
    })

    function rollDice() {
        const die1 = Math.floor(Math.random() * 6) + 1;
        const die2 = Math.floor(Math.random() * 6) + 1;
        const total = die1 + die2;

        diceResult.set(total);

        console.log(total)
    }

    $:console.log("sdfsdfoksdfoeihu ewrghusduifh", playerSuspetRoomId, $canHypothesis);

    $: if ($updaterNextTurn && $diceResult === 0) {
        console.log("IOSJFDKIOSDJFIOSDJFOIJESIOFHSUIFHUIH")
        $diceResult = -1;

        // verify if he start in a room
        $canHypothesis = (playerSuspetRoomId !== null);
    }

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

    <div class="col-span-2 border-b-4">
        <Board/>
    </div>

    <div class="row-span-2 border-l-4 p-2">
        {#if yourTurn}
            <Button disabled={$diceResult !== -1} onclick={rollDice}>
                Lancer les dés
            </Button>
            <p>Résultat : {$diceResult}</p>
            {#if playerSuspetRoomId !== null && !$gameStore.hasHypothesed}
                <MakeHypothesis roomId={playerSuspetRoomId} roomName={playerSuspetRoomName} />
            {/if}

            <Button disabled={$diceResult > 0 && !$canHypothesis && !$disproveStatus} onclick={nextTurn}>
                Finir le tour
            </Button>
        {/if}

        {#if $disproveStatus && playerUserId && playerUserId !== $disproveStatus.playerId}
            <DisproveStatus disproveData={$disproveStatus} />
        {/if}
    </div>

    <div class="col-span-2">
        <CardsDeck />
    </div>

</div>

<style>
    .main-grid > div {
        @apply border-foreground;
    }
</style>