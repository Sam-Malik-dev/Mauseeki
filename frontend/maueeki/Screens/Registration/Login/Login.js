import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';

import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const navigation = useNavigation();

  const [logindata, setlogindata] = useState({
    email: '',
    password: '',
    VerifyCode: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setlogindata({
      ...logindata,
      [name]: value,
    });
  };

  const submit = async () => {
    if (
      !logindata.email.trim() ||
      !logindata.password ||
      !logindata.VerifyCode.trim()
    ) {
      Alert.alert(
        'Error',
        'Please enter your email, VerifyCode and password'
      );
      return;
    }

    try {
      setLoading(true);

      const ip = process.env.EXPO_PUBLIC_BACKEND_IP;

      if (!ip) {
        Alert.alert(
          'Configuration Error',
          'Backend IP is not configured.'
        );
        return;
      }

      const url = `http://${ip}:8080/Mauseeki/log-in`;

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: logindata.email.trim(),
          password: logindata.password,
          VerifyCode: logindata.VerifyCode.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        await AsyncStorage.setItem('token', data.token);

        Alert.alert('Success', 'Logged in...', [
          {
            text: 'OK',
            onPress: () => {
              navigation.replace('main');
            },
          },
        ]);
      } else {
        Alert.alert(
          'Login Failed',
          data.message ||
            'Invalid email, password or VerifyCode'
        );
      }
    } catch (error) {
      console.log('LOGIN ERROR:', error);

      Alert.alert(
        'Connection Error',
        'Unable to connect to the server.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.card}>

        <Text style={styles.title}>
          Login
        </Text>

        <Text style={styles.subtitle}>
          Welcome! Please Login to continue
        </Text>

        <View style={styles.inputContainer}>

          <TextInput
            placeholder="Email Address"
            placeholderTextColor="#666"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            value={logindata.email}
            onChangeText={(text) =>
              handleChange('email', text)
            }
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor="#666"
            style={styles.input}
            secureTextEntry
            value={logindata.password}
            onChangeText={(text) =>
              handleChange('password', text)
            }
          />

          <TextInput
            placeholder="Verify OTP"
            placeholderTextColor="#666"
            style={styles.input}
            keyboardType="number-pad"
            maxLength={6}
            value={logindata.VerifyCode}
            onChangeText={(text) =>
              handleChange('VerifyCode', text)
            }
          />

        </View>

        <TouchableOpacity
          style={[
            styles.LoginBtn,
            loading && styles.disabledButton,
          ]}
          onPress={submit}
          disabled={loading}
        >
          <Text style={styles.LoginText}>
            {loading ? 'Logging in...' : 'Login'}
          </Text>
        </TouchableOpacity>

        <View style={styles.bottomContainer}>

          <Text style={styles.bottomText}>
            Don't have an account?
          </Text>

          <TouchableOpacity
            onPress={() => navigation.navigate('sign')}
          >
            <Text style={styles.Loginnav}>
              {' '}Signup
            </Text>
          </TouchableOpacity>

        </View>

      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080808',
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    width: '100%',
    backgroundColor: '#151515',
    borderRadius: 25,
    padding: 28,
    borderWidth: 1,
    borderColor: '#E50914',
  },

  title: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  subtitle: {
    color: '#A0A0A0',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 30,
  },

  inputContainer: {
    gap: 18,
  },

  input: {
    height: 58,
    backgroundColor: '#080808',
    borderRadius: 12,
    paddingHorizontal: 18,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#252525',
  },

  LoginBtn: {
    height: 58,
    backgroundColor: '#E50914',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },

  disabledButton: {
    opacity: 0.7,
  },

  LoginText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },

  bottomText: {
    color: '#A0A0A0',
    fontSize: 15,
  },

  Loginnav: {
    color: '#E50914',
    fontSize: 15,
    fontWeight: 'bold',
  },
});