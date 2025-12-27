var timer = null;

const audioCtx = new(window.AudioContext || window.webkitAudioContext)();
const gainNode = audioCtx.createGain();
gainNode.connect(audioCtx.destination);
gainNode.gain.value = 0.15;

root_elm.onanimationend = () => {
    root_elm.style.animation = "none";
};

start_btn.onclick = () => {
    if (timer) clearInterval(timer);
    if (bpm_in.value < 0.1) return;

    var counter = 0;

    const interval = 60_000 / bpm_in.value;
    const beats = beats_in.value;
    const flash = flash_in.checked;

    function tick() {
        const c = beats ? counter++ % beats : counter++;

        const oscillator = audioCtx.createOscillator();
        oscillator.type = "square";
        oscillator.frequency.value = c ? 523.25 : 783.99;
        oscillator.connect(gainNode);
        oscillator.start();

        count_span.innerText = beats ? `${"█ ".repeat(c+1)}${"░ ".repeat(beats-c-1)}` : c + 1;

        if (flash) {
            root_elm.style.animation = (c ? "flash" : "flash_2") + " 0.1s linear";
        }

        setTimeout(() => {
            oscillator.stop();
        }, 50);
    }

    tick();
    timer = setInterval(tick, interval);
};

stop_btn.onclick = () => {
    if (timer) clearInterval(timer);
};
