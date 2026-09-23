import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { File } from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const API = `http://${process.env.EXPO_PUBLIC_BACKEND_IP}:8080/Mauseeki`;

const AddYourAlbum = () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { artistId } = params || {};

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert('Permission Required', 'Please allow photo access.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setThumbnail(result.assets[0]);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Unable to select image.');
    }
  };

  const addAlbum = async () => {
    if (!artistId) {
      Alert.alert('Error', 'Artist ID not found.');
      return;
    }

    if (!title.trim() || !description.trim()) {
      Alert.alert('Error', 'Please enter title and description.');
      return;
    }

    if (!thumbnail?.uri) {
      Alert.alert('Error', 'Please choose a thumbnail.');
      return;
    }

    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('token');

      if (!token) {
        Alert.alert('Login Required', 'Please login again.');
        return;
      }

      const formData = new FormData();

      formData.append('albumtitle', title.trim());
      formData.append('description', description.trim());

      const file = new File(thumbnail.uri);
      formData.append('thumbnail', file);

      const response = await fetch(
        `${API}/artist-album/${artistId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const text = await response.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        Alert.alert('Error', 'Invalid server response.');
        return;
      }

      if (!response.ok || !data.success) {
        Alert.alert('Error', data.message || 'Unable to add album.');
        return;
      }

      Alert.alert(
        'Success',
        data.message || 'Album added successfully.'
      );

      setTitle('');
      setDescription('');
      setThumbnail(null);
      navigation.goBack();
    } catch (error) {
      console.log('ADD ALBUM ERROR:', error);
      Alert.alert('Error', error.message || 'Unable to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity
        style={styles.back}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
      </TouchableOpacity>

      <Text style={styles.title}>Add Album</Text>
      <Text style={styles.subtitle}>
        Create a new album for your artist
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Album title"
        placeholderTextColor="#666"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Album description"
        placeholderTextColor="#666"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TouchableOpacity
        style={styles.imageButton}
        onPress={pickImage}
      >
        <Ionicons
          name="image-outline"
          size={23}
          color="#E50914"
        />
        <Text style={styles.imageText}>
          {thumbnail ? 'Change Thumbnail' : 'Choose Thumbnail'}
        </Text>
      </TouchableOpacity>

      {thumbnail && (
        <Image
          source={{ uri: thumbnail.uri }}
          style={styles.image}
        />
      )}

      <TouchableOpacity
        style={[styles.addButton, loading && styles.disabled]}
        onPress={addAlbum}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Ionicons
              name="add-circle-outline"
              size={22}
              color="#FFFFFF"
            />
            <Text style={styles.addText}>Add Album</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddYourAlbum;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080808',
  },

  content: {
    padding: 20,
    paddingTop: 55,
    paddingBottom: 40,
  },

  back: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#151515',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
  },

  subtitle: {
    color: '#A0A0A0',
    marginTop: 5,
    marginBottom: 25,
  },

  input: {
    backgroundColor: '#151515',
    color: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#292929',
    fontSize: 15,
  },

  textarea: {
    height: 120,
    textAlignVertical: 'top',
  },

  imageButton: {
    height: 55,
    backgroundColor: '#151515',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#292929',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 15,
  },

  imageText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  image: {
    width: '100%',
    height: 230,
    borderRadius: 14,
    marginBottom: 18,
    backgroundColor: '#151515',
  },

  addButton: {
    height: 55,
    borderRadius: 12,
    backgroundColor: '#E50914',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  addText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  disabled: {
    opacity: 0.6,
  },
});
