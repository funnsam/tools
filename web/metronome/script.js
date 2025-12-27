var timer = null;

const audioCtx = new(window.AudioContext || window.webkitAudioContext)();
const gainNode = audioCtx.createGain();
gainNode.connect(audioCtx.destination);
gainNode.gain.value = 0.15;

start.onclick = () => {
    if (timer) clearInterval(timer);
    if (bpm.value < 0.1) return;

    var counter = 0;

    const interval = 60_000 / bpm.value;
    const b = beats.value;

    timer = setInterval(() => {
        const oscillator = audioCtx.createOscillator();
        oscillator.type = "square";
        oscillator.frequency.value = b != 0 && counter % b == 0 ? 783.99 : 523.25;
        oscillator.connect(gainNode);
        oscillator.start();

        count.innerText = (b != 0 ? counter++ % b : counter) + 1;

        setTimeout(() => oscillator.stop(), 50);
    }, interval);
};
