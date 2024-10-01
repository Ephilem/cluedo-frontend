<script lang="ts">

    import {playerStore} from "$lib/stores/playerStore";
    import {get} from "svelte/store";
    import Icon from "@iconify/svelte";
    import {scenarioStore} from "$lib/stores/scenarioStore";

    export let userId;



    $: user = $playerStore.players.filter(p => p.id === userId)[0]


</script>

{#if user}
    <span class="inline flex items-center gap-x-1">
        {#if user.isHost}
            <Icon icon="mdi:crown" class="text-warning"/>
        {/if}
        {#if user.playAs}
            <Icon icon="@local:pixelated:avatar" color={user.playAs.color}/>
        {/if}
        {user.username}
    </span>
{/if}