<!-- Board.svelte -->
<script lang="ts">
    import { dynamicBoardStore, staticBoardStore } from "$lib/stores/boardStore";
    import Cell from './Cell.svelte';
    import {scenarioStore} from "$lib/stores/scenarioStore";
    import Icon from "@iconify/svelte";

    $: roomInfo = staticBoardStore.getRoomInfo();

    function getRoomPosition(roomName: string) {
        const info = roomInfo[roomName];
        if (!info) return null;

        const centerX = (info.minX + info.maxX) / 2;
        const centerY = (info.minY + info.maxY) / 2;

        return {
            left: `${centerX * 20}px`,
            top: `${centerY * 20}px`
        };
    }
</script>

<div class="board-container">
    <div class="board">
        {#each $staticBoardStore.mapMatrix as row, y}
            <div class="row">
                {#each row as cell, x}
                    <Cell {cell} />
                {/each}
            </div>
        {/each}
        {#each Object.entries(roomInfo) as [roomName, info]}
            {@const position = getRoomPosition(roomName)}
            {#if position}
                {@const roomId = $scenarioStore.scenario.rooms[roomName]?.id}
                <div class="room-name" style="left: {position.left}; top: {position.top};">
                    {roomName}
                    <div class="flex">
                        {#each $dynamicBoardStore.suspects.filter(s => s.roomId === roomId) as suspect}
                            {@const suspectInfo = $scenarioStore.scenario.suspects.find(s => s.id === suspect.id)}
                            <div class="border-2 border-foreground p-1 bg-background">
                                <Icon icon="@local:pixelated:avatar" color={suspectInfo.color}/>
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