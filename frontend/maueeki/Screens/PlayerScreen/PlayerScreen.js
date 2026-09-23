import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  FlatList,
} from 'react-native';

import React, { useCallback, useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useMusicPlayer } from '../MusicPlayerContext/MusicPlayerContext';

const API_URL = `http://${process.env.EXPO_PUBLIC_BACKEND_IP}:8080/Mauseeki`;

const PlayerScreen = ({ route }) => {
  const { songId } = route.params;

  const [liked, setLiked] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [playlistModal, setPlaylistModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [playlistName, setPlaylistName] = useState('');

  const {
    song,
    status,
    playSong,
    togglePlayPause,
    setIsPlayerScreen,
  } = useMusicPlayer();

  useFocusEffect(
    useCallback(() => {
      setIsPlayerScreen(true);

      return () => setIsPlayerScreen(false);
    }, [])
  );

  useEffect(() => {
    if (songId) {
      playSong(songId);
    }
  }, [songId]);

  const likeSong = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        Alert.alert('Login Required', 'Please login first');
        return;
      }

      const response = await fetch(`${API_URL}/like/${songId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setLiked(true);
      } else {
        Alert.alert('Error', data.message || 'Failed to like song');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to connect to server');
    }
  };

  const showPlaylists = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        Alert.alert('Login Required', 'Please login first');
        return;
      }

      const response = await fetch(`${API_URL}/my-playlists`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setPlaylists(data.playlists || []);
        setPlaylistModal(true);
      } else {
        Alert.alert('Error', data.message || 'Failed to get playlists');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to connect to server');
    }
  };

  const addToPlaylist = async (playlistId) => {
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await fetch(
        `${API_URL}/add-song/${playlistId}/${songId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setPlaylistModal(false);
        Alert.alert('Success', 'Song added to playlist');
      } else {
        Alert.alert('Error', data.message || 'Failed to add song');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to connect to server');
    }
  };

  const createPlaylist = async () => {
    if (!playlistName.trim()) {
      Alert.alert('Error', 'Enter playlist name');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');

      const response = await fetch(
        `${API_URL}/add-playlist/${songId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: playlistName.trim(),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setPlaylistName('');
        setCreateModal(false);
        setPlaylistModal(false);

        Alert.alert(
          'Success',
          'Playlist created and song added successfully'
        );
      } else {
        Alert.alert(
          'Error',
          data.message || 'Failed to create playlist'
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to connect to server');
    }
  };

  const formatTime = (seconds) => {
    if (!seconds) return '0:00';

    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);

    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  if (!song) {
    return (
      <View style={styles.player}>
        <Text style={styles.loading}>Loading...</Text>
      </View>
    );
  }

  const currentTime = status?.currentTime || 0;
  const duration = status?.duration || 0;

  const progress = duration
    ? (currentTime / duration) * 100
    : 0;

  return (
    <View style={styles.player}>

      <Image
        source={{ uri: song.coverImage }}
        style={styles.image}
      />

      <Text style={styles.title}>{song.title}</Text>

      <Text style={styles.artist}>
        Artist: {song.artist?.artistname || 'Unknown Artist'}
      </Text>

      <Text style={styles.album}>
        Album: {song.album?.albumtitle || 'Unknown Album'}
      </Text>

      <View style={styles.progressBox}>
        <View
          style={[
            styles.progress,
            {
              width: `${Math.min(progress, 100)}%`,
            },
          ]}
        />
      </View>

      <View style={styles.time}>
        <Text style={styles.timeText}>
          {formatTime(currentTime)}
        </Text>

        <Text style={styles.timeText}>
          {formatTime(duration)}
        </Text>
      </View>

      <View style={styles.buttons}>

        <TouchableOpacity
          style={styles.action}
          onPress={likeSong}
        >
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={30}
            color={liked ? '#E50914' : '#A0A0A0'}
          />

          <Text style={styles.actionText}>
            {liked ? 'Liked' : 'Like'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.playButton}
          onPress={togglePlayPause}
          disabled={!status?.isLoaded}
        >
          <Ionicons
            name={status?.playing ? 'pause' : 'play'}
            size={32}
            color="#151B1D"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.action}
          onPress={showPlaylists}
        >
          <Ionicons
            name="add-circle-outline"
            size={30}
            color="#A0A0A0"
          />

          <Text style={styles.actionText}>
            Playlist
          </Text>
        </TouchableOpacity>

      </View>

      {/* Playlist Modal */}

      <Modal
        visible={playlistModal}
        transparent
        animationType="slide"
        onRequestClose={() => setPlaylistModal(false)}
      >
        <View style={styles.modalBackground}>

          <View style={styles.modalBox}>

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Add to Playlist
              </Text>

              <TouchableOpacity
                onPress={() => setPlaylistModal(false)}
              >
                <Ionicons
                  name="close"
                  size={25}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.createPlaylistButton}
              onPress={() => setCreateModal(true)}
            >
              <Ionicons
                name="add"
                size={22}
                color="#FFFFFF"
              />

              <Text style={styles.createPlaylistText}>
                Create New Playlist
              </Text>
            </TouchableOpacity>

            <FlatList
              data={playlists}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.playlistItem}
                  onPress={() => addToPlaylist(item._id)}
                >
                  <View style={styles.playlistIcon}>
                    <Ionicons
                      name="list"
                      size={22}
                      color="#E50914"
                    />
                  </View>

                  <View>
                    <Text style={styles.playlistName}>
                      {item.name}
                    </Text>

                    <Text style={styles.songCount}>
                      {item.songs?.length || 0} songs
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  No playlists found
                </Text>
              }
            />

          </View>

        </View>
      </Modal>

      {/* Create Playlist Modal */}

      <Modal
        visible={createModal}
        transparent
        animationType="fade"
        onRequestClose={() => setCreateModal(false)}
      >
        <View style={styles.modalBackground}>

          <View style={styles.createModalBox}>

            <Text style={styles.modalTitle}>
              Create Playlist
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Playlist name"
              placeholderTextColor="#777777"
              value={playlistName}
              onChangeText={setPlaylistName}
            />

            <View style={styles.createButtons}>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setCreateModal(false)}
              >
                <Text style={styles.cancelText}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.createButton}
                onPress={createPlaylist}
              >
                <Text style={styles.createText}>
                  Create
                </Text>
              </TouchableOpacity>

            </View>

          </View>

        </View>
      </Modal>

    </View>
  );
};

export default PlayerScreen;

const styles = StyleSheet.create({
  player: {
    flex: 1,
    backgroundColor: '#080808',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },

  loading: {
    color: '#A0A0A0',
    fontSize: 20,
  },

  image: {
    width: 300,
    height: 400,
    borderRadius: 25,
    marginBottom: 25,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  artist: {
    color: '#A0A0A0',
    fontSize: 17,
    marginTop: 8,
  },

  album: {
    color: '#A0A0A0',
    fontSize: 16,
    marginTop: 5,
  },

  progressBox: {
    width: '100%',
    height: 5,
    backgroundColor: '#A0A0A0',
    marginTop: 25,
    overflow: 'hidden',
  },

  progress: {
    height: '100%',
    backgroundColor: '#E50914',
  },

  time: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },

  timeText: {
    color: '#A0A0A0',
    fontSize: 12,
  },

  buttons: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 30,
  },

  action: {
    alignItems: 'center',
  },

  actionText: {
    color: '#A0A0A0',
    fontSize: 12,
    marginTop: 5,
  },

  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E50914',
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },

  modalBox: {
    backgroundColor: '#151515',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    maxHeight: '70%',
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  modalTitle: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '700',
  },

  createPlaylistButton: {
    backgroundColor: '#E50914',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  createPlaylistText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 10,
  },

  playlistItem: {
    backgroundColor: '#252525',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  playlistIcon: {
    width: 45,
    height: 45,
    borderRadius: 10,
    backgroundColor: '#151515',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  playlistName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },

  songCount: {
    color: '#888888',
    fontSize: 12,
    marginTop: 3,
  },

  emptyText: {
    color: '#888888',
    textAlign: 'center',
    padding: 20,
  },

  createModalBox: {
    backgroundColor: '#151515',
    margin: 25,
    borderRadius: 18,
    padding: 20,
  },

  input: {
    backgroundColor: '#252525',
    color: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    marginTop: 20,
    marginBottom: 20,
  },

  createButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },

  cancelButton: {
    padding: 13,
    paddingHorizontal: 18,
  },

  cancelText: {
    color: '#A0A0A0',
    fontWeight: '600',
  },

  createButton: {
    backgroundColor: '#E50914',
    padding: 13,
    paddingHorizontal: 20,
    borderRadius: 10,
  },

  createText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});