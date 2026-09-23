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
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = `http://${process.env.EXPO_PUBLIC_BACKEND_IP}:8080/Mauseeki`;

const Followed = () => {
  const navigation = useNavigation();
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    loadArtists();
  }, []);

  const loadArtists = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        Alert.alert('Login Required', 'Please login first');
        return;
      }

      const res = await fetch(`${API}/followed`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setArtists(Array.isArray(data) ? data : []);
      } else {
        Alert.alert('Error', data.message || 'Unable to load artists');
      }
    } catch (error) {
      console.log('FOLLOWED ERROR:', error);
      Alert.alert('Error', 'Unable to connect to server');
    }
  };

  const unfollow = async id => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        Alert.alert('Login Required', 'Please login first');
        return;
      }

      const res = await fetch(`${API}/follow/${id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert('Error', data.message || 'Failed to unfollow');
        return;
      }

      setArtists(prev =>
        prev.filter(item => (item.artistId?._id || item.artistId) !== id)
      );

      Alert.alert('Success', data.message || 'Artist unfollowed');
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
      <Text style={styles.heading}>Artists You Follow</Text>

      {artists.length ? (
        artists.map(item => {
          const artist = item.artistId;

          if (!artist) return null;

          return (
            <TouchableOpacity
              key={item._id}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate('artist', {
                  artistId: artist._id,
                })
              }
            >
              <Image
                source={{ uri: artist.image }}
                style={styles.image}
              />

              <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>
                  {artist.artistname || 'Unknown Artist'}
                </Text>

                <Text style={styles.bio} numberOfLines={2}>
                  {artist.bio || 'No bio available'}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => unfollow(artist._id)}
              >
                <Ionicons
                  name="person-remove"
                  size={21}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })
      ) : (
        <View style={styles.empty}>
          <Ionicons
            name="people-outline"
            size={55}
            color="#A0A0A0"
          />

          <Text style={styles.emptyTitle}>
            No Followed Artists
          </Text>

          <Text style={styles.emptyText}>
            Artists you follow will appear here
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default Followed;

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
    borderRadius: 35,
    backgroundColor: '#222222',
  },

  info: {
    flex: 1,
    marginHorizontal: 12,
  },

  name: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  bio: {
    color: '#A0A0A0',
    fontSize: 12,
    marginTop: 5,
  },

  button: {
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
