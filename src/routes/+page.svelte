<script lang="ts">
    import { Card } from 'flowbite-svelte';
    import Carousel from './carousel/Carousel.svelte';
	import SlideImage from './carousel/SlideImage.svelte';

    export let data;

    const transition_time = 5000;

</script>

<svelte:head>
	<title>piggies</title>
	<meta name="" content="" />
</svelte:head>


<section>
    <div class="mx-auto container h-96">
        <Carousel slides={data.images} let:item size={3} infinite={false}>
            <div class="w-full h-5/6 relative">
                <SlideImage {item} />
            </div>
            <p class="text-center">{item.title}</p>
        </Carousel>
    </div>
</section>

<style>

</style>