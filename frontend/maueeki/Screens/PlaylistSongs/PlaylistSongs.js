import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';

import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const API_URL = `http://${process.env.EXPO_PUBLIC_BACKEND_IP}:8080/Mauseeki`;

const PlaylistSongs = ({ route }) => {
  const navigation = useNavigation();

  const { playlistId, playlistName } = route.params;

  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  const getPlaylistSongs = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        console.log('Token not found');
        return;
      }

      const response = await fetch(
        `${API_URL}/playlist-songs/${playlistId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSongs(data.songs || []);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log('Songs Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPlaylistSongs();
  }, [playlistId]);

  // Navigate to PlayerScreen with song ID
  const openSong = (song) => {
    navigation.navigate('Play', {
      songId: song._id,
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>
          Loading songs...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back"
            size={27}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <Text
          style={styles.title}
          numberOfLines={1}
        >
          {playlistName}
        </Text>

        <View style={{ width: 27 }} />
      </View>

      <Text style={styles.songTotal}>
        {songs.length} songs
      </Text>

      {/* No Songs */}
      {songs.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons
            name="musical-notes-outline"
            size={55}
            color="#A0A0A0"
          />

          <Text style={styles.emptyText}>
            No songs in this playlist
          </Text>
        </View>
      ) : (

        /* Songs */
        <FlatList
          data={songs}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.song}
              onPress={() => openSong(item)}
              activeOpacity={0.7}
            >
              <Image
                source={{
                  uri: item.coverImage,
                }}
                style={styles.cover}
              />

              <View style={styles.songInfo}>
                <Text
                  style={styles.songTitle}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>

                <Text
                  style={styles.artist}
                  numberOfLines={1}
                >
                  {item.artist?.artistname ||
                    'Unknown Artist'}
                </Text>

                <Text style={styles.language}>
                  {item.language || 'Unknown'}
                </Text>
              </View>

              <Ionicons
                name="play-circle"
                size={35}
                color="#E50914"
              />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default PlaylistSongs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080808',
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 55,
    paddingBottom: 15,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '700',
    maxWidth: '75%',
  },

  songTotal: {
    color: '#A0A0A0',
    fontSize: 14,
    marginBottom: 20,
  },

  song: {
    backgroundColor: '#151515',
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  cover: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },

  songInfo: {
    flex: 1,
    marginLeft: 13,
    marginRight: 10,
  },

  songTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  artist: {
    color: '#A0A0A0',
    fontSize: 13,
    marginTop: 4,
  },

  language: {
    color: '#666666',
    fontSize: 12,
    marginTop: 3,
  },

  loading: {
    color: '#A0A0A0',
    textAlign: 'center',
    marginTop: 100,
  },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
  },

  emptyText: {
    color: '#A0A0A0',
    fontSize: 16,
    marginTop: 15,
  },
});