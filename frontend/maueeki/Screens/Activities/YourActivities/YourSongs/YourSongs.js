import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const API = `http://${process.env.EXPO_PUBLIC_BACKEND_IP}:8080/Mauseeki`;

const YourSongs = () => {
  const navigation = useNavigation();

  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState(null);

  useEffect(() => {
    const loadSongs = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        if (!token) {
          Alert.alert('Login Required', 'Please login first');
          return;
        }

        const res = await fetch(`${API}/your-songs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          Alert.alert(
            'Error',
            data.message || 'Unable to fetch songs'
          );
          return;
        }

        setSongs(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log('SONGS ERROR:', error);
        Alert.alert(
          'Error',
          'Unable to connect to server'
        );
      } finally {
        setLoading(false);
      }
    };

    loadSongs();
  }, []);

  // ADD SONG TO RECENTLY PLAYED
  const addRecent = async (songId) => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        console.log('No token found');
        return;
      }

      console.log('Recent Song ID:', songId);

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

  // PLAY SONG
  const playSong = async (item) => {
    if (!item?._id) {
      console.log('Song ID is missing');
      return;
    }

    if (playingId === item._id) {
      setPlayingId(null);
      return;
    }

    setPlayingId(item._id);

    // Add song to Recently Played
    await addRecent(item._id);

    navigation.navigate('Play', {
      songId: item._id,
    });
  };

  const renderSong = ({ item }) => {
    const playing = playingId === item._id;

    return (
      <View style={styles.song}>
        <Image
          source={{ uri: item.coverImage }}
          style={styles.cover}
        />

        <View style={styles.info}>
          <Text
            style={styles.title}
            numberOfLines={1}
          >
            {item.title || 'Unknown Song'}
          </Text>

          <Text
            style={styles.details}
            numberOfLines={1}
          >
            {item.language || 'Unknown Language'}
          </Text>

          {item.genre && (
            <Text
              style={styles.genre}
              numberOfLines={1}
            >
              {item.genre}
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.play}
          onPress={() => playSong(item)}
          activeOpacity={0.7}
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

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          size="large"
          color="#E50914"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Your Songs
      </Text>

      <Text style={styles.subtitle}>
        Songs added by you
      </Text>

      {songs.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons
            name="musical-notes-outline"
            size={50}
            color="#A0A0A0"
          />

          <Text style={styles.emptyTitle}>
            No Songs Yet
          </Text>

          <Text style={styles.emptyText}>
            You haven't added any songs yet.
          </Text>
        </View>
      ) : (
        <FlatList
          data={songs}
          renderItem={renderSong}
          keyExtractor={(item, index) =>
            item._id || index.toString()
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={5}
          removeClippedSubviews={true}
        />
      )}
    </View>
  );
};

export default YourSongs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080808',
    padding: 20,
    paddingTop: 55,
  },

  heading: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
  },

  subtitle: {
    color: '#A0A0A0',
    marginTop: 5,
    marginBottom: 22,
  },

  list: {
    paddingBottom: 30,
  },

  song: {
    backgroundColor: '#151515',
    borderRadius: 14,
    padding: 10,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  cover: {
    width: 58,
    height: 58,
    borderRadius: 10,
    backgroundColor: '#222222',
  },

  info: {
    flex: 1,
    marginHorizontal: 14,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  details: {
    color: '#A0A0A0',
    fontSize: 13,
    marginTop: 5,
  },

  genre: {
    color: '#E50914',
    fontSize: 11,
    marginTop: 4,
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
  },

  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '700',
    marginTop: 15,
  },

  emptyText: {
    color: '#A0A0A0',
    marginTop: 6,
  },
});