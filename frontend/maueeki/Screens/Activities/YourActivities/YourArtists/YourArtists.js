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

const YourArtists = () => {
  const navigation = useNavigation();

  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadArtists = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        if (!token) {
          Alert.alert('Login Required', 'Please login first');
          return;
        }

        const res = await fetch(`${API}/your-artist`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || 'Unable to load artists');
          return;
        }

        setArtists(
          Array.isArray(data) ? data : data.artists || []
        );
      } catch (err) {
        console.log(err);
        setError('Unable to connect to server');
      } finally {
        setLoading(false);
      }
    };

    loadArtists();
  }, []);

  const openArtist = id => {
    navigation.navigate('your-artistalbum', { artistId: id });
  };

  const renderArtist = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => openArtist(item._id)}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.image}
      />

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {item.artistname || 'Unknown Artist'}
        </Text>

        <Text style={styles.language} numberOfLines={1}>
          {item.language || 'Music'}
        </Text>

        {item.region && (
          <Text style={styles.region} numberOfLines={1}>
            {item.region}
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.arrow}
        onPress={() =>
          navigation.navigate('artist', {
            artistId: item._id,
          })
        }
      >
        <Ionicons
          name="chevron-forward"
          size={20}
          color="#E50914"
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const addMore = () => {
    const artist = artists[artists.length - 1];

    if (artist?._id) {
      navigation.navigate('add-albums', {
        artistId: artist._id,
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Artists</Text>

      <Text style={styles.subtitle}>
        Artists available in Mauseeki
      </Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {artists.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons
            name="people-outline"
            size={50}
            color="#A0A0A0"
          />

          <Text style={styles.emptyTitle}>No Artists Yet</Text>

          <Text style={styles.emptyText}>
            No artists found.
          </Text>
        </View>
      ) : (
        <FlatList
          data={artists}
          renderItem={renderArtist}
          keyExtractor={(item, index) =>
            item._id || index.toString()
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ListFooterComponent={
            <TouchableOpacity
              style={styles.addCard}
              onPress={addMore}
            >
              <View style={styles.addIcon}>
                <Ionicons
                  name="add"
                  size={26}
                  color="#FFFFFF"
                />
              </View>

              <View style={styles.addInfo}>
                <Text style={styles.addTitle}>Add More</Text>

                <Text style={styles.addText}>
                  Add an album for this artist
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={22}
                color="#E50914"
              />
            </TouchableOpacity>
          }
        />
      )}
    </View>
  );
};

export default YourArtists;

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
    width: 58,
    height: 58,
    borderRadius: 29,
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

  language: {
    color: '#A0A0A0',
    fontSize: 13,
    marginTop: 5,
  },

  region: {
    color: '#E50914',
    fontSize: 11,
    marginTop: 4,
  },

  arrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#222222',
    alignItems: 'center',
    justifyContent: 'center',
  },

  addCard: {
    backgroundColor: '#151515',
    borderRadius: 14,
    padding: 12,
    marginTop: 3,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E50914',
  },

  addIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#222222',
    alignItems: 'center',
    justifyContent: 'center',
  },

  addInfo: {
    flex: 1,
    marginHorizontal: 14,
  },

  addTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  addText: {
    color: '#A0A0A0',
    fontSize: 12,
    marginTop: 5,
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
