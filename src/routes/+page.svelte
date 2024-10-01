<script lang="ts">
    import Logo from "$lib/components/Logo.svelte";
    import {createGameRoom, deleteGameRoom, getAllRooms} from "$lib/apis-http";
    import {createMutation, createQuery, useQueryClient} from "@tanstack/svelte-query";
    import {Button} from "$lib/components/ui/button/index";
    import Icon from "@iconify/svelte";
    import {Input} from "$lib/components/ui/input";
    import GameRoom from "$lib/components/GameRoom.svelte";
    import {gameRoomTokenStore} from "$lib/stores/gameRoomToken";
    import {goto} from "$app/navigation";

    const client = useQueryClient();

    const gameRooms = createQuery({
        queryKey: ['gameRooms'],
        queryFn: async () => await getAllRooms(),
    });

    let username: string = ""
    const createGameRoomMut = createMutation({
        mutationKey: ['createGameRoom'],
        mutationFn: async () => await createGameRoom(username),
        onSuccess: (data) => {
            console.log(data)
            // add token into local storage
            gameRoomTokenStore.setToken(data.roomId, username, data.token)
            goto(`/${data.roomId}?username=${username}`)
        }
    })
    const deleteGameRoomMut = createMutation({
        mutationKey: ['deleteGameRoom'],
        mutationFn: async (gameRoomId: string) => await deleteGameRoom(gameRoomId),
        onSuccess: (data) => {
            console.log(data)
            refetch()
        }
    })

    function refetch() {
        if ($gameRooms.isLoading) return;

        $gameRooms.refetch()
    }

    function createRoom(_: Event) {
        const result = $createGameRoomMut.mutate()
    }

    function deleteRoom(gameRoomId: string) {
        const result = $deleteGameRoomMut.mutate(gameRoomId)
    }

    $: if ($gameRooms.isSuccess) gameRoomTokenStore.cleanupTokens($gameRooms.data.map((gm) => gm.id))

</script>

<div class="mx-auto max-w-xl border-x-4 border-white flex flex-col items-center h-full px-5 gap-y-5">
    <Logo />

    <div class="grid grid-cols-3 place-items-center w-full items-center">
        <h2 class="font-bold">Creer une salle</h2>
        <Input placeholder="Username" class="max-w-xs" name="username" bind:value={username} />
        <Button on:click={createRoom} size="icon" disabled={username === ""}>
            <Icon icon="mdi:add" width="18px"/>
        </Button>
    </div>

    <div class="flex justify-between w-full font-bold items-center">
        <h2 class="font-bold">Salle disponible</h2>
        <div class="flex gap-x-2">
            <Button on:click={refetch} size="icon" variant="ghost">
                <Icon icon="mdi:refresh" width="24px"/>
            </Button>
        </div>
    </div>

    {#if $gameRooms.isLoading}
        sdf
    {:else if $gameRooms.isSuccess}
        {#each $gameRooms.data as gm}
            <GameRoom gameRoom={gm} onDelete={deleteRoom}  />
        {/each}
    {/if}
</div>

