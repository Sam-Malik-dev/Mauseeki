import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { useMusicPlayer } from '../MusicPlayerContext/MusicPlayerContext';

const MiniPlayer = () => {
  const navigation = useNavigation();

  const {
    song,
    status,
    togglePlayPause,
    closePlayer,
    isPlayerScreen,
  } = useMusicPlayer();

  // Hide MiniPlayer on PlayerScreen
  if (!song || isPlayerScreen) {
    return null;
  }

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.95}
      onPress={() => {
        navigation.navigate('Play', {
          songId: song._id,
        });
      }}
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
          style={styles.artist}
          numberOfLines={1}
        >
          {song.artist?.artistname ||
            song.artistname ||
            'Unknown Artist'}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.playButton}
        activeOpacity={0.7}
        onPress={(e) => {
          e.stopPropagation();
          togglePlayPause();
        }}
      >
        <Ionicons
          name={status?.playing ? 'pause' : 'play'}
          size={21}
          color="#091518"
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.closeButton}
        activeOpacity={0.7}
        onPress={(e) => {
          e.stopPropagation();
          closePlayer();
        }}
      >
        <Ionicons
          name="close"
          size={22}
          color="#CFE7EB"
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default MiniPlayer;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 80,
    height: 68,
    backgroundColor: '#151515',
    borderRadius: 16,

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 10,

    shadowColor: '#080808',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.4,
    shadowRadius: 10,

    elevation: 10,
  },

  image: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#151515',
  },

  info: {
    flex: 1,
    marginLeft: 12,
    marginRight: 10,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'capitalize',
  },

  artist: {
    color: '#A0A0A0',
    fontSize: 12,
  },

  playButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E50914',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },

  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
});