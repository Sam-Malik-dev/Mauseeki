import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const Activities = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.Container}>

      <View style={styles.Header}>
        <Text style={styles.Title}>Your Activities</Text>
        <Text style={styles.SubTitle}>
          Manage your music activity
        </Text>
      </View>

      {/* Your Uploads */}
      <Text style={styles.SectionTitle}>Your Uploads</Text>

      <View style={styles.ProfileTable}>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Your-songs')}
        >
          <View style={styles.ProfileBox}>
            <View style={styles.LeftContent}>
              <View style={styles.IconBox}>
                <Ionicons
                  name="musical-notes"
                  size={22}
                  color="#E50914"
                />
              </View>

              <Text style={styles.BoxText}>
                Uploaded Songs
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={22}
              color="#FFFFFF"
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Your-albums')}
        >
          <View style={styles.ProfileBox}>
            <View style={styles.LeftContent}>
              <View style={styles.IconBox}>
                <Ionicons
                  name="albums"
                  size={22}
                  color="#E50914"
                />
              </View>

              <Text style={styles.BoxText}>
                Uploaded Albums
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={22}
              color="#FFFFFF"
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Your-artists')}
        >
          <View style={styles.ProfileBox}>
            <View style={styles.LeftContent}>
              <View style={styles.IconBox}>
                <Ionicons
                  name="people"
                  size={22}
                  color="#E50914"
                />
              </View>

              <Text style={styles.BoxText}>
                Uploaded Artists
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={22}
              color="#FFFFFF"
            />
          </View>
        </TouchableOpacity>

      </View>

      {/* Create & Upload */}
      <Text style={styles.SectionTitle}>Create & Upload</Text>

      <View style={styles.CreateContainer}>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.CreateBox}
          onPress={() => navigation.navigate('add-artist')}
        >
          <View style={styles.CreateIcon}>
            <Ionicons
              name="person-add"
              size={25}
              color="#E50914"
            />
          </View>

          <Text style={styles.CreateTitle}>
            Add Artist
          </Text>

          <Text style={styles.CreateSubtitle}>
            Create a new artist
          </Text>

          <View style={styles.AddButton}>
            <Ionicons
              name="add"
              size={18}
              color="#080808"
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.CreateBox}
          onPress={() => navigation.navigate('Add-Album')}
        >
          <View style={styles.CreateIcon}>
            <Ionicons
              name="disc"
              size={25}
              color="#E50914"
            />
          </View>

          <Text style={styles.CreateTitle}>
            Add Album
          </Text>

          <Text style={styles.CreateSubtitle}>
            Upload a new album
          </Text>

          <View style={styles.AddButton}>
            <Ionicons
              name="add"
              size={18}
              color="#080808"
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.CreateBox}
          onPress={() => navigation.navigate('add-song')}
        >
          <View style={styles.CreateIcon}>
            <Ionicons
              name="musical-note"
              size={25}
              color="#E50914"
            />
          </View>

          <Text style={styles.CreateTitle}>
            Add Song
          </Text>

          <Text style={styles.CreateSubtitle}>
            Upload a new song
          </Text>

          <View style={styles.AddButton}>
            <Ionicons
              name="add"
              size={18}
              color="#080808"
            />
          </View>
        </TouchableOpacity>

      </View>

    </View>
  );
};

export default Activities;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#080808',
    paddingHorizontal: 20,
    paddingTop: 55,
  },

  Header: {
    marginBottom: 25,
  },

  Title: {
    color: '#E50914',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  SubTitle: {
    color: '#A0A0A0',
    fontSize: 14,
    marginTop: 7,
  },

  SectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },

  ProfileTable: {
    width: '100%',
    marginBottom: 25,
  },

  ProfileBox: {
    width: '100%',
    height: 72,
    backgroundColor: '#151515',
    borderRadius: 14,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#292929',
  },

  LeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  IconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#252525',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  BoxText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },

  CreateContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  CreateBox: {
    width: '48%',
    minHeight: 145,
    backgroundColor: '#151515',
    borderRadius: 16,
    padding: 15,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#292929',
    position: 'relative',
  },

  CreateIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#252525',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  CreateTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  CreateSubtitle: {
    color: '#888888',
    fontSize: 12,
    marginTop: 5,
  },

  AddButton: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E50914',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
