import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const API = `http://${process.env.EXPO_PUBLIC_BACKEND_IP}:8080/Mauseeki`;

const SearchScreen = () => {
  const navigation = useNavigation();

  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const searchMusic = async () => {
    if (!query.trim()) {
      return;
    }

    try {
      setLoading(true);
      setSearched(true);

      const url = `${API}/search?query=${encodeURIComponent(
        query.trim()
      )}`;

      const res = await fetch(url);
      const data = await res.json();

      console.log("SEARCH RESULT:", data);

      if (res.ok && data.success) {
        setSongs(data.songs || []);
        setAlbums(data.albums || []);
        setArtists(data.artists || []);
      } else {
        setSongs([]);
        setAlbums([]);
        setArtists([]);
      }
    } catch (error) {
      console.log("SEARCH ERROR:", error);

      setSongs([]);
      setAlbums([]);
      setArtists([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setSongs([]);
    setAlbums([]);
    setArtists([]);
    setSearched(false);
  };

  const totalResults =
    songs.length + albums.length + artists.length;

  return (
    <View style={styles.container}>

      {/* Header */}

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon
            name="arrow-back"
            size={24}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <Text style={styles.title}>Search</Text>
      </View>

      {/* Search Input */}

      <View style={styles.searchBox}>
        <Icon
          name="search-outline"
          size={22}
          color="#A0A0A0"
        />

        <TextInput
          style={styles.input}
          placeholder="Search songs, albums, artists..."
          placeholderTextColor="#A0A0A0"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={searchMusic}
          returnKeyType="search"
        />

        {query.length > 0 && (
          <TouchableOpacity onPress={clearSearch}>
            <Icon
              name="close-circle"
              size={20}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.searchButton}
          onPress={searchMusic}
        >
          <Icon
            name="search"
            size={20}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color="#E50914"
            />

            <Text style={styles.loadingText}>
              Searching...
            </Text>
          </View>
        ) : (
          <>
            {/* No Results */}

            {searched && totalResults === 0 && (
              <View style={styles.noResults}>
                <Icon
                  name="search-outline"
                  size={55}
                  color="#A0A0A0"
                />

                <Text style={styles.noResultsTitle}>
                  No results found
                </Text>

                <Text style={styles.noResultsText}>
                  Try searching for another song, album or artist.
                </Text>
              </View>
            )}

            {/* Artists */}

            {artists.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Artists
                </Text>

                {artists.map((artist) => (
                  <TouchableOpacity
                    key={artist._id}
                    style={styles.resultBox}
                    onPress={() =>
                      navigation.navigate("artist", {
                        artistId: artist._id,
                      })
                    }
                  >
                    {artist.image ? (
                      <Image
                        source={{ uri: artist.image }}
                        style={styles.artistImage}
                      />
                    ) : (
                      <View style={styles.artistPlaceholder}>
                        <Icon
                          name="person"
                          size={25}
                          color="#A0A0A0"
                        />
                      </View>
                    )}

                    <View style={styles.resultInfo}>
                      <Text style={styles.resultTitle}>
                        {artist.artistname}
                      </Text>

                      <Text style={styles.resultType}>
                        Artist
                      </Text>
                    </View>

                    <Icon
                      name="chevron-forward"
                      size={20}
                      color="#A0A0A0"
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Albums */}

            {albums.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Albums
                </Text>

                {albums.map((album) => (
                  <TouchableOpacity
                    key={album._id}
                    style={styles.resultBox}
                    onPress={() =>
                      navigation.navigate("albumSongs", {
                        albumId: album._id,
                      })
                    }
                  >
                    {album.thumbnail ? (
                      <Image
                        source={{ uri: album.thumbnail }}
                        style={styles.squareImage}
                      />
                    ) : (
                      <View style={styles.albumPlaceholder}>
                        <Icon
                          name="albums"
                          size={25}
                          color="#A0A0A0"
                        />
                      </View>
                    )}

                    <View style={styles.resultInfo}>
                      <Text
                        style={styles.resultTitle}
                        numberOfLines={1}
                      >
                        {album.albumtitle}
                      </Text>

                      <Text style={styles.resultType}>
                        Album
                      </Text>
                    </View>

                    <Icon
                      name="chevron-forward"
                      size={20}
                      color="#A0A0A0"
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Songs */}

            {songs.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Songs
                </Text>

                {songs.map((song) => (
                  <TouchableOpacity
                    key={song._id}
                    style={styles.resultBox}
                    onPress={() =>
                      navigation.navigate("Play", {
                        songId: song._id,
                      })
                    }
                  >
                    {song.coverImage ? (
                      <Image
                        source={{ uri: song.coverImage }}
                        style={styles.squareImage}
                      />
                    ) : (
                      <View style={styles.albumPlaceholder}>
                        <Icon
                          name="musical-note"
                          size={25}
                          color="#A0A0A0"
                        />
                      </View>
                    )}

                    <View style={styles.resultInfo}>
                      <Text
                        style={styles.resultTitle}
                        numberOfLines={1}
                      >
                        {song.title}
                      </Text>

                      <Text
                        style={styles.resultType}
                        numberOfLines={1}
                      >
                        {song.artist?.artistname ||
                          "Unknown Artist"}
                      </Text>
                    </View>

                    <Icon
                      name="play-circle-outline"
                      size={28}
                      color="#E50914"
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        )}

      </ScrollView>
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080808",
    paddingTop: 55,
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  backButton: {
    marginRight: 15,
  },

  title: {
    color: "#E50914",
    fontSize: 28,
    fontWeight: "700",
  },

  searchBox: {
    width: "100%",
    height: 55,
    backgroundColor: "#151515",
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 5,
    marginBottom: 25,
  },

  input: {
    flex: 1,
    color: "#A0A0A0",
    fontSize: 15,
    marginLeft: 10,
  },

  searchButton: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: "#E50914",
    justifyContent: "center",
    alignItems: "center",
  },

  scrollContent: {
    paddingBottom: 100,
  },

  loadingContainer: {
    alignItems: "center",
    marginTop: 60,
  },

  loadingText: {
    color: "#A0A0A0",
    marginTop: 12,
    fontSize: 14,
  },

  section: {
    marginBottom: 25,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },

  resultBox: {
    width: "100%",
    minHeight: 70,
    backgroundColor: "#151515",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  resultInfo: {
    flex: 1,
    marginLeft: 14,
    marginRight: 10,
  },

  resultTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  resultType: {
    color: "#A0A0A0",
    fontSize: 13,
    marginTop: 4,
  },

  artistImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },

  squareImage: {
    width: 55,
    height: 55,
    borderRadius: 8,
  },

  artistPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#E50914",
    justifyContent: "center",
    alignItems: "center",
  },

  albumPlaceholder: {
    width: 55,
    height: 55,
    borderRadius: 8,
    backgroundColor: "#E50914",
    justifyContent: "center",
    alignItems: "center",
  },

  noResults: {
    alignItems: "center",
    marginTop: 70,
    paddingHorizontal: 30,
  },

  noResultsTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 15,
  },

  noResultsText: {
    color: "#A0A0A0",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
});