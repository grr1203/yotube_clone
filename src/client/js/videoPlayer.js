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
  playBtn.innerText = video.paused ? "Play" : "Pause";
};

const handleMute = (event) => {
  video.muted = !video.muted;
  muteBtn.innerText = video.muted ? "Unmute" : "Mute";

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
  new Date(seconds * 1000).toISOString().substring(11, 19);

const handleTimelineChange = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

const handleFullScreen = () => {
  const fullscreen = document.fullscreenElement;

  if (fullscreen) {
    document.exitFullscreen();
    fullScreenBtn.innerText = "Enter Full Screen";
  } else {
    videoContainer.requestFullscreen();
    fullScreenBtn.innerText = "Exit Full Screen";
  }
};

const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
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

play.addEventListener("click", handlePlayClick);
mute.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("mousemove", handleMouseMove);
video.addEventListener("ended", handleEnded);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullScreen);
