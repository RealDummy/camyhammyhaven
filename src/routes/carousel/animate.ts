
function lerp(a: number, b: number, t: number): number {
    let clamped = Math.max(0, Math.min(t,1));
    return ((b-a)*clamped) + a;
}

function animate(time_ms: number, f: Function, end_callback: Function) {
    const begin_time = Date.now();
    let inner = () => {
        let now = Date.now();
        let progress = lerp(0, time_ms, (now-begin_time)/ time_ms)/time_ms;
        f(progress);
        if(progress < 1) {
            requestAnimationFrame(inner);
        }
        else {
            end_callback();
        }
    };
    inner();
}

export {lerp, animate};