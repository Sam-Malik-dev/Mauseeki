import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";

const API_URL = `http://${process.env.EXPO_PUBLIC_BACKEND_IP}:8080/Mauseeki`;

const UpdateProfileScreen = () => {
  const navigation = useNavigation();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilepic, setProfilepic] = useState(null);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    getUser();
  }, []);

  const handleUnauthorized = async () => {
    await AsyncStorage.removeItem("token");
    Alert.alert("Session expired", "Please login again.");
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  const getUser = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("token");

      console.log("TOKEN EXISTS:", !!token);

      if (!token) {
        Alert.alert("Error", "Please login again.");
        return;
      }

      const response = await fetch(`${API_URL}/you`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const text = await response.text();

      console.log("USER RAW RESPONSE:", text);

      let data;

      try {
        data = JSON.parse(text);
      } catch (error) {
        console.log("USER JSON ERROR:", error);
        Alert.alert("Error", "Invalid server response.");
        return;
      }

      console.log("USER DATA:", data);

      if (response.status === 401) {
        await handleUnauthorized();
        return;
      }

      if (!response.ok) {
        Alert.alert(
          "Error",
          data.message || "Unable to load profile."
        );
        return;
      }

      setFirstname(data.firstname || "");
      setLastname(data.lastname || "");
      setEmail(data.email || "");

      if (data.profilepic) {
        setProfilepic({
          uri: data.profilepic,
          isOld: true,
        });
      }
    } catch (error) {
      console.log("GET USER ERROR:", error);

      Alert.alert(
        "Error",
        "Unable to load your profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const chooseImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission required",
          "Please allow photo library permission."
        );
        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

      if (result.canceled) {
        return;
      }

      const image = result.assets[0];

      console.log("SELECTED IMAGE:", image);

      setProfilepic({
        uri: image.uri,
        name:
          image.fileName ||
          `profile-${Date.now()}.jpg`,
        type:
          image.mimeType ||
          "image/jpeg",
        isOld: false,
      });
    } catch (error) {
      console.log("IMAGE PICKER ERROR:", error);

      Alert.alert(
        "Error",
        "Unable to select image."
      );
    }
  };

  const updateProfile = async () => {
    try {
      if (!firstname.trim()) {
        Alert.alert("Error", "Please enter your first name.");
        return;
      }

      if (!lastname.trim()) {
        Alert.alert("Error", "Please enter your last name.");
        return;
      }

      if (!email.trim()) {
        Alert.alert("Error", "Please enter your email.");
        return;
      }

      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Error", "Please login again.");
        return;
      }

      setUpdating(true);

      const formData = new FormData();

      formData.append("firstname", firstname.trim());
      formData.append("lastname", lastname.trim());
      formData.append("email", email.trim());

      if (password.trim()) {
        formData.append("password", password.trim());
      }

      if (profilepic && profilepic.uri && !profilepic.isOld) {
        formData.append("profilepic", {
          uri: profilepic.uri,
          name:
            profilepic.name ||
            `profile-${Date.now()}.jpg`,
          type:
            profilepic.type ||
            "image/jpeg",
        });
      }

      console.log("UPDATING PROFILE...");
      console.log("FIRSTNAME:", firstname.trim());
      console.log("LASTNAME:", lastname.trim());
      console.log("EMAIL:", email.trim());
      console.log("PASSWORD:", password.trim() ? "YES" : "NO");
      console.log("PROFILE IMAGE:", profilepic?.uri || "NO NEW IMAGE");

      const response = await fetch(`${API_URL}/update-profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const text = await response.text();

      console.log("UPDATE RAW RESPONSE:", text);

      let data;

      try {
        data = JSON.parse(text);
      } catch (error) {
        console.log("UPDATE JSON ERROR:", error);
        Alert.alert("Error", "Server returned an invalid response.");
        return;
      }

      console.log("UPDATE RESPONSE:", data);

      if (response.status === 401) {
        await handleUnauthorized();
        return;
      }

      if (response.status === 409) {
        Alert.alert("Error", data.message || "Email already in use.");
        return;
      }

      if (!response.ok) {
        Alert.alert("Error", data.message || "Profile update failed.");
        return;
      }

      Alert.alert("Success", data.message || "Profile updated successfully.");

      setPassword("");

      if (data.user) {
        setFirstname(data.user.firstname || "");
        setLastname(data.user.lastname || "");
        setEmail(data.user.email || "");

        if (data.user.profilepic) {
          setProfilepic({
            uri: data.user.profilepic,
            isOld: true,
          });
        }
      }
    } catch (error) {
      console.log("UPDATE PROFILE ERROR:", error);

      Alert.alert(
        "Error",
        "Something went wrong while updating profile."
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#DAEF4D" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Update Profile</Text>
        <Text style={styles.subtitle}>Update your account information</Text>

        <TouchableOpacity
          style={styles.imageContainer}
          onPress={chooseImage}
          activeOpacity={0.8}
        >
          {profilepic?.uri ? (
            <Image
              source={{ uri: profilepic.uri }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imageText}>+</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.changeText}>Change Profile Picture</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            value={firstname}
            onChangeText={setFirstname}
            placeholder="Enter first name"
            placeholderTextColor="#6F7F83"
            style={styles.input}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            value={lastname}
            onChangeText={setLastname}
            placeholder="Enter last name"
            placeholderTextColor="#6F7F83"
            style={styles.input}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email"
            placeholderTextColor="#6F7F83"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>New Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Leave empty to keep current password"
            placeholderTextColor="#6F7F83"
            style={styles.input}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          style={[styles.updateButton, updating && styles.disabledButton]}
          onPress={updateProfile}
          disabled={updating}
          activeOpacity={0.8}
        >
          {updating ? (
            <ActivityIndicator size="small" color="#091518" />
          ) : (
            <Text style={styles.updateButtonText}>Update Profile</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default UpdateProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#091518",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#091518",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#A1B8BC",
    marginTop: 12,
    fontSize: 14,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    color: "#A1B8BC",
    fontSize: 14,
    marginTop: 7,
    marginBottom: 30,
  },
  imageContainer: {
    alignSelf: "center",
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    marginBottom: 10,
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#1C2529",
    justifyContent: "center",
    alignItems: "center",
  },
  imageText: {
    color: "#DAEF4D",
    fontSize: 42,
    fontWeight: "300",
  },
  changeText: {
    color: "#DAEF4D",
    textAlign: "center",
    fontSize: 14,
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 18,
  },
  label: {
    color: "#A1B8BC",
    fontSize: 13,
    marginBottom: 8,
  },
  input: {
    height: 52,
    backgroundColor: "#1C2529",
    borderRadius: 12,
    paddingHorizontal: 15,
    color: "#FFFFFF",
    fontSize: 15,
  },
  updateButton: {
    height: 54,
    backgroundColor: "#DAEF4D",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.7,
  },
  updateButtonText: {
    color: "#091518",
    fontSize: 16,
    fontWeight: "700",
  },
});