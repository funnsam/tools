{
    const audioCtx = new(window.AudioContext || window.webkitAudioContext)();
    const gainNode = audioCtx.createGain();
    gainNode.connect(audioCtx.destination);

    function playOvertones(freq, duration) {
        for (let i = 1; i < 5; i++) {
            playFrequency(freq * i, duration, 1 / (i / 2 + 0.5));
        }
    }

    function playFrequency(freq, duration, volume) {
        const oscillator = audioCtx.createOscillator();
        const noteGain = audioCtx.createGain();

        noteGain.connect(gainNode);
        const v = volume * 35 / freq;
        noteGain.gain.value = 0;
        noteGain.gain.linearRampToValueAtTime(v, audioCtx.currentTime + 0.01);
        noteGain.gain.linearRampToValueAtTime(v, audioCtx.currentTime + duration - 0.1);
        noteGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration);

        oscillator.type = "sine";
        oscillator.frequency.value = freq;
        oscillator.connect(noteGain);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + duration);

        setTimeout(() => noteGain.disconnect(), duration * 1000 + 100);
    }

    function frequencyOf(semitone) {
        return 440 * Math.pow(2, semitone / 12);
    }

    var notes, tuning;

    function semitoneToNoteName(semitone) {
        const adj = semitone < 3 ? Math.ceil(Math.abs(semitone / 12)) : 0;
        semitone += adj * 12;
        const name = notes[semitone % 12];
        const octave = Math.floor((semitone - 3) / 12) + 5 - adj;
        return name + octave;
    }

    function addFretLabels(frets) {
        for (let j = 0; j < frets; j++) {
            const k = j % 12;

            const pos = document.createElement("div");
            pos.innerText = fret_label_num_in.checked ? j
                : j > 0 && k == 0 ? "• •"
                : k == 3 || k == 5 || k == 7 || k == 9 ? "•"
                : "";

            if (j == 0) pos.classList.add("head");
            fretboard.appendChild(pos);
        }
    }

    function setHighlight(e, semitone) {
        const st = e.target.getAttribute("data-semitone");
        playOvertones(frequencyOf(st), 0.5);

        Array.from(fretboard.children).forEach(btn => {
            if (btn.hasAttribute("data-semitone")) {
                const s = btn.getAttribute("data-semitone");

                btn.classList.remove("filled");

                const hi = same_octave_in.checked ? semitone == s : (semitone - s) % 12 == 0;
                if (hi) {
                    btn.classList.add("filled");
                }
            }
        });
    }

    function makeFretboard() {
        fretboard.innerHTML = "";

        let frets = frets_count_in.value;
        fretboard.style.setProperty("--small-frets", frets - 1);

        addFretLabels(frets);
        tuning.forEach((v, i) => {
            for (let j = 0; j < frets; j++) {
                const pos = document.createElement("button");
                pos.innerText = semitoneToNoteName(v + j);
                pos.onclick = e => setHighlight(e, v + j);
                pos.setAttribute("data-semitone", v + j);

                if (j == 0) pos.classList.add("head");

                fretboard.appendChild(pos);
            }
        });
        addFretLabels(frets);
    }

    function setup() {
        gainNode.gain.value = volume_in.value;
        notes = notation_in.value.split(",");
        tuning = tuning_in.value.split(",").map(Number);

        makeFretboard();
    }

    setup();
    settings_close.onclick = setup;
}
