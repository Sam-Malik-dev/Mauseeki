import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = () => {
  const navigation = useNavigation();

  const [artist, setArtist] = useState([]);
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = `http://${process.env.EXPO_PUBLIC_BACKEND_IP}:8080/Mauseeki`;

  const getData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const [artistRes, songRes, albumRes, recentRes] =
        await Promise.all([
          fetch(`${API}/five-artist`),
          fetch(`${API}/10-rand`),
          fetch(`${API}/rand-album`),
          fetch(`${API}/recently-played`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

      const [
        artistData,
        songData,
        albumData,
        recentData,
      ] = await Promise.all([
        artistRes.json(),
        songRes.json(),
        albumRes.json(),
        recentRes.json(),
      ]);

      setArtist(
        Array.isArray(artistData)
          ? artistData
          : artistData.artists || []
      );

      setSongs(
        Array.isArray(songData)
          ? songData
          : songData.songs || []
      );

      setAlbums(
        Array.isArray(albumData)
          ? albumData
          : albumData.albums || []
      );

      setRecent(
        Array.isArray(recentData)
          ? recentData
          : recentData.songs || []
      );
    } catch (error) {
      console.log('HOME ERROR:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [])
  );

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

    // Add to recently played
    await addRecent(song._id);

    // Open player
    navigation.navigate('Play', {
      songId: song._id,
    });
  };

  const Header = ({ title, route }) => (
    <View style={styles.header}>
      <Text style={styles.heading}>{title}</Text>

      <TouchableOpacity
        onPress={() => navigation.navigate(route)}
      >
        <Text style={styles.seeAll}>See All</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator
          size="large"
          color="#E50914"
        />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.home}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      data={songs.slice(0, 5)}
      keyExtractor={(item) => item._id}

      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.song}
          activeOpacity={0.8}
          onPress={() => playSong(item)}
        >
          <Image
            source={{ uri: item.coverImage }}
            style={styles.songImage}
          />

          <View style={styles.songInfo}>
            <Text
              style={styles.text}
              numberOfLines={1}
            >
              {item.title}
            </Text>

            <Text
              style={styles.subText}
              numberOfLines={1}
            >
              {item.language ||
                item.artist ||
                'Unknown Artist'}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => playSong(item)}
            hitSlop={10}
          >
            <Ionicons
              name="play-circle"
              size={30}
              color="#E50914"
            />
          </TouchableOpacity>
        </TouchableOpacity>
      )}

      ListHeaderComponent={
        <>
          {/* Artists */}

          <Header
            title="Popular Artists"
            route="all-artists"
          />

          <FlatList
            horizontal
            data={artist.slice(0, 5)}
            keyExtractor={(item) => item._id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontal}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.artist}
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate('artist', {
                    artistId: item._id,
                  })
                }
              >
                <Image
                  source={{ uri: item.image }}
                  style={styles.artistImage}
                />

                <Text
                  style={styles.text}
                  numberOfLines={1}
                >
                  {item.artistname}
                </Text>
              </TouchableOpacity>
            )}
          />

          {/* Albums */}

          <Header
            title="Popular Albums"
            route="all-albums"
          />

          <FlatList
            horizontal
            data={albums.slice(0, 5)}
            keyExtractor={(item) => item._id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontal}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.album}
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate('albumSongs', {
                    albumId: item._id,
                  })
                }
              >
                <Image
                  source={{ uri: item.thumbnail }}
                  style={styles.albumImage}
                />

                <Text
                  style={styles.text}
                  numberOfLines={1}
                >
                  {item.albumtitle}
                </Text>
              </TouchableOpacity>
            )}
          />

          {/* Recently Played */}

          {recent.length > 0 && (
            <>
              <Text
                style={[
                  styles.heading,
                  styles.recentHeading,
                ]}
              >
                Recently Played
              </Text>

              <FlatList
                horizontal
                data={recent}
                keyExtractor={(item) => item._id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontal}
                renderItem={({ item }) => {
                  const song = item.songId;

                  if (!song) return null;

                  return (
                    <TouchableOpacity
                      style={styles.recent}
                      activeOpacity={0.85}
                      onPress={() => playSong(song)}
                    >
                      <Image
                        source={{
                          uri: song.coverImage,
                        }}
                        style={styles.recentImage}
                      />

                      <View
                        style={styles.recentOverlay}
                      >
                        <Text
                          style={styles.recentTitle}
                          numberOfLines={1}
                        >
                          {song.title}
                        </Text>

                        <Text
                          style={styles.recentSub}
                          numberOfLines={1}
                        >
                          {song.language ||
                            song.artist ||
                            'Unknown Artist'}
                        </Text>
                      </View>

                      <View
                        style={styles.recentPlay}
                      >
                        <Ionicons
                          name="play"
                          size={19}
                          color="#fff"
                        />
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            </>
          )}

          {/* Recommended */}

          <Header
            title="Recommended For You"
            route="songs"
          />
        </>
      }
    />
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  home: {
    flex: 1,
    backgroundColor: '#080808',
  },

  loading: {
    flex: 1,
    backgroundColor: '#080808',
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    padding: 16,
    paddingTop: 50,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 14,
  },

  heading: {
    color: '#fff',
    fontSize: 21,
    fontWeight: '700',
  },

  seeAll: {
    color: '#E50914',
    fontSize: 13,
    fontWeight: '600',
  },

  horizontal: {
    paddingRight: 10,
  },

  artist: {
    width: 100,
    alignItems: 'center',
    marginRight: 12,
  },

  artistImage: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#151515',
    marginBottom: 7,
  },

  album: {
    width: 145,
    marginRight: 12,
  },

  albumImage: {
    width: 140,
    height: 140,
    borderRadius: 12,
    backgroundColor: '#151515',
    marginBottom: 7,
  },

  recentHeading: {
    marginTop: 28,
    marginBottom: 14,
  },

  recent: {
    width: 155,
    height: 200,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#151515',
    marginRight: 12,
  },

  recentImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },

  recentOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    paddingTop: 25,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },

  recentTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },

  recentSub: {
    color: '#aaa',
    fontSize: 11,
    marginTop: 3,
  },

  recentPlay: {
    position: 'absolute',
    right: 10,
    bottom: 48,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E50914',
    justifyContent: 'center',
    alignItems: 'center',
  },

  song: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },

  songImage: {
    width: 62,
    height: 62,
    borderRadius: 9,
    backgroundColor: '#151515',
  },

  songInfo: {
    flex: 1,
  },

  text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  subText: {
    color: '#A0A0A0',
    fontSize: 11,
    marginTop: 3,
  },
});
