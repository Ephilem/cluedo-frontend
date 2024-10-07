<!-- Board.svelte -->
<script lang="ts">
    import Cell from './Cell.svelte';
    import { scenarioStore } from "$lib/stores/scenarioStore";
    import { boardStore } from "$lib/stores/boardStore";
    import type { MapCell, RoomNode, SuspectNode } from "$lib/types";
    import Icon from "@iconify/svelte";
    import type {SuspectPosition, SuspectPositionInRoom} from "$lib/event-constants";

    $: scenario = $scenarioStore.scenario;
    $: mapCells = scenario?.mapCells || [];
    $: rooms = scenario?.rooms || [];
    $: suspects = scenario?.suspects || [];
    $: suspectPositions = $boardStore.suspectPositions;

    function getRoomPosition(room: RoomNode): { left: string; top: string } | null {
        if (!mapCells.length) return null;

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

        mapCells.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell.roomName === room.name) {
                    minX = Math.min(minX, x);
                    minY = Math.min(minY, y);
                    maxX = Math.max(maxX, x);
                    maxY = Math.max(maxY, y);
                }
            });
        });

        if (minX === Infinity) return null;

        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;

        return {
            left: `${centerX * 20}px`,
            top: `${centerY * 20}px`
        };
    }

    function getSuspectsInRoom(roomName: string): SuspectNode[] {
        return suspects.filter(suspect => suspectPositions[suspect.id] === roomName);
    }
</script>

<div class="board-container">
    <div class="board">
        {#each mapCells as row, y}
            <div class="row">
                {#each row as cell, x}
                    <Cell {cell} suspect={suspects.find(s => suspectPositions[s.id] && suspectPositions[s.id][0] === x && suspectPositions[s.id][1] === y)} />
                {/each}
            </div>
        {/each}
        {#each rooms as room}
            {@const position = getRoomPosition(room)}
            {#if position}
                <div class="room-name" style="left: {position.left}; top: {position.top};">
                    {room.name}
                    <div class="flex">
                        {#each getSuspectsInRoom(room.name) as suspect}
                            <div class="border-2 border-foreground p-1 bg-background">
                                <Icon icon="mdi:user" color={suspect.color}/>
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}
        {/each}
    </div>
</div>


<style>
    .board-container {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: auto;
        position: relative;
    }

    .board {
        display: inline-block;
        position: relative;
    }

    .row {
        white-space: nowrap;
        font-size: 0;
    }

    .room-name {
        position: absolute;
        transform: translate(-50%, -50%);
        font-size: 14px;
        font-weight: bold;
        color: #333;
        pointer-events: none;
        text-shadow:
                -1px -1px 0 #fff,
                1px -1px 0 #fff,
                -1px 1px 0 #fff,
                1px 1px 0 #fff;
    }
</style>