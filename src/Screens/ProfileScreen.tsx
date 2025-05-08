import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {BASE_URL} from '../../config';
import {RootStackParamList} from '../types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ProfileScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [userName, setUserName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editPasswordModalVisible, setEditPasswordModalVisible] =
    useState(false);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          Alert.alert(
            'Error',
            'No authentication token found. Please log in again.',
          );
          navigation.navigate('Login');
          return;
        }
        const response = await axios.get(`${BASE_URL}/api/users/profile`, {
          headers: {Authorization: `Bearer ${token}`},
        });

        setUserName(response.data?.name || 'No Name');
        setEmail(response.data?.email || 'No Email');
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to fetch user data.');
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      Alert.alert('Logged Out', 'You have been logged out successfully.');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Logout Failed', 'An error occurred while logging out.');
    }
  };

  const handlePasswordUpdate = async () => {
    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters.');
      return;
    }
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'No authentication token found.');
        return;
      }

      await axios.put(
        `${BASE_URL}/api/users/updatePassword`,
        {password: newPassword},
        {headers: {Authorization: `Bearer ${token}`}},
      );

      Alert.alert('Success', 'Password updated successfully.');
      setEditPasswordModalVisible(false);
      setNewPassword('');
    } catch (error) {
      console.error('Password update error:', error);
      Alert.alert('Error', 'Failed to update password.');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00875A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
     <View style={styles.row}>
     <TouchableOpacity
        style={styles.backbtn}
        onPress={() => navigation.goBack()}>
        <MaterialIcons name="chevron-left" size={30} color="black" />
      </TouchableOpacity>

      {/* Logout Icon */}
      <TouchableOpacity style={styles.backbtn} onPress={handleLogout}>
        <MaterialIcons name="logout" size={25} color="black" />
      </TouchableOpacity>

     </View>
      {/* Profile Picture */}
      <View style={styles.profileImageContainer}>
        <View style={styles.profileCircle}>
          <Icon name="account" size={60} color="#ccc" />
          <TouchableOpacity style={styles.addIcon}>
            <MaterialIcons name="add-circle" size={20} color="#11b881" />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>{userName}</Text>
      </View>

      {/* Profile Details Card */}
      <View style={styles.profileCard}>
        <Text style={styles.profileDetailsTitle}>Profile Details</Text>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Email :</Text>
          <Text style={styles.value}>{email}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Password :</Text>
          <Text style={styles.value}>**********</Text>
          <TouchableOpacity onPress={() => setEditPasswordModalVisible(true)}>
            <MaterialIcons name="edit" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* View Bookings Button */}
      <TouchableOpacity
        style={styles.bookingsButton}
        onPress={() => navigation.navigate('MyBookings')}>
        <Text style={styles.bookingsButtonText}>View My Bookings</Text>
        <MaterialIcons
          name="event"
          size={20}
          color="white"
          style={{marginLeft: 8}}
        />
      </TouchableOpacity>

      {/* Edit Password Modal */}
      <Modal
        visible={editPasswordModalVisible}
        transparent
        animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter new password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handlePasswordUpdate}>
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, {backgroundColor: '#ccc'}]}
                onPress={() => {
                  setEditPasswordModalVisible(false);
                  setNewPassword('');
                }}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3fcee',
    padding: 20,
    position: 'relative',
  },
  row:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backbtn: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 5
  },

  profileImageContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  profileCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: '#FFFF',
    borderWidth: 3,
    backgroundColor: '#ebebea',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  addIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  userName: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  profileCard: {
    marginTop: 30,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '100%',

    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
    elevation: 5,
  },
  profileDetailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    color: 'black',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    fontWeight: 'bold',
    width: 80,
    color: '#333',
  },
  value: {
    flex: 1,
    color: '#666',
  },
  bookingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059768',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginTop: 30,
    alignSelf: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  bookingsButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#7CA879',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default ProfileScreen;
