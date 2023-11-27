<script lang='ts'>
    export let src: string;
    export let alt: string;
</script>

<figure data-src={src} class="bg-secondary">
    <img {src} {alt}>
    {#if alt}
        <figcaption class="bg-secondary"><em>{alt}</em></figcaption>
    {/if}
</figure>

<style>
    figure {
        display: inline-block;
        width: fit-content;
        margin-top: 10px;
        margin-bottom: 10px;
    }
    figcaption {
        position: relative;
        text-align: center;
        width: 100%;

    }
    figure:not(figure[data-src*="?"]) {
        width: 75%;
        margin-left: 12.5%;
        margin-right: 12.5%;
        }
    figure[data-src$="?small"] {
        width: 200px;
    }
    figure[data-src$="?medium"] {
        width: 400px;
    }
    figure[data-src$="?large"] {
        width: 600px;
    }
    figure[data-src$="?half"] {
        width: 50%;
    }
    figure[data-src$="?third"] {
        width: 33.33%;
    }
    figure[data-src$="?quarter"] {
        width: 25%;
    }
</style>