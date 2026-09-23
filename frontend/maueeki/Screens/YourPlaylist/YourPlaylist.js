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

const YourPlaylist = () => {
  const navigation = useNavigation();

  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  const getPlaylists = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await fetch(`${API_URL}/my-playlists`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setPlaylists(data.playlists || []);
      }
    } catch (error) {
      console.log('Playlist Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPlaylists();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Playlists</Text>

      {playlists.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons
            name="musical-notes-outline"
            size={55}
            color="#A0A0A0"
          />

          <Text style={styles.emptyText}>
            No playlists found
          </Text>
        </View>
      ) : (
        <FlatList
          data={playlists}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const firstSong = item.songs?.[0];

            return (
              <View style={styles.playlist}>
                <View style={styles.imageBox}>
                  {firstSong?.coverImage ? (
                    <Image
                      source={{ uri: firstSong.coverImage }}
                      style={styles.image}
                    />
                  ) : (
                    <Ionicons
                      name="musical-notes"
                      size={35}
                      color="#E50914"
                    />
                  )}
                </View>

                <View style={styles.info}>
                  <Text style={styles.name}>
                    {item.name}
                  </Text>

                  <Text style={styles.songs}>
                    {item.songs?.length || 0} songs
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('PlaylistSongs', {
                      playlistId: item._id,
                      playlistName: item.name,
                    })
                  }
                >
                  <Ionicons
                    name="chevron-forward"
                    size={27}
                    color="#A0A0A0"
                  />
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

export default YourPlaylist;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080808',
    padding: 20,
    paddingTop: 55,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 25,
  },

  playlist: {
    backgroundColor: '#151515',
    borderRadius: 15,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  imageBox: {
    width: 65,
    height: 65,
    borderRadius: 12,
    backgroundColor: '#252525',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  info: {
    flex: 1,
    marginLeft: 15,
  },

  name: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },

  songs: {
    color: '#A0A0A0',
    fontSize: 13,
    marginTop: 5,
  },

  loading: {
    color: '#A0A0A0',
    textAlign: 'center',
    marginTop: 100,
  },

  empty: {
    alignItems: 'center',
    marginTop: 150,
  },

  emptyText: {
    color: '#A0A0A0',
    fontSize: 16,
    marginTop: 15,
  },
});