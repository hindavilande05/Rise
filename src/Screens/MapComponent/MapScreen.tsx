import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, PermissionsAndroid, Platform, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';


const GO_MAPS_API_KEY = 'AlzaSyctPPvnwKRxmRIvqYVD_UuQMm7VUfLkfhL';


interface Location {
  latitude: number;
  longitude: number;
}

interface ChargingStation {
  id: string;
  name: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
} 
const MapScreen: React.FC = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [chargingStations, setChargingStations] = useState<ChargingStation[]>([]);


  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message: 'This app needs access to your location',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Permission to access location was denied');
            Alert.alert('Permission Denied', 'Permission to access location was denied');
            return;
          }
        } catch (err) {
          console.warn(err);
          Alert.alert('Permission Error', 'An error occurred while requesting location permission');
          return;
        }
      }

      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          fetchChargingStations(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          Alert.alert('Error', `Error getting location: ${error.message}`);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    };

    requestLocationPermission();
  }, []);

   const fetchChargingStations = async (latitude: number, longitude: number) => {
    try {
      const response = await axios.get(`https://maps.gomaps.pro/maps/api/place/nearbysearch/json`, {
        params: {
          location: `${latitude},${longitude}`,
          radius: 5000,
          type: 'electric_vehicle_charging_station',
          key: GO_MAPS_API_KEY,
        },
      });

      if (response.data.status === 'REQUEST_DENIED') {
        console.error('Error fetching charging stations:', response.data.error_message);
        Alert.alert('Error', `Error fetching charging stations: ${response.data.error_message}`);
        return;
      }

      setChargingStations(response.data.results);
    } catch (error) {
      console.error('Error fetching charging stations:', error);
      Alert.alert('Error', 'Error fetching charging stations');
    }
  };

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title={'Your Location'}
            pinColor="blue"
          />

           {chargingStations.map((station) => (
            <Marker
              key={station.id}
              coordinate={{ latitude: station.geometry.location.lat, longitude: station.geometry.location.lng }}
              title={station.name}
            />
          ))}
        </MapView>
      ) : (
        <Text>Fetching location...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapScreen;