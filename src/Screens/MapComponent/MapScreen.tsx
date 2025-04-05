import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, PermissionsAndroid, Platform, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';

const TOMTOM_API_KEY = 'UkAy5vXjPlyFW09VQYsnbG1PJvnMxN5B';

interface Location {
  latitude: number;
  longitude: number;
}

interface ChargingStation {
  id: string;
  name: string;
  address: string;
  position: {
    lat: number;
    lon: number;
  };
  connectors: {
    connectorType: string;
    ratedPowerKW: number;
  }[];
}

const MapScreen: React.FC = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [chargingStations, setChargingStations] = useState<ChargingStation[]>([]);
  const [selectedStation, setSelectedStation] = useState<ChargingStation | null>(null);

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
      const response = await axios.get(
        `https://api.tomtom.com/search/2/poiSearch/charging%20station.json`,
        {
          params: {
            key: TOMTOM_API_KEY,
            lat: latitude,
            lon: longitude,
            radius: 10000,
          },
        }
      );

      if (response.data.results) {
        const stations = response.data.results.map((station: any) => ({
          id: station.id,
          name: station.poi.name,
          address: station.address.freeformAddress.split(',')[0],
          position: station.position,
          connectors: station.chargingPark?.connectors || [],
        }));
        setChargingStations(stations);
      } else {
        console.warn('No charging stations found.');
      }
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
              coordinate={{ latitude: station.position.lat, longitude: station.position.lon }}
              title={station.name}
              onPress={() => setSelectedStation(station)}
            />
          ))}
        </MapView>
      ) : (
        <Text>Fetching location...</Text>
      )}

      {selectedStation && (
        <View style={styles.infoCard}>
          <Text style={styles.stationName}>{selectedStation.name}</Text>
          <Text style={styles.stationAddress}>{selectedStation.address}</Text>
          {selectedStation.connectors.length > 0 && (
            <Text style={styles.connectorInfo}>
              {`Type: ${selectedStation.connectors[0].connectorType}, Power: ${selectedStation.connectors[0].ratedPowerKW} kW`}
            </Text>
          )}
        </View>
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
  infoCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    elevation: 5,
  },
  stationName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  stationAddress: {
    fontSize: 14,
    color: 'gray',
  },
  connectorInfo: {
    fontSize: 12,
    marginTop: 5,
  },
});

export default MapScreen;
