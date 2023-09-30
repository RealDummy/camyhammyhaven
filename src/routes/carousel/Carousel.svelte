<script lang='ts'>
	import { cubicOut } from "svelte/easing";
	import type { HTMLImgAttributes } from "svelte/elements";
	import { spring, tweened } from "svelte/motion";
    import {AngleRightSolid, AngleLeftSolid} from "flowbite-svelte-icons";


    export let slides: HTMLImgAttributes[];
    let window_size = 3;
    let window_scroll = 1;
    let infinite = true;
    let index = 0;
    let moving = false;
    let move_queue = 0;
    let positions = [spring(0), spring(0), spring(0)];
    const LEFT = 0, CENTER = 1, RIGHT= 2;
    $: center = positions[CENTER];
    const SLIDER_MOVE_DIST = window_scroll*100/window_size;
    const ACCOUNTED_MOVE_DIST = 100 / (window_size + 2 * window_scroll) * window_scroll;

    function new_index(direction) {
        return index+direction*window_scroll;
    }

    function move(direction: 1|-1){
        if(moving) {
            return;
        }
        moving = true;
        positions[CENTER].set(ACCOUNTED_MOVE_DIST*-direction).then(()=>{
            positions[CENTER].set(0,{hard: true});
            index = new_index(direction);
            moving = false;
        });
    }

    function left() {
        move(-1);
    }
    function right() {
        move(1);
    }

    function wrap(i: Number): Number{
        let len = slides.length;
        return i>=0 ? (i%len) : ((len) + (i%len))%len;
    }
    function compute_window_infinite(index: number): number[] {
        let res = [];
        for(let i=index-window_scroll; i < index+window_size+window_scroll; ++i) {
            res.push(wrap(i));
        }
        console.log(res);
        return res;
    }
    function compute_window(index: Number): Number[] {
        return infinite ? compute_window_infinite(index) : compute_window_clamped(index);
    }

    function begin_drag(e: DragEvent) {
        e.preventDefault();
        let start = e.clientX;
        const bb = e.target.getBoundingClientRect();
        const ratio = bb.width/100;
        const snap = 100 / (window_size + 2*window_scroll);
        positions[LEFT].set(-snap, {hard: true});
        positions[RIGHT].set(snap, {hard: true});
        
        let unsub: Function | undefined;
        let drag_index_updater = (pos: number)=>{
            if(!unsub) {
                console.log("block");
                return;
            }
            if(pos > 100 || pos < -100) {
                return;
            }
            if(pos > (snap/1.8)) {
                console.log("run drag");

                unsub();
                unsub = undefined;
                positions[RIGHT].update((p)=>p - snap*2, {hard: true});
                positions = [positions[RIGHT], positions[LEFT], positions[CENTER]];
                index = wrap(index-1);
                unsub = positions[CENTER].subscribe(drag_index_updater);
            } 
            else if(pos < (-snap/1.8)){
                console.log("run drag");

                unsub();
                unsub = undefined;
                positions[LEFT].update((p)=>p+snap*2, {hard: true}).then(()=>{console.log("done")});
                positions = [positions[CENTER], positions[RIGHT], positions[LEFT]];
                index = wrap(index+1);
                unsub = positions[CENTER].subscribe(drag_index_updater);
            }
        };
        unsub = positions[CENTER].subscribe(drag_index_updater);
        let drag = (e) => {
            let dist = e.clientX - start;
            positions.forEach((e)=>{
                e.update((p)=>p+dist/ratio);
            });
            start = e.clientX;
        }
        let end_drag = () => {
            console.log("up");
            document.removeEventListener("mouseup", end_drag);
            document.removeEventListener("mousemove", drag);
            center.set(0);
            unsub();
        };
        document.addEventListener("mouseup", end_drag);
        document.addEventListener("mousemove", drag);

    }
</script>

<section>
    <div class="carousel" style="--columns: {window_size}; --slide: {window_scroll}">
        <button class="left" on:click={left}>
            <AngleLeftSolid style="pointer-events: none;" tab-index="-1" />
        </button>
        <div class="slider" on:dragstart={begin_drag} style="transform: translateX({$center - ACCOUNTED_MOVE_DIST}%); width: {100 + 2*SLIDER_MOVE_DIST}%" draggable="true">
        {#if slides}
            {#each compute_window(index) as i }
                <img class="slide" src={slides[i].src} alt={slides[i].alt}>
            {/each}
        {/if}
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
        position: absolute;
        top: 0;
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .slide {
        width: calc(100% / (var(--columns) + var(--slide) * 2));
        height: 100%;
        object-fit: cover;
        padding: 10px;
        pointer-events: none;
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