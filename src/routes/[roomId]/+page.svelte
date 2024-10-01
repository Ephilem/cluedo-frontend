<script lang="ts">
    import type { PageData } from './$types';
    import { onMount } from "svelte";
    import { initializeGameCoordinator } from "$lib/services/gameCoordinator";
    import Logo from "$lib/components/Logo.svelte";
    import { Input } from "$lib/components/ui/input";
    import { Button } from "$lib/components/ui/button";
    import Icon from "@iconify/svelte";
    import { gameRoomTokenStore } from "$lib/stores/gameRoomToken";
    import { gameStore } from "$lib/stores/gameStore";
    import GameRoomLobby from "$lib/components/GameRoomLobby.svelte";
    import CenterRow from "$lib/components/CenterRow.svelte";
    import { socketStore } from "$lib/stores/websocketStore";
    import GameRoomPlato from "$lib/components/GameRoomPlato.svelte";

    export let data: PageData;
    $: gameRoomId = data.gameRoomId;
    let username = data.username;
    let needUsername = !!!data.username;

    onMount(() => {
        gameStore.setGameRoomId(gameRoomId);

        if (!needUsername) {
            console.log(`Initializing game coordinator for user: ${username}`);
            initWebsocket();
        } else {
            console.log('No username provided, waiting for user input');
        }
    });

    function initWebsocket() {
        const possibleToken = gameRoomTokenStore.getToken(gameRoomId, username);
        gameStore.setUsername(username);
        initializeGameCoordinator(gameRoomId, username, possibleToken);
    }

    function manuallySetUsername() {
        console.log(username);
        needUsername = false;
        initWebsocket();
    }
</script>

{#if !needUsername}
    {#if $socketStore.status === 'connected'}
        {#if $gameStore.currentPhase === 'waiting'}
            <CenterRow>
                <Logo />
                <div>
                    Game Room ID: {gameRoomId}
                    <p>Bienvenue, {username}!</p>
                </div>
                <GameRoomLobby {gameRoomId} {username} />
            </CenterRow>
        {:else if $gameStore.currentPhase === 'ongoing'}
            <GameRoomPlato {gameRoomId} {username} />
        {/if}
    {:else if $socketStore.status === 'disconnected'}
        <CenterRow>
            <Logo />
            <div>Disconnected....</div>
        </CenterRow>
    {:else if $socketStore.status === 'error'}
        <CenterRow>
            <Logo />
            <div>Error in socket....</div>
        </CenterRow>
    {/if}
{:else}
    <CenterRow>
        <Logo />
        <p>Please enter your username to join the game.</p>
        <div class="flex">
            <Input placeholder="Username" class="max-w-xs" name="username" bind:value={username} />
            <Button size="icon" disabled={username === null} on:click={manuallySetUsername}>
                <Icon icon="mdi:chevron-right" width="18px"/>
            </Button>
        </div>
    </CenterRow>
{/if}