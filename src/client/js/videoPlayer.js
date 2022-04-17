const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const volumeRange = document.getElementById("volume");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let controlsTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayClick = (event) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtn.querySelector("i").classList = video.paused
    ? "fas fa-play"
    : "fas fa-pause";
};

const handleMute = (event) => {
  video.muted = !video.muted;
  muteBtn.querySelector("i").classList = video.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";

  volumeRange.value = video.muted ? 0 : volumeValue;
};

const handlePause = () => {
  playBtn.innerText = "Pause";
};
const handlePlay = () => {
  playBtn.innerText = "Play";
};

const handleVolumeChange = (event) => {
  const {
    target: { value },
  } = event;
  if (video.muted) {
    video.muted = false;
    muteBtn.innerText = "Mute";
  }
  volumeValue = value;
  video.volume = value;
};

const handleLoadedMetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
};
const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};
const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substring(14, 19);

const handleTimelineChange = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

const handleFullScreen = () => {
  const fullscreen = document.fullscreenElement;
  const fullScreenIcon = fullScreenBtn.querySelector("i");

  if (fullscreen) {
    document.exitFullscreen();
    fullScreenIcon.classList = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullScreenIcon.classList = "fas fa-compress";
  }
};

const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  videoContainer.focus();
  videoControls.classList.add("showing");

  controlsTimeout = setTimeout(hideControls, 3000);
};
const hideControls = () => {
  videoControls.classList.remove("showing");
};

const handleEnded = () => {
  const { id } = videoContainer.dataset;
  fetch(`/api/videos/${id}/view`, { method: "POST" });
};

const handleKeyDown = (event) => {
  if (event.key === " ") {
    handlePlayClick();
  } else if (event.key === "f" || event.key === "F") {
    handleFullScreen();
  }
};

play.addEventListener("click", handlePlayClick);
mute.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("click", handlePlayClick);
video.addEventListener("ended", handleEnded);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("keydown", handleKeyDown);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullScreen);
