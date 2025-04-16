import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { RootStackParamList } from '../types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type MapScreenRouteProp = RouteProp<RootStackParamList, 'MapViewScreen'>;
type NavProp = NativeStackNavigationProp<RootStackParamList, 'MapViewScreen'>;

const MapViewScreen = () => {
  const route = useRoute<MapScreenRouteProp>();
  const navigation = useNavigation<NavProp>();
  const { routeCoords, start, dest, chargingStations } = route.params;

  const mapViewRef = useRef<MapView>(null);

  const latitudes = [start.lat, dest.lat];
  const longitudes = [start.lon, dest.lon];

  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLon = Math.min(...longitudes);
  const maxLon = Math.max(...longitudes);

  const initialRegion = {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLon + maxLon) / 2,
    latitudeDelta: Math.abs(maxLat - minLat) * 1.5,
    longitudeDelta: Math.abs(maxLon - minLon) * 1.5,
  };

  useEffect(() => {
    if (mapViewRef.current) {
      mapViewRef.current.animateToRegion(initialRegion, 1000);
    }
  }, [initialRegion]);

  useEffect(() => {
    if (!routeCoords || routeCoords.length === 0) {
      console.error('Route coordinates are empty!');
    }
  }, [routeCoords]);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        ref={mapViewRef}
        initialRegion={initialRegion}
        showsUserLocation={true}
      >
        {/* Start Marker */}
        <Marker
          coordinate={{ latitude: start.lat, longitude: start.lon }}
          title="Start"
          pinColor="green"
        />

        {/* Destination Marker */}
        <Marker
          coordinate={{ latitude: dest.lat, longitude: dest.lon }}
          title="Destination"
          pinColor="red"
        />

        {/* Route Polyline */}
        <Polyline
          coordinates={routeCoords}
          strokeColor="#0000FF"
          strokeWidth={4}
        />

        {/* Charging Stations */}
        {chargingStations?.map((station, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: station.position.lat,
              longitude: station.position.lon,
            }}
            title={station.poi?.name || 'EV Charging Station'}
            description={station.address?.freeformAddress}
            pinColor="#FFD700" 
          />
        ))}
      </MapView>

      <View style={styles.buttonContainer}>
        <Button title="🔙 Back" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    elevation: 5,
  },
});

export default MapViewScreen;
