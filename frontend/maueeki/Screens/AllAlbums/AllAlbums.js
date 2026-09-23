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

const AllAlbums = () => {
  const navigation = useNavigation();

  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAlbums = async () => {
      try {
        const res = await fetch(`${API}/all-album`);
        const data = await res.json();

        if (res.ok && Array.isArray(data)) {
          setAlbums(data);
        } else {
          setAlbums([]);
        }
      } catch (error) {
        console.log('Album Error:', error);
        setAlbums([]);
      } finally {
        setLoading(false);
      }
    };

    getAlbums();
  }, []);

  const renderAlbum = ({ item }) => (
    <TouchableOpacity
      style={styles.albumCard}
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate('albumSongs', {
          albumId: item._id,
        })
      }
    >
      <Image
        source={{ uri: item?.thumbnail }}
        style={styles.albumImage}
      />

      <Text
        style={styles.albumTitle}
        numberOfLines={1}
      >
        {item?.albumtitle || 'Unknown Album'}
      </Text>

      <Text
        style={styles.artistName}
        numberOfLines={1}
      >
        {item?.artist?.artistname || 'Unknown Artist'}
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
        All Albums
      </Text>

      {albums.length > 0 ? (
        <FlatList
          data={albums}
          renderItem={renderAlbum}
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
            No albums found
          </Text>
        </View>
      )}

    </View>
  );
};

export default AllAlbums;

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

  albumCard: {
    width: '48%',
    marginBottom: 22,
  },

  albumImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    backgroundColor: '#151515',
  },

  albumTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
    textTransform: 'capitalize',
  },

  artistName: {
    color: '#A0A0A0',
    fontSize: 13,
    marginTop: 4,
    textTransform: 'capitalize',
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