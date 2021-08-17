// Sound directory paths
const soundDir = "static/sounds";
const toneDir = `${soundDir}/timer_complete`;

let setCountdown,
active, halftime, end
hours, minutes, seconds;

let time = 0;
let pause = 0;
let completionTone = document.getElementById("sound-selection").value;
let completionSound = new Audio(`${toneDir}/${completionTone}.wav`);

// Button sound effects
const startSound = new Audio(`${soundDir}/start.wav`);
const pauseSound = new Audio(`${soundDir}/pause.wav`);
const resumeSound = new Audio(`${soundDir}/resume.wav`);
const resetSound = new Audio(`${soundDir}/reset.wav`);
const stopSound = new Audio(`${soundDir}/stop.wav`);

// Pause/Resume button
const pauseButton = document.getElementById("toggle");

// Preview button and dropdown
const previewButton = document.getElementById("preview-button");
const soundDropdown = document.getElementById("sound-selection");

// Timer elements
const countdownHour = document.getElementById("h");
const countdownMinute = document.getElementById("m");
const countdownSecond = document.getElementById("s");

// Input to timer
const hoursIn = document.getElementById("hours");
const minutesIn = document.getElementById("minutes");
const secondsIn = document.getElementById("seconds");
const inputs = document.getElementById("inputs");

// Change hourglass icon and preview section based on timer
const toggleHourglass = (state="end") => {
    switch (state) {
        case "beginning":
            $("#hourglass").removeClass("bi-hourglass-bottom");
            $("#hourglass").addClass("bi-hourglass-top");
            $("#hour-glass-path").attr("d", "M2 14.5a.5.5 0 0 0 .5.5h11a.5.5 0 1 0 0-1h-1v-1a4.5 4.5 0 0 0-2.557-4.06c-.29-.139-.443-.377-.443-.59v-.7c0-.213.154-.451.443-.59A4.5 4.5 0 0 0 12.5 3V2h1a.5.5 0 0 0 0-1h-11a.5.5 0 0 0 0 1h1v1a4.5 4.5 0 0 0 2.557 4.06c.29.139.443.377.443.59v.7c0 .213-.154.451-.443.59A4.5 4.5 0 0 0 3.5 13v1h-1a.5.5 0 0 0-.5.5zm2.5-.5v-1a3.5 3.5 0 0 1 1.989-3.158c.533-.256 1.011-.79 1.011-1.491v-.702s.18.101.5.101.5-.1.5-.1v.7c0 .701.478 1.236 1.011 1.492A3.5 3.5 0 0 1 11.5 13v1h-7z");
            break;
        case "middle":
            $("#hourglass").removeClass("bi-hourglass-top");
            $("#hourglass").addClass("bi-hourglass-split");
            $("#hour-glass-path").attr("d", "M2.5 15a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1h-11zm2-13v1c0 .537.12 1.045.337 1.5h6.326c.216-.455.337-.963.337-1.5V2h-7zm3 6.35c0 .701-.478 1.236-1.011 1.492A3.5 3.5 0 0 0 4.5 13s.866-1.299 3-1.48V8.35zm1 0v3.17c2.134.181 3 1.48 3 1.48a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351z");
            break;
        case "end":
            $("#hourglass").removeClass("bi-hourglass-split");
            $("#hourglass").addClass("bi-hourglass-bottom");
            $("#hour-glass-path").attr("d", "M2 1.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1h-11a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1-.5-.5zm2.5.5v1a3.5 3.5 0 0 0 1.989 3.158c.533.256 1.011.791 1.011 1.491v.702s.18.149.5.149.5-.15.5-.15v-.7c0-.701.478-1.236 1.011-1.492A3.5 3.5 0 0 0 11.5 3V2h-7z");
            break;
    } 
}

const configCompletion = () => {
    completionTone = document.getElementById("sound-selection").value;
    completionSound = new Audio(`${toneDir}/${completionTone}.wav`);
    completionSound.play();
    completionSound.pause();
    completionSound.currentTime = 0;
}

// Completion sound effect
const completed = (preview=false) => {
    stopComplete();
    if (preview) {
        completionTone = document.getElementById("sound-selection").value;
        completionSound = new Audio(`${toneDir}/${completionTone}.wav`);
        completionSound.play();
    }
    else {
        completionSound.loop = true;
        completionSound.play();
        toggleHourglass();
        previewButton.disabled = false;
        soundDropdown.disabled = false;
    }
    completionSound.play();
}

