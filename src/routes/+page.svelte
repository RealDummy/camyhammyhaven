<script>
    import Carousel from './carousel/Carousel.svelte';
    import {images} from './images';

    const transition_time = 5000;
    let duration=transition_time;
    let duration_reset = -1;
    
    let cancel_autoplay = () => {
        duration = 0;
        if(duration_reset !== -1) {
            clearTimeout(duration_reset);
        }
        duration_reset = setTimeout(()=>{duration = transition_time; duration_reset = -1;})
    };

</script>

<svelte:head>
	<title>piggies</title>
	<meta name="" content="" />
</svelte:head>


<section>
    <div class="mx-auto container h-96">
        <Carousel slides={images}>
        </Carousel>
    </div>
</section>
