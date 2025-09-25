   const background = {
  image: "images/early morning.jpg"
};
let bgContainer = null;
let ytPlayers = [];


function encodeUrl(url) {
  return encodeURI(url);
}

function ensureBgContainer() {
  if (bgContainer) return bgContainer;

  bgContainer = document.createElement("div");
  bgContainer.id = "bg-container-js";
  Object.assign(bgContainer.style, {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: "-1",
    pointerEvents: "none",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundImage: `url("${encodeUrl(background.image)}")`
  });

  document.body.prepend(bgContainer);
  return bgContainer;
}


function getEmbedUrl(url) {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes("youtube.com") && urlObj.searchParams.get("v")) {
      const videoId = urlObj.searchParams.get("v");
      const list = urlObj.searchParams.get("list");
      let embedUrl = `https://www.youtube.com/embed/${videoId}`;
      if (list) embedUrl += `?list=${list}`;
      return embedUrl;
    } else if (urlObj.hostname === "youtu.be") {
      const videoId = urlObj.pathname.slice(1);
      return `https://www.youtube.com/embed/${videoId}`;
    }
  } catch (e) {
    console.warn("Invalid YouTube URL:", url);
  }
  return url; 
}


function initYouTubeOverlay() {
  const videoContainers = document.querySelectorAll(".profile-pic");

  videoContainers.forEach((container) => {
    const iframe = container.querySelector("iframe");
    if (!iframe) return;

    
    iframe.src = getEmbedUrl(iframe.src);

    
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.borderRadius = "20px";
    iframe.style.objectFit = "cover";

    
    const playOverlay = document.createElement("div");
    playOverlay.className = "play-btn-overlay";
    playOverlay.textContent = "▶";
    container.appendChild(playOverlay);

    
    const player = new YT.Player(iframe, {
      events: {
        onStateChange: (event) => {
          if (event.data === YT.PlayerState.PLAYING) {
            playOverlay.style.opacity = 0; 
          } else {
            playOverlay.style.opacity = 1; 
          }
        }
      }
    });

    ytPlayers.push(player);

    playOverlay.addEventListener("click", () => {
      player.playVideo();
    });
  });
}

function initBackground() {
  ensureBgContainer();

  if (document.querySelector(".profile-pic iframe")) {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    window.onYouTubeIframeAPIReady = initYouTubeOverlay;
  }
}

document.addEventListener("DOMContentLoaded", initBackground);
