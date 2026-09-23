import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = `http://${process.env.EXPO_PUBLIC_BACKEND_IP}:8080/Mauseeki`;

const YourFav = () => {
  const navigation = useNavigation();

  const [favs, setFavs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) return;

      const res = await fetch(`${API}/your-fav`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok && Array.isArray(data)) {
        setFavs(data);
      } else {
        setFavs([]);
      }
    } catch (error) {
      console.log('FAVORITES ERROR:', error);
      setFavs([]);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async albumId => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        Alert.alert('Login Required', 'Please login first');
        return;
      }

      const res = await fetch(`${API}/Addtofav/${albumId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert('Error', data.message || 'Failed to remove album');
        return;
      }

      setFavs(prev =>
        prev.filter(item => item.albumId?._id !== albumId)
      );

      Alert.alert(
        'Success',
        data.message || 'Album removed from favorites'
      );
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Unable to connect to server');
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.heading}>Your Favorites</Text>

      {favs.length ? (
        favs.map(item => {
          const album = item.albumId;

          if (!album) return null;

          return (
            <TouchableOpacity
              key={item._id}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate('albumSongs', {
                  albumId: album._id,
                })
              }
            >
              <Image
                source={{ uri: album.thumbnail }}
                style={styles.image}
              />

              <View style={styles.info}>
                <Text style={styles.title} numberOfLines={1}>
                  {album.albumtitle || 'Unknown Album'}
                </Text>

                <Text style={styles.description} numberOfLines={2}>
                  {album.description || 'No description'}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.remove}
                onPress={() => removeFavorite(album._id)}
              >
                <Ionicons
                  name="bookmark"
                  size={22}
                  color="#E50914"
                />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })
      ) : (
        <View style={styles.empty}>
          <Ionicons
            name="bookmark-outline"
            size={55}
            color="#A0A0A0"
          />

          <Text style={styles.emptyTitle}>
            No Favorite Albums
          </Text>

          <Text style={styles.emptyText}>
            Albums you save will appear here
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default YourFav;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080808',
    padding: 16,
    paddingTop: 55,
  },

  loading: {
    flex: 1,
    backgroundColor: '#080808',
    alignItems: 'center',
    justifyContent: 'center',
  },

  heading: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#151515',
    borderRadius: 14,
    padding: 9,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  image: {
    width: 70,
    height: 70,
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

  description: {
    color: '#A0A0A0',
    fontSize: 12,
    marginTop: 5,
  },

  remove: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#080808',
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
