<script>
    import { Card } from 'flowbite-svelte';
import Carousel from './carousel/Carousel.svelte';
    import {images} from './images';

    const transition_time = 5000;
    let duration=transition_time;
    let duration_reset = -1;

</script>

<svelte:head>
	<title>piggies</title>
	<meta name="" content="" />
</svelte:head>


<section>
    <div class="mx-auto container h-96">
        <Carousel slides={images} let:item size={3} infinite={false}>
            <Card img={item.src ?? ""}>
                <p>{item.title}</p>
            </Card>
        </Carousel>
    </div>
</section>

<style>

</style>