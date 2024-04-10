<script lang="ts">
    import type { HTMLImgAttributes } from "svelte/elements";
    export let item: HTMLImgAttributes;
</script>

<img {...item} loading="lazy" alt={item.alt ?? "guinea pig" }/>

<style>
    img {
        object-fit: cover;
        height: 100%;
        width: 100%;
    }
</style>