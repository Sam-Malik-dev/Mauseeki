import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const SongScreen = () => {
  const navigation = useNavigation();

  const [songs, setSongs] = useState([]);
  const [error, setError] = useState('');
  const [playingId, setPlayingId] = useState(null);

  const API = `http://${process.env.EXPO_PUBLIC_BACKEND_IP}:8080/Mauseeki`;

  useEffect(() => {
    const allsongs = async () => {
      try {
        const url = `${API}/all-songs`;

        const res = await fetch(url);
        const data = await res.json();

        console.log('Songs Status:', res.status);
        console.log('Songs Data:', data);

        if (res.ok) {
          const songData = Array.isArray(data)
            ? data
            : data.songs || [];

          setSongs(songData);

          console.log('FIRST SONG:', songData[0]);
          console.log('FIRST SONG ID:', songData[0]?._id);
        } else {
          setError(
            'API returned an error while loading songs'
          );
        }
      } catch (err) {
        console.log('SONG FETCH ERROR:', err);
        setError(err.message);
      }
    };

    allsongs();
  }, []);

  // ADD SONG TO RECENT
  const recent = async (songId) => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      console.log("No token found");
      return;
    }

    console.log("Recent Song ID:", songId);

    const url = `${API}/add-recent/${songId}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    console.log("RECENT STATUS:", res.status);
    console.log("RECENT DATA:", data);

  } catch (error) {
    console.log("RECENT ERROR:", error);
  }
};

  const handlePlayPause = (item) => {
    console.log('================================');
    console.log('FULL SONG OBJECT:', item);
    console.log('SONG ID:', item?._id);
    console.log('================================');

    if (!item?._id) {
      console.log('ERROR: Song ID is missing');
      return;
    }

    if (playingId === item._id) {
      setPlayingId(null);
      return;
    }

    setPlayingId(item._id);

    // Pass song ID to recent
    recent(item._id);

    navigation.navigate('Play', {
      songId: item._id,
    });
  };

  const renderSong = ({ item }) => {
    const isPlaying = playingId === item._id;

    return (
      <View style={styles.songCard}>

        <Image
          source={{
            uri: item.coverImage,
          }}
          style={styles.songImage}
        />

        <View style={styles.songInfo}>

          <Text
            style={styles.songTitle}
            numberOfLines={1}
          >
            {item.title || 'Unknown Song'}
          </Text>

          <Text
            style={styles.songArtist}
            numberOfLines={1}
          >
            {item.language || 'Unknown Artist'}
          </Text>

          <Text
            style={styles.songGenre}
            numberOfLines={1}
          >
            {item.genre ||
              item.category ||
              item.language ||
              'Music'}
          </Text>

        </View>

        <TouchableOpacity
          style={styles.playButton}
          activeOpacity={0.7}
          onPress={() => handlePlayPause(item)}
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={20}
            color="#091518"
          />
        </TouchableOpacity>

      </View>
    );
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.screenTitle}>
          Songs
        </Text>

        <Text style={styles.subtitle}>
          Discover your favorite music
        </Text>
      </View>

      {error !== '' && (
        <Text style={styles.error}>
          {error}
        </Text>
      )}

      <View style={styles.section}>

        <View style={styles.sectionHeader}>

          <Text style={styles.sectionTitle}>
            World Best Songs
          </Text>

        </View>

        {songs.length === 0 ? (

          <Text style={styles.noSongs}>
            No songs found...
          </Text>

        ) : (

          <FlatList
            data={songs}
            renderItem={renderSong}
            keyExtractor={(item, index) =>
              item._id || index.toString()
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            initialNumToRender={8}
            maxToRenderPerBatch={8}
            windowSize={5}
            removeClippedSubviews={true}
          />

        )}

      </View>

    </View>
  );
};

export default SongScreen;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#080808',
    paddingHorizontal: 5,
    paddingTop: 35,
  },

  listContent: {
    paddingBottom: 30,
  },

  header: {
    marginBottom: 30,
  },

  screenTitle: {
    color: '#E50914',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 5,
    textTransform: 'capitalize',
  },

  subtitle: {
    color: '#A0A0A0',
    fontSize: 14,
  },

  section: {
    flex: 1,
    width: '100%',
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },

  seeAll: {
    color: '#E50914',
    fontSize: 14,
    fontWeight: '600',
  },

  songCard: {
    width: '100%',
    height: 75,
    backgroundColor: '#151515',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    marginBottom: 5,
  },

  songImage: {
    width: 55,
    height: 55,
    borderRadius: 8,
    backgroundColor: '#151515',
  },

  songInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 10,
  },

  songTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 3,
  },

  songArtist: {
    color: '#A0A0A0',
    fontSize: 13,
    marginBottom: 2,
  },

  songGenre: {
    color: '#A0A0A0',
    fontSize: 11,
  },

  playButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E50914',
    alignItems: 'center',
    justifyContent: 'center',
  },

  noSongs: {
    color: '#FFFFFF',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 30,
  },

  error: {
    color: '#FF6B6B',
    fontSize: 14,
    marginBottom: 20,
  },

});
