import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = `http://${process.env.EXPO_PUBLIC_BACKEND_IP}:8080/Mauseeki`;

const ShowLikes = () => {
  const navigation = useNavigation();

  const [likes, setLikes] = useState([]);
  const [playingId, setPlayingId] = useState(null);

  useEffect(() => {
    const loadLikes = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        if (!token) return;

        const res = await fetch(`${API}/yourlikes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setLikes(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.log('LIKES ERROR:', error);
      }
    };

    loadLikes();
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
  const playSong = async (song) => {
    if (!song?._id) return;

    if (playingId === song._id) {
      setPlayingId(null);
      return;
    }

    setPlayingId(song._id);

    // Add to Recently Played
    await addRecent(song._id);

    navigation.navigate('Play', {
      songId: song._id,
    });
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.heading}>
        Liked Songs
      </Text>

      {likes.length ? (
        likes.map((item) => {
          const song = item.songId;

          if (!song) return null;

          return (
            <View
              key={item._id}
              style={styles.song}
            >
              <Image
                source={{ uri: song.coverImage }}
                style={styles.image}
              />

              <View style={styles.info}>
                <Text
                  style={styles.title}
                  numberOfLines={1}
                >
                  {song.title}
                </Text>

                <Text
                  style={styles.genre}
                  numberOfLines={1}
                >
                  {song.genre || 'Unknown Genre'}
                </Text>

                <Text
                  style={styles.language}
                  numberOfLines={1}
                >
                  {song.language || 'Unknown Language'}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.play}
                onPress={() => playSong(song)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={
                    playingId === song._id
                      ? 'pause'
                      : 'play'
                  }
                  size={20}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            </View>
          );
        })
      ) : (
        <View style={styles.empty}>
          <Ionicons
            name="heart-outline"
            size={55}
            color="#A0A0A0"
          />

          <Text style={styles.emptyTitle}>
            No liked songs yet
          </Text>

          <Text style={styles.emptyText}>
            Songs you like will appear here
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default ShowLikes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080808',
    padding: 16,
    paddingTop: 55,
  },

  heading: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 20,
  },

  song: {
    backgroundColor: '#151515',
    borderRadius: 14,
    padding: 9,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  image: {
    width: 65,
    height: 65,
    borderRadius: 10,
    backgroundColor: '#222222',
  },

  info: {
    flex: 1,
    marginHorizontal: 12,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  genre: {
    color: '#E50914',
    fontSize: 12,
    marginTop: 5,
  },

  language: {
    color: '#A0A0A0',
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
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 150,
  },

  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '700',
    marginTop: 15,
  },

  emptyText: {
    color: '#A0A0A0',
    fontSize: 13,
    marginTop: 6,
  },
});