import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import React from 'react';
import { useNavigation } from '@react-navigation/native';

const Front = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.front}>
      <View style={styles.container}>

        <View>
          <Text style={styles.heading}>
            Mauseeki
          </Text>

          <Text style={styles.h2}>
            your music, evolved
          </Text>
        </View>

        <View style={styles.btn}>

          <TouchableOpacity
            style={styles.sign}
            onPress={() => navigation.navigate('sign')}
          >
            <Text style={styles.signText}>
              Sign Up
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.log}
            onPress={() => navigation.navigate('login')}
          >
            <Text style={styles.btnText}>
              Log in
            </Text>
          </TouchableOpacity>

        </View>

      </View>
    </View>
  );
};

export default Front;

const styles = StyleSheet.create({
  front: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#080808',
  },

  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'column',
  },

  heading: {
    fontSize: 42,
    fontFamily: 'SpaceGroteskBold',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 8,
  },

  h2: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk',
    color: '#A0A0A0',
    textAlign: 'center',
    textTransform: 'capitalize',
    letterSpacing: 0.5,
  },

  btn: {
    width: 250,
    height: 52,
    borderWidth: 2,
    borderColor: '#E50914',
    borderRadius: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },

  sign: {
    width: '60%',
    height: '100%',
    backgroundColor: '#E50914',
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },

  log: {
    width: '40%',
    height: '100%',
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },

  signText: {
    fontSize: 16,
    fontFamily: 'SpaceGroteskSemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
  },

  btnText: {
    fontSize: 16,
    fontFamily: 'SpaceGroteskSemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});