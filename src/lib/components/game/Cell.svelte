<!-- Cell.svelte -->
<script lang="ts">
    import {type BoardSuspect, staticBoardStore} from "$lib/stores/boardStore";
    import type { MapCell, GridPosition } from "$lib/stores/boardStore";
    import {dynamicBoardStore} from "$lib/stores/boardStore";
    import Icon from "@iconify/svelte";
    import {scenarioStore} from "$lib/stores/scenarioStore";
    import {getContext} from "svelte";
    import {playerStore} from "$lib/stores/playerStore";
    import {socketStore} from "$lib/stores/websocketStore";
    import type {Room} from "$lib";
    import {findRoomNameById} from "$lib/utils";

    export let cell: MapCell;
    let position: GridPosition = { x: cell.x, y: cell.y }

    function getCellStyle(): string {
        let style = "";
        if (cell.cellType === "wall") {
            style += "background-color: var(--foreground-color);";
        } else if (cell.cellType === "room") {
            const adjCells = staticBoardStore.getAdjacentCells(position)

            style += `background-color: ${cell.color}; `

        } else if (cell.cellType === "door") {
            style += `background-color: ${cell.color}; `
        } else {
            style += "border: 1px solid white;";
        }
        return style;
    }

    let suspect = null;

    $: dynamicBoardStore.subscribe(state => {
        suspect = dynamicBoardStore.getSuspectAtPosition(position)
    })

    $: suspectInfo = suspect ? scenarioStore.getSuspect(suspect.id) : null;

    function getSuspectInitial(suspect: BoardSuspect): string {
        return suspect.name.charAt(0).toUpperCase();
    }

    const {username, diceResult, canHypothesis} = getContext('turnContext')


    function handleClick() {
        const currentSuspect = $dynamicBoardStore.suspects.find(s => s.id === $playerStore.players.find(p => p.username === username)?.playAs?.id);
        if (!currentSuspect) return;

        if (currentSuspect.roomId) {
            const roomName = findRoomNameById($scenarioStore.scenario.rooms, currentSuspect.roomId);

            // Si la cellule cliquée est une porte et que le joueur a encore des déplacements
            if (cell.cellType === 'door' && $diceResult > 0 && cell.roomName === roomName) {
                socketStore.emit('moveSuspectOut', { position, suspectId: currentSuspect.id });
                $diceResult = $diceResult - 1;
                $canHypothesis = false;
            }
            return;
        }

        const currentPosition = { x: currentSuspect.position[0], y: currentSuspect.position[1] };


        const dx = Math.abs(currentPosition.x - position.x);
        const dy = Math.abs(currentPosition.y - position.y);

        const isAdjacent = (dx === 1 && dy === 0) || (dx === 0 && dy === 1);

        const currentCell = $staticBoardStore.mapMatrix[currentPosition.y][currentPosition.x];

        if (suspect && !suspect.roomId) return;

        if (isAdjacent && $diceResult > 0) {
            if (['empty', 'door'].includes(cell.cellType)) {
                socketStore.emit('moveSuspect', {position, suspectId: currentSuspect.id})
                $diceResult = $diceResult - 1;
            } else if (cell.cellType === "room" && currentCell.cellType === "door" && currentCell.roomName === cell.roomName) {
                const roomId = $scenarioStore.scenario.rooms[cell.roomName].id;

                socketStore.emit('moveSuspectIn', {roomId, suspectId: currentSuspect.id})
                $canHypothesis = true
                $diceResult = 0
            }
        }
    }
</script>

<div class="cell" style={getCellStyle()} onclick={handleClick}>
    {#if suspect && !suspect.roomId}
        <span class="suspect">
            <Icon icon="@local:pixelated:avatar" color={suspectInfo.color}/>
        </span>
    {/if}
</div>

<style>
    .cell {
        width: 20px;
        height: 20px;
        display: inline-block;
        box-sizing: border-box;
        vertical-align: top;
        position: relative;
    }

    .suspect {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-weight: bold;
        font-size: 14px;
    }
</style>