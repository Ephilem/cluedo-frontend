<!-- HypothesisForm.svelte -->
<script lang="ts">
    import { scenarioStore } from '$lib/stores/scenarioStore';
    import {socketStore} from "$lib/stores/websocketStore";
    import {gameStore} from "$lib/stores/gameStore";

    export let roomName: string;
    export let roomId: string;

    let selectedSuspect: string = '';
    let selectedWeapon: string = '';

    $: suspects = $scenarioStore.scenario ? $scenarioStore.scenario.suspects : [];
    $: weapons = $scenarioStore.scenario ? $scenarioStore.scenario.weapons : [];

    function handleSubmit() {
        console.log('Hypothèse:', { roomName, roomId, selectedSuspect, selectedWeapon });
        socketStore.emit('createHypothesis', {
            suspectId: selectedSuspect,
            weaponId: selectedWeapon,
            roomId,
        });
        gameStore.setHasHypothesed(true);
    }
</script>

<div class="hypothesis-form">
    <h2>Formuler une hypothèse pour la salle : {roomName}</h2>

    <form on:submit|preventDefault={handleSubmit}>
        <div class="form-group">
            <label for="suspect">Suspect :</label>
            <select id="suspect"  class="bg-background" bind:value={selectedSuspect}>
                <option value="">Choisissez un suspect</option>
                {#each suspects as suspect}
                    <option value={suspect.id}>{suspect.name}</option>
                {/each}
            </select>
        </div>

        <div class="form-group">
            <label for="weapon">Arme :</label>
            <select id="weapon" class="bg-background"  bind:value={selectedWeapon}>
                <option value="">Choisissez une arme</option>
                {#each weapons as weapon}
                    <option value={weapon.id}>{weapon.name}</option>
                {/each}
            </select>
        </div>

        <button type="submit" disabled={!selectedSuspect || !selectedWeapon}>
            Formuler l'hypothèse
        </button>
    </form>
</div>

<style>
    .hypothesis-form {
        padding: 1rem;
        border: 1px solid #ccc;
        border-radius: 4px;
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

    button {
        padding: 0.5rem 1rem;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    button:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
    }
</style>