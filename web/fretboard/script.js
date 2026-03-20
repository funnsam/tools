{
    const notes = [
        "A", "B♭", "B", "C", "D♭", "D",
        "E♭", "E", "F", "G♭", "G", "A♭",
    ];

    // E2, A2, D3, G3, B3, E4
    const tuning = [-29, -24, -19, -14, -10, -5];

    function semitoneToNoteName(semitone) {
        const adj = semitone < 3 ? Math.ceil(Math.abs(semitone / 12)) : 0;
        semitone += adj * 12;
        const name = notes[semitone % 12];
        const octave = Math.floor((semitone - 3) / 12) + 5 - adj;
        return name + octave;
    }

    tuning.forEach((v, i) => {
        for (let j = 0; j < 12; j++) {
            const pos = document.createElement("div");
            pos.innerText = semitoneToNoteName(v + j);
            fretboard.appendChild(pos);
        }
    });
}
