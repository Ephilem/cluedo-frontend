<script lang="ts">
    import Icon from "@iconify/svelte";

    export let title;
</script>
<div class="absolute p-4 border-foreground border-4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] gap-x-5 gap-y-1">
    <Icon icon="mdi:alert" class="text-foreground text-4xl col-span-1 row-span-2 place-self-center"/>
    <h2 class="font-bold">
        {title}
    </h2>
    <div>
        <slot/>
    </div>
</div>
