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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { File } from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = `http://${process.env.EXPO_PUBLIC_BACKEND_IP}:8080/Mauseeki`;

const AddArtist = () => {
  const navigation = useNavigation();

  const [form, setForm] = useState({
    artistname: '',
    dateofbirth: '',
    bio: '',
    genres: '',
    language: '',
    region: '',
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const update = (key, value) => {
    setForm({ ...form, [key]: value });
  };

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
        setImage(result.assets[0]);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Unable to select image.');
    }
  };

  const addArtist = async () => {
    if (!form.artistname.trim()) {
      Alert.alert('Error', 'Please enter artist name.');
      return;
    }

    if (!form.dateofbirth.trim()) {
      Alert.alert('Error', 'Please enter date of birth.');
      return;
    }

    if (!form.bio.trim()) {
      Alert.alert('Error', 'Please enter artist bio.');
      return;
    }

    if (!image?.uri) {
      Alert.alert('Error', 'Please select artist image.');
      return;
    }

    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('token');

      if (!token) {
        Alert.alert('Login Required', 'Please login again.');
        return;
      }

      const data = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        data.append(key, value.trim());
      });

      const file = new File(image.uri);

      if (!file.exists) {
        Alert.alert('Error', 'Image not found. Please select again.');
        return;
      }

      data.append('image', file);

      const response = await fetch(`${API}/add-artist`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        Alert.alert(
          'Failed',
          result.message || 'Unable to add artist.'
        );
        return;
      }

      Alert.alert('Success', 'Artist added successfully.', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);

      setForm({
        artistname: '',
        dateofbirth: '',
        bio: '',
        genres: '',
        language: '',
        region: '',
      });

      setImage(null);
    } catch (error) {
      console.log('ADD ARTIST ERROR:', error);
      Alert.alert(
        'Error',
        error.message || 'Unable to connect to server.'
      );
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    ['artistname', 'Artist Name'],
    ['dateofbirth', 'Date of Birth'],
    ['genres', 'Genres'],
    ['language', 'Language'],
    ['region', 'Region'],
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.title}>Add Artist</Text>
          <Text style={styles.subtitle}>
            Create a new artist profile
          </Text>

          <TouchableOpacity
            style={styles.imageBox}
            onPress={pickImage}
            activeOpacity={0.8}
          >
            {image ? (
              <Image
                source={{ uri: image.uri }}
                style={styles.image}
              />
            ) : (
              <>
                <Ionicons
                  name="person-outline"
                  size={32}
                  color="#E50914"
                />
                <Text style={styles.imageText}>
                  Add Artist Image
                </Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.inputs}>
            {fields.map(([key, placeholder]) => (
              <TextInput
                key={key}
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor="#666"
                value={form[key]}
                onChangeText={text => update(key, text)}
              />
            ))}

            <TextInput
              style={[styles.input, styles.bio]}
              placeholder="Artist Bio"
              placeholderTextColor="#666"
              value={form.bio}
              onChangeText={text => update('bio', text)}
              multiline
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.disabled]}
            onPress={addArtist}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons
                  name="person-add-outline"
                  size={22}
                  color="#FFFFFF"
                />
                <Text style={styles.buttonText}>Add Artist</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddArtist;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080808',
  },

  content: {
    padding: 20,
    paddingTop: 45,
    paddingBottom: 40,
  },

  card: {
    backgroundColor: '#151515',
    borderRadius: 20,
    padding: 20,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
  },

  subtitle: {
    color: '#A0A0A0',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 25,
  },

  imageBox: {
    width: 145,
    height: 145,
    borderRadius: 73,
    backgroundColor: '#080808',
    borderWidth: 2,
    borderColor: '#E50914',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 25,
  },

  image: {
    width: '100%',
    height: '100%',
  },

  imageText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 7,
  },

  inputs: {
    gap: 12,
  },

  input: {
    height: 54,
    backgroundColor: '#080808',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#292929',
    paddingHorizontal: 15,
    color: '#FFFFFF',
    fontSize: 15,
  },

  bio: {
    height: 115,
    paddingTop: 15,
    textAlignVertical: 'top',
  },

  button: {
    height: 55,
    backgroundColor: '#E50914',
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  disabled: {
    opacity: 0.6,
  },
});
