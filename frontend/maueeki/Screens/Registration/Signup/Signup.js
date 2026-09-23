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

const API = `http://${process.env.EXPO_PUBLIC_BACKEND_IP}:8080/Mauseeki`;

const Signup = () => {
  const navigation = useNavigation();

  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  });

  const [profilepic, setProfilepic] = useState(null);
  const [loading, setLoading] = useState(false);

  const update = (key, value) => {
    setForm({
      ...form,
      [key]: value,
    });
  };

  const pickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Permission Required',
          'Please allow photo access.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setProfilepic(result.assets[0]);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Unable to select image.');
    }
  };

  const signup = async () => {
    if (!form.firstname.trim()) {
      Alert.alert('Error', 'Please enter first name.');
      return;
    }

    if (!form.lastname.trim()) {
      Alert.alert('Error', 'Please enter last name.');
      return;
    }

    if (!form.email.trim()) {
      Alert.alert('Error', 'Please enter email.');
      return;
    }

    if (!form.password) {
      Alert.alert('Error', 'Please enter password.');
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append('firstname', form.firstname.trim());
      data.append('lastname', form.lastname.trim());
      data.append('email', form.email.trim());
      data.append('password', form.password);

      if (profilepic?.uri) {
        const file = new File(profilepic.uri);

        if (!file.exists) {
          Alert.alert(
            'Error',
            'Image not found. Please select again.'
          );
          return;
        }

        data.append('profilepic', file);
      }

      const response = await fetch(`${API}/sign-up`, {
        method: 'POST',
        body: data,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        Alert.alert(
          'Signup Failed',
          result.message || 'Unable to signup.'
        );
        return;
      }

      Alert.alert(
        'Success',
        'Signup successful. Check your email for verification code.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('login'),
          },
        ]
      );

      setForm({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
      });

      setProfilepic(null);

    } catch (error) {
      console.log('SIGNUP ERROR:', error);

      Alert.alert(
        'Error',
        error.message || 'Unable to connect to server.'
      );
    } finally {
      setLoading(false);
    }
  };

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

          <Text style={styles.title}>Create Account</Text>

          <Text style={styles.subtitle}>
            Signup to start using Mauseeki
          </Text>

          <TouchableOpacity
            style={styles.imageBox}
            onPress={pickImage}
            activeOpacity={0.8}
          >
            {profilepic ? (
              <Image
                source={{ uri: profilepic.uri }}
                style={styles.image}
              />
            ) : (
              <>
                <Ionicons
                  name="person-outline"
                  size={35}
                  color="#E50914"
                />

                <Text style={styles.imageText}>
                  Add Profile Picture
                </Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.inputs}>

            <TextInput
              style={styles.input}
              placeholder="First Name"
              placeholderTextColor="#666"
              value={form.firstname}
              onChangeText={text =>
                update('firstname', text)
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Last Name"
              placeholderTextColor="#666"
              value={form.lastname}
              onChangeText={text =>
                update('lastname', text)
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#666"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={text =>
                update('email', text)
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#666"
              secureTextEntry
              value={form.password}
              onChangeText={text =>
                update('password', text)
              }
            />

          </View>

          <TouchableOpacity
            style={[
              styles.button,
              loading && styles.disabled,
            ]}
            onPress={signup}
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

                <Text style={styles.buttonText}>
                  Signup
                </Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.bottom}>
            <Text style={styles.bottomText}>
              Already have an account?
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate('login')}
            >
              <Text style={styles.loginText}>
                {' '}Login
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080808',
  },

  content: {
    padding: 20,
    paddingTop: 45,
    paddingBottom: 40,
    flexGrow: 1,
    justifyContent: 'center',
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

  bottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },

  bottomText: {
    color: '#A0A0A0',
  },

  loginText: {
    color: '#E50914',
    fontWeight: 'bold',
  },
});