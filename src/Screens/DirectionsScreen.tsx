import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';

interface RouteParams {
  startLocation: { latitude: number; longitude: number };
  endLocation: { latitude: number; longitude: number };
}

const GOOGLE_MAPS_API_KEY = 'AIzaSyDjUzgFPSpgkjelqcBAl4-bz6zryQVYgZQ';

const DirectionsScreen = () => {

  
  const route = useRoute();
  const { startLocation, endLocation } = route.params as RouteParams;
  const [routeCoordinates, setRouteCoordinates] = useState<{ latitude: number; longitude: number }[]>([]);

  useEffect(() => {
    const fetchRoute = async () => {
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${startLocation.latitude},${startLocation.longitude}&destination=${endLocation.latitude},${endLocation.longitude}&key=${GOOGLE_MAPS_API_KEY}`;
      
      try {
        const response = await axios.get(url);
        if (response.data.routes.length > 0) {
          const points = response.data.routes[0].overview_polyline.points;
          setRouteCoordinates(decodePolyline(points));
        }
      } catch (error) {
        console.error('Error fetching directions:', error);
      }
    };

    fetchRoute();
  }, [startLocation, endLocation]);

  const decodePolyline = (encoded: string) => {
    let index = 0, len = encoded.length;
    let lat = 0, lng = 0;
    const coordinates = [];

    while (index < len) {
      let shift = 0, result = 0, byte;
      do {
        byte = encoded.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);
      lat += (result & 1 ? ~(result >> 1) : (result >> 1));
      shift = 0;
      result = 0;
      do {
        byte = encoded.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);
      lng += (result & 1 ? ~(result >> 1) : (result >> 1));
      coordinates.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }
    return coordinates;
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: (startLocation.latitude + endLocation.latitude) / 2,
          longitude: (startLocation.longitude + endLocation.longitude) / 2,
          latitudeDelta: Math.abs(startLocation.latitude - endLocation.latitude) * 2,
          longitudeDelta: Math.abs(startLocation.longitude - endLocation.longitude) * 2,
        }}>
        <Marker coordinate={startLocation} title="Start" />
        <Marker coordinate={endLocation} title="Destination" />
        {routeCoordinates.length > 0 && (
          <Polyline coordinates={routeCoordinates} strokeWidth={4} strokeColor="blue" />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default DirectionsScreen;
