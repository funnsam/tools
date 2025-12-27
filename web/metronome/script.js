var timer = null;

const audioCtx = new(window.AudioContext || window.webkitAudioContext)();
const gainNode = audioCtx.createGain();
gainNode.connect(audioCtx.destination);
gainNode.gain.value = 0.15;

start_btn.onclick = () => {
    if (timer) clearInterval(timer);
    if (bpm_in.value < 0.1) return;

    var counter = 0;

    const interval = 60_000 / bpm_in.value;
    const beats = beats_in.value;

    timer = setInterval(() => {
        const oscillator = audioCtx.createOscillator();
        oscillator.type = "square";
        oscillator.frequency.value = beats != 0 && counter % beats == 0 ? 783.99 : 523.25;
        oscillator.connect(gainNode);
        oscillator.start();

        count.innerText = (beats != 0 ? counter++ % beats : counter) + 1;

        setTimeout(() => oscillator.stop(), 50);
    }, interval);
};

stop_btn.onclick = () => {
    if (timer) clearInterval(timer);
};
