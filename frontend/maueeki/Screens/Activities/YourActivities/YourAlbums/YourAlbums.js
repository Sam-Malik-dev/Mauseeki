import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = `http://${process.env.EXPO_PUBLIC_BACKEND_IP}:8080/Mauseeki`;

const YourAlbums = () => {
  const navigation = useNavigation();

  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAlbums = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        if (!token) {
          Alert.alert('Login Required', 'Please login first');
          return;
        }

        const res = await fetch(`${API}/your-albums`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || 'Unable to load albums');
          return;
        }

        setAlbums(Array.isArray(data) ? data : data.albums || []);
      } catch (err) {
        console.log(err);
        setError('Unable to connect to server');
      } finally {
        setLoading(false);
      }
    };

    loadAlbums();
  }, []);

  const openAlbum = id => {
    navigation.navigate('your-albumSongs', { albumId: id });
  };

  const renderAlbum = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => openAlbum(item._id)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.thumbnail }}
        style={styles.image}
      />

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {item.albumtitle || 'Unknown Album'}
        </Text>

        <Text style={styles.description} numberOfLines={2}>
          {item.description || 'No description'}
        </Text>

        {item.artist?.artistname && (
          <Text style={styles.artist} numberOfLines={1}>
            {item.artist.artistname}
          </Text>
        )}
      </View>

      <Ionicons
        name="chevron-forward"
        size={22}
        color="#E50914"
      />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Albums</Text>
      <Text style={styles.subtitle}>
        Albums available in Mauseeki
      </Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {albums.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons
            name="albums-outline"
            size={50}
            color="#A0A0A0"
          />

          <Text style={styles.emptyTitle}>No Albums Yet</Text>

          <Text style={styles.emptyText}>
            No albums found.
          </Text>
        </View>
      ) : (
        <FlatList
          data={albums}
          renderItem={renderAlbum}
          keyExtractor={item => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

export default YourAlbums;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080808',
    padding: 20,
    paddingTop: 55,
  },

  title: {
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

  card: {
    backgroundColor: '#151515',
    borderRadius: 14,
    padding: 10,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  image: {
    width: 68,
    height: 68,
    borderRadius: 10,
    backgroundColor: '#222222',
  },

  info: {
    flex: 1,
    marginHorizontal: 14,
  },

  name: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  description: {
    color: '#A0A0A0',
    fontSize: 12,
    marginTop: 5,
  },

  artist: {
    color: '#E50914',
    fontSize: 11,
    marginTop: 4,
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

  error: {
    color: '#E50914',
    marginBottom: 15,
  },
});
