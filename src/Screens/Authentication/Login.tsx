import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Alert,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import FontAwe from 'react-native-vector-icons/FontAwesome';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {
  isErrorWithCode,
  statusCodes,
  User,
} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {BASE_URL} from '../../../config';

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
};

type State = {
  userInfo: User | undefined;
  error: Error | undefined;
};

type NavigationProps = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

const Login = () => {
  const state = {
    userInfo: undefined,
    error: undefined,
  };
  const navigation = useNavigation<NavigationProps>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Configure Google Sign-In
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '69841653842-24bq4babevhcbjkhlqdtou721dl5cir6.apps.googleusercontent.com',
    });
  }, []);

  const handleLogin = async () => {
    console.log('Login button pressed');
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
  
    try {
      console.log('Attempting to log in with email:', email);
      console.log('URL', BASE_URL);
      const response = await axios.post(
        `${BASE_URL}/api/auth/login`,
        {
          email,
          password,
        },
        
      );
      console.log('below response', response.data);
      const {token, user} = response.data; 
      
      // Store token securely
      await AsyncStorage.setItem('authToken', token);

      Alert.alert('Login Successful', `Welcome ${user.name}`);
      navigation.navigate('Dashboard');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.msg || 'Login failed');
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <ImageBackground
      source={require('../../../assets/login_bg.jpg')}
      style={styles.background}>
      <View style={styles.overlay} />
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
        />

        <View style={styles.passwordContainer}>
          <Text style={styles.label}>Password</Text>
          <FontAwe name="eye" size={15} color="white" />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Enter password"
          placeholderTextColor="#ccc"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleLogin()}
          style={styles.loginButton}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.signupText}>
          Don't have an account?
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.signupLink}> Sign up</Text>
          </TouchableOpacity>
        </Text>

        {/* <Text style={styles.orText}>Or</Text>

        <TouchableOpacity
          onPress={onGoogleButtonPress}
          style={styles.googleButton}>
          <Text style={styles.googleText}>Continue to login with Google</Text>
          <FontAwe name="google" size={30} color="white" />
        </TouchableOpacity> */}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  container: {
    width: '85%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 40,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    marginTop: 10,
    color: 'white',
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    color: 'white',
  },
  passwordContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotPassword: {
    fontSize: 12,
    fontStyle: 'italic',
    color: 'white',
    textAlign: 'right',
    marginBottom: 15,
    marginTop: 5,
  },
  loginButton: {
    backgroundColor: 'rgba(7, 10, 10, 1)',
    paddingVertical: 10,
    borderRadius: 29,
    alignItems: 'center',
    borderColor: 'rgb(49, 76, 106)',
    borderWidth: 2,
  },
  loginText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 15,
  },
  signupLink: {
    color: 'rgb(40, 117, 205)',
    fontWeight: 'bold',
  },
  orText: {
    color: 'white',
    textAlign: 'center',
    marginVertical: 10,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(40, 117, 205)',
    padding: 10,
    borderRadius: 10,
  },
  googleText: {
    color: 'white',
    marginRight: 10,
  },
});

export default Login;
