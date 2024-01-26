/* Images created by: https://unsplash.com/@pawel_czerwinski */

// DOM Elements
const music = document.querySelector("audio");
const img = document.querySelector("img");
const title = document.querySelector(".title");
const artist = document.querySelector(".artist");

const prevButton = document.querySelector("#prev");
const playButton = document.querySelector("#play");
const nextButton = document.querySelector("#next");
const shuffleButton = document.querySelector("#shuffle");
const repeatButton = document.querySelector("#repeat");

const progressContainer = document.getElementById("progress-container");
const progress = document.getElementById("progress");

// Paths
const basePath = "music/";
const albumArtPath = "albumArt/";

// State
let isPlaying = false;
let onRepeat = false;

// Songs
const songs = [
  { name: "music-1", displayName: "Song 1", artist: "Artist 1 name" },
  { name: "music-2", displayName: "Song 2", artist: "Artist 2 name" },
  { name: "music-3", displayName: "Song 3", artist: "Artist 3 name" },
  { name: "music-4", displayName: "Song 4", artist: "Artist 4 name" },
];
let songIndex = 0;

// Event Listeners
playButton.addEventListener("click", playPauseSong);
nextButton.addEventListener("click", nextSong);
prevButton.addEventListener("click", prevSong);
repeatButton.addEventListener("click", toggleRepeat);
music.addEventListener("timeupdate", updateProgressBar);
music.addEventListener("ended", handleSongEnd);
progressContainer.addEventListener("click", setProgressBarTime);
shuffleButton.addEventListener("click", shuffleSong);

// Functions
function playSong() {
  playButton.classList.replace("fa-play", "fa-pause");
  playButton.setAttribute("title", "Pause");
  music.play();
  isPlaying = true;
}

function pauseSong() {
  playButton.classList.replace("fa-pause", "fa-play");
  playButton.setAttribute("title", "Play");
  music.pause();
  isPlaying = false;
}

function playPauseSong() {
  isPlaying ? pauseSong() : playSong();
}

function toggleRepeat() {
  onRepeat = !onRepeat;
  repeatButton.classList.toggle("active", onRepeat);
}

function updateProgressBar(e) {
  if (isPlaying) {
    const { duration, currentTime } = e.srcElement;
    const formattedTime = formatTime(currentTime);
    const currentTimeSpan = document.getElementById("current-time");
    currentTimeSpan.textContent = formattedTime;

    let totalDurationMins = Math.floor(duration / 60);
    let totalDurationSeconds = Math.floor(duration % 60);
    totalDurationSeconds =
      totalDurationSeconds < 10
        ? `0${totalDurationSeconds}`
        : totalDurationSeconds;

    const totalTimeSpan = document.getElementById("duration");
    if (totalDurationSeconds) {
      totalDurationMins =
        totalDurationMins < 10 ? `0${totalDurationMins}` : totalDurationMins;
      totalTimeSpan.textContent = `${totalDurationMins}:${totalDurationSeconds}`;
    }

    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
  }
}

function formatTime(seconds) {
  const format = (val) => `0${Math.floor(val)}`.slice(-2);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${format(hours)}:${format(minutes)}:${format(remainingSeconds)}`;
  } else {
    return `${format(minutes)}:${format(remainingSeconds)}`;
  }
}

function setProgressBarTime(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const { duration } = music;
  music.currentTime = (clickX / width) * duration;
}

function updateCurrentTimeSpan(time) {
  const currentTimeSpan = document.getElementById("current-time");
  currentTimeSpan.textContent = formatTime(time);
}

function loadSong(song) {
  title.textContent = song.displayName;
  artist.textContent = song.artist;
  music.src = `${basePath}${song.name}.mp3`;
  img.src = `${albumArtPath}${song.name}.jpg`;
  updateCurrentTimeSpan(0);
}

function shuffleSong() {
  const randomIndex = Math.floor(Math.random() * songs.length);
  const randomSong = songs[randomIndex];
  pauseSong();
  loadSong(randomSong);
  music.currentTime = 0;
  isPlaying = false;
}

function nextSong() {
  songIndex = (songIndex + 1) % songs.length;
  isPlaying = true;
  pauseSong();
  loadSong(songs[songIndex]);
  music.currentTime = 0;
  playSong();
}

function prevSong() {
  songIndex = (songIndex - 1 + songs.length) % songs.length;
  isPlaying = true;
  pauseSong();
  loadSong(songs[songIndex]);
  music.currentTime = 0;
  playSong();
}

function handleSongEnd() {
  if (onRepeat) {
    music.currentTime = 0;
    prevSong();
  } else {
    nextSong();
  }
}

// Initial Load
loadSong(songs[songIndex]);
