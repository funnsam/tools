{
    const notes = [
        "A", "B♭", "B", "C", "D♭", "D",
        "E♭", "E", "F", "G♭", "G", "A♭",
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
                btn.disabled = false;
                btn.classList.remove("filled");
            });
            key = null;
            type_maj_scale.disabled = true;
            type_min_scale.disabled = true;
            return;
        }

        notes.forEach((note, idx) => {
            const btn = document.createElement("button");
            btn.innerText = note;
            btn.onclick = () => {
                if (key != null) {
                    relative_sel.children[key].classList.remove("filled");
                }

                btn.classList.add("filled");
                key = idx;
                relative(idx);
                type_maj_scale.disabled = false;
                type_min_scale.disabled = false;
            };

            relative_sel.appendChild(btn);
        });
    };
    relative_en.oninput();

    type_in.oninput = () => {
        if (key != null) {
            relative(key);
        }
    };

    function relative(idx) {
        Array.from(pitch_div.children).forEach((btn, j) => {
            const d = (j + 12 - idx) % 12;
            const rn = ["I", "♭II", "II", "♭III", "III", "IV", "♭V", "V", "♭VI", "VI", "♭VII", "VII"];
            const dis = {
                "maj_scale": [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
                "min_scale": [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0],
            };

            btn.innerText = processRoman(j, rn[d], type_in.value);
            btn.disabled = type_in.value.includes("scale") && !dis[type_in.value][d];

            if (d == 0) {
                btn.classList.add("filled");
            } else {
                btn.classList.remove("filled");
            }
        });
    }

    function processRoman(d, name, ty) {
        switch (ty) {
            case "maj_scale": return processRoman(d, name, majScaleType(d));
            case "min_scale": return processRoman(d, name, minScaleType(d));
        }

        const u = name, l = name.toLowerCase();
        switch (ty) {
            case "min": return l;
            case "dim": return l + "°";
            case "aug": return u + "⁺";
            case "sus4": return l + "ˢᵘˢ⁴";
            case "sus2": return l + "ˢᵘˢ²";
            case "5th": return u + "⁵";
            case "maj7": return u + "⁷";
            case "min7": return l + "⁷";
            default: return u;
        }
    }

    function playFrequency(freq, duration) {
        const oscillator = audioCtx.createOscillator();
        const noteGain = audioCtx.createGain();

        noteGain.connect(gainNode);
        noteGain.gain.setValueAtTime(1, audioCtx.currentTime + duration * (3/5));
        noteGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration);

        oscillator.type = "triangle";
        oscillator.frequency.value = freq;
        oscillator.connect(noteGain);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + duration);

        setTimeout(() => noteGain.disconnect(), duration * 1000 + 100);
    }

    function frequencyOf(semitone) {
        return 440 * Math.pow(2, semitone / 12 + (octave_in.value - 4));
    }

    function chord(semitone, duration) {
        volume_in.oninput();

        switch (type_in.value) {
            case "maj_scale": return _chord(majScaleType(semitone), semitone, duration);
            case "min_scale": return _chord(minScaleType(semitone), semitone, duration);
            default: return _chord(type_in.value, semitone, duration);
        }
    }

    function majScaleType(semitone) {
        const d = (semitone + 12 - key) % 12;
        return (d == 0 || d == 5 || d == 7) ? "maj" : (d == 11) ? "dim" : "min";
    }

    function minScaleType(semitone) {
        const d = (semitone + 12 - key) % 12;
        return (d == 3 || d == 8 || d == 10) ? "maj" : (d == 2) ? "dim" : "min";
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
            "maj7": [0, 4, 7, 11],
            "min7": [0, 3, 7, 10],
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
