// Tracks list
const tracks = [
    'Let It Go.mp3', 'Do You Wanna Build A Snowman.mp3', 'For The First Time In Forever.mp3',
    'All Is Found.mp3', 'In To The Unknown.mp3', 'Show Yourself.mp3',
    'Some Things Never Change.mp3', 'The Next Right Thing.mp3', 'Lost In The Woods.mp3',
    'The Family Madrigal.mp3', 'Waiting On A Miracle.mp3', 'Surface Pressure.mp3',
    'What Else Can I Do.mp3', "We Don't Talk About Bruno.mp3", 'When Will My Life Begin.mp3',
    'I See The Light.mp3', 'Immortals.mp3', 'Un Poco Loco.mp3', 'Remember Me.mp3', 'La Llorona.mp3', 'My Proud Corazon.mp3'
];

let audio;
let currentSongIndex = 0;

function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

function updateSongTime() {
    if (!audio) return;
    let songDuration = document.querySelector(".song-duration");
    audio.addEventListener("timeupdate", () => {
        let currentTime = formatTime(audio.currentTime);
        let duration = formatTime(audio.duration);
        songDuration.innerText = `${currentTime}/${duration}`;
        document.querySelector(".circle").style.left = (audio.currentTime / audio.duration) * 100 + '%';
    });

    let seekbar = document.querySelector(".seekbar");
    seekbar.addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + '%';
        audio.currentTime = (audio.duration) * percent / 100;
    });

    audio.addEventListener('ended', () => {
        play.classList.remove("fa-pause");
        play.classList.add("fa-play");
        document.querySelector(".circle").style.left = '0%';
    });
}

function playCardSong(event) {
    let index = event.target.getAttribute('data-index');
    currentSongIndex = parseInt(index);

    if (audio) {
        audio.pause();
    }
    audio = new Audio(tracks[index]);
    audio.play();
    updateSongTime();

    play.classList.remove("fa-play");
    play.classList.add("fa-pause");

    let songInfo = document.querySelector(".song-info");
    let songDuration = document.querySelector(".song-duration");
    songInfo.innerText = tracks[index].replace(".mp3", "");
    songDuration.innerText = "00:00 / 00:00";

    document.querySelector('#previous').style.cursor = 'default';
    document.querySelector('#previous').style.color = 'grey';
    document.querySelector('#next').style.cursor = 'default';
    document.querySelector('#next').style.color = 'grey';
}

const cardBtns = document.querySelectorAll(".play-btn");
let playBar = document.querySelector(".playbar");
let previousCard = null;

for (let btn of cardBtns) {
    btn.addEventListener("click", (event) => {
        playCardSong(event);
        playBar.style.display = "flex";
        let btnContainer = btn.parentElement;
        btnContainer.style.display = "none";
        let card = btnContainer.parentElement;
        let cardContainer = card.parentElement;

        if (previousCard) {
            previousCard.style.backgroundColor = "";
        }

        cardContainer.style.backgroundColor = "#540a2f";
        previousCard = cardContainer;
    });
}

const play = document.querySelector("#play");
const previous = document.querySelector("#previous");
const next = document.querySelector("#next");

play.addEventListener("click", () => {
    if (audio.paused) {
        audio.play();
        play.classList.remove("fa-play");
        play.classList.add("fa-pause");
    } else {
        audio.pause();
        play.classList.remove("fa-pause");
        play.classList.add("fa-play");
    }
});

function playNextSong() {
    currentSongIndex = (currentSongIndex + 1) % tracks.length;
    playLibrary({ target: { getAttribute: () => currentSongIndex } });
}

function playPreviousSong() {
    currentSongIndex = (currentSongIndex - 1 + tracks.length) % tracks.length;
    playLibrary({ target: { getAttribute: () => currentSongIndex } });
}

next.addEventListener("click", playNextSong);
previous.addEventListener("click", playPreviousSong);

const volumeIcon = document.querySelector(".vol-icon");

function updateVolumeIcon() {
    let volumeLevel = audio.volume;
    if (volumeLevel === 0) {
        volumeIcon.classList.remove("fa-volume-high");
        volumeIcon.classList.add("fa-volume-mute");
    } else if (volumeLevel < 0.5) {
        volumeIcon.classList.remove("fa-volume-mute");
        volumeIcon.classList.add("fa-volume-low");
    } else {
        volumeIcon.classList.remove("fa-volume-mute");
        volumeIcon.classList.remove("fa-volume-low");
        volumeIcon.classList.add("fa-volume-high");
    }
}

volumeIcon.addEventListener("click", () => {
    if (audio) {
        if (audio.volume === 0) {
            audio.volume = 1;
        } else {
            audio.volume = 0;
        }
        updateVolumeIcon();
    }
});

const volSlider = document.querySelector(".vol-slider");

