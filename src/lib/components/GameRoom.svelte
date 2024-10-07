<script lang="ts">

    import Icon from "@iconify/svelte";
    import {Button} from "$lib/components/ui/button";

    let { onDelete, gameRoom }: any = $props();



</script>

<div class="border-foreground border-4 p-2 w-full grid grid-cols-2 grid-rows-2">
    <h2 class="font-bold">{gameRoom.name}</h2>
    <div class="flex justify-end items-baseline">
        {gameRoom.numberOfPlayers}
        <Icon icon="mdi:user" />
    </div>
    <div>
        Status: {gameRoom.status}
    </div>
    <div class="place-self-end">
        <Button size="icon" href={gameRoom.id}>
            <Icon icon="mdi:chevron-right" width="18px" />
        </Button>
        <Button variant="destructive" size="icon" onclick={(e) => onDelete(gameRoom.id)}>
            <Icon icon="mdi:delete" width="18px" />
        </Button>
    </div>
</div>