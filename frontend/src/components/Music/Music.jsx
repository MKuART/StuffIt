import React, { useState } from "react";
import ReactPlayer from "react-player";
import "./music.css";

const Music = ({ showMusic }) => {
  const [playing, setPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [count, setCount] = useState(0.1);
  const [loop, setLoop] = useState(false);
  const songs = ["https://www.youtube.com/watch?v=jfKfPfyJRdk&ab_channel=LofiGirl",
  "https://www.youtube.com/watch?v=DykZEOV5wD4&ab_channel=NicholasHird", 
  "https://www.youtube.com/watch?v=pGwzgcci7tw&ab_channel=1Ola",
  "https://www.youtube.com/watch?v=XE3LlgzwUQg&ab_channel=ClassicalMastermind",
  "https://www.youtube.com/watch?v=4cEKAYnxbrk&ab_channel=ChillMusicLab",
  "https://www.youtube.com/watch?v=R9QPKZlq9es&ab_channel=super"
  ];

  const handlePlay = () => {
    setPlaying(true);
  };

  const handleStop = () => {
    setPlaying(false);
  };

  const handleNextSong = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
  };

  const handlePreviousSong = () => {
    setCurrentSongIndex((prevIndex) =>
      prevIndex === 0 ? songs.length - 1 : prevIndex - 1
    );
  };

  const isLoop = () => {
    setLoop((prevMode) => !prevMode);
  };

  return (
    <div style={{ visibility: !showMusic ? "visible" : "hidden" }}>
      <ReactPlayer
        style={{ display: "none" }}
        url={songs[currentSongIndex]}
        playing={playing}
        controls
        loop={loop}
        volume={count}
        onEnded={handleNextSong}
        
      />

      <>
        <div className="music-player">
          <button className="player-button" onClick={isLoop}>
            <i className="fa-solid fa-rotate-left"></i>
          </button>
          <button
            className="player-button"
            onClick={() => setCount(count - 0.05)}
          >
            <i className="fa-solid fa-minus"></i>
          </button>
          <button className="player-button" onClick={handlePreviousSong}>
            <i className="fa-solid fa-backward"></i>
          </button>
          {playing ? (
            <button className="player-button" onClick={handleStop}>
              <i className="fa-solid fa-pause"></i>
            </button>
          ) : (
            <button className="player-button" onClick={handlePlay}>
              <i className="fa-solid fa-play"></i>
            </button>
          )}
          <button className="player-button" onClick={handleNextSong}>
            <i className="fa-solid fa-forward"></i>
          </button>
          <button
            className="player-button"
            onClick={() => setCount(count + 0.05)}
          >
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>
      </>
    </div>
  );
};

export default Music;
