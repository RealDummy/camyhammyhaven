<script lang='ts'>
	import { cubicOut } from "svelte/easing";
	import type { HTMLImgAttributes } from "svelte/elements";
	import { spring, tweened } from "svelte/motion";
    import {AngleRightSolid, AngleLeftSolid} from "flowbite-svelte-icons";
	import { onMount } from "svelte";


    export let slides: HTMLImgAttributes[];
    let window_size = 2;
    let window_scroll = 1;
    let infinite = false;
    let index = 0;
    let offset = spring(0);
    const FLING_MULTIPLIER = 20;
    const SNAP_EPSILON = 0.03;
    function out_bound(pos: number):boolean {
        return !infinite && (pos < 0 || pos > (slides.length - 1));
    }
    onMount(()=>{
        return offset.subscribe((pos)=>{
            if(out_bound(pos - window_size)) {
                return;
            }
            if (pos % 1 < 0.4) {
                index = Math.floor(pos);
            }
            else if (pos % 1 < -0.6) {
                index = Math.ceil(pos);
            }
        });
    });
    function compute_window(index: number) {
        let res = [];
        let lower_bound = infinite ? -1 : (index == 0 ? 0 : -1);
        let upper_bound = infinite ? window_size + 1 : Math.min(index + window_size, slides.length) - index;
        for(let i = lower_bound; i < upper_bound; ++i) {
            res.push(i + index);
        }
        return res;
    }
    function wrap(x: number): number {
        if (x < 0) {
            return (slides.length + (x % slides.length)) % slides.length;
        }
        return x % slides.length;
    }
    function left() {
        if(out_bound(index - 1)) {
            offset.update((p)=>p-0.2).then(()=>{
                offset.set(index);
            });
            return;
        }
        offset.update((p) => p - window_scroll).then(()=>{
                offset.update((o)=>wrap(o), {hard:true});
                index = wrap(index);
            });;
    }
    function right() {
        if(out_bound(index + window_size + window_scroll)) {
            offset.update((p)=>p+0.2).then(()=>{
                offset.set(index);
            });
            return;
        }
        offset.update((p) => p + window_scroll).then(()=>{
                offset.update((o)=>wrap(o), {hard:true});
                index = wrap(index);
            });;
    }
    function on_drag(e:any) {
        e.preventDefault();
        let x = e.clientX;
        let target = e.originalTarget;
        let {width} = target.getBoundingClientRect();
        let start = x;
        let last_frame = x;
        let move = (e: MouseEvent) => {
            let x = ((e.clientX - last_frame)/width) * window_size;
            offset.update((p)=>p-x);
            last_frame = e.clientX;
        }
        let end = (e: MouseEvent)=>{
            document.removeEventListener("mousemove", move);
            document.removeEventListener("mouseup", end);
            let x = ((e.clientX - last_frame)/width) * window_size;
            let d = ((e.clientX - start)/width) * window_size;
            let g = d>0 ? Math.floor : Math.ceil
            if (d < 0.03) {
                g = Math.round;
            }
            let f = (pos: number) => {
                if(out_bound(pos - window_size)) {
                    return Math.min(Math.max(0,pos), slides.length - window_size);
                }
                return g(pos);
            }
            let snap = (p: number) => f(p-(x*FLING_MULTIPLIER));
            offset.update(snap).then(()=>{
                offset.update((o)=>wrap(o), {hard:true});
                index = wrap(index);
            });
        };
        document.addEventListener("mousemove",move);
        document.addEventListener("mouseup", end);
    }
</script>

<section>
    <div class="carousel" style="--columns: {window_size}; --slide: {window_scroll}">
        <button class="left" on:click={left}>
            <AngleLeftSolid style="pointer-events: none;" tab-index="-1" />
        </button>
        <div class="slider" on:dragstart={on_drag} draggable="true">
            {#each compute_window(index) as i, pos }
                <img class="slide" src={slides[wrap(i)].src} alt={slides[wrap(i)].alt} style="left: {((pos - (infinite ? 1 : 0)) + index - $offset)*100/window_size}%">
            {/each}
        </div>
        <button class="right" on:click={right}>
            <AngleRightSolid style="pointer-events: none;" tab-index="-1"  />
        </button>
    </div>
</section>

<style>
    section {
        height: 100%;
    }
    .carousel {
        height: 100%;
        position: relative;
        overflow: hidden;
    }
    .slider {
        height: 100%;
        position: relative;
    }
    .slide {
        width: calc(100% / var(--columns));
        height: 100%;
        object-fit: cover;
        padding: 10px;
        pointer-events: none;
        position: absolute;
    }
    button {
        position: absolute;
        transform: translateY(-50%);
        top: 50%;
        z-index: 2;
        background-color: rgb(87, 87, 87);
        padding: 8px;
        border-radius: 100%;
        opacity: 0.5;
        transition: opacity 0.1s linear;
    }
    button:hover {
        opacity: 0.9;
    }
    .right {
        right: 0;
    }
    .left {
        left: 0;
    }

</style>