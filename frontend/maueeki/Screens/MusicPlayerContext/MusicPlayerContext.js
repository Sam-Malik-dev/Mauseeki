import React, { createContext, useContext, useEffect, useState } from 'react';

import {
  useAudioPlayer,
  useAudioPlayerStatus,
  setAudioModeAsync,
} from 'expo-audio';

const API = `http://${process.env.EXPO_PUBLIC_BACKEND_IP}:8080/Mauseeki`;

const MusicContext = createContext();

export const MusicPlayerProvider = ({ children }) => {
  const [song, setSong] = useState(null);
  const [isPlayerScreen, setIsPlayerScreen] = useState(false);

  const player = useAudioPlayer(
    song ? { uri: song.audioUrl } : null
  );

  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    const setupAudio = async () => {
      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
          shouldPlayInBackground: true,
        });
      } catch (error) {
        console.log('Audio setup error:', error);
      }
    };

    setupAudio();
  }, []);

  useEffect(() => {
    if (song && status.isLoaded) {
      player.play();
    }
  }, [song, status.isLoaded]);

  const playSong = async (id) => {
    try {
      const response = await fetch(`${API}/play/${id}`);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.audioUrl) {
        throw new Error('Song does not have an audio URL');
      }

      setSong(data);
    } catch (error) {
      console.log('playSong error:', error);
    }
  };

  const togglePlayPause = () => {
    if (!status.isLoaded) return;

    if (status.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  const pauseSong = () => {
    if (status.isLoaded) player.pause();
  };

  const resumeSong = () => {
    if (status.isLoaded) player.play();
  };

  const stopSong = () => {
    if (status.isLoaded) {
      player.pause();
      player.seekTo(0);
    }
  };

  const closePlayer = () => {
    if (status.isLoaded) {
      player.pause();
      player.seekTo(0);
    }

    setSong(null);
  };

  return (
    <MusicContext.Provider
      value={{
        song,
        status,
        player,
        playSong,
        togglePlayPause,
        pauseSong,
        resumeSong,
        stopSong,
        closePlayer,
        isPlayerScreen,
        setIsPlayerScreen,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusicPlayer = () => useContext(MusicContext);