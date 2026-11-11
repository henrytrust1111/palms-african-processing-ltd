"use client";

import { useRef, useState } from "react";

export default function WatchVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackError, setPlaybackError] = useState(false);

  async function handlePlay() {
    const video = videoRef.current;
    if (!video) return;

    try {
      await video.play();
      setPlaybackError(false);
    } catch {
      setPlaybackError(true);
    }
  }

  return (
    <div className="video-frame">
      <video
        ref={videoRef}
        controls
        preload="none"
        poster="/assets/video-poster.jpg"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      >
        <source
          src="/assets/Copy%20of%20LBS%20INTERVIEW%20BRANDED.mp4"
          type="video/mp4"
        />
        Your browser does not support embedded video.
      </video>
      <div className="video-shade" aria-hidden="true" />
      {!isPlaying && (
        <button
          className="video-play"
          type="button"
          aria-label="Play founder’s story"
          onClick={handlePlay}
        >
          <svg viewBox="0 0 18 20" aria-hidden="true">
            <path d="M1 1v18l16-9z" />
          </svg>
        </button>
      )}
      {playbackError && (
        <p className="video-error" role="alert">
          The video could not be played. Try again using the video controls.
        </p>
      )}
    </div>
  );
}
