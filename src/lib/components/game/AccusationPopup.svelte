<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { scenarioStore } from '$lib/stores/scenarioStore';
    import { socketStore } from "$lib/stores/websocketStore";
    import { Button } from "$lib/components/ui/button";
    import { GameEvents } from "$lib/event-constants";

    export let show = false;

    const dispatch = createEventDispatcher();

    let selectedRoom: string = '';
    let selectedSuspect: string = '';
    let selectedWeapon: string = '';

    $: rooms = $scenarioStore.scenario ? $scenarioStore.scenario.rooms : [];
    $: suspects = $scenarioStore.scenario ? $scenarioStore.scenario.suspects : [];
    $: weapons = $scenarioStore.scenario ? $scenarioStore.scenario.weapons : [];

    function handleSubmit() {
        socketStore.emit(GameEvents.MAKE_ASSUPMTION, {
            roomId: selectedRoom,
            suspectId: selectedSuspect,
            weaponId: selectedWeapon,
            type: 'accusation',
        });
        close();
    }

    function close() {
        dispatch('close');
    }
</script>

{#if show}
    <div class="popup-overlay">
        <div class="popup-content">
            <h2>Faire une accusation</h2>
            <form on:submit|preventDefault={handleSubmit}>
                <div class="form-group">
                    <label for="room">Salle :</label>
                    <select id="room" class="bg-background" bind:value={selectedRoom}>
                        <option value="">Choisissez une salle</option>
                        {#each rooms as room}
                            <option value={room.id}>{room.name}</option>
                        {/each}
                    </select>
                </div>

                <div class="form-group">
                    <label for="suspect">Suspect :</label>
                    <select id="suspect" class="bg-background" bind:value={selectedSuspect}>
                        <option value="">Choisissez un suspect</option>
                        {#each suspects as suspect}
                            <option value={suspect.id}>{suspect.name}</option>
                        {/each}
                    </select>
                </div>

                <div class="form-group">
                    <label for="weapon">Arme :</label>
                    <select id="weapon" class="bg-background" bind:value={selectedWeapon}>
                        <option value="">Choisissez une arme</option>
                        {#each weapons as weapon}
                            <option value={weapon.id}>{weapon.name}</option>
                        {/each}
                    </select>
                </div>

                <div class="button-group">
                    <Button type="submit" disabled={!selectedRoom || !selectedSuspect || !selectedWeapon}>
                        Faire l'accusation
                    </Button>
                    <Button type="button" on:click={close}>Annuler</Button>
                </div>
            </form>
        </div>
    </div>
{/if}

<style>
    .popup-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .popup-content {
        background-color: black;
        border: 1px solid white;
        padding: 2rem;
        width: 90%;
        max-width: 500px;
    }

    h2 {
        margin-bottom: 1rem;
    }

    .form-group {
        margin-bottom: 1rem;
    }

    label {
        display: block;
        margin-bottom: 0.5rem;
    }

    select {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    .button-group {
        display: flex;
        justify-content: space-between;
        margin-top: 1rem;
    }
</style>