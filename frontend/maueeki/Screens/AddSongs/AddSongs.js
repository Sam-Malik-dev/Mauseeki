import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

// IMPORTANT:
// File picker + File object
import { File } from 'expo-file-system';

// IMPORTANT:
// Expo fetch supports Expo File objects in FormData
import { fetch } from 'expo/fetch';


const API = `http://${process.env.EXPO_PUBLIC_BACKEND_IP}:8080/Mauseeki`;


const AddSongs = () => {

  const navigation = useNavigation();



  // ==========================================
  // FORM STATE
  // ==========================================

  const [form, setForm] = useState({
    title: '',
    genre: '',
    category: '',
    language: '',
    duration: '',
    lyrics: '',
    releaseYear: '',
  });


  // These will now contain actual Expo File objects
  const [coverImage, setCoverImage] = useState(null);

  const [audioFile, setAudioFile] = useState(null);

  const [loading, setLoading] = useState(false);


  // ==========================================
  // UPDATE FORM
  // ==========================================

  const update = (key, value) => {

    setForm(prevForm => ({
      ...prevForm,
      [key]: value,
    }));

  };


  // ==========================================
  // PICK COVER IMAGE
  // ==========================================

  const pickImage = async () => {

    try {

      const result = await File.pickFileAsync({

        mimeTypes: ['image/*'],

        multipleFiles: false,

      });


      // User cancelled picker
      if (result.canceled) {
        return;
      }


      // For single-file picker:
      // result.result is actual Expo File
      const selectedFile = result.result;


      if (!selectedFile) {

        Alert.alert(
          'Error',
          'No image was selected.'
        );

        return;

      }


      console.log(
        'SELECTED IMAGE FILE:',
        selectedFile
      );


      console.log(
        'IMAGE URI:',
        selectedFile.uri
      );


      console.log(
        'IMAGE NAME:',
        selectedFile.name
      );


      console.log(
        'IMAGE TYPE:',
        selectedFile.type
      );


      console.log(
        'IMAGE EXISTS:',
        selectedFile.exists
      );


      if (!selectedFile.exists) {

        Alert.alert(
          'Error',
          'Selected image cannot be accessed.'
        );

        return;

      }


      setCoverImage(selectedFile);


    } catch (error) {

      console.log(
        'IMAGE PICK ERROR:',
        error
      );


      console.log(
        'IMAGE PICK ERROR MESSAGE:',
        error?.message
      );


      Alert.alert(
        'Error',
        error?.message ||
          'Unable to select image.'
      );

    }

  };


  // ==========================================
  // PICK AUDIO FILE
  // ==========================================

  const pickAudio = async () => {

    try {

      const result = await File.pickFileAsync({

        mimeTypes: ['audio/*'],

        multipleFiles: false,

      });


      // User cancelled picker
      if (result.canceled) {
        return;
      }


      const selectedFile = result.result;


      if (!selectedFile) {

        Alert.alert(
          'Error',
          'No audio file was selected.'
        );

        return;

      }


      console.log(
        'SELECTED AUDIO FILE:',
        selectedFile
      );


      console.log(
        'AUDIO URI:',
        selectedFile.uri
      );


      console.log(
        'AUDIO NAME:',
        selectedFile.name
      );


      console.log(
        'AUDIO TYPE:',
        selectedFile.type
      );


      console.log(
        'AUDIO EXISTS:',
        selectedFile.exists
      );


      if (!selectedFile.exists) {

        Alert.alert(
          'Error',
          'Selected audio file cannot be accessed.'
        );

        return;

      }


      setAudioFile(selectedFile);


    } catch (error) {

      console.log(
        'AUDIO PICK ERROR:',
        error
      );


      console.log(
        'AUDIO PICK ERROR MESSAGE:',
        error?.message
      );


      Alert.alert(
        'Error',
        error?.message ||
          'Unable to select audio file.'
      );

    }

  };


  // ==========================================
  // ADD SONG
  // ==========================================

  const addSong = async () => {

    // ==========================================
    // 1. REQUIRED FIELDS
    // ==========================================

    const required = [

      ['title', 'song title'],

      ['genre', 'genre'],

      ['category', 'category'],

      ['language', 'language'],

      ['duration', 'duration'],

    ];


    for (const [key, name] of required) {

      if (!form[key]?.trim()) {

        Alert.alert(
          'Error',
          `Please enter ${name}.`
        );

        return;

      }

    }



    // ==========================================
    // 3. COVER CHECK
    // ==========================================

    if (!coverImage) {

      Alert.alert(
        'Error',
        'Please select a cover image.'
      );

      return;

    }


    // ==========================================
    // 4. AUDIO CHECK
    // ==========================================

    if (!audioFile) {

      Alert.alert(
        'Error',
        'Please select an audio file.'
      );

      return;

    }


    try {

      setLoading(true);


      // ==========================================
      // 5. GET TOKEN
      // ==========================================

      const token =
        await AsyncStorage.getItem('token');


      if (!token) {

        Alert.alert(
          'Error',
          'Please login again.'
        );

        return;

      }


      // ==========================================
      // 6. DEBUG INFORMATION
      // ==========================================

      console.log(
        '================================'
      );

      console.log(
        'ADD SONG STARTED'
      );

      console.log(
        'BACKEND API:',
        API
      );

      console.log(
        'COVER URI:',
        coverImage.uri
      );

      console.log(
        'AUDIO URI:',
        audioFile.uri
      );

      console.log(
        'COVER EXISTS:',
        coverImage.exists
      );

      console.log(
        'AUDIO EXISTS:',
        audioFile.exists
      );


      // ==========================================
      // 7. VERIFY FILE ACCESS
      // ==========================================

      if (!coverImage.exists) {

        throw new Error(
          'Cover image cannot be read. Please select it again.'
        );

      }


      if (!audioFile.exists) {

        throw new Error(
          'Audio file cannot be read. Please select it again.'
        );

      }


      // ==========================================
      // 8. CREATE FORMDATA
      // ==========================================

      const data = new FormData();


      // ==========================================
      // 9. ADD TEXT FIELDS
      // ==========================================

      Object.entries(form).forEach(
        ([key, value]) => {

          data.append(
            key,
            value?.trim?.() || ''
          );

        }
      );


      // ==========================================
      // 10. ADD COVER
      // ==========================================

      // coverImage is already Expo File
      // DON'T create new File(coverImage.uri)

      data.append(
        'coverImage',
        coverImage
      );


      // ==========================================
      // 11. ADD AUDIO
      // ==========================================

      // audioFile is already Expo File

      data.append(
        'audioUrl',
        audioFile
      );


      // ==========================================
      // 12. ENDPOINT
      // ==========================================

      const endpoint =
        `${API}/add-songs`;


      console.log(
        'SENDING REQUEST TO:',
        endpoint
      );


      console.log(
        'COVER NAME:',
        coverImage.name
      );


      console.log(
        'AUDIO NAME:',
        audioFile.name
      );


      // ==========================================
      // 13. REQUEST
      // ==========================================

      const res = await fetch(
        endpoint,
        {

          method: 'POST',

          headers: {

            Authorization:
              `Bearer ${token}`,

            // IMPORTANT:
            // DO NOT add:
            //
            // 'Content-Type': 'multipart/form-data'
            //
            // Expo fetch creates boundary automatically.

          },

          body: data,

        }
      );


      // ==========================================
      // 14. RESPONSE STATUS
      // ==========================================

      console.log(
        'HTTP STATUS:',
        res.status
      );


      // ==========================================
      // 15. READ RESPONSE
      // ==========================================

      const responseText =
        await res.text();


      console.log(
        'RAW SERVER RESPONSE:',
        responseText
      );


      // ==========================================
      // 16. CONVERT RESPONSE TO JSON
      // ==========================================

      let result;


      try {

        result =
          JSON.parse(responseText);

      } catch (jsonError) {

        console.log(
          'JSON PARSE ERROR:',
          jsonError
        );


        result = {

          success: false,

          message:
            responseText ||
            'Server returned an invalid response.',

        };

      }


      // ==========================================
      // 17. HTTP ERROR
      // ==========================================

      if (!res.ok) {

        console.log(
          'SERVER ERROR:',
          result
        );


        Alert.alert(
          'Failed',
          result?.message ||
            `Server error ${res.status}`
        );


        return;

      }


      // ==========================================
      // 18. BACKEND success:false
      // ==========================================

      if (result?.success === false) {

        console.log(
          'BACKEND FAILED:',
          result
        );


        Alert.alert(
          'Failed',
          result?.message ||
            'Unable to add song.'
        );


        return;

      }


      // ==========================================
      // 19. SUCCESS
      // ==========================================

      console.log(
        'SONG ADDED SUCCESSFULLY:',
        result
      );


      Alert.alert(

        'Success',

        'Song added successfully.',

        [

          {

            text: 'OK',

            onPress: () =>
              navigation.goBack(),

          },

        ]

      );


      // ==========================================
      // 20. RESET FORM
      // ==========================================

      setForm({

        title: '',

        genre: '',

        category: '',

        language: '',

        duration: '',

        lyrics: '',

        releaseYear: '',

      });


      setCoverImage(null);

      setAudioFile(null);


    } catch (error) {


      // ==========================================
      // REAL ERROR
      // ==========================================

      console.log(
        'ADD SONG ERROR:',
        error
      );


      console.log(
        'ERROR MESSAGE:',
        error?.message
      );


      Alert.alert(
        'Upload Error',
        error?.message ||
          'Unable to connect to server.'
      );


    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // INPUT FIELDS
  // ==========================================

  const fields = [

    ['title', 'Song Title'],

    ['genre', 'Genre'],

    ['category', 'Category'],

    ['language', 'Language'],

    ['duration', 'Duration e.g. 03:45'],

    ['releaseYear', 'Release Year'],

  ];


  // ==========================================
  // UI
  // ==========================================

  return (

    <KeyboardAvoidingView

      style={styles.container}

      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : 'height'
      }

    >

      <StatusBar
        barStyle="light-content"
      />


      <ScrollView

        contentContainerStyle={
          styles.scroll
        }

        showsVerticalScrollIndicator={
          false
        }

        keyboardShouldPersistTaps="handled"

      >

        <View style={styles.card}>


          {/* TITLE */}

          <Text style={styles.title}>

            Add Your Song

          </Text>


          <Text style={styles.subtitle}>

            Add a new song

          </Text>


          {/* =====================================
              COVER IMAGE
          ====================================== */}

          <TouchableOpacity

            style={styles.cover}

            onPress={pickImage}

            disabled={loading}

          >

            {coverImage ? (

              <Image

                source={{
                  uri: coverImage.uri,
                }}

                style={
                  styles.coverImage
                }

              />

            ) : (

              <>

                <Ionicons

                  name="image-outline"

                  size={30}

                  color="#E50914"

                />


                <Text
                  style={styles.coverText}
                >

                  Add Cover

                </Text>

              </>

            )}

          </TouchableOpacity>


          {/* =====================================
              FORM INPUTS
          ====================================== */}

          <View style={styles.inputs}>

            {fields.map(
              ([key, placeholder]) => (

                <TextInput

                  key={key}

                  style={styles.input}

                  placeholder={
                    placeholder
                  }

                  placeholderTextColor="#666"

                  value={
                    form[key]
                  }

                  editable={!loading}

                  onChangeText={text => {

                    if (
                      key === 'releaseYear'
                    ) {

                      update(
                        key,
                        text.replace(
                          /[^0-9]/g,
                          ''
                        )
                      );

                    } else {

                      update(
                        key,
                        text
                      );

                    }

                  }}

                  keyboardType={
                    key === 'releaseYear'
                      ? 'numeric'
                      : 'default'
                  }

                  maxLength={
                    key === 'releaseYear'
                      ? 4
                      : undefined
                  }

                />

              )
            )}


            {/* =====================================
                LYRICS
            ====================================== */}

            <TextInput

              style={[
                styles.input,
                styles.lyrics,
              ]}

              placeholder="Lyrics"

              placeholderTextColor="#666"

              value={
                form.lyrics
              }

              editable={!loading}

              onChangeText={text =>
                update(
                  'lyrics',
                  text
                )
              }

              multiline

            />

          </View>


          {/* =====================================
              AUDIO FILE
          ====================================== */}

          <TouchableOpacity

            style={styles.audio}

            onPress={pickAudio}

            disabled={loading}

          >

            <Ionicons

              name="musical-notes-outline"

              size={25}

              color="#E50914"

            />


            <View
              style={styles.audioInfo}
            >

              <Text

                style={
                  styles.audioTitle
                }

                numberOfLines={1}

              >

                {audioFile?.name ||
                  'Select Audio File'}

              </Text>


              <Text
                style={styles.audioText}
              >

                {audioFile
                  ? 'Audio selected'
                  : 'MP3, WAV or other audio'}

              </Text>

            </View>


            <Ionicons

              name="chevron-forward"

              size={20}

              color="#A0A0A0"

            />

          </TouchableOpacity>


          {/* =====================================
              ADD SONG BUTTON
          ====================================== */}

          <TouchableOpacity

            style={[
              styles.button,

              loading &&
                styles.disabled,
            ]}

            onPress={addSong}

            disabled={loading}

          >

            {loading ? (

              <ActivityIndicator
                color="#FFFFFF"
              />

            ) : (

              <>

                <Ionicons

                  name="add-circle-outline"

                  size={22}

                  color="#FFFFFF"

                />


                <Text
                  style={
                    styles.buttonText
                  }
                >

                  Add Song

                </Text>

              </>

            )}

          </TouchableOpacity>

        </View>

      </ScrollView>

    </KeyboardAvoidingView>

  );

};


export default AddSongs;


// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({

  container: {

    flex: 1,

    backgroundColor: '#080808',

  },


  scroll: {

    padding: 20,

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

    marginBottom: 22,

  },


  cover: {

    width: 150,

    height: 150,

    alignSelf: 'center',

    backgroundColor: '#080808',

    borderRadius: 15,

    borderWidth: 1,

    borderColor: '#E50914',

    alignItems: 'center',

    justifyContent: 'center',

    overflow: 'hidden',

    marginBottom: 22,

  },


  coverImage: {

    width: '100%',

    height: '100%',

  },


  coverText: {

    color: '#FFFFFF',

    marginTop: 7,

  },


  inputs: {

    gap: 12,

  },


  input: {

    height: 55,

    backgroundColor: '#080808',

    borderRadius: 12,

    paddingHorizontal: 15,

    color: '#FFFFFF',

    borderWidth: 1,

    borderColor: '#292929',

  },


  lyrics: {

    height: 110,

    paddingTop: 15,

    textAlignVertical: 'top',

  },


  audio: {

    minHeight: 65,

    marginTop: 15,

    padding: 14,

    backgroundColor: '#080808',

    borderRadius: 12,

    flexDirection: 'row',

    alignItems: 'center',

  },


  audioInfo: {

    flex: 1,

    marginHorizontal: 12,

  },


  audioTitle: {

    color: '#FFFFFF',

    fontWeight: '600',

  },


  audioText: {

    color: '#A0A0A0',

    fontSize: 12,

    marginTop: 3,

  },


  button: {

    height: 55,

    marginTop: 20,

    backgroundColor: '#E50914',

    borderRadius: 12,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    gap: 8,

  },


  buttonText: {

    color: '#FFFFFF',

    fontSize: 17,

    fontWeight: '700',

  },


  disabled: {

    opacity: 0.6,

  },

});