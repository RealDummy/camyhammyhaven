<script lang="ts">
    import type { HTMLImgAttributes } from "svelte/elements";
    export let item: HTMLImgAttributes;
</script>

<img {...item} />

<style>
    img {
        object-fit: cover;
        height: 100%;
        width: 100%;
    }
</style>