volSlider.addEventListener("change", (e) => {
    audio.volume = parseInt(e.target.value) / 100;
    updateVolumeIcon();
});

const libraryRows = document.querySelector(".library-rows");
const emptyMsg = document.querySelector(".empty-msg");
const plusSign = document.querySelector(".plus");
const selectBtn = document.querySelectorAll(".selectbtn");
const okBtn = document.querySelector(".ok-btn");

plusSign.addEventListener("click", () => {
    selectBtn.forEach(btn => {
        btn.style.display = "block";
    });

    const cardContainer = document.querySelectorAll(".card-container");
    cardContainer.forEach(card => {
        card.style.backgroundColor = "#540a2f";
    });

    const cardPlay = document.querySelectorAll(".play-btn-container");
    cardPlay.forEach(btn => {
        btn.style.display = "none";
    });

    okBtn.style.display = "block";
    libraryRows.style.display = "block";
    emptyMsg.style.display = "none";
});

okBtn.addEventListener("click", () => {
    selectBtn.forEach(btn => {
        btn.style.display = "none";
        if (libraryRows.innerHTML === "") {
            emptyMsg.style.display = "flex";
        } else {
            emptyMsg.style.display = "none";
        }
    });

    const cardContainer = document.querySelectorAll(".card-container");
    cardContainer.forEach(card => {
        card.style.backgroundColor = "";
    });

    const cardPlay = document.querySelectorAll(".play-btn-container");
    cardPlay.forEach(btn => {
        btn.style.display = "flex";
    });

    okBtn.style.display = "none";
});

selectBtn.forEach((btn, index) => {
    btn.style.backgroundColor = "white";
    btn.addEventListener("click", () => {
        const card = btn.closest(".card");
        const songName = card.querySelector("h5").innerText;

        if (btn.style.backgroundColor === "white") {
            btn.style.backgroundColor = "pink";
            addLibraryRow(songName, index);
        } else {
            btn.style.backgroundColor = "white";
            const rows = document.querySelectorAll('.library-row');
            rows.forEach(row => {
                if (row.querySelector('span').innerText === songName) {
                    row.remove();
                }
            });
        }
    });
});

function addLibraryRow(songName, index) {
    const libraryRow = document.createElement('div');
    libraryRow.className = 'library-row';

    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-music';

    const songTitle = document.createElement('span');
    songTitle.textContent = songName.replace(/\(.*?\)/g, '').trim();

    const playButton = document.createElement('button');
    playButton.className = 'library-play-btn';
    playButton.textContent = 'Play';
    playButton.setAttribute('data-index', index);

    const deleteIcon = document.createElement('i');
    deleteIcon.className = 'fa fa-trash library-delete-icon';
    deleteIcon.style.fontSize = "15px";
    deleteIcon.style.marginLeft = "10px";
    deleteIcon.style.cursor = "pointer";

    libraryRow.appendChild(icon);
    libraryRow.appendChild(songTitle);
    libraryRow.appendChild(playButton);
    libraryRow.appendChild(deleteIcon);
    libraryRow.style.height = "50px";

    libraryRows.appendChild(libraryRow);

    okBtn.style.display = 'block';
}

function playLibrary(event) {
    let index = event.target.getAttribute('data-index');
    currentSongIndex = parseInt(index);

    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }
    audio = new Audio(tracks[index]);
    audio.play();
    updateSongTime();

    play.classList.remove("fa-play");
    play.classList.add("fa-pause");

    let songInfo = document.querySelector(".song-info");
    let songDuration = document.querySelector(".song-duration");
    songInfo.innerText = tracks[index].replace(".mp3", "");
    songDuration.innerText = "00:00 / 00:00";
    playBar.style.display = "flex";
}

// Add event listeners for card play buttons
const libBtns = document.querySelectorAll(".library-play-btn");
for (let btn of libBtns) {
    btn.addEventListener("click", playLibrary);
}

// Ensure library play and delete icons are added dynamically
document.querySelector(".library-rows").addEventListener('click', function (event) {
    if (event.target.classList.contains('library-play-btn')) {
        playLibrary(event);
    } else if (event.target.classList.contains('library-delete-icon')) {
        event.target.parentElement.remove();
        if (libraryRows.children.length === 0) {
            emptyMsg.style.display = "flex";
        }
    }
});

// Sidebar toggle
const leftPanel = document.querySelector(".left-panel");
const bars = document.querySelector(".bars");
const closeBtn = document.querySelector(".close");

function openLeftPanel() {
    leftPanel.style.left = "0";
    leftPanel.style.backgroundColor = "lavender";
    leftPanel.style.width = "80%";
}

function closeLeftPanel() {
    leftPanel.style.left = "-100%";
    security.style.display = "none";
}

bars.addEventListener("click", openLeftPanel);
closeBtn.addEventListener("click", closeLeftPanel);

