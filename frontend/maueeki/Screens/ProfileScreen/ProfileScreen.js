import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import React, { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";

const API = `http://${process.env.EXPO_PUBLIC_BACKEND_IP}:8080/Mauseeki`;

const ProfileScreen = () => {
  const navigation = useNavigation();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const thisuser = async () => {
        try {
          setLoading(true);

          const token = await AsyncStorage.getItem("token");

          if (!token) {
            console.log("No token found");
            navigation.replace("login");
            return;
          }
          const url = `${API}/you`;

          const res = await fetch(url, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          const data = await res.json();

          console.log("USER:", data);

          if (!isActive) return;

          if (res.ok) {
            setUser(data);
          } else {
            console.log("Error:", data.message);
          }
        } catch (error) {
          console.log("Fetch error:", error);
        } finally {
          if (isActive) setLoading(false);
        }
      };

      thisuser();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const goTo = (screen) => {
    setMenuOpen(false);
    navigation.navigate(screen);
  };

  const signout = async () => {
    try {
      setSigningOut(true);
      setMenuOpen(false);

      const token = await AsyncStorage.getItem("token");

      if (!token) {
        navigation.replace("login");
        return;
      }

      const res = await fetch(`${API}/singout`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      console.log("SIGN OUT RESPONSE:", data);

      if (res.ok && data.success) {
        await AsyncStorage.removeItem("token");

        setUser(null);

        navigation.replace("login");
      } else {
        Alert.alert(
          "Sign Out Failed",
          data.message || "Unable to sign out"
        );
      }
    } catch (error) {
      console.log("SIGN OUT ERROR:", error);

      Alert.alert(
        "Error",
        "Something went wrong while signing out"
      );
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <View style={styles.profile}>
      <View style={styles.container}>

        {/* Header */}

        <View style={styles.mainArea}>
          {loading ? (
            <ActivityIndicator
              size="small"
              color="#E50914"
            />
          ) : (
            <Text style={styles.welcome}>
              {user?.firstname} {user?.lastname}
            </Text>
          )}

          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={() => setMenuOpen(true)}
          >
            <Icon
              name="settings-outline"
              size={22}
              color="#A0A0A0"
            />
          </TouchableOpacity>
        </View>

        {/* Settings Menu */}

        <Modal
          visible={menuOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setMenuOpen(false)}
        >
          <Pressable
            style={styles.overlay}
            onPress={() => setMenuOpen(false)}
          >
            <View style={styles.menu}>

              {/* Contact Us */}

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => goTo("contactus")}
              >
                <Icon
                  name="mail-outline"
                  size={18}
                  color="#A0A0A0"
                />

                <Text style={styles.menuText}>
                  Contact Us
                </Text>
              </TouchableOpacity>

              {/* Sign Out */}

              <TouchableOpacity
                style={styles.menuItem}
                onPress={signout}
                disabled={signingOut}
              >
                {signingOut ? (
                  <ActivityIndicator
                    size="small"
                    color="#E50914"
                  />
                ) : (
                  <Icon
                    name="log-out-outline"
                    size={18}
                    color="#A0A0A0"
                  />
                )}

                <Text style={styles.menuText}>
                  {signingOut
                    ? "Signing Out..."
                    : "Sign Out"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  navigation.navigate("login");
                }}
              >
                <Text style={styles.menuText}>
                  Log in
                </Text>
              </TouchableOpacity>

            </View>
          </Pressable>
        </Modal>

        {/* Main Content */}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >

          {/* Profile Card */}

          {user && (
            <View style={styles.profileCard}>

              {user.profilepic ? (
                <Image
                  source={{
                    uri: user.profilepic,
                  }}
                  style={styles.profileImage}
                  onLoad={() =>
                    console.log("PROFILE IMAGE LOADED")
                  }
                  onError={(error) =>
                    console.log(
                      "PROFILE IMAGE ERROR:",
                      error.nativeEvent
                    )
                  }
                />
              ) : (
                <View style={styles.profilePlaceholder}>
                  <Text style={styles.profileLetter}>
                    {user.firstname?.charAt(0)}
                  </Text>
                </View>
              )}

              <Text style={styles.name}>
                {user.firstname} {user.lastname}
              </Text>

              <Text style={styles.email}>
                {user.email}
              </Text>

            </View>
          )}

          {/* Profile Buttons */}

          <View style={styles.ProfileButtons}>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("edit-profile")
              }
            >
              <Text style={styles.edit}>
                Edit Profile
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("activities")
              }
            >
              <Text style={styles.analytics}>
                Your Activities
              </Text>
            </TouchableOpacity>

          </View>

          {/* Library */}

          <View style={styles.ProfileTable}>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Likes")
              }
            >
              <View style={styles.ProfileBox}>
                <Text style={styles.BoxText}>
                  Liked Songs
                </Text>

                <Text style={styles.ArrowText}>
                  →
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Fav")
              }
            >
              <View style={styles.ProfileBox}>
                <Text style={styles.BoxText}>
                  Favourite Albums
                </Text>

                <Text style={styles.ArrowText}>
                  →
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("followed")
              }
            >
              <View style={styles.ProfileBox}>
                <Text style={styles.BoxText}>
                  Followed Artists
                </Text>

                <Text style={styles.ArrowText}>
                  →
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("your-playlist")
              }
            >
              <View style={styles.ProfileBox}>
                <Text style={styles.BoxText}>
                  Your Playlist
                </Text>

                <Text style={styles.ArrowText}>
                  →
                </Text>
              </View>
            </TouchableOpacity>

          </View>

        </ScrollView>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  profile: {
    flex: 1,
    backgroundColor: "#080808",
  },
  container: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 55,
  },
  mainArea: {
    width: "100%",
    marginBottom: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcome: {
    color: "#E50914",
    fontSize: 28,
    fontWeight: "700",
  },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#151515",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  menu: {
    position: "absolute",
    top: 95,
    right: 20,
    backgroundColor: "#151515",
    borderRadius: 12,
    paddingVertical: 6,
    width: 190,
    elevation: 8,
    shadowColor: "#151515",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuText: {
    color: "#A0A0A0",
    fontSize: 14,
    fontWeight: "600",
  },
  scrollContent: {
    paddingBottom: 100,
  },
  profileCard: {
    width: "100%",
    borderRadius: 25,
    padding: 25,
    alignItems: "center",
  },
  profileImage: {
    width: 210,
    height: 210,
    borderRadius: 150,
    marginBottom: 18,
  },
  profilePlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#E50914",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },
  profileLetter: {
    color: "#000",
    fontSize: 45,
    fontWeight: "700",
  },
  name: {
    width: "100%",
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 5,
    textTransform: "capitalize",
  },
  email: {
    color: "#A0A0A0",
    fontSize: 15,
  },
  ProfileButtons: {
    marginTop: 5,
    marginBottom: 35,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    rowGap: 40,
  },
  edit: {
    width: 150,
    padding: 15,
    color: "#FFFFFF",
    backgroundColor: "#E50914",
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
    borderRadius: 30,
  },
  analytics: {
    width: 150,
    padding: 15,
    color: "#A0A0A0",
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#A0A0A0",
  },
  ProfileTable: {
    width: "100%",
  },
  ProfileBox: {
    width: "100%",
    height: 70,
    backgroundColor: "#151515",
    borderRadius: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    marginBottom: 10,
  },
  BoxText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  ArrowText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
  },
});