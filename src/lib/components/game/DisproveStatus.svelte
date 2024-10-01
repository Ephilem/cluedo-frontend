<script lang="ts">
    import {disproveStatus, type DisproveStatus} from "$lib/stores/hypothesisStore";
    import {playerStore} from "$lib/stores/playerStore";
    import {scenarioStore} from "$lib/stores/scenarioStore";
    import {findRoomNameById} from "$lib/utils";
    import {Button} from "$lib/components/ui/button";


    export let disproveData: DisproveStatus;

    $: playerName = $playerStore.players.find(p => p.id === disproveData.playerId).username;
    $: weaponName = $scenarioStore.scenario.weapons.find(w => w.id === disproveData.weaponId).name;
    $: suspectName = $scenarioStore.scenario.suspects.find(s => s.id === disproveData.suspectId).name;
    $: roomsName = findRoomNameById($scenarioStore.scenario.rooms, disproveData.roomId);

    function cancel() {
        disproveStatus.set(null);
    }
</script>

<div class="disrpove-text">
    {playerName} pense que le meutrié est {suspectName} qui a utiliser {weaponName} dans {roomsName}
    <Button onclick={cancel}>
        J'ai rien pour annulée
    </Button>
</div>

<style>
    .disrpove-text {
        padding: 1rem;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
</style>

