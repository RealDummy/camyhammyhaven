<script lang='ts'>
	import type { HTMLImgAttributes } from "svelte/elements";
	import { spring } from "svelte/motion";
	import { onMount } from "svelte";
    import SlideImage from "./SlideImage.svelte";



    export let slides: any[];
    export let size = 1;
    export let scroll = 1;
    export let infinite = false;
    let index = 0;
    let offset = spring(0);
    let grabbed = false;
    const FLING_MULTIPLIER = 20;
    const SNAP_EPSILON = 0.03;
    let disabled = false;
    
    function out_bound(pos: number): boolean {
        return !infinite && (pos < 0 || pos > (slides.length - 1));
    }
    onMount(()=>{
        return offset.subscribe((pos)=>{
            if(out_bound(pos + size - 1) || out_bound(pos)) {
                return;
            }
            let diff = pos-index;
            if (diff > 0.6) {
                index = index + 1;
            }
            else if (diff < -0.6) {
                index = index - 1;
            }
        });
    });
    function compute_window(index: number) {
        let res = [];
        let lower_bound = -1;
        let upper_bound = size + 1;
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
        offset.update((p) => p - scroll).then(()=>{
                offset.update((o)=>wrap(o), {hard:true});
                index = wrap(index);
            });
    }
    function right() {
        if(out_bound(index + (size - 1) + 1)) {
            disabled = true;
            offset.update((p)=>p+0.2).then(()=>{
                offset.set(index).then(()=>{
                    disabled = false;
                });
            });
            return;
        }
        offset.update((p) => p + scroll).then(()=>{
                offset.update((o)=>wrap(o), {hard:true});
                index = wrap(index);
            });
    }
    function on_drag(getX: (arg0: Event|TouchEvent)=>number|null, getTarget: (arg0: Event|TouchEvent)=>HTMLElement|null): (e:any)=>void {
        return (e: any) => {
            let x = getX(e);
            if(!x) {
                return;
            }
            let target = getTarget(e);
            if(!target) {
                return;
            }
            e.preventDefault();
            let {width} = target.getBoundingClientRect(); //probably can cache this or something!
            let start = x;
            let last_frame = x;
            grabbed = true;
            let move = (e: MouseEvent | TouchEvent) => {
                let x = getX(e);
                if(x === null){
                    return;
                }
                let relX = ((x - last_frame)/width);
                offset.update((p)=>p-relX);
                last_frame = x;
            }
            let end = (e: any)=>{
                grabbed = false;
                if(e.clientX == null){
                    window.removeEventListener("touchmove",move);
                    window.removeEventListener("touchend", end);
                }
                else{
                    window.removeEventListener("mousemove", move);
                    window.removeEventListener("mouseup", end);
                }
                let x = getX(e);
                if(x === null){
                    offset.set(index).then(()=>{
                        offset.update((o)=>wrap(o), {hard:true});
                        index = wrap(index);
                    });
                    return;
                }
                let relX = ((x - last_frame)/width) * size;
                let d = ((x - start)/width) * size;
                let g = d>0 ? Math.floor : Math.ceil
                if (Math.abs(d) < SNAP_EPSILON) {
                    g = Math.round;
                }
                let f = (pos: number) => {
                    if(out_bound(pos) || out_bound(pos + size - 1)) {
                        return Math.min(Math.max(0,pos), slides.length - size);
                    }
                    return g(pos);
                }
                let snap = (p: number) => f(p-(relX*FLING_MULTIPLIER));
                offset.update(snap).then(()=>{
                    offset.update((o)=>wrap(o), {hard:true});
                    index = wrap(index);
                });
            };
            if(!e.clientX) {
                window.addEventListener("touchmove",move);
                window.addEventListener("touchend", end);
            }
            else {
                window.addEventListener("mousemove",move);
                window.addEventListener("mouseup", end);
            }
        }
    }
    function getXmouse(e: any): number | null {
        return e.clientX;
    }
    function getTargetMouse(e: any): HTMLElement | null {
        return e.target;
    }
    function getXtouch(e: any): number | null {
        if (e.changedTouches.length != 1) {
            return null;
        }
        return e.changedTouches[0].clientX;
    }
    function getTargetTouch(e: any): HTMLElement | null {
        if (e.touches.length != 1) {
            return null;
        }
        return e.touches[0].target;
    }
</script>

<section>
    <div class="carousel" style="--columns: {size}; --slide: {scroll}">
        <button class="left" on:click={left} {disabled}>
            <slot name="right">
                <svg width="30" height="30" viewBox="0 0 27 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M17.9645 40.7688V40.7688C19.9171 42.7214 23.0829 42.7214 25.0355 40.7688V40.7688C26.9882 38.8162 26.9882 35.6503 25.0355 33.6977V33.6977L16.4706 25.1328C14.518 23.1802 14.518 20.0143 16.4706 18.0617L25.0355 9.49678V9.49678C26.9882 7.54416 26.9882 4.37833 25.0355 2.42571V2.42571C23.0829 0.473092 19.9171 0.473092 17.9645 2.42571V2.42571L2.32847 18.0617V18.0617C0.375851 20.0143 0.375849 23.1802 2.32847 25.1328V25.1328L17.9645 40.7688Z" fill="black"/>
                </svg>
            </slot>
        </button>
        <div class="slider" on:dragstart={on_drag(getXmouse, getTargetMouse)} on:touchstart={on_drag(getXtouch, getTargetTouch)} draggable="true" role={undefined}>
            {#each compute_window(index) as i, pos (wrap(i)) }
            <div class="slide" style="left: {(pos -  (!infinite && index === 0 ? 0 : 1) + index - $offset)*(100/size)}%">
                <slot item={ slides[wrap(i)] }>
                    <SlideImage item={slides[wrap(i)]} />
                </slot>
            </div>
            {/each}
        </div>
        <button class="right" on:click={right} {disabled}>
            <slot name="right">
                <svg width="30" height="30" viewBox="0 0 27 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M9.03553 2.42572V2.42572C7.08291 0.473095 3.91709 0.473095 1.96447 2.42572V2.42572C0.0118448 4.37834 0.0118448 7.54416 1.96447 9.49678V9.49678L10.5294 18.0617C12.482 20.0143 12.482 23.1802 10.5294 25.1328L1.96447 33.6977V33.6977C0.0118448 35.6503 0.0118448 38.8162 1.96447 40.7688V40.7688C3.91709 42.7214 7.08291 42.7214 9.03553 40.7688V40.7688L24.6715 25.1328V25.1328C26.6241 23.1802 26.6242 20.0143 24.6715 18.0617V18.0617L9.03553 2.42572Z" fill="black"/>
                </svg>
            </slot>
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
        display: flex;
        justify-content: center;
        flex-direction: column;
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