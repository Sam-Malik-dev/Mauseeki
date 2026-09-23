import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

const API = `http://${process.env.EXPO_PUBLIC_BACKEND_IP}:8080/Mauseeki`;

const AllArtists = () => {
  const navigation = useNavigation();

  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getArtists = async () => {
      try {
        const res = await fetch(`${API}/all-artist`);
        const data = await res.json();

        if (res.ok && Array.isArray(data)) {
          setArtists(data);
        } else {
          setArtists([]);
        }
      } catch (error) {
        console.log('Artist Error:', error);
        setArtists([]);
      } finally {
        setLoading(false);
      }
    };

    getArtists();
  }, []);

  const renderArtist = ({ item }) => (
    <TouchableOpacity
      style={styles.artistCard}
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate('artist', {
          artistId: item._id,
        })
      }
    >
      <Image
        source={{ uri: item?.image }}
        style={styles.artistImage}
      />

      <Text
        style={styles.artistName}
        numberOfLines={1}
      >
        {item?.artistname || 'Unknown Artist'}
      </Text>

      <Text
        style={styles.artistGenre}
        numberOfLines={1}
      >
        {Array.isArray(item?.genres)
          ? item.genres.join(', ')
          : item?.genres || 'Artist'}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
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
        All Artists
      </Text>

      {artists.length > 0 ? (
        <FlatList
          data={artists}
          renderItem={renderArtist}
          keyExtractor={(item, index) =>
            item?._id || index.toString()
          }
          numColumns={2}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No artists found
          </Text>
        </View>
      )}

    </View>
  );
};

export default AllArtists;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080808',
    paddingHorizontal: 16,
    paddingTop: 50,
  },

  heading: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
  },

  list: {
    paddingBottom: 30,
  },

  row: {
    justifyContent: 'space-between',
  },

  artistCard: {
    width: '48%',
    marginBottom: 22,
  },

  artistImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    backgroundColor: '#151515',
  },

  artistName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
  },

  artistGenre: {
    color: '#A0A0A0',
    fontSize: 13,
    marginTop: 4,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: '#080808',
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    color: '#A0A0A0',
    fontSize: 16,
  },
});