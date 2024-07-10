<script lang="ts">
	import type { HTMLImgAttributes } from "svelte/elements";
	import type { Animal } from "./+page.server";
    import { IconSolid, ChevronDownSolid } from "flowbite-svelte-icons";
    export let img: HTMLImgAttributes;
    export let info: Animal;
    let show = false;
    $: console.log(show);
</script>

<div class= "rounded p-2">
    <img {...img} class="h-96 w-full rounded object-cover" alt="{info.name} z-10">
    <h4 class="text-lg font-bold text-center">{info.name}</h4>
    {#if !!info.description}
    <div class="relative p-0 m-0 rounded">
        <button class="box-border w-full border-solid border border-primary rounded-lg m-0 p-0" 
        on:click={()=>{show=!show}}
        on:keydown={
            (e)=>{if(show && e.key=="Escape") show=false}
        }>
            read more 
            <IconSolid size="xs" icon={ChevronDownSolid} class="inline" tabindex="-1" ></IconSolid>
        </button>
        <button on:click={()=>show=false}
        class="w-full top-5 border-solid border-t-0 border border-primary rounded-br-lg rounder-bl-lg absolute bg-white m-0 p-0" 
        style="display: block; transform: scaleY({show ? "1":"0"}); transition: transform 0.3s ease-out; transform-origin: top;">
            <br>{info.description}
    </button>

    </div>
    {/if}

</div>

