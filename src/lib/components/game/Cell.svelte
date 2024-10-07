<script lang="ts">
    import type { MapCell, SuspectNode } from "$lib/types";
    import Icon from "@iconify/svelte";
    import { scenarioStore } from "$lib/stores/scenarioStore";
    import { getContext } from "svelte";
    import {playerMe, playerStore} from "$lib/stores/playerStore";
    import { socketStore } from "$lib/stores/websocketStore";
    import { boardStore } from "$lib/stores/boardStore";
    import {get} from "svelte/store";
    import {gameStore} from "$lib/stores/gameStore";
    import {GameEvents, type SuspectPosition} from "$lib/event-constants";

    export let cell: MapCell;
    export let suspect: SuspectNode | undefined;
    let position: [number, number] = cell.position;

    function getCellStyle(): string {
        let style = "";
        if (cell.cellType === "wall") {
            style += "background-color: var(--foreground-color);";
        } else if (cell.cellType === "room") {
            let cellColor = cell.color;
            let gradientStyle = '';

            // Vérifier les cellules adjacentes pour la bordure et les portes
            const adjacentCells = scenarioStore.getAdjacentCells(position);
            const borderStyle = "3px solid white;"; // Bordure épaisse blanche

            let borderTop = false, borderRight = false, borderBottom = false, borderLeft = false;

            adjacentCells.forEach((adjCell, index) => {
                if (adjCell.roomName !== cell.roomName) {
                    switch(index) {
                        case 0: borderLeft = true; break;
                        case 1: borderTop = true; break;
                        case 2: borderRight = true; break;
                        case 3: borderBottom = true; break;
                    }
                }
                // Créer un gradient si adjacent à une porte de la même salle
                if (adjCell.cellType === "door" && adjCell.roomName === cell.roomName) {
                    const doorColor = adjCell.color;
                    switch(index) {
                        case 0: gradientStyle = `linear-gradient(to right, ${doorColor} 0%, ${cell.color} 100%)`; break;
                        case 1: gradientStyle = `linear-gradient(to bottom, ${doorColor} 0%, ${cell.color} 100%)`; break;
                        case 2: gradientStyle = `linear-gradient(to left, ${doorColor} 0%, ${cell.color} 100%)`; break;
                        case 3: gradientStyle = `linear-gradient(to top, ${doorColor} 0%, ${cell.color} 100%)`; break;
                    }
                }
            });

            if (gradientStyle) {
                style += `background: ${gradientStyle};`;
            } else {
                style += `background-color: ${cellColor};`;
            }
            style += `border-top: ${borderTop ? borderStyle : 'none'};`;
            style += `border-right: ${borderRight ? borderStyle : 'none'};`;
            style += `border-bottom: ${borderBottom ? borderStyle : 'none'};`;
            style += `border-left: ${borderLeft ? borderStyle : 'none'};`;

        } else {
            style += "border: 1px solid white;";
        }
        return style;
    }

    // Commenté car nous n'avons pas encore implémenté le dynamicBoardStore équivalent
    // let suspect = null;
    // $: dynamicBoardStore.subscribe(state => {
    //     suspect = dynamicBoardStore.getSuspectAtPosition(position)
    // })
    // $: suspectInfo = suspect ? scenarioStore.getSuspect(suspect.id) : null;

    function handleClick() {
        const currentPlayer = get(playerMe);
        if (!currentPlayer || !currentPlayer.playAs) return;

        const currentSuspect = get(scenarioStore).scenario.suspects.find(s => s.name === currentPlayer.playAs.name);
        if (!currentSuspect) return;

        const currentPosition = boardStore.getSuspectPosition(currentSuspect.id);
        if (!currentPosition) return;

        const isPlayerTurn = get(gameStore).currentPlayerTurnId === currentPlayer.id;
        if (!isPlayerTurn) return;

        const movesLeft = currentPlayer.numberOfMoveLeft;
        if (movesLeft <= 0) return;

        let targetPosition: SuspectPosition;

        // Si le suspect est dans une salle et clique sur une porte
        if (typeof currentPosition === 'string' && cell.cellType === 'door' && cell.roomName === currentPosition) {
            // console.log('Move to door', position);
            targetPosition = position;
        }
        // Si le suspect est sur le plateau
        else if (Array.isArray(currentPosition)) {
            // console.log('Move to empty cell', position);
            const [currentX, currentY] = currentPosition;
            const [targetX, targetY] = position;
            const dx = Math.abs(currentX - targetX);
            const dy = Math.abs(currentY - targetY);
            const isAdjacent = (dx === 1 && dy === 0) || (dx === 0 && dy === 1);

            if (!isAdjacent) return;

            if (['empty', 'door'].includes(cell.cellType)) {
                targetPosition = position;
            } else if (cell.cellType === "room") {
                targetPosition = cell.roomName;
            } else {
                return; // Ne peut pas se déplacer sur un mur
            }
        } else {
            return; // Position actuelle invalide
        }

        // Envoyer l'événement de déplacement
        socketStore.emit(GameEvents.MOVE_SUSPECT, {
            suspectId: currentSuspect.id,
            position: targetPosition
        });
    }
</script>

<div class="cell" style={getCellStyle()} on:click={handleClick}>
    {#if suspect}
        <span class="suspect">
            <Icon icon="mdi:user" color={suspect.color}/>
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