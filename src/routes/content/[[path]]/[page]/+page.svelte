<script lang="ts">
    export let data;
</script>

<div class="md-content container p-20">
    <svelte:component this={data.content} />
</div>
