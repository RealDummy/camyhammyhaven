<script lang='ts'>
	import type { HTMLImgAttributes } from "svelte/elements";
	import { spring } from "svelte/motion";
    import {AngleRightSolid, AngleLeftSolid} from "flowbite-svelte-icons";
	import { onMount } from "svelte";
    import SlideImage from "./SlideImage.svelte";


    export let slides: HTMLImgAttributes[];
    let window_size = 2;
    let window_scroll = 2;
    let infinite = false;
    let index = 0;
    let offset = spring(0);
    let grabbed = false;
    const FLING_MULTIPLIER = 20;
    const SNAP_EPSILON = 0.03;
    let disabled = false;
    $: console.log("index",index);
    function out_bound(pos: number):boolean {
        return !infinite && (pos < 0 || pos > (slides.length - 1));
    }
    onMount(()=>{
        return offset.subscribe((pos)=>{
            console.log("offset", pos);
            if(out_bound(pos + window_size - 1) || out_bound(pos)) {
                return;
            }
            if(pos > 0){
                if (pos % 1 > 0.6) {
                index = Math.ceil(pos);
                }
                else if (pos % 1 < 0.4) {
                    index = Math.floor(pos);
                }
                return
            }
            if (pos % 1 > -0.4) {
                index = Math.ceil(pos);
            }
            else if (pos % 1 < -0.6) {
                index = Math.floor(pos);
            }
        });
    });
    function compute_window(index: number) {
        let res = [];
        let lower_bound = -1;
        let upper_bound = window_size + 1;
        for(let i = lower_bound; i < upper_bound; ++i) {
            if(out_bound(i + index)) {
                continue;
            }
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
            disabled = true;
            offset.update((p)=>p-0.2).then(()=>{
                offset.set(index).then(()=> {
                    disabled = false;
                });
            });
            return;
        }
        offset.update((p) => Math.max(p - window_scroll, 0)).then(()=>{
                offset.update((o)=>wrap(o), {hard:true});
                index = wrap(index);
            });;
    }
    function right() {
        if(out_bound(index + (window_size - 1) + 1)) {
            disabled = true;
            offset.update((p)=>p+0.2).then(()=>{
                offset.set(index).then(()=>disabled = false);
            });
            return;
        }
        offset.update((p) => Math.min(p + window_scroll, slides.length - (window_size))).then(()=>{
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
        grabbed = true;
        let move = (e: MouseEvent) => {
            let x = ((e.clientX - last_frame)/width) * window_size;
            offset.update((p)=>p-x);
            last_frame = e.clientX;
        }
        let end = (e: MouseEvent)=>{
            grabbed = false;
            document.removeEventListener("mousemove", move);
            document.removeEventListener("mouseup", end);
            let x = ((e.clientX - last_frame)/width) * window_size;
            let d = ((e.clientX - start)/width) * window_size;
            let g = d>0 ? Math.floor : Math.ceil
            if (Math.abs(d) < SNAP_EPSILON) {
                g = Math.round;
            }
            let f = (pos: number) => {
                if(out_bound(pos) || out_bound(pos + window_size - 1)) {
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
        <button class="left" on:click={left} {disabled}>
            <AngleLeftSolid style="pointer-events: none;" tab-index="-1" />
        </button>
        <div class="slider" on:dragstart={on_drag} draggable="true" role={undefined}>
            {#each compute_window(index) as i, pos }
            <div class="slide" style="left: {(pos -  (index != 0 ? 1 : 0) + index - $offset)*100/window_size}%">
            <slot item={ slides[wrap(i)] }>
                <SlideImage item={slides[wrap(i)]} />
            </slot>
            </div>
            {/each}
        </div>
        <button class="right" on:click={right} {disabled}>
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
    }
    .slider {
        height: 100%;
        position: relative;
        overflow: hidden;
    }
    .slide {
        width: calc(100% / var(--columns));
        height: 100%;
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