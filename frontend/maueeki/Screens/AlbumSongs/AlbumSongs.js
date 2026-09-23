import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = `http://${process.env.EXPO_PUBLIC_BACKEND_IP}:8080/Mauseeki`;

const AlbumSongs = ({ route }) => {
  const navigation = useNavigation();
  const { albumId } = route.params;

  const [songs, setSongs] = useState([]);
  const [album, setAlbum] = useState(null);
  const [playingId, setPlayingId] = useState(null);
  const [isSaved, setIsSaved] = useState(true);

  useEffect(() => {
    if (!albumId) return;

    const loadData = async () => {
      try {
        const [songsRes, albumRes] = await Promise.all([
          fetch(`${API}/album-allsongs/${albumId}`),
          fetch(`${API}/this-album/${albumId}`),
        ]);

        const songsData = await songsRes.json();
        const albumData = await albumRes.json();

        if (songsRes.ok) {
          setSongs(
            Array.isArray(songsData)
              ? songsData
              : songsData.songs || []
          );
        }

        if (albumRes.ok) {
          setAlbum(albumData);
        }
      } catch (error) {
        console.log('LOAD ERROR:', error);
        setSongs([]);
        setAlbum(null);
      }
    };

    loadData();
  }, [albumId]);

  // ADD SONG TO RECENT
  const addRecent = async (songId) => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        console.log('No token found');
        return;
      }

      const res = await fetch(
        `${API}/add-recent/${songId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await res.json();

      console.log('RECENT STATUS:', res.status);
      console.log('RECENT DATA:', data);
    } catch (error) {
      console.log('RECENT ERROR:', error);
    }
  };

  const playSong = async (song) => {
    if (!song?._id) return;

    if (playingId === song._id) {
      setPlayingId(null);
      return;
    }

    setPlayingId(song._id);

    // Add to recently played
    await addRecent(song._id);

    navigation.navigate('Play', {
      songId: song._id,
    });
  };

  const saveAlbum = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        Alert.alert(
          'Login Required',
          'Please login first'
        );
        return;
      }

      const res = await fetch(
        `${API}/Addtofav/${albumId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        Alert.alert(
          'Error',
          data.message || 'Something went wrong'
        );
        return;
      }

      setIsSaved((prev) => !prev);

      Alert.alert(
        'Success',
        data.message || 'Favorite updated'
      );
    } catch (error) {
      console.log(error);
      Alert.alert(
        'Error',
        'Unable to connect to server'
      );
    }
  };

  const renderSong = ({ item }) => {
    const playing = playingId === item._id;

    return (
      <View style={styles.songCard}>
        <Image
          source={{ uri: item.coverImage }}
          style={styles.songImage}
        />

        <View style={styles.songInfo}>
          <Text
            style={styles.songTitle}
            numberOfLines={1}
          >
            {item.title}
          </Text>

          <Text
            style={styles.language}
            numberOfLines={1}
          >
            {item.artistname ||
              item.language ||
              'Unknown Language'}
          </Text>

          <Text
            style={styles.genre}
            numberOfLines={1}
          >
            {item.genre ||
              item.category ||
              'Unknown'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.playButton}
          activeOpacity={0.7}
          onPress={() => playSong(item)}
        >
          <Ionicons
            name={playing ? 'pause' : 'play'}
            size={20}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={songs}
        renderItem={renderSong}
        keyExtractor={(item, index) =>
          item._id || index.toString()
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
        removeClippedSubviews={true}
        ListHeaderComponent={
          <>
            <Text style={styles.heading}>
              Album's Songs
            </Text>

            {album ? (
              <View style={styles.albumCard}>
                <Image
                  source={{ uri: album.thumbnail }}
                  style={styles.albumImage}
                />

                <View style={styles.albumBottom}>
                  <View style={styles.albumInfo}>
                    <Text
                      style={styles.albumTitle}
                      numberOfLines={1}
                    >
                      {album.albumtitle}
                    </Text>

                    <Text
                      style={styles.albumArtist}
                      numberOfLines={1}
                    >
                      {album.artist?.artistname ||
                        'Unknown Artist'}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={saveAlbum}
                  >
                    <Ionicons
                      name={
                        isSaved
                          ? 'bookmark'
                          : 'bookmark-outline'
                      }
                      size={24}
                      color="#FFFFFF"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <Text style={styles.empty}>
                No Album
              </Text>
            )}

            <Text style={styles.sectionTitle}>
              Album Songs
            </Text>
          </>
        }
        ListEmptyComponent={
          <Text style={styles.empty}>
            No songs found
          </Text>
        }
      />
    </View>
  );
};

export default AlbumSongs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080808',
    paddingHorizontal: 16,
  },

  content: {
    paddingBottom: 30,
  },

  heading: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 20,
  },

  albumCard: {
    height: 270,
    backgroundColor: '#151515',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 25,
  },

  albumImage: {
    width: '100%',
    height: '100%',
  },

  albumBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },

  albumInfo: {
    flex: 1,
    marginRight: 10,
  },

  albumTitle: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '800',
  },

  albumArtist: {
    color: '#A0A0A0',
    fontSize: 13,
    marginTop: 5,
  },

  saveButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#E50914',
    alignItems: 'center',
    justifyContent: 'center',
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '700',
    marginBottom: 12,
  },

  songCard: {
    backgroundColor: '#151515',
    borderRadius: 12,
    padding: 9,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  songImage: {
    width: 65,
    height: 65,
    borderRadius: 10,
  },

  songInfo: {
    flex: 1,
    marginHorizontal: 12,
  },

  songTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  language: {
    color: '#E50914',
    fontSize: 12,
    marginTop: 5,
  },

  genre: {
    color: '#A0A0A0',
    fontSize: 11,
    marginTop: 3,
  },

  playButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E50914',
    alignItems: 'center',
    justifyContent: 'center',
  },

  empty: {
    color: '#A0A0A0',
    textAlign: 'center',
    marginVertical: 25,
  },
});