import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const API = `http://${process.env.EXPO_PUBLIC_BACKEND_IP}:8080/Mauseeki`;

const ArtistAlbum = ({ route }) => {
  const navigation = useNavigation();
  const { artistId } = route.params;

  const [artist, setArtist] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [isFollowed, setIsFollowed] = useState(false);

  useEffect(() => {
    if (!artistId) return;

    const loadData = async () => {
      try {
        const [albumsRes, artistRes] = await Promise.all([
          fetch(`${API}/artist-alb/${artistId}`),
          fetch(`${API}/this-artist/${artistId}`),
        ]);

        const albumsData = await albumsRes.json();
        const artistData = await artistRes.json();

        if (albumsRes.ok) {
          setAlbums(
            Array.isArray(albumsData)
              ? albumsData
              : albumsData.albums || []
          );
        }

        if (artistRes.ok) setArtist(artistData);
      } catch (error) {
        console.log('LOAD ERROR:', error);
      }
    };

    loadData();
  }, [artistId]);

  const follow = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        Alert.alert('Login Required', 'Please login first');
        return;
      }

      const res = await fetch(`${API}/follow/${artistId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert('Error', data.message || 'Failed to update follow');
        return;
      }

      setIsFollowed(prev => !prev);
      Alert.alert('Success', data.message || 'Follow status updated');
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Unable to connect to server');
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.heading}>Artist's Albums</Text>

      {artist ? (
        <View style={styles.artistCard}>
          <Image
            source={{ uri: artist.image }}
            style={styles.artistImage}
          />

          <View style={styles.artistBottom}>
            <View style={styles.artistInfo}>
              <Text style={styles.artistName}>
                {artist.artistname}
              </Text>

              {artist.bio && (
                <Text style={styles.bio} numberOfLines={2}>
                  {artist.bio}
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.follow}
              onPress={follow}
            >
              <Ionicons
                name={isFollowed ? 'person' : 'person-add'}
                size={22}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Text style={styles.empty}>No Artist</Text>
      )}

      <Text style={styles.sectionTitle}>Albums</Text>

      {albums.length ? (
        albums.map(item => (
          <TouchableOpacity
            key={item._id}
            style={styles.albumCard}
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

            <View style={styles.albumInfo}>
              <Text style={styles.albumTitle} numberOfLines={1}>
                {item.albumtitle}
              </Text>

              <Text style={styles.albumArtist} numberOfLines={1}>
                {item.artist?.artistname ||
                  artist?.artistname ||
                  'Unknown Artist'}
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={22}
              color="#E50914"
            />
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.empty}>No albums found</Text>
      )}
    </ScrollView>
  );
};

export default ArtistAlbum;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080808',
    padding: 16,
  },

  heading: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 25,
    marginBottom: 20,
  },

  artistCard: {
    height: 230,
    backgroundColor: '#151515',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 25,
  },

  artistImage: {
    width: '100%',
    height: '100%',
  },

  artistBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },

  artistInfo: {
    flex: 1,
    marginRight: 10,
  },

  artistName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },

  bio: {
    color: '#A0A0A0',
    fontSize: 12,
    marginTop: 5,
  },

  follow: {
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

  albumCard: {
    backgroundColor: '#151515',
    borderRadius: 12,
    padding: 8,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  albumImage: {
    width: 70,
    height: 70,
    borderRadius: 9,
  },

  albumInfo: {
    flex: 1,
    marginHorizontal: 12,
  },

  albumTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  albumArtist: {
    color: '#A0A0A0',
    fontSize: 12,
    marginTop: 5,
  },

  empty: {
    color: '#A0A0A0',
    textAlign: 'center',
    marginVertical: 25,
  },
});
