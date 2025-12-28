var timer;

const audioCtx = new(window.AudioContext || window.webkitAudioContext)();
const gainNode = audioCtx.createGain();
gainNode.connect(audioCtx.destination);

root_elm.onanimationend = () => {
    root_elm.style.animation = "none";
};

start_btn.onclick = () => {
    clearInterval(timer);
    if (bpm_in.value < 0.1) return;

    var counter = 0;

    const interval = 60_000 / bpm_in.value;
    const beats = beats_in.value;

    function tick() {
        const c = beats ? counter++ % beats : counter++;

        gainNode.gain.value = volume_in.value;
        if (flash_in.checked) {
            root_elm.style.animation = (c ? "flash" : "flash_2") + " 0.1s linear";
        }

        const oscillator = audioCtx.createOscillator();
        oscillator.type = "square";
        oscillator.frequency.value = c ? 523.25 : 783.99;
        oscillator.connect(gainNode);
        oscillator.start();

        count_span.innerText = beats ? `${"○ ".repeat(c)}●${" ○".repeat(beats-c-1)}` : c + 1;

        setTimeout(() => {
            oscillator.stop();
        }, 50);
    }

    tick();
    timer = setInterval(tick, interval);
};

stop_btn.onclick = () => {
    clearInterval(timer);
};
