<script lang="ts">
    import {playerStore} from "$lib/stores/playerStore";
    import {scenarioStore} from "$lib/stores/scenarioStore";
    import {findRoomNameById} from "$lib/utils";
    import {Button} from "$lib/components/ui/button";
    import type {AssumptionInfo} from "$lib/types";
    import {assumptionStore} from "$lib/stores/hypothesisStore";
    import {socketStore} from "$lib/stores/websocketStore";
    import {GameEvents} from "$lib/event-constants";
    import PlayerUsername from "$lib/components/PlayerUsername.svelte";


    export let disproveData: AssumptionInfo;

    $: playerName = $playerStore.players.find(p => p.id === disproveData.playerId).username;
    $: weaponName = $scenarioStore.scenario.weapons.find(w => w.id === disproveData.weaponId).name;
    $: suspectName = $scenarioStore.scenario.suspects.find(s => s.id === disproveData.suspectId).name;
    $: roomsName = $scenarioStore.scenario.rooms.find(r => r.id === disproveData.roomId).name;

    function cancel() {
        socketStore.emit(GameEvents.DISPROVE_HYPOTHESIS, {
            card: null,
            assumptionId: disproveData.id
        });

        assumptionStore.setAssumptionToDisprove(null);

    }
</script>

<div class="disrpove-text">
    <h2 ><PlayerUsername userId={disproveData.playerId} /> a fait l'hypothese suivante</h2>
    <div class="">
        " Je pense que c'est <strong>{suspectName}</strong> avec <strong>{weaponName}</strong> dans <strong>{roomsName}</strong> "
    </div>
    <div>
        Cliquer sur une carte possible pour contredire
    </div>
    <div class="flex justify-end">
        <Button onclick={cancel}>
            J'ai rien pour contredire
        </Button>
    </div>
</div>

<style>
    .disrpove-text {
        padding: 1rem;
        border: 1px solid #ccc;
    }
</style>