// Stop completion sound repeat/loop
const stopComplete = (stop=false) => {
    if (completionSound) {
        completionSound.pause();
        completionSound.currentTime = 0;
        if (stop && end) {
            stopSound.play();
            end = null;
        }
    }
}

// Clear input fields
const clearInput = () => {
    hoursIn.value = "";
    minutesIn.value = "";
    secondsIn.value = "";
}

// Reset timer
const reset = (clear=true) => {
    stopComplete();
    clearInterval(setCountdown);
    countdownHour.innerText = "0";
    countdownMinute.innerText = "0";
    countdownSecond.innerText = "0";
    if (active && clear) clearInput();
    if (end) completed();
    active = false;
}

const updateCountdown = () => {
    if (time <= 0) {
        reset(end);
    }
    else {
        // Calculate time units
        hours = Math.floor(time/3600);
        minutes = Math.floor(time/60) % 60;
        seconds = time % 60;
        // Text formatting for time units
        minutes = minutes < 10 && hours != 0 ? `0${minutes}` : minutes;
        seconds = seconds < 10 && minutes != 0 ? `0${seconds}` : seconds;
        // Adjust timer text and hourglass
        countdownHour.innerText = `${hours}`;
        countdownMinute.innerText = `${minutes}`;
        countdownSecond.innerText = `${seconds}`;
        if (time === halftime) toggleHourglass("middle");
        // Increment timer
        time--;
        time === 0 ? end = true : end = false;
        active = true;
        previewButton.disabled = true;
        soundDropdown.disabled = true;
    }
}

// Calculate time from input then start timer
const startTimer = () => {
    end ? stopComplete(true): stopComplete(false);
    if (hoursIn.value || minutesIn.value || secondsIn.value) {
        end = false;
        reset(clear=false);
        startHour = hoursIn.value ? parseInt(hoursIn.value) : 0;
        startMinute = minutesIn.value ? parseInt(minutesIn.value) : 0;
        startSecond = secondsIn.value ? parseInt(secondsIn.value) : 0;
        time = (startHour * 3600) + (startMinute * 60) + startSecond;
        if (time != 0) {
            halftime = Math.ceil(time/2);
            active = true;
            updateCountdown();
            setCountdown = setInterval(updateCountdown, 1000);
            startSound.play();
            toggleHourglass(state="beginning");
            clearInput();
            configCompletion();
        }
    }
}

// Pause or Resume timer based on state
const pauseTimer = () => {
    stopComplete(true);
    if (active) {
        pause = time;
        time = 0;
        updateCountdown();
        countdownHour.innerText = `${hours}`;
        countdownMinute.innerText = `${minutes}`;
        countdownSecond.innerText = `${seconds}`;
        pauseButton.innerHTML = "Resume";
        active = false;
        pauseSound.play();
    }
    else if (pauseButton.innerHTML === "Resume") {
        time = pause;
        setCountdown = setInterval(updateCountdown, 1000);
        updateCountdown();
        pauseButton.innerHTML = "Pause";
        resumeSound.play();
    }
}

// Reset timer to 0
const resetTimer = () => {
    if (countdownHour.innerHTML != 0 || countdownMinute.innerHTML != 0 || countdownSecond.innerHTML != 0) {
        time = 0;
        pause = 0;
        pauseButton.innerHTML = "Pause";
        reset(clear=false);
        resetSound.play();
    }
    else {
        hoursIn.value = "";
        minutesIn.value = "";
        secondsIn.value = "";
        stopComplete(true);
    }
}

// Ensure timer values are valid
const adjustTimer = (val) => {
    let max = parseInt(val.max);
    let min = parseInt(val.min);
    if (parseInt(val.value) > max) val.value = max;
    if (parseInt(val.value) < min) val.value = min;
}
hoursIn.oninput = function () {
    adjustTimer(this);
}
minutesIn.oninput = function () {
    adjustTimer(this);
}
secondsIn.oninput = function () {
    adjustTimer(this);
}

// Prevent invalid inputs
inputs.onkeydown = function(e) {
    if(!((e.keyCode > 95 && e.keyCode < 106)
      || (e.keyCode > 47 && e.keyCode < 58) 
      || e.keyCode == 8)) {
        return false;
    }
}
