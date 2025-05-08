import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {BlurView} from '@react-native-community/blur';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types';

const BookingReceipt = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
      
    const handleNext = () => {
      navigation.navigate('Dashboard', {
        screen: 'Profile',
      });
    };
    
  return (
    <ImageBackground
      source={require('../../assets/img/bg.jpg')}
      style={styles.bgImgContainer}>
     

      <View style={styles.container}>
        <Text style={styles.title}>Thank you for your booking</Text>
        <Icon name="check-circle" size={60} color="green" style={styles.icon} />
        <Text style={styles.subtitle}>Your transaction was successful..!</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Vehicle</Text>
          <Text style={styles.value}>BMW i7 - 4 Wheeler - CCS2 Type</Text>

          <View style={styles.row}>
            <View>
              <Text style={styles.label}>Date</Text>
              <Text style={styles.value}>25 Sept 2023</Text>
            </View>
            <View>
              <Text style={styles.label}>Time</Text>
              <Text style={styles.value}>11:50 PM</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View>
              <Text style={styles.label}>Booking ID</Text>
              <Text style={styles.value}>CHPI2658789OP</Text>
            </View>
            <View>
              <Text style={styles.label}>Amount paid</Text>
              <Text style={styles.value}>Rs. 150</Text>
            </View>
          </View>

          <Text style={styles.label}>Payment method</Text>
          <Text style={styles.value}>
            <Icon name="credit-card" size={18} color="#1a73e8" /> VISA Credit
            card **59
          </Text>
        </View>

        <TouchableOpacity onPress={handleNext} style={styles.button}>
          <Text style={styles.buttonText}>Continue to Home</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bgImgContainer: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 30,
   
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  icon: {
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#059768',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    width: '90%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    elevation: 3,
  },
  label: {
    fontSize: 14,
    color: 'gray',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#059768',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookingReceipt;
