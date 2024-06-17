<script lang="ts">
import Carousel from './carousel/Carousel.svelte';
	import SlideImage from './carousel/SlideImage.svelte';
	import Gridelement from './gridelement.svelte';
    export let data;

    const transition_time = 5000;

    const gpurl_regex = new RegExp("gp/.*");
</script>

<svelte:head>
	<title>piggies</title>
	<meta name="" content="" />
</svelte:head>


<section>
    <div class="mx-auto container h-96 p-2">
        <Carousel slides={data.slide_urls.map((x)=>{ return {image: {src: `${encodeURI(x.match(gpurl_regex)?.at(0) ?? "")}` , title: "piggie pic"}} } )} let:item size={2} infinite={false}>
            <div class="w-full h-5/6 relative">
                <SlideImage item={item.image} />
            </div>
        </Carousel>
    </div>
    <div class="grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 place-items-stretch gap-2 m-2">
        {#each data.data as img, i (i)}
        <div class="flex flex-col object-cover">
            <Gridelement img={img.image} info={img.info} ></Gridelement>
        </div>

        {/each}
    </div>
</section>

<style>

</style>