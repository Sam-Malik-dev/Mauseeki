import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = `http://${process.env.EXPO_PUBLIC_BACKEND_IP}:8080/Mauseeki`;

const YourAlbumSongs = ({ route }) => {
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

        setSongs(
          Array.isArray(songsData)
            ? songsData
            : songsData.songs || songsData.albums || []
        );

        if (albumRes.ok) setAlbum(albumData);
      } catch (error) {
        console.log('ALBUM ERROR:', error);
      }
    };

    loadData();
  }, [albumId]);

  const playSong = item => {
    if (playingId === item._id) {
      setPlayingId(null);
      return;
    }

    setPlayingId(item._id);
    navigation.navigate('Play', { songId: item._id });
  };

  const saveAlbum = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        Alert.alert('Login Required', 'Please login first');
        return;
      }

      const res = await fetch(`${API}/Addtofav/${albumId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        setIsSaved(!isSaved);
        Alert.alert('Success', data.message || 'Favourite updated');
      } else {
        Alert.alert('Error', data.message || 'Something went wrong');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Unable to connect to server');
    }
  };

  const addMoreSongs = () => {
    if (!albumId) {
      Alert.alert('Error', 'Album ID not found');
      return;
    }

    navigation.navigate('add-songs', { albumId });
  };

  const renderSong = ({ item }) => (
    <View style={styles.song}>
      <Image
        source={{ uri: item.coverImage }}
        style={styles.songImage}
      />

      <View style={styles.songInfo}>
        <Text style={styles.songTitle} numberOfLines={1}>
          {item.title || 'Unknown Song'}
        </Text>

        <Text style={styles.language} numberOfLines={1}>
          {item.artistname || item.language || 'Unknown Language'}
        </Text>

        <Text style={styles.genre} numberOfLines={1}>
          {item.genre || item.category || 'Unknown'}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.play}
        onPress={() => playSong(item)}
      >
        <Ionicons
          name={playingId === item._id ? 'pause' : 'play'}
          size={20}
          color="#FFFFFF"
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={songs}
        renderItem={renderSong}
        keyExtractor={(item, index) => item._id || index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <>
            <Text style={styles.header}>Album's Songs</Text>

            {album ? (
              <View style={styles.album}>
                <Image
                  source={{ uri: album.thumbnail }}
                  style={styles.albumImage}
                />

                <View style={styles.overlay}>
                  <View style={styles.details}>
                    <Text style={styles.albumTitle} numberOfLines={1}>
                      {album.albumtitle}
                    </Text>

                    <Text style={styles.artist}>
                      {album.artist?.artistname || 'Unknown Artist'}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.save}
                    onPress={saveAlbum}
                  >
                    <Ionicons
                      name={isSaved ? 'bookmark' : 'bookmark-outline'}
                      size={25}
                      color="#E50914"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <Text style={styles.empty}>No Album</Text>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Album Songs</Text>

              <TouchableOpacity
                style={styles.add}
                onPress={addMoreSongs}
              >
                <Ionicons name="add" size={18} color="#FFFFFF" />
                <Text style={styles.addText}>Add More</Text>
              </TouchableOpacity>
            </View>
          </>
        }
        ListEmptyComponent={
          <Text style={styles.empty}>No songs found...</Text>
        }
      />
    </View>
  );
};

export default YourAlbumSongs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080808',
    paddingHorizontal: 16,
  },

  list: {
    paddingBottom: 30,
  },

  header: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 20,
  },

  album: {
    height: 280,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#151515',
    marginBottom: 25,
  },

  albumImage: {
    width: '100%',
    height: '100%',
  },

  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },

  details: {
    flex: 1,
  },

  albumTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },

  artist: {
    color: '#A0A0A0',
    marginTop: 4,
  },

  save: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#151515',
    alignItems: 'center',
    justifyContent: 'center',
  },

  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '700',
  },

  add: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E50914',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },

  addText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },

  song: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#151515',
    padding: 10,
    borderRadius: 14,
    marginBottom: 10,
  },

  songImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#222222',
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
    color: '#A0A0A0',
    fontSize: 13,
    marginTop: 4,
  },

  genre: {
    color: '#E50914',
    fontSize: 11,
    marginTop: 3,
  },

  play: {
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
    marginVertical: 30,
  },
});
