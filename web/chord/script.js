{
    const notes = [
        "A", "A#", "B", "C", "C#", "D",
        "D#", "E", "F", "F#", "G", "G#",
    ];

    const audioCtx = new(window.AudioContext || window.webkitAudioContext)();
    const gainNode = audioCtx.createGain();
    gainNode.connect(audioCtx.destination);

    volume_in.oninput = () => gainNode.gain.value = volume_in.value;

    notes.forEach((note, idx) => {
        const btn = document.createElement("button");
        btn.innerText = note;
        btn.onclick = () => chord(idx, 0.5);

        pitch_div.appendChild(btn);
    });

    var key = null;

    relative_en.oninput = () => {
        if (!relative_en.checked) {
            relative_sel.innerHTML = "";
            Array.from(pitch_div.children).forEach((btn, idx) => {
                btn.innerText = notes[idx];
            });
            key = null;
            type_triad.disabled = true;
            return;
        }

        notes.forEach((note, idx) => {
            const btn = document.createElement("button");
            btn.innerText = note;
            btn.onclick = () => {
                if (key != null) {
                    relative_sel.children[key].classList.remove("filled");
                }

                relative(idx);
                btn.classList.add("filled");
                key = idx;
                type_triad.disabled = false;
            };

            relative_sel.appendChild(btn);
        });
    };
    relative_en.oninput();

    function relative(idx) {
        Array.from(pitch_div.children).forEach((btn, j) => {
            const d = (j + 12 - idx) % 12;
            const rn = ["I", "#I", "II", "#II", "III", "IV", "#IV", "V", "#V", "VI", "#VI", "VII"];
            btn.innerText = rn[d];
        });
    }

    function playFrequency(freq, duration) {
        const oscillator = audioCtx.createOscillator();
        const noteGain = audioCtx.createGain();

        noteGain.connect(gainNode);
        noteGain.gain.setValueAtTime(1, audioCtx.currentTime + duration / 3);
        noteGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration);

        oscillator.type = "triangle";
        oscillator.frequency.value = freq;
        oscillator.connect(noteGain);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + duration);

        setTimeout(() => noteGain.disconnect(), duration * 1000 + 100);
    }

    // note is relative to A4
    function frequencyOf(semitone) {
        return 440 * Math.pow(2, semitone / 12 - 1);
    }

    function chord(semitone, duration) {
        volume_in.oninput();

        if (type_in.value == "triad") {
            const d = (semitone + 12 - key) % 12;
            const ty = (d == 0 || d == 5 || d == 7) ? "maj" : (d == 11) ? "dim" : "min";

            return _chord(ty, semitone, duration);
        }

        _chord(type_in.value, semitone, duration);
    }

    function _chord(ty, semitone, duration) {
        const intervals = {
            "maj": [0, 4, 7],
            "min": [0, 3, 7],
            "dim": [0, 3, 6],
            "aug": [0, 3, 8],
            "sus4": [0, 5, 7],
            "sus2": [0, 2, 7],
            "5th": [0, 7],
            "raw": [0],
        }

        intervals[ty].forEach((st, _) => {
            playFrequency(frequencyOf(semitone + st), duration);
        })
    }

    // document.onkeydown = e => {
    //     if (e.key == "ArrowDown" || e.key == "ArrowUp") {
    //         e.preventDefault();
    //         type_in.focus();
    //         type_in.onkeydown(e);
    //     }
    // };
}
