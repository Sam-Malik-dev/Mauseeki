import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from "react-native";

import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { File } from "expo-file-system";

const API = `http://${process.env.EXPO_PUBLIC_BACKEND_IP}:8080/Mauseeki`;

const AddAlbum = () => {
  const [albumtitle, setAlbumtitle] = useState("");
  const [artist, setArtist] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);

  const pickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photos."
        );
        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          quality: 0.8,
        });

      if (
        !result.canceled &&
        result.assets &&
        result.assets.length > 0
      ) {
        const image = result.assets[0];

        console.log("SELECTED IMAGE:", image);
        console.log("IMAGE URI:", image.uri);
        console.log("IMAGE TYPE:", image.mimeType);
        console.log("IMAGE NAME:", image.fileName);

        setThumbnail(image);
      }
    } catch (error) {
      console.log("IMAGE PICKER ERROR:", error);

      Alert.alert(
        "Error",
        "Unable to select image."
      );
    }
  };

  const addAlbum = async () => {
    if (!albumtitle.trim()) {
      Alert.alert("Error", "Please enter album title.");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Error", "Please enter album description.");
      return;
    }

    if (!thumbnail?.uri) {
      Alert.alert(
        "Error",
        "Please choose an album thumbnail."
      );
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert(
          "Error",
          "Please login again."
        );
        return;
      }

      const formData = new FormData();

      formData.append(
        "albumtitle",
        albumtitle.trim()
      );

      formData.append(
        "description",
        description.trim()
      );

      if (artist.trim()) {
        formData.append(
          "artistname",
          artist.trim()
        );
      }

      // SAME TECHNIQUE AS SIGNUP
      console.log(
        "CREATING FILE FROM:",
        thumbnail.uri
      );

      const file = new File(
        thumbnail.uri
      );

      console.log(
        "FILE URI:",
        file.uri
      );

      console.log(
        "FILE NAME:",
        file.name
      );

      console.log(
        "FILE TYPE:",
        file.type
      );

      formData.append(
        "thumbnail",
        file
      );

      console.log("ADDING ALBUM...");
      console.log(
        "API:",
        `${API}/add-album`
      );
      console.log(
        "Album:",
        albumtitle
      );
      console.log(
        "Artist:",
        artist.trim() || "User will be artist"
      );

      const response = await fetch(
        `${API}/add-album`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      console.log(
        "STATUS:",
        response.status
      );

      const text =
        await response.text();

      console.log(
        "ADD ALBUM RESPONSE:",
        text
      );

      let data;

      try {
        data = JSON.parse(text);
      } catch (error) {
        Alert.alert(
          "Error",
          "Server returned an invalid response."
        );
        return;
      }

      if (
        response.ok &&
        data.success
      ) {
        Alert.alert(
          "Success",
          data.message ||
            "Album added successfully."
        );

        setAlbumtitle("");
        setArtist("");
        setDescription("");
        setThumbnail(null);
      } else {
        Alert.alert(
          "Error",
          data.message ||
            "Unable to add album."
        );
      }

    } catch (error) {
      console.log(
        "ADD ALBUM ERROR:",
        error
      );

      Alert.alert(
        "Error",
        error.message ||
          "Unable to connect to server."
      );
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Add Album
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Album title"
        placeholderTextColor="#A0A0A0"
        value={albumtitle}
        onChangeText={setAlbumtitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Artist name (optional)"
        placeholderTextColor="#A0A0A0"
        value={artist}
        onChangeText={setArtist}
      />

      <TextInput
        style={[
          styles.input,
          styles.textarea
        ]}
        placeholder="Description"
        placeholderTextColor="#A0A0A0"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TouchableOpacity
        style={styles.imageButton}
        onPress={pickImage}
      >
        <Text style={styles.buttonText}>
          {thumbnail
            ? "Change Thumbnail"
            : "Choose Thumbnail"}
        </Text>
      </TouchableOpacity>

      {thumbnail && (
        <Image
          source={{
            uri: thumbnail.uri
          }}
          style={styles.image}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={addAlbum}
      >
        <Text style={styles.addButtonText}>
          Add Album
        </Text>
      </TouchableOpacity>

    </View>
  );
};

export default AddAlbum;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080808",
    padding: 20,
    paddingTop: 60,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 25,
  },

  input: {
    backgroundColor: "#151515",
    color: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#252525",
    fontSize: 15,
  },

  textarea: {
    height: 100,
    textAlignVertical: "top",
  },

  imageButton: {
    backgroundColor: "#151515",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#252525",
  },

  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 20,
  },

  addButton: {
    backgroundColor: "#FF1744",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },

  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
